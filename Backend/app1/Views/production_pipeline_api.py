from ..models import fabric_in ,ready_to_manufacture,manufactured_products,suspicious_products,ready_to_deliver,delivered_products,production_batches
from django.db.models import Sum
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required

# @login_required
@api_view(['GET'])
def fabric_in_view(req):
    try:
        fabric_total_qty=fabric_in.objects.aggregate(
            total=Sum('quantity_kg')
        )['total'] or 0
        batches_in = production_batches.objects.count()
        ready_to_manufacture_batches = ready_to_manufacture.objects.values(
            'batch_id'
        ).distinct().count()
        manufactured_count = manufactured_products.objects.count()
        manufactured_quantity = manufactured_products.objects.aggregate(
            total=Sum('final_product_quantity')
        )['total'] or 0
        testing_suspicious_count = suspicious_products.objects.count()
        testing_passed_count = ready_to_deliver.objects.values(
            'manufactured_id'
            ).distinct().count()
        testing_count = (
                testing_suspicious_count +testing_passed_count
            )
        ready_to_deliver_count = ready_to_deliver.objects.count()
        ready_to_deliver_quantity = ready_to_deliver.objects.aggregate(
            total=Sum('quantity')
        )['total'] or 0
        delivered_count = delivered_products.objects.count()
        delivered_quantity = delivered_products.objects.aggregate(
            total=Sum('quantity')
        )['total'] or 0
        return Response({
            'status':True,
            'message':'success',
            'data':{
                'total_fabric_inkg':fabric_total_qty,
                'batches_in':batches_in,
                'ready_to_manufacture_batches':ready_to_manufacture_batches,
                "manufactured_count": manufactured_count,
                "manufactured_quantity": manufactured_quantity,
                "testing_suspicious_count":testing_suspicious_count,
                "testing_passed_count":testing_passed_count,
                "testing_count":testing_count,
                "ready_to_deliver_count":ready_to_deliver_count,
                "ready_to_deliver_quantity":ready_to_deliver_quantity,
                "delivered_count":delivered_count,
                "delivered_quantity":delivered_quantity
            }
        })
    except Exception as e:
        return Response({
            'status':False,
            'error':str(e)
        },status=500)

