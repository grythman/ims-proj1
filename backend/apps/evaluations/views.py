from django.shortcuts import render
from rest_framework import viewsets, permissions, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, Avg, Count
from django.utils import timezone
from .models import (
    Evaluation,
    EvaluationCriteria,
    EvaluationScore,
    EvaluationAttachment
)
from .serializers import (
    EvaluationSerializer,
    EvaluationCreateSerializer,
    EvaluationCriteriaSerializer,
    EvaluationScoreSerializer,
    EvaluationAttachmentSerializer
)
from .permissions import CanCreateEvaluation, CanViewEvaluation, IsEvaluator
from apps.internships.models import Internship

# Create your views here.

class EvaluationViewSet(viewsets.ModelViewSet):
    serializer_class = EvaluationSerializer
    permission_classes = [permissions.IsAuthenticated, IsEvaluator]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'mentor':
            return Evaluation.objects.filter(
                evaluator=user,
                evaluator_type='mentor'
            )
        elif user.user_type == 'teacher':
            return Evaluation.objects.filter(
                evaluator=user,
                evaluator_type='teacher'
            )
        return Evaluation.objects.none()

    def perform_create(self, serializer):
        evaluation = serializer.save(
            evaluator=self.request.user,
            evaluator_type=self.request.user.user_type
        )

        # Create scores for each criteria
        criteria = EvaluationCriteria.objects.filter(
            evaluator_type=evaluation.evaluator_type
        )
        for criterion in criteria:
            EvaluationScore.objects.create(
                evaluation=evaluation,
                criteria=criterion,
                score=0
            )

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        evaluation = self.get_object()
        
        if evaluation.status != 'draft':
            return Response(
                {'error': 'Only draft evaluations can be submitted'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate all criteria have scores
        missing_scores = evaluation.scores.filter(score=0).exists()
        if missing_scores:
            return Response(
                {'error': 'All criteria must be scored before submission'},
                status=status.HTTP_400_BAD_REQUEST
            )

        evaluation.status = 'submitted'
        evaluation.submission_date = timezone.now()
        evaluation.save()

        return Response(EvaluationSerializer(evaluation).data)

    @action(detail=True)
    def scores(self, request, pk=None):
        evaluation = self.get_object()
        scores = evaluation.scores.all()
        return Response(EvaluationScoreSerializer(scores, many=True).data)

    @action(detail=True, methods=['post'])
    def update_scores(self, request, pk=None):
        evaluation = self.get_object()
        
        if evaluation.status != 'draft':
            return Response(
                {'error': 'Can only update scores for draft evaluations'},
                status=status.HTTP_400_BAD_REQUEST
            )

        scores_data = request.data.get('scores', [])
        for score_data in scores_data:
            criteria_id = score_data.get('criteria')
            score_value = score_data.get('score')
            comments = score_data.get('comments', '')

            try:
                score = evaluation.scores.get(criteria_id=criteria_id)
                score.score = score_value
                score.comments = comments
                score.save()
            except EvaluationScore.DoesNotExist:
                continue

        return Response(EvaluationSerializer(evaluation).data)

    @action(detail=False)
    def statistics(self, request):
        user = request.user
        evaluations = self.get_queryset()

        stats = {
            'total_evaluations': evaluations.count(),
            'pending_evaluations': evaluations.filter(status='draft').count(),
            'submitted_evaluations': evaluations.filter(status='submitted').count(),
            'average_scores': {}
        }

        # Calculate average scores per criteria
        criteria = EvaluationCriteria.objects.filter(
            evaluator_type=user.user_type
        )
        for criterion in criteria:
            avg_score = EvaluationScore.objects.filter(
                evaluation__in=evaluations,
                criteria=criterion
            ).aggregate(avg=Avg('score'))['avg'] or 0
            stats['average_scores'][criterion.name] = round(avg_score, 2)

        return Response(stats)

class EvaluationCriteriaViewSet(viewsets.ModelViewSet):
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = EvaluationCriteria.objects.all()
        evaluator_type = self.request.query_params.get('evaluator_type')
        if evaluator_type:
            queryset = queryset.filter(evaluator_type=evaluator_type)
        return queryset

class EvaluationScoreViewSet(viewsets.ModelViewSet):
    serializer_class = EvaluationScoreSerializer
    permission_classes = [permissions.IsAuthenticated, IsEvaluator]

    def get_queryset(self):
        return EvaluationScore.objects.filter(
            evaluation__evaluator=self.request.user
        )

class EvaluationAttachmentViewSet(viewsets.ModelViewSet):
    serializer_class = EvaluationAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsEvaluator]

    def get_queryset(self):
        return EvaluationAttachment.objects.filter(
            evaluation__evaluator=self.request.user
        )

    def perform_create(self, serializer):
        evaluation_id = self.request.data.get('evaluation')
        evaluation = Evaluation.objects.get(id=evaluation_id)
        
        if evaluation.evaluator != self.request.user:
            raise permissions.PermissionDenied(
                "You can only add attachments to your own evaluations"
            )
            
        serializer.save()

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
                'status': 'error',
                'message': 'Only teachers can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)

        evaluations = Evaluation.objects.filter(
            Q(evaluator=request.user) | 
            Q(internship__teacher=request.user)
        ).select_related('evaluated_student').order_by('-date')

        return Response({
            'status': 'success',
            'data': [{
                'id': eval.id,
                'student_name': f"{eval.evaluated_student.first_name} {eval.evaluated_student.last_name}",
                'created_at': eval.date,
                'is_final': eval.is_final,
                'score': eval.scores.aggregate(avg=Avg('score'))['avg'] or 0,
                'comments': eval.comments
            } for eval in evaluations]
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

class StudentTeacherEvaluationView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            # Get the student's internship
            internship = Internship.objects.filter(student=request.user).first()
            if not internship:
                return Response(
                    {"detail": "No internship found for this student"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Get the teacher's evaluation
            evaluation = Evaluation.objects.filter(
                internship=internship,
                evaluator_type='teacher'
            ).first()
            
            if not evaluation:
                return Response(
                    {"detail": "No teacher evaluation found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            serializer = EvaluationSerializer(evaluation)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
