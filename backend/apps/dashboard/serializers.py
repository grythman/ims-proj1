from rest_framework import serializers
from .models import DashboardStat, DashboardMetric, Activity
from apps.users.serializers import UserSerializer

class DashboardStatSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    completion_rate = serializers.SerializerMethodField()

    class Meta:
        model = DashboardStat
        fields = [
            'id', 'organization_name', 'total_internships',
            'active_internships', 'completed_internships',
            'total_students', 'completion_rate',
            'created_at', 'updated_at'
        ]

    def get_completion_rate(self, obj):
        if obj.total_internships > 0:
            return (obj.completed_internships / obj.total_internships) * 100
        return 0

class DashboardMetricSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source='get_name_display', read_only=True)
    trend = serializers.SerializerMethodField()

    class Meta:
        model = DashboardMetric
        fields = ['name', 'display_name', 'value', 'date', 'trend']

    def get_trend(self, obj):
        previous = DashboardMetric.objects.filter(
            name=obj.name,
            date__lt=obj.date
        ).order_by('-date').first()

        if previous and previous.value > 0:
            change = ((obj.value - previous.value) / previous.value) * 100
            return f"{change:+.1f}%"
        return "+0%"

class ActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    activity_type_display = serializers.CharField(source='get_activity_type_display', read_only=True)
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = [
            'id', 'user', 'activity_type', 'activity_type_display',
            'description', 'created_at', 'time_ago'
        ]

    def get_time_ago(self, obj):
        from django.utils import timezone
        from datetime import timedelta

        now = timezone.now()
        diff = now - obj.created_at

        if diff < timedelta(minutes=1):
            return 'just now'
        elif diff < timedelta(hours=1):
            minutes = int(diff.total_seconds() / 60)
            return f'{minutes} minute{"s" if minutes != 1 else ""} ago'
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() / 3600)
            return f'{hours} hour{"s" if hours != 1 else ""} ago'
        elif diff < timedelta(days=30):
            days = diff.days
            return f'{days} day{"s" if days != 1 else ""} ago'
        else:
            months = int(diff.days / 30)
            return f'{months} month{"s" if months != 1 else ""} ago'