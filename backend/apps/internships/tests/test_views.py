from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from apps.internships.models import Internship
from apps.companies.models import Organization
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class InternshipViewTest(TestCase):
    def setUp(self):
        # Create test user
        self.student = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Create test organization
        self.organization = Organization.objects.create(
            name='Test Company',
            description='Test Description',
            website='http://example.com'
        )

        # Set up common dates
        self.start_date = timezone.now().date()
        self.end_date = self.start_date + timedelta(days=90)

        self.client = APIClient()
        self.client.force_authenticate(user=self.student)

        self.internship = Internship.objects.create(
            student=self.student,
            organization=self.organization,
            title="Test Internship",
            description="Test Description",
            start_date=self.start_date,
            end_date=self.end_date
        )

    def test_internship_list_view(self):
        """Test internship list view"""
        response = self.client.get(reverse('internship-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Test Internship")

    def test_internship_detail_view(self):
        """Test internship detail view"""
        response = self.client.get(reverse('internship-detail', args=[self.internship.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Test Internship")

    def test_internship_create_view(self):
        """Test internship creation"""
        data = {
            'student': self.student.id,
            'organization': self.organization.id,
            'title': 'New Internship',
            'description': 'New Description',
            'start_date': self.start_date,
            'end_date': self.end_date
        }
        response = self.client.post(reverse('internship-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Internship.objects.count(), 2) 