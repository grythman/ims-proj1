from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    USER_TYPE_STUDENT = 'student'
    USER_TYPE_MENTOR = 'mentor'
    USER_TYPE_TEACHER = 'teacher'
    USER_TYPE_ADMIN = 'admin'

    USER_TYPE_CHOICES = [
        (USER_TYPE_STUDENT, 'Student'),
        (USER_TYPE_MENTOR, 'Mentor'),
        (USER_TYPE_TEACHER, 'Teacher'),
        (USER_TYPE_ADMIN, 'Admin'),
    ]

    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default=USER_TYPE_STUDENT)
    phone = models.CharField(max_length=15, blank=True, null=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    # Student specific fields
    student_id = models.CharField(max_length=20, blank=True, null=True)
    major = models.CharField(max_length=100, blank=True, null=True)

    # Mentor specific fields
    company = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)

    # Teacher specific fields
    department_name = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.username

class Activity(models.Model):
    ACTIVITY_TYPES = (
        ('login', 'Login'),
        ('profile_update', 'Profile Update'),
        ('internship_action', 'Internship Action'),
        ('report_submission', 'Report Submission'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = _('activity')
        verbose_name_plural = _('activities')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.activity_type}"

class NotificationPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = _('notification preference')
        verbose_name_plural = _('notification preferences')

    def __str__(self):
        return f"{self.user.username}'s notification preferences"

    @staticmethod
    def get_default_preferences():
        # Return default notification preferences
        return {
            'email_notifications': True,
            'push_notifications': True,
            'sms_notifications': False,
        }