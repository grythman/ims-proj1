from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q, OuterRef, Subquery, Max
from django.utils import timezone
from .models import ChatRoom, Message, ChatRoomParticipant, MessageAttachment
from .serializers import (
    ChatRoomSerializer,
    MessageSerializer,
    MessageAttachmentSerializer
)
from .permissions import IsChatParticipant
from rest_framework.exceptions import PermissionDenied

# Create your views here.

class IsParticipant(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in obj.participants.all()

class ChatRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatRoom.objects.filter(
            participants=self.request.user
        ).annotate(
            unread_count=Count(
                'messages',
                filter=Q(messages__is_read=False) & ~Q(messages__sender=self.request.user)
            ),
            last_message_time=Max('messages__created_at')
        ).order_by('-last_message_time')

    def perform_create(self, serializer):
        chat_room = serializer.save()
        chat_room.participants.add(self.request.user)
        
        # Add other participants
        for participant_id in self.request.data.get('participants', []):
            chat_room.participants.add(participant_id)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        chat_room = self.get_object()
        Message.objects.filter(
            room=chat_room,
            is_read=False
        ).exclude(
            sender=request.user
        ).update(is_read=True)
        
        return Response({'status': 'messages marked as read'})

    @action(detail=True)
    def messages(self, request, pk=None):
        chat_room = self.get_object()
        messages = Message.objects.filter(room=chat_room)
        
        # Optional pagination
        page = self.paginate_queryset(messages)
        if page is not None:
            serializer = MessageSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(
            room__participants=self.request.user
        )

    def perform_create(self, serializer):
        message = serializer.save(sender=self.request.user)
        
        # Handle file attachments
        files = self.request.FILES.getlist('files', [])
        for file in files:
            MessageAttachment.objects.create(
                message=message,
                file=file,
                file_name=file.name,
                file_type=file.content_type,
                file_size=file.size
            )

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        message = self.get_object()
        if message.room.participants.filter(id=request.user.id).exists():
            message.is_read = True
            message.save()
            return Response({'status': 'message marked as read'})
        return Response(
            {'error': 'You are not a participant of this chat'},
            status=status.HTTP_403_FORBIDDEN
        )

class MessageAttachmentViewSet(viewsets.ModelViewSet):
    serializer_class = MessageAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MessageAttachment.objects.filter(
            message__room__participants=self.request.user
        )

    def perform_create(self, serializer):
        message_id = self.request.data.get('message')
        message = Message.objects.get(id=message_id)
        
        if not message.room.participants.filter(id=self.request.user.id).exists():
            raise permissions.PermissionDenied(
                "You are not a participant of this chat"
            )
            
        serializer.save()
