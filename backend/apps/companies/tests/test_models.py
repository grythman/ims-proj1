from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.companies.models import Organization

User = get_user_model()

class OrganizationModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        cls.organization = Organization.objects.create(
            name='Test Company',
            description='Test Description',
            website='http://test.com',
            contact_person=cls.user,
            is_active=True
        )

    def test_organization_creation(self):
        """Test organization creation"""
        self.assertEqual(self.organization.name, 'Test Company')
        self.assertEqual(self.organization.description, 'Test Description')
        self.assertEqual(self.organization.website, 'http://test.com')
        self.assertEqual(self.organization.contact_person, self.user)
        self.assertTrue(self.organization.is_active)

    def test_organization_str_method(self):
        """Test organization string representation"""
        self.assertEqual(str(self.organization), 'Test Company')

    def test_organization_website_validation(self):
        """Test organization website validation"""
        # Test invalid website
        with self.assertRaises(Exception):
            Organization.objects.create(
                name='Invalid Website Company',
                description='Test',
                website='not-a-url',
                contact_person=self.user
            )

    def test_organization_name_max_length(self):
        """Test organization name max length"""
        max_length = Organization._meta.get_field('name').max_length
        self.assertEqual(max_length, 255)

    def test_organization_default_is_active(self):
        """Test organization default is_active value"""
        org = Organization.objects.create(
            name='Default Active Test',
            description='Test',
            website='http://test2.com',
            contact_person=self.user
        )
        self.assertTrue(org.is_active)

    def test_organization_deactivation(self):
        """Test organization deactivation"""
        self.organization.is_active = False
        self.organization.save()
        self.assertFalse(Organization.objects.get(id=self.organization.id).is_active) 