from django.contrib import admin
from .models import (
    Internship, Task, Message, Agreement, 
    InternshipPlan, Report, Evaluation,
    InternshipApplication, InternshipListing
)

@admin.register(Internship)
class InternshipAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'employer', 'mentor', 'status', 'start_date', 'end_date')
    list_filter = ('status',)
    search_fields = ('student__username', 'mentor__username', 'employer__username')
    date_hierarchy = 'start_date'

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'internship', 'assigned_by', 'status', 'due_date')
    list_filter = ('status',)
    search_fields = ('title', 'description')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('sender__username', 'recipient__username', 'content')

@admin.register(Agreement)
class AgreementAdmin(admin.ModelAdmin):
    list_display = ('id', 'internship', 'created_at', 'status')
    list_filter = ('status',)
    search_fields = ('internship__student__username', 'internship__organization__name')

@admin.register(InternshipPlan)
class InternshipPlanAdmin(admin.ModelAdmin):
    list_display = ('id', 'internship', 'created_at', 'status')
    list_filter = ('status',)
    search_fields = ('internship__student__username', 'objectives')

@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('id', 'report', 'evaluator', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('report__student__username', 'evaluator__username', 'comments')

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'internship', 'submitted_at')
    list_filter = ('submitted_at',)
    search_fields = ('internship__student__username', 'content')

@admin.register(InternshipApplication)
class InternshipApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'status', 'created_at', 'reviewed_at')
    list_filter = ('status', 'created_at')
    search_fields = ('student__username', 'internship__organization__name', 'cover_letter')
    
@admin.register(InternshipListing)
class InternshipListingAdmin(admin.ModelAdmin):
    list_display = ('id', 'organization', 'position', 'category', 'type', 'location', 'featured', 'active', 'applyDeadline')
    list_filter = ('category', 'type', 'featured', 'active', 'postedDate')
    search_fields = ('organization', 'position', 'description')
    list_editable = ('featured', 'active')
    date_hierarchy = 'postedDate'
    fieldsets = (
        ('Үндсэн мэдээлэл', {
            'fields': ('organization', 'position', 'category', 'type', 'location', 'duration')
        }),
        ('Дэлгэрэнгүй мэдээлэл', {
            'fields': ('description', 'requirements', 'benefits', 'responsibilities')
        }),
        ('Цалин', {
            'fields': ('salary', 'salary_amount')
        }),
        ('Тохиргоо', {
            'fields': ('logo', 'featured', 'active', 'applyDeadline')
        }),
        ('Холбоо барих', {
            'fields': ('contact_person',)
        }),
    )
