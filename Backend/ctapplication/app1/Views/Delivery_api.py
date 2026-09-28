from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import ready_to_deliver,delivered_products
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from ..custom_permission import IsAdmin
from ..serializers import delivered_products_serializer


class delivered_view(APIView):
    def get_permissions(self):
        if self.request.method=='GET':
            return [IsAuthenticated()]
        else:
            return [IsAdmin()]

    def get(self,req,delivery_id=None):
        if delivery_id:
            product = delivered_products.objects.filter(
                delivery_id=delivery_id
            ).first()
            if not product:
                return Response(
                    {"status": False, "message": "product is not ready yet"}
                )
            serilizer = delivered_products_serializer(product)
            return Response(
                {"status": True, "message": "success", "data": serilizer.data}
            )
        else:
            products = delivered_products.objects.all()
            if not products:
                return Response(
                    {"status": False, "message": "No product is not ready yet"}
                )
            serilizer = delivered_products_serializer(products, many=True)
            return Response(
                {"status": True, "message": "success", "data": serilizer.data}
            )
    def post(self,req):
        with transaction.atomic():
            id=req.data.get('ready_to_deliver_id')
            product=ready_to_deliver.objects.filter(ready_to_deliver_id=id).first()
            if not product:
                return Response(
                    {"status": False, "message": "product is not manufactured yet"}
                )
            if product.status.lower()=='ready':
                data={
                    'batch_id':product.batch_id,
                    'quantity':product.quantity,
                    'ready_to_deliver_id':product.ready_to_deliver_id,
                    'final_product_name':product.final_product_name,
                    'fabric_quality':product.fabric_quality,
                    'delivery_boy_name':req.data.get('delivery_boy_name'),
                    'purchaser_name':req.data.get('purchaser_name'),
                    'total_sale_price':req.data.get('total_sale_price'),
                    'price_per_item':req.data.get('price_per_item'),
                    'original_cost':req.data.get('original_cost'),
                    'other_expenses':req.data.get('other_expenses'),
                    'total_cost':req.data.get('total_cost'),
                    'net_profit':req.data.get('net_profit'),
                    'delivery_status':'Delivered',
                    'notes':req.data.get('notes'),
                }
                serializer=delivered_products_serializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    product.status='delivered'
                    product.save()
                    return Response({
                        'status':True,
                        'message':'The product is delivered'
                    })
                return Response({'status':False,'error':serializer.errors})
            elif product.status.lower()=='delivered':
                return Response({'status':False,'error':'Product is already delivered'})
            else:
                return Response({'status':False,'error':'The product is not ready to deliver yet'})
    def put(self,req):
        pass
    def delete(self,req):
        # just update the status to cancel
        pass

