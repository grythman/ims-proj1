from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from apps.internships.models import Internship, Report
from apps.companies.models import Organization
from django.utils import timezone

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates test data for development'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating test data...')

        try:
            # Create test teacher
            teacher_password = make_password('password123')
            teacher = User.objects.create(
                username='teacher1',
                email='teacher1@example.com',
                password=teacher_password,
                first_name='Teacher',
                last_name='One',
                user_type='teacher',
                is_active=True,
                is_staff=True
            )
            self.stdout.write(self.style.SUCCESS(f'Created teacher: {teacher.username}'))

            # Create test student
            student_password = make_password('password123')
            student = User.objects.create(
                username='student1',
                email='student1@example.com',
                password=student_password,
                first_name='Student',
                last_name='One',
                user_type='student',
                is_active=True
            )
            self.stdout.write(self.style.SUCCESS(f'Created student: {student.username}'))

            # Create test organization
            organization = Organization.objects.create(
                name='Test Company',
                description='Test Company Description',
                website='http://example.com',
                is_active=True
            )
            self.stdout.write(self.style.SUCCESS(f'Created organization: {organization.name}'))

            # Create test internship
            internship = Internship.objects.create(
                student=student,
                teacher=teacher,
                organization=organization,
                title='Test Internship',
                description='Test Internship Description',
                start_date=timezone.now().date(),
                end_date=timezone.now().date() + timezone.timedelta(days=90),
                status='active'
            )
            self.stdout.write(self.style.SUCCESS(f'Created internship: {internship.title}'))

            # Create test reports
            for report_type in ['weekly', 'monthly']:
                report = Report.objects.create(
                    student=student,
                    internship=internship,
                    title=f'Test {report_type.capitalize()} Report',
                    content=f'Test {report_type} report content',
                    report_type=report_type,
                    status='pending'
                )
                self.stdout.write(self.style.SUCCESS(f'Created report: {report.title}'))

            self.stdout.write(self.style.SUCCESS('Successfully created all test data'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating test data: {str(e)}'))
            raise e

    def _create_user(self, username, email, password, user_type, first_name, last_name):
        try:
            user = User.objects.create(
                username=username,
                email=email,
                password=make_password(password),
                user_type=user_type,
                first_name=first_name,
                last_name=last_name,
                is_active=True
            )
            return user
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating user {username}: {str(e)}'))
            raise e 