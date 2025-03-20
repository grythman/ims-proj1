from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from apps.companies.models import Organization
from apps.companies.serializers import OrganizationSerializer
from django.core.cache import cache
from django.conf import settings

User = get_user_model()

@override_settings(
    CACHES={
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'unique-snowflake',
        }
    }
)
class OrganizationV2ViewSetTest(APITestCase):
    def setUp(self):
        cache.clear()  # Clear cache before each test
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        # Create test organizations
        self.org1 = Organization.objects.create(
            name='Test Company 1',
            description='Test Description 1',
            website='http://test1.com',
            contact_person=self.user,
            is_active=True
        )
        
        self.org2 = Organization.objects.create(
            name='Test Company 2',
            description='Test Description 2',
            website='http://test2.com',
            contact_person=self.user,
            is_active=False
        )
        
        # URLs
        self.list_url = reverse('v2:organization-list')
        self.detail_url = reverse('v2:organization-detail', args=[self.org1.id])
        self.statistics_url = reverse('v2:organization-statistics')
        self.bulk_activate_url = reverse('v2:organization-bulk-activate')

    def test_list_cache(self):
        """Test list view caching"""
        # First request - should hit the database
        response1 = self.client.get(self.list_url)
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertIn('cached_at', response1.data)
        
        # Second request - should hit the cache
        response2 = self.client.get(self.list_url)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response1.data['cached_at'], response2.data['cached_at'])

    def test_detail_cache(self):
        """Test detail view caching"""
        # First request - should hit the database
        response1 = self.client.get(self.detail_url)
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertIn('cached_at', response1.data)
        
        # Second request - should hit the cache
        response2 = self.client.get(self.detail_url)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response1.data['cached_at'], response2.data['cached_at'])

    def test_statistics_cache(self):
        """Test statistics endpoint caching"""
        # First request - should hit the database
        response1 = self.client.get(self.statistics_url)
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertIn('cached_at', response1.data)
        
        # Second request - should hit the cache
        response2 = self.client.get(self.statistics_url)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response1.data['cached_at'], response2.data['cached_at'])

    def test_cache_invalidation_on_update(self):
        """Test cache invalidation when updating an organization"""
        # Populate cache
        self.client.get(self.list_url)
        self.client.get(self.detail_url)
        self.client.get(self.statistics_url)
        
        # Update organization
        update_data = {'name': 'Updated Company'}
        response = self.client.patch(self.detail_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check if cache was invalidated
        response1 = self.client.get(self.list_url)
        response2 = self.client.get(self.list_url)
        self.assertNotEqual(response1.data['cached_at'], response2.data['cached_at'])

    def test_cache_invalidation_on_delete(self):
        """Test cache invalidation when deleting an organization"""
        # Populate cache
        self.client.get(self.list_url)
        self.client.get(self.statistics_url)
        
        # Delete organization
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Check if cache was invalidated
        response1 = self.client.get(self.list_url)
        response2 = self.client.get(self.list_url)
        self.assertNotEqual(response1.data['cached_at'], response2.data['cached_at'])

    def test_bulk_activate_cache_invalidation(self):
        """Test cache invalidation during bulk activation"""
        # Populate cache
        self.client.get(self.list_url)
        self.client.get(self.statistics_url)
        
        # Perform bulk activation
        data = {'ids': [self.org1.id, self.org2.id]}
        response = self.client.post(self.bulk_activate_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check if cache was invalidated
        response1 = self.client.get(self.list_url)
        response2 = self.client.get(self.list_url)
        self.assertNotEqual(response1.data['cached_at'], response2.data['cached_at'])

    def test_list_with_statistics(self):
        """Test getting list with statistics"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('statistics', response.data)
        self.assertEqual(response.data['statistics']['total_count'], 2)
        self.assertEqual(response.data['statistics']['active_count'], 1)
        self.assertEqual(response.data['statistics']['inactive_count'], 1)

    def test_filtering(self):
        """Test V2 filtering options"""
        # Test name filter
        response = self.client.get(self.list_url + '?name=Company 1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
        # Test is_active filter
        response = self.client.get(self.list_url + '?is_active=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_bulk_activate(self):
        """Test bulk activation"""
        data = {'ids': [self.org1.id, self.org2.id]}
        response = self.client.post(self.bulk_activate_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['details']['activated_count'], 1)
        self.assertEqual(response.data['details']['total_processed'], 2)
        
        # Verify both organizations are now active
        self.org2.refresh_from_db()
        self.assertTrue(self.org2.is_active)

    def test_statistics_endpoint(self):
        """Test statistics endpoint"""
        response = self.client.get(self.statistics_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_organizations'], 2)
        self.assertEqual(response.data['active_organizations'], 1)
        self.assertEqual(response.data['inactive_organizations'], 1)
        self.assertIn('organizations_by_domain', response.data)
        
        # Test domain statistics
        domain_stats = response.data['organizations_by_domain']
        self.assertEqual(domain_stats['test1.com'], 1)
        self.assertEqual(domain_stats['test2.com'], 1)

    def test_enhanced_activate_response(self):
        """Test enhanced activate endpoint response"""
        self.org1.is_active = False
        self.org1.save()
        
        response = self.client.post(
            reverse('v2:organization-activate', args=[self.org1.id])
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertIn('details', response.data)
        self.assertEqual(response.data['details']['previous_state'], False)
        self.assertEqual(response.data['details']['current_state'], True) 