from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from apps.internships.models import Internship
from apps.companies.models import Organization

User = get_user_model()

class InternshipModelTest(TestCase):
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

    def test_internship_creation(self):
        """Test internship creation with default status"""
        internship = Internship.objects.create(
            student=self.student,
            organization=self.organization,
            title="Backend Developer Internship",
            description="Python/Django development internship",
            start_date=self.start_date,
            end_date=self.end_date
        )
        self.assertEqual(internship.status, 0)  # STATUS_PENDING
        self.assertEqual(internship.title, "Backend Developer Internship")

    def test_internship_status_update(self):
        """Test internship status update"""
        internship = Internship.objects.create(
            student=self.student,
            organization=self.organization,
            title="Frontend Developer Internship",
            description="React/TypeScript development internship",
            start_date=self.start_date,
            end_date=self.end_date
        )
        internship.status = 1  # STATUS_ACTIVE
        internship.save()
        self.assertEqual(internship.status, 1)

    def test_internship_str_representation(self):
        """Test internship string representation"""
        internship = Internship.objects.create(
            student=self.student,
            organization=self.organization,
            title="Full Stack Developer Internship",
            description="Full stack development internship",
            start_date=self.start_date,
            end_date=self.end_date
        )
        expected_str = f"{self.student.get_full_name()}'s internship at {self.organization.name}"
        self.assertEqual(str(internship), expected_str) 