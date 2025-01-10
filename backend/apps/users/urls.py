from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.UserViewSet, basename='user')

app_name = 'users'

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('password-reset/', views.PasswordResetView.as_view(), name='password_reset'),
    path('password-reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('me/', views.UserViewSet.as_view({'get': 'me'}), name='me'),
    path('stats/', views.UserViewSet.as_view({'get': 'stats'}), name='stats'),
    path('', include(router.urls)),  # Include router URLs at the end
] 