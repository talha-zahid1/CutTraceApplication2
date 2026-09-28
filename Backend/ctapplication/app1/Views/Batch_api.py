from rest_framework.views import APIView
from ..models import production_batches
from rest_framework.response import Response
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from ..custom_permission import IsAdmin
from ..serializers import production_batches_serializer


class batch_view(APIView):
    def get_permissions(self):
                if self.request.method=='GET':
                    return [IsAuthenticated()]
                else:
                    return [IsAdmin()]
                
    def get(self,req,batch_id=None):
        if not batch_id:
            batches=production_batches.objects.all()
            serializer=production_batches_serializer(batches,many=True)
            return Response({
                'status':True,
                'data':serializer.data
            })
        else:
            batch=production_batches.objects.filter(batch_id=batch_id).first()
            if not batch:
                return Response({
                    'status':False,
                    'message':'Batch Not Found'
                },status=404)
            serializer=production_batches_serializer(batch)
            return Response({
                        'status':True,
                        'data':serializer.data
                    })

    def post(self,req):
        with transaction.atomic():

            serializer=production_batches_serializer(data=req.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'status':True,
                    'message':'Batch Added'
                })
            return Response({
                'status':False,
                'error':serializer.errors
            },status=400)
    def put(self,req,batch_id):
        with transaction.atomic():
            batch=production_batches.objects.filter(batch_id=batch_id).first()
            if not batch:
                return Response({
                    'status':False,
                    'message':'Batch Not Found'
                },status=404)
            serializer=production_batches_serializer(batch,data=req.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'status':True,
                    'message':'Batch Updated'
                })
            return Response({
                'status':False,
                'error':serializer.errors
            },status=400)
    def delete(self,req,batch_id):
        batch=production_batches.objects.filter(batch_id=batch_id).first()
        if not batch:
            return Response({
                'status':False,
                'message':'Batch Not Found'
            },status=404)
        batch.delete()
        return Response({
            'status':True,
            'message':'Batch Deleted'
        })
        