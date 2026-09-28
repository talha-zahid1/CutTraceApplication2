from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import manufactured_products
from ..serializers import manufactured_products_serializer
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from ..custom_permission import IsAdmin

class Manufactured_view(APIView):
    def get_permissions(self):
        if self.request.method=='GET':
            return [IsAuthenticated()]
        else:
            return [IsAdmin()]
    def get(self,req,manufactured_id=None):
        if not manufactured_id:
            products=manufactured_products.objects.get()
            if not products:
                return Response({
                    'status':True,
                    'message':'oops! No product is Manufactured yet'
                })
            serializer=manufactured_products_serializer(products,many=True)
            return Response({
                'status':True,
                'data':serializer.data
            })
        else:
            product=manufactured_products.objects.filter(manufactured_id=manufactured_id).first()
            if not product:
                return Response({
                    'status':True,
                    'message':f'oops! product{manufactured_id} is not Manufactured yet'
                    })
            serializer=manufactured_products_serializer(product)
            return Response({
                'status':True,
                'data':serializer.data
            })

        
    def post(self,req):
        with transaction.atomic():
            serializer=manufactured_products_serializer(data=req.data)
            if serializer.is_valid():
                
                serializer.save()
                return Response({
                    'status':True,
                    'message':'success',
                    'data':serializer.data
                })
            return Response({
                'status':False,
                'error':serializer.errors
            },status=400)

    def put(self,req,manufactured_id):
        with transaction.atomic():
            product=manufactured_products.objects.filter(manufactured_id=manufactured_id).first()
            if not product:
                return Response({
                    'status':True,
                    'message':f'oops! product{manufactured_id} is not Manufactured yet'
                })
            if product.status.lower()!='pending':
                return Response({
                    'status':False,
                    'message':"Oops!  product can't be Updated"
                })
            serializer=manufactured_products_serializer(product,data=req.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'status':True,
                    'message':'Product Updated'
                })
            
    def delete(self,req,manufactured_id):
        product=manufactured_products.objects.filter(manufactured_id=manufactured_id).first()
        if not product:
            return Response({
                'status':True,
                'message':f'oops! product{manufactured_id} is not Manufactured yet'
            })
        if product.status.lower()!='pending':
            return Response({
                'status':False,
                'message':"Oops!  product can't be cancelled"
                })
        product.status='cancelled'
        product.save()
        return Response({
            'status':True,
            'message':'product cancelled'
            })