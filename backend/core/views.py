from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
def api_root(request):
    return Response({
        'status': 'ok',
        'version': '1.0.0'
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def health_check(request):
    return Response({
        'status': 'healthy',
        'user': request.user.username
    }) 