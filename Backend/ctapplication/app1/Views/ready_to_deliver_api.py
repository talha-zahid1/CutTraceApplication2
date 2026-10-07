from rest_framework.views import APIView
from django.db import transaction
from rest_framework.response import Response
from ..models import ready_to_deliver, manufactured_products
from ..serializers import ready_to_deliver_serializer
from rest_framework.permissions import IsAuthenticated
from ..custom_permission import IsAdmin

class ready_to_deliver_view(APIView):
    def get_permissions(self):
        if self.request.method=='GET':
            return [IsAuthenticated()]
        else:
            return [IsAdmin()]
    def get(self, req, ready_to_deliver_id=None):
        if ready_to_deliver_id:
            product = ready_to_deliver.objects.filter(
                ready_to_deliver_id=ready_to_deliver_id
            ).first()
            if not product:
                return Response(
                    {"status": False, "message": "product is not ready yet"}
                )
            serilizer = ready_to_deliver_serializer(product)
            return Response(
                {"status": True, "message": "success", "data": serilizer.data}
            )
        else:
            products = ready_to_deliver.objects.all()
            if not products:
                return Response(
                    {"status": False, "message": "No product is not ready yet"}
                )
            serilizer = ready_to_deliver_serializer(products, many=True)
            return Response(
                {"status": True, "message": "success", "data": serilizer.data}
            )

    def put(self, req, ready_to_deliver_id):
        product = ready_to_deliver.objects.filter(
            ready_to_deliver_id=ready_to_deliver_id
        ).first()
        if not product:
            return Response({"status": False, "message": "product is not ready yet"})
        serilizer = ready_to_deliver_serializer(product, data=req.data, partial=True)
        if serilizer.is_valid():
            serilizer.save()
            return Response({"status": True, "message": "success", "data": serilizer.data})
        return Response({
            'status':False,
            'error':serilizer.errors
        },status=400)
        


