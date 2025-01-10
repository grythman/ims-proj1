from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = [
        ('report', 'Report'),
        ('task', 'Task'),
        ('evaluation', 'Evaluation'),
        ('system', 'System'),
    ]

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read'], name='notification_recipient_is_read_idx'),
        ]

    def __str__(self):
        return f"Notification for {self.recipient.username}"

class NotificationPreference(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='system_notification_preferences'
    )
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    report_notifications = models.BooleanField(default=True)
    task_notifications = models.BooleanField(default=True)
    meeting_notifications = models.BooleanField(default=True)
    message_notifications = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"Notification preferences for {self.user.username}"
