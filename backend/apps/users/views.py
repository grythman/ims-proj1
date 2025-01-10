from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q
from .serializers import UserSerializer, LoginSerializer, ActivitySerializer, NotificationPreferenceSerializer, UserRegistrationSerializer
from .permissions import IsUserManagerOrSelf, IsAdminUser
from .models import User, Activity, NotificationPreference
from apps.internships.models import Internship, Report, Task
from django.contrib.auth import get_user_model, authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings

User = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                return Response({
                    'status': 'success',
                    'message': 'User registered successfully',
                    'data': serializer.data
                }, status=201)
            except Exception as e:
                return Response({
                    'status': 'error',
                    'message': 'Registration failed',
                    'errors': str(e)
                }, status=400)
        else:
            return Response({
                'status': 'error',
                'message': 'Registration failed',
                'errors': serializer.errors
            }, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data['user']
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'status': 'success',
                    'data': {
                        'access_token': str(refresh.access_token),
                        'refresh_token': str(refresh),
                        'user': {
                            'id': user.id,
                            'username': user.username,
                            'email': user.email,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                            'user_type': user.user_type
                        }
                    }
                })
            return Response({
                'status': 'error',
                'message': 'Invalid credentials',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        return Response({
            'message': 'Please use POST method for login'
        }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return User.objects.all()
        return User.objects.filter(id=user.id)

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        try:
            user = request.user
            stats = {}

            if user.user_type == 'student':
                internships = Internship.objects.filter(student=user)
                reports = Report.objects.filter(student=user)
                
                stats = {
                    'internships': {
                        'total': internships.count(),
                        'active': internships.filter(status='active').count(),
                        'completed': internships.filter(status='completed').count()
                    },
                    'reports': {
                        'total': reports.count(),
                        'pending': reports.filter(status='pending').count(),
                        'approved': reports.filter(status='approved').count(),
                        'rejected': reports.filter(status='rejected').count()
                    },
                    'tasks': {
                        'total': Task.objects.filter(internship__student=user).count(),
                        'completed': Task.objects.filter(internship__student=user, status='completed').count(),
                        'pending': Task.objects.filter(internship__student=user, status='pending').count()
                    }
                }
            elif user.user_type == 'mentor':
                stats = {
                    'students': {
                        'total': Internship.objects.filter(mentor=user).count(),
                        'active': Internship.objects.filter(mentor=user, status='active').count()
                    },
                    'reports': {
                        'pending_review': Report.objects.filter(mentor=user, status='pending').count(),
                        'reviewed': Report.objects.filter(mentor=user).exclude(status='pending').count()
                    }
                }
            elif user.user_type in ['teacher', 'admin']:
                stats = {
                    'students': {
                        'total': User.objects.filter(user_type='student').count(),
                        'active': Internship.objects.filter(status='active').count()
                    },
                    'reports': {
                        'total': Report.objects.all().count(),
                        'pending': Report.objects.filter(status='pending').count()
                    },
                    'internships': {
                        'total': Internship.objects.all().count(),
                        'active': Internship.objects.filter(status='active').count(),
                        'completed': Internship.objects.filter(status='completed').count()
                    }
                }

            return Response({
                'status': 'success',
                'data': stats
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_update(self, serializer):
        if 'password' in serializer.validated_data:
            password = serializer.validated_data['password']
            self.request.user.set_password(password)
            self.request.user.save()
        serializer.save()

class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({
                'error': 'Email is required'
            }, status=400)

        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"

            # Send email
            send_mail(
                'Password Reset',
                f'Click the link to reset your password: {reset_url}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return Response({
                'message': 'Password reset email sent'
            })
        except User.DoesNotExist:
            return Response({
                'error': 'No user found with this email'
            }, status=404)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=500)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        password = request.data.get('password')

        if not token or not password:
            return Response({
                'error': 'Token and password are required'
            }, status=400)

        try:
            user = User.objects.get(password_reset_token=token)
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.password_reset_token = None
                user.save()
                return Response({
                    'message': 'Password reset successful'
                })
            return Response({
                'error': 'Invalid or expired token'
            }, status=400)
        except User.DoesNotExist:
            return Response({
                'error': 'Invalid token'
            }, status=400)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=500)
