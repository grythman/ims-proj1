from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Activity, NotificationPreference

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_active')
    list_filter = ('is_active', 'user_type', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone', 'bio', 'avatar')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('User Type', {'fields': ('user_type',)}),
        ('Student Info', {'fields': ('student_id', 'major', 'year_of_study'), 'classes': ('collapse',)}),
        ('Mentor Info', {'fields': ('company', 'position', 'expertise'), 'classes': ('collapse',)}),
        ('Teacher Info', {'fields': ('department_name', 'faculty_id', 'subject_area'), 'classes': ('collapse',)}),
    )

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'created_at', 'description')
    list_filter = ('activity_type', 'created_at')
    search_fields = ('user__username', 'description')
    ordering = ('-created_at',)

@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'email_notifications', 'push_notifications', 'sms_notifications')
    list_filter = ('email_notifications', 'push_notifications', 'sms_notifications')
    search_fields = ('user__username',)
