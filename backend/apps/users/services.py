from django.db.models import Q, Count
from django.utils import timezone
from .models import User

class UserService:
    @staticmethod
    def get_active_users():
        """Get all active users with their basic stats."""
        return User.objects.filter(is_active=True).select_related(
            'organization',
            'department'
        )

    @staticmethod
    def get_available_mentors():
        """Get all available mentors."""
        return User.objects.filter(
            user_type='mentor',
            is_active=True
        ).annotate(
            active_interns=Count('mentored_internships', filter=Q(mentored_internships__status='active'))
        )

    @staticmethod
    def update_user_activity(user):
        """Update user's last active timestamp."""
        user.last_active = timezone.now()
        user.save(update_fields=['last_active'])

    @staticmethod
    def get_user_statistics(user):
        """Get comprehensive statistics for a user."""
        stats = {
            'joined_days': (timezone.now() - user.date_joined).days,
            'last_active': user.last_active
        }

        if user.is_student:
            stats.update({
                'internships': user.internships.count(),
                'active_internship': user.internships.filter(status='active').first(),
                'reports_submitted': user.submitted_reports.count(),
                'tasks_completed': user.tasks.filter(status='completed').count()
            })
        elif user.is_mentor:
            stats.update({
                'active_interns': user.mentored_internships.filter(status='active').count(),
                'total_mentored': user.mentored_internships.count(),
                'reports_reviewed': user.reviewed_reports.count()
            })

        return stats 