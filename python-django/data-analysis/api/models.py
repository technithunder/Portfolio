from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None):

        if not email:
            raise ValueError('Email is required')
        
        if not name:
            raise ValueError('Name is required')

        user = self.model(
            email=self.normalize_email(email),
            name=name
        )

        user.is_active= True
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):

        user = self.create_user(
        email, 
        name=name, 
        password=password
        )
        user.is_admin = True
        user.is_superuser= True
        user.is_staff= True
        user.is_active= True
        user.save(using=self._db)
        return user

class User(AbstractUser):
    
    username = None
    user_id= models.UUIDField(primary_key=True, default=uuid.uuid4, 
                              editable=False, unique=True, db_column= 'user_id')
    email = models.EmailField(max_length=255, unique=True, db_column= 'email')
    name= models.CharField(max_length=255, db_column= 'name')
    joined_on= models.DateTimeField(auto_now_add=True, db_column= 'joined_on')
    available_credit= models.PositiveIntegerField(db_column= 'available_credit', default=1)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()
    
    def __str__(self):
        return self.email
    
class AboutUs(models.Model):
    about_id= models.UUIDField(primary_key=True, default=uuid.uuid4, 
                              editable=False, unique=True, db_column= 'about_id')
    about_us= models.TextField(db_column= 'about_us')
    created_on= models.DateTimeField(auto_now_add=True, db_column= 'created_on')
    modified_on= models.DateTimeField(auto_now=True, db_column= 'modified_on')

    def __str__(self):
        return self.about_us[:25]
    
    def save(self, *args, **kwargs):
        # Ensuring there is only one record
        if AboutUs.objects.exists():
            raise ValueError("Only one AboutUs instance is allowed, Please modify the existing instance")

        return super().save(*args, **kwargs)
    
    class Meta:
        verbose_name_plural= "About Us"


class Collection(models.Model):
    STATUS_CHOICES=(
        ('in_progress', 'in_progress'),
        ('failed', 'failed'),
        ('succeed', 'succeed')
    )
    collection_id= models.UUIDField(primary_key=True, default=uuid.uuid4, 
                              editable=False, unique=True, db_column= 'collection_id')
    user= models.ForeignKey(User, related_name= 'collections', 
                            on_delete= models.CASCADE, db_column= 'user')
    collection_name= models.CharField(max_length=255, db_column= 'collection_name')
    file_table_name= models.CharField(max_length= 255, db_column='file_table_name', blank=True, null=True)
    created_on= models.DateTimeField(auto_now_add=True, db_column= 'created_on')
    status= models.CharField(max_length= 255, default='in_progress', db_column= 'status')

    def __str__(self):
        return str(self.collection_id)
    
    
class Campaign(models.Model):
    campaign_id= models.UUIDField(primary_key=True, default=uuid.uuid4, 
                              editable=False, unique=True, db_column= 'campaign_id')
    collection= models.ForeignKey(Collection, related_name= 'campaigns', 
                            on_delete= models.CASCADE, db_column= 'collection')
    campaign_name= models.CharField(max_length=255, db_column= 'campaign_name')
    result_table_name= models.CharField(max_length= 255, db_column='result_table_name', blank=True, null=True)
    start_date= models.DateTimeField(db_column= 'start_date')
    end_date= models.DateTimeField(db_column= 'end_date')

    def __str__(self):
        return str(self.campaign_id)
    
class Plan(models.Model):
    plan_id= models.UUIDField(primary_key=True, default=uuid.uuid4, 
                              editable=False, unique=True, db_column= 'plan_id')
    plan_name= models.CharField(max_length=255, db_column= 'plan_name')
    plan_description= models.TextField(db_column= 'plan_description', null=True, blank=True)
    credit= models.IntegerField(db_column= 'credit')
    amount= models.FloatField(db_column= 'amount')
    created_at= models.DateTimeField(auto_now_add=True, db_column= 'created_at')
    updated_at= models.DateTimeField(auto_now=True, db_column= 'updated_at')
    is_active= models.BooleanField(default=True, db_column= 'is_active')
    is_selectable= models.BooleanField(default=True, db_column= 'is_selectable')

    def __str__(self):
        return self.plan_name
    
class UserPlan(models.Model):
    STATUS_CHOICES=(
        ('stripe', 'stripe'),
        ('paypal', 'paypal')
    )

    user_plan_id= models.UUIDField(primary_key=True, default=uuid.uuid4, 
                              editable=False, unique=True, db_column= 'user_plan_id')
    user= models.ForeignKey(User, related_name= 'user_plans', db_column= 'user', on_delete= models.CASCADE)
    plan= models.ForeignKey(Plan, related_name= 'user_plans', db_column= 'plan', on_delete= models.CASCADE)
    purchased_on= models.DateTimeField(auto_now_add=True, db_column= 'purchased_on')
    is_paid= models.BooleanField(default=False, db_column= 'is_paid')
    transaction_id= models.CharField(max_length=255, db_column= 'transaction_id', blank=True, null=True)
    payment_method= models.CharField(max_length=255, db_column= 'payment_method', blank=True, null=True)

    def __str__(self):
        return str(self.user_plan_id)

