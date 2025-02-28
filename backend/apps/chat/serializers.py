from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ChatRoom, Message, ChatRoomParticipant, MessageAttachment

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar']

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

class MessageAttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = MessageAttachment
        fields = [
            'id', 'file', 'file_url', 'file_name',
            'file_type', 'file_size', 'created_at'
        ]
        read_only_fields = ['file_url', 'created_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    attachments = MessageAttachmentSerializer(many=True, read_only=True)
    files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Message
        fields = [
            'id', 'room', 'sender', 'content',
            'is_read', 'created_at', 'updated_at',
            'attachments', 'files'
        ]
        read_only_fields = ['sender', 'is_read', 'created_at', 'updated_at']

    def create(self, validated_data):
        files = validated_data.pop('files', [])
        message = super().create(validated_data)

        # Handle file attachments
        for file in files:
            MessageAttachment.objects.create(
                message=message,
                file=file,
                file_name=file.name,
                file_type=file.content_type,
                file_size=file.size
            )

        return message

class ChatRoomSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    participant_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = ChatRoom
        fields = [
            'id', 'name', 'room_type', 'participants',
            'participant_ids', 'last_message', 'unread_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_last_message(self, obj):
        last_message = obj.messages.order_by('-created_at').first()
        if last_message:
            return {
                'id': last_message.id,
                'content': last_message.content,
                'sender_name': last_message.sender.get_full_name(),
                'created_at': last_message.created_at
            }
        return None

    def create(self, validated_data):
        participant_ids = validated_data.pop('participant_ids', [])
        chat_room = super().create(validated_data)

        # Add participants
        chat_room.participants.add(self.context['request'].user)
        for user_id in participant_ids:
            try:
                user = User.objects.get(id=user_id)
                chat_room.participants.add(user)
            except User.DoesNotExist:
                pass

        return chat_room

    def validate(self, data):
        room_type = data.get('room_type', 'private')
        participant_ids = data.get('participant_ids', [])

        if room_type == 'private' and len(participant_ids) > 1:
            raise serializers.ValidationError(
                "Private chat can only have 2 participants"
            )

        return data 