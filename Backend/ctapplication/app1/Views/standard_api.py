from rest_framework.views import APIView
from ..models import production_standards
from django.db import transaction
from rest_framework.response import Response
from ..serializers import production_standards_serializer
from rest_framework.permissions import IsAuthenticated
from ..custom_permission import IsAdmin
class standard_view(APIView):
    def get_permissions(self):
        if self.request.method=='GET':
            return [IsAuthenticated()]
        else:
            return [IsAdmin()]
    def get(self,req,standard_id=None):
        if not standard_id:
            standard=production_standards.objects.all()
            if not standard:
                return Response({
                    'status':False,
                    'message':'No Standard Set yet'
                })
            serializer=production_standards_serializer(standard,many=True)
            return Response({
                'status':True,
                'data':serializer.data
            })
        else:
            standard=production_standards.objects.filter(standard_id=standard_id).first()
            if not standard:
                return Response({
                    'status':False,
                    'message':f'standard{standard_id} Not Set yet'
                })
            serializer=production_standards_serializer(standard)
            return Response({
                'status':True,
                'data':serializer.data
            })

    def post(self,req):
        with transaction.atomic():
            serializer=production_standards_serializer(data=req.data)
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
    def put(self,req,standard_id):
        with transaction.atomic():
            standard=production_standards.objects.filter(standard_id=standard_id).first()
            if not standard:
                return Response({
                    'status':False,
                    'message':f'standard{standard_id} Not Set yet'
                })
            serializer=production_standards_serializer(standard,data=req.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'status':True,
                    'message':'standard updated'
                })
            return Response({
                'status':False,
                'error':serializer.errors
            },status=400)
        


    
    def delete(self,req,standard_id):
        standard=production_standards.objects.filter(standard_id=standard_id).first()
        if not standard:
            return Response({
                'status':False,
                'message':f'standard{standard_id} Not Set yet'
            })
        standard.delete()
        return Response({
            'status':True,
            'message':'Standard deleted'
        })