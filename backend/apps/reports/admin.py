from django.contrib import admin
from .models import Report, ReportComment

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'student', 'internship', 'report_type', 'status', 'created_at')
    list_filter = ('status', 'report_type', 'created_at')
    search_fields = ('title', 'content', 'student__username', 'internship__student__username')
    raw_id_fields = ('student', 'internship')
    date_hierarchy = 'created_at'

@admin.register(ReportComment)
class ReportCommentAdmin(admin.ModelAdmin):
    list_display = ('report', 'author', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'author__username', 'report__title')
    raw_id_fields = ('report', 'author')
