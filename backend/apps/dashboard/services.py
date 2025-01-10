from django.utils import timezone
from django.db.models import Count, Q
from .models import DashboardMetric, Activity
from apps.users.models import User
from apps.internships.models import Internship

class DashboardService:
    @staticmethod
    def update_metrics():
        """Update daily dashboard metrics."""
        today = timezone.now().date()

        # Update student count
        DashboardMetric.objects.update_or_create(
            name='student_count',
            date=today,
            defaults={
                'value': User.objects.filter(user_type='student').count()
            }
        )

        # Update active internships
        DashboardMetric.objects.update_or_create(
            name='active_internships',
            date=today,
            defaults={
                'value': Internship.objects.filter(status='active').count()
            }
        )

        # Update completion rate
        total_internships = Internship.objects.count()
        completed_internships = Internship.objects.filter(status='completed').count()
        completion_rate = (completed_internships / total_internships * 100) if total_internships > 0 else 0

        DashboardMetric.objects.update_or_create(
            name='completion_rate',
            date=today,
            defaults={
                'value': int(completion_rate)
            }
        )

        # Update mentor count
        DashboardMetric.objects.update_or_create(
            name='mentor_count',
            date=today,
            defaults={
                'value': User.objects.filter(user_type='mentor', is_active=True).count()
            }
        )

    @staticmethod
    def log_activity(user, activity_type, description):
        """Log a new activity."""
        return Activity.objects.create(
            user=user,
            activity_type=activity_type,
            description=description
        )

    @staticmethod
    def get_user_stats(user):
        """Get statistics for a specific user."""
        if user.user_type == 'student':
            return {
                'internships': Internship.objects.filter(student=user).count(),
                'active_internship': Internship.objects.filter(
                    student=user,
                    status='active'
                ).first(),
                'completed_internships': Internship.objects.filter(
                    student=user,
                    status='completed'
                ).count()
            }
        elif user.user_type == 'mentor':
            return {
                'mentored_students': Internship.objects.filter(
                    mentor=user
                ).values('student').distinct().count(),
                'active_internships': Internship.objects.filter(
                    mentor=user,
                    status='active'
                ).count()
            }
        return {} 