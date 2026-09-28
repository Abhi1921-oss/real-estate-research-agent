import logging
from datetime import date, datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from backend.database import get_supabase_client, mock_users, mock_reports
from backend.services.agent_runner import execute_agent_for_city, SUPPORTED_CITIES
from backend.services.email_service import send_digest_email

logger = logging.getLogger("scheduler")

scheduler = AsyncIOScheduler()

async def run_daily_morning_agent_prewarm():
    """
    Daily Cron Job (6:00 AM):
    1. Scans Postgres to find all cities with at least one active subscriber.
    2. Runs the multi-agent pipeline for each distinct city.
    3. Caches today's report in Postgres before users wake up and log in.
    4. Automatically emails morning digests to all active subscribers.
    """
    logger.info("=== [DAILY CRON 06:00 AM] Starting morning agent pre-warm job ===")
    today_str = date.today().isoformat()
    supabase = get_supabase_client()
    
    active_cities = set()
    user_list = []

    if supabase:
        try:
            # Query all subscribed cities from active users
            res = supabase.table("users").select("id, email, cities_subscribed, plan_tier").execute()
            if res.data:
                user_list = res.data
                for row in user_list:
                    cities = row.get("cities_subscribed") or []
                    for c in cities:
                        active_cities.add(c.lower().strip())
        except Exception as e:
            logger.error(f"[DAILY CRON] Failed to query subscribed cities: {e}")
    else:
        # Check mock users
        user_list = list(mock_users.values())
        for u in user_list:
            for c in u.get("cities_subscribed", []):
                active_cities.add(c.lower().strip())

    if not active_cities:
        active_cities = set(SUPPORTED_CITIES.keys())

    logger.info(f"[DAILY CRON] Active cities to pre-warm for {today_str}: {list(active_cities)}")

    # Step 1: Pre-warm all cities
    for city in active_cities:
        if city not in SUPPORTED_CITIES:
            logger.warning(f"[DAILY CRON] Skipping unsupported city: {city}")
            continue

        already_cached = False
        if supabase:
            try:
                check_res = (
                    supabase.table("reports")
                    .select("id")
                    .eq("city", city)
                    .eq("report_date", today_str)
                    .execute()
                )
                if check_res.data and len(check_res.data) > 0:
                    already_cached = True
            except Exception as e:
                logger.error(f"[DAILY CRON] Error checking cache for {city}: {e}")
        else:
            if f"{city}:{today_str}" in mock_reports:
                already_cached = True

        if already_cached:
            logger.info(f"[DAILY CRON] City '{city}' already cached for {today_str}. Skipping.")
            continue

        try:
            logger.info(f"[DAILY CRON] Running agent pipeline for '{city}'...")
            agent_output = execute_agent_for_city(city)
            report_data = {
                "city": city,
                "report_date": today_str,
                "content": agent_output["content"],
                "market_data": agent_output.get("market_data", {}),
                "policy_data": agent_output.get("policy_data", {}),
                "generated_at": datetime.now().isoformat()
            }

            if supabase:
                supabase.table("reports").upsert(report_data, on_conflict="city,report_date").execute()
            else:
                mock_reports[f"{city}:{today_str}"] = report_data

            logger.info(f"[DAILY CRON] Successfully pre-warmed and cached report for '{city}'.")
        except Exception as e:
            logger.error(f"[DAILY CRON] Failed to run agent for '{city}': {e}")

    # Step 2: Automated Morning Email Digest Delivery
    await dispatch_morning_email_digests(user_list, today_str)

    logger.info("=== [DAILY CRON 06:00 AM] Finished morning pre-warm and email digest dispatch ===")

async def dispatch_morning_email_digests(users: list, today_str: str):
    """Dispatches daily email digests to all subscribers for their selected cities."""
    logger.info(f"[EMAIL CRON] Dispatches starting for {len(users)} user(s)...")
    supabase = get_supabase_client()

    for u in users:
        email = u.get("email")
        tier = u.get("plan_tier", "free")
        cities = u.get("cities_subscribed", [])
        if not email or not cities:
            continue

        # Gather cached reports for user's subscribed cities
        user_reports = []
        for c in cities:
            c_key = c.lower().strip()
            if supabase:
                try:
                    r_res = supabase.table("reports").select("*").eq("city", c_key).eq("report_date", today_str).execute()
                    if r_res.data and len(r_res.data) > 0:
                        user_reports.append(r_res.data[0])
                except Exception as e:
                    logger.error(f"Error fetching report for email digest: {e}")
            else:
                mock_key = f"{c_key}:{today_str}"
                if mock_key in mock_reports:
                    user_reports.append(mock_reports[mock_key])

        if user_reports:
            logger.info(f"[EMAIL CRON] Sending digest to {email} covering {len(user_reports)} cities...")
            await send_digest_email(user_email=email, city_reports=user_reports, user_tier=tier)

def start_scheduler():
    """Initializes and starts the APScheduler background daemon."""
    trigger = CronTrigger(hour=6, minute=0)
    scheduler.add_job(
        run_daily_morning_agent_prewarm,
        trigger=trigger,
        id="morning_agent_prewarm",
        name="Morning Agent Report Pre-warm & Email Digest",
        replace_existing=True
    )
    scheduler.start()
    logger.info("APScheduler initialized: morning pre-warm and email dispatch scheduled for 06:00 AM daily.")

def shutdown_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        logger.info("APScheduler shut down.")
