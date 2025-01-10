from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Internship, Task, Evaluation
from apps.notifications.services import NotificationService

@receiver(post_save, sender=Internship)
def internship_post_save(sender, instance, created, **kwargs):
    if created:
        NotificationService.create_notification(
            recipient=instance.student,
            title='Internship Created',
            message=f'Your internship at {instance.organization.name} has been created',
            notification_type='internship'
        )

        if instance.mentor:
            NotificationService.create_notification(
                recipient=instance.mentor,
                title='New Intern Assigned',
                message=f'You have been assigned as mentor for {instance.student.get_full_name()}',
                notification_type='internship'
            )

@receiver(post_save, sender=Task)
def task_post_save(sender, instance, created, **kwargs):
    if created:
        NotificationService.create_notification(
            recipient=instance.internship.student,
            title='New Task Assigned',
            message=f'You have been assigned a new task: {instance.title}',
            notification_type='task'
        )
    elif instance.status == 'completed':
        NotificationService.create_notification(
            recipient=instance.assigned_by,
            title='Task Completed',
            message=f'Task "{instance.title}" has been completed',
            notification_type='task'
        )

@receiver(post_save, sender=Evaluation)
def evaluation_post_save(sender, instance, created, **kwargs):
    if created:
        NotificationService.create_notification(
            recipient=instance.internship.student,
            title='New Evaluation',
            message=f'You have received a new evaluation from your {instance.evaluator_type}',
            notification_type='evaluation'
        )