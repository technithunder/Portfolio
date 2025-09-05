from rest_framework.response import Response
import json
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from .models import *
from .serializers import *
from .models import Collection
from .tasks import create_collection
from django.core.files import File
from django.core.files.storage import FileSystemStorage
from common.pagination import CustomPagination 
from .paypal_payment import *
from .stripe_payment import *
from django.db.models import Q


class SignUpView(APIView):
    permission_classes= [AllowAny]
    def post(self, request, format=None):
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user= serializer.save()

        try:
            free_plan= Plan.objects.get(plan_name='Free Plan')
            free_credits= free_plan.credit
            user.available_credit= free_credits
        except:
            user.available_credit=1

        return Response({'msg': f"Congratulations {user.name}, you are successfully registered.",
                        "meta": {}, "data": {"user_id": user.user_id}, "status": 1}, 
                        status=status.HTTP_201_CREATED)
    
class LogInView(APIView):
    permission_classes= [AllowAny]

    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email= serializer.data.get('email')
        password= serializer.data.get('password')
        user = authenticate(request, email=email, password=password)
        
        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            available_credit= user.available_credit
            return Response({'msg': f"Login Success! Welcome {user.name}",
                            "meta": {}, "data": {"user_id": user.user_id,
                                                 "token": token.key,
                                                 'available_credits': available_credit}, "status": 1}, 
                            status=status.HTTP_200_OK)
        else:   
            return Response({'error': {
                            'msg': "Invalid Login Credentials",
                            "details": "",
                            }, "status": 0}, 
                            status=status.HTTP_404_NOT_FOUND)
        
class LogOutView(APIView):
    permission_classes= [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        request.auth.delete()
        logout(request)
        return Response({'msg': "User Logout Successfully.",
                            "meta": {}, "data": {}, "status": 1}, 
                            status=status.HTTP_200_OK)
    
class AboutUsView(APIView):
    permission_classes= [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            obj = AboutUs.objects.latest('created_on')
        except AboutUs.DoesNotExist:
            obj= None

        serializer= AboutUsSerializer(obj, context= {'request': request})

        return Response({'msg': "Success!!",
                            "meta": {}, "data": serializer.data, "status": 1}, 
                            status=status.HTTP_200_OK)
    
class CollectionView(APIView):
    permission_classes= [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user= request.user
        data= request.data
        file= self.request.FILES['file']

        serial= CreateCollectionSerializer(data= data, context={'request': request,
                                                          'user': user})
        
        if serial.is_valid(raise_exception=True):
            serial.save()
            collection_id= serial.data['collection_id']

            # Save the file temporary to the constructed path
            storage = FileSystemStorage()
            saved_file = storage.save(file.name, File(file))

            if saved_file:
                file_path = os.path.join(settings.MEDIA_ROOT, saved_file)

                create_collection.delay(collection_id=collection_id, path=file_path, file_name=file.name)

                return Response({'msg': "Collection stored successfully. Calculation is in progress.",
                                    "meta": {}, "data": {"collection_id": collection_id}, "status": 1}, 
                                    status=status.HTTP_201_CREATED)
            else:
                return Response({'error': {
                            'msg': "Something Went Wrong",
                            "details": "File not stored. Please try again.",
                            }, "status": 0}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, *args, **kwargs):
        user= request.user

        success_qs= Collection.objects.filter(user=user, campaigns__result_table_name__isnull=False).distinct()
        success_qs.update(status='succeed')

        in_progress_qs = Collection.objects.filter(
                        ~Q(campaigns__result_table_name__isnull=False) & Q(status='succeed')
                    ).distinct()
        in_progress_qs.update(status='in_progress')

        collection_qs= Collection.objects.filter(user=user).distinct().order_by('-created_on')
        paginator = CustomPagination()
        paginated_queryset= paginator.paginate_queryset(collection_qs, request, view=self)

        try:
            serial= CollectionListSerializer(paginated_queryset, context= {'request': request}, many=True)
            return paginator.get_paginated_response(serial.data)

        except Exception as e:
            return Response({'error': {
                            'msg': "Something Went Wrong",
                            "details": str(e),
                            }, "status": 0}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
class CollectionDetailsView(APIView):
    permission_classes= [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        collection_id = kwargs.get('collection_id', None)
        if not collection_id:
            raise Exception("Collection ID is required")

        try:
            collection_obj= Collection.objects.get(collection_id= collection_id)
        except:
            raise Exception("Collection ID is not valid")

        try:
            serial= CollectionDetailSerializer(collection_obj, context= {'request': request})

            return Response({'msg': "Success",
                                "meta": {}, "data": serial.data, "status": 1}, 
                                status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': {
                            'msg': "Something Went Wrong",
                            "details": str(e),
                            }, "status": 0}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
class CampaignStatisticsView(APIView):
    permission_classes= [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        campaign_id = kwargs.get('campaign_id', None)
        if not campaign_id:
            raise Exception("Campaign ID is required")

        try:
            campaign_obj= Campaign.objects.get(campaign_id= campaign_id)
        except:
            raise Exception("Campaign ID is not valid")

        try:
            serial= CampaignStatisticSerializer(campaign_obj, context= {'request': request})

            return Response({'msg': "Success",
                                "meta": {}, "data": serial.data, "status": 1}, 
                                status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': {
                            'msg': "Something Went Wrong",
                            "details": str(e),
                            }, "status": 0}, 
                            status=status.HTTP_400_BAD_REQUEST)


class PlanView(APIView):
    permission_classes= [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        plan_qs= Plan.objects.filter(is_selectable=True, is_active=True)

        try:
            serial= PlanSerializer(plan_qs, context= {'request': request}, many=True)

            return Response({'msg': "Success",
                                "meta": {}, "data": serial.data, "status": 1}, 
                                status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': {
                            'msg': "Something Went Wrong",
                            "details": str(e),
                            }, "status": 0}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
class CreateStripeSessionView(APIView):
    permission_classes= [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data= request.data
        plan_id= data['plan_id']
        user= request.user

        try:
            plan_obj= Plan.objects.get(plan_id=plan_id)

            plan_name= plan_obj.plan_name
            amount= plan_obj.amount

            user_plan= UserPlan.objects.create(
                    user= user, plan= plan_obj, payment_method= 'stripe'
                )
            user_plan_id= user_plan.user_plan_id

            stripe_session= create_stripe_session(user_plan_id, plan_id, plan_name, amount)
            checkout_url= stripe_session.url
            print(stripe_session.id)
                
            return Response({'msg': "Success",
                                    "meta": {}, "data": {'url': checkout_url}, 
                                    "status": 1}, 
                                    status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': {
                            'msg': "Something Went Wrong",
                            "details": str(e),
                            }, "status": 0}, 
                            status=status.HTTP_400_BAD_REQUEST)

class VerifyStripePaymentView(APIView):
    permission_classes= [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data= request.data
        user= request.user
        session_id= data['session_id']
        stripe_session= verify_stripe_payment(session_id)

        if stripe_session.payment_status=="paid":
            transaction_id= stripe_session.payment_intent
            user_plan_id= stripe_session.metadata.user_plan_id

            user_plan= UserPlan.objects.get(user_plan_id=user_plan_id)

            user_plan.transaction_id= transaction_id
            user_plan.is_paid=True
            user_plan.save()

            credit= user_plan.plan.credit
            user.available_credit= user.available_credit+credit
            user.save()
            
            return Response({'msg': "Success", "meta": {}, 
                                    "data": {'available_credit': user.available_credit}, 
                                    "status": 1}, 
                                    status=status.HTTP_200_OK)
        
        else:
            return Response({'error': {
                            'msg': "Something Went Wrong",
                            "details": "Payment Failed",
                            }, "status": 0}, 
                            status=status.HTTP_400_BAD_REQUEST)

            
class CreatePaypalSessionView(APIView):
    permission_classes= [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data= request.data
        plan_id= data['plan_id']
        user= request.user

        try:
            plan_obj= Plan.objects.get(plan_id=plan_id)

            plan_name= plan_obj.plan_name
            amount= plan_obj.amount

            user_plan= UserPlan.objects.create(
                    user= user, plan= plan_obj, payment_method= 'paypal'
                )
            user_plan_id= user_plan.user_plan_id

            paypal_session= create_paypal_session(user_plan_id, plan_id, plan_name, amount)
            checkout_url= paypal_session['links'][1]['href']

            return Response({'msg': "Success",
                                    "meta": {}, "data": {'url': checkout_url}, 
                                    "status": 1}, 
                                    status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': {
                            'msg': "Something Went Wrong",
                            "details": str(e),
                            }, "status": 0}, 
                            status=status.HTTP_400_BAD_REQUEST)


class VerifyPaypalPaymentView(APIView):
    permission_classes= [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data= request.data
        user= request.user
        order_id= data['order_id']
        paypal_order= verify_paypal_payment(order_id)

        if "status" in paypal_order and paypal_order["status"]=="APPROVED":
            user_plan_id= paypal_order["purchase_units"][0]["custom_id"]

            user_plan= UserPlan.objects.get(user_plan_id=user_plan_id)

            user_plan.transaction_id= order_id
            user_plan.is_paid=True
            user_plan.save()

            credit= user_plan.plan.credit
            user.available_credit= user.available_credit+credit
            user.save()
            
            return Response({'msg': "Success", "meta": {}, 
                                    "data": {'available_credit': user.available_credit}, 
                                    "status": 1}, 
                                    status=status.HTTP_200_OK)
        
        else:
            return Response({'error': {
                            'msg': "Something Went Wrong",
                            "details": "Payment Failed",
                            }, "status": 0}, 
                            status=status.HTTP_400_BAD_REQUEST)



