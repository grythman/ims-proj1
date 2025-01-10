from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q, OuterRef, Subquery
from django.utils import timezone
from .models import ChatRoom, Message, ChatRoomParticipant
from .serializers import ChatRoomSerializer, MessageSerializer
from .permissions import IsChatParticipant
from rest_framework.exceptions import PermissionDenied

# Create your views here.

class IsParticipant(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in obj.participants.all()

class ChatRoomViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ChatRoom.objects.prefetch_related('participants').all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated, IsParticipant]

    def get_queryset(self):
        return self.queryset.filter(participants=self.request.user)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsParticipant]

    def get_queryset(self):
        return Message.objects.filter(room_id=self.kwargs['room_pk']).select_related('sender')

    def perform_create(self, serializer):
        room = ChatRoom.objects.get(pk=self.kwargs['room_pk'])
        if self.request.user not in room.participants.all():
            raise PermissionDenied("You are not a participant in this chat room.")
        serializer.save(room=room, sender=self.request.user)
