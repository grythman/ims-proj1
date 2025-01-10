import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from .models import ChatRoom, Message, ChatRoomParticipant
from .serializers import MessageSerializer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        self.user = self.scope['user']

        # Verify user is authenticated
        if not self.user.is_authenticated:
            await self.close()
            return

        # Verify user is a participant
        try:
            self.participant = await self.verify_participant()
        except ObjectDoesNotExist:
            await self.close()
            return

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        # Join user's personal group for notifications
        await self.channel_layer.group_add(
            f'user_{self.user.id}',
            self.channel_name
        )
        
        # Accept the connection
        await self.accept()

        # Update user's online status
        await self.update_user_status(True)

        # Send user joined message
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_join',
                'user': self.user.username,
                'timestamp': timezone.now().isoformat()
            }
        )

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            # Update user's online status
            await self.update_user_status(False)
            
            # Send user left message
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_leave',
                    'user': self.user.username,
                    'timestamp': timezone.now().isoformat()
                }
            )
            
            # Leave room group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            
            # Leave user's personal group
            await self.channel_layer.group_discard(
                f'user_{self.user.id}',
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type', 'message')
            
            if message_type == 'message':
                message = text_data_json['message']
                # Save message to database
                saved_message = await self.save_message(message)
                
                # Send message to room group
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': message,
                        'user': self.user.username,
                        'timestamp': saved_message.created_at.isoformat()
                    }
                )
            elif message_type == 'typing':
                # Broadcast typing status
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'user_typing',
                        'user': self.user.username
                    }
                )
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'error': 'Invalid message format'
            }))
        except KeyError:
            await self.send(text_data=json.dumps({
                'error': 'Missing required fields'
            }))

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message'],
            'user': event['user'],
            'timestamp': event['timestamp']
        }))

    async def user_typing(self, event):
        # Send typing status to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'typing',
            'user': event['user']
        }))

    async def user_join(self, event):
        # Send user joined notification
        await self.send(text_data=json.dumps({
            'type': 'user_join',
            'user': event['user']
        }))

    async def user_leave(self, event):
        # Send user left notification
        await self.send(text_data=json.dumps({
            'type': 'user_leave',
            'user': event['user']
        }))

    @database_sync_to_async
    def verify_participant(self):
        return ChatRoomParticipant.objects.select_related('chat_room').get(
            chat_room_id=self.room_id,
            user=self.user
        )

    @database_sync_to_async
    def update_user_status(self, is_online):
        self.participant.is_online = is_online
        self.participant.last_seen = timezone.now()
        self.participant.save(update_fields=['is_online', 'last_seen'])

    @database_sync_to_async
    def save_message(self, content):
        message = Message.objects.create(
            room_id=self.room_id,
            sender=self.user,
            content=content
        )
        # Mark as read by sender
        message.read_by.add(self.user)
        return message 