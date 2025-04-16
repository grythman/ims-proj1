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
        fields = ['id', 'name', 'category', 'description', 'max_score', 'weight']

class EvaluationScoreSerializer(serializers.ModelSerializer):
    criteria = EvaluationCriteriaSerializer(read_only=True)
    criteria_id = serializers.PrimaryKeyRelatedField(
        queryset=EvaluationCriteria.objects.all(),
        source='criteria',
        write_only=True
    )

    class Meta:
        model = EvaluationScore
        fields = ['id', 'criteria', 'criteria_id', 'score', 'comments']

    def validate_score(self, value):
        criteria = self.initial_data.get('criteria')
        if criteria and value > criteria.max_score:
            raise serializers.ValidationError(
                f"Score cannot exceed {criteria.max_score}"
            )
        return value

class EvaluationAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationAttachment
        fields = ['id', 'file', 'description', 'uploaded_at']
        read_only_fields = ['uploaded_at']

class EvaluationSerializer(serializers.ModelSerializer):
    evaluator = UserSerializer(read_only=True)
    evaluated_student = UserSerializer(read_only=True)
    scores = EvaluationScoreSerializer(many=True, required=False)
    attachments = EvaluationAttachmentSerializer(many=True, read_only=True)
    total_score = serializers.SerializerMethodField()

    class Meta:
        model = Evaluation
        fields = [
            'id', 'internship', 'evaluator', 'evaluated_student',
            'date', 'comments', 'is_final', 'scores', 'attachments',
            'total_score'
        ]
        read_only_fields = ['evaluator', 'date']

    def get_total_score(self, obj):
        scores = obj.scores.all()
        if not scores:
            return 0
        
        total_weight = sum(score.criteria.weight for score in scores)
        if total_weight == 0:
            return 0
            
        weighted_sum = sum(
            score.score * score.criteria.weight
            for score in scores
        )
        return round(weighted_sum / total_weight, 1)

    def create(self, validated_data):
        scores_data = validated_data.pop('scores', [])
        evaluation = Evaluation.objects.create(**validated_data)
        
        for score_data in scores_data:
            EvaluationScore.objects.create(evaluation=evaluation, **score_data)
            
        return evaluation

    def update(self, instance, validated_data):
        scores_data = validated_data.pop('scores', [])
        
        # Update evaluation fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update or create scores
        if scores_data:
            # Delete existing scores
            instance.scores.all().delete()
            
            # Create new scores
            for score_data in scores_data:
                EvaluationScore.objects.create(evaluation=instance, **score_data)
                
        return instance 