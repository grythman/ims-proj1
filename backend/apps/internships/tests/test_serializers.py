from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from apps.internships.models import Internship
from apps.internships.serializers import InternshipSerializer
from apps.companies.models import Organization

User = get_user_model()

class InternshipSerializerTest(TestCase):
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

        self.internship_attributes = {
            'student': self.student,
            'organization': self.organization,
            'title': 'Test Internship',
            'description': 'Test Description',
            'start_date': self.start_date,
            'end_date': self.end_date
        }
        self.internship = Internship.objects.create(**self.internship_attributes)
        self.serializer = InternshipSerializer(instance=self.internship)

    def test_contains_expected_fields(self):
        """Test serializer contains expected fields"""
        data = self.serializer.data
        self.assertEqual(set(data.keys()), {
            'id', 'student', 'organization', 'title', 'description',
            'start_date', 'end_date', 'status', 'created_at',
            'updated_at', 'mentor'
        })

    def test_title_field_content(self):
        """Test title field content"""
        data = self.serializer.data
        self.assertEqual(data['title'], self.internship_attributes['title'])

    def test_serializer_validation(self):
        """Test serializer validation"""
        data = {
            'student': self.student.id,
            'organization': self.organization.id,
            'title': '',  # Invalid: empty title
            'description': 'Test Description',
            'start_date': self.start_date,
            'end_date': self.end_date
        }
        serializer = InternshipSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(set(serializer.errors.keys()), {'title'}) 