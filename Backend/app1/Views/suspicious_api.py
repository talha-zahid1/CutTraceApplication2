from rest_framework.views import APIView
from ..models import suspicious_products
from rest_framework.response import Response
from ..serializers import suspicious_products_serializer
from rest_framework.permissions import IsAuthenticated
from ..custom_permission import IsAdmin


class suspicious_view(APIView):
    # def get_permissions(self):
    #     if self.request.method=='GET':
    #         return [IsAuthenticated()]
    #     else:
    #         return [IsAdmin()]
    def get(self,req,suspicious_id=None):
        if not suspicious_id:
            suspicious=suspicious_products.objects.all()
            if not suspicious:
                return Response({
                    'status':True,
                    'message':'No suspicious Product Not Found'
                })
            serializer=suspicious_products_serializer(suspicious,many=True)
            return Response({
                'status':True,
                'data':serializer.data
            })
        else:
            suspicious=suspicious_products.objects.filter(suspicious_id=suspicious_id).first()
            if not suspicious:
                return Response({
                    'status':True,
                    'message':' suspicious Product Not Found'
                })
            serializer=suspicious_products_serializer(suspicious)
            return Response({
                'status':True,
                'data':serializer.data
            })
    
    
    def put(self,req,suspicious_id):
        suspicious=suspicious_products.objects.filter(suspicious_id=suspicious_id).first()
        if not suspicious:
            return Response({
                'status':False,
                'error':f' suspicious Product {suspicious_id} Not Found'
            })
        serializer=suspicious_products_serializer(suspicious,data=req.data,partial=True)
        if serializer.is_valid():
            if suspicious.investigation_status.lower()!='resolved' and suspicious.investigation_status.lower()!='confirmed':
                serializer.save()
                return Response({
                    'status':True,
                    'message':'suspicious product updated',
                    'data':serializer.data
                })
            return Response({
                'status':True,
                'message':'Investigation status is already Resolved or confirmed ',
            }) 
        return Response({
            'status':True,
            'error':serializer.errors
        },status=400)
    



