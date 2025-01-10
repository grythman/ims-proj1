from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User

# Create your tests here.

class UserRegistrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('user-list')

    def test_student_registration(self):
        data = {
            "username": "student_test",
            "email": "student@test.com",
            "password": "Test123!@#",
            "password2": "Test123!@#",
            "first_name": "Student",
            "last_name": "Test",
            "user_type": "student",
            "phone": "1234567890"
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().user_type, 'student')

    def test_mentor_registration(self):
        data = {
            "username": "mentor_test",
            "email": "mentor@test.com",
            "password": "Test123!@#",
            "password2": "Test123!@#",
            "first_name": "Mentor",
            "last_name": "Test",
            "user_type": "mentor",
            "phone": "1234567890"
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.get().user_type, 'mentor')

    def test_teacher_registration(self):
        data = {
            "username": "teacher_test",
            "email": "teacher@test.com",
            "password": "Test123!@#",
            "password2": "Test123!@#",
            "first_name": "Teacher",
            "last_name": "Test",
            "user_type": "teacher",
            "phone": "1234567890"
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.get().user_type, 'teacher')

class DashboardAccessTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create test users
        self.student = User.objects.create_user(
            username='student', 
            password='test123',
            user_type='student'
        )
        self.mentor = User.objects.create_user(
            username='mentor', 
            password='test123',
            user_type='mentor'
        )
        self.teacher = User.objects.create_user(
            username='teacher', 
            password='test123',
            user_type='teacher'
        )
        self.admin = User.objects.create_superuser(
            username='admin', 
            password='test123',
            user_type='admin'
        )

    def test_student_dashboard_access(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse('user-dashboard'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('current_internship', response.data)

    def test_mentor_dashboard_access(self):
        self.client.force_authenticate(user=self.mentor)
        response = self.client.get(reverse('user-dashboard'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('mentored_students', response.data)

    def test_teacher_dashboard_access(self):
        self.client.force_authenticate(user=self.teacher)
        response = self.client.get(reverse('user-dashboard'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_students', response.data)

    def test_admin_dashboard_access(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse('user-dashboard'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_users', response.data)

class UserValidationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('user-list')

    def test_invalid_user_type(self):
        data = {
            "username": "test_user",
            "email": "test@test.com",
            "password": "Test123!@#",
            "password2": "Test123!@#",
            "first_name": "Test",
            "last_name": "User",
            "user_type": "invalid_type",
            "phone": "1234567890"
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_mismatch(self):
        data = {
            "username": "test_user",
            "email": "test@test.com",
            "password": "Test123!@#",
            "password2": "DifferentPassword",
            "first_name": "Test",
            "last_name": "User",
            "user_type": "student",
            "phone": "1234567890"
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duplicate_username(self):
        # Create first user
        User.objects.create_user(username='test_user', password='test123')
        
        # Try to create another user with same username
        data = {
            "username": "test_user",
            "email": "test@test.com",
            "password": "Test123!@#",
            "password2": "Test123!@#",
            "first_name": "Test",
            "last_name": "User",
            "user_type": "student",
            "phone": "1234567890"
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
