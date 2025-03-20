from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Notification, NotificationPreference

User = get_user_model()

@receiver(post_save, sender=User)
def create_notification_preferences(sender, instance, created, **kwargs):
    """Create notification preferences when a new user is created"""
    if created:
        NotificationPreference.objects.create(user=instance)
        print(f"Created notification preferences for user {instance.username}")

@receiver([post_save, post_delete], sender=User)
def create_user_notification(sender, instance, created=None, **kwargs):
    """Create notification when user is created or deleted"""
    try:
        if created:
            Notification.objects.create(
                recipient=instance,
                title='Welcome!',
                message=f'Welcome to IMS, {instance.get_full_name()}!',
                notification_type='success'
            )
        elif kwargs.get('signal') == post_delete:
            # User deletion notification to admin
            admin = User.objects.filter(is_superuser=True).first()
            if admin:
                Notification.objects.create(
                    recipient=admin,
                    title='User Deleted',
                    message=f'User {instance.get_full_name()} has been deleted.',
                    notification_type='warning'
                )
    except Exception as e:
        print(f"Error creating notification: {str(e)}")

@receiver(post_save, sender=NotificationPreference)
def notification_preference_changed(sender, instance, created, **kwargs):
    """Create notification when notification preferences are changed"""
    if not created:
        Notification.objects.create(
            recipient=instance.user,
            title='Notification Settings Updated',
            message='Your notification preferences have been updated.',
            notification_type='info'
        ) 