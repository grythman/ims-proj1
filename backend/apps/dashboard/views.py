from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from apps.internships.models import Internship, Report, Evaluation, PreliminaryReport
from apps.notifications.models import Notification
from django.db.models import Count, Avg, Q
from django.utils import timezone
from apps.users.models import User
from datetime import datetime

class StudentDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            print("\n=== Starting StudentDashboardView.get ===")
            user = request.user
            
            # Get active internship with related data
            internship = Internship.objects.filter(
                student=user, 
                status=Internship.STATUS_ACTIVE
            ).select_related('organization').first()

            # Get preliminary report
            preliminary_report = None
            if internship:
                preliminary_report = PreliminaryReport.objects.filter(
                    internship=internship
                ).order_by('-created_at').first()

            # Get evaluations
            teacher_evaluation = None
            mentor_evaluation = None
            if internship:
                teacher_evaluation = Evaluation.objects.filter(
                    report__internship=internship,
                    evaluator_type='teacher'
                ).order_by('-created_at').first()

                mentor_evaluation = Evaluation.objects.filter(
                    report__internship=internship,
                    evaluator_type='mentor'
                ).order_by('-created_at').first()

            # Get reports count
            reports_submitted = Report.objects.filter(student=user).count()
            
            # Get unread notifications count
            notifications = Notification.objects.filter(recipient=user, is_read=False).count()

            # Calculate internship duration if internship exists
            internship_duration = None
            if internship and internship.start_date and internship.end_date:
                total_days = (internship.end_date - internship.start_date).days
                if total_days > 0:
                    days_completed = (timezone.now().date() - internship.start_date).days
                    internship_duration = {
                        'total_days': total_days,
                        'days_completed': max(0, min(days_completed, total_days)),
                        'percentage': min(100, max(0, (days_completed / total_days) * 100))
                    }

            data = {
                'internship': None if not internship else {
                    'id': internship.id,
                    'company_name': internship.organization.name if internship.organization else None,
                    'start_date': internship.start_date,
                    'end_date': internship.end_date,
                    'status': internship.get_status_display(),
                    'duration': internship_duration
                },
                'preliminary_report': None if not preliminary_report else {
                    'id': preliminary_report.id,
                    'status': preliminary_report.status,
                    'feedback': preliminary_report.feedback,
                    'last_updated': preliminary_report.updated_at
                },
                'evaluations': {
                    'teacher': None if not teacher_evaluation else {
                        'id': teacher_evaluation.id,
                        'grade': teacher_evaluation.grade,
                        'comments': teacher_evaluation.comments,
                        'date': teacher_evaluation.created_at
                    },
                    'mentor': None if not mentor_evaluation else {
                        'id': mentor_evaluation.id,
                        'grade': mentor_evaluation.grade,
                        'comments': mentor_evaluation.comments,
                        'date': mentor_evaluation.created_at
                    }
                },
                'reports_submitted': reports_submitted,
                'unread_notifications': notifications,
            }
            
            print(f"\nResponse data: {data}")
            return Response(data)
            
        except Exception as e:
            print(f"Error in StudentDashboardView: {str(e)}")
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            return Response(
                {
                    'error': str(e),
                    'error_type': str(type(e).__name__),
                    'traceback': traceback.format_exc()
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StudentActivitiesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            activities = []

            # Get recent reports
            reports = Report.objects.filter(
                student=user
            ).select_related('internship').order_by('-submitted_at')[:5]
            
            for report in reports:
                activities.append({
                    'type': 'report',
                    'title': f'Report: {report.title}',
                    'status': report.status,
                    'date': report.submitted_at.isoformat() if report.submitted_at else report.created_at.isoformat(),
                    'internship': report.internship.title if report.internship else None
                })

            # Get recent notifications
            notifications = Notification.objects.filter(
                recipient=user
            ).order_by('-created_at')[:5]
            
            for notification in notifications:
                activities.append({
                    'type': 'notification',
                    'title': notification.title,
                    'message': notification.message,
                    'is_read': notification.is_read,
                    'date': notification.created_at.isoformat()
                })

            # Sort activities by date
            activities.sort(key=lambda x: x['date'], reverse=True)

            return Response({
                'status': 'success',
                'data': activities[:5]  # Return only the 5 most recent activities
            })
            
        except Exception as e:
            print(f"Error in StudentActivitiesView: {str(e)}")
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MentorDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Get all active internships where user is mentor
        internships = Internship.objects.filter(
            mentor=user,
            status='active'
        ).select_related('student', 'organization')

        # Get pending reports count
        pending_reports = Report.objects.filter(
            internship__mentor=user,
            status='pending'
        ).count()

        # Get average ratings for mentored students
        avg_ratings = Report.objects.filter(
            internship__mentor=user,
            status='approved'
        ).aggregate(
            avg_performance=Avg('evaluation__performance_rating'),
            avg_attendance=Avg('evaluation__attendance_rating'),
            avg_initiative=Avg('evaluation__initiative_rating')
        )

        data = {
            'active_internships': internships.count(),
            'pending_reports': pending_reports,
            'students': [
                {
                    'id': internship.student.id,
                    'name': internship.student.get_full_name(),
                    'company': internship.organization.name,
                    'start_date': internship.start_date,
                    'end_date': internship.end_date
                }
                for internship in internships
            ],
            'average_ratings': {
                'performance': round(avg_ratings['avg_performance'] or 0, 2),
                'attendance': round(avg_ratings['avg_attendance'] or 0, 2),
                'initiative': round(avg_ratings['avg_initiative'] or 0, 2)
            }
        }
        return Response(data)

class TeacherDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Get statistics for internships
        total_internships = Internship.objects.count()
        active_internships = Internship.objects.filter(status='active').count()
        completed_internships = Internship.objects.filter(status='completed').count()

        # Get statistics for reports
        total_reports = Report.objects.count()
        pending_reports = Report.objects.filter(status='pending').count()
        approved_reports = Report.objects.filter(status='approved').count()

        # Get average ratings
        avg_ratings = Evaluation.objects.aggregate(
            avg_performance=Avg('performance_rating'),
            avg_attendance=Avg('attendance_rating'),
            avg_initiative=Avg('initiative_rating'),
            avg_teamwork=Avg('teamwork_rating'),
            avg_technical=Avg('technical_skills_rating')
        )

        # Get recent activities
        recent_reports = Report.objects.select_related('student').order_by('-created_at')[:5]
        recent_evaluations = Evaluation.objects.select_related('evaluator').order_by('-created_at')[:5]

        data = {
            'statistics': {
                'internships': {
                    'total': total_internships,
                    'active': active_internships,
                    'completed': completed_internships
                },
                'reports': {
                    'total': total_reports,
                    'pending': pending_reports,
                    'approved': approved_reports
                }
            },
            'average_ratings': {
                'performance': round(avg_ratings['avg_performance'] or 0, 2),
                'attendance': round(avg_ratings['avg_attendance'] or 0, 2),
                'initiative': round(avg_ratings['avg_initiative'] or 0, 2),
                'teamwork': round(avg_ratings['avg_teamwork'] or 0, 2),
                'technical': round(avg_ratings['avg_technical'] or 0, 2)
            },
            'recent_activities': {
                'reports': [
                    {
                        'id': report.id,
                        'student_name': report.student.get_full_name(),
                        'title': report.title,
                        'status': report.status,
                        'submitted_at': report.created_at
                    }
                    for report in recent_reports
                ],
                'evaluations': [
                    {
                        'id': eval.id,
                        'evaluator_name': eval.evaluator.get_full_name(),
                        'average_rating': (
                            eval.performance_rating +
                            eval.attendance_rating +
                            eval.initiative_rating +
                            eval.teamwork_rating +
                            eval.technical_skills_rating
                        ) / 5,
                        'created_at': eval.created_at
                    }
                    for eval in recent_evaluations
                ]
            }
        }
        return Response(data)

class TeacherStudentsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Get all students with active internships
        students = User.objects.filter(
            internship__status='active',
            user_type='student'
        ).distinct().select_related('internship', 'internship__organization')

        data = []
        for student in students:
            internship = student.internship_set.filter(status='active').first()
            if internship:
                # Get student's reports statistics
                reports_stats = Report.objects.filter(student=student).aggregate(
                    total=Count('id'),
                    pending=Count('id', filter=Q(status='pending')),
                    approved=Count('id', filter=Q(status='approved')),
                    rejected=Count('id', filter=Q(status='rejected'))
                )

                # Get student's average evaluation scores
                eval_stats = Evaluation.objects.filter(
                    internship=internship
                ).aggregate(
                    avg_performance=Avg('performance_rating'),
                    avg_attendance=Avg('attendance_rating'),
                    avg_initiative=Avg('initiative_rating')
                )

                data.append({
                    'id': student.id,
                    'name': student.get_full_name(),
                    'email': student.email,
                    'student_id': student.student_id,
                    'internship': {
                        'id': internship.id,
                        'company': internship.organization.name,
                        'start_date': internship.start_date,
                        'end_date': internship.end_date,
                        'status': internship.status
                    },
                    'reports': {
                        'total': reports_stats['total'],
                        'pending': reports_stats['pending'],
                        'approved': reports_stats['approved'],
                        'rejected': reports_stats['rejected']
                    },
                    'evaluations': {
                        'performance': round(eval_stats['avg_performance'] or 0, 2),
                        'attendance': round(eval_stats['avg_attendance'] or 0, 2),
                        'initiative': round(eval_stats['avg_initiative'] or 0, 2)
                    }
                })

        return Response(data)

class TeacherEvaluationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Get all evaluations with related data
        evaluations = Evaluation.objects.select_related(
            'internship',
            'internship__student',
            'internship__organization',
            'evaluator'
        ).order_by('-created_at')

        data = []
        for evaluation in evaluations:
            data.append({
                'id': evaluation.id,
                'student': {
                    'id': evaluation.internship.student.id,
                    'name': evaluation.internship.student.get_full_name(),
                    'student_id': evaluation.internship.student.student_id
                },
                'internship': {
                    'id': evaluation.internship.id,
                    'company': evaluation.internship.organization.name
                },
                'evaluator': {
                    'id': evaluation.evaluator.id,
                    'name': evaluation.evaluator.get_full_name(),
                    'role': evaluation.evaluator.user_type
                },
                'ratings': {
                    'performance': evaluation.performance_rating,
                    'attendance': evaluation.attendance_rating,
                    'initiative': evaluation.initiative_rating,
                    'teamwork': evaluation.teamwork_rating,
                    'technical': evaluation.technical_skills_rating,
                    'average': (
                        evaluation.performance_rating +
                        evaluation.attendance_rating +
                        evaluation.initiative_rating +
                        evaluation.teamwork_rating +
                        evaluation.technical_skills_rating
                    ) / 5
                },
                'comments': evaluation.comments,
                'created_at': evaluation.created_at
            })

        return Response(data)

class TeacherReportsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Get all reports with related data
        reports = Report.objects.select_related(
            'student',
            'internship',
            'internship__organization'
        ).order_by('-created_at')

        # Filter by status if provided
        status = request.query_params.get('status')
        if status:
            reports = reports.filter(status=status)

        data = []
        for report in reports:
            data.append({
                'id': report.id,
                'student': {
                    'id': report.student.id,
                    'name': report.student.get_full_name(),
                    'student_id': report.student.student_id
                },
                'internship': {
                    'id': report.internship.id,
                    'company': report.internship.organization.name
                },
                'title': report.title,
                'content': report.content,
                'status': report.status,
                'feedback': report.feedback,
                'created_at': report.created_at,
                'updated_at': report.updated_at
            })

        return Response(data)

class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Get user statistics
        user_stats = {
            'total': User.objects.count(),
            'students': User.objects.filter(user_type='student').count(),
            'teachers': User.objects.filter(user_type='teacher').count(),
            'mentors': User.objects.filter(user_type='mentor').count(),
            'admins': User.objects.filter(user_type='admin').count()
        }

        # Get internship statistics
        internship_stats = {
            'total': Internship.objects.count(),
            'active': Internship.objects.filter(status='active').count(),
            'completed': Internship.objects.filter(status='completed').count(),
            'pending': Internship.objects.filter(status='pending').count()
        }

        # Get report statistics
        report_stats = {
            'total': Report.objects.count(),
            'pending': Report.objects.filter(status='pending').count(),
            'approved': Report.objects.filter(status='approved').count(),
            'rejected': Report.objects.filter(status='rejected').count()
        }

        # Get evaluation statistics
        evaluation_stats = {
            'total': Evaluation.objects.count(),
            'average_ratings': Evaluation.objects.aggregate(
                avg_performance=Avg('performance_rating'),
                avg_attendance=Avg('attendance_rating'),
                avg_initiative=Avg('initiative_rating'),
                avg_teamwork=Avg('teamwork_rating'),
                avg_technical=Avg('technical_skills_rating')
            )
        }

        # Get recent activities
        recent_activities = []

        # Add recent user registrations
        recent_users = User.objects.order_by('-date_joined')[:5]
        for user in recent_users:
            recent_activities.append({
                'type': 'registration',
                'user': user.get_full_name(),
                'user_type': user.user_type,
                'date': user.date_joined
            })

        # Add recent internship status changes
        recent_internships = Internship.objects.select_related(
            'student', 'organization'
        ).order_by('-updated_at')[:5]
        for internship in recent_internships:
            recent_activities.append({
                'type': 'internship_update',
                'student': internship.student.get_full_name(),
                'company': internship.organization.name,
                'status': internship.status,
                'date': internship.updated_at
            })

        # Sort activities by date
        recent_activities.sort(key=lambda x: x['date'], reverse=True)

        data = {
            'user_statistics': user_stats,
            'internship_statistics': internship_stats,
            'report_statistics': report_stats,
            'evaluation_statistics': evaluation_stats,
            'recent_activities': recent_activities[:5]  # Get only the 5 most recent activities
        }

        return Response(data)
