from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.companies.models import Organization
from apps.companies.serializers import OrganizationSerializer

User = get_user_model()

class OrganizationSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.organization_data = {
            'name': 'Test Company',
            'description': 'Test Description',
            'website': 'http://test.com',
            'contact_person': self.user.id,
            'is_active': True
        }
        
        self.organization = Organization.objects.create(
            name='Existing Company',
            description='Existing Description',
            website='http://existing.com',
            contact_person=self.user,
            is_active=True
        )
        
        self.serializer = OrganizationSerializer(instance=self.organization)

    def test_contains_expected_fields(self):
        """Test that serializer contains expected fields"""
        data = self.serializer.data
        self.assertCountEqual(
            data.keys(),
            ['id', 'name', 'description', 'website', 'contact_person', 'is_active']
        )

    def test_name_field_content(self):
        """Test name field content"""
        data = self.serializer.data
        self.assertEqual(data['name'], self.organization.name)

    def test_website_validation(self):
        """Test website validation"""
        invalid_data = self.organization_data.copy()
        invalid_data['website'] = 'not-a-url'
        serializer = OrganizationSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('website', serializer.errors)

    def test_create_organization(self):
        """Test creating organization with serializer"""
        serializer = OrganizationSerializer(data=self.organization_data)
        self.assertTrue(serializer.is_valid())
        organization = serializer.save()
        
        self.assertEqual(organization.name, self.organization_data['name'])
        self.assertEqual(organization.description, self.organization_data['description'])
        self.assertEqual(organization.website, self.organization_data['website'])
        self.assertEqual(organization.contact_person.id, self.organization_data['contact_person'])
        self.assertEqual(organization.is_active, self.organization_data['is_active'])

    def test_update_organization(self):
        """Test updating organization with serializer"""
        update_data = {
            'name': 'Updated Company',
            'description': 'Updated Description',
            'website': 'http://updated.com'
        }
        serializer = OrganizationSerializer(
            instance=self.organization,
            data=update_data,
            partial=True
        )
        
        self.assertTrue(serializer.is_valid())
        updated_organization = serializer.save()
        
        self.assertEqual(updated_organization.name, update_data['name'])
        self.assertEqual(updated_organization.description, update_data['description'])
        self.assertEqual(updated_organization.website, update_data['website'])

    def test_validate_empty_name(self):
        """Test validation of empty name"""
        invalid_data = self.organization_data.copy()
        invalid_data['name'] = ''
        serializer = OrganizationSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors) 