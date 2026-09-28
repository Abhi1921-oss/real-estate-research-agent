import logging
import jwt
from fastapi import HTTPException, Security, Depends, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
from backend.config import settings
from backend.database import get_supabase_client, mock_users

logger = logging.getLogger("auth")
security = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security),
    x_mock_user_id: Optional[str] = Header(None, alias="X-Mock-User-Id")
) -> Dict[str, Any]:
    """
    Validates Supabase Auth JWT token and fetches user's plan tier and subscription status.
    Supports a mock fallback for local development if Supabase credentials are not set.
    """
    # 1. Dev/Mock fallback
    supabase = get_supabase_client()
    if not supabase:
        user_id = x_mock_user_id or "test-user-id"
        user = mock_users.get(user_id)
        if not user:
            user = {
                "id": user_id,
                "email": f"{user_id}@realtyintel.ai",
                "plan_tier": "free",
                "cities_subscribed": ["pune"],
                "reports_used_this_month": 0,
                "reset_date": "2026-10-27T00:00:00Z"
            }
            mock_users[user_id] = user
        return user

    # 2. Token extraction
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header Bearer token."
        )

    token = credentials.credentials

    # 3. Verify via Supabase Auth
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired Supabase Auth token."
            )
        auth_user = user_response.user
        user_id = str(auth_user.id)
        user_email = auth_user.email or ""
    except Exception as e:
        # Fallback to local JWT decode if JWT secret is configured
        if settings.supabase_jwt_secret:
            try:
                payload = jwt.decode(
                    token,
                    settings.supabase_jwt_secret,
                    algorithms=["HS256"],
                    audience="authenticated"
                )
                user_id = payload.get("sub")
                user_email = payload.get("email", "")
            except Exception as jwt_err:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Token verification failed: {str(jwt_err)}"
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Authentication error: {str(e)}"
            )

    # 4. Fetch subscription and usage profile from public.users table
    try:
        res = supabase.table("users").select("*").eq("id", user_id).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]

        # If user exists in Auth but not in public.users, auto-provision
        new_profile = {
            "id": user_id,
            "email": user_email,
            "plan_tier": "free",
            "cities_subscribed": ["pune"],
            "reports_used_this_month": 0
        }
        insert_res = supabase.table("users").insert(new_profile).execute()
        return insert_res.data[0] if insert_res.data else new_profile
    except Exception as e:
        logger.error(f"Error fetching user profile for {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving user subscription profile."
        )

def verify_city_access(city: str, user: Dict[str, Any]):
    """
    Enforces that a user has access to generate or view reports for the requested city.
    Agency tier has access to all cities. Free and Pro tiers must have the city in cities_subscribed.
    """
    city_lower = city.lower().strip()
    plan_tier = user.get("plan_tier", "free")
    cities_subscribed = [c.lower() for c in user.get("cities_subscribed", [])]

    if plan_tier == "agency":
        return True

    if city_lower not in cities_subscribed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": "CityNotSubscribed",
                "message": f"City '{city}' is not in your subscribed cities {cities_subscribed}. Upgrade your tier or update your subscribed cities.",
                "plan_tier": plan_tier,
                "current_cities": cities_subscribed
            }
        )
    return True

def verify_report_quota(user: Dict[str, Any]):
    """
    Verifies that the user has not exceeded their monthly report generation quota.
    Free: 4 reports/mo (weekly)
    Pro: 30 reports/mo (daily)
    Agency: Unlimited + Metered API
    """
    plan_tier = user.get("plan_tier", "free")
    used = user.get("reports_used_this_month", 0)
    limit = settings.plan_monthly_report_limits.get(plan_tier, 4)

    if used >= limit and plan_tier != "agency":
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "MonthlyQuotaExceeded",
                "message": f"Monthly limit reached ({used}/{limit} reports used). Please upgrade your plan tier to continue.",
                "reports_used": used,
                "plan_limit": limit,
                "plan_tier": plan_tier
            }
        )
    return True
