from rest_framework.views import APIView
from ..serializers import suspicious_products_serializer,ready_to_deliver_serializer
from rest_framework.response import Response
from ..models import production_standards, manufactured_products
from rest_framework.permissions import IsAuthenticated
from ..custom_permission import IsAdmin
from django.db import transaction

  
class testing_view(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        else:
            return [IsAdmin()]

    def post(self, req):
        with transaction.atomic():
            try:
                if not req.data.get("manufactured_id"):
                    return Response(
                        {
                            "status": False,
                            "message": "Please request with manufactured_id",
                        },
                        status=400,
                    )

                manufactured_data = manufactured_products.objects.filter(
                    manufactured_id=req.data.get("manufactured_id")
                ).first()

                if not manufactured_data:
                    return Response(
                        {
                            "status": False,
                            "message": "The Product is not Manufactured Yet",
                        },
                        status=400,
                    )

                standards = production_standards.objects.filter(
                    fabric_quality=manufactured_data.fabric_quality,
                    final_product_name=manufactured_data.final_product_name,
                ).first()

                if not standards:
                    return Response(
                        {
                            "status": False,
                            "message": "The Product's standards are not set Yet",
                        },
                        status=400,
                    )
                
                
                tested_product = (
                    manufactured_data.original_quantity_kg
                    / standards.standard_total_weight
                ) * standards.standard_final_product_quantity

                tested_Wastage = (
                    manufactured_data.original_quantity_kg
                    / standards.standard_total_weight
                ) * standards.standard_wastage_quantity
                
                if (
                    manufactured_data.final_product_quantity
                    >= (tested_product - 5)
                    and manufactured_data.final_product_quantity
                    <= (tested_product + 5)
                ) and (
                    manufactured_data.wastage_kg >= (tested_Wastage - 5)
                    and manufactured_data.wastage_kg <= (tested_Wastage + 5)
                ):
                    manufactured_data.status = "ready to deliver"
                    manufactured_data.save()
                    data = {
                        "manufactured_id": manufactured_data.manufactured_id,
                        "batch_id": manufactured_data.batch_id_id,
                        "final_product_name": manufactured_data.final_product_name,
                        "quantity": manufactured_data.final_product_quantity,
                        "fabric_quality": manufactured_data.fabric_quality_id,
                        "final_product_percentage": manufactured_data.final_product_percentage,
                        "wastage_kg": manufactured_data.wastage_kg,
                        "wastage_percentage": manufactured_data.wastage_percentage,
                        "status": "Ready",
                        "notes": "Quality Checked and Ready for delivery",
                        }
                    serializer = ready_to_deliver_serializer(data=data)
                    if serializer.is_valid():
                        serializer.save()
                        return Response(
                            {
                                "status": True,
                                "message": "Testing Successful",
                                "data": {
                                    "tested_product_quantity": tested_product,
                                    "tested_wastage_kg": tested_Wastage,
                                    "actual_product_quantity": manufactured_data.final_product_quantity,
                                    "actual_wastage_kg": manufactured_data.wastage_kg,
                                    },
                            }
                            )
                    return Response({"status": False, "error": serializer.errors})
                else:
                    data = {
                        "batch_id": manufactured_data.batch_id_id,
                        "fabric_quality": manufactured_data.fabric_quality_id,
                        "manufactured_id": manufactured_data.manufactured_id,
                        "original_quantity_kg": manufactured_data.original_quantity_kg,
                        "actual_wastage_kg": manufactured_data.wastage_kg,
                        "actual_wastage_percentage": manufactured_data.wastage_percentage,
                        "tested_wastage_kg": tested_Wastage,
                        "tested_wastage_percentage": (
                            tested_Wastage
                            / manufactured_data.original_quantity_kg
                        ) * 100,
                        "actual_final_product_quantity": manufactured_data.final_product_quantity,
                        "tested_final_product_quantity": tested_product,
                        "final_product_percentage": manufactured_data.final_product_percentage,
                        "mismatched_wastage_percentage": round(
    (
        abs(manufactured_data.wastage_kg - tested_Wastage)
        / tested_Wastage
    ) * 100,
    3
),
                        "mismatched_final_product_percentage": (
                            abs(
                                manufactured_data.final_product_quantity
                                - tested_product
                            )
                            / tested_product
                        ) * 100,
                        "reason": "Actual output outside acceptable range of expected standard",
                        "investigation_status": "Pending",
                        "expected_wastage_kg": tested_Wastage,
"expected_wastage_percentage": (
    tested_Wastage / manufactured_data.original_quantity_kg
) * 100,
"expected_final_product_quantity": tested_product,
"remarks": "Product flagged for investigation",
                    }

                    serializer = suspicious_products_serializer(data=data)

                    if serializer.is_valid():
                        serializer.save()

                        manufactured_data.status = "Flagged"
                        manufactured_data.save()

                        return Response(
                            {
                                "status": True,
                                "message": "Product flagged as suspicious",
                            }
                        )

                    else:
                        return Response(
                            {
                                "status": False,
                                "errors": serializer.errors,
                            },
                            status=400,
                        )

            except Exception as e:
                return Response(
                    {
                        "status": False,
                        "message": "Something went wrong during testing",
                        "error": str(e),
                    },
                    status=500,
                )