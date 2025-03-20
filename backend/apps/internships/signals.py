from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from .models import Internship, Task, Evaluation, Report
from apps.notifications.services import NotificationService
from apps.notifications.models import Notification

@receiver(post_save, sender=Internship)
def internship_notification(sender, instance, created, **kwargs):
    """Create notifications for internship events"""
    try:
        if created:
            # Notify student
            Notification.objects.create(
                recipient=instance.student,
                title='Дадлага бүртгэгдлээ',
                message=f'Таны {instance.organization.name} дээрх дадлага амжилттай бүртгэгдлээ.',
                notification_type='success'
            )
            
            # Notify mentor
            if instance.mentor:
                Notification.objects.create(
                    recipient=instance.mentor,
                    title='Шинэ оюутан хуваарилагдлаа',
                    message=f'{instance.student.get_full_name()} таны удирдлага дор дадлага хийхээр бүртгэгдлээ.',
                    notification_type='info'
                )
        else:
            # Status change notification
            if instance.status == 2:  # completed
                Notification.objects.create(
                    recipient=instance.student,
                    title='Дадлага дууслаа',
                    message=f'{instance.organization.name} дээрх таны дадлага амжилттай дууслаа.',
                    notification_type='success'
                )
                
                if instance.mentor:
                    Notification.objects.create(
                        recipient=instance.mentor,
                        title='Дадлага дууслаа',
                        message=f'{instance.student.get_full_name()}-н дадлага амжилттай дууслаа.',
                        notification_type='success'
                    )
    except Exception as e:
        print(f"Error creating internship notification: {str(e)}")

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

@receiver(post_save, sender=Report)
def report_notification(sender, instance, created, **kwargs):
    """Create notifications for report events"""
    try:
        if created:
            # Notify mentor about new report
            if instance.internship.mentor:
                Notification.objects.create(
                    recipient=instance.internship.mentor,
                    title='Шинэ тайлан',
                    message=f'{instance.student.get_full_name()} шинэ тайлан илгээлээ.',
                    notification_type='info'
                )
        else:
            # Status change notifications
            if instance.status == 'approved':
                Notification.objects.create(
                    recipient=instance.student,
                    title='Тайлан зөвшөөрөгдлөө',
                    message=f'Таны тайлан зөвшөөрөгдлөө.',
                    notification_type='success'
                )
            elif instance.status == 'rejected':
                Notification.objects.create(
                    recipient=instance.student,
                    title='Тайлан буцаагдлаа',
                    message=f'Таны тайлан буцаагдлаа. Шалтгаан: {instance.feedback}',
                    notification_type='warning'
                )
    except Exception as e:
        print(f"Error creating report notification: {str(e)}")