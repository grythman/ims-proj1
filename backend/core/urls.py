"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from apps.users.views import LoginView, PasswordResetView, PasswordResetConfirmView

urlpatterns = [
    path('admin/', admin.site.urls),
    # JWT Authentication endpoints
    path('api/users/login/', LoginView.as_view(), name='login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Password Reset endpoints
    path('api/users/password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('api/users/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    # Your apps' URLs
    path('api/users/', include('apps.users.urls')),
    path('api/companies/', include('apps.companies.urls')),
    path('api/internships/', include('apps.internships.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/dashboard/', include('apps.dashboard.urls')),
    path('api/reports/', include('apps.reports.urls')),
    path('api/evaluations/', include('apps.evaluations.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
