from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'evaluations', views.EvaluationViewSet, basename='evaluation')
router.register(r'criteria', views.EvaluationCriteriaViewSet, basename='evaluation-criteria')

app_name = 'evaluations'

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Teacher specific endpoints
    path('teacher/mentor/all/', views.TeacherMentorEvaluationsView.as_view(), name='teacher-mentor-evaluations'),
    path('teacher/evaluations/', views.TeacherEvaluationsView.as_view(), name='teacher-evaluations'),
    
    # Mentor specific endpoints
    path('mentor/', views.MentorEvaluationsView.as_view(), name='mentor-evaluations'),
    
    # Student specific endpoints
    path('student/<int:student_id>/', views.StudentEvaluationsView.as_view(), name='student-evaluations'),
    
    # Action endpoints
    path('<int:pk>/submit/', views.EvaluationViewSet.as_view({'post': 'submit'}), name='submit-evaluation'),
    path('<int:pk>/review/', views.EvaluationViewSet.as_view({'post': 'review'}), name='review-evaluation'),
] 