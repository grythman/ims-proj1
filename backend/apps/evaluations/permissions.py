from rest_framework import permissions

class CanCreateEvaluation(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type in ['mentor', 'teacher']

class CanViewEvaluation(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # Students can only view their own evaluations
        if user.user_type == 'student':
            return obj.student == user
            
        # Mentors can view evaluations they created or for their mentees
        if user.user_type == 'mentor':
            return (obj.evaluator == user or 
                   obj.internship.mentor == user)
            
        # Teachers and admins can view all evaluations
        return user.user_type in ['teacher', 'admin'] 