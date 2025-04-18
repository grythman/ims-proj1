from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'criteria', views.EvaluationCriteriaViewSet, basename='criteria')
router.register(r'scores', views.EvaluationScoreViewSet, basename='score')
router.register(r'attachments', views.EvaluationAttachmentViewSet, basename='attachment')
router.register(r'', views.EvaluationViewSet, basename='evaluation')

app_name = 'evaluations'

urlpatterns = [
    # Student specific endpoints
    path('student/teacher/', views.StudentTeacherEvaluationView.as_view(), name='student-teacher-evaluation'),
    path('student/<int:student_id>/', views.StudentEvaluationsView.as_view(), name='student-evaluations'),
    
    # Teacher specific endpoints
    path('teacher/mentor/all/', views.TeacherMentorEvaluationsView.as_view(), name='teacher-mentor-evaluations'),
    path('teacher/evaluations/', views.TeacherEvaluationsView.as_view(), name='teacher-evaluations'),
    
    # Mentor specific endpoints
    path('mentor/', views.MentorEvaluationsView.as_view(), name='mentor-evaluations'),
    
    # Action endpoints
    path('<int:pk>/submit/', views.EvaluationViewSet.as_view({'post': 'submit'}), name='submit-evaluation'),
    path('<int:pk>/review/', views.EvaluationViewSet.as_view({'post': 'review'}), name='review-evaluation'),
    
    # Include router URLs
    path('', include(router.urls)),
] 