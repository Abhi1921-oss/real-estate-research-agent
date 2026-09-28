import sys
import os
import logging
from contextlib import asynccontextmanager
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

# Ensure project root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, Depends, Query, HTTPException, Request, Header, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.config import settings
from backend.auth import get_current_user, verify_city_access, verify_report_quota
from backend.services.city_configs import CITIES_REGISTRY
from backend.services.agent_runner import (
    get_or_generate_report,
    get_latest_cached_report,
    SUPPORTED_CITIES
)
from backend.services.stripe_service import (
    create_checkout_session,
    handle_webhook_event,
    TIER_PLANS
)
from backend.services.scheduler import start_scheduler, shutdown_scheduler, run_daily_morning_agent_prewarm
from backend.services.email_service import send_digest_email
from backend.database import get_supabase_client, mock_users, mock_reports

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s")
logger = logging.getLogger("main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up FastAPI Real Estate SaaS backend...")
    start_scheduler()
    yield
    logger.info("Shutting down FastAPI Real Estate SaaS backend...")
    shutdown_scheduler()

app = FastAPI(
    title="Real Estate Research Multi-Agent SaaS API",
    description="Multi-tenant SaaS API wrapping Pune, Lucknow, Mumbai, Bengaluru & Delhi-NCR intelligence with Supabase Auth, Postgres caching, White-label PDF branding, and Stripe billing.",
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request / Response Schemas
class UpdateCitiesRequest(BaseModel):
    cities: List[str]

class CheckoutRequest(BaseModel):
    plan_tier: str # 'pro' or 'agency'
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None

class BrandingRequest(BaseModel):
    agency_name: Optional[str] = ""
    agency_logo_url: Optional[str] = ""
    agency_phone: Optional[str] = ""
    agency_rera_id: Optional[str] = ""

# ==============================================================================
# 1. HEALTH & METADATA ENDPOINTS
# ==============================================================================

@app.get("/")
def root():
    return {
        "name": settings.app_name,
        "version": "2.0.0",
        "status": "online",
        "supported_cities": list(CITIES_REGISTRY.keys()),
        "plans": {
            "free": {"cities_allowed": 1, "refresh": "weekly", "price_inr": 0},
            "pro": {"cities_allowed": 3, "refresh": "daily", "price_inr": 999},
            "agency": {"cities_allowed": "unlimited", "refresh": "daily + metered API + white-label", "price_inr": 3999}
        }
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/cities")
def get_all_cities():
    """Returns complete list of supported Indian metropolitan real estate markets."""
    return {
        "cities": [
            {
                "id": k,
                "name": v["name"],
                "region_name": v["region_name"],
                "state": v["state"],
                "emoji": v["emoji"],
                "rera_authority": v["rera_authority"]
            }
            for k, v in CITIES_REGISTRY.items()
        ]
    }

# ==============================================================================
# 2. REPORT GENERATION & CACHING ENDPOINTS
# ==============================================================================

@app.post("/reports/generate")
async def generate_report(
    city: str = Query(..., description="Target city ID e.g. 'pune', 'lucknow', 'mumbai', 'bengaluru', 'delhi_ncr'"),
    force: bool = Query(False, description="Bypass cache and force agent re-run"),
    user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Triggers research for the specified city.
    - Caches report by city + date in Postgres to prevent redundant generation costs.
    - Gated by user's plan tier and subscribed cities.
    """
    city_key = city.lower().strip()
    if city_key not in CITIES_REGISTRY:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"City '{city}' not supported. Supported: {list(CITIES_REGISTRY.keys())}"
        )

    verify_city_access(city_key, user)
    verify_report_quota(user)

    try:
        report = get_or_generate_report(city=city_key, user=user, force_refresh=force)
        return report
    except Exception as e:
        logger.error(f"Error during report generation for {city}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Research generation failed: {str(e)}"
        )

@app.get("/reports/{city}/latest")
async def get_latest_report(
    city: str,
    user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Fetches the most recent cached report for a city without triggering a new agent run.
    """
    city_key = city.lower().strip()
    if city_key not in CITIES_REGISTRY:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"City '{city}' not supported. Supported: {list(CITIES_REGISTRY.keys())}"
        )

    verify_city_access(city_key, user)
    report = get_latest_cached_report(city_key)

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No cached report found for {city_key}. Trigger /reports/generate?city={city_key} to create one."
        )

    return {
        "status": "success",
        "city": city_key,
        "report": report
    }

# ==============================================================================
# 3. USER USAGE & WHITE-LABEL BRANDING ENDPOINTS
# ==============================================================================

@app.get("/user/usage")
async def get_user_usage(user: Dict[str, Any] = Depends(get_current_user)):
    """
    Returns user plan tier, quota usage, subscribed cities, and white-label branding.
    """
    plan_tier = user.get("plan_tier", "free")
    reports_used = user.get("reports_used_this_month", 0)
    city_limit = settings.plan_city_limits.get(plan_tier, 1)
    monthly_limit = settings.plan_monthly_report_limits.get(plan_tier, 4)

    return {
        "user_id": user.get("id"),
        "email": user.get("email"),
        "plan_tier": plan_tier,
        "cities_subscribed": user.get("cities_subscribed", []),
        "cities_allowed": city_limit if plan_tier != "agency" else "Unlimited",
        "reports_used_this_month": reports_used,
        "reports_limit": monthly_limit if plan_tier != "agency" else "Unlimited",
        "reset_date": user.get("reset_date"),
        "has_stripe_subscription": bool(user.get("stripe_subscription_id")),
        "branding": {
            "agency_name": user.get("agency_name", ""),
            "agency_logo_url": user.get("agency_logo_url", ""),
            "agency_phone": user.get("agency_phone", ""),
            "agency_rera_id": user.get("agency_rera_id", "")
        }
    }

@app.post("/user/cities")
async def update_subscribed_cities(
    req: UpdateCitiesRequest,
    user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Updates the list of cities the user is subscribed to, enforcing plan limits:
    - Free: max 1 city
    - Pro: max 3 cities
    - Agency: unlimited
    """
    plan_tier = user.get("plan_tier", "free")
    limit = settings.plan_city_limits.get(plan_tier, 1)
    cleaned_cities = list({c.lower().strip() for c in req.cities if c.lower().strip() in CITIES_REGISTRY})

    if len(cleaned_cities) > limit and plan_tier != "agency":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Plan '{plan_tier}' allows a maximum of {limit} city/cities. You selected {len(cleaned_cities)}. Please upgrade to select more."
        )

    supabase = get_supabase_client()
    if supabase:
        try:
            supabase.table("users").update({"cities_subscribed": cleaned_cities}).eq("id", user["id"]).execute()
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    else:
        if user["id"] in mock_users:
            mock_users[user["id"]]["cities_subscribed"] = cleaned_cities

    return {
        "status": "success",
        "cities_subscribed": cleaned_cities,
        "plan_tier": plan_tier
    }

@app.post("/user/branding")
async def update_white_label_branding(
    req: BrandingRequest,
    user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Saves broker white-label branding for PDF export and custom client pitches.
    """
    branding_data = {
        "agency_name": req.agency_name,
        "agency_logo_url": req.agency_logo_url,
        "agency_phone": req.agency_phone,
        "agency_rera_id": req.agency_rera_id
    }

    supabase = get_supabase_client()
    if supabase:
        try:
            supabase.table("users").update(branding_data).eq("id", user["id"]).execute()
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    else:
        if user["id"] in mock_users:
            mock_users[user["id"]].update(branding_data)

    return {
        "status": "success",
        "branding": branding_data
    }

@app.post("/user/test-digest")
async def send_user_test_digest(user: Dict[str, Any] = Depends(get_current_user)):
    """
    Dispatches an immediate test email digest of user's subscribed cities.
    """
    email = user.get("email")
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User email not found.")

    cities = user.get("cities_subscribed", ["pune"])
    reports = []
    today_str = os.getenv("OVERRIDE_DATE", "") or str(sys.modules['datetime'].date.today())

    supabase = get_supabase_client()
    for c in cities:
        c_key = c.lower().strip()
        rep = None
        if supabase:
            res = supabase.table("reports").select("*").eq("city", c_key).order("report_date", desc=True).limit(1).execute()
            if res.data:
                rep = res.data[0]
        else:
            matches = [r for k, r in mock_reports.items() if k.startswith(f"{c_key}:")]
            if matches:
                rep = matches[-1]

        if not rep and c_key in CITIES_REGISTRY:
            # Generate if not cached
            rep = get_or_generate_report(city=c_key, user=user)

        if rep:
            reports.append(rep)

    success = await send_digest_email(user_email=email, city_reports=reports, user_tier=user.get("plan_tier", "pro"))
    return {
        "status": "success" if success else "simulated",
        "email": email,
        "cities_covered": [r.get("city") for r in reports]
    }

# ==============================================================================
# 4. STRIPE BILLING ENDPOINTS
# ==============================================================================

@app.post("/billing/create-checkout-session")
async def checkout_session(
    req: CheckoutRequest,
    user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        session = create_checkout_session(
            user_id=user["id"],
            user_email=user.get("email", ""),
            target_tier=req.plan_tier,
            success_url=req.success_url,
            cancel_url=req.cancel_url
        )
        return session
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/billing/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None, alias="stripe-signature")):
    payload = await request.body()
    try:
        result = handle_webhook_event(payload, stripe_signature or "")
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# ==============================================================================
# 5. SCHEDULER MANUAL TRIGGER (ADMIN/CRON)
# ==============================================================================

@app.post("/cron/prewarm")
async def trigger_prewarm_job(admin_key: Optional[str] = Header(None, alias="X-Admin-Key")):
    await run_daily_morning_agent_prewarm()
    return {"status": "success", "message": "Morning pre-warm and email digest cron executed."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=settings.port, reload=True)
