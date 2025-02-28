from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.internships.models import Internship

User = settings.AUTH_USER_MODEL

class EvaluationCriteria(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    weight = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    evaluator_type = models.CharField(
        max_length=20,
        choices=[('mentor', 'Mentor'), ('teacher', 'Teacher')],
        default='mentor'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['weight']
        indexes = [
            models.Index(fields=['evaluator_type']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_evaluator_type_display()})"

class Evaluation(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ]

    internship = models.ForeignKey(
        Internship,
        on_delete=models.CASCADE,
        related_name='evaluations'
    )
    evaluator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='given_evaluations'
    )
    evaluator_type = models.CharField(
        max_length=20,
        choices=[('mentor', 'Mentor'), ('teacher', 'Teacher')],
        default='mentor'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    submission_date = models.DateTimeField(null=True, blank=True)
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['internship', 'evaluator_type']),
            models.Index(fields=['evaluator', 'status']),
        ]
        unique_together = ['internship', 'evaluator_type']

    def __str__(self):
        return f"{self.get_evaluator_type_display()} Evaluation for {self.internship}"

    def calculate_total_score(self):
        scores = self.scores.all()
        if not scores:
            return 0
        
        total_weight = sum(score.criteria.weight for score in scores)
        if total_weight == 0:
            return 0
            
        weighted_sum = sum(
            score.score * score.criteria.weight / 100 
            for score in scores
        )
        return round(weighted_sum, 2)

class EvaluationScore(models.Model):
    evaluation = models.ForeignKey(
        Evaluation,
        on_delete=models.CASCADE,
        related_name='scores'
    )
    criteria = models.ForeignKey(
        EvaluationCriteria,
        on_delete=models.CASCADE,
        related_name='scores'
    )
    score = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['criteria__weight']
        indexes = [
            models.Index(fields=['evaluation', 'criteria']),
        ]
        unique_together = ['evaluation', 'criteria']

    def __str__(self):
        return f"{self.criteria.name}: {self.score}"

class EvaluationAttachment(models.Model):
    evaluation = models.ForeignKey(
        Evaluation,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    file = models.FileField(upload_to='evaluations/%Y/%m/%d/')
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=100)
    file_size = models.IntegerField()  # Size in bytes
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['evaluation', 'created_at']),
        ]

    def __str__(self):
        return f"Attachment: {self.file_name}"
