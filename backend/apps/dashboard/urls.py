from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('student/', views.StudentDashboardView.as_view(), name='student-dashboard'),
    path('student/activities/', views.StudentActivitiesView.as_view(), name='student-activities'),
    path('mentor/', views.MentorDashboardView.as_view(), name='mentor-dashboard'),
    path('teacher/', views.TeacherDashboardView.as_view(), name='teacher-dashboard'),
    path('teacher/students/', views.TeacherStudentsView.as_view(), name='teacher-students'),
    path('teacher/evaluations/', views.TeacherEvaluationsView.as_view(), name='teacher-evaluations'),
    path('teacher/reports/', views.TeacherReportsView.as_view(), name='teacher-reports'),
    path('admin/', views.AdminDashboardView.as_view(), name='admin-dashboard'),
] 