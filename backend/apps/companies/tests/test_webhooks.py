from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from apps.companies.models import Organization, WebhookEndpoint, WebhookDelivery
from apps.companies.services import WebhookService
from unittest.mock import patch, MagicMock
import json
import hmac
import hashlib
from datetime import timezone, timedelta
from django.conf import settings
import pytest
import httpx
from asgiref.sync import sync_to_async
from ..services import AsyncWebhookService

User = get_user_model()

class WebhookServiceTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.organization = Organization.objects.create(
            name='Test Company',
            description='Test Description',
            website='http://test.com',
            contact_person=self.user,
            is_active=True
        )
        
        self.webhook = WebhookEndpoint.objects.create(
            name='Test Webhook',
            url='http://test-webhook.com/endpoint',
            secret_key='test-secret-key',
            events=['organization.created', 'organization.updated'],
            is_active=True
        )

    def test_generate_signature(self):
        """Test HMAC signature generation"""
        payload = '{"test": "data"}'
        secret = 'test-secret'
        
        signature = WebhookService._generate_signature(payload, secret)
        
        expected = hmac.new(
            secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        self.assertEqual(signature, expected)

    @patch('requests.post')
    def test_webhook_delivery(self, mock_post):
        """Test webhook delivery with mocked HTTP request"""
        # Setup mock
        mock_post.return_value = MagicMock(status_code=200)
        
        # Trigger webhook
        data = {'id': 1, 'name': 'Test'}
        WebhookService.send_webhook('organization.created', data)
        
        # Verify HTTP request
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        
        # Verify URL
        self.assertEqual(args[0], self.webhook.url)
        
        # Verify headers
        headers = kwargs['headers']
        self.assertEqual(headers['Content-Type'], 'application/json')
        self.assertEqual(headers['X-Event-Type'], 'organization.created')
        self.assertIn('X-Webhook-Signature', headers)

    @patch('requests.post')
    def test_webhook_retry_mechanism(self, mock_post):
        """Test webhook retry mechanism"""
        # Setup mock to fail twice then succeed
        mock_post.side_effect = [
            requests.exceptions.RequestException(),
            requests.exceptions.RequestException(),
            MagicMock(status_code=200)
        ]
        
        # Trigger webhook
        data = {'id': 1, 'name': 'Test'}
        WebhookService.send_webhook('organization.created', data)
        
        # Verify three attempts were made
        self.assertEqual(mock_post.call_count, 3)

    def test_webhook_event_filtering(self):
        """Test that webhooks only receive subscribed events"""
        # Create webhook that only subscribes to updates
        webhook = WebhookEndpoint.objects.create(
            name='Update Only Webhook',
            url='http://test-webhook.com/updates',
            secret_key='test-secret-key',
            events=['organization.updated'],
            is_active=True
        )
        
        with patch('requests.post') as mock_post:
            # Send create event
            WebhookService.send_webhook('organization.created', {'id': 1})
            # Verify webhook was not called
            mock_post.assert_not_called()
            
            # Send update event
            WebhookService.send_webhook('organization.updated', {'id': 1})
            # Verify webhook was called
            mock_post.assert_called_once()

    def test_organization_specific_webhook(self):
        """Test organization-specific webhook delivery"""
        # Create organization-specific webhook
        org_webhook = WebhookEndpoint.objects.create(
            name='Org Specific Webhook',
            url='http://test-webhook.com/org',
            secret_key='test-secret-key',
            events=['organization.updated'],
            is_active=True,
            organization=self.organization
        )
        
        with patch('requests.post') as mock_post:
            # Send event for different organization
            WebhookService.send_webhook(
                'organization.updated',
                {'id': 999},
                organization_id=999
            )
            # Verify webhook was not called
            mock_post.assert_not_called()
            
            # Send event for correct organization
            WebhookService.send_webhook(
                'organization.updated',
                {'id': self.organization.id},
                organization_id=self.organization.id
            )
            # Verify webhook was called
            mock_post.assert_called_once()

@override_settings(CELERY_TASK_ALWAYS_EAGER=True)
class WebhookIntegrationTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        self.webhook = WebhookEndpoint.objects.create(
            name='Test Webhook',
            url='http://test-webhook.com/endpoint',
            secret_key='test-secret-key',
            events=['organization.created', 'organization.updated', 'organization.deleted'],
            is_active=True
        )

    @patch('apps.companies.services.WebhookService.send_webhook')
    def test_create_organization_webhook(self, mock_send):
        """Test webhook is triggered when creating organization"""
        data = {
            'name': 'New Company',
            'description': 'Test Description',
            'website': 'http://new.com',
            'contact_person': self.user.id
        }
        
        response = self.client.post(reverse('v2:organization-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify webhook was called with correct event
        mock_send.assert_called_once()
        args = mock_send.call_args[0]
        self.assertEqual(args[0], 'organization.created')

    @patch('apps.companies.services.WebhookService.send_webhook')
    def test_update_organization_webhook(self, mock_send):
        """Test webhook is triggered when updating organization"""
        org = Organization.objects.create(
            name='Test Company',
            description='Test Description',
            website='http://test.com',
            contact_person=self.user
        )
        
        data = {'name': 'Updated Company'}
        response = self.client.patch(
            reverse('v2:organization-detail', args=[org.id]),
            data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify webhook was called with correct event
        mock_send.assert_called_once()
        args = mock_send.call_args[0]
        self.assertEqual(args[0], 'organization.updated')

    @patch('apps.companies.services.WebhookService.send_webhook')
    def test_delete_organization_webhook(self, mock_send):
        """Test webhook is triggered when deleting organization"""
        org = Organization.objects.create(
            name='Test Company',
            description='Test Description',
            website='http://test.com',
            contact_person=self.user
        )
        
        response = self.client.delete(
            reverse('v2:organization-detail', args=[org.id])
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify webhook was called with correct event
        mock_send.assert_called_once()
        args = mock_send.call_args[0]
        self.assertEqual(args[0], 'organization.deleted')

@override_settings(CELERY_TASK_ALWAYS_EAGER=True)
class WebhookDeliveryTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.organization = Organization.objects.create(
            name='Test Company',
            description='Test Description',
            website='http://test.com',
            contact_person=self.user,
            is_active=True
        )
        
        self.webhook = WebhookEndpoint.objects.create(
            name='Test Webhook',
            url='http://test-webhook.com/endpoint',
            secret_key='test-secret-key',
            events=['organization.created', 'organization.updated'],
            is_active=True
        )

    @patch('requests.post')
    def test_webhook_delivery_success(self, mock_post):
        """Test successful webhook delivery"""
        mock_post.return_value.ok = True
        mock_post.return_value.status_code = 200
        mock_post.return_value.text = 'Success'

        # Send webhook
        data = {'id': 1, 'name': 'Test'}
        WebhookService.send_webhook('organization.created', data)

        # Check delivery record
        delivery = WebhookDelivery.objects.first()
        self.assertEqual(delivery.status, 'success')
        self.assertEqual(delivery.response_status, 200)
        self.assertEqual(delivery.retry_count, 0)

    @patch('requests.post')
    def test_webhook_delivery_retry(self, mock_post):
        """Test webhook delivery retry mechanism"""
        # Mock first attempt to fail, second to succeed
        mock_post.side_effect = [
            requests.exceptions.RequestException('Connection error'),
            type('Response', (), {'ok': True, 'status_code': 200, 'text': 'Success'})()
        ]

        # Send webhook
        data = {'id': 1, 'name': 'Test'}
        WebhookService.send_webhook('organization.created', data)

        # Check delivery record
        delivery = WebhookDelivery.objects.first()
        self.assertEqual(delivery.status, 'success')
        self.assertEqual(delivery.retry_count, 1)

    @patch('requests.post')
    def test_webhook_delivery_max_retries(self, mock_post):
        """Test webhook delivery max retries"""
        # Mock all attempts to fail
        mock_post.side_effect = requests.exceptions.RequestException('Connection error')

        # Send webhook
        data = {'id': 1, 'name': 'Test'}
        WebhookService.send_webhook('organization.created', data)

        # Check delivery record
        delivery = WebhookDelivery.objects.first()
        self.assertEqual(delivery.status, 'failed')
        self.assertEqual(delivery.retry_count, settings.WEBHOOK_MAX_RETRIES)
        self.assertIsNotNone(delivery.next_retry_at)

    def test_retry_failed_webhooks(self):
        """Test retry_failed_webhooks task"""
        # Create failed deliveries
        for i in range(3):
            WebhookDelivery.objects.create(
                webhook=self.webhook,
                event_type='organization.created',
                payload={'test': 'data'},
                status='failed',
                retry_count=1,
                next_retry_at=timezone.now() - timedelta(minutes=1)
            )

        # Run retry task
        from apps.companies.tasks import retry_failed_webhooks
        with patch('apps.companies.tasks.send_webhook.delay') as mock_send:
            retry_count = retry_failed_webhooks()
            self.assertEqual(retry_count, 3)
            self.assertEqual(mock_send.call_count, 3)

    def test_webhook_delivery_tracking(self):
        """Test webhook delivery tracking"""
        # Send webhook
        data = {'id': 1, 'name': 'Test'}
        WebhookService.send_webhook('organization.created', data)

        # Check delivery records
        deliveries = WebhookDelivery.objects.all()
        self.assertEqual(len(deliveries), 1)
        
        delivery = deliveries[0]
        self.assertEqual(delivery.event_type, 'organization.created')
        self.assertEqual(delivery.webhook, self.webhook)
        self.assertIn('timestamp', delivery.payload)
        self.assertIn('data', delivery.payload)

@pytest.mark.asyncio
class AsyncWebhookServiceTest(TestCase):
    """Test cases for async webhook delivery"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass'
        )
        self.organization = Organization.objects.create(
            name='Test Org',
            created_by=self.user
        )
        self.webhook = WebhookEndpoint.objects.create(
            name='Test Webhook',
            url='https://test.com/webhook',
            secret_key='test_secret',
            events=['organization.created', 'organization.updated'],
            organization=self.organization,
            is_active=True
        )

    async def test_generate_signature(self):
        """Test HMAC signature generation"""
        payload = json.dumps({'test': 'data'})
        signature = await AsyncWebhookService._generate_signature(
            payload,
            self.webhook.secret_key
        )
        expected = hmac.new(
            self.webhook.secret_key.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        assert signature == expected

    @patch('httpx.AsyncClient.post')
    async def test_webhook_delivery_success(self, mock_post):
        """Test successful webhook delivery"""
        mock_response = Mock()
        mock_response.is_success = True
        mock_response.status_code = 200
        mock_response.text = 'OK'
        mock_post.return_value = mock_response

        data = {'name': 'Test Org'}
        await AsyncWebhookService.send_webhook(
            'organization.created',
            data,
            self.organization.id
        )

        delivery = await sync_to_async(WebhookDelivery.objects.get)()
        assert delivery.status == 'success'
        assert delivery.response_status == 200
        assert delivery.response_content == 'OK'

    @patch('httpx.AsyncClient.post')
    async def test_webhook_delivery_retry(self, mock_post):
        """Test webhook retry mechanism"""
        # First attempt fails
        mock_post.side_effect = httpx.RequestError('Connection error')
        
        # Second attempt succeeds
        mock_response = Mock()
        mock_response.is_success = True
        mock_response.status_code = 200
        mock_response.text = 'OK'
        mock_post.side_effect = None
        mock_post.return_value = mock_response

        data = {'name': 'Test Org'}
        await AsyncWebhookService.send_webhook(
            'organization.created',
            data,
            self.organization.id
        )

        delivery = await sync_to_async(WebhookDelivery.objects.get)()
        assert delivery.status == 'success'
        assert delivery.retry_count == 1

    @patch('httpx.AsyncClient.post')
    async def test_webhook_delivery_max_retries(self, mock_post):
        """Test webhook max retries exceeded"""
        mock_post.side_effect = httpx.RequestError('Connection error')

        data = {'name': 'Test Org'}
        await AsyncWebhookService.send_webhook(
            'organization.created',
            data,
            self.organization.id
        )

        delivery = await sync_to_async(WebhookDelivery.objects.get)()
        assert delivery.status == 'failed'
        assert delivery.retry_count == 3
        assert 'Connection error' in delivery.error_message

    async def test_webhook_event_filtering(self):
        """Test webhook event type filtering"""
        # Create webhook that only listens for updates
        webhook = await sync_to_async(WebhookEndpoint.objects.create)(
            name='Update Only Webhook',
            url='https://test.com/webhook2',
            secret_key='test_secret2',
            events=['organization.updated'],
            organization=self.organization,
            is_active=True
        )

        data = {'name': 'Test Org'}
        await AsyncWebhookService.send_webhook(
            'organization.created',
            data,
            self.organization.id
        )

        # Verify no delivery was created for this webhook
        delivery_count = await sync_to_async(
            WebhookDelivery.objects.filter(webhook=webhook).count
        )()
        assert delivery_count == 0

class WebhookIntegrationTest(APITestCase):
    """Integration tests for webhook functionality"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass'
        )
        self.client.force_authenticate(user=self.user)
        
        self.webhook = WebhookEndpoint.objects.create(
            name='Test Webhook',
            url='https://test.com/webhook',
            secret_key='test_secret',
            events=['organization.created', 'organization.updated', 'organization.deleted'],
            is_active=True
        )

    @patch.object(AsyncWebhookService, 'send_webhook')
    def test_create_organization_webhook(self, mock_send_webhook):
        """Test webhook triggered on organization creation"""
        data = {'name': 'New Org'}
        response = self.client.post('/api/v2/organizations/', data)
        assert response.status_code == status.HTTP_201_CREATED
        
        mock_send_webhook.assert_called_once()
        args = mock_send_webhook.call_args[1]
        assert args['event_type'] == 'organization.created'
        assert args['data']['name'] == 'New Org'

    @patch.object(AsyncWebhookService, 'send_webhook')
    def test_update_organization_webhook(self, mock_send_webhook):
        """Test webhook triggered on organization update"""
        org = Organization.objects.create(
            name='Test Org',
            created_by=self.user
        )
        
        data = {'name': 'Updated Org'}
        response = self.client.patch(
            f'/api/v2/organizations/{org.id}/',
            data
        )
        assert response.status_code == status.HTTP_200_OK
        
        mock_send_webhook.assert_called_once()
        args = mock_send_webhook.call_args[1]
        assert args['event_type'] == 'organization.updated'
        assert args['data']['name'] == 'Updated Org'

    @patch.object(AsyncWebhookService, 'send_webhook')
    def test_delete_organization_webhook(self, mock_send_webhook):
        """Test webhook triggered on organization deletion"""
        org = Organization.objects.create(
            name='Test Org',
            created_by=self.user
        )
        
        response = self.client.delete(f'/api/v2/organizations/{org.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        mock_send_webhook.assert_called_once()
        args = mock_send_webhook.call_args[1]
        assert args['event_type'] == 'organization.deleted'
        assert args['data']['name'] == 'Test Org'

    @patch.object(AsyncWebhookService, 'send_webhook')
    def test_activate_organization_webhook(self, mock_send_webhook):
        """Test webhook triggered on organization activation"""
        org = Organization.objects.create(
            name='Test Org',
            created_by=self.user,
            is_active=False
        )
        
        response = self.client.post(f'/api/v2/organizations/{org.id}/activate/')
        assert response.status_code == status.HTTP_200_OK
        
        mock_send_webhook.assert_called_once()
        args = mock_send_webhook.call_args[1]
        assert args['event_type'] == 'organization.activated'
        assert args['data']['name'] == 'Test Org'
        assert args['data']['is_active'] is True 