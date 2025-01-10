from rest_framework import serializers
from .models import Evaluation
from django.contrib.auth import get_user_model

User = get_user_model()

class EvaluationSerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField(read_only=True)
    evaluator = serializers.StringRelatedField(read_only=True)
    evaluation_type_display = serializers.CharField(source='get_evaluation_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Evaluation
        fields = [
            'id', 'student', 'evaluator', 'internship',
            'evaluation_type', 'evaluation_type_display',
            'status', 'status_display', 'comments',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['student', 'evaluator', 'created_at', 'updated_at'] 