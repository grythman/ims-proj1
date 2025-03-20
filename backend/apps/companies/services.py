import json
import hmac
import hashlib
import requests
import httpx
import asyncio
from django.conf import settings
from django.core.cache import cache
from django.db import transaction
from django.utils import timezone
from django.db.models import Q
from typing import List, Dict, Any, Optional
from .models import WebhookEndpoint, Organization, WebhookDelivery
import logging
from asgiref.sync import sync_to_async

logger = logging.getLogger(__name__)

class BatchProcessor:
    """Service for handling batch operations on organizations"""
    
    BATCH_SIZE = 100  # Number of records to process in each batch
    
    @classmethod
    def bulk_activate(cls, organization_ids: List[int]) -> Dict[str, Any]:
        """
        Activate multiple organizations in batches
        Returns statistics about the operation
        """
        stats = {
            'total_processed': len(organization_ids),
            'activated_count': 0,
            'failed_ids': [],
            'batches_count': 0,
            'processing_time': 0
        }
        
        start_time = timezone.now()
        
        # Process in batches
        for i in range(0, len(organization_ids), cls.BATCH_SIZE):
            batch_ids = organization_ids[i:i + cls.BATCH_SIZE]
            batch_stats = cls._process_activation_batch(batch_ids)
            
            # Update statistics
            stats['activated_count'] += batch_stats['activated']
            stats['failed_ids'].extend(batch_stats['failed_ids'])
            stats['batches_count'] += 1
        
        stats['processing_time'] = (timezone.now() - start_time).total_seconds()
        return stats
    
    @classmethod
    @transaction.atomic
    def _process_activation_batch(cls, batch_ids: List[int]) -> Dict[str, Any]:
        """Process a single batch of organization activations"""
        batch_stats = {
            'activated': 0,
            'failed_ids': []
        }
        
        # Get organizations in this batch
        organizations = Organization.objects.filter(
            id__in=batch_ids,
            is_active=False
        ).select_for_update()
        
        for org in organizations:
            try:
                org.is_active = True
                org.save()
                batch_stats['activated'] += 1
                
                # Clear cache for this organization
                cache_key = f"{settings.CACHE_KEY_PREFIX}:org:detail:{org.id}"
                cache.delete(cache_key)
                
                # Send webhook notification
                org_data = {
                    'id': org.id,
                    'name': org.name,
                    'website': org.website,
                    'is_active': True
                }
                WebhookService.send_webhook(
                    'organization.activated',
                    org_data,
                    org.id
                )
                
            except Exception as e:
                logger.error(f"Failed to activate organization {org.id}: {str(e)}")
                batch_stats['failed_ids'].append(org.id)
        
        return batch_stats

class WebhookService:
    @staticmethod
    def _generate_signature(payload: str, secret_key: str) -> str:
        """Generate HMAC signature for webhook payload"""
        return hmac.new(
            secret_key.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()

    @staticmethod
    def _prepare_payload(event_type: str, data: dict) -> dict:
        """Prepare webhook payload with metadata"""
        return {
            'event_type': event_type,
            'data': data,
            'timestamp': timezone.now().isoformat()
        }

    @classmethod
    def send_webhook(cls, event_type: str, data: dict, organization_id: int = None):
        """Queue webhook delivery for all registered endpoints"""
        # Get active webhook endpoints
        endpoints = WebhookEndpoint.objects.filter(is_active=True)
        if organization_id:
            endpoints = endpoints.filter(
                Q(organization_id=organization_id) | 
                Q(organization_id__isnull=True)
            )

        payload = cls._prepare_payload(event_type, data)

        for endpoint in endpoints:
            # Check if endpoint subscribes to this event
            if event_type not in endpoint.events:
                continue

            # Create delivery record
            delivery = WebhookDelivery.objects.create(
                webhook=endpoint,
                event_type=event_type,
                payload=payload,
                status='pending'
            )

            # Queue delivery task
            from .tasks import send_webhook
            send_webhook.delay(delivery.id)

    @staticmethod
    def _send_with_retry(url: str, payload: str, headers: dict, max_retries: int = 3):
        """Send webhook with retry mechanism"""
        for attempt in range(max_retries):
            try:
                response = requests.post(
                    url,
                    data=payload,
                    headers=headers,
                    timeout=5
                )
                response.raise_for_status()
                logger.info(f"Webhook sent successfully to {url}")
                return
            except requests.exceptions.RequestException as e:
                logger.error(f"Webhook delivery failed to {url}: {str(e)}")
                if attempt == max_retries - 1:
                    # TODO: Store failed webhook for retry later
                    logger.error(f"Max retries reached for webhook to {url}")
                continue 

class AsyncWebhookService:
    """Asynchronous service for handling webhook deliveries"""
    
    @staticmethod
    async def _generate_signature(payload: str, secret_key: str) -> str:
        """Generate HMAC signature for webhook payload"""
        return hmac.new(
            secret_key.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()

    @staticmethod
    def _prepare_payload(event_type: str, data: dict) -> dict:
        """Prepare webhook payload with metadata"""
        return {
            'event_type': event_type,
            'data': data,
            'timestamp': timezone.now().isoformat()
        }

    @classmethod
    async def send_webhook(cls, event_type: str, data: dict, organization_id: Optional[int] = None):
        """Send webhooks asynchronously to all registered endpoints"""
        # Get active webhook endpoints
        endpoints = await sync_to_async(list)(
            WebhookEndpoint.objects.filter(is_active=True)
        )
        
        if organization_id:
            endpoints = [
                ep for ep in endpoints 
                if ep.organization_id is None or ep.organization_id == organization_id
            ]

        payload = cls._prepare_payload(event_type, data)
        payload_str = json.dumps(payload)
        
        # Create delivery records and queue tasks
        for endpoint in endpoints:
            if event_type not in endpoint.events:
                continue
                
            delivery = await sync_to_async(WebhookDelivery.objects.create)(
                webhook=endpoint,
                event_type=event_type,
                payload=payload_str,  # Store JSON string
                status='pending'
            )
            
            # Queue delivery task
            from .tasks import send_webhook
            send_webhook.delay(delivery.id)

    @classmethod
    async def _send_webhook(
        cls, 
        client: Optional[httpx.AsyncClient],
        delivery: WebhookDelivery,
        payload: str,
        retry_count: int = 0
    ):
        """Send a single webhook with retry mechanism"""
        if client is None:
            client = httpx.AsyncClient()
            
        try:
            # Generate signature
            signature = await cls._generate_signature(
                payload,
                delivery.webhook.secret_key
            )

            # Prepare headers
            headers = {
                'Content-Type': 'application/json',
                'X-Webhook-Signature': signature,
                'X-Event-Type': delivery.event_type
            }

            # Send request
            response = await client.post(
                delivery.webhook.url,
                json=json.loads(payload),
                headers=headers,
                timeout=settings.WEBHOOK_TIMEOUT
            )
            
            # Update delivery record
            if response.is_success:
                await sync_to_async(cls._update_delivery_success)(
                    delivery,
                    response.status_code,
                    response.text
                )
                return True
            else:
                raise httpx.RequestError(f"HTTP {response.status_code}: {response.text}")

        except (httpx.RequestError, asyncio.TimeoutError) as e:
            # Handle retry
            if retry_count < settings.WEBHOOK_MAX_RETRIES:
                await asyncio.sleep(
                    settings.WEBHOOK_RETRY_DELAY * (2 ** retry_count)
                )
                return await cls._send_webhook(
                    client,
                    delivery,
                    payload,
                    retry_count + 1
                )
            else:
                await sync_to_async(cls._update_delivery_failure)(
                    delivery,
                    str(e),
                    retry_count
                )
                return False
        finally:
            if client is not None:
                await client.aclose()

    @staticmethod
    def _update_delivery_success(
        delivery: WebhookDelivery,
        status_code: int,
        response_text: str
    ):
        """Update delivery record for successful delivery"""
        delivery.status = 'success'
        delivery.response_status = status_code
        delivery.response_content = response_text[:1000]
        delivery.save()
        logger.info(f"Webhook delivered successfully: {delivery}")

    @staticmethod
    def _update_delivery_failure(
        delivery: WebhookDelivery,
        error_message: str,
        retry_count: int
    ):
        """Update delivery record for failed delivery"""
        delivery.status = 'failed'
        delivery.error_message = error_message
        delivery.retry_count = retry_count
        delivery.next_retry_at = timezone.now() + timezone.timedelta(
            seconds=settings.WEBHOOK_RETRY_DELAY * (2 ** retry_count)
        )
        delivery.save()
        logger.error(f"Max retries exceeded for webhook: {delivery}") 