from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.ReportViewSet, basename='report')

urlpatterns = [
    # API endpoints
    path('preliminary/status/', views.PreliminaryReportStatusView.as_view(), name='preliminary-status'),
    path('preliminary/', views.PreliminaryReportView.as_view(), name='preliminary-report'),
    path('list/', views.ReportListView.as_view(), name='report-list'),
    
    # ViewSet based routes
    path('', include(router.urls)),
]
