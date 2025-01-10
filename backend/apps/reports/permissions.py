from rest_framework import permissions

class IsReportParticipant(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # Allow full access to teachers
        if user.user_type == 'teacher':
            return True
            
        # For ReportComment objects
        if hasattr(obj, 'report'):
            report = obj.report
        else:
            report = obj

        # Check if user is the student or mentor of the report
        return (user == report.student or 
                user == report.mentor or 
                user.has_perm('reports.can_review_reports'))

class CanReviewReports(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.user_type in ['teacher', 'mentor'] or
            request.user.has_perm('reports.can_review_reports')
        ) 