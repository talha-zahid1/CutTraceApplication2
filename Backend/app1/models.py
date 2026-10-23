from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    class Role(models.TextChoices):
        NORMAL_USER = "normal_user", "Normal User"
        ADMIN = "admin", "Admin"
        OWNER = "owner", "Owner"


    user=models.OneToOneField(User,on_delete=models.CASCADE)
    mobile_no=models.CharField(max_length=11)
    role=models.CharField(max_length=20,choices=Role.choices,default=Role.NORMAL_USER)


# Create your models here.
class FabricQuality(models.Model):
    quality_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)



class fabric_in(models.Model):
    fabric_in_id=models.AutoField(primary_key=True)
    supplier_name=models.CharField(max_length=50)
    receiver_name=models.CharField(max_length=50)
    quantity_kg=models.DecimalField(max_digits=100, decimal_places=2)
    fabric_quality=models.ForeignKey(FabricQuality,on_delete=models.PROTECT)
    total_cost=models.DecimalField(max_digits=100, decimal_places=2)
    price_per_kg=models.DecimalField(max_digits=100, decimal_places=2)
    color=models.CharField(max_length=50)
    received_at=models.DateTimeField(auto_now_add=True)
    notes=models.TextField()

class production_batches(models.Model):
    batch_id=models.AutoField(primary_key=True)
    current_stage=models.CharField(max_length=20)
    current_status=models.CharField(max_length=20)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(null=True)

class BatchFabricIn(models.Model):
    link_id=models.AutoField(primary_key=True)
    batch_id=models.ForeignKey(production_batches,on_delete=models.CASCADE)
    fabric_in_id=models.ForeignKey(fabric_in,on_delete=models.CASCADE)
    quantity_used=models.DecimalField(max_digits=100, decimal_places=2)
    date=models.DateTimeField(auto_now_add=True)



class ready_to_manufacture(models.Model):
    ready_manufacture_id=models.AutoField(primary_key=True)
    batch_id=models.ForeignKey(production_batches,on_delete=models.CASCADE)
    master_name=models.CharField(max_length=100)
    tailor_name=models.CharField(max_length=100)
    delivery_boy_name=models.CharField(max_length=100)
    final_product_name=models.CharField(max_length=100)
    fabric_quantity_kg=models.DecimalField(max_digits=100, decimal_places=2)
    fabric_quality=models.ForeignKey(FabricQuality,on_delete=models.PROTECT)
    color=models.CharField(max_length=100)
    assigned_at=models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status=models.CharField(max_length=100)
    notes=models.TextField()


class manufactured_products(models.Model):    
    manufactured_id=models.AutoField(primary_key=True)
    batch_id=models.ForeignKey(production_batches,on_delete=models.CASCADE)
    ready_to_manufacture_id=models.ForeignKey(ready_to_manufacture,on_delete=models.CASCADE)
    master_name=models.CharField(max_length=100)
    tailor_name=models.CharField(max_length=100)
    receiver_name=models.CharField(max_length=100)
    original_quantity_kg=models.DecimalField(max_digits=100, decimal_places=2)
    fabric_quality=models.ForeignKey(FabricQuality,on_delete=models.PROTECT)
    wastage_kg=models.DecimalField(max_digits=100, decimal_places=2)
    wastage_percentage=models.DecimalField(max_digits=100, decimal_places=2)
    final_product_name=models.CharField(max_length=100)
    final_product_quantity=models.DecimalField(max_digits=100, decimal_places=2)
    final_product_percentage=models.DecimalField(max_digits=100, decimal_places=2)
    manufactured_at=models.DateTimeField(auto_now_add=True)
    status=models.CharField(max_length=20)
    notes=models.TextField()


class suspicious_products(models.Model):
    suspicious_id=models.AutoField(primary_key=True)
    batch_id=models.ForeignKey(production_batches,on_delete=models.CASCADE)
    fabric_quality=models.ForeignKey(FabricQuality,on_delete=models.PROTECT)
    manufactured_id=models.ForeignKey(manufactured_products,on_delete=models.CASCADE)
    original_quantity_kg=models.DecimalField(max_digits=10,decimal_places=3)
    actual_wastage_kg=models.DecimalField(max_digits=10,decimal_places=3)
    actual_wastage_percentage=models.DecimalField(max_digits=10,decimal_places=3)
    expected_wastage_kg=models.DecimalField(max_digits=10,decimal_places=3)
    expected_wastage_percentage=models.DecimalField(max_digits=10,decimal_places=3)
    actual_final_product_quantity=models.DecimalField(max_digits=10,decimal_places=3)
    expected_final_product_quantity=models.DecimalField(max_digits=10,decimal_places=3)
    final_product_percentage=models.DecimalField(max_digits=250,decimal_places=3)
    mismatched_wastage_percentage=models.DecimalField(max_digits=150,decimal_places=3)
    mismatched_final_product_percentage=models.DecimalField(max_digits=15,decimal_places=3)
    reason=models.TextField()
    detected_at=models.DateTimeField(auto_now_add=True)
    investigation_status=models.CharField(max_length=20)
    remarks=models.TextField()
class ready_to_deliver(models.Model):
    ready_to_deliver_id=models.AutoField(primary_key=True)
    manufactured_id=models.ForeignKey(manufactured_products,on_delete=models.CASCADE)
    batch_id=models.ForeignKey(production_batches,on_delete=models.CASCADE)
    final_product_name=models.CharField(max_length=50)
    quantity=models.DecimalField(max_digits=5,decimal_places=2)
    fabric_quality=models.ForeignKey(FabricQuality,on_delete=models.PROTECT)
    final_product_percentage=models.DecimalField(max_digits=5,decimal_places=2)
    wastage_kg=models.DecimalField(max_digits=5,decimal_places=2)
    wastage_percentage=models.DecimalField(max_digits=5,decimal_places=2)
    prepared_at=models.DateTimeField(auto_now_add=True)
    status=models.CharField(max_length=20)
    notes=models.TextField()

class delivered_products(models.Model):
    delivery_id=models.AutoField(primary_key=True)
    batch_id=models.ForeignKey(production_batches,on_delete=models.CASCADE)
    quantity=models.DecimalField(max_digits=5,decimal_places=2)
    ready_to_deliver_id=models.ForeignKey(ready_to_deliver,on_delete=models.CASCADE)
    final_product_name=models.CharField(max_length=50)
    fabric_quality=models.ForeignKey(FabricQuality,on_delete=models.PROTECT)
    delivery_boy_name=models.CharField(max_length=50)
    purchaser_name=models.CharField(max_length=50)
    total_sale_price=models.DecimalField(max_digits=100,decimal_places=2)
    price_per_item=models.DecimalField(max_digits=100,decimal_places=2)
    delivered_at=models.DateTimeField(auto_now_add=True)
    original_cost=models.DecimalField(max_digits=100,decimal_places=2)
    other_expenses=models.DecimalField(max_digits=100,decimal_places=2)
    total_cost=models.DecimalField(max_digits=100,decimal_places=2)
    net_profit=models.DecimalField(max_digits=100,decimal_places=2)
    delivery_status=models.CharField(max_length=100)
    notes=models.TextField()


class production_standards(models.Model):
    standard_id=models.AutoField(primary_key=True)
    fabric_quality=models.ForeignKey(FabricQuality,on_delete=models.PROTECT)
    final_product_name=models.CharField(max_length=100)
    standard_total_weight=models.DecimalField(max_digits=5,decimal_places=3)
    standard_final_product_quantity=models.DecimalField(max_digits=5,decimal_places=3)
    standard_wastage_quantity=models.DecimalField(max_digits=5,decimal_places=3)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(null=True)
    