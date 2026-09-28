import logging
from typing import Optional, Dict, Any, List
from backend.config import settings

logger = logging.getLogger("database")

_supabase_client = None

def get_supabase_client():
    """
    Returns the Supabase admin client initialized with the SERVICE_ROLE_KEY
    to bypass RLS for internal pipeline caching, user tier updates, and cron tasks.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if not settings.supabase_url or not settings.supabase_service_role_key:
        logger.warning(
            "Supabase credentials not configured in environment. Operating with Mock DB fallback."
        )
        return None

    try:
        from supabase import create_client, Client
        _supabase_client = create_client(
            settings.supabase_url,
            settings.supabase_service_role_key
        )
        return _supabase_client
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        return None

# In-memory mock storage for local testing when Supabase keys are not provided yet
mock_reports: Dict[str, Dict[str, Any]] = {}
mock_users: Dict[str, Dict[str, Any]] = {
    "test-user-id": {
        "id": "test-user-id",
        "email": "demo@realtyintel.ai",
        "plan_tier": "pro",
        "cities_subscribed": ["pune", "lucknow"],
        "reports_used_this_month": 4,
        "reset_date": "2026-10-27T00:00:00Z",
        "stripe_customer_id": None,
        "stripe_subscription_id": None
    }
}
mock_usage_events: List[Dict[str, Any]] = []
