from rest_framework.views import APIView
from django.db import transaction
from rest_framework.response import Response
from ..models import fabric_in, production_batches
from ..serializers import fabric_in_serializer
from ..custom_permission import IsAdmin
from rest_framework.permissions import IsAuthenticated

class Fabric_in_view(APIView):
    def get_permissions(self):
        if self.request.method=='GET':
            return [IsAuthenticated()]
        else:
            return [IsAdmin()]
    def get(self, req, batch_id=None):

        if not batch_id:
            entries = fabric_in.objects.all()
            serializer = fabric_in_serializer(entries, many=True)
            return Response(
                {"status": True, "message": "success", "data": serializer.data}
            )
        else:
            batch = production_batches.objects.filter(batch_id=batch_id).first()
            if not batch:
                return Response({
                    'status':False,
                    'message':"Batch doesn't exist"
                },status=400)
            serializer = fabric_in_serializer(batch.fabric_in_id)
            return Response(
                {"status": True, "message": "success", "data": serializer.data}
            )

    def post(self, req):
        with transaction.atomic():
            serializer = fabric_in_serializer(data=req.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"status": True, "message": "Successfull"})
            return Response(
                {"status": False, "error": serializer.error_messages}, status=400
            )

    def put(self, req,fabric_in_id):
        with transaction.atomic():
            fabric=fabric_in.objects.filter(fabric_in_id=fabric_in_id).first()
            if not fabric:
                return Response({
                    'status':False,
                    'message':"entry doesn't exist"
                },status=400)
            serializer=fabric_in_serializer(fabric,data=req.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'status':True,
                    'message':'entry Updated'
                })
            return Response({
                'status':False,
                'message':serializer.errors
            },status=400)

    def delete(self, req,fabric_in_id):
        fabric=fabric_in.objects.filter(fabric_in_id=fabric_in_id).first()
        if not fabric:
            return Response({
                'status':False,
                'message':"entry doesn't exist"
            },status=400)        
        fabric.delete()
        return Response({
            'status':True,
            'message':'Entry Deleted Successfully'
        })
            
