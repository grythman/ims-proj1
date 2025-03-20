from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import URLValidator

User = get_user_model()

class Organization(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    address = models.TextField(blank=True)
    contact_person = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='organizations',
        db_index=True
    )
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['name'], name='organization_name_idx'),
            models.Index(fields=['contact_person'], name='org_contact_person_idx'),
        ]

    def __str__(self):
        return self.name

class WebhookEndpoint(models.Model):
    """Model to store webhook endpoints for organization events"""
    EVENTS = [
        ('organization.created', 'Organization Created'),
        ('organization.updated', 'Organization Updated'),
        ('organization.deleted', 'Organization Deleted'),
        ('organization.activated', 'Organization Activated'),
        ('organization.deactivated', 'Organization Deactivated'),
    ]

    name = models.CharField(max_length=100)
    url = models.URLField(validators=[URLValidator()])
    secret_key = models.CharField(max_length=100)
    events = models.JSONField(help_text="List of events to subscribe to")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    organization = models.ForeignKey(
        Organization, 
        on_delete=models.CASCADE,
        related_name='webhooks',
        null=True,
        blank=True,
        help_text="If set, only send events for this organization"
    )

    class Meta:
        indexes = [
            models.Index(fields=['is_active']),
            models.Index(fields=['organization']),
        ]

    def __str__(self):
        return f"{self.name} - {self.url}"

class WebhookDelivery(models.Model):
    """Model to track webhook delivery attempts and status"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('retrying', 'Retrying'),
    ]

    webhook = models.ForeignKey(
        WebhookEndpoint,
        on_delete=models.CASCADE,
        related_name='deliveries'
    )
    event_type = models.CharField(max_length=100)
    payload = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    response_status = models.IntegerField(null=True, blank=True)
    response_content = models.TextField(blank=True)
    error_message = models.TextField(blank=True)
    retry_count = models.IntegerField(default=0)
    next_retry_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['event_type']),
            models.Index(fields=['created_at']),
            models.Index(fields=['next_retry_at']),
        ]

    def __str__(self):
        return f"{self.webhook.name} - {self.event_type} - {self.status}"