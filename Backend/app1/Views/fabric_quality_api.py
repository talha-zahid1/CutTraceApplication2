from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
from ..serializers import FabricQuality_serializer
from ..models import FabricQuality
from rest_framework.response import Response


@api_view(['GET'])
def get(req):
    obj=FabricQuality.objects.all()
    if not obj:
        return Response({
            'status':True,
            'message':'No Fabric Qualities Entered'
        }) 
    serializer=FabricQuality_serializer(obj,many=True)
    return Response({
        'status':True,
        'data':serializer.data
    })