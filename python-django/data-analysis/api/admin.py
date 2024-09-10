from django.contrib import admin
from .models import *

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'email', 'name', 'joined_on', 'available_credit', 'is_active', 'is_superuser')
    search_fields = ['user_id', 'email', 'name']

@admin.register(AboutUs)
class AboutUsAdmin(admin.ModelAdmin):
    list_display = ('created_on', 'modified_on')

@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ('collection_id', 'user', 'collection_name', 'created_on')
    search_fields = ['collection_id', 'collection_name']

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('campaign_id', 'collection', 'campaign_name', 'start_date', 'end_date')
    search_fields = ['campaign_id', 'campaign_name']

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('plan_id', 'plan_name', 'credit', 'amount', 'is_active')

@admin.register(UserPlan)
class UserPlanAdmin(admin.ModelAdmin):
    list_display = ('user_plan_id', 'user', 'plan', 'purchased_on', 'payment_method')