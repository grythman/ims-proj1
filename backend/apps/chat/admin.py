from django.contrib import admin
from .models import ChatRoom, Message, ForumThread, ForumPost

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'created_at')
    list_filter = ('type', 'created_at')
    search_fields = ('name', 'participants__username')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'room', 'created_at')
    list_filter = ('created_at', 'room')
    search_fields = ('content', 'sender__username')

@admin.register(ForumThread)
class ForumThreadAdmin(admin.ModelAdmin):
    list_display = ('title', 'creator', 'is_pinned', 'created_at')
    list_filter = ('is_pinned', 'created_at')
    search_fields = ('title', 'content')

@admin.register(ForumPost)
class ForumPostAdmin(admin.ModelAdmin):
    list_display = ('thread', 'author', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'author__username')
