from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'mentor/dashboard', views.MentorDashboardView, basename='mentor-dashboard')
router.register(r'applications', views.InternshipApplicationViewSet, basename='application')
router.register(r'listings', views.InternshipListingViewSet, basename='internship-listings')

urlpatterns = [
    # Teacher specific endpoints
    path('teacher/dashboard/', views.TeacherDashboardView.as_view(), name='teacher-dashboard'),
    path('teacher/pending-reports/', views.TeacherViewSet.as_view({'get': 'pending_reports'}), name='teacher-pending-reports'),
    path('reports/<int:pk>/evaluate/', views.ReportEvaluationView.as_view(), name='report-evaluation'),
    
    # Student specific endpoints
    path('student/dashboard/', views.StudentDashboardView.as_view(), name='student-dashboard'),
    path('student/profile/update/', views.StudentProfileUpdateView.as_view(), name='student-profile-update'),
    path('reports/submit/', views.SubmitReportView.as_view(), name='submit-report'),
    path('register/', views.InternshipRegistrationView.as_view(), name='internship-registration'),
    path('my-internship/', views.CurrentInternshipView.as_view(), name='current-internship'),
    path('internship-listings/', views.InternshipListingViewSet.as_view({'get': 'list'}), name='internship-listings'),
    path('internship-listings/<int:pk>/', views.InternshipListingViewSet.as_view({'get': 'retrieve'}), name='internship-listing-detail'),
    path('internship-listings/<int:pk>/apply/', views.InternshipListingViewSet.as_view({'post': 'apply'}), name='internship-listing-apply'),
    path('internship-listings/<int:pk>/bookmark/', views.InternshipListingViewSet.as_view({'post': 'bookmark'}), name='internship-listing-bookmark'),
    path('internship-listings/bookmarked/', views.InternshipListingViewSet.as_view({'get': 'bookmarked'}), name='internship-listings-bookmarked'),
    
    # Mentor specific endpoints
    path('mentor/evaluate-report/<int:pk>/', views.MentorReportEvaluationView.as_view(), name='mentor-evaluate-report'),
    
    # ViewSet based endpoints
    path('', views.InternshipViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='internship-list'),
    path('<int:pk>/', views.InternshipViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='internship-detail'),
    path('<int:pk>/tasks/', views.TaskViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='internship-tasks'),
    path('<int:pk>/evaluations/', views.EvaluationViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='internship-evaluations'),
    
    # Include router URLs
    path('', include(router.urls)),
] 