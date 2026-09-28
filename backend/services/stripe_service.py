import logging
import stripe
from typing import Dict, Any, Optional
from backend.config import settings
from backend.database import get_supabase_client, mock_users

logger = logging.getLogger("stripe_service")

# Initialize Stripe API key
if settings.stripe_secret_key:
    stripe.api_key = settings.stripe_secret_key

# Tier Pricing Configuration
TIER_PLANS = {
    "pro": {
        "name": "Pro Tier",
        "price_inr": 999,
        "price_id": settings.stripe_pro_price_id,
        "cities_limit": 3,
        "frequency": "daily"
    },
    "agency": {
        "name": "Agency Tier",
        "price_inr": 3999,
        "price_id": settings.stripe_agency_price_id,
        "cities_limit": 999,
        "frequency": "unlimited_metered"
    }
}

def create_checkout_session(
    user_id: str,
    user_email: str,
    target_tier: str,
    success_url: Optional[str] = None,
    cancel_url: Optional[str] = None
) -> Dict[str, Any]:
    """
    Creates a Stripe Checkout Session for upgrading to Pro (₹999/mo) or Agency (₹3999/mo).
    If Stripe is in mock mode (no key), returns a simulated session for frontend testing.
    """
    target_tier = target_tier.lower().strip()
    if target_tier not in TIER_PLANS:
        raise ValueError(f"Invalid tier '{target_tier}'. Choose 'pro' or 'agency'.")

    plan_info = TIER_PLANS[target_tier]
    base_url = settings.frontend_url.rstrip('/')
    s_url = success_url or f"{base_url}/?session_id={{CHECKOUT_SESSION_ID}}&status=success"
    c_url = cancel_url or f"{base_url}/?status=cancelled"

    if not settings.stripe_secret_key:
        logger.warning("STRIPE_SECRET_KEY not set. Returning mock checkout URL.")
        # Return mock checkout for local dev
        return {
            "session_id": f"mock_session_{user_id}_{target_tier}",
            "checkout_url": f"{base_url}/?mock_checkout=true&tier={target_tier}&user_id={user_id}",
            "mock": True
        }

    try:
        # Check if user already has a Stripe customer ID
        supabase = get_supabase_client()
        customer_id = None
        if supabase:
            u_res = supabase.table("users").select("stripe_customer_id").eq("id", user_id).execute()
            if u_res.data and u_res.data[0].get("stripe_customer_id"):
                customer_id = u_res.data[0]["stripe_customer_id"]

        session_params: Dict[str, Any] = {
            "payment_method_types": ["card"],
            "mode": "subscription",
            "line_items": [
                {
                    "price": plan_info["price_id"],
                    "quantity": 1,
                }
            ],
            "client_reference_id": user_id,
            "metadata": {
                "user_id": user_id,
                "plan_tier": target_tier
            },
            "success_url": s_url,
            "cancel_url": c_url,
        }

        if customer_id:
            session_params["customer"] = customer_id
        else:
            session_params["customer_email"] = user_email

        session = stripe.checkout.Session.create(**session_params)
        return {
            "session_id": session.id,
            "checkout_url": session.url,
            "mock": False
        }
    except Exception as e:
        logger.error(f"Stripe checkout session creation failed: {e}")
        raise e

def handle_webhook_event(payload: bytes, sig_header: str) -> Dict[str, Any]:
    """
    Processes Stripe Webhooks:
    - checkout.session.completed: Syncs new plan tier and records customer/subscription IDs
    - customer.subscription.updated: Syncs updated tier
    - customer.subscription.deleted: Downgrades user to 'free' and prunes excess cities
    """
    if not settings.stripe_secret_key or not settings.stripe_webhook_secret:
        logger.warning("Stripe webhook secrets not configured.")
        return {"status": "ignored", "reason": "stripe_not_configured"}

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret
        )
    except ValueError as e:
        raise ValueError("Invalid webhook payload") from e
    except stripe.error.SignatureVerificationError as e:
        raise ValueError("Invalid Stripe signature") from e

    event_type = event["type"]
    data_object = event["data"]["object"]
    logger.info(f"Received Stripe webhook event: {event_type}")

    if event_type == "checkout.session.completed":
        _on_checkout_completed(data_object)
    elif event_type in ("customer.subscription.updated", "customer.subscription.created"):
        _on_subscription_updated(data_object)
    elif event_type == "customer.subscription.deleted":
        _on_subscription_cancelled(data_object)

    return {"status": "processed", "event": event_type}

def _on_checkout_completed(session: Dict[str, Any]):
    user_id = session.get("client_reference_id") or session.get("metadata", {}).get("user_id")
    target_tier = session.get("metadata", {}).get("plan_tier", "pro")
    customer_id = session.get("customer")
    subscription_id = session.get("subscription")

    if not user_id:
        logger.error("Checkout completed without user_id in session metadata.")
        return

    logger.info(f"Upgrading user {user_id} to tier {target_tier} (Sub: {subscription_id})")
    _update_user_subscription(
        user_id=user_id,
        plan_tier=target_tier,
        stripe_customer_id=customer_id,
        stripe_subscription_id=subscription_id
    )

def _on_subscription_updated(subscription: Dict[str, Any]):
    subscription_id = subscription.get("id")
    customer_id = subscription.get("customer")
    status = subscription.get("status")

    if status not in ("active", "trialing"):
        return

    # Identify tier by price_id
    items = subscription.get("items", {}).get("data", [])
    matched_tier = "free"
    if items:
        price_id = items[0].get("price", {}).get("id")
        if price_id == settings.stripe_agency_price_id:
            matched_tier = "agency"
        elif price_id == settings.stripe_pro_price_id:
            matched_tier = "pro"

    supabase = get_supabase_client()
    if supabase and customer_id:
        supabase.table("users").update({
            "plan_tier": matched_tier,
            "stripe_subscription_id": subscription_id
        }).eq("stripe_customer_id", customer_id).execute()

def _on_subscription_cancelled(subscription: Dict[str, Any]):
    customer_id = subscription.get("customer")
    logger.info(f"Subscription cancelled for customer {customer_id}. Downgrading to free tier.")
    supabase = get_supabase_client()
    if supabase and customer_id:
        # Fetch user
        u_res = supabase.table("users").select("id, cities_subscribed").eq("stripe_customer_id", customer_id).execute()
        if u_res.data:
            user = u_res.data[0]
            # Prune cities down to 1 for free tier
            current_cities = user.get("cities_subscribed") or ["pune"]
            pruned_cities = current_cities[:1] if current_cities else ["pune"]
            supabase.table("users").update({
                "plan_tier": "free",
                "cities_subscribed": pruned_cities,
                "stripe_subscription_id": None
            }).eq("stripe_customer_id", customer_id).execute()

def _update_user_subscription(
    user_id: str,
    plan_tier: str,
    stripe_customer_id: Optional[str] = None,
    stripe_subscription_id: Optional[str] = None
):
    supabase = get_supabase_client()
    update_data: Dict[str, Any] = {"plan_tier": plan_tier}
    if stripe_customer_id:
        update_data["stripe_customer_id"] = stripe_customer_id
    if stripe_subscription_id:
        update_data["stripe_subscription_id"] = stripe_subscription_id

    if supabase:
        try:
            supabase.table("users").update(update_data).eq("id", user_id).execute()
        except Exception as e:
            logger.error(f"Failed to update user subscription in Supabase: {e}")
    else:
        if user_id in mock_users:
            mock_users[user_id].update(update_data)

def report_metered_usage(user_id: str, quantity: int = 1):
    """
    Reports metered API/report usage to Stripe for Agency tier customers.
    """
    if not settings.stripe_secret_key or not settings.stripe_metered_price_id:
        logger.info(f"[Mock] Reported {quantity} metered usage units for user {user_id}")
        return

    supabase = get_supabase_client()
    if not supabase:
        return

    try:
        res = supabase.table("users").select("stripe_subscription_id").eq("id", user_id).execute()
        if not res.data or not res.data[0].get("stripe_subscription_id"):
            return

        sub_id = res.data[0]["stripe_subscription_id"]
        sub = stripe.Subscription.retrieve(sub_id)
        # Find metered subscription item
        metered_item = None
        for item in sub.get("items", {}).get("data", []):
            if item.get("price", {}).get("id") == settings.stripe_metered_price_id:
                metered_item = item.get("id")
                break

        if metered_item:
            stripe.SubscriptionItem.create_usage_record(
                metered_item,
                quantity=quantity,
                timestamp="now",
                action="increment"
            )
            logger.info(f"Reported {quantity} metered usage to Stripe for user {user_id}")
    except Exception as e:
        logger.error(f"Failed to report metered usage to Stripe: {e}")
