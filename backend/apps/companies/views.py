from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Organization
from .serializers import OrganizationSerializer
from rest_framework.exceptions import PermissionDenied
from core.throttling import (
    BurstUserRateThrottle,
    SustainedUserRateThrottle,
    CriticalEndpointRateThrottle,
)

# Create your views here.

class IsContactPersonOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow the contact_person to edit the organization.
    """

    def has_object_permission(self, request, view, obj):
        # SAFE_METHODS: GET, HEAD, OPTIONS
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.contact_person == request.user

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [BurstUserRateThrottle, SustainedUserRateThrottle]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            # Staff can see all organizations
            return Organization.objects.all()
        else:
            # Regular users can only see organizations they are associated with
            return Organization.objects.filter(contact_person=user)

    def perform_create(self, serializer):
        # Automatically set the contact_person to the logged-in user if not provided
        if not serializer.validated_data.get('contact_person'):
            serializer.save(contact_person=self.request.user)
        else:
            serializer.save()

    @action(detail=True, methods=['post'], throttle_classes=[CriticalEndpointRateThrottle])
    def activate(self, request, pk=None):
        """
        Critical action that needs stricter rate limiting
        """
        company = self.get_object()
        company.is_active = True
        company.save()
        return Response({'status': 'company activated'})

    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        List all active companies
        Uses default throttle classes
        """
        active_companies = Organization.objects.filter(is_active=True)
        serializer = self.get_serializer(active_companies, many=True)
        return Response(serializer.data)
