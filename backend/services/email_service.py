import logging
import httpx
from typing import Dict, Any, List
from backend.config import settings

logger = logging.getLogger("email_service")

async def send_digest_email(user_email: str, city_reports: List[Dict[str, Any]], user_tier: str = "pro") -> bool:
    """
    Sends a formatted email digest of today's subscribed city research to the user.
    Uses Resend API if RESEND_API_KEY is configured, or logs formatted email preview in dev mode.
    """
    if not user_email or not city_reports:
        return False

    cities_covered = ", ".join([r.get("city_name", r.get("city", "")).capitalize() for r in city_reports])
    subject = f"🏢 Your Morning Real Estate Briefing ({cities_covered}) — RealtyIntel"

    sections_html = ""
    for r in city_reports:
        city_title = r.get("city_name", r.get("city", "")).capitalize()
        content = r.get("content", "").replace("\n", "<br/>")
        sections_html += f"""
        <div style="margin-bottom: 24px; padding: 20px; border: 1px solid #1e293b; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 10px; margin-bottom: 16px;">
                <h2 style="color: #38bdf8; margin: 0; font-size: 18px;">📍 {city_title} Broker Intelligence</h2>
                <span style="background: #3b82f6; color: #fff; padding: 3px 8px; border-radius: 99px; font-size: 11px; font-weight: bold; text-transform: uppercase;">Verified</span>
            </div>
            <div style="font-size: 14px; line-height: 1.6; color: #cbd5e1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                {content}
            </div>
        </div>
        """

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>{subject}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #020617; padding: 24px; margin: 0;">
        <div style="max-width: 680px; margin: 0 auto; color: #f8fafc;">
            <div style="border-bottom: 2px solid #312e81; padding-bottom: 16px; margin-bottom: 24px;">
                <h1 style="color: #818cf8; margin: 0; font-size: 24px;">🏢 RealtyIntel Morning Dispatch</h1>
                <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">
                    Autonomous Multi-Agent Intelligence Briefing • Plan Tier: <strong style="color: #38bdf8; text-transform: uppercase;">{user_tier}</strong>
                </p>
            </div>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">
                Good morning! Here is your verified daily intelligence digest for your subscribed micro-markets, prepared before markets open:
            </p>
            {sections_html}
            <div style="margin-top: 32px; padding: 16px; background: rgba(30, 41, 59, 0.5); border-radius: 8px; border: 1px solid #1e293b; text-align: center;">
                <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                    Need more cities or instant direct API access? 
                    <a href="{settings.frontend_url}" style="color: #60a5fa; text-decoration: none; font-weight: bold;">Upgrade your subscription</a>
                </p>
            </div>
            <p style="color: #64748b; font-size: 11px; margin-top: 24px; text-align: center;">
                You are receiving this automated daily dispatch because you are an active subscriber to RealtyIntel SaaS.
            </p>
        </div>
    </body>
    </html>
    """

    if settings.resend_api_key:
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    "https://api.resend.com/emails",
                    headers={
                        "Authorization": f"Bearer {settings.resend_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "from": settings.from_email,
                        "to": [user_email],
                        "subject": subject,
                        "html": html_body
                    },
                    timeout=12.0
                )
                if res.status_code in (200, 201):
                    logger.info(f"Digest email sent via Resend to {user_email}")
                    return True
                else:
                    logger.error(f"Resend returned error: {res.text}")
                    return False
        except Exception as e:
            logger.error(f"Failed to dispatch email via Resend: {e}")
            return False
    else:
        logger.info(f"[Email Digest Preview] Prepared morning briefing for {user_email} covering [{cities_covered}]. (Resend API key not set, preview simulated successfully)")
        return True
