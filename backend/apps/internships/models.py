from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
from apps.companies.models import Organization

User = settings.AUTH_USER_MODEL

class Internship(models.Model):
    STATUS_PENDING = 0
    STATUS_ACTIVE = 1
    STATUS_COMPLETED = 2
    STATUS_CANCELLED = 3

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_ACTIVE, 'Active'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='internships')
    mentor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='mentored_internships')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='internships')
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.IntegerField(choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    company_name = models.CharField(max_length=255)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['mentor']),
            models.Index(fields=['organization']),
        ]

    def __str__(self):
        return f"{self.student.get_full_name()}'s internship at {self.organization.name}"

    def clean(self):
        if self.start_date and self.end_date:
            if self.start_date >= self.end_date:
                raise ValidationError("End date must be after start date.")

    @property
    def is_active(self):
        return self.status == self.STATUS_ACTIVE

class Task(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    internship = models.ForeignKey(
        Internship,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='assigned_tasks'
    )
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    hours_spent = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['due_date', '-priority']

    def __str__(self):
        return f"{self.title} - {self.internship.student.username}"

class Evaluation(models.Model):
    GRADE_CHOICES = [
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
        ('F', 'F'),
    ]

    EVALUATOR_TYPES = [
        ('teacher', 'Teacher'),
        ('mentor', 'Mentor'),
    ]

    report = models.ForeignKey('Report', on_delete=models.CASCADE, related_name='evaluations')
    evaluator = models.ForeignKey('users.User', on_delete=models.CASCADE)
    evaluator_type = models.CharField(
        max_length=20, 
        choices=EVALUATOR_TYPES,
        default='teacher'
    )
    grade = models.CharField(max_length=1, choices=GRADE_CHOICES)
    comments = models.TextField()
    feedback = models.TextField()
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Evaluation for {self.report} by {self.evaluator}"

    def save(self, *args, **kwargs):
        # Set evaluator_type based on the evaluator's user_type if not set
        if not self.evaluator_type and self.evaluator:
            self.evaluator_type = self.evaluator.user_type
        super().save(*args, **kwargs)

class Report(models.Model):
    REPORT_STATUS = (
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    )

    REPORT_TYPES = (
        ('weekly', 'Weekly Report'),
        ('monthly', 'Monthly Report'),
        ('final', 'Final Report'),
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='submitted_reports'
    )
    internship = models.ForeignKey(
        'Internship',
        on_delete=models.CASCADE,
        related_name='reports'
    )
    title = models.CharField(max_length=200)
    content = models.TextField()
    report_type = models.CharField(
        max_length=20,
        choices=REPORT_TYPES,
        default='weekly'
    )
    feedback = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=REPORT_STATUS,
        default='pending'
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
    evaluated_at = models.DateTimeField(null=True, blank=True)
    evaluated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='evaluated_reports'
    )

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.get_report_type_display()} by {self.student.get_full_name()} - {self.submitted_at.date()}"

class PreliminaryReport(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
        ('needs_revision', 'Needs Revision')
    )

    internship = models.ForeignKey(
        Internship,
        on_delete=models.CASCADE,
        related_name='preliminary_reports'
    )
    content = models.TextField()
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='draft'
    )
    feedback = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='reviewed_preliminary_reports'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Preliminary Report for {self.internship}"

class Agreement(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending_organization', 'Pending Organization Approval'),
        ('pending_university', 'Pending University Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    )

    internship = models.OneToOneField(
        'Internship',
        on_delete=models.CASCADE,
        related_name='agreement'
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='internship_agreements'
    )
    organization = models.ForeignKey(
        'companies.Organization',
        on_delete=models.CASCADE,
        related_name='internship_agreements'
    )
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='draft'
    )
    student_signature = models.BooleanField(default=False)
    organization_signature = models.BooleanField(default=False)
    university_signature = models.BooleanField(default=False)
    agreement_file = models.FileField(
        upload_to='agreements/%Y/%m/',
        null=True,
        blank=True
    )
    signed_agreement_file = models.FileField(
        upload_to='signed_agreements/%Y/%m/',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Agreement for {self.student.username} at {self.organization.name}"

class InternshipPlan(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    )

    internship = models.OneToOneField(
        'Internship',
        on_delete=models.CASCADE,
        related_name='plan'
    )
    content = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    feedback = models.TextField(blank=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='approved_plans'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Plan for {self.internship.student.username}'s internship"
