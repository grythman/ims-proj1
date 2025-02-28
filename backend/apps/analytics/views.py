from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg, Count, Q, F
from django.db.models.functions import TruncMonth, ExtractYear
from django.utils import timezone
from apps.internships.models import Internship, Report, Evaluation
from apps.users.models import User
from .serializers import (
    InternshipAnalyticsSerializer,
    ReportAnalyticsSerializer,
    EvaluationAnalyticsSerializer,
    UserAnalyticsSerializer
)

class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False)
    def overview(self, request):
        """Get overview statistics"""
        try:
            # Get counts
            total_students = User.objects.filter(user_type='student').count()
            total_mentors = User.objects.filter(user_type='mentor').count()
            total_internships = Internship.objects.count()
            active_internships = Internship.objects.filter(status='active').count()
            total_reports = Report.objects.count()
            pending_reports = Report.objects.filter(status='pending').count()

            # Get average scores
            avg_scores = Evaluation.objects.aggregate(
                avg_performance=Avg('scores__score', filter=Q(
                    scores__criteria__name='Performance'
                )),
                avg_attendance=Avg('scores__score', filter=Q(
                    scores__criteria__name='Attendance'
                )),
                avg_initiative=Avg('scores__score', filter=Q(
                    scores__criteria__name='Initiative'
                ))
            )

            data = {
                'users': {
                    'total_students': total_students,
                    'total_mentors': total_mentors
                },
                'internships': {
                    'total': total_internships,
                    'active': active_internships,
                    'completion_rate': round(
                        (total_internships - active_internships) / total_internships * 100
                        if total_internships > 0 else 0,
                        2
                    )
                },
                'reports': {
                    'total': total_reports,
                    'pending': pending_reports,
                    'completion_rate': round(
                        (total_reports - pending_reports) / total_reports * 100
                        if total_reports > 0 else 0,
                        2
                    )
                },
                'scores': {
                    'performance': round(avg_scores['avg_performance'] or 0, 2),
                    'attendance': round(avg_scores['avg_attendance'] or 0, 2),
                    'initiative': round(avg_scores['avg_initiative'] or 0, 2)
                }
            }

            return Response(data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False)
    def internships(self, request):
        """Get internship analytics"""
        try:
            # Get internships by status
            status_counts = Internship.objects.values(
                'status'
            ).annotate(
                count=Count('id')
            )

            # Get internships by month
            monthly_counts = Internship.objects.annotate(
                month=TruncMonth('start_date')
            ).values(
                'month'
            ).annotate(
                count=Count('id')
            ).order_by('month')

            # Get average duration
            avg_duration = Internship.objects.annotate(
                duration=F('end_date') - F('start_date')
            ).aggregate(
                avg_duration=Avg('duration')
            )['avg_duration']

            data = {
                'by_status': {
                    item['status']: item['count']
                    for item in status_counts
                },
                'by_month': [
                    {
                        'month': item['month'].strftime('%Y-%m'),
                        'count': item['count']
                    }
                    for item in monthly_counts
                ],
                'avg_duration': avg_duration.days if avg_duration else 0
            }

            return Response(data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False)
    def reports(self, request):
        """Get report analytics"""
        try:
            # Get reports by status
            status_counts = Report.objects.values(
                'status'
            ).annotate(
                count=Count('id')
            )

            # Get reports by type
            type_counts = Report.objects.values(
                'report_type'
            ).annotate(
                count=Count('id')
            )

            # Get reports by month
            monthly_counts = Report.objects.annotate(
                month=TruncMonth('created_at')
            ).values(
                'month'
            ).annotate(
                count=Count('id')
            ).order_by('month')

            # Get average review time
            avg_review_time = Report.objects.filter(
                status__in=['approved', 'rejected']
            ).annotate(
                review_time=F('review_date') - F('submission_date')
            ).aggregate(
                avg_review_time=Avg('review_time')
            )['avg_review_time']

            data = {
                'by_status': {
                    item['status']: item['count']
                    for item in status_counts
                },
                'by_type': {
                    item['report_type']: item['count']
                    for item in type_counts
                },
                'by_month': [
                    {
                        'month': item['month'].strftime('%Y-%m'),
                        'count': item['count']
                    }
                    for item in monthly_counts
                ],
                'avg_review_time': avg_review_time.days if avg_review_time else 0
            }

            return Response(data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False)
    def evaluations(self, request):
        """Get evaluation analytics"""
        try:
            # Get evaluations by type
            type_counts = Evaluation.objects.values(
                'evaluator_type'
            ).annotate(
                count=Count('id')
            )

            # Get average scores by criteria
            avg_scores = Evaluation.objects.values(
                'scores__criteria__name'
            ).annotate(
                avg_score=Avg('scores__score')
            )

            # Get evaluations by month
            monthly_counts = Evaluation.objects.annotate(
                month=TruncMonth('created_at')
            ).values(
                'month'
            ).annotate(
                count=Count('id')
            ).order_by('month')

            data = {
                'by_type': {
                    item['evaluator_type']: item['count']
                    for item in type_counts
                },
                'avg_scores': {
                    item['scores__criteria__name']: round(item['avg_score'], 2)
                    for item in avg_scores
                    if item['scores__criteria__name']
                },
                'by_month': [
                    {
                        'month': item['month'].strftime('%Y-%m'),
                        'count': item['count']
                    }
                    for item in monthly_counts
                ]
            }

            return Response(data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False)
    def users(self, request):
        """Get user analytics"""
        try:
            # Get users by type
            type_counts = User.objects.values(
                'user_type'
            ).annotate(
                count=Count('id')
            )

            # Get users by registration month
            monthly_counts = User.objects.annotate(
                month=TruncMonth('date_joined')
            ).values(
                'month'
            ).annotate(
                count=Count('id')
            ).order_by('month')

            # Get active users
            active_users = User.objects.filter(
                last_login__gte=timezone.now() - timezone.timedelta(days=30)
            ).count()

            data = {
                'by_type': {
                    item['user_type']: item['count']
                    for item in type_counts
                },
                'by_month': [
                    {
                        'month': item['month'].strftime('%Y-%m'),
                        'count': item['count']
                    }
                    for item in monthly_counts
                ],
                'active_users': active_users,
                'total_users': User.objects.count()
            }

            return Response(data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 