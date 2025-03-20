from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from apps.companies.models import Organization
from apps.companies.services import BatchProcessor
from unittest.mock import patch
import time

User = get_user_model()

class BatchProcessingTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Create test organizations
        self.organizations = []
        for i in range(250):  # Create more than BATCH_SIZE organizations
            org = Organization.objects.create(
                name=f'Test Company {i}',
                description=f'Test Description {i}',
                website=f'http://test{i}.com',
                contact_person=self.user,
                is_active=False
            )
            self.organizations.append(org)

    def test_batch_size_processing(self):
        """Test that organizations are processed in correct batch sizes"""
        org_ids = [org.id for org in self.organizations]
        
        stats = BatchProcessor.bulk_activate(org_ids)
        
        expected_batches = (len(org_ids) + BatchProcessor.BATCH_SIZE - 1) // BatchProcessor.BATCH_SIZE
        self.assertEqual(stats['batches_count'], expected_batches)
        self.assertEqual(stats['total_processed'], len(org_ids))
        self.assertEqual(stats['activated_count'], len(org_ids))
        self.assertEqual(len(stats['failed_ids']), 0)

    def test_partial_activation(self):
        """Test batch processing with some already active organizations"""
        # Activate some organizations
        for org in self.organizations[:50]:
            org.is_active = True
            org.save()
        
        org_ids = [org.id for org in self.organizations]
        stats = BatchProcessor.bulk_activate(org_ids)
        
        self.assertEqual(stats['activated_count'], len(self.organizations) - 50)

    @patch('apps.companies.services.WebhookService.send_webhook')
    def test_webhook_calls(self, mock_send):
        """Test that webhooks are called for each activated organization"""
        org_ids = [org.id for org in self.organizations[:5]]  # Test with small batch
        
        BatchProcessor.bulk_activate(org_ids)
        
        self.assertEqual(mock_send.call_count, len(org_ids))
        for call_args in mock_send.call_args_list:
            self.assertEqual(call_args[0][0], 'organization.activated')

    def test_error_handling(self):
        """Test error handling during batch processing"""
        # Create an invalid organization to trigger an error
        invalid_org = Organization.objects.create(
            name='Invalid Org',
            website='invalid-url',  # This should cause validation error
            contact_person=self.user,
            is_active=False
        )
        
        org_ids = [org.id for org in self.organizations[:5]] + [invalid_org.id]
        stats = BatchProcessor.bulk_activate(org_ids)
        
        self.assertIn(invalid_org.id, stats['failed_ids'])
        self.assertEqual(stats['activated_count'], 5)

    def test_transaction_atomicity(self):
        """Test that batch operations are atomic"""
        # Create an organization that will trigger an error
        error_org = Organization.objects.create(
            name='Error Org',
            website='http://error.com',
            contact_person=self.user,
            is_active=False
        )
        
        # Patch the save method to raise an exception
        def raise_error(self):
            raise ValueError("Test error")
        
        original_save = Organization.save
        Organization.save = raise_error
        
        try:
            # Process a batch with the error organization
            org_ids = [org.id for org in self.organizations[:5]] + [error_org.id]
            stats = BatchProcessor.bulk_activate(org_ids)
            
            # Check that the error was handled
            self.assertIn(error_org.id, stats['failed_ids'])
            
            # Check that other organizations in the batch were processed
            self.assertEqual(stats['activated_count'], 5)
        finally:
            # Restore the original save method
            Organization.save = original_save

class BatchProcessingAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        # Create test organizations
        self.organizations = []
        for i in range(150):
            org = Organization.objects.create(
                name=f'Test Company {i}',
                description=f'Test Description {i}',
                website=f'http://test{i}.com',
                contact_person=self.user,
                is_active=False
            )
            self.organizations.append(org)

    def test_bulk_activate_api(self):
        """Test bulk activation through API"""
        org_ids = [org.id for org in self.organizations]
        
        response = self.client.post(
            reverse('v2:organization-bulk-activate'),
            {'ids': org_ids},
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['details']['total_processed'], len(org_ids))
        self.assertEqual(response.data['details']['activated_count'], len(org_ids))
        self.assertIn('processing_time', response.data['details'])
        self.assertIn('batches_count', response.data['details'])

    def test_bulk_activate_performance(self):
        """Test performance of bulk activation"""
        org_ids = [org.id for org in self.organizations]
        
        start_time = time.time()
        response = self.client.post(
            reverse('v2:organization-bulk-activate'),
            {'ids': org_ids},
            format='json'
        )
        processing_time = time.time() - start_time
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertLess(processing_time, 5.0)  # Should process within 5 seconds

    def test_cache_invalidation(self):
        """Test that cache is properly invalidated after bulk activation"""
        # Populate cache
        self.client.get(reverse('v2:organization-list'))
        self.client.get(reverse('v2:organization-statistics'))
        
        # Perform bulk activation
        org_ids = [org.id for org in self.organizations[:5]]
        response = self.client.post(
            reverse('v2:organization-bulk-activate'),
            {'ids': org_ids},
            format='json'
        )
        
        # Verify cache was invalidated by checking timestamps
        list_response = self.client.get(reverse('v2:organization-list'))
        stats_response = self.client.get(reverse('v2:organization-statistics'))
        
        self.assertNotEqual(
            list_response.data['cached_at'],
            stats_response.data['cached_at']
        ) 