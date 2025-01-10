from django.shortcuts import render
from rest_framework import viewsets, permissions, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Evaluation, EvaluationCriteria
from .serializers import (
    EvaluationSerializer,
    EvaluationCreateSerializer,
    EvaluationCriteriaSerializer
)
from .permissions import CanCreateEvaluation, CanViewEvaluation

# Create your views here.

class EvaluationViewSet(viewsets.ModelViewSet):
    serializer_class = EvaluationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'student':
            return Evaluation.objects.filter(student=user).select_related('evaluator', 'internship')
        elif user.user_type in ['mentor', 'teacher']:
            return Evaluation.objects.filter(evaluator=user).select_related('student', 'internship')
        return Evaluation.objects.none()

    def perform_create(self, serializer):
        serializer.save(evaluator=self.request.user)

class EvaluationCriteriaViewSet(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.filter(is_active=True)
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

class MentorEvaluationsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.user_type != 'mentor':
            return Response({
                'error': 'Only mentors can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)

        evaluations = Evaluation.objects.filter(
            Q(evaluator=request.user) | 
            Q(internship__mentor=request.user)
        ).order_by('-created_at')

        return Response({
            'status': 'success',
            'data': EvaluationSerializer(evaluations, many=True).data
        })

class TeacherEvaluationsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.user_type != 'teacher':
            return Response({
                'error': 'Only teachers can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)

        evaluations = Evaluation.objects.all().order_by('-created_at')
        return Response({
            'status': 'success',
            'data': EvaluationSerializer(evaluations, many=True).data
        })

class StudentEvaluationsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, student_id):
        try:
            evaluations = Evaluation.objects.filter(
                student_id=student_id
            ).order_by('-created_at')
            
            return Response({
                'status': 'success',
                'data': EvaluationSerializer(evaluations, many=True).data
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TeacherMentorEvaluationsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.user_type != 'teacher':
            return Response({
                'error': 'Only teachers can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)

        try:
            # Get all mentor evaluations
            evaluations = Evaluation.objects.filter(
                evaluation_type='mentor'
            ).select_related(
                'student', 
                'evaluator', 
                'internship'
            ).order_by('-created_at')

            return Response({
                'status': 'success',
                'data': EvaluationSerializer(evaluations, many=True).data
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
