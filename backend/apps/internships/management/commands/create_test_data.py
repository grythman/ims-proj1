from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from apps.internships.models import Internship, Report
from apps.companies.models import Organization
from django.utils import timezone
from datetime import timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Тест өгөгдөл үүсгэх'

    def _create_organizations(self):
        """Тест байгууллагууд үүсгэх"""
        organizations = []
        company_names = [
            'Able Software LLC',
            'AND Global LLC',
            'Unimedia Solutions LLC',
            'Interactive LLC',
            'Nest Academy',
            'Infinite Solutions LLC',
            'ICT Group LLC',
            'Mongol Content LLC',
            'Tomyo EdTech',
            'iHotel LLC'
        ]
        
        for name in company_names:
            org = Organization.objects.create(
                name=name,
                description=f'{name} нь мэдээллийн технологийн компани юм.',
                website=f'http://{name.lower().replace(" ", "")}.com',
                is_active=True
            )
            organizations.append(org)
            self.stdout.write(f'Байгууллага үүсгэлээ: {name}')
        
        return organizations

    def _create_mentors(self):
        """Тест менторууд үүсгэх"""
        mentors = []
        mentor_names = [
            ('Бат', 'Болд'),
            ('Сараа', 'Дорж'),
            ('Төмөр', 'Очир'),
            ('Нараа', 'Баяр'),
            ('Болд', 'Баатар')
        ]
        
        for i, (first_name, last_name) in enumerate(mentor_names):
            mentor = User.objects.create_user(
                username=f'mentor{i+1}',
                email=f'mentor{i+1}@example.com',
                password='password123',
                first_name=first_name,
                last_name=last_name,
                user_type='mentor'
            )
            mentors.append(mentor)
            self.stdout.write(f'Ментор үүсгэлээ: {first_name} {last_name}')
        
        return mentors

    def _create_students(self):
        """Тест оюутнууд үүсгэх"""
        students = []
        student_names = [
            ('Ганаа', 'Лхагва'),
            ('Сүхээ', 'Дорж'),
            ('Золбоо', 'Баяр'),
            ('Цэцгээ', 'Болд'),
            ('Оюунаа', 'Баатар')
        ]
        
        for i, (first_name, last_name) in enumerate(student_names):
            student = User.objects.create_user(
                username=f'student{i+1}',
                email=f'student{i+1}@example.com',
                password='password123',
                first_name=first_name,
                last_name=last_name,
                user_type='student'
            )
            students.append(student)
            self.stdout.write(f'Оюутан үүсгэлээ: {first_name} {last_name}')
        
        return students

    def _create_internships(self, students, mentors, organizations):
        """Тест дадлагууд үүсгэх"""
        internship_titles = [
            'Програм хөгжүүлэгч',
            'Веб хөгжүүлэгч',
            'Мобайл хөгжүүлэгч',
            'UI/UX дизайнер',
            'Системийн архитектор'
        ]
        
        for student in students:
            title = random.choice(internship_titles)
            organization = random.choice(organizations)
            mentor = random.choice(mentors)
            
            start_date = timezone.now().date()
            end_date = start_date + timedelta(days=90)
            
            Internship.objects.create(
                student=student,
                mentor=mentor,
                organization=organization,
                title=title,
                description=f'{title} дадлага - {organization.name}',
                start_date=start_date,
                end_date=end_date,
                status=1  # 1 = active
            )
            self.stdout.write(f'Дадлага үүсгэлээ: {student.first_name} - {title}')

    def handle(self, *args, **kwargs):
        try:
            # Өмнөх өгөгдлийг устгах
            Organization.objects.all().delete()
            User.objects.filter(user_type__in=['mentor', 'student']).delete()
            Internship.objects.all().delete()
            
            self.stdout.write('Хуучин өгөгдлийг устгалаа')
            
            # Шинэ өгөгдөл үүсгэх
            organizations = self._create_organizations()
            mentors = self._create_mentors()
            students = self._create_students()
            self._create_internships(students, mentors, organizations)
            
            self.stdout.write(self.style.SUCCESS('Тест өгөгдөл амжилттай үүслээ'))
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Алдаа гарлаа: {str(e)}')
            )

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