from rest_framework.views import APIView
from ..models import ready_to_manufacture,production_batches
from rest_framework.response import Response
from django.db import transaction
from ..serializers import ready_to_manufacture_serializer
from rest_framework.permissions import IsAuthenticated
from ..custom_permission import IsAdmin
class ready_to_view(APIView):
    # def get_permissions(self):
    #         if self.request.method=='GET':
    #             return [IsAuthenticated()]
    #         else:
    #             return [IsAdmin()]
    def get(self,req,ready_manufacture_id=None):
        if ready_manufacture_id:
            product=ready_to_manufacture.objects.filter(ready_manufacture_id=ready_manufacture_id).first()
            if not product:
                return Response({
                    'status':True,
                    'message':f"Product {ready_manufacture_id} is not ready to manufacture"
                })
            serializer=ready_to_manufacture_serializer(product)
            return Response({
                'status':True,
                'data':serializer.data
            })
        else:
            product=ready_to_manufacture.objects.all()
            if not product:
                return Response({
                    'status':True,
                    'message':"Oops! No product is ready to manufacture",
                    'data':[]
                })
            serializer=ready_to_manufacture_serializer(product,many=True)
            return Response({
                'status':True,
                'data':serializer.data
            })


    def post(self,req):
        with transaction.atomic():
            
            serializer=ready_to_manufacture_serializer(data=req.data)
            
            if serializer.is_valid():
                serializer.save()
                
                return Response({
                    'status':True,
                    'message':serializer.data
                })
            return Response({
                'status':False,
                'error':serializer.errors
            },status=400)


    
    def put(self,req,ready_manufacture_id):
        with transaction.atomic():
            product=ready_to_manufacture.objects.filter(ready_manufacture_id=ready_manufacture_id).first()
            if not product:
                return Response({
                    'status':False,
                    'message':"Oops!  product Not Found"
                })
            if product.status.lower()!='pending':
                return Response({
                    'status':False,
                    'message':"Oops!  product can't be Updated"
                })
            
            serializer=ready_to_manufacture_serializer(product,data=req.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'status':True,
                    'message':f"product {ready_manufacture_id} Updated"
                })
            return Response({
                'status':False,
                'error':serializer.errors
            },status=400)


    def delete(self,req,ready_manufacture_id):
        product=ready_to_manufacture.objects.filter(ready_manufacture_id=ready_manufacture_id).first()
        if not product:
            return Response({
                'status':False,
                'message':"Oops!  product Not Found"
            })
        if product.status.lower()!='pending':
            return Response({
                'status':False,
                'message':"Oops!  product can't be Cancelled"
                })
        product.status='Cancelled'
        product.save()
        return Response({
            'status':True,
            'message':f"Product {ready_manufacture_id} Cancelled"
            })
        
        