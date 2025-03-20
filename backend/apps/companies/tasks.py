import json
from celery import shared_task
from django.utils import timezone
from .models import WebhookDelivery
from .services import AsyncWebhookService
from asgiref.sync import async_to_sync
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def send_webhook(self, delivery_id: int):
    """Send webhook delivery asynchronously"""
    try:
        delivery = WebhookDelivery.objects.get(id=delivery_id)
        
        # Convert stored text payload back to dict
        payload_dict = json.loads(delivery.payload)
        
        # Send webhook asynchronously
        async_to_sync(AsyncWebhookService._send_webhook)(
            client=None,  # Will be created in the service
            delivery=delivery,
            payload=json.dumps(payload_dict)
        )
        
        return True
        
    except WebhookDelivery.DoesNotExist:
        logger.error(f"Webhook delivery {delivery_id} not found")
        return False
        
    except Exception as e:
        logger.error(f"Error sending webhook {delivery_id}: {str(e)}")
        raise self.retry(exc=e)

@shared_task
def retry_failed_webhooks():
    """Retry failed webhook deliveries that are due"""
    now = timezone.now()
    
    # Get failed deliveries that are due for retry
    deliveries = WebhookDelivery.objects.filter(
        status='failed',
        next_retry_at__lte=now,
        retry_count__lt=3
    )
    
    retry_count = 0
    for delivery in deliveries:
        send_webhook.delay(delivery.id)
        retry_count += 1
        
    return retry_count 