from django.urls import path
from .views import TeacherDashboardView, StudentDashboardView, ReportEvaluationView, SubmitReportView, InternshipRegistrationView

urlpatterns = [
    # Teacher specific endpoints
    path('teacher/dashboard/', TeacherDashboardView.as_view(), name='teacher-dashboard'),
    path('teacher/pending-reports/', TeacherDashboardView.as_view(), name='teacher-pending-reports'),
    path('reports/<int:pk>/evaluate/', ReportEvaluationView.as_view(), name='report-evaluation'),
    
    # Student specific endpoints
    path('student/dashboard/', StudentDashboardView.as_view(), name='student-dashboard'),
    path('reports/submit/', SubmitReportView.as_view(), name='submit-report'),
    path('register/', InternshipRegistrationView.as_view(), name='internship-registration'),
] 