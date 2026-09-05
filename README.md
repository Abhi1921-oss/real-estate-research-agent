# 🏙️ Multi-City Real Estate Daily Research Agent

An AI-powered multi-agent system that automatically researches and summarizes real estate market conditions across **Lucknow** and **Pune** — covering pricing trends, regulatory updates, and financing intelligence — and packages the findings into daily reports.

## 📌 Overview

This project runs a set of autonomous research agents that gather and synthesize real estate data for two Indian cities, producing:

- Daily market summaries in Markdown
- Structured JSON market data per city
- Polished, shareable PDF reports
- A browser-based dashboard for viewing results

It's designed to save the manual work of tracking property prices, regulations, and financing conditions across multiple city corridors by automating the research and reporting pipeline end-to-end.

## ✨ Features

- 🔍 **Multi-city coverage** — dedicated research agents for Lucknow and Pune real estate corridors
- 📊 **Structured data output** — market data captured as clean JSON (`market_data.json`, `lucknow_market_data.json`)
- 📝 **Daily summaries** — auto-generated Markdown reports (`daily_summary.md`, `lucknow_daily_summary.md`)
- 📄 **PDF report generation** — professional PDF exports via `create_project_pdf.py` and `generate_pdf_report.html`
- 🖥️ **Web dashboard** — `index.html` + `agent.js` provide a simple front-end to browse research output
- 🔁 **Cross-platform CLI agents** — Python agents built with relative paths for portability across operating systems

## 🗂️ Project Structure

```
real-estate-research-agent/
├── index.html                       # Web dashboard
├── agent.js                         # Dashboard logic
├── lucknow_research_agent.py        # CLI research agent — Lucknow
├── research_agent.py                # CLI research agent — general/Pune
├── create_project_pdf.py            # Generates project spec PDF (ReportLab)
├── generate_pdf_report.html         # HTML template for PDF reports
├── market_data.json                 # Structured market data
├── lucknow_market_data.json         # Lucknow-specific market data
├── daily_summary.md                 # Auto-generated daily summary
├── lucknow_daily_summary.md         # Lucknow-specific daily summary
├── requirements.txt                 # Python dependencies
└── Real_Estate_Research_Agent_Project_Details.pdf  # Full project spec
```

## 🚀 Getting Started

### Prerequisites
- Python 3.x
- pip

### Installation

```bash
git clone https://github.com/Abhi1921-oss/real-estate-research-agent.git
cd real-estate-research-agent
pip install -r requirements.txt
```

### Running the research agents

```bash
python lucknow_research_agent.py
python research_agent.py
```

### Viewing the dashboard

Open `index.html` in your browser to view the latest research output.

### Generating a PDF report

```bash
python create_project_pdf.py
```

## 🛣️ Roadmap

- [ ] Expand coverage to additional cities
- [ ] Automate daily runs via a scheduler (cron / GitHub Actions)
- [ ] Add historical price trend tracking
- [ ] Improve dashboard with charts and filters

## 🤝 Contributing

This is currently a solo project under active development. Suggestions and feedback are welcome via Issues.

## 📄 License

No license has been added yet — all rights reserved by default. Add a `LICENSE` file if you'd like to open this up for reuse.

## 👤 Author

**Abhishek Mishra**
- GitHub: [@Abhi1921-oss](https://github.com/Abhi1921-oss)
