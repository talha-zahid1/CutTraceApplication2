from .models import production_batches,production_standards,fabric_in,delivered_products,suspicious_products,manufactured_products,ready_to_deliver,ready_to_manufacture,FabricQuality,BatchFabricIn
from rest_framework import serializers
from django.db import models

class FabricQuality_serializer(serializers.ModelSerializer):
    class Meta:
        model=FabricQuality
        fields='__all__'

class production_batches_serializer(serializers.ModelSerializer):
    fabric_in_ids=serializers.SerializerMethodField()
    class Meta:
        model=production_batches
        fields="__all__"

    def get_fabric_in_ids(self,obj):
        entries=BatchFabricIn.objects.filter(batch_id=obj)
        return [
            {
                "fabric_in_id":entry.fabric_in_id_id,
                "quantity_used":entry.quantity_used
            }
            for entry in entries
        ]
class production_standards_serializer(serializers.ModelSerializer):
    class Meta:
        model=production_standards
        fields="__all__"
class BatchfabricIn_serializer(serializers.ModelSerializer):
    class Meta:
        model=BatchFabricIn
        fields="__all__"
class fabric_in_serializer(serializers.ModelSerializer):
    fabric_quality=serializers.CharField()

    class Meta:
        model=fabric_in
        fields="__all__"
        extra_kwargs={
            'notes':{'required':False,'allow_blank':True},
        }

    def _get_or_create_quality(self,name):
        quality=FabricQuality.objects.filter(name__iexact=name).first()
        if not quality:
            quality=FabricQuality.objects.create(name=name)
        return quality

    def create(self,validated_data):
        validated_data['fabric_quality']=self._get_or_create_quality(
            validated_data['fabric_quality']
        )
        return super().create(validated_data)

    def update(self,instance,validated_data):
        if 'fabric_quality' in validated_data:
            validated_data['fabric_quality']=self._get_or_create_quality(
                validated_data['fabric_quality']
            )
        return super().update(instance,validated_data)

    def to_representation(self,instance):
        data=super().to_representation(instance)
        data['fabric_quality']=instance.fabric_quality.name
        return data

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
    