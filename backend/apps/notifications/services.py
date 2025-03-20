from django.utils import timezone
from .models import Notification

class NotificationService:
    @staticmethod
    def create_notification(recipient, title, message, notification_type='info'):
        """Create a new notification"""
        try:
            notification = Notification.objects.create(
                recipient=recipient,
                title=title,
                message=message,
                notification_type=notification_type
            )
            return notification
        except Exception as e:
            print(f"Error creating notification: {str(e)}")
            return None

    @staticmethod
    def create_bulk_notifications(notifications_data):
        """Create multiple notifications at once."""
        try:
            notifications = []
            for data in notifications_data:
                notification = Notification.objects.create(**data)
                notifications.append(notification)
            return notifications
        except Exception as e:
            print(f"Error creating bulk notifications: {str(e)}")
            return []

    @staticmethod
    def mark_as_read(notification_id):
        """Mark a notification as read"""
        try:
            notification = Notification.objects.get(id=notification_id)
            notification.is_read = True
            notification.save()
            return True
        except Notification.DoesNotExist:
            return False

    @staticmethod
    def mark_all_as_read(user):
        """Mark all notifications as read for a user"""
        try:
            Notification.objects.filter(recipient=user, is_read=False).update(is_read=True)
            return True
        except Exception:
            return False

    @staticmethod
    def get_unread_count(user):
        """Get count of unread notifications for a user"""
        return Notification.objects.filter(recipient=user, is_read=False).count()

    @staticmethod
    def get_recent_notifications(user, limit=5):
        """Get recent notifications for a user"""
        return Notification.objects.filter(recipient=user).order_by('-created_at')[:limit]

    @staticmethod
    def delete_old_notifications(days=30):
        """Delete notifications older than specified days."""
        try:
            cutoff_date = timezone.now() - timezone.timedelta(days=days)
            Notification.objects.filter(created_at__lt=cutoff_date).delete()
            return True
        except Exception as e:
            print(f"Error deleting old notifications: {str(e)}")
            return False