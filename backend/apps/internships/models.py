from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
from apps.companies.models import Organization
# Comment out GeoDjango import
# from django.contrib.gis.db import models as gis_models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class Internship(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ]

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='internships')
    mentor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='mentored_internships')
    teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='supervised_internships')
    employer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='offered_internships')

    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # GIS fields modified to use regular fields
    # location = gis_models.PointField(geography=True, null=True, blank=True)
    location_lat = models.FloatField(null=True, blank=True)
    location_lng = models.FloatField(null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)

    # Schedule fields
    work_hours = models.JSONField(default=dict)  # Store daily schedule
    total_hours = models.IntegerField(default=0)
    
    # Evaluation fields
    technical_skill_score = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    communication_score = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    report_quality_score = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('internship')
        verbose_name_plural = _('internships')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.username}'s internship at {self.employer.organization_name if self.employer else 'Unknown'}"

    def clean(self):
        if self.start_date and self.end_date:
            if self.start_date >= self.end_date:
                raise ValidationError("End date must be after start date.")

    @property
    def is_active(self):
        return self.status == 'approved'

class Task(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ]

    internship = models.ForeignKey(Internship, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField()
    assigned_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tasks')
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('task')
        verbose_name_plural = _('tasks')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.assigned_to.username}"

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
    REPORT_TYPES = [
        ('daily', 'Daily Report'),
        ('weekly', 'Weekly Report'),
        ('final', 'Final Report')
    ]

    internship = models.ForeignKey(Internship, on_delete=models.CASCADE, related_name='reports')
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    content = models.TextField()
    attachments = models.FileField(upload_to='reports/', null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reviewed_reports')
    feedback = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name = _('report')
        verbose_name_plural = _('reports')
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.internship.student.username}'s {self.report_type} report"

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

class Message(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_messages'
    )
    internship = models.ForeignKey(
        'Internship',
        on_delete=models.CASCADE,
        related_name='messages'
    )
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['sender', 'recipient']),
            models.Index(fields=['internship', '-created_at']),
        ]

    def __str__(self):
        return f"Message from {self.sender} to {self.recipient} at {self.created_at}"

class InternshipApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    ]

    student = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='applications'
    )
    internship = models.ForeignKey(
        Internship,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    cv = models.FileField(
        upload_to='applications/cv/%Y/%m/',
        null=True,
        blank=True
    )
    cover_letter = models.TextField(blank=True)
    feedback = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='reviewed_applications'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    internship_listing = models.ForeignKey(
        'InternshipListing',
        on_delete=models.CASCADE,
        related_name='applications',
        null=True,
        blank=True,
        help_text="Дадлагын зар"
    )

    class Meta:
        ordering = ['-created_at']
        unique_together = ['student', 'internship']
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['internship', 'status']),
        ]

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.internship.title}"

    def save(self, *args, **kwargs):
        # If status is being changed to accepted/rejected, set reviewed_at
        if self.pk:
            old_instance = InternshipApplication.objects.get(pk=self.pk)
            if old_instance.status != self.status and self.status in ['accepted', 'rejected']:
                self.reviewed_at = timezone.now()
        super().save(*args, **kwargs)

class InternshipListing(models.Model):
    """
    Дадлагын зарын мэдээлэл
    """
    INTERNSHIP_TYPES = (
        ('Бүтэн цагийн', 'Бүтэн цагийн'),
        ('Хагас цагийн', 'Хагас цагийн'),
        ('Зайнаас', 'Зайнаас'),
        ('Уян хатан', 'Уян хатан'),
    )
    
    INTERNSHIP_CATEGORIES = (
        ('Програм хангамж', 'Програм хангамж'),
        ('Дата шинжилгээ', 'Дата шинжилгээ'),
        ('Кибер аюулгүй байдал', 'Кибер аюулгүй байдал'),
        ('Маркетинг', 'Маркетинг'),
        ('Бизнес', 'Бизнес'),
        ('Санхүү', 'Санхүү'),
        ('Барилга инженер', 'Барилга инженер'),
        ('Бусад', 'Бусад'),
    )
    
    id = models.AutoField(primary_key=True)
    organization = models.CharField(max_length=255, help_text="Байгууллагын нэр")
    position = models.CharField(max_length=255, help_text="Дадлагын нэр/Албан тушаал")
    category = models.CharField(max_length=50, choices=INTERNSHIP_CATEGORIES, help_text="Дадлагын ангилал")
    type = models.CharField(max_length=50, choices=INTERNSHIP_TYPES, help_text="Дадлагын төрөл")
    location = models.CharField(max_length=255, help_text="Дадлагын байршил")
    duration = models.CharField(max_length=100, help_text="Дадлагын хугацаа")
    salary = models.CharField(max_length=255, blank=True, null=True, help_text="Цалин/Урамшуулал")
    salary_amount = models.IntegerField(blank=True, null=True, help_text="Цалингийн хэмжээ (тоогоор)")
    description = models.TextField(help_text="Дадлагын тодорхойлолт")
    requirements = models.JSONField(default=list, help_text="Шаардлагууд (жагсаалт)")
    benefits = models.JSONField(default=list, help_text="Давуу талууд (жагсаалт)")
    responsibilities = models.JSONField(default=list, blank=True, null=True, help_text="Хариуцах ажлууд")
    
    logo = models.URLField(blank=True, null=True, help_text="Байгууллагын лого зургийн URL")
    featured = models.BooleanField(default=False, help_text="Онцлох дадлага эсэх")
    active = models.BooleanField(default=True, help_text="Идэвхтэй эсэх")
    
    applyDeadline = models.DateField(help_text="Хүсэлт хүлээн авах эцсийн хугацаа")
    postedDate = models.DateField(auto_now_add=True, help_text="Нийтэлсэн огноо")
    
    contact_person = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='listings_contact',
        null=True,
        blank=True,
        help_text="Холбоо барих хүн"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.position} - {self.organization}"
    
    class Meta:
        ordering = ['-featured', '-postedDate']
        verbose_name = "Дадлагын Зар"
        verbose_name_plural = "Дадлагын Зарууд"
