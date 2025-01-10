from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Report, ReportComment
from apps.notifications.services import NotificationService
from apps.dashboard.models import Activity

@receiver(post_save, sender=Report)
def report_post_save(sender, instance, created, **kwargs):
    if created:
        # Create activity record
        Activity.objects.create(
            user=instance.student,
            activity_type='report_submission',
            description=f'Created new report: {instance.title}'
        )
    else:
        # Status change notifications
        if instance.status == 'pending':
            Activity.objects.create(
                user=instance.student,
                activity_type='report_submission',
                description=f'Submitted report: {instance.title}'
            )
        elif instance.status in ['approved', 'rejected', 'revised']:
            Activity.objects.create(
                user=instance.mentor if instance.mentor else instance.student,
                activity_type='report_review',
                description=f'Report {instance.status}: {instance.title}'
            )

@receiver(post_save, sender=ReportComment)
def comment_post_save(sender, instance, created, **kwargs):
    if created:
        # Create activity record
        Activity.objects.create(
            user=instance.author,
            activity_type='report_comment',
            description=f'Commented on report: {instance.report.title}'
        )

        # Notify relevant users
        recipients = {instance.report.student, instance.report.mentor} - {instance.author}
        for recipient in recipients:
            if recipient:
                NotificationService.create_notification(
                    recipient=recipient,
                    title='New Comment on Report',
                    message=f'New comment on report: {instance.report.title}',
                    notification_type='report_comment'
                ) 