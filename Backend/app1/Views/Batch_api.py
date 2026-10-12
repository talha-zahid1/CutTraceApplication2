from rest_framework.views import APIView
from ..models import production_batches,BatchFabricIn
from django.utils import timezone
from rest_framework.response import Response
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from ..custom_permission import IsAdmin
from ..serializers import production_batches_serializer,BatchfabricIn_serializer


class batch_view(APIView):
    # def get_permissions(self):
    #             if self.request.method=='GET':
    #                 return [IsAuthenticated()]
    #             else:
    #                 return [IsAdmin()]
                
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
            data={
                "current_stage":req.data.get('current_stage'),
                "current_status":req.data.get('current_status')
            }
            fabric_in_ids=req.data.get('fabric_in_ids') or []
            if not fabric_in_ids:
                transaction.set_rollback(True)
                return Response({'status':False,'message':'At least one fabric_in entry required'},status=400)
            serializer=production_batches_serializer(data=data)
            if serializer.is_valid():
                batch=serializer.save()
                junk_data=[
                    {
                        "batch_id":batch.batch_id,
                        "fabric_in_id":elem.get('fabric_in_id'),
                        "quantity_used":elem.get('quantity_used')
                    }
                    for elem in fabric_in_ids
                ]
                ser=BatchfabricIn_serializer(data=junk_data,many=True)
                if ser.is_valid():
                    ser.save()
                    return Response({
                        'status':True,
                        'message':'Batch Added'
                    })
                transaction.set_rollback(True)
                return Response({
                    'status':False,
                    'error':ser.errors
                },status=400)                
            transaction.set_rollback(True)
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
            fabric_in_ids=req.data.get('fabric_in_ids') or []
            data={
                "current_stage":req.data.get('current_stage'),
                "current_status":req.data.get('current_status')
            }
            if not fabric_in_ids:
                transaction.set_rollback(True)
                return Response({'status':False,'message':'At least one fabric_in entry required'},status=400)
            serializer=production_batches_serializer(batch,data=data,partial=True)
            if serializer.is_valid():
                batch=serializer.save(updated_at=timezone.now())
                BatchFabricIn.objects.filter(batch_id=batch.batch_id).delete()
                junk_data=[
                    {
                        "batch_id":batch.batch_id,
                        "fabric_in_id":elem.get('fabric_in_id'),
                        "quantity_used":elem.get('quantity_used')
                    }
                        for elem in fabric_in_ids
                ]
                ser=BatchfabricIn_serializer(data=junk_data,many=True)
                if ser.is_valid():
                    ser.save()
                    return Response({
                        'status':True,
                        'message':'Batch Updated'
                    })
                transaction.set_rollback(True)
                return Response({
                    'status':False,
                    'error':ser.errors
                },status=400)
            transaction.set_rollback(True)
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
        