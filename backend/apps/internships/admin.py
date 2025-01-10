from django.contrib import admin
from .models import (
    Internship, Task, Agreement, 
    InternshipPlan, Report, Evaluation,
    PreliminaryReport
)

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = [
        'student', 
        'internship', 
        'report_type', 
        'status', 
        'submitted_at'
    ]
    list_filter = [
        'report_type', 
        'status', 
        'submitted_at'
    ]
    search_fields = [
        'student__username', 
        'student__first_name', 
        'student__last_name',
        'title',
        'content'
    ]
    readonly_fields = ['submitted_at', 'evaluated_at']
    raw_id_fields = ['student', 'internship', 'evaluated_by']

# Register other models
admin.site.register(Internship)
admin.site.register(Task)
admin.site.register(Agreement)
admin.site.register(InternshipPlan)
admin.site.register(Evaluation)
admin.site.register(PreliminaryReport)
