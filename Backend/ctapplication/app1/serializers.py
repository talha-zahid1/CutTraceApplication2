from .models import production_batches,production_standards,fabric_in,delivered_products,suspicious_products,manufactured_products,ready_to_deliver,ready_to_manufacture,FabricQuality
from rest_framework import serializers
from django.db import models

class production_batches_serializer(serializers.ModelSerializer):
    class Meta:
        model=production_batches
        fields="__all__"
class production_standards_serializer(serializers.ModelSerializer):
    class Meta:
        model=production_standards
        fields="__all__"
class fabric_in_serializer(serializers.ModelSerializer):
    class Meta:
        model=fabric_in
        fields="__all__"
class delivered_products_serializer(serializers.ModelSerializer):
    class Meta:
        model=delivered_products
        fields="__all__"

class suspicious_products_serializer(serializers.ModelSerializer):
    class Meta:
        model=suspicious_products
        fields="__all__"

class ready_to_manufacture_serializer(serializers.ModelSerializer):
    class Meta:
        model=ready_to_manufacture
        fields="__all__"
class manufactured_products_serializer(serializers.ModelSerializer):
    class Meta:
        model=manufactured_products
        fields="__all__"

class ready_to_deliver_serializer(serializers.ModelSerializer):
    class Meta:
        model=ready_to_deliver
        fields="__all__"
class user_serializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField(write_only=True)
    email=serializers.EmailField()
    