from rest_framework import permissions

class IsUserManagerOrSelf(permissions.BasePermission):
    """
    Custom permission to only allow users to edit their own profile
    or allow managers to edit any profile.
    """
    def has_permission(self, request, view):
        # Allow users to view their own profile
        if view.action == 'me':
            return request.user.is_authenticated
        
        # Allow user managers to perform any action
        return request.user.is_authenticated and (
            request.user.has_perm('users.can_manage_users') or
            request.user.user_type in ['admin', 'teacher']
        )

    def has_object_permission(self, request, view, obj):
        # Allow users to manage their own profile
        if obj == request.user:
            return True
            
        # Allow user managers to manage any user
        return request.user.has_perm('users.can_manage_users') or \
               request.user.user_type in ['admin', 'teacher']

class IsAdminUser(permissions.BasePermission):
    """
    Permission to only allow admin users to access the view.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.user_type == 'admin'
        )

    def has_object_permission(self, request, view, obj):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.user_type == 'admin'
        )

class CanManageUsers(permissions.BasePermission):
    """
    Permission to allow only admin and teachers to manage users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.user_type in ['admin', 'teacher'] or
            request.user.has_perm('users.can_manage_users')
        )

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        return obj.user == request.user

class CanAssignMentors(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.has_perm('users.can_assign_mentors') or
            request.user.user_type in ['admin', 'teacher']
        )