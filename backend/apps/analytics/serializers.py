from rest_framework import serializers

class InternshipAnalyticsSerializer(serializers.Serializer):
    by_status = serializers.DictField(
        child=serializers.IntegerField()
    )
    by_month = serializers.ListField(
        child=serializers.DictField(
            child=serializers.IntegerField()
        )
    )
    avg_duration = serializers.IntegerField()

class ReportAnalyticsSerializer(serializers.Serializer):
    by_status = serializers.DictField(
        child=serializers.IntegerField()
    )
    by_type = serializers.DictField(
        child=serializers.IntegerField()
    )
    by_month = serializers.ListField(
        child=serializers.DictField(
            child=serializers.IntegerField()
        )
    )
    avg_review_time = serializers.IntegerField()

class EvaluationAnalyticsSerializer(serializers.Serializer):
    by_type = serializers.DictField(
        child=serializers.IntegerField()
    )
    avg_scores = serializers.DictField(
        child=serializers.FloatField()
    )
    by_month = serializers.ListField(
        child=serializers.DictField(
            child=serializers.IntegerField()
        )
    )

class UserAnalyticsSerializer(serializers.Serializer):
    by_type = serializers.DictField(
        child=serializers.IntegerField()
    )
    by_month = serializers.ListField(
        child=serializers.DictField(
            child=serializers.IntegerField()
        )
    )
    active_users = serializers.IntegerField()
    total_users = serializers.IntegerField()

class OverviewAnalyticsSerializer(serializers.Serializer):
    users = serializers.DictField(
        child=serializers.IntegerField()
    )
    internships = serializers.DictField(
        child=serializers.IntegerField()
    )
    reports = serializers.DictField(
        child=serializers.IntegerField()
    )
    scores = serializers.DictField(
        child=serializers.FloatField()
    ) 