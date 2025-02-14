from rest_framework import serializers
from .models import Evaluation, EvaluationCriteria
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

class EvaluationCreateSerializer(serializers.ModelSerializer):
    student_id = serializers.IntegerField(write_only=True)
    internship_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Evaluation
        fields = [
            'student_id', 'internship_id', 'evaluation_type',
            'performance_rating', 'attendance_rating',
            'initiative_rating', 'teamwork_rating',
            'technical_skills_rating', 'comments'
        ]

    def validate(self, data):
        # Validate ratings are between 1 and 5
        rating_fields = [
            'performance_rating', 'attendance_rating',
            'initiative_rating', 'teamwork_rating',
            'technical_skills_rating'
        ]
        for field in rating_fields:
            if field in data:
                rating = data[field]
                if rating < 1 or rating > 5:
                    raise serializers.ValidationError(
                        f"{field} must be between 1 and 5"
                    )

        return data

    def create(self, validated_data):
        student_id = validated_data.pop('student_id')
        internship_id = validated_data.pop('internship_id')
        evaluator = self.context['request'].user

        # Create the evaluation
        evaluation = Evaluation.objects.create(
            student_id=student_id,
            internship_id=internship_id,
            evaluator=evaluator,
            **validated_data
        )

        return evaluation

class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = [
            'id', 'name', 'description', 'weight',
            'min_score', 'max_score', 'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_weight(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Weight must be between 0 and 100"
            )
        return value

    def validate(self, data):
        if data.get('min_score') >= data.get('max_score'):
            raise serializers.ValidationError(
                "Minimum score must be less than maximum score"
            )
        return data 