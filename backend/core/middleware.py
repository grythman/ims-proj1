import logging
import time
import json
from django.http import JsonResponse
from rest_framework import status
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)

class ErrorHandlingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
            return response
        except Exception as e:
            logger.error(f"Unhandled exception: {str(e)}")
            return JsonResponse({
                'error': 'Internal server error',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 

class APILoggingMiddleware(MiddlewareMixin):
    """Middleware to log API requests and responses"""

    def process_request(self, request):
        request.start_time = time.time()

    def process_response(self, request, response):
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            user = request.user.username if request.user.is_authenticated else 'anonymous'
            
            # Get request body for POST/PUT/PATCH
            body = None
            if request.method in ['POST', 'PUT', 'PATCH']:
                try:
                    if request.content_type == 'application/json':
                        body = json.loads(request.body)
                    else:
                        body = request.POST
                except:
                    body = 'Could not parse request body'

            # Get response data
            response_data = None
            if hasattr(response, 'data'):
                response_data = response.data

            # Log the request
            log_data = {
                'method': request.method,
                'path': request.path,
                'status_code': response.status_code,
                'duration': f'{duration:.2f}s',
                'user': user,
                'ip': request.META.get('REMOTE_ADDR'),
                'request_body': body,
                'response_data': response_data
            }

            # Log different levels based on status code
            if 200 <= response.status_code < 400:
                logger.info(f'API Request', extra=log_data)
            elif response.status_code >= 500:
                logger.error(f'API Error', extra=log_data)
            else:
                logger.warning(f'API Warning', extra=log_data)

        return response

class DebugMiddleware(MiddlewareMixin):
    """Middleware for debug logging"""
    
    def process_request(self, request):
        if request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            logger.debug(f'Debug - Request Body: {request.body}')

    def process_response(self, request, response):
        if hasattr(response, 'data'):
            logger.debug(f'Debug - Response Data: {response.data}')
        return response

class SecurityMiddleware(MiddlewareMixin):
    """Middleware for security logging"""
    
    def process_request(self, request):
        security_logger = logging.getLogger('django.security')
        if not request.is_secure():
            security_logger.warning(
                'Insecure request',
                extra={
                    'path': request.path,
                    'method': request.method,
                    'ip': request.META.get('REMOTE_ADDR')
                }
            ) 