from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class AdminTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        user, token = super().authenticate_credentials(key)
        if not user.is_staff and not user.is_superuser:
            raise AuthenticationFailed('User is not staff/admin')
        return user, token 