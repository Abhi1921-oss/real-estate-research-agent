import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # App Settings
    app_name: str = "Real Estate Research Agent SaaS"
    environment: str = os.getenv("ENVIRONMENT", "development")
    port: int = int(os.getenv("PORT", "8000"))
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:8080")

    # Supabase Configuration
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_anon_key: str = os.getenv("SUPABASE_ANON_KEY", "")
    supabase_service_role_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    supabase_jwt_secret: str = os.getenv("SUPABASE_JWT_SECRET", "")

    # Stripe Configuration
    stripe_secret_key: str = os.getenv("STRIPE_SECRET_KEY", "")
    stripe_publishable_key: str = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
    stripe_webhook_secret: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    stripe_pro_price_id: str = os.getenv("STRIPE_PRO_PRICE_ID", "price_pro_monthly")
    stripe_agency_price_id: str = os.getenv("STRIPE_AGENCY_PRICE_ID", "price_agency_monthly")
    stripe_metered_price_id: str = os.getenv("STRIPE_METERED_PRICE_ID", "price_metered_report")

    # Email Digest Configuration
    resend_api_key: str = os.getenv("RESEND_API_KEY", "")
    from_email: str = os.getenv("FROM_EMAIL", "digest@realtyintel.ai")

    # Plan Limits
    plan_city_limits: dict = {
        "free": 1,
        "pro": 3,
        "agency": 999
    }
    plan_monthly_report_limits: dict = {
        "free": 4,        # 1 report per week
        "pro": 30,       # 1 report per day
        "agency": 999999 # Unlimited
    }

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
