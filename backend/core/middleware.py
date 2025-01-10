import logging
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

class DebugMiddleware(MiddlewareMixin):
    def process_request(self, request):
        logger.debug(f"Request: {request.method} {request.path}")
        logger.debug(f"Headers: {request.headers}")
        return None

    def process_response(self, request, response):
        logger.debug(f"Response Status: {response.status_code}")
        return response 