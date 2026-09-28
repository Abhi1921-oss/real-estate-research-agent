import logging
import asyncio
from datetime import date, datetime
from typing import Dict, Any, Optional
from backend.database import get_supabase_client, mock_reports, mock_users, mock_usage_events
from backend.services.city_configs import CITIES_REGISTRY
from backend.services.intelligence_engine import generate_city_intelligence
import research_agent
import lucknow_research_agent

logger = logging.getLogger("agent_runner")

SUPPORTED_CITIES = {k: {"name": v["name"]} for k, v in CITIES_REGISTRY.items()}

def execute_agent_for_city(city: str) -> Dict[str, Any]:
    """
    Directly invokes research pipeline for the given city:
    - Pune & Lucknow use dedicated 3-sub-agent CLI workers (or dynamic LLM if enabled)
    - Mumbai, Bengaluru, and Delhi-NCR use universal intelligence generator
    """
    city_key = city.lower().strip()
    if city_key not in CITIES_REGISTRY:
        raise ValueError(f"City '{city}' is not supported. Supported cities: {list(CITIES_REGISTRY.keys())}")

    city_cfg = CITIES_REGISTRY[city_key]
    logger.info(f"Triggering research execution for {city_cfg['name']}...")

    if city_key == "pune":
        res = research_agent.run_pune_research(save_to_disk=True)
        return res
    elif city_key == "lucknow":
        res = lucknow_research_agent.run_lucknow_research(save_to_disk=True)
        return res
    else:
        # Run universal intelligence engine
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # If inside another async loop
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as pool:
                    future = pool.submit(asyncio.run, generate_city_intelligence(city_key))
                    return future.result()
            else:
                return asyncio.run(generate_city_intelligence(city_key))
        except Exception:
            return asyncio.run(generate_city_intelligence(city_key))

def get_latest_cached_report(city: str) -> Optional[Dict[str, Any]]:
    """Fetches the most recent cached report from Postgres/Supabase for a city."""
    city_key = city.lower().strip()
    supabase = get_supabase_client()

    if not supabase:
        # Check mock storage
        matches = [r for k, r in mock_reports.items() if k.startswith(f"{city_key}:")]
        if matches:
            matches.sort(key=lambda x: x.get("report_date", ""), reverse=True)
            return matches[0]
        return None

    try:
        res = (
            supabase.table("reports")
            .select("*")
            .eq("city", city_key)
            .order("report_date", desc=True)
            .limit(1)
            .execute()
        )
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None
    except Exception as e:
        logger.error(f"Error fetching latest cached report for {city_key}: {e}")
        return None

def get_or_generate_report(city: str, user: Dict[str, Any], force_refresh: bool = False) -> Dict[str, Any]:
    """
    Checks if a report for (city, today) already exists in Postgres.
    - If it exists and force_refresh is False: Returns cached copy (prevents duplicate agent runs).
    - If it does not exist: Triggers the multi-agent system, caches output, logs usage, and returns.
    """
    city_key = city.lower().strip()
    if city_key not in CITIES_REGISTRY:
        raise ValueError(f"City '{city}' is not supported. Supported: {list(CITIES_REGISTRY.keys())}")

    today_str = date.today().isoformat()
    cache_key = f"{city_key}:{today_str}"
    supabase = get_supabase_client()

    # 1. Check for cached report today
    if not force_refresh:
        if supabase:
            try:
                res = (
                    supabase.table("reports")
                    .select("*")
                    .eq("city", city_key)
                    .eq("report_date", today_str)
                    .execute()
                )
                if res.data and len(res.data) > 0:
                    cached_report = res.data[0]
                    _record_usage_event(user["id"], "report_viewed", city_key, {"cached": True})
                    return {
                        "status": "success",
                        "source": "cache",
                        "city": city_key,
                        "report_date": today_str,
                        "content": cached_report["content"],
                        "market_data": cached_report.get("market_data", {}),
                        "policy_data": cached_report.get("policy_data", {}),
                        "generated_at": cached_report["generated_at"]
                    }
            except Exception as e:
                logger.error(f"Cache check failed: {e}")
        else:
            if cache_key in mock_reports:
                cached_report = mock_reports[cache_key]
                _record_usage_event(user["id"], "report_viewed", city_key, {"cached": True})
                return {
                    "status": "success",
                    "source": "cache",
                    "city": city_key,
                    "report_date": today_str,
                    "content": cached_report["content"],
                    "market_data": cached_report.get("market_data", {}),
                    "policy_data": cached_report.get("policy_data", {}),
                    "generated_at": cached_report["generated_at"]
                }

    # 2. Run agent execution
    logger.info(f"Running intelligence pipeline for {city_key}...")
    agent_output = execute_agent_for_city(city_key)

    report_record = {
        "city": city_key,
        "report_date": today_str,
        "content": agent_output["content"],
        "market_data": agent_output.get("market_data", {}),
        "policy_data": agent_output.get("policy_data", {}),
        "generated_at": datetime.now().isoformat()
    }

    # 3. Cache into Postgres
    if supabase:
        try:
            supabase.table("reports").upsert(report_record, on_conflict="city,report_date").execute()
        except Exception as e:
            logger.error(f"Failed to upsert report into Supabase: {e}")
    else:
        mock_reports[cache_key] = report_record

    # 4. Increment user usage & log event
    _increment_user_usage(user["id"])
    _record_usage_event(user["id"], "report_generated", city_key, {
        "cached": False,
        "elapsed_seconds": agent_output.get("elapsed_seconds")
    })

    # 5. Check if user is Agency tier for metered usage reporting
    if user.get("plan_tier") == "agency" and user.get("stripe_customer_id"):
        from backend.services.stripe_service import report_metered_usage
        report_metered_usage(user["id"], quantity=1)

    return {
        "status": "success",
        "source": "generated",
        "city": city_key,
        "report_date": today_str,
        "content": report_record["content"],
        "market_data": report_record["market_data"],
        "policy_data": report_record["policy_data"],
        "generated_at": report_record["generated_at"]
    }

def _increment_user_usage(user_id: str):
    supabase = get_supabase_client()
    if supabase:
        try:
            res = supabase.table("users").select("reports_used_this_month").eq("id", user_id).execute()
            if res.data and len(res.data) > 0:
                current_used = res.data[0].get("reports_used_this_month", 0)
                supabase.table("users").update({"reports_used_this_month": current_used + 1}).eq("id", user_id).execute()
        except Exception as e:
            logger.error(f"Failed to increment usage for user {user_id}: {e}")
    else:
        if user_id in mock_users:
            mock_users[user_id]["reports_used_this_month"] += 1

def _record_usage_event(user_id: str, event_type: str, city: str, metadata: dict):
    event = {
        "user_id": user_id,
        "event_type": event_type,
        "city": city,
        "metadata": metadata,
        "timestamp": datetime.now().isoformat()
    }
    supabase = get_supabase_client()
    if supabase:
        try:
            supabase.table("usage_events").insert(event).execute()
        except Exception as e:
            logger.error(f"Failed to log usage event: {e}")
    else:
        mock_usage_events.append(event)
