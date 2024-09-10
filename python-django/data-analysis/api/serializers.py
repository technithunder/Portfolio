from rest_framework import serializers
import json
import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
# load_dotenv()
load_dotenv(dotenv_path="prod.env")

from .models import *

class SignUpSerializer(serializers.ModelSerializer):
    name= serializers.CharField(max_length=255)

    class Meta:
        model= User
        fields= ['email', 'name', 'password']
        extra_kwargs={
            'password': {'write_only':True}
        }

    def validate(self, attrs):
        if User.objects.filter(email=attrs.get('email')).exists():
            raise Exception("Email already exists, please try with different email")
        return attrs

    def create(self, validate_data):
        user= User.objects.create_user(**validate_data)

        return user
    
class LoginSerializer(serializers.ModelSerializer):
    email=serializers.EmailField()
    class Meta:
        model= User
        fields= ['email', 'password']

class AboutUsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model= AboutUs
        fields= '__all__'


class CreateCollectionSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        collection_name= validated_data.get('collection_name')
        campaigns= json.loads(validated_data.get('campaigns'))
        request= validated_data.get('request')
        user= validated_data.get('user')

        collection_obj= Collection.objects.create(
            collection_name=collection_name, user= user,
        )

        if collection_obj:
            for campaign in campaigns:
                
                Campaign.objects.create(
                    campaign_name= campaign['campaign_name'],
                    start_date= campaign['start_date'],
                    end_date= campaign['end_date'],
                    collection= collection_obj
                )

        return collection_obj

    def to_internal_value(self, data):
        internal_value = {}

        collection_name= data.get('collection_name')
        campaigns= data.get('campaigns')
        
        request = self.context['request']
        user = self.context['user']

        internal_value.update({ 'request': request,
                               'collection_name': collection_name,
                               'campaigns': campaigns,
                               'user': user
                               })
        return internal_value
    
    class Meta:
        model= Collection
        fields= '__all__'

class CampaignSerializer(serializers.ModelSerializer):

    class Meta:
        model= Campaign
        fields= '__all__'

class CollectionListSerializer(serializers.ModelSerializer):
    campaigns = serializers.SerializerMethodField()

    def get_campaigns(self, obj):
        res=[]
        campaigns_qs= Campaign.objects.filter(collection=obj)

        for campaign in campaigns_qs:
            campaign_id= campaign.campaign_id
            campaign_name= campaign.campaign_name

            res.append({
                'campaign_id': campaign_id,
                'campaign_name': campaign_name
            })

        return res

    class Meta:
        model= Collection
        fields= '__all__'


class CollectionDetailSerializer(serializers.ModelSerializer):
    campaigns = CampaignSerializer(many=True, read_only=True)

    class Meta:
        model= Collection
        fields= '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Filter campaigns to include only those with non-null file_table_name
        filtered_campaigns = [
            campaign_data for campaign_data in representation['campaigns'] if campaign_data['result_table_name'] is not None
        ]

        representation['campaigns'] = filtered_campaigns
        return representation

class CampaignStatisticSerializer(serializers.ModelSerializer):
    campaign_statistics= serializers.SerializerMethodField()

    def get_campaign_statistics(self, obj):
        res=[]

        file_table_name= obj.collection.file_table_name
        result_table_name= obj.result_table_name
        start_date= obj.start_date
        end_date= obj.end_date

        conn_str = f"postgresql+psycopg2://{os.environ.get('DATABASE_USER')}:{os.environ.get('DATABASE_PASSWORD')}@{os.environ.get('DATABASE_HOST')}:{os.environ.get('DATABASE_PORT')}/{os.environ.get('DATABASE_NAME')}?options={os.environ.get('OPTIONS')}"
        engine = create_engine(conn_str)

        file_data_query = f'SELECT date,target FROM "{file_table_name}" WHERE date BETWEEN \'{start_date}\' AND \'{end_date}\''
        file_df = pd.read_sql_query(file_data_query, engine)
        file_dict = file_df.to_dict(orient='records')

        result_data_query = f'SELECT * FROM "{result_table_name}"'
        result_df = pd.read_sql_query(result_data_query, engine)
        result_df.index = result_df.index.astype(str)
        result_df.set_index('date', inplace=True)
        result_dict_temp = result_df.to_dict(orient='index')
        result_dict = {str(key): {str(k): v for k, v in value.items()} for key, value in result_dict_temp.items()}
        
        connection = engine.connect()

        cumulative_point_effects_upper= 0.0
        cumulative_point_effects_lower= 0.0

        cumulative_points= 0.0

        for i in file_dict:
            date= i['date']
            target= float(i['target'])
            r= result_dict[date]
            point_effects= float(r['point_effects'])
            blue_dashed_value= target-point_effects
            point_effects_upper= float(r['point_effects_upper'])
            point_effects_lower= float(r['point_effects_lower'])
            upper_a= target- point_effects_upper
            lower_a= target- point_effects_lower
            upper_b= point_effects_lower
            lower_b= point_effects_upper
            cumulative_points+=point_effects
            cumulative_point_effects_upper+=(point_effects_upper)**2
            cumulative_point_effects_lower+=(point_effects_lower)**2
            cumulatative_point_effects= cumulative_points
            cumulative_upper_error= cumulative_point_effects_upper**(0.5)
            cumulative_lower_error= cumulative_point_effects_lower**(0.5)
            upper_c= cumulative_upper_error
            lower_c= cumulative_lower_error

            res.append({
                "date": date,
                "target": target,
                "blue_dashed_value": blue_dashed_value,
                "point_effects": point_effects,
                "upper_a": upper_a,
                "lower_a": lower_a,
                "upper_b": upper_b,
                "lower_b": lower_b,
                "cumulatative_point_effects": cumulatative_point_effects,
                "upper_c": upper_c,
                "lower_c": lower_c
            })

        connection.close()

        return res
    

    class Meta:
        model= Campaign
        fields= '__all__'


class PlanSerializer(serializers.ModelSerializer):

    class Meta:
        model= Plan
        fields= '__all__'