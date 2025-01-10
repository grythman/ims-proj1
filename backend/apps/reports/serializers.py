from rest_framework import serializers
from django.utils import timezone
from .models import Report, ReportComment, ReportTemplate
from apps.users.serializers import UserSerializer

class ReportCommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    attachment_url = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = ReportComment
        fields = [
            'id', 'author', 'content', 'attachment',
            'attachment_url', 'created_at', 'time_ago'
        ]
        read_only_fields = ['author']

    def get_attachment_url(self, obj):
        if obj.attachment:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.attachment.url)
        return None

    def get_time_ago(self, obj):
        now = timezone.now()
        diff = now - obj.created_at

        if diff.days > 30:
            months = diff.days // 30
            return f"{months} month{'s' if months != 1 else ''} ago"
        elif diff.days > 0:
            return f"{diff.days} day{'s' if diff.days != 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        else:
            return "just now"

class ReportTemplateSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    report_type_display = serializers.CharField(source='get_report_type_display', read_only=True)

    class Meta:
        model = ReportTemplate
        fields = [
            'id', 'name', 'description', 'content_template',
            'report_type', 'report_type_display', 'is_active',
            'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by']

class ReportSerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField(read_only=True)
    internship = serializers.StringRelatedField(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    report_type_display = serializers.CharField(source='get_report_type_display', read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            'id', 'title', 'content', 'student', 'internship',
            'report_type', 'report_type_display', 'status',
            'status_display', 'feedback', 'file', 'file_url',
            'submission_date', 'review_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['student', 'status', 'submission_date', 'review_date', 'created_at', 'updated_at']

    def get_file_url(self, obj):
        if obj.file and hasattr(obj.file, 'url'):
            request = self.context.get('request')
            return request.build_absolute_uri(obj.file.url)
        return None

    def validate(self, data):
        if self.instance and self.instance.status not in ['draft', 'revised']:
            raise serializers.ValidationError(
                "Can only edit draft or revised reports"
            )
        return data