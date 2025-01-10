from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.NotificationViewSet, basename='notification')

urlpatterns = [
    path('preferences/', views.NotificationPreferenceViewSet.as_view({
        'get': 'list',
        'put': 'update',
        'patch': 'partial_update'
    }), name='notification-preferences'),
    path('', include(router.urls)),
] 