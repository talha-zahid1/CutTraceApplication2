from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
from ..models import BatchFabricIn
from django.db.models import Sum
from rest_framework.response import Response


@api_view(['GET'])
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

