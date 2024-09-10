from django.urls import path
from .views import *

urlpatterns = [
    path('auth/signup/', SignUpView.as_view()),
    path('auth/login/', LogInView.as_view()),
    path('auth/logout/', LogOutView.as_view()),
    path('about-us/', AboutUsView.as_view()),
    path('create-collection/', CollectionView.as_view()),
    path('collection-list/', CollectionView.as_view()),
    path('plan-list/', PlanView.as_view()),
    path('collection-details/<str:collection_id>/', CollectionDetailsView.as_view()),
    path('campaign-statistics/<str:campaign_id>/', CampaignStatisticsView.as_view()),
    path('create-stripe-session/', CreateStripeSessionView.as_view()),
    path('verify-stripe-payment/', VerifyStripePaymentView.as_view()),
    path('create-paypal-session/', CreatePaypalSessionView.as_view()),
    path('verify-paypal-payment/', VerifyPaypalPaymentView.as_view()),
]