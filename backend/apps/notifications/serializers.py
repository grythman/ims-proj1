from rest_framework import serializers
from .models import Notification, NotificationPreference

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'notification_type',
            'related_object_id', 'related_object_type',
            'is_read', 'created_at'
        ]
        read_only_fields = ['recipient']

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = [
            'email_notifications', 'push_notifications',
            'report_notifications', 'task_notifications',
            'meeting_notifications', 'message_notifications'
        ] 