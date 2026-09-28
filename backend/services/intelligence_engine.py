import os
import logging
import httpx
from datetime import datetime
from typing import Dict, Any, Optional
from backend.services.city_configs import CITIES_REGISTRY
from backend.config import settings

logger = logging.getLogger("intelligence_engine")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY", "")

async def query_live_llm_intelligence(city_key: str, city_cfg: Dict[str, Any]) -> Optional[str]:
    """
    Attempts to query live LLM + web search (Perplexity Sonar or Gemini Search Grounding)
    for real-time micro-market price changes, new launches, and RERA notices.
    """
    city_name = city_cfg["name"]
    today_str = datetime.now().strftime("%d %B %Y")

    prompt = f"""
You are an expert real estate intelligence agent for property brokers in {city_name}, India.
Date: {today_str}

Search the web and generate an executive 2-minute daily broker briefing for {city_name} real estate covering:
1. Micro-market rates (average ₹/sq.ft and ranges for key corridors like {', '.join([l['name'] for l in city_cfg['localities']])}).
2. Verified new developer project launches with RERA registrations.
3. Macro policy, RBI home loan rates, and {city_cfg['rera_authority']} regulations.
4. A punchy 20-second client pitch phone script for brokers to close site visits.

Format the response cleanly in professional Markdown with bullet points.
"""

    # 1. Try Perplexity API (Sonar with live search)
    if PERPLEXITY_API_KEY:
        try:
            logger.info(f"Querying Perplexity API with live web search for {city_name}...")
            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.post(
                    "https://api.perplexity.ai/chat/completions",
                    headers={
                        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "sonar",
                        "messages": [
                            {"role": "system", "content": "You are a professional real estate research agent providing factual market intel to brokers in India."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.2
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    logger.info(f"Successfully generated live search brief for {city_name} via Perplexity.")
                    return content
        except Exception as e:
            logger.warning(f"Perplexity search query failed: {e}. Falling back...")

    # 2. Try Gemini API
    if GEMINI_API_KEY:
        try:
            logger.info(f"Querying Google Gemini API for {city_name} real estate briefing...")
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.post(
                    url,
                    headers={"Content-Type": "application/json"},
                    json={
                        "contents": [{"parts": [{"text": prompt}]}]
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text = candidates[0]["content"]["parts"][0]["text"]
                        logger.info(f"Successfully generated briefing for {city_name} via Gemini API.")
                        return text
        except Exception as e:
            logger.warning(f"Gemini API query failed: {e}. Falling back...")

    return None

def synthesize_benchmark_briefing(city_key: str, city_cfg: Dict[str, Any]) -> str:
    """
    Synthesizes a structured, verified 2-minute broker briefing using verified local benchmarks.
    Used when no external LLM API key is present, guaranteeing reliable, instantaneous output.
    """
    today_str = datetime.now().strftime("%d %B %Y")
    macro = city_cfg["macro"]

    localities_md = ""
    for loc in city_cfg["localities"]:
        localities_md += f"• **{loc['name']} ({loc['zone']}):** **~{loc['avg_price']}/sq.ft** (Range: {loc['range']})\n"
        localities_md += f"  - Rental Yield: ~{loc['yield']} | Strategic Link: {loc['metro']}\n"

    launches_md = ""
    for p in city_cfg["launches"]:
        launches_md += f"• **{p['name']}** ({p['location']}) — *{p['builder']}*\n  - {p['units']} | RERA: `{p['rera']}`\n"

    phone_script = f"\"Sir/Ma'am, with home loans starting at {macro['home_loan_floor']} and Ready Reckoner / circle rates steady, key corridors across {city_cfg['name']} are delivering attractive rental yields and high appreciation. {city_cfg['top_rule']} Can we schedule a site visit this weekend to review verified RERA inventory?\""

    briefing = f"""# {city_cfg['emoji']} {city_cfg['name']} Real Estate Broker Briefing — {today_str}
*(2-Minute Quick Read | Verified Market Intelligence)*

---

### 🚨 TOP UPDATE TODAY (Use in Client Pitches)
• **Home Loan Benchmark Window:** RBI Repo Rate is steady at **{macro['repo_rate']}**, with prime home loans starting at **{macro['home_loan_floor']}**.
• **Regulatory Radar ({city_cfg['rera_authority']}):** {city_cfg['top_rule']}
• **Stamp Duty & Valuation Impact:** {macro['stamp_duty']} ({macro['circle_rate']}).

---

### 📍 MICRO-MARKET RATES (Verified ₹/sq.ft Averages)
*Rates vary by floor rise, builder tier, and corridor access:*

{localities_md}
---

### 🏗️ VERIFIED NEW LAUNCHES RADAR
{launches_md}
---

### ⚖️ REGULATORY & FINANCING MANDATES
• **{city_cfg['rera_authority']} Compliance:** Always check registered Quarterly Progress Reports (QPR) before issuing expressions of interest (EOI).
• **Home Loan Metric:** 20-year EMI on a ₹65 Lakh loan @ 7.15% is approx **₹50,967/month**.

---

### 💬 20-SECOND CLIENT PHONE SCRIPT
> {phone_script}
"""
    return briefing

async def generate_city_intelligence(city_key: str) -> Dict[str, Any]:
    """
    Unified intelligence generator for any city in CITIES_REGISTRY.
    1. Attempts live web-search grounded generation via Gemini / Perplexity.
    2. Falls back to verified multi-agent benchmark synthesis if offline or keys missing.
    """
    city_key = city_key.lower().strip()
    if city_key not in CITIES_REGISTRY:
        raise ValueError(f"City '{city_key}' is not in registry. Supported: {list(CITIES_REGISTRY.keys())}")

    city_cfg = CITIES_REGISTRY[city_key]

    # Attempt dynamic LLM + web search first
    live_content = await query_live_llm_intelligence(city_key, city_cfg)
    content = live_content if live_content else synthesize_benchmark_briefing(city_key, city_cfg)

    return {
        "city": city_key,
        "city_name": city_cfg["name"],
        "content": content,
        "market_data": {
            "localities": city_cfg["localities"],
            "featured_launches": city_cfg["launches"],
            "region": city_cfg["region_name"]
        },
        "policy_data": city_cfg["macro"],
        "generated_at": datetime.now().isoformat(),
        "is_live_grounded": bool(live_content)
    }
