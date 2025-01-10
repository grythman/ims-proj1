from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class ChatRoom(models.Model):
    ROOM_TYPES = (
        ('private', 'Private'),
        ('group', 'Group'),
    )

    name = models.CharField(max_length=255, blank=True)
    type = models.CharField(max_length=10, choices=ROOM_TYPES, default='private')
    participants = models.ManyToManyField(User, related_name='chat_rooms')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_message_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-last_message_at']
        indexes = [
            models.Index(fields=['-last_message_at']),
            models.Index(fields=['type', '-last_message_at']),
        ]

    def __str__(self):
        return self.name or f"Chat {self.id}"

    def clean(self):
        if self.type == 'private':
            if self.participants.count() > 2:
                raise ValidationError("Private chats can only have 2 participants")

class ChatRoomParticipant(models.Model):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    last_read_at = models.DateTimeField(null=True, blank=True)
    joined_at = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)

    class Meta:
        unique_together = ['chat_room', 'user']
        indexes = [
            models.Index(fields=['chat_room', 'user']),
            models.Index(fields=['user', 'last_read_at']),
        ]

class Message(models.Model):
    room = models.ForeignKey(
        ChatRoom, 
        on_delete=models.CASCADE, 
        related_name='messages',
        db_index=True
    )
    sender = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        db_index=True
    )
    content = models.TextField()
    file = models.FileField(
        upload_to='chat_files/%Y/%m/%d/', 
        null=True, 
        blank=True
    )
    is_system_message = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    read_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='read_messages',
        through='MessageRead'
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['room', '-created_at'], name='message_room_created_at_idx'),
            models.Index(fields=['sender'], name='message_sender_idx'),
        ]

    def __str__(self):
        return f"Message {self.id} in Room {self.room.id}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update room's last_message_at
        self.room.last_message_at = self.created_at
        self.room.save(update_fields=['last_message_at'])

class MessageRead(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    read_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['message', 'user']
        indexes = [
            models.Index(fields=['message', 'user']),
            models.Index(fields=['user', 'read_at']),
        ]
