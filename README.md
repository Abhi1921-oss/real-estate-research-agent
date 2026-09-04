# 🏢 Multi-City Real Estate Daily Research Multi-Agent System
### Autonomous Research Agent for Real Estate Brokers (Lucknow & Pune Markets)

An autonomous multi-agent real estate intelligence system designed specifically for real estate brokers, channel partners, and property consultants. It coordinates three parallel sub-agents to gather micro-market price movements, monitor RERA project launches, track RBI/state regulatory updates, and synthesize a crisp 2-minute actionable daily briefing.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-blue.svg)
![Frontend](https://img.shields.io/badge/frontend-Vanilla%20HTML%20%2F%20CSS%20%2F%20JS-emerald.svg)
![Markets](https://img.shields.io/badge/markets-Lucknow%20%7C%20Pune-amber.svg)

---

## 🚀 Key Features

- **⚡ Parallel Multi-Agent Architecture:**
  - **Sub-Agent 1 (Prices & Launches):** Concurrently gathers ₹/sq.ft price bands, rental yields, and verified RERA launches across prime corridors.
  - **Sub-Agent 2 (Policy & Banking):** Tracks RBI repo rates, bank home loan brackets, Ready Reckoner / Circle rates, and state RERA rules.
  - **Sub-Agent 3 (Synthesis Engine):** Compiles cross-verified findings into a clean 2-minute executive digest, phone pitch script, and pre-formatted WhatsApp broadcast.
- **🏛️ Multi-City Intelligence (Lucknow & Pune):**
  - **Lucknow:** Gomti Nagar, Shaheed Path, Sushant Golf City, Ayodhya Road; UP RERA compliance, 1% female stamp duty rebate, Kisan Path Outer Ring Road impact.
  - **Pune:** Kharadi, Hinjewadi, Wakad, Baner; MahaRERA 10% advance cap, Ready Reckoner rates, Metro Line 3 impact.
- **🖥️ Executive Web Dashboard:**
  - Dynamic Glassmorphic Dark UI with live market ticker.
  - Real-time visual progress bars & streaming agent terminal logs.
  - Micro-market pricing grid with high-contrast verification badges.
  - Interactive Buyer Loan EMI & Affordability Calculator.
  - 1-Click WhatsApp broadcast copy tool with emojis.
  - Clean 1-Page PDF / Print mode.
- **🐍 Standalone Python CLI:**
  - Concurrent execution using `concurrent.futures.ThreadPoolExecutor`.
  - Generates markdown digests and JSON archives in under 2 seconds.

---

## 📁 Repository Structure

```
├── index.html                 # Executive interactive web dashboard
├── style.css                  # Modern glassmorphism design system & print styles
├── agent.js                   # Client-side agent orchestrator & calculations
├── research_agent.py          # Parallel CLI agent for Pune real estate
├── lucknow_research_agent.py  # Parallel CLI agent for Lucknow real estate
├── daily_summary.md           # Pune daily broker briefing (markdown)
├── lucknow_daily_summary.md   # Lucknow daily broker briefing (markdown)
├── market_data.json           # Structured Pune market data
├── lucknow_market_data.json   # Structured Lucknow market data
└── .gitignore                 # Standard repository exclusions
```

---

## 🛠️ Quick Start

### 1. Run the Web Dashboard
You can serve the directory using Python's built-in HTTP server:

```bash
python -m http.server 8080
```
Open **[http://localhost:8080](http://localhost:8080)** in any browser.

### 2. Run the CLI Research Agents
Run the parallel multi-agent research directly from your terminal:

**For Lucknow:**
```bash
python lucknow_research_agent.py
```

**For Pune:**
```bash
python research_agent.py
```

Outputs will be saved automatically to `lucknow_daily_summary.md` and `lucknow_market_data.json`.

---

## 📊 Market Coverage & Data Sources

| City | Micro-Markets Covered | Key Developers Tracked | Regulatory Bodies |
| :--- | :--- | :--- | :--- |
| **Lucknow** | Gomti Nagar, Shaheed Path, Sushant Golf City, Ayodhya/Faizabad Rd | Shalimar Corp, Eldeco Group, Omaxe Ltd, Rishita Developers | UP RERA, LDA, IGRSUP |
| **Pune** | Kharadi, Hinjewadi, Wakad, Baner | Saheel, Kolte-Patil, Gera, Shapoorji Pallonji | MahaRERA, PMC, PCMC |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
