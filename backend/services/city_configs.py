"""
Universal Indian Real Estate Markets Configuration
Covers 5 prime metropolitan corridors:
- Pune (Maharashtra / MahaRERA)
- Lucknow (Uttar Pradesh / UP-RERA)
- Mumbai MMR (Maharashtra / MahaRERA)
- Bengaluru (Karnataka / K-RERA)
- Delhi-NCR (Gurgaon HRERA & Noida UP-RERA)
"""

from typing import Dict, Any, List

CITIES_REGISTRY: Dict[str, Dict[str, Any]] = {
    "pune": {
        "city_id": "pune",
        "name": "Pune",
        "region_name": "Pune Metropolitan (PMRDA)",
        "emoji": "🚀",
        "brand_title": "PuneRealty",
        "state": "Maharashtra",
        "rera_authority": "MahaRERA",
        "macro": {
            "repo_rate": "5.25%",
            "home_loan_floor": "7.10% – 7.25% p.a.",
            "stamp_duty": "6% (5% Stamp Duty + 1% Local Body Cess)",
            "circle_rate": "Maintained status quo (No hike)",
            "compliance_tag": "MahaRERA Strict 10% Advance Cap",
            "market_vibe": "IT Expansion & Metro Line 3 Surge"
        },
        "search_keywords": ["Pune real estate price per sqft Kharadi Hinjewadi Baner", "MahaRERA new project launches Pune 2026"],
        "localities": [
            {"name": "Kharadi", "zone": "East Corridor", "avg_price": "₹11,150", "range": "₹8,500 – ₹13,800", "yield": "4.8% – 5.4%", "metro": "EON IT Park corridor"},
            {"name": "Hinjewadi", "zone": "West Corridor", "avg_price": "₹8,400", "range": "₹7,000 – ₹10,150", "yield": "4.9% – 5.6%", "metro": "Metro Line 3 direct link"},
            {"name": "Wakad", "zone": "Pimpri-Chinchwad Link", "avg_price": "₹9,400", "range": "₹8,250 – ₹10,800", "yield": "4.2% – 4.7%", "metro": "Expressway proximity"},
            {"name": "Baner", "zone": "West Upmarket Hub", "avg_price": "₹11,600", "range": "₹9,750 – ₹16,000", "yield": "3.8% – 4.3%", "metro": "Premium 3/4 BHK absorption"}
        ],
        "launches": [
            {"name": "Saheel Luxton", "location": "Wakad", "builder": "Saheel Properties", "units": "2 & 3 BHK High-Rise", "rera": "P52100054231"},
            {"name": "Life Republic Sector R", "location": "Hinjewadi", "builder": "Kolte-Patil", "units": "2 & 3 BHK Smart Township", "rera": "Township Sector Registered"},
            {"name": "Gera Avive Towers", "location": "Kharadi", "builder": "Gera Developments", "units": "2.5 & 3.5 BHK Child-Centric", "rera": "P52100051890"}
        ],
        "top_rule": "MahaRERA strictly caps advances at 10% before registered Agreement for Sale. Mandatory QR code on all marketing."
    },
    "lucknow": {
        "city_id": "lucknow",
        "name": "Lucknow",
        "region_name": "Lucknow SCR Area",
        "emoji": "🏛️",
        "brand_title": "LucknowRealty",
        "state": "Uttar Pradesh",
        "rera_authority": "UP-RERA",
        "macro": {
            "repo_rate": "5.25%",
            "home_loan_floor": "7.10% – 7.25% p.a.",
            "stamp_duty": "7% (1% Rebate for Female Buyers = 6%)",
            "circle_rate": "IGRSUP revised guidelines in effect",
            "compliance_tag": "UP-RERA Model Agreement Mandate",
            "market_vibe": "SCR Formation & Airport Corridor Boom"
        },
        "search_keywords": ["Lucknow real estate Shaheed Path Gomti Nagar prices", "UP RERA approved projects Lucknow 2026"],
        "localities": [
            {"name": "Gomti Nagar", "zone": "Central Prestige Hub", "avg_price": "₹8,200", "range": "₹6,050 – ₹10,500", "yield": "3.6% – 4.2%", "metro": "Operational Metro corridor"},
            {"name": "Shaheed Path", "zone": "Airport - IT Expressway", "avg_price": "₹8,200", "range": "₹6,900 – ₹9,500", "yield": "4.3% – 4.9%", "metro": "Direct Ekana & Lulu Mall link"},
            {"name": "Sushant Golf City", "zone": "South-East Township", "avg_price": "₹7,600", "range": "₹6,200 – ₹9,500", "yield": "4.5% – 5.2%", "metro": "Near Medanta & HCL IT City"},
            {"name": "Ayodhya / Faizabad Rd", "zone": "North-East Growth Link", "avg_price": "₹6,200", "range": "₹4,800 – ₹7,800", "yield": "4.0% – 4.6%", "metro": "Kisan Path Outer Ring direct connection"}
        ],
        "launches": [
            {"name": "Shalimar Valencia East", "location": "Gomti Nagar Extn", "builder": "Shalimar Corp", "units": "3 & 4 BHK Luxury & Villas", "rera": "UPRERAPRJ65412"},
            {"name": "Eldeco Trinity", "location": "Shaheed Path", "builder": "Eldeco Group", "units": "3 & 4 BHK Luxury Suites", "rera": "UPRERAPRJ88231"},
            {"name": "Rishita Mulberry Heights", "location": "Sushant Golf City", "builder": "Rishita Developers", "units": "2 & 3 BHK Resort Living", "rera": "UPRERAPRJ35728"}
        ],
        "top_rule": "UP-RERA strictly penalizes unauthorized non-LDA plotted subdivisions. 1% stamp duty rebate actively benefits women buyers."
    },
    "mumbai": {
        "city_id": "mumbai",
        "name": "Mumbai (MMR)",
        "region_name": "Mumbai Metropolitan Region",
        "emoji": "🌊",
        "brand_title": "MumbaiRealty",
        "state": "Maharashtra",
        "rera_authority": "MahaRERA",
        "macro": {
            "repo_rate": "5.25%",
            "home_loan_floor": "7.10% – 7.25% p.a.",
            "stamp_duty": "6% (5% + 1% Metro Cess in BMC)",
            "circle_rate": "ASR stability maintained for FY26",
            "compliance_tag": "MahaRERA De-registration & QPR Tracking",
            "market_vibe": "Coastal Road & Atal Setu Transit Expansion"
        },
        "search_keywords": ["Mumbai real estate price trends Thane Powai Andheri", "MahaRERA Mumbai project launches 2026"],
        "localities": [
            {"name": "Andheri West", "zone": "Western Suburbs Hub", "avg_price": "₹32,500", "range": "₹26,000 – ₹42,000", "yield": "3.1% – 3.7%", "metro": "Metro Line 2A & 7 connectivity"},
            {"name": "Powai / Kanjurmarg", "zone": "Central Tech Hub", "avg_price": "₹24,800", "range": "₹20,000 – ₹31,000", "yield": "3.8% – 4.4%", "metro": "JVLR & Metro Line 6 link"},
            {"name": "Thane West (Ghodbunder)", "zone": "Growth Corridor", "avg_price": "₹14,500", "range": "₹11,500 – ₹18,000", "yield": "3.6% – 4.2%", "metro": "Metro Line 4 integration"},
            {"name": "Navi Mumbai (Ulwe/Dronagiri)", "zone": "NMIA Airport Influence", "avg_price": "₹9,800", "range": "₹7,500 – ₹12,500", "yield": "4.2% – 4.9%", "metro": "MTHL Atal Setu direct access"}
        ],
        "launches": [
            {"name": "Lodha Woods Tower 5", "location": "Kandivali East", "builder": "Lodha Group", "units": "2 & 3 BHK Nature Suites", "rera": "P51800031520"},
            {"name": "Godrej Horizon", "location": "Wadala", "builder": "Godrej Properties", "units": "2 & 3 BHK Skyline Residences", "rera": "P51900034640"},
            {"name": "Rustomjee Urbania Uptown", "location": "Thane West", "builder": "Rustomjee", "units": "2 BHK Premium High-Rise", "rera": "P51700047510"}
        ],
        "top_rule": "MahaRERA mandates quarterly progress reports (QPR). Stamp duty base calculations strictly follow Ready Reckoner annual slabs."
    },
    "bengaluru": {
        "city_id": "bengaluru",
        "name": "Bengaluru",
        "region_name": "Bengaluru Urban & Tech Corridors",
        "emoji": "🌳",
        "brand_title": "BangaloreRealty",
        "state": "Karnataka",
        "rera_authority": "Karnataka RERA",
        "macro": {
            "repo_rate": "5.25%",
            "home_loan_floor": "7.10% – 7.25% p.a.",
            "stamp_duty": "5% + 2% Surcharge (Total 5.6% – 6.6%)",
            "circle_rate": "Guidance values revised across tech zones",
            "compliance_tag": "K-RERA Strict Project Occupancy & Cauvery Water Compliance",
            "market_vibe": "Namma Metro Blue Line & Global Capability Center (GCC) Absorption"
        },
        "search_keywords": ["Bangalore real estate price Whitefield Sarjapur Hebbal", "Karnataka RERA approved launches Bangalore 2026"],
        "localities": [
            {"name": "Whitefield", "zone": "East Tech Corridor", "avg_price": "₹11,400", "range": "₹8,800 – ₹15,200", "yield": "4.8% – 5.5%", "metro": "Purple Line operational"},
            {"name": "Sarjapur Road", "zone": "South-East IT Belt", "avg_price": "₹10,200", "range": "₹8,200 – ₹13,500", "yield": "4.6% – 5.2%", "metro": "ORR tech company proximity"},
            {"name": "Hebbal / Bellary Rd", "zone": "North Airport Corridor", "avg_price": "₹13,800", "range": "₹10,500 – ₹19,000", "yield": "3.9% – 4.5%", "metro": "Airport Metro Blue Line catalyst"},
            {"name": "Electronic City", "zone": "South IT Corridor", "avg_price": "₹6,800", "range": "₹5,200 – ₹8,900", "yield": "5.2% – 5.8%", "metro": "Yellow Line high rental absorption"}
        ],
        "launches": [
            {"name": "Prestige Park Grove", "location": "Whitefield", "builder": "Prestige Group", "units": "2, 3 & 4 BHK & Villas", "rera": "PRM/KA/RERA/1251/446/PR/100823/006141"},
            {"name": "Sobha Neopolis", "location": "Panathur / Marathahalli", "builder": "Sobha Ltd", "units": "3 & 4 BHK Greek-Themed Living", "rera": "PRM/KA/RERA/1251/446/PR/200923/006269"},
            {"name": "Brigade Oasis Phase 3", "location": "Devanahalli", "builder": "Brigade Group", "units": "Plotted Development Suites", "rera": "PRM/KA/RERA/1250/303/PR/230124/006584"}
        ],
        "top_rule": "K-RERA mandates dedicated project escrow accounts and strict Cauvery water board approvals for high-rise occupancy certificates."
    },
    "delhi_ncr": {
        "city_id": "delhi_ncr",
        "name": "Delhi-NCR",
        "region_name": "Gurgaon & Noida Corridors",
        "emoji": "🏙️",
        "brand_title": "NCRRealty",
        "state": "Haryana & UP",
        "rera_authority": "HRERA & UP-RERA",
        "macro": {
            "repo_rate": "5.25%",
            "home_loan_floor": "7.10% – 7.25% p.a.",
            "stamp_duty": "7% (Haryana: 5% women, 7% men | UP: 6% women, 7% men)",
            "circle_rate": "Circle rates steady; stamp duty digital e-stamping enforced",
            "compliance_tag": "HRERA Gurugram Bench Active Oversight",
            "market_vibe": "Dwarka Expressway Commercialisation & Jewar Airport Acceleration"
        },
        "search_keywords": ["Gurgaon real estate Dwarka Expressway Golf Course Extn prices", "Noida Sector 150 real estate launches HRERA 2026"],
        "localities": [
            {"name": "Golf Course Extn (Gurgaon)", "zone": "Prime Luxury Corridor", "avg_price": "₹18,500", "range": "₹14,000 – ₹26,000", "yield": "3.5% – 4.1%", "metro": "Rapid Metro expansion proximity"},
            {"name": "Dwarka Expressway", "zone": "High-Growth Highway Corridor", "avg_price": "₹13,200", "range": "₹10,500 – ₹17,500", "yield": "4.2% – 4.8%", "metro": "Direct Delhi IGI Airport corridor"},
            {"name": "Sector 150 (Noida)", "zone": "Green Sports City Hub", "avg_price": "₹9,800", "range": "₹8,200 – ₹12,800", "yield": "4.0% – 4.6%", "metro": "Noida-Greater Noida Aqua Line"},
            {"name": "New Gurgaon (Sec 82-95)", "zone": "Residential Value Corridor", "avg_price": "₹8,900", "range": "₹7,200 – ₹11,200", "yield": "4.4% – 5.0%", "metro": "Direct access to CPR & NH-48"}
        ],
        "launches": [
            {"name": "DLF The Arbour Phase 2", "location": "Golf Course Extn Road", "builder": "DLF Ltd", "units": "4 BHK Ultra-Luxury High-Rise", "rera": "RC/REP/HARERA/GGM/690/422/2023/34"},
            {"name": "M3M Crown", "location": "Sector 111, Dwarka Exp", "builder": "M3M India", "units": "3 & 4 BHK Luxury Floors", "rera": "RC/REP/HARERA/GGM/687/419/2023/31"},
            {"name": "Godrej Tropical Isle", "location": "Sector 146, Noida", "builder": "Godrej Properties", "units": "3 & 4 BHK Resort Residences", "rera": "UPRERAPRJ303390"}
        ],
        "top_rule": "HRERA requires 70% escrow compliance before any promoter withdrawal. Noida Authority strictly audits land dues clearance before registry."
    }
}
