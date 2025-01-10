from django.db import models
from django.conf import settings

# Create your models here.

class DashboardStat(models.Model):
    organization = models.ForeignKey('companies.Organization', on_delete=models.CASCADE)
    total_internships = models.IntegerField(default=0)
    active_internships = models.IntegerField(default=0)
    completed_internships = models.IntegerField(default=0)
    total_students = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['organization', 'created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"Stats for {self.organization.name}"

    def update_stats(self):
        from apps.internships.models import Internship
        internships = Internship.objects.filter(organization=self.organization)
        
        stats = internships.aggregate(
            total=models.Count('id'),
            active=models.Count('id', filter=models.Q(status='active')),
            completed=models.Count('id', filter=models.Q(status='completed')),
            students=models.Count('student', distinct=True)
        )
        
        self.total_internships = stats['total']
        self.active_internships = stats['active']
        self.completed_internships = stats['completed']
        self.total_students = stats['students']
        self.save()

class DashboardMetric(models.Model):
    METRIC_TYPES = (
        ('student_count', 'Student Count'),
        ('active_internships', 'Active Internships'),
        ('completion_rate', 'Completion Rate'),
        ('mentor_count', 'Mentor Count'),
    )

    name = models.CharField(max_length=50, choices=METRIC_TYPES)
    value = models.IntegerField()
    date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ['name', 'date']
        indexes = [
            models.Index(fields=['name', 'date']),
            models.Index(fields=['-date']),
        ]

    def __str__(self):
        return f"{self.name}: {self.value}"

class Activity(models.Model):
    ACTIVITY_TYPES = (
        ('report_submission', 'Report Submission'),
        ('evaluation', 'Evaluation'),
        ('meeting', 'Meeting'),
        ('task_completion', 'Task Completion'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Activities'
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['activity_type', '-created_at']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.activity_type}"
