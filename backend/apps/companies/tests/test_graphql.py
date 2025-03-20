from django.test import TestCase
from django.contrib.auth import get_user_model
from graphene.test import Client
from django.core.cache import cache
from apps.companies.models import Organization
from schema import schema

User = get_user_model()

class GraphQLTest(TestCase):
    def setUp(self):
        self.client = Client(schema)
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.org = Organization.objects.create(
            name='Test Company',
            description='Test Description',
            website='http://test.com',
            contact_person=self.user,
            is_active=False
        )
        cache.clear()

    def test_organizations_query(self):
        query = '''
            query {
                organizations {
                    id
                    name
                    isActive
                }
            }
        '''
        context = {'user': self.user}
        response = self.client.execute(query, context=context)
        self.assertIsNone(response.get('errors'))
        self.assertEqual(len(response['data']['organizations']), 1)
        self.assertEqual(response['data']['organizations'][0]['name'], 'Test Company')

    def test_organization_query(self):
        query = f'''
            query {{
                organization(id: {self.org.id}) {{
                    id
                    name
                    isActive
                }}
            }}
        '''
        context = {'user': self.user}
        response = self.client.execute(query, context=context)
        self.assertIsNone(response.get('errors'))
        self.assertEqual(response['data']['organization']['name'], 'Test Company')

    def test_organization_statistics(self):
        query = '''
            query {
                organizationStatistics
            }
        '''
        context = {'user': self.user}
        response = self.client.execute(query, context=context)
        self.assertIsNone(response.get('errors'))
        stats = response['data']['organizationStatistics']
        self.assertEqual(stats['total'], 1)
        self.assertEqual(stats['active'], 0)
        self.assertEqual(stats['inactive'], 1)

    def test_activate_organization(self):
        mutation = f'''
            mutation {{
                activateOrganization(id: {self.org.id}) {{
                    organization {{
                        id
                        name
                        isActive
                    }}
                    success
                }}
            }}
        '''
        context = {'user': self.user}
        response = self.client.execute(mutation, context=context)
        self.assertIsNone(response.get('errors'))
        self.assertTrue(response['data']['activateOrganization']['success'])
        self.assertTrue(response['data']['activateOrganization']['organization']['isActive'])

    def test_bulk_activate_organizations(self):
        # Create additional organizations
        orgs = [
            Organization.objects.create(
                name=f'Test Company {i}',
                description=f'Test Description {i}',
                website=f'http://test{i}.com',
                contact_person=self.user,
                is_active=False
            ) for i in range(5)
        ]
        org_ids = [org.id for org in orgs]
        
        mutation = f'''
            mutation {{
                bulkActivateOrganizations(ids: {org_ids}) {{
                    totalProcessed
                    activatedCount
                    failedIds
                    batchesCount
                    processingTime
                }}
            }}
        '''
        context = {'user': self.user}
        response = self.client.execute(mutation, context=context)
        self.assertIsNone(response.get('errors'))
        self.assertEqual(response['data']['bulkActivateOrganizations']['totalProcessed'], 5)
        self.assertEqual(response['data']['bulkActivateOrganizations']['activatedCount'], 5)
        self.assertEqual(len(response['data']['bulkActivateOrganizations']['failedIds']), 0)

    def test_authentication_required(self):
        query = '''
            query {
                organizations {
                    id
                    name
                }
            }
        '''
        response = self.client.execute(query)  # No user in context
        self.assertIsNotNone(response.get('errors'))
        self.assertIn('You do not have permission to perform this action', str(response['errors'])) 