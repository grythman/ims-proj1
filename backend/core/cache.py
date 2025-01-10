from django.core.cache import cache
from functools import wraps
from django.conf import settings
import hashlib
import json

def cache_response(timeout=300, key_prefix=''):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Create unique cache key based on user, method and params
            cache_key = f"{key_prefix}:{request.user.id}:{request.method}:"
            cache_key += hashlib.md5(
                f"{json.dumps(request.GET.dict())}:{json.dumps(kwargs)}".encode()
            ).hexdigest()

            # Try to get cached response
            cached_response = cache.get(cache_key)
            if cached_response is not None:
                return cached_response

            # Get fresh response
            response = view_func(request, *args, **kwargs)
            cache.set(cache_key, response, timeout)
            return response
        return wrapper
    return decorator 