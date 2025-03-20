from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Organization
from .serializers import OrganizationSerializer
from core.throttling import (
    BurstUserRateThrottle,
    SustainedUserRateThrottle,
    CriticalEndpointRateThrottle,
)
from django.core.cache import cache
from django.conf import settings
from django.utils import timezone
from django.db.models import Count, Q
import hashlib
import json
from .services import WebhookService, AsyncWebhookService
from asgiref.sync import async_to_sync

class OrganizationV2ViewSet(viewsets.ModelViewSet):
    """
    API V2 endpoint for managing organizations.
    Changes from V1:
    - Added Redis caching for better performance
    - Added more detailed responses
    - Added more filtering options
    - Added bulk operations
    - Added more statistics
    - Added webhook notifications
    """
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [BurstUserRateThrottle, SustainedUserRateThrottle]
    
    def _get_cache_key(self, view_name, params=None):
        """Generate a unique cache key based on the view name and parameters"""
        key = f"{settings.CACHE_KEY_PREFIX}:org:{view_name}"
        if params:
            param_string = json.dumps(params, sort_keys=True)
            key += ":" + hashlib.md5(param_string.encode()).hexdigest()
        return key

    def get_queryset(self):
        queryset = super().get_queryset()
        # Add more filtering options in V2
        name = self.request.query_params.get('name', None)
        is_active = self.request.query_params.get('is_active', None)
        
        if name:
            queryset = queryset.filter(name__icontains=name)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
            
        return queryset

    def list(self, request, *args, **kwargs):
        """Enhanced list method with statistics and caching"""
        cache_key = self._get_cache_key('list', dict(request.query_params))
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = {
                'results': serializer.data,
                'statistics': {
                    'total_count': queryset.count(),
                    'active_count': queryset.filter(is_active=True).count(),
                    'inactive_count': queryset.filter(is_active=False).count(),
                },
                'cached_at': timezone.now().isoformat()
            }
            cache.set(cache_key, data, timeout=settings.CACHE_TTL)
            return self.get_paginated_response(data)

        serializer = self.get_serializer(queryset, many=True)
        data = {
            'results': serializer.data,
            'cached_at': timezone.now().isoformat()
        }
        cache.set(cache_key, data, timeout=settings.CACHE_TTL)
        return Response(data)

    def retrieve(self, request, *args, **kwargs):
        """Enhanced retrieve method with caching"""
        cache_key = self._get_cache_key(f'detail:{kwargs["pk"]}')
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = {
            'result': serializer.data,
            'cached_at': timezone.now().isoformat()
        }
        cache.set(cache_key, data, timeout=settings.CACHE_TTL)
        return Response(data)

    def _send_webhook(self, event_type: str, organization: Organization):
        """Helper method to send webhook asynchronously"""
        data = self.serializer_class(organization).data
        async_to_sync(AsyncWebhookService.send_webhook)(
            event_type=event_type,
            data=data,
            organization_id=organization.id
        )

    def create(self, request, *args, **kwargs):
        """Create organization and send webhook notification"""
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            organization = self.get_object()
            cache.delete(f'organization_{organization.id}')
            self._send_webhook('organization.created', organization)
        return response

    def update(self, request, *args, **kwargs):
        """Update organization and send webhook notification"""
        old_status = self.get_object().is_active
        response = super().update(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            organization = self.get_object()
            cache.delete(f'organization_{organization.id}')
            self._send_webhook('organization.updated', organization)
            
            # Send activation/deactivation webhook if status changed
            if old_status != organization.is_active:
                event_type = (
                    'organization.activated' if organization.is_active 
                    else 'organization.deactivated'
                )
                self._send_webhook(event_type, organization)
        return response

    def destroy(self, request, *args, **kwargs):
        """Delete organization and send webhook notification"""
        organization = self.get_object()
        response = super().destroy(request, *args, **kwargs)
        if response.status_code == status.HTTP_204_NO_CONTENT:
            cache.delete(f'organization_{organization.id}')
            self._send_webhook('organization.deleted', organization)
        return response

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate single organization"""
        organization = self.get_object()
        if not organization.is_active:
            organization.is_active = True
            organization.activated_at = timezone.now()
            organization.save()
            cache.delete(f'organization_{organization.id}')
            self._send_webhook('organization.activated', organization)
        return Response({'status': 'activated'})

    @action(detail=False, methods=['post'])
    def bulk_activate(self, request):
        """Activate multiple organizations with batch processing"""
        from .services import BatchProcessor
        
        organization_ids = request.data.get('organization_ids', [])
        if not organization_ids:
            return Response(
                {'error': 'No organization IDs provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        stats = BatchProcessor.bulk_activate(organization_ids)
        
        # Send webhooks for each activated organization
        organizations = Organization.objects.filter(
            id__in=organization_ids,
            is_active=True
        )
        for org in organizations:
            self._send_webhook('organization.activated', org)
            
        return Response(stats)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get detailed statistics with caching"""
        cache_key = self._get_cache_key('statistics')
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        queryset = self.get_queryset()
        data = {
            'total_organizations': queryset.count(),
            'active_organizations': queryset.filter(is_active=True).count(),
            'inactive_organizations': queryset.filter(is_active=False).count(),
            'organizations_by_domain': self._get_organizations_by_domain(queryset),
            'timestamp': timezone.now().isoformat(),
            'cached_at': timezone.now().isoformat()
        }
        
        cache.set(cache_key, data, timeout=settings.CACHE_TTL)
        return Response(data)

    def _get_organizations_by_domain(self, queryset):
        """Helper method to group organizations by domain with caching"""
        cache_key = self._get_cache_key('domain_stats')
        cached_data = cache.get(cache_key)

        if cached_data:
            return cached_data

        domain_stats = {}
        for org in queryset:
            domain = org.website.split('//')[1].split('/')[0]
            if domain in domain_stats:
                domain_stats[domain] += 1
            else:
                domain_stats[domain] = 1

        cache.set(cache_key, domain_stats, timeout=settings.CACHE_TTL)
        return domain_stats 