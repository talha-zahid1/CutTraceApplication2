from rest_framework.decorators import api_view,permission_classes
from ..models import suspicious_products
from rest_framework.response import Response
from django.db.models import Avg
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def inspection_view(req):
    try:
        data=suspicious_products.objects.values('fabric_quality__name').annotate(
            expected_wastage_percentage=Avg('expected_wastage_percentage'),
            actual_wastage_percentage=Avg('actual_wastage_percentage'),
            expected_final_product_quantity=Avg('expected_final_product_quantity'),
            actual_final_product_quantity=Avg('actual_final_product_quantity')
        )
        return Response({
            'status':True,
            'data':list(data)
        })
    except Exception as e:
        return Response({
            'status':False,
            'error':str(e)
        },status=500)