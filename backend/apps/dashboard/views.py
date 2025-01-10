from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from apps.internships.models import Internship, Report
from apps.notifications.models import Notification
from django.db.models import Count, Avg

class StudentDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        internship = Internship.objects.filter(student=user, status='active').select_related('organization').first()
        reports_submitted = Report.objects.filter(student=user).count()
        notifications = Notification.objects.filter(recipient=user, is_read=False).count()

        data = {
            'internship': {
                'company_name': internship.organization.name if internship else None,
                'start_date': internship.start_date if internship else None,
                'end_date': internship.end_date if internship else None,
            },
            'reports_submitted': reports_submitted,
            'unread_notifications': notifications,
        }
        return Response(data)
