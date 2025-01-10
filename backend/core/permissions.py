from rest_framework import permissions

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.user_type == 'teacher'

class IsMentor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.user_type == 'mentor'

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.user_type == 'student' 