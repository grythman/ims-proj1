"""
WSGI config for core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os
import sys
from pathlib import Path
from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

# Set default settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Initialize WSGI application
application = get_wsgi_application()

# Add WhiteNoise for static files serving
application = WhiteNoise(application)
application.add_files(os.path.join(BASE_DIR, 'static'), prefix='static/')
application.add_files(os.path.join(BASE_DIR, 'media'), prefix='media/')

# Add security headers
def security_headers_middleware(app):
    def middleware(environ, start_response):
        def custom_start_response(status, headers, exc_info=None):
            security_headers = [
                ('X-Content-Type-Options', 'nosniff'),
                ('X-Frame-Options', 'DENY'),
                ('X-XSS-Protection', '1; mode=block'),
                ('Strict-Transport-Security', 'max-age=31536000; includeSubDomains'),
                ('Referrer-Policy', 'strict-origin-when-cross-origin'),
                ('Permissions-Policy', 'geolocation=(), microphone=(), camera=()'),
            ]
            headers.extend(security_headers)
            return start_response(status, headers, exc_info)
        return app(environ, custom_start_response)
    return middleware

application = security_headers_middleware(application)
