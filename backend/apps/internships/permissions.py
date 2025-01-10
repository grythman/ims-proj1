from rest_framework import permissions

class IsAgreementParticipant(permissions.BasePermission):
    """
    Custom permission to only allow participants of an agreement to access it.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow read access to teachers and admins
        if request.user.user_type in ['teacher', 'admin']:
            return True
            
        # Check if user is the student or from the organization
        return (request.user == obj.student or 
                request.user.organization == obj.organization)

class IsInternshipParticipant(permissions.BasePermission):
    """
    Custom permission to only allow participants of an internship to access it.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow read access to teachers and admins
        if request.user.user_type in ['teacher', 'admin']:
            return True
            
        # Check if user is the student, mentor, or teacher of the internship
        return (
            request.user == obj.student or
            request.user == obj.mentor or
            request.user == obj.teacher
        )

class CanReviewInternship(permissions.BasePermission):
    """
    Custom permission to only allow mentors and teachers to review internships.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type in ['teacher', 'mentor']

    def has_object_permission(self, request, view, obj):
        # Allow access to teachers
        if request.user.user_type == 'teacher':
            return True
            
        # Allow access to assigned mentor
        return request.user == obj.mentor

class CanManageInternship(permissions.BasePermission):
    """
    Custom permission to only allow teachers and admins to manage internships.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type in ['teacher', 'admin']

class CanSignAgreement(permissions.BasePermission):
    """
    Custom permission to only allow authorized users to sign agreements.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user_type = request.data.get('user_type')
        
        if user_type == 'student':
            return request.user == obj.student
        elif user_type == 'organization':
            return request.user.organization == obj.organization
        elif user_type == 'university':
            return request.user.user_type in ['teacher', 'admin']
            
        return False

class CanReviewPlan(permissions.BasePermission):
    """
    Custom permission to only allow mentors and teachers to review internship plans.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type in ['teacher', 'mentor']

    def has_object_permission(self, request, view, obj):
        # Allow access to teachers
        if request.user.user_type == 'teacher':
            return True
            
        # Allow access to assigned mentor
        return request.user == obj.internship.mentor

class IsTeacher(permissions.BasePermission):
    """
    Custom permission to only allow teachers to access the view.
    """
    def has_permission(self, request, view):
        # Check if user is authenticated and is a teacher
        return bool(
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'user_type') and 
            request.user.user_type == 'teacher'
        )

class CanReviewReports(permissions.BasePermission):
    """
    Custom permission to only allow teachers and mentors to review reports.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type in ['teacher', 'mentor']

class CanGiveFinalEvaluation(permissions.BasePermission):
    """
    Custom permission to only allow teachers to give final evaluations.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'teacher'

class IsStudent(permissions.BasePermission):
    """
    Custom permission to only allow students to access the view.
    """
    def has_permission(self, request, view):
        # Check if user is authenticated and is a student
        return bool(
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'user_type') and 
            request.user.user_type == 'student'
        )

    def has_object_permission(self, request, view, obj):
        # Allow students to only access their own data
        return obj.student == request.user