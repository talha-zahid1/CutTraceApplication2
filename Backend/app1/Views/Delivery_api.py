from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import ready_to_deliver, delivered_products
from django.db import transaction
from ..serializers import delivered_products_serializer
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated
from ..custom_permission import IsAdmin

class delivered_view(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        else:
            return [IsAdmin()]

    def get(self, req, delivery_id=None):
        with transaction.atomic():

            if delivery_id:
                product = delivered_products.objects.filter(
                    delivery_id=delivery_id
                ).first()

                if not product:
                    return Response({
                        "status": False,
                        "message": "Product is not ready yet"
                    })

                serializer = delivered_products_serializer(product)
                return Response({
                    "status": True,
                    "message": "Success",
                    "data": serializer.data
                })

            else:
                products = delivered_products.objects.order_by(
                    '-delivered_at'
                )[:5]

                if not products.exists():
                    return Response({
                        "status":True,
                        "data": "No product is ready yet"
                    })

                serializer = delivered_products_serializer(
                    products, many=True
                )
                return Response({
                    "status": True,
                    "message": "Success",
                    "data": serializer.data
                })

    def post(self, req):
        with transaction.atomic():
            id = req.data.get('ready_to_deliver_id')
            product = ready_to_deliver.objects.filter(
                ready_to_deliver_id=id
            ).first()

            if not product:
                return Response({
                    "status": False,
                    "message": "Product is not manufactured yet"
                })

            if product.status.lower() == 'ready':
                data = {
                    'batch_id': product.batch_id_id,
                    'quantity': product.quantity,
                    'ready_to_deliver_id': product.ready_to_deliver_id,
                    'final_product_name': product.final_product_name,
                    'fabric_quality': product.fabric_quality_id,
                    'delivery_boy_name': req.data.get('delivery_boy_name'),
                    'purchaser_name': req.data.get('purchaser_name'),
                    'total_sale_price': req.data.get('total_sale_price'),
                    'price_per_item': req.data.get('price_per_item'),
                    'original_cost': req.data.get('original_cost'),
                    'other_expenses': req.data.get('other_expenses'),
                    'total_cost': req.data.get('total_cost'),
                    'net_profit': req.data.get('net_profit'),
                    'delivery_status': 'Delivered',
                    'notes': req.data.get('notes'),
                }

                serializer = delivered_products_serializer(data=data)

                if serializer.is_valid():
                    serializer.save()
                    product.status = 'delivered'
                    product.save()

                    return Response({
                        'status': True,
                        'message': 'The product is delivered'
                    })

                return Response({
                    'status': False,
                    'error': serializer.errors
                })

            elif product.status.lower() == 'delivered':
                return Response({
                    'status': False,
                    'error': 'Product is already delivered'
                })

            else:
                return Response({
                    'status': False,
                    'error': 'The product is not ready to deliver yet'
                })

    def put(self, req,delivery_id):
        obj=delivered_products.objects.filter(delivery_id=delivery_id).first()
        if not obj :
            return Response({
                'status':False,
                'message':"The product doesn't exist"
            },status=404)
        serializer=delivered_products_serializer(obj,data=req.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status':True,
                'message':'Product Updated'
            })
        return Response({
            'status':False,
            'error':serializer.errors
        },status=400)
    
    def delete(self,req,delivery_id):
        obj=delivered_products.objects.filter(delivery_id=delivery_id).first()
        if not obj :
            return Response({
                'status':False,
                'message':"The product doesn't exist"
            },status=404)
        obj.delete()
        return Response({
            'status':True,
            'message':'entry deleted'
        })
        
        
        

