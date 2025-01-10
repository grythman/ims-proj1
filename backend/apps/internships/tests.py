from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Internship, Report
from apps.companies.models import Organization

# Create your tests here.

class InternshipTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.organization = Organization.objects.create(
            name='Test Org',
            description='Test Description'
        )
        
    def test_create_internship(self):
        internship = Internship.objects.create(
            student=self.user,
            organization=self.organization,
            title='Test Internship',
            description='Test Description',
            start_date='2024-01-01',
            end_date='2024-06-30'
        )
        self.assertEqual(internship.status, 'pending')
        self.assertEqual(str(internship), f"Test Internship - {self.user.get_full_name()}")
