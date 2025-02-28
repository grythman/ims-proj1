from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class ChatRoom(models.Model):
    ROOM_TYPES = [
        ('private', 'Private Chat'),
        ('group', 'Group Chat'),
    ]

    name = models.CharField(max_length=255, blank=True)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES, default='private')
    participants = models.ManyToManyField(User, related_name='chat_rooms')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['room_type']),
            models.Index(fields=['-updated_at']),
        ]

    def __str__(self):
        return f"{self.name or 'Chat Room'} ({self.get_room_type_display()})"

    def clean(self):
        if self.room_type == 'private' and self.participants.count() > 2:
            raise ValidationError("Private chat can only have 2 participants")

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
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_messages')
    content = models.TextField()
    file = models.FileField(upload_to='chat_files/%Y/%m/%d/', null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['room', 'created_at']),
            models.Index(fields=['sender', 'is_read']),
        ]

    def __str__(self):
        return f"Message from {self.sender.get_full_name()} at {self.created_at}"

class MessageAttachment(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='chat_attachments/%Y/%m/%d/')
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=100)
    file_size = models.IntegerField()  # Size in bytes
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['message', 'created_at']),
        ]

    def __str__(self):
        return f"Attachment: {self.file_name}"

    def clean(self):
        if self.file_size > 25 * 1024 * 1024:  # 25MB limit
            raise ValidationError("File size cannot exceed 25MB")
