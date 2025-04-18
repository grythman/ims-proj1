from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.internships.models import Internship

User = get_user_model()

class EvaluationCriteria(models.Model):
    CATEGORY_CHOICES = [
        ('technical', 'Technical Skills'),
        ('communication', 'Communication'),
        ('report', 'Report Quality'),
        ('attendance', 'Attendance'),
        ('teamwork', 'Teamwork')
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    max_score = models.DecimalField(max_digits=3, decimal_places=1, default=10.0)
    weight = models.DecimalField(max_digits=3, decimal_places=2, default=1.0)

    class Meta:
        verbose_name = _('evaluation criteria')
        verbose_name_plural = _('evaluation criteria')
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.get_category_display()} - {self.name}"

class Evaluation(models.Model):
    internship = models.ForeignKey('internships.Internship', on_delete=models.CASCADE, related_name='evaluations')
    evaluator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_evaluations')
    evaluated_student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_internship_evaluations')
    date = models.DateField(auto_now_add=True)
    comments = models.TextField(blank=True)
    is_final = models.BooleanField(default=False)

    class Meta:
        verbose_name = _('evaluation')
        verbose_name_plural = _('evaluations')
        ordering = ['-date']

    def __str__(self):
        return f"Evaluation of {self.evaluated_student.username} by {self.evaluator.username}"

class EvaluationScore(models.Model):
    evaluation = models.ForeignKey(Evaluation, on_delete=models.CASCADE, related_name='scores')
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=3, decimal_places=1)
    comments = models.TextField(blank=True)

    class Meta:
        verbose_name = _('evaluation score')
        verbose_name_plural = _('evaluation scores')
        unique_together = ['evaluation', 'criteria']

    def __str__(self):
        return f"{self.criteria.name}: {self.score}"

    def clean(self):
        if self.score > self.criteria.max_score:
            raise ValidationError(f"Score cannot exceed {self.criteria.max_score}")

class EvaluationAttachment(models.Model):
    evaluation = models.ForeignKey(Evaluation, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='evaluations/')
    description = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('evaluation attachment')
        verbose_name_plural = _('evaluation attachments')
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"Attachment for {self.evaluation}"
