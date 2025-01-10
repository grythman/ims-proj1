from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Message, ChatRoom
from apps.notifications.services import NotificationService

@receiver(post_save, sender=Message)
def message_post_save(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        room_group_name = f'chat_{instance.room.id}'
        
        # Prepare message data
        message_data = {
            'id': instance.id,
            'content': instance.content,
            'sender': {
                'id': instance.sender.id,
                'username': instance.sender.username,
                'full_name': instance.sender.get_full_name()
            },
            'created_at': instance.created_at.isoformat(),
            'file_url': instance.file.url if instance.file else None
        }
        
        # Send to websocket group
        async_to_sync(channel_layer.group_send)(
            room_group_name,
            {
                'type': 'chat_message',
                'message': message_data
            }
        )

        # Send notifications to other participants
        participants = instance.room.participants.exclude(id=instance.sender.id)
        for participant in participants:
            NotificationService.create_notification(
                recipient=participant,
                title=f'New message from {instance.sender.get_full_name()}',
                message=instance.content[:100] + '...' if len(instance.content) > 100 else instance.content,
                notification_type='message',
                related_object_id=instance.room.id,
                related_object_type='chatroom'
            )

@receiver([post_save, post_delete], sender=ChatRoom)
def chatroom_update(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    
    # Notify all participants about room updates
    for participant in instance.participants.all():
        async_to_sync(channel_layer.group_send)(
            f'user_{participant.id}',
            {
                'type': 'chatroom_update',
                'room_id': instance.id,
                'action': 'delete' if kwargs.get('deleted', False) else 'update'
            }
        ) 