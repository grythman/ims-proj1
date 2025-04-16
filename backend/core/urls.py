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
from rest_framework_simplejwt.views import TokenRefreshView
from apps.users.views import PasswordResetView, PasswordResetConfirmView
from rest_framework.routers import DefaultRouter
from apps.companies.views_v2 import OrganizationV2ViewSet
from apps.analytics.views import AnalyticsViewSet
from apps.dashboard import urls as dashboard_urls
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenVerifyView,
)
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView

# Create versioned routers
v1_router = DefaultRouter()
v1_router.register(r'analytics', AnalyticsViewSet, basename='analytics')

v2_router = DefaultRouter()
v2_router.register(r'organizations', OrganizationV2ViewSet, basename='organization')

urlpatterns = [
    path('admin/', admin.site.urls),
    # API v1 URLs
    path('api/v1/', include((v1_router.urls, 'v1'))),
    path('api/v1/auth/', include('rest_framework.urls', namespace='rest_framework_core_v1')),
    path('api/v1/token/', TokenObtainPairView.as_view(), name='v1_token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='v1_token_refresh'),
    path('api/v1/token/verify/', TokenVerifyView.as_view(), name='v1_token_verify'),
    path('api/v1/users/', include('apps.users.urls', namespace='users')),
    
    # API v2 URLs
    path('api/v2/', include((v2_router.urls, 'v2'))),
    path('api/v2/auth/', include('rest_framework.urls', namespace='rest_framework_core_v2')),
    path('api/v2/token/', TokenObtainPairView.as_view(), name='v2_token_obtain_pair'),
    path('api/v2/token/refresh/', TokenRefreshView.as_view(), name='v2_token_refresh'),
    path('api/v2/token/verify/', TokenVerifyView.as_view(), name='v2_token_verify'),
    
    # Dashboard URLs
    path('', include(dashboard_urls)),
    
    # API Schema documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
