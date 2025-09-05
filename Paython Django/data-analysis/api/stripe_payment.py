import stripe
from django.conf import settings


stripe.api_key = settings.STRIPE_SECRET


def create_stripe_session(user_plan_id, plan_id, plan_name, amount):
    amount_in_cents= int(amount*100)
    checkout_session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                metadata={"user_plan_id": user_plan_id},
                line_items=[{
                        'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': plan_name,
                            'metadata':{
                            'plan_id': plan_id
                            }
                        },
                        'unit_amount': amount_in_cents,
                        },
                        'quantity': 1
                    }],
                mode="payment",
                success_url=settings.STRIPE_SUCCESS_URL,
                cancel_url=settings.STRIPE_CANCEL_URL,
            )
    
    return checkout_session


def verify_stripe_payment(session_id):
    checkout_session = stripe.checkout.Session.retrieve(session_id)
    
    return checkout_session