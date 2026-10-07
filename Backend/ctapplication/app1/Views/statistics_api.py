from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import suspicious_products,delivered_products,fabric_in,manufactured_products,ready_to_deliver
from django.db.models import Count, Sum
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from ..custom_permission import IsAdmin

class suspicious_batches_stats_view(APIView):
    def get_permissions(self):
        if self.request.method=='GET':
            return [IsAuthenticated()]
        else:
            return [IsAdmin()]
    def get(self, req):
        try:
            with transaction.atomic():
                batch_ids = set(
                    suspicious_products.objects.values_list("batch_id", flat=True)
                )
                expected_wastage_percentage = suspicious_products.objects.aggregate(
                    expected_wastage_percentage=Sum("expected_wastage_percentage")
                )
                actual_wastage_percentage = suspicious_products.objects.aggregate(
                    actual_wastage_percentage=Sum("actual_wastage_percentage")
                )
                resolved = suspicious_products.objects.filter(
                    investigation_status="resolved"
                ).aggregate(resolved=Count("suspicious_id"))
                rejected = suspicious_products.objects.filter(
                    investigation_status="rejected"
                ).aggregate(rejected=Count("suspicious_id"))
                products_by_quality = suspicious_products.objects.values(
                    "fabric_quality__name"
                ).annotate(total=Count("batch_id", distinct=True))
                products_by_fp_name = suspicious_products.objects.values(
                    "manufactured_id__final_product_name"
                ).annotate(total=Count("batch_id", distinct=True))
                total_mismatched_products = suspicious_products.objects.aggregate(
                    total=Count("suspicious_id")
                )
                total_mismatched_percentage = (
                    (
                        actual_wastage_percentage.get("actual_wastage_percentage")
                        - expected_wastage_percentage.get("expected_wastage_percentage")
                    )
                    / expected_wastage_percentage.get("expected_wastage_percentage")
                ) * 100
                data = {
                    "total_suspicious_batches": len(batch_ids),
                    "total_mismatched_percentage": total_mismatched_percentage,
                    "rejected_products": rejected.get("rejected"),
                    "resolved_products": resolved.get("resolved"),
                    "total_mismatched_products": total_mismatched_products.get("total"),
                    "suspicious_batches_by_quality": products_by_quality,
                    "suspicious_batches_by_name": products_by_fp_name,
                }
                return Response({"status": True, "data": data})

        except Exception as e:
            return Response({"status": False, "message": str(e)}, status=500)

class delivered_products_stats_view(APIView):
    def get_permissions(self):
            if self.request.method=='GET':
                return [IsAuthenticated()]
            else:
                return [IsAdmin()]
    def get(self,req):
        try:
            with transaction.atomic():
                total_products_delivered=delivered_products.objects.aggregate(
                    total=Sum('quantity')
                )
                total_sales=delivered_products.objects.aggregate(
                    total=Sum('total_sale_price')
                )
                total_cost=delivered_products.objects.aggregate(
                    total=Sum('total_cost')
                )
                total_expenses=delivered_products.objects.aggregate(
                    total=Sum('other_expenses')
                )
                total_profit=delivered_products.objects.aggregate(
                    total=Sum('net_profit')
                )
                del_by_purchaser=delivered_products.objects.values(
                    'purchaser_name'
                ).annotate(
                    total=Count('delivery_id')
                )
                delivery_status=delivered_products.objects.values(
                    'delivery_status'
                ).annotate(
                    total=Count('delivery_id')
                )
            data={
                'total_products_delivered':total_products_delivered.get('total'),
                'total_sales':total_sales.get('total'),
                'total_cost':total_cost.get('total'),
                'total_expenses':total_expenses.get('total'),
                'total_profit':total_profit.get('total'),
                'total_delivery_by_purchaser':del_by_purchaser,
                'delivery_by_status':delivery_status
            }
            return Response({
                'status': True,
                'data': data
            })
        except Exception as e:
            return Response({
                'status':False,
                'message':str(e)
            },status=500)


class Overall_production_stats_view(APIView):
    def get_permissions(self):
            if self.request.method=='GET':
                return [IsAuthenticated()]
            else:
                return [IsAdmin()]
    def get(self,req):
        try:
            with transaction.atomic():
                total_fabric=fabric_in.objects.aggregate(
                    total=Sum('quantity_kg')
                )
                fabric_used=manufactured_products.objects.aggregate(
                    total=Sum('original_quantity_kg')
                )
                Total_products_manufactured=manufactured_products.objects.aggregate(
                    total=Sum('final_product_quantity')
                )
                total_wastage=manufactured_products.objects.aggregate(
                    total=Sum('wastage_kg')
                )
                total_wastage_percentage=(total_wastage.get('total')/total_fabric.get('total'))*100
                failed_test=suspicious_products.objects.aggregate(
                    total=Count('suspicious_id')
                )
                passed_test=ready_to_deliver.objects.aggregate(
                    total=Count('ready_to_deliver_id')   
                )
                products_by_name=manufactured_products.objects.values(
                    'final_product_name'
                ).annotate(
                    total=Sum('final_product_quantity')
                )
                products_by_quality=manufactured_products.objects.values(
                    'fabric_quality__name'
                ).annotate(
                    total=Sum('final_product_quantity')
                )
                products_by_name = [
                    {
                        'name': item['final_product_name'],
                        'total': item['total']
                    }
                    for item in products_by_name
                ]

                products_by_quality = [
                    {
                        'quality': item['fabric_quality__name'],
                        'total': item['total']
                    }
                    for item in products_by_quality
                ]
                data={
                    'total_fabric_received':total_fabric.get('total'),
                    'fabric_used':fabric_used.get('total'),
                    'total_products_manufactured':Total_products_manufactured.get('total'),
                    'total_wastage':total_wastage.get('total'),
                    'total_wastage_percentage':total_wastage_percentage,
                    'total_passed':passed_test.get('total'),
                    'total_failed':failed_test.get('total'),
                    'products_by_name':products_by_name,
                    'products_by_quality':products_by_quality
                }
                return Response({
                    'status':True,
                    'message':'success',
                    'data':data
                })
        except Exception as e:
            return Response({
                'status':False,
                'error':str(e)
            },status=500)