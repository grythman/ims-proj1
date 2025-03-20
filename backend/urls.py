from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.companies.views import CompanyViewSet
from apps.companies.views_v2 import OrganizationV2ViewSet
from apps.analytics.views import AnalyticsViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
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
v1_router.register(r'companies', CompanyViewSet, basename='company')
v1_router.register(r'analytics', AnalyticsViewSet, basename='analytics')

v2_router = DefaultRouter()
v2_router.register(r'organizations', OrganizationV2ViewSet, basename='organization')

urlpatterns = [
    path('admin/', admin.site.urls),
    # API v1 URLs
    path('api/v1/', include((v1_router.urls, 'v1'))),
    path('api/v1/auth/', include('rest_framework.urls')),
    path('api/v1/token/', TokenObtainPairView.as_view(), name='v1_token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='v1_token_refresh'),
    path('api/v1/token/verify/', TokenVerifyView.as_view(), name='v1_token_verify'),
    
    # API v2 URLs
    path('api/v2/', include((v2_router.urls, 'v2'))),
    path('api/v2/auth/', include('rest_framework.urls')),
    path('api/v2/token/', TokenObtainPairView.as_view(), name='v2_token_obtain_pair'),
    path('api/v2/token/refresh/', TokenRefreshView.as_view(), name='v2_token_refresh'),
    path('api/v2/token/verify/', TokenVerifyView.as_view(), name='v2_token_verify'),
    
    # API Schema documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
] 
