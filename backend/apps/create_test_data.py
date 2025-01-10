from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.internships.models import Internship, Report
from apps.companies.models import Organization
from django.utils import timezone

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates test data for development'

    def handle(self, *args, **kwargs):
        # Create test users
        teacher = User.objects.create_user(
            username='teacher1',
            email='teacher1@example.com',
            password='password123',
            first_name='Teacher',
            last_name='One',
            user_type='teacher'
        )

        student = User.objects.create_user(
            username='student1',
            email='student1@example.com',
            password='password123',
            first_name='Student',
            last_name='One',
            user_type='student'
        )

        # Create test organization
        org = Organization.objects.create(
            name='Test Company',
            description='Test Company Description',
            website='http://example.com',
            is_active=True
        )

        # Create test internship
        internship = Internship.objects.create(
            student=student,
            teacher=teacher,
            organization=org,
            title='Test Internship',
            description='Test Internship Description',
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timezone.timedelta(days=90),
            status='active'
        )

        # Create test reports
        for report_type in ['weekly', 'monthly']:
            Report.objects.create(
                student=student,
                internship=internship,
                title=f'Test {report_type.capitalize()} Report',
                content=f'Test {report_type} report content',
                report_type=report_type,
                status='pending'
            )

        self.stdout.write(self.style.SUCCESS('Successfully created test data')) 