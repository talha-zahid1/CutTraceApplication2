from decimal import Decimal, ROUND_HALF_UP
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
        read_only_fields = ["net_profit", "total_cost"]
    def create(self,validated_data):
        validated_data['total_cost']=validated_data['other_expenses']+validated_data['original_cost']
        validated_data['net_profit']=validated_data['total_sale_price']-validated_data['total_cost']
        return super().create(validated_data)
    def update(self, instance, validated_data):
        original_cost = validated_data.get('original_cost', instance.original_cost)
        other_expenses = validated_data.get('other_expenses', instance.other_expenses)
        total_sale_price = validated_data.get('total_sale_price', instance.total_sale_price)
        
        validated_data['total_cost'] = original_cost + other_expenses
        validated_data['net_profit'] = total_sale_price - validated_data['total_cost']
        
        return super().update(instance, validated_data)
class suspicious_products_serializer(serializers.ModelSerializer):
    class Meta:
        model=suspicious_products
        fields="__all__"

class ready_to_manufacture_serializer(serializers.ModelSerializer):
    class Meta:
        model=ready_to_manufacture
        fields="__all__"
        read_only_fields = ["assigned_at", "updated_at"]

class manufactured_products_serializer(serializers.ModelSerializer):
    class Meta:
        model = manufactured_products
        fields = "__all__"
        read_only_fields = [
            "manufactured_at",
            "wastage_percentage",
            "final_product_percentage",
        ]
        extra_kwargs = {
            "status": {"required": False},
        }

    def _percent(self, part, total):
        total = Decimal(total)
        if not total:
            return Decimal("0.00")
        value = (Decimal(part) / total) * 100
        return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    def _set_percentages(self, data, instance=None):
        def get(field):
            if field in data:
                return data[field]
            return getattr(instance, field) if instance else 0

        original = get("original_quantity_kg")
        data["wastage_percentage"] = self._percent(get("wastage_kg"), original)
        data["final_product_percentage"] = self._percent(
            get("final_product_quantity"), original
        )

    def create(self, validated_data):
        validated_data.setdefault("status", "pending")
        self._set_percentages(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        self._set_percentages(validated_data, instance)
        return super().update(instance, validated_data)

class ready_to_deliver_serializer(serializers.ModelSerializer):
    class Meta:
        model=ready_to_deliver
        fields="__all__"
class user_serializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField(write_only=True)
    email=serializers.EmailField()
    