from rest_framework import viewsets, permissions, filters, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q, Avg
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from .models import Internship, Task, Agreement, InternshipPlan, PreliminaryReport, Evaluation, Report
from .serializers import (
    InternshipSerializer, 
    InternshipCreateSerializer,
    TaskSerializer,
    AgreementSerializer, 
    AgreementCreateSerializer,
    InternshipPlanSerializer,
    InternshipRegistrationSerializer,
    PreliminaryReportSerializer,
    EvaluationSerializer,
    TeacherReportReviewSerializer,
    StudentProgressSerializer,
    FinalEvaluationSerializer,
    ReportSerializer,
    ReportEvaluationSerializer,
    DashboardSerializer
)
from .permissions import IsInternshipParticipant, IsAgreementParticipant, IsTeacher, IsStudent
from apps.notifications.services import NotificationService
from .services import AgreementService, InternshipPlanService
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.conf import settings
from django.core.exceptions import ValidationError
from rest_framework.exceptions import PermissionDenied

User = get_user_model()

class InternshipViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsInternshipParticipant]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'organization', 'department']
    search_fields = ['title', 'description', 'student__username', 'mentor__username']
    ordering_fields = ['start_date', 'created_at', 'hours_completed']

    def get_queryset(self):
        queryset = Internship.objects.select_related(
            'student', 'mentor', 'organization', 'department'
        ).prefetch_related(
            'tasks'
        ).annotate(
            total_tasks=Count('tasks'),
            completed_tasks=Count('tasks', filter=Q(tasks__status='completed'))
        )

        user = self.request.user
        if user.user_type == 'student':
            return queryset.filter(student=user)
        elif user.user_type == 'mentor':
            return queryset.filter(mentor=user)
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return InternshipCreateSerializer
        return InternshipSerializer

    @action(detail=True, methods=['post'])
    def add_hours(self, request, pk=None):
        internship = self.get_object()
        hours = int(request.data.get('hours', 0))
        description = request.data.get('description', '')

        if hours <= 0:
            return Response(
                {'error': 'Hours must be positive'},
                status=status.HTTP_400_BAD_REQUEST
            )

        internship.hours_completed += hours
        internship.save()

        # Create task for tracking hours
        Task.objects.create(
            internship=internship,
            title=f'Logged {hours} hours',
            description=description,
            assigned_by=request.user,
            status='completed',
            hours_spent=hours
        )

        # Notify mentor
        if internship.mentor:
            NotificationService.create_notification(
                recipient=internship.mentor,
                title=f'Hours Logged',
                message=f'{internship.student.get_full_name()} logged {hours} hours',
                notification_type='internship'
            )

        return Response({'status': 'hours added'})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        internship = self.get_object()
        feedback = request.data.get('feedback', '')

        if internship.status != 'active':
            return Response(
                {'error': 'Only active internships can be completed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        internship.status = 'completed'
        internship.feedback = feedback
        internship.save()

        # Notify relevant users
        NotificationService.create_notification(
            recipient=internship.student,
            title='Internship Completed',
            message=f'Your internship at {internship.organization.name} has been marked as completed',
            notification_type='internship'
        )

        return Response({'status': 'internship completed'})

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsInternshipParticipant]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority']
    search_fields = ['title', 'description']
    ordering_fields = ['due_date', 'priority', 'created_at']

    def get_queryset(self):
        return Task.objects.filter(
            internship_id=self.kwargs['internship_pk']
        ).select_related(
            'assigned_by'
        )

    def perform_create(self, serializer):
        internship = Internship.objects.get(pk=self.kwargs['internship_pk'])
        task = serializer.save(
            internship=internship,
            assigned_by=self.request.user
        )

        # Notify student
        NotificationService.create_notification(
            recipient=internship.student,
            title='New Task Assigned',
            message=f'You have been assigned a new task: {task.title}',
            notification_type='task'
        )

    @action(detail=True, methods=['post'])
    def complete(self, request, internship_pk=None, pk=None):
        task = self.get_object()
        feedback = request.data.get('feedback', '')

        task.status = 'completed'
        task.feedback = feedback
        task.save()

        # Update internship hours if specified
        hours = request.data.get('hours_spent', 0)
        if hours > 0:
            task.internship.hours_completed += hours
            task.internship.save()

        # Notify mentor
        NotificationService.create_notification(
            recipient=task.internship.mentor,
            title='Task Completed',
            message=f'{task.internship.student.get_full_name()} completed task: {task.title}',
            notification_type='task'
        )

        return Response({'status': 'task completed'})

class AgreementViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsAgreementParticipant]
    serializer_class = AgreementSerializer

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'student':
            return Agreement.objects.filter(student=user)
        elif user.user_type in ['teacher', 'admin']:
            return Agreement.objects.all()
        return Agreement.objects.filter(organization=user.organization)

    def get_serializer_class(self):
        if self.action == 'create':
            return AgreementCreateSerializer
        return AgreementSerializer

    def perform_create(self, serializer):
        # Create agreement and generate initial PDF
        agreement = serializer.save(student=self.request.user)
        agreement.agreement_file = agreement.generate_agreement_file()
        agreement.save()

        # Notify organization
        NotificationService.create_notification(
            recipient=agreement.organization.contact_person,
            title='New Internship Agreement',
            message=f'New internship agreement from {agreement.student.get_full_name()}',
            notification_type='agreement'
        )

    @action(detail=True, methods=['POST'])
    def sign(self, request, pk=None):
        agreement = self.get_object()
        user_type = request.data.get('user_type')
        signature_data = request.data.get('signature')

        if not user_type:
            return Response(
                {'error': 'User type is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify user has permission to sign
        if user_type == 'student' and request.user != agreement.student:
            return Response(
                {'error': 'Only the student can sign this part'},
                status=status.HTTP_403_FORBIDDEN
            )
        elif user_type == 'organization' and request.user.organization != agreement.organization:
            return Response(
                {'error': 'Only organization representatives can sign this part'},
                status=status.HTTP_403_FORBIDDEN
            )
        elif user_type == 'university' and not request.user.has_perm('internships.can_sign_agreement'):
            return Response(
                {'error': 'You do not have permission to sign for the university'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Process signature
        if AgreementService.process_signature(agreement, user_type, signature_data):
            # Notify relevant parties
            if agreement.status == 'approved':
                recipients = [agreement.student]
                if agreement.organization.contact_person:
                    recipients.append(agreement.organization.contact_person)
                
                for recipient in recipients:
                    NotificationService.create_notification(
                        recipient=recipient,
                        title='Agreement Approved',
                        message='The internship agreement has been fully approved',
                        notification_type='agreement'
                    )

            return Response({'status': 'signature processed'})
        
        return Response(
            {'error': 'Failed to process signature'},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['GET'])
    def download(self, request, pk=None):
        agreement = self.get_object()
        if not agreement.agreement_file:
            return Response(
                {'error': 'No agreement file available'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Return file URL or serve file directly
        return Response({
            'file_url': request.build_absolute_uri(agreement.agreement_file.url)
        })

class InternshipPlanViewSet(viewsets.ModelViewSet):
    serializer_class = InternshipPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'student':
            return InternshipPlan.objects.filter(internship__student=user)
        elif user.user_type == 'mentor':
            return InternshipPlan.objects.filter(internship__mentor=user)
        return InternshipPlan.objects.all()

    @action(detail=True, methods=['POST'])
    def review(self, request, pk=None):
        plan = self.get_object()
        status_choice = request.data.get('status')
        feedback = request.data.get('feedback')

        if not status_choice:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if status_choice not in ['approved', 'rejected']:
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Review plan
        InternshipPlanService.review_plan(
            plan=plan,
            reviewer=request.user,
            status=status_choice,
            feedback=feedback
        )

        # Notify student
        NotificationService.create_notification(
            recipient=plan.internship.student,
            title='Internship Plan Reviewed',
            message=f'Your internship plan has been {status_choice}',
            notification_type='plan'
        )

        return Response({'status': 'plan reviewed'})

    @action(detail=True, methods=['GET'])
    def template(self, request, pk=None):
        internship = get_object_or_404(Internship, pk=pk)
        template_content = InternshipPlanService.generate_plan_template(internship)
        return Response({'template': template_content})

class StudentInternshipViewSet(viewsets.ModelViewSet):
    serializer_class = InternshipSerializer
    permission_classes = [permissions.IsAuthenticated, IsInternshipParticipant]

    def get_queryset(self):
        return Internship.objects.filter(
            student=self.request.user
        ).select_related(
            'student', 'mentor', 'organization',
            'mentor_evaluation', 'teacher_evaluation'
        ).prefetch_related('preliminary_reports')

    def get_serializer_class(self):
        if self.action == 'register':
            return InternshipRegistrationSerializer
        return InternshipSerializer

    @action(detail=False, methods=['POST'])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            internship = serializer.save(
                student=request.user,
                status='pending'
            )
            return Response(
                InternshipSerializer(internship).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True)
    def evaluations(self, request, pk=None):
        internship = self.get_object()
        data = {
            'mentor_evaluation': EvaluationSerializer(
                internship.mentor_evaluation
            ).data if internship.mentor_evaluation else None,
            'teacher_evaluation': EvaluationSerializer(
                internship.teacher_evaluation
            ).data if internship.teacher_evaluation else None
        }
        return Response(data)

    @action(detail=True, methods=['POST'])
    def submit_preliminary_report(self, request, pk=None):
        internship = self.get_object()
        serializer = PreliminaryReportSerializer(data=request.data)
        if serializer.is_valid():
            report = serializer.save(
                internship=internship,
                status='submitted'
            )
            return Response(
                PreliminaryReportSerializer(report).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True)
    def preliminary_reports(self, request, pk=None):
        internship = self.get_object()
        reports = internship.preliminary_reports.all()
        serializer = PreliminaryReportSerializer(reports, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def duration(self, request, pk=None):
        internship = self.get_object()
        return Response({
            'start_date': internship.start_date,
            'end_date': internship.end_date,
            'duration_weeks': internship.duration_in_weeks,
            'is_active': internship.is_active
        })

class TeacherViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]
    serializer_class = InternshipSerializer

    def get_queryset(self):
        return Internship.objects.all().select_related(
            'student', 'mentor', 'organization',
            'mentor_evaluation', 'teacher_evaluation'
        ).prefetch_related(
            'preliminary_reports',
            'reports'
        )

    @action(detail=True, methods=['POST'])
    def review_report(self, request, pk=None):
        """Review a student's report"""
        internship = self.get_object()
        serializer = TeacherReportReviewSerializer(data=request.data)
        
        if serializer.is_valid():
            report = serializer.save(
                reviewer=request.user,
                internship=internship
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True)
    def mentor_evaluations(self, request, pk=None):
        """View mentor evaluations for an internship"""
        internship = self.get_object()
        evaluation = internship.mentor_evaluation
        if evaluation:
            return Response(EvaluationSerializer(evaluation).data)
        return Response({'detail': 'No mentor evaluation found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['POST'])
    def add_evaluation_comment(self, request, pk=None):
        """Add comments to mentor evaluation"""
        internship = self.get_object()
        evaluation = internship.mentor_evaluation
        if not evaluation:
            return Response(
                {'detail': 'No mentor evaluation found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        evaluation.teacher_comments = request.data.get('comments', '')
        evaluation.save()
        return Response(EvaluationSerializer(evaluation).data)

    @action(detail=True)
    def student_progress(self, request, pk=None):
        """View comprehensive student progress"""
        internship = self.get_object()
        serializer = StudentProgressSerializer(internship)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def final_evaluation(self, request, pk=None):
        """Submit final evaluation for internship"""
        internship = self.get_object()
        serializer = FinalEvaluationSerializer(data=request.data)
        
        if serializer.is_valid():
            evaluation = serializer.save(
                evaluator=request.user,
                internship=internship
            )
            
            # Update internship status to completed
            internship.status = 'completed'
            internship.save()
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False)
    def statistics(self, request):
        """Get overall statistics for teacher dashboard"""
        total_internships = self.get_queryset().count()
        active_internships = self.get_queryset().filter(status='active').count()
        pending_reports = self.get_queryset().filter(
            reports__status='pending'
        ).count()
        
        avg_ratings = Evaluation.objects.aggregate(
            avg_performance=Avg('performance_rating'),
            avg_attendance=Avg('attendance_rating'),
            avg_initiative=Avg('initiative_rating'),
            avg_teamwork=Avg('teamwork_rating'),
            avg_technical=Avg('technical_skills_rating')
        )

        return Response({
            'total_internships': total_internships,
            'active_internships': active_internships,
            'pending_reports': pending_reports,
            'average_ratings': avg_ratings
        })

    @action(detail=False)
    def pending_reviews(self, request):
        """Get list of reports pending review"""
        pending_reports = self.get_queryset().filter(
            reports__status='pending'
        ).select_related(
            'student', 'mentor'
        ).order_by('reports__submission_date')
        
        return Response(InternshipSerializer(pending_reports, many=True).data)

    @action(detail=True)
    def evaluation_history(self, request, pk=None):
        """Get evaluation history for an internship"""
        internship = self.get_object()
        evaluations = {
            'mentor_evaluations': EvaluationSerializer(
                internship.mentor_evaluation
            ).data if internship.mentor_evaluation else None,
            'teacher_evaluations': EvaluationSerializer(
                internship.teacher_evaluation
            ).data if internship.teacher_evaluation else None,
            'report_evaluations': TeacherReportReviewSerializer(
                internship.reports.all(),
                many=True
            ).data
        }
        return Response(evaluations)

    @action(detail=True, methods=['POST'])
    def evaluate_report(self, request, pk=None):
        """Evaluate a student's report"""
        report = get_object_or_404(Report, pk=pk)
        
        if not request.user.has_perm('internships.can_evaluate_reports'):
            return Response(
                {'error': 'You do not have permission to evaluate reports'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ReportEvaluationSerializer(data=request.data)
        if serializer.is_valid():
            evaluation = serializer.save(
                report=report,
                evaluator=request.user,
                status='evaluated'
            )

            # Update report status
            report.status = 'evaluated'
            report.save()

            # Notify student
            NotificationService.create_notification(
                recipient=report.student,
                title='Report Evaluated',
                message=f'Your report has been evaluated by {request.user.get_full_name()}',
                notification_type='report_evaluation'
            )

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False)
    def pending_reports(self, request):
        """Get list of reports pending evaluation"""
        reports = Report.objects.filter(
            status='submitted'
        ).select_related(
            'student', 'internship'
        ).order_by('submission_date')
        
        return Response(ReportSerializer(reports, many=True).data)

class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'student':
            return Report.objects.filter(student=user)
        elif user.user_type in ['teacher', 'mentor']:
            return Report.objects.filter(
                internship__in=user.supervised_internships.all() |
                user.mentored_internships.all()
            )
        return Report.objects.none()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['POST'])
    def submit(self, request, pk=None):
        report = self.get_object()
        report.status = 'submitted'
        report.save()
        return Response({'status': 'submitted'})

class EvaluationViewSet(viewsets.ModelViewSet):
    serializer_class = EvaluationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'student':
            return Evaluation.objects.filter(report__student=user)
        elif user.user_type in ['teacher', 'mentor']:
            return Evaluation.objects.filter(evaluator=user)
        return Evaluation.objects.none()

    def perform_create(self, serializer):
        serializer.save(
            evaluator=self.request.user,
            evaluator_type=self.request.user.user_type
        )

class InternshipViewSet(viewsets.ModelViewSet):
    serializer_class = InternshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'student':
            return Internship.objects.filter(student=user)
        elif user.user_type == 'teacher':
            return Internship.objects.filter(teacher=user)
        elif user.user_type == 'mentor':
            return Internship.objects.filter(mentor=user)
        return Internship.objects.none()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class StudentDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get(self, request):
        try:
            student = request.user
            print(f"Debug - User ID: {student.id}")
            print(f"Debug - User Type: {student.user_type}")
            print(f"Debug - User Permissions: {student.get_all_permissions()}")

            # Verify user has required permissions
            if not student.has_perm('internships.view_own_reports'):
                return Response(
                    {'error': 'You do not have permission to view reports'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Get current internship
            internship = Internship.objects.filter(
                student=student,
                status='active'
            ).select_related(
                'organization',
                'mentor',
                'teacher'
            ).first()

            # Get reports
            reports = Report.objects.filter(
                student=student
            ).select_related(
                'internship'
            ).order_by('-submitted_at')[:5]

            # Get evaluations
            evaluations = Evaluation.objects.filter(
                report__student=student
            ).select_related(
                'evaluator'
            ).order_by('-created_at')

            data = {
                'internship': InternshipSerializer(
                    internship,
                    context={'request': request}
                ).data if internship else None,
                'reports': ReportSerializer(
                    reports,
                    many=True,
                    context={'request': request}
                ).data,
                'evaluations': EvaluationSerializer(
                    evaluations,
                    many=True,
                    context={'request': request}
                ).data,
                'profile': {
                    'personal_info': bool(student.first_name and student.last_name),
                    'contact_info': bool(student.email and getattr(student, 'phone', None)),
                    'academic_info': bool(getattr(student, 'student_id', None)),
                    'profile_picture': bool(getattr(student, 'avatar', None)),
                }
            }

            return Response(data)
            
        except Exception as e:
            print(f"Student dashboard error: {str(e)}")
            return Response(
                {'error': 'Failed to load dashboard data'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TeacherDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]
    serializer_class = DashboardSerializer

    def get(self, request):
        try:
            teacher = request.user
            print(f"Debug - User ID: {teacher.id}")
            print(f"Debug - User Type: {teacher.user_type}")
            print(f"Debug - User Permissions: {teacher.get_all_permissions()}")

            # Get internships assigned to this teacher
            teacher_internships = Internship.objects.filter(teacher=teacher)
            print(f"Debug - Teacher Internships Count: {teacher_internships.count()}")

            # Get all reports for these internships
            reports = Report.objects.filter(
                internship__in=teacher_internships
            ).select_related(
                'student',
                'internship'
            ).order_by('-submitted_at')

            # Calculate statistics
            stats = {
                'pending_reports': reports.filter(status='pending').count(),
                'under_review': reports.filter(status='under_review').count(),
                'evaluated_reports': reports.filter(
                    status__in=['approved', 'rejected']
                ).count(),
                'active_students': User.objects.filter(
                    internships__in=teacher_internships,
                    user_type='student',
                    is_active=True
                ).distinct().count(),
                'total_internships': teacher_internships.count(),
                'active_internships': teacher_internships.filter(status='active').count()
            }

            # Get recent activities
            recent_activities = []
            
            # Add recent report submissions
            recent_reports = reports.order_by('-submitted_at')[:5]
            for report in recent_reports:
                recent_activities.append({
                    'type': 'report_submission',
                    'date': report.submitted_at,
                    'student': report.student.get_full_name(),
                    'title': report.title,
                    'status': report.status
                })

            data = {
                'stats': stats,
                'reports': ReportSerializer(reports, many=True).data,
                'recent_activities': recent_activities
            }

            print("Debug - Response Data:", data)
            return Response(data)

        except Exception as e:
            print(f"Teacher dashboard error: {str(e)}")
            print(f"User: {request.user}")
            print(f"User type: {getattr(request.user, 'user_type', 'No user_type found')}")
            import traceback
            print(f"Full error traceback:\n{traceback.format_exc()}")
            return Response(
                {
                    'error': 'Failed to load dashboard data',
                    'detail': str(e) if settings.DEBUG else None
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ReportEvaluationView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]
    serializer_class = ReportEvaluationSerializer
    queryset = Report.objects.all()

    def perform_update(self, serializer):
        report = serializer.save()
        
        # Create notification for student
        NotificationService.create_notification(
            recipient=report.student,
            title='Report Evaluated',
            message=f'Your report has been evaluated by {self.request.user.get_full_name()}',
            notification_type='report_evaluation'
        )

        return report

    def patch(self, request, *args, **kwargs):
        try:
            return self.partial_update(request, *args, **kwargs)
        except Exception as e:
            print(f"Report evaluation error: {str(e)}")
            return Response(
                {'error': 'Failed to evaluate report'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SubmitReportView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReportSerializer

    def perform_create(self, serializer):
        # Get the student's active internship
        internship = Internship.objects.filter(
            student=self.request.user,
            status='active'
        ).first()
        
        if not internship:
            raise ValidationError('No active internship found')

        # Create the report
        report = serializer.save(
            student=self.request.user,
            internship=internship,
            status='pending'
        )

        # Notify teacher
        if internship.teacher:
            NotificationService.create_notification(
                recipient=internship.teacher,
                title='New Report Submitted',
                message=f'New {report.get_report_type_display()} submitted by {self.request.user.get_full_name()}',
                notification_type='report_submission'
            )

        return report

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Report submission error: {str(e)}")
            return Response(
                {'error': 'Failed to submit report'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class InternshipRegistrationView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InternshipRegistrationSerializer

    def perform_create(self, serializer):
        # Create the internship
        internship = serializer.save(
            student=self.request.user,
            status='pending'
        )

        # Notify relevant staff
        if internship.organization:
            NotificationService.create_notification(
                recipient=internship.organization.contact_person,
                title='New Internship Registration',
                message=f'New internship registration from {self.request.user.get_full_name()}',
                notification_type='internship_registration'
            )

        return internship

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Internship registration error: {str(e)}")
            return Response(
                {'error': 'Failed to register internship'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )