from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates test users for development'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating test users...')
        
        try:
            with transaction.atomic():
                # Create a test student
                student = User.objects.create_user(
                    username='student_test',
                    email='student@test.com',
                    password='Test@123456',
                    first_name='Test',
                    last_name='Student',
                    user_type='student'
                )
                student.is_active = True
                student.save()
                
                # Create a test mentor
                mentor = User.objects.create_user(
                    username='mentor_test',
                    email='mentor@test.com',
                    password='Test@123456',
                    first_name='Test',
                    last_name='Mentor',
                    user_type='mentor'
                )
                mentor.is_active = True
                mentor.save()
                
                # Create a test teacher
                teacher = User.objects.create_user(
                    username='teacher_test',
                    email='teacher@test.com',
                    password='Test@123456',
                    first_name='Test',
                    last_name='Teacher',
                    user_type='teacher'
                )
                teacher.is_active = True
                teacher.save()

            self.stdout.write(self.style.SUCCESS('Successfully created test users'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating test users: {str(e)}')) 