from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ChatRoom, Message, ChatRoomParticipant

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class ChatParticipantSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoomParticipant
        fields = [
            'user_id', 'username', 'full_name', 
            'last_read_at', 'joined_at', 'is_admin',
            'unread_count'
        ]

    def get_unread_count(self, obj):
        if hasattr(obj, 'unread_count'):
            return obj.unread_count
        return 0

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'room', 'sender', 'content', 'created_at']

class ChatRoomSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'participants'] 