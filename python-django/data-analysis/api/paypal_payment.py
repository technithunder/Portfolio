import requests
import json
import base64
from django.conf import settings

client_ID = settings.PAYPAL_CLIENT_ID
client_Secret = settings.PAYPAL_SECRET
paypal_url= settings.PAYPAL_URL


def PaypalToken(client_ID, client_Secret):

    url = f"{paypal_url}/v1/oauth2/token"
    data = {
                "client_id":client_ID,
                "client_secret":client_Secret,
                "grant_type":"client_credentials"
            }
    headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic {0}".format(base64.b64encode((client_ID + ":" + client_Secret).encode()).decode())
            }

    token = requests.post(url, data, headers=headers)
    return token.json()['access_token']


def create_paypal_session(user_plan_id, plan_id, plan_name, amount):
    token = PaypalToken(client_ID, client_Secret)
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token,
    }
    
    json_data = {
            "intent": "CAPTURE",
            "application_context": {
                "return_url": settings.PAYPAL_RETURN_URL,
                "cancel_url": settings.PAYPAL_CANCEL_URL,
                "brand_name": "Horizon",
                "landing_page": "BILLING",
                "shipping_preference": "NO_SHIPPING",
                "user_action": "CONTINUE"
            },
            "purchase_units": [
                {
                    "plan_id": f"{plan_id}",
                    'custom_id': f"{user_plan_id}",
                    'plan_name': plan_name,
                    "amount": {
                        "currency_code": "USD",
                        "value": amount
                    },
                }
            ]
        }

    url= f'{paypal_url}/v2/checkout/orders'
    response = requests.post(url, headers=headers, json=json_data)

    return response.json()


def verify_paypal_payment(order_id):
    token = PaypalToken(client_ID, client_Secret)
    url= f"{paypal_url}/v2/checkout/orders/{order_id}"
    headers = {"Content-Type": "application/json", "Authorization": "Bearer "+token}
    response = requests.get(url, headers=headers)
    
    return response.json()