from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
from apps.internships.models import Internship

User = settings.AUTH_USER_MODEL

class Report(models.Model):
    STATUS_DRAFT = 'draft'
    STATUS_PENDING = 'pending'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'

    STATUS_CHOICES = [
        (STATUS_DRAFT, 'Draft'),
        (STATUS_PENDING, 'Pending Review'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_REJECTED, 'Rejected'),
    ]

    TYPE_WEEKLY = 'weekly'
    TYPE_MONTHLY = 'monthly'
    TYPE_FINAL = 'final'

    TYPE_CHOICES = [
        (TYPE_WEEKLY, 'Weekly Report'),
        (TYPE_MONTHLY, 'Monthly Report'),
        (TYPE_FINAL, 'Final Report'),
    ]

    title = models.CharField(max_length=255)
    content = models.TextField()
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE, related_name='reports')
    report_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    feedback = models.TextField(blank=True)
    file = models.FileField(upload_to='reports/', null=True, blank=True)
    submission_date = models.DateTimeField(null=True, blank=True)
    review_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['internship', '-created_at']),
        ]

    def __str__(self):
        return f"{self.title} by {self.student.get_full_name()}"

    def submit(self):
        if self.status == self.STATUS_DRAFT:
            self.status = self.STATUS_PENDING
            self.submission_date = timezone.now()
            self.save()

class ReportComment(models.Model):
    report = models.ForeignKey(
        Report,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    content = models.TextField()
    attachment = models.FileField(
        upload_to='report_comments/%Y/%m/%d/',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['report', 'created_at']),
            models.Index(fields=['author', 'created_at']),
        ]

    def __str__(self):
        return f"Comment by {self.author.username} on {self.report.title}"

class ReportTemplate(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    content_template = models.TextField()
    report_type = models.CharField(max_length=10, choices=Report.TYPE_CHOICES)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['report_type', 'is_active']),
        ]

    def __str__(self):
        return self.name
