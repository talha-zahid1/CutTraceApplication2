from rest_framework.decorators import api_view,permission_classes
from ..models import BatchFabricIn
from django.db.models import Sum
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def Batch_entries_view(req):
    try:
        entries=BatchFabricIn.objects.values('batch_id').annotate(
                total_kg=Sum('quantity_used')
            )
        data=[
            {
                "batch_id": entry.get('batch_id'), "total_quantity_kg":entry.get('total_kg')  ,
            }
            for entry in entries
        ]
        return Response({
            'status':True,
            'data':data
        })
    except Exception as e:
        return Response({
            'status':False,
            'error':str(e)
        },status=500)

