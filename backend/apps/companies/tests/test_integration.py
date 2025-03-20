from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from apps.companies.models import Organization
from apps.internships.models import Internship
from datetime import datetime, timedelta

User = get_user_model()

class CompanyInternshipIntegrationTest(APITestCase):
    def setUp(self):
        # Create users
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        
        self.company_user = User.objects.create_user(
            username='company',
            email='company@example.com',
            password='company123'
        )
        
        self.student_user = User.objects.create_user(
            username='student',
            email='student@example.com',
            password='student123',
            user_type='student'
        )
        
        # Create organization
        self.organization = Organization.objects.create(
            name='Test Company',
            description='Test Description',
            website='http://test.com',
            contact_person=self.company_user,
            is_active=True
        )
        
        # Create internship
        self.internship = Internship.objects.create(
            organization=self.organization,
            student=self.student_user,
            title='Test Internship',
            description='Test Description',
            start_date=datetime.now().date(),
            end_date=(datetime.now() + timedelta(days=90)).date(),
            status='active'
        )
        
        self.client = APIClient()

    def test_company_internship_workflow(self):
        """Test complete company-internship workflow"""
        # 1. Company user login and get organization details
        self.client.force_authenticate(user=self.company_user)
        org_response = self.client.get(
            reverse('organization-detail', args=[self.organization.id])
        )
        self.assertEqual(org_response.status_code, status.HTTP_200_OK)
        
        # 2. Get company's internships
        internships_response = self.client.get(
            reverse('internship-list') + f'?organization={self.organization.id}'
        )
        self.assertEqual(internships_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(internships_response.data), 1)
        
        # 3. Update internship status
        update_response = self.client.patch(
            reverse('internship-detail', args=[self.internship.id]),
            {'status': 'completed'}
        )
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data['status'], 'completed')
        
        # 4. Student can view their internship
        self.client.force_authenticate(user=self.student_user)
        student_response = self.client.get(
            reverse('internship-detail', args=[self.internship.id])
        )
        self.assertEqual(student_response.status_code, status.HTTP_200_OK)
        
        # 5. Admin can view all internships
        self.client.force_authenticate(user=self.admin_user)
        admin_response = self.client.get(reverse('internship-list'))
        self.assertEqual(admin_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(admin_response.data), 1)

    def test_permission_workflow(self):
        """Test permission-based access control"""
        # 1. Unauthenticated user cannot access
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('organization-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # 2. Student cannot modify company
        self.client.force_authenticate(user=self.student_user)
        response = self.client.patch(
            reverse('organization-detail', args=[self.organization.id]),
            {'name': 'Hacked Company'}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # 3. Company user can modify their own organization
        self.client.force_authenticate(user=self.company_user)
        response = self.client.patch(
            reverse('organization-detail', args=[self.organization.id]),
            {'name': 'Updated Company'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 4. Admin can modify any organization
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(
            reverse('organization-detail', args=[self.organization.id]),
            {'name': 'Admin Updated Company'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_rate_limiting_workflow(self):
        """Test rate limiting across different user types"""
        # 1. Anonymous user rate limiting
        self.client.force_authenticate(user=None)
        for _ in range(25):  # More than burst_anon limit
            self.client.get(reverse('organization-list'))
        response = self.client.get(reverse('organization-list'))
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
        
        # 2. Authenticated user rate limiting
        self.client.force_authenticate(user=self.company_user)
        for _ in range(65):  # More than burst_user limit
            self.client.get(reverse('organization-list'))
        response = self.client.get(reverse('organization-list'))
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS) 