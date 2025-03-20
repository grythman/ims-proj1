from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

class BurstAnonRateThrottle(AnonRateThrottle):
    """Throttle for anonymous users - burst rate (short time window)"""
    rate = '20/minute'  # 20 requests per minute
    scope = 'burst_anon'

class SustainedAnonRateThrottle(AnonRateThrottle):
    """Throttle for anonymous users - sustained rate (longer time window)"""
    rate = '1000/day'  # 1000 requests per day
    scope = 'sustained_anon'

class BurstUserRateThrottle(UserRateThrottle):
    """Throttle for authenticated users - burst rate (short time window)"""
    rate = '60/minute'  # 60 requests per minute
    scope = 'burst_user'

class SustainedUserRateThrottle(UserRateThrottle):
    """Throttle for authenticated users - sustained rate (longer time window)"""
    rate = '10000/day'  # 10000 requests per day
    scope = 'sustained_user'

class HighBurstUserRateThrottle(UserRateThrottle):
    """Throttle for special endpoints that need higher burst rates"""
    rate = '200/minute'  # 200 requests per minute
    scope = 'high_burst_user'

class CriticalEndpointRateThrottle(UserRateThrottle):
    """Throttle for critical endpoints that need extra protection"""
    rate = '3/minute'  # 3 requests per minute
    scope = 'critical_endpoint' 