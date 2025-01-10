from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Organization
from .serializers import OrganizationSerializer
from rest_framework.exceptions import PermissionDenied

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
