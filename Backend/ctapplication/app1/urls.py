from rest_framework.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .Views import (
    Fabric_in_view,
    batch_view,
    delivered_view,
    Manufactured_view,
    ready_to_deliver_view,
    ready_to_view,
    standard_view,
    suspicious_batches_stats_view,
    delivered_products_stats_view,
    Overall_production_stats_view,
    testing_view,
    suspicious_view,
    register_view,
    logout_view,
)

urlpatterns = [
    path("api/token/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path("register/",register_view.as_view()),
    path("logout/",logout_view.as_view()),
    path("fabric_in_api/", Fabric_in_view.as_view()),
    path("product_batches_api/", batch_view.as_view()),
    path("ready_to_manufacture_api/", ready_to_view.as_view()),
    path("manufacturing_api/", Manufactured_view.as_view()),
    path("testing_api/", testing_view.as_view()),
    path("suspicious_products_api/", suspicious_view.as_view()),
    path("ready_to_deliver_api/", ready_to_deliver_view.as_view()),
    path("delivered_products_api/", delivered_view.as_view()),
    path("production_standards_api/", standard_view.as_view()),
    path("suspicious_batches_satistics_api/", suspicious_batches_stats_view.as_view()),
    path("delivered_product_satistics_api/", delivered_products_stats_view.as_view()),
    path("overall_production_satistics_api/", Overall_production_stats_view.as_view()),
]
