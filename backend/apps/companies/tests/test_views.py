from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from apps.companies.models import Organization
from apps.companies.serializers import OrganizationSerializer

User = get_user_model()

class OrganizationViewSetTest(APITestCase):
    def setUp(self):
        # Create test user and get token
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        # Create test organization
        self.organization = Organization.objects.create(
            name='Test Company',
            description='Test Description',
            website='http://test.com',
            contact_person=self.user,
            is_active=True
        )
        
        # URLs
        self.list_url = reverse('organization-list')
        self.detail_url = reverse('organization-detail', args=[self.organization.id])
        self.activate_url = reverse('organization-activate', args=[self.organization.id])

    def test_get_organization_list(self):
        """Test getting list of organizations"""
        response = self.client.get(self.list_url)
        organizations = Organization.objects.all()
        serializer = OrganizationSerializer(organizations, many=True)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_get_organization_detail(self):
        """Test getting organization detail"""
        response = self.client.get(self.detail_url)
        serializer = OrganizationSerializer(self.organization)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_create_organization(self):
        """Test creating organization"""
        data = {
            'name': 'New Company',
            'description': 'New Description',
            'website': 'http://new.com',
        }
        response = self.client.post(self.list_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Organization.objects.count(), 2)
        self.assertEqual(Organization.objects.get(name='New Company').description, 'New Description')

    def test_update_organization(self):
        """Test updating organization"""
        data = {
            'name': 'Updated Company',
            'description': 'Updated Description',
            'website': 'http://updated.com',
        }
        response = self.client.put(self.detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.organization.refresh_from_db()
        self.assertEqual(self.organization.name, 'Updated Company')

    def test_delete_organization(self):
        """Test deleting organization"""
        response = self.client.delete(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Organization.objects.count(), 0)

    def test_activate_organization(self):
        """Test activating organization"""
        self.organization.is_active = False
        self.organization.save()
        
        response = self.client.post(self.activate_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.organization.refresh_from_db()
        self.assertTrue(self.organization.is_active)

    def test_unauthorized_access(self):
        """Test unauthorized access"""
        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_rate_limiting(self):
        """Test rate limiting"""
        # Make multiple requests quickly
        for _ in range(30):  # More than burst_user limit
            self.client.get(self.list_url)
        
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS) 