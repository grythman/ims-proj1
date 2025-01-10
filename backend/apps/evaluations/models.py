from django.db import models
from django.conf import settings
from apps.internships.models import Internship

User = settings.AUTH_USER_MODEL

class Evaluation(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_COMPLETED = 'completed'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_COMPLETED, 'Completed'),
    ]

    EVALUATION_TYPE_MENTOR = 'mentor'
    EVALUATION_TYPE_TEACHER = 'teacher'
    EVALUATION_TYPE_CHOICES = [
        (EVALUATION_TYPE_MENTOR, 'Mentor Evaluation'),
        (EVALUATION_TYPE_TEACHER, 'Teacher Evaluation'),
    ]

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='evaluations_received')
    evaluator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='evaluations_given')
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE)
    evaluation_type = models.CharField(max_length=20, choices=EVALUATION_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['student', 'evaluation_type']),
            models.Index(fields=['evaluator', 'status']),
        ]

    def __str__(self):
        return f"{self.get_evaluation_type_display()} for {self.student.get_full_name()}"

class EvaluationCriteria(models.Model):
    CRITERIA_TYPES = (
        ('technical', 'Technical Skills'),
        ('soft', 'Soft Skills'),
        ('other', 'Other')
    )

    name = models.CharField(max_length=100)
    description = models.TextField()
    criteria_type = models.CharField(max_length=20, choices=CRITERIA_TYPES)
    weight = models.FloatField(default=1.0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'evaluations'
        ordering = ['criteria_type', 'name']
        verbose_name_plural = 'Evaluation Criteria'

    def __str__(self):
        return f"{self.name} ({self.get_criteria_type_display()})"
