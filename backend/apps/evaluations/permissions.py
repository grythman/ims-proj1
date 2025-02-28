from rest_framework import permissions

class CanCreateEvaluation(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.user_type in ['mentor', 'teacher']

class CanViewEvaluation(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Student can view their own evaluations
        if request.user == obj.internship.student:
            return True
        # Mentor can view evaluations they created
        if request.user == obj.evaluator:
            return True
        # Teacher can view all evaluations
        if request.user.user_type == 'teacher':
            return True
        return False

class IsEvaluator(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.user_type in ['mentor', 'teacher']

    def has_object_permission(self, request, view, obj):
        # Evaluator can only modify their own evaluations
        if request.user == obj.evaluator:
            return True
        # Teacher can modify any evaluation
        if request.user.user_type == 'teacher':
            return True
        return False 