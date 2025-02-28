from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Evaluation,
    EvaluationCriteria,
    EvaluationScore,
    EvaluationAttachment
)
from apps.internships.serializers import InternshipSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'user_type']

class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = [
            'id', 'name', 'description', 'weight',
            'evaluator_type', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_weight(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Weight must be between 0 and 100"
            )
        return value

class EvaluationScoreSerializer(serializers.ModelSerializer):
    criteria_name = serializers.CharField(source='criteria.name', read_only=True)
    criteria_weight = serializers.IntegerField(source='criteria.weight', read_only=True)

    class Meta:
        model = EvaluationScore
        fields = [
            'id', 'evaluation', 'criteria', 'criteria_name',
            'criteria_weight', 'score', 'comments',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_score(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Score must be between 0 and 100"
            )
        return value

class EvaluationAttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = EvaluationAttachment
        fields = [
            'id', 'evaluation', 'file', 'file_url',
            'file_name', 'file_type', 'file_size',
            'created_at'
        ]
        read_only_fields = ['file_url', 'created_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

class EvaluationSerializer(serializers.ModelSerializer):
    evaluator = UserSerializer(read_only=True)
    internship = InternshipSerializer(read_only=True)
    scores = EvaluationScoreSerializer(many=True, read_only=True)
    attachments = EvaluationAttachmentSerializer(many=True, read_only=True)
    total_score = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    evaluator_type_display = serializers.CharField(
        source='get_evaluator_type_display',
        read_only=True
    )

    class Meta:
        model = Evaluation
        fields = [
            'id', 'internship', 'evaluator', 'evaluator_type',
            'evaluator_type_display', 'status', 'status_display',
            'submission_date', 'comments', 'scores',
            'attachments', 'total_score', 'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'evaluator', 'evaluator_type', 'submission_date',
            'created_at', 'updated_at'
        ]

    def get_total_score(self, obj):
        return obj.calculate_total_score()

    def validate(self, data):
        if self.instance and self.instance.status != 'draft':
            raise serializers.ValidationError(
                "Can only update draft evaluations"
            )
        return data

class EvaluationCreateSerializer(serializers.ModelSerializer):
    internship_id = serializers.IntegerField(write_only=True)
    scores = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Evaluation
        fields = [
            'internship_id', 'comments', 'scores'
        ]

    def create(self, validated_data):
        scores_data = validated_data.pop('scores', [])
        internship_id = validated_data.pop('internship_id')

        # Create evaluation
        evaluation = Evaluation.objects.create(
            internship_id=internship_id,
            **validated_data
        )

        # Create scores
        for score_data in scores_data:
            EvaluationScore.objects.create(
                evaluation=evaluation,
                **score_data
            )

        return evaluation 