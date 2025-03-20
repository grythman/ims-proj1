from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.internships.models import Internship, Report
from apps.companies.models import Organization
from django.utils import timezone
from typing import Tuple, List
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates test data for development'

    def _create_users(self) -> Tuple[List[User], List[User]]:
        """Create test users for development."""
        teachers = []
        students = []
        
        for i in range(3):
            teacher = User.objects.create_user(
                username=f'teacher{i+1}',
                email=f'teacher{i+1}@example.com',
                password='password123',
                first_name=f'Teacher{i+1}',
                last_name='Last',
                user_type='teacher'
            )
            teachers.append(teacher)

        for i in range(5):
            student = User.objects.create_user(
                username=f'student{i+1}',
                email=f'student{i+1}@example.com',
                password='password123',
                first_name=f'Student{i+1}',
                last_name='Last',
                user_type='student'
            )
            students.append(student)
        
        self.stdout.write(self.style.SUCCESS('Created test users'))
        return teachers, students

    def _create_organizations(self) -> List[Organization]:
        """Create multiple test organizations."""
        organizations = []
        company_names = ['Tech Corp', 'Digital Solutions', 'Innovation Labs', 'Future Systems']
        
        for name in company_names:
            org = Organization.objects.create(
                name=name,
                description=f'{name} is a leading technology company',
                website=f'http://{name.lower().replace(" ", "")}.com',
                is_active=True
            )
            organizations.append(org)
        
        self.stdout.write(self.style.SUCCESS('Created test organizations'))
        return organizations

    def _create_internships(self, students: List[User], teachers: List[User], orgs: List[Organization]) -> List[Internship]:
        """Create multiple test internships."""
        internships = []
        statuses = ['active', 'completed', 'pending']
        
        for student in students:
            internship = Internship.objects.create(
                student=student,
                teacher=random.choice(teachers),
                organization=random.choice(orgs),
                title=f'Internship at {random.choice(orgs).name}',
                description='Learning and contributing to real projects',
                start_date=timezone.now().date(),
                end_date=timezone.now().date() + timezone.timedelta(days=90),
                status=random.choice(statuses)
            )
            internships.append(internship)
        
        self.stdout.write(self.style.SUCCESS('Created test internships'))
        return internships

    def _create_reports(self, internships: List[Internship]) -> None:
        """Create test reports for each internship."""
        report_types = ['weekly', 'monthly']
        statuses = ['pending', 'approved', 'rejected']
        
        for internship in internships:
            for _ in range(3):  # Create 3 reports per internship
                report_type = random.choice(report_types)
                Report.objects.create(
                    student=internship.student,
                    internship=internship,
                    title=f'{report_type.capitalize()} Report for {internship.organization.name}',
                    content=f'Detailed report about progress and learnings at {internship.organization.name}',
                    report_type=report_type,
                    status=random.choice(statuses)
                )
        
        self.stdout.write(self.style.SUCCESS('Created test reports'))

    def handle(self, *args, **kwargs):
        try:
            teachers, students = self._create_users()
            organizations = self._create_organizations()
            internships = self._create_internships(students, teachers, organizations)
            self._create_reports(internships)
            
            self.stdout.write(self.style.SUCCESS('Successfully created all test data'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating test data: {str(e)}')) 