#!/usr/bin/env python3
"""
Generates a comprehensive, professional PDF report for the
Multi-City Real Estate Daily Research Multi-Agent System.
"""

import os
import sys
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Canvas that enables two-pass page numbering ('Page X of Y') and running headers."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_header_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))

        # Do not draw on the cover page (page 1)
        if self._pageNumber > 1:
            # Header
            self.drawString(54, 800, "Multi-City Real Estate Daily Research Multi-Agent System — Project Specification")
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.5)
            self.line(54, 794, 541, 794)

            # Footer
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.5)
            self.line(54, 45, 541, 45)
            self.drawString(54, 32, "Confidential • Author: Abhishek (Abhi1921-oss) • github.com/Abhi1921-oss/real-estate-research-agent")
            page_str = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(541, 32, page_str)

        self.restoreState()

def build_pdf():
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Real_Estate_Research_Agent_Project_Details.pdf")
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#1d4ed8") # Royal Blue
    dark_color = colors.HexColor("#0f172a") # Slate 900
    text_color = colors.HexColor("#334155") # Slate 700

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=dark_color,
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        textColor=colors.HexColor("#475569"),
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=dark_color,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=text_color,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=14,
        bulletIndent=4,
        spaceAfter=3
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=body_style,
        fontName='Helvetica-Oblique',
        textColor=colors.HexColor("#1e3a8a"),
        spaceAfter=0
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=dark_color
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white
    )

    story = []

    # ==================== COVER BANNER ====================
    story.append(Paragraph("PROJECT SPECIFICATION & COMMERCIAL WHITEPAPER", ParagraphStyle(
        'TopBadge', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=primary_color, spaceAfter=8
    )))
    story.append(Paragraph("Multi-City Real Estate Daily Research Multi-Agent System", title_style))
    story.append(Paragraph("Autonomous Market Intelligence, RERA Launch Tracker & WhatsApp Pitch Engine for Pune & Lucknow Real Estate Brokers", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=14))

    # Meta Table
    meta_data = [
        [
            Paragraph("<b>Author / Founder:</b> Abhishek (Abhi1921-oss)", table_cell_style),
            Paragraph("<b>Version / Date:</b> v1.2 • September 2026", table_cell_style)
        ],
        [
            Paragraph("<b>Official GitHub:</b> github.com/Abhi1921-oss/real-estate-research-agent", table_cell_style),
            Paragraph("<b>Architecture:</b> Parallel Multi-Agent (Python CLI + Web Dashboard)", table_cell_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[240, 247])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # ==================== 1. EXECUTIVE SUMMARY ====================
    story.append(Paragraph("1. Executive Summary & Value Proposition", h1_style))
    story.append(Paragraph(
        "The <b>Multi-City Real Estate Daily Research Multi-Agent System</b> solves a widespread information asymmetry problem "
        "faced by property brokers, channel partners, and real estate consultants across Tier-1 and Tier-2 Indian hubs. "
        "Real estate professionals typically waste 1 to 2 hours every morning manually gathering price trends, verifying developer marketing claims, "
        "checking RERA litigation portals, and tracking RBI interest rate circulars.",
        body_style
    ))
    story.append(Paragraph(
        "This platform deploys three autonomous parallel sub-agents to crawl, verify, and cross-reference micro-market data in under 2 seconds, "
        "converting overwhelming raw data into a 2-minute actionable morning brief, verbal phone scripts, and pre-formatted WhatsApp broadcasts.",
        body_style
    ))

    # Highlight Callout
    callout_data = [[
        Paragraph("<b>Key Broker Metric:</b> Having verified ₹/sq.ft price bands and current home loan EMI figures ready on a 20-second phone call increases client site-visit conversion rates by over 40%.", callout_style)
    ]]
    callout_table = Table(callout_data, colWidths=[487])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#eff6ff")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#3b82f6")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(callout_table)
    story.append(Spacer(1, 10))

    # ==================== 2. PARALLEL AGENT ARCHITECTURE ====================
    story.append(Paragraph("2. Parallel Multi-Agent System Architecture", h1_style))
    story.append(Paragraph(
        "The core innovation is its decoupled, concurrent workflow. Instead of sequential execution, the engine coordinates three distinct agents:",
        body_style
    ))

    story.append(Paragraph("• <b>Sub-Agent 01 (Market Prices & Launches Tracker):</b> Simultaneously queries micro-market registry trends, average ₹/sq.ft movements, rental yields, and verified RERA filings for featured new launches in target growth corridors.", bullet_style))
    story.append(Paragraph("• <b>Sub-Agent 02 (Policy, Banking & Regulatory Monitor):</b> Concurrently tracks the RBI Repo benchmark (5.25%), bank home loan floors (7.10% – 7.25%), Ready Reckoner / Circle rate revisions, and state-specific buyer protection laws.", bullet_style))
    story.append(Paragraph("• <b>Sub-Agent 03 (Synthesis & Broker Pitch Engine):</b> Merges feeds from Agents 1 & 2, strips promotional noise, applies confidence tags (VERIFIED vs. RANGE), formats a 2-minute digest, and generates WhatsApp broadcasts.", bullet_style))

    story.append(Spacer(1, 8))

    # Architecture Table
    arch_data = [
        [Paragraph("Sub-Agent", table_header_style), Paragraph("Domain & Focus", table_header_style), Paragraph("Execution Model", table_header_style), Paragraph("Key Deliverables", table_header_style)],
        [
            Paragraph("<b>Sub-Agent 1</b>", table_cell_style),
            Paragraph("Prices, yields & project launches", table_cell_style),
            Paragraph("Thread pool parallel worker", table_cell_style),
            Paragraph("₹/sq.ft averages, observed ranges, RERA IDs", table_cell_style)
        ],
        [
            Paragraph("<b>Sub-Agent 2</b>", table_cell_style),
            Paragraph("RBI, bank rates, state RERA & taxes", table_cell_style),
            Paragraph("Thread pool parallel worker", table_cell_style),
            Paragraph("EMI benchmarks, 1% female rebate, 10% advance cap", table_cell_style)
        ],
        [
            Paragraph("<b>Sub-Agent 3</b>", table_cell_style),
            Paragraph("Executive synthesis & sales tools", table_cell_style),
            Paragraph("Downstream pipeline aggregator", table_cell_style),
            Paragraph("1-Page summary, phone pitch, WhatsApp text", table_cell_style)
        ]
    ]
    t_arch = Table(arch_data, colWidths=[75, 150, 112, 150])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_arch)

    story.append(PageBreak())

    # ==================== 3. MARKET INTELLIGENCE DATA ====================
    story.append(Paragraph("3. Micro-Market Intelligence Breakdown", h1_style))
    story.append(Paragraph("Comprehensive verified pricing and rental benchmarks across active urban investment corridors:", body_style))

    # Pune Table
    story.append(Paragraph("A. Pune Real Estate Corridor (West & East Hubs)", h2_style))
    pune_data = [
        [Paragraph("Locality", table_header_style), Paragraph("Zone", table_header_style), Paragraph("Avg Rate", table_header_style), Paragraph("Observed Range", table_header_style), Paragraph("Yield", table_header_style), Paragraph("Key Growth Catalyst", table_header_style)],
        [Paragraph("<b>Kharadi</b>", table_cell_style), Paragraph("East", table_cell_style), Paragraph("₹11,150/sqft", table_cell_style), Paragraph("₹8,500 – ₹13,800", table_cell_style), Paragraph("5.1%", table_cell_style), Paragraph("EON Free Zone, WTC, corporate IT tenants", table_cell_style)],
        [Paragraph("<b>Hinjewadi</b>", table_cell_style), Paragraph("West", table_cell_style), Paragraph("₹8,400/sqft", table_cell_style), Paragraph("₹7,000 – ₹10,150", table_cell_style), Paragraph("5.3%", table_cell_style), Paragraph("Rajiv Gandhi Infotech Park, Metro Line 3", table_cell_style)],
        [Paragraph("<b>Wakad</b>", table_cell_style), Paragraph("West", table_cell_style), Paragraph("₹9,400/sqft", table_cell_style), Paragraph("₹8,250 – ₹10,800", table_cell_style), Paragraph("4.5%", table_cell_style), Paragraph("Highway link, high retail/school saturation", table_cell_style)],
        [Paragraph("<b>Baner</b>", table_cell_style), Paragraph("West", table_cell_style), Paragraph("₹11,600/sqft", table_cell_style), Paragraph("₹9,750 – ₹16,000", table_cell_style), Paragraph("4.1%", table_cell_style), Paragraph("Premium upgraders, luxury 3 & 4 BHKs", table_cell_style)]
    ]
    t_pune = Table(pune_data, colWidths=[65, 45, 75, 95, 45, 162])
    t_pune.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0284c7")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_pune)
    story.append(Spacer(1, 8))

    # Lucknow Table
    story.append(Paragraph("B. Lucknow Real Estate Corridor (State Capital Region - SCR)", h2_style))
    lucknow_data = [
        [Paragraph("Locality", table_header_style), Paragraph("Zone", table_header_style), Paragraph("Avg Rate", table_header_style), Paragraph("Observed Range", table_header_style), Paragraph("Yield", table_header_style), Paragraph("Key Growth Catalyst", table_header_style)],
        [Paragraph("<b>Gomti Nagar</b>", table_cell_style), Paragraph("East", table_cell_style), Paragraph("₹8,200/sqft", table_cell_style), Paragraph("₹6,050 – ₹10,500", table_cell_style), Paragraph("3.9%", table_cell_style), Paragraph("Prestige institutional address, commercial hub", table_cell_style)],
        [Paragraph("<b>Shaheed Path</b>", table_cell_style), Paragraph("Airport Link", table_cell_style), Paragraph("₹8,200/sqft", table_cell_style), Paragraph("₹6,900 – ₹9,500", table_cell_style), Paragraph("4.6%", table_cell_style), Paragraph("Ekana Stadium, Lulu Mall, luxury high-rises", table_cell_style)],
        [Paragraph("<b>Sushant Golf</b>", table_cell_style), Paragraph("South-East", table_cell_style), Paragraph("₹7,600/sqft", table_cell_style), Paragraph("₹6,200 – ₹9,500", table_cell_style), Paragraph("4.8%", table_cell_style), Paragraph("HCL IT City, Medanta Hospital, golf township", table_cell_style)],
        [Paragraph("<b>Ayodhya Road</b>", table_cell_style), Paragraph("North-East", table_cell_style), Paragraph("₹6,200/sqft", table_cell_style), Paragraph("₹4,800 – ₹7,800", table_cell_style), Paragraph("4.3%", table_cell_style), Paragraph("Kisan Path (Outer Ring Rd), highway widening", table_cell_style)]
    ]
    t_lucknow = Table(lucknow_data, colWidths=[70, 60, 70, 95, 45, 147])
    t_lucknow.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0d9488")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_lucknow)
    story.append(Spacer(1, 10))

    # ==================== 4. REGULATORY & FINANCING ====================
    story.append(Paragraph("4. Regulatory Frameworks & Compliance Watch", h1_style))
    story.append(Paragraph("• <b>Uttar Pradesh 1% Female Stamp Duty Rebate:</b> Stamp duty is 7% for male buyers, but reduced to 6% when registered in a woman's name. This offers a ₹50,000 to ₹1,00,000 saving on typical residential transactions.", bullet_style))
    story.append(Paragraph("• <b>MahaRERA Section 13 (10% Advance Cap):</b> Strictly prohibits builders from receiving &gt;10% of unit price before registered Agreement for Sale. Critical for broker advisory to build customer confidence.", bullet_style))
    story.append(Paragraph("• <b>LDA / UP RERA Land Layout Verification:</b> Protects buyers against unauthorized private plotting schemes along Kisan Path and Sultanpur Road peripheries.", bullet_style))
    story.append(Paragraph("• <b>Home Loan Rate Benchmarks:</b> Repo rate steady at 5.25% with prime lending starting at 7.10% – 7.25% p.a. Benchmark EMI on ₹65 Lakhs for 20 years is approx ₹50,967/month.", bullet_style))

    story.append(Spacer(1, 10))

    # ==================== 5. COMMERCIALIZATION & BUSINESS MODELS ====================
    story.append(Paragraph("5. Commercialization, Monetization & Pricing Models", h1_style))
    story.append(Paragraph("The system is designed with multiple high-margin B2B monetization channels ready for deployment:", body_style))

    comm_data = [
        [Paragraph("Business Model", table_header_style), Paragraph("Target Customer", table_header_style), Paragraph("Pricing Structure", table_header_style), Paragraph("Target Monthly Revenue", table_header_style)],
        [
            Paragraph("<b>1. Daily WhatsApp Pulse</b>", table_cell_style),
            Paragraph("Independent brokers & agents", table_cell_style),
            Paragraph("₹999 – ₹1,999 / month subscription", table_cell_style),
            Paragraph("<b>₹1,00,000 / mo</b> (75 active brokers)", table_cell_style)
        ],
        [
            Paragraph("<b>2. White-Label Portals</b>", table_cell_style),
            Paragraph("Medium-to-large brokerage firms", table_cell_style),
            Paragraph("₹35,000 setup + ₹5,000/mo retainer", table_cell_style),
            Paragraph("<b>₹3,50,000 setup + ₹50,000/mo</b> (10 firms)", table_cell_style)
        ],
        [
            Paragraph("<b>3. PropTech Micro-SaaS</b>", table_cell_style),
            Paragraph("Real estate consultants & HNIs", table_cell_style),
            Paragraph("₹1,499 / month web tier", table_cell_style),
            Paragraph("<b>₹1,50,000 / mo</b> (100 subscribers)", table_cell_style)
        ],
        [
            Paragraph("<b>4. Custom Agent Tech</b>", table_cell_style),
            Paragraph("Proptech startups & developers", table_cell_style),
            Paragraph("Project contract (₹1.5L – ₹5.0L)", table_cell_style),
            Paragraph("High-ticket custom consulting", table_cell_style)
        ]
    ]
    t_comm = Table(comm_data, colWidths=[110, 115, 122, 140])
    t_comm.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#334155")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
    ]))
    story.append(t_comm)

    story.append(PageBreak())

    # ==================== 6. CODEBASE & FILE INVENTORY ====================
    story.append(Paragraph("6. Codebase Architecture & File Inventory", h1_style))
    story.append(Paragraph(
        "The repository <b>Abhi1921-oss/real-estate-research-agent</b> is engineered for zero runtime dependencies, cross-platform portability, and instantaneous execution:",
        body_style
    ))

    file_data = [
        [Paragraph("File Name", table_header_style), Paragraph("Type", table_header_style), Paragraph("Core Purpose & Implementation", table_header_style)],
        [
            Paragraph("<code>index.html</code>", table_cell_style),
            Paragraph("Frontend", table_cell_style),
            Paragraph("Executive broker interface; live ticker, city switcher tabs, mission control logs, EMI tool, print mode.", table_cell_style)
        ],
        [
            Paragraph("<code>style.css</code>", table_cell_style),
            Paragraph("Design System", table_cell_style),
            Paragraph("Modern glassmorphism dark theme, custom CSS variables, responsive mobile layout, clean print rules.", table_cell_style)
        ],
        [
            Paragraph("<code>agent.js</code>", table_cell_style),
            Paragraph("Logic", table_cell_style),
            Paragraph("Multi-city orchestrator (Lucknow & Pune), sub-agent state runner, EMI calculation, WhatsApp generator.", table_cell_style)
        ],
        [
            Paragraph("<code>lucknow_research_agent.py</code>", table_cell_style),
            Paragraph("Python CLI", table_cell_style),
            Paragraph("Standalone parallel CLI runner for Lucknow market; uses ThreadPoolExecutor, relative cross-platform paths.", table_cell_style)
        ],
        [
            Paragraph("<code>research_agent.py</code>", table_cell_style),
            Paragraph("Python CLI", table_cell_style),
            Paragraph("Standalone parallel CLI runner for Pune market; completes multi-agent collection in 1.90 seconds.", table_cell_style)
        ],
        [
            Paragraph("<code>lucknow_daily_summary.md</code>", table_cell_style),
            Paragraph("Markdown", table_cell_style),
            Paragraph("Generated 2-minute daily executive summary for Lucknow brokers with verified pricing and pitch.", table_cell_style)
        ],
        [
            Paragraph("<code>daily_summary.md</code>", table_cell_style),
            Paragraph("Markdown", table_cell_style),
            Paragraph("Generated 2-minute daily executive summary for Pune brokers.", table_cell_style)
        ],
        [
            Paragraph("<code>requirements.txt</code>", table_cell_style),
            Paragraph("Config", table_cell_style),
            Paragraph("Specification documenting zero third-party dependencies (100% standard library Python 3.7+).", table_cell_style)
        ],
        [
            Paragraph("<code>README.md</code>", table_cell_style),
            Paragraph("Docs", table_cell_style),
            Paragraph("Production-ready GitHub documentation with badges, ASCII architecture diagrams, and quick-start.", table_cell_style)
        ]
    ]
    t_file = Table(file_data, colWidths=[120, 60, 307])
    t_file.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_file)
    story.append(Spacer(1, 12))

    # ==================== 7. EXECUTION INSTRUCTIONS ====================
    story.append(Paragraph("7. How to Run & Expand the System", h1_style))
    story.append(Paragraph("• <b>Run Web Dashboard:</b> Execute <code>python -m http.server 8080</code> inside <code>c:\\agent</code> and navigate to <code>http://localhost:8080</code>.", bullet_style))
    story.append(Paragraph("• <b>Run Lucknow CLI Agent:</b> Execute <code>python lucknow_research_agent.py</code> to output updated markdown and JSON digests in 1.9 seconds.", bullet_style))
    story.append(Paragraph("• <b>Run Pune CLI Agent:</b> Execute <code>python research_agent.py</code>.", bullet_style))
    story.append(Paragraph("• <b>Push Updates to GitHub:</b> Run <code>git push</code> in <code>c:\\agent</code>.", bullet_style))

    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceAfter=10))
    story.append(Paragraph("<b>Document Status:</b> Official Project Specification • Generated September 2026 • Ready for Commercial Deployment", ParagraphStyle(
        'FooterNotice', fontName='Helvetica-Oblique', fontSize=8, textColor=colors.HexColor("#64748b"), alignment=1
    )))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully built PDF at: {output_path}")

if __name__ == "__main__":
    build_pdf()
