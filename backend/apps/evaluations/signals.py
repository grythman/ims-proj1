from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Evaluation
from apps.notifications.services import NotificationService

@receiver(post_save, sender=Evaluation)
def handle_evaluation_status_change(sender, instance, created, **kwargs):
    """Handle notifications when evaluation status changes"""
    try:
        if created:
            # Notify student about new evaluation
            NotificationService.create_notification(
                recipient=instance.student,
                title='New Evaluation Created',
                message=f'A new {instance.get_evaluation_type_display()} has been created for you.',
                notification_type='evaluation'
            )
        else:
            # Notify relevant parties about status changes
            if instance.status == 'completed':
                NotificationService.create_notification(
                    recipient=instance.student,
                    title='Evaluation Completed',
                    message=f'Your {instance.get_evaluation_type_display()} has been completed.',
                    notification_type='evaluation'
                )
            elif instance.status == 'reviewed':
                NotificationService.create_notification(
                    recipient=instance.evaluator,
                    title='Evaluation Reviewed',
                    message=f'The {instance.get_evaluation_type_display()} has been reviewed.',
                    notification_type='evaluation'
                )
    except Exception as e:
        print(f"Error in evaluation signal handler: {str(e)}") 