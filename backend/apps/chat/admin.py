from django.contrib import admin
from .models import ChatRoom, Message, ChatRoomParticipant, MessageAttachment

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'room_type', 'created_at')
    list_filter = ('room_type', 'created_at')
    search_fields = ('name',)
    date_hierarchy = 'created_at'

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'room', 'created_at')
    list_filter = ('room', 'created_at')
    search_fields = ('content', 'sender__username')
    date_hierarchy = 'created_at'

@admin.register(ChatRoomParticipant)
class ChatRoomParticipantAdmin(admin.ModelAdmin):
    list_display = ('chat_room', 'user', 'joined_at')
    list_filter = ('chat_room', 'joined_at')
    search_fields = ('user__username',)
    date_hierarchy = 'joined_at'

@admin.register(MessageAttachment)
class MessageAttachmentAdmin(admin.ModelAdmin):
    list_display = ('message', 'file_name', 'file_type', 'created_at')
    list_filter = ('file_type', 'created_at')
    search_fields = ('file_name',)
    date_hierarchy = 'created_at'
