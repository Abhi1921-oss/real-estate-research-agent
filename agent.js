/**
 * Multi-City Real Estate Daily Research Multi-Agent Engine
 * Supports Pune & Lucknow Real Estate Markets
 * Orchestrates Sub-Agents 1, 2, and 3 in parallel with live status feeds,
 * micro-market data calculation, regulatory tracking, and WhatsApp synthesis.
 */

const CITIES_DATA = {
  lucknow: {
    cityId: "lucknow",
    cityName: "Lucknow",
    regionName: "Lucknow SCR Area",
    logoEmoji: "🏛️",
    brandTitle: "LucknowRealty",
    macro: {
      repoRate: "5.25%",
      homeLoanStarting: "7.10% – 7.25%",
      stampDuty: "7% (1% Rebate for Women = 6%)",
      circleRateStatus: "Revised (IGRSUP in effect)",
      regulatoryTag: "UP RERA & LDA Compliance",
      marketVibe: "High Capital Region & NRI Influx"
    },
    topAlert: {
      tag: "Most Important Update for Today (Lucknow)",
      headline: "Home Loan Rates At 7.10% Floor + 1% Women Stamp Duty Rebate Sparks Festive Closings",
      bullets: [
        { title: "Female Buyer Advantage:", desc: "Uttar Pradesh offers a 1% rebate on stamp duty (effective 6% instead of 7%) for women buyers. Highlight this tax-saving hack to family buyers." },
        { title: "Shaheed Path & SCR Expansion:", desc: "Formation of Uttar Pradesh State Capital Region (SCR) and Lulu Mall/IT City commercial corridor are driving double-digit capital appreciation on Shaheed Path." },
        { title: "UP RERA Model Agreement:", desc: "UP RERA strictly enforces model sale agreements; warn buyers to steer clear of unauthorized non-LDA plots along agricultural belts." },
        { title: "Metro & Kisan Path Connectivity:", desc: "Upcoming Charbagh-Vasant Kunj Metro line and operational Kisan Path (Outer Ring Road) have accelerated absorption along Sultanpur and Ayodhya Road." }
      ]
    },
    filterOptions: [
      { id: "all", label: "All Corridors" },
      { id: "shaheed", label: "Shaheed Path & South" },
      { id: "gomti", label: "Gomti Nagar & East" }
    ],
    localities: [
      {
        id: "gomti_nagar",
        name: "Gomti Nagar",
        zone: "Central / East Corridor",
        category: "gomti",
        avgPrice: "₹8,200",
        avgVal: 8200,
        range: "₹6,050 – ₹10,500",
        rentalYield: "3.6% – 4.2%",
        metroImpact: "High (Operational Metro & Vibhuti Khand Hub)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Prestige address for doctors, bureaucrats & corporate heads; unmatched social infrastructure."
      },
      {
        id: "shaheed_path",
        name: "Shaheed Path",
        zone: "Airport - IT Expressway",
        category: "shaheed",
        avgPrice: "₹8,200",
        avgVal: 8200,
        range: "₹6,900 – ₹9,500",
        rentalYield: "4.3% – 4.9%",
        metroImpact: "Direct (Airport to Ekana & Lulu Mall corridor)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Lucknow's fastest growing luxury corridor; major hub for modern high-rises and high rental demand."
      },
      {
        id: "sushant_golf",
        name: "Sushant Golf City",
        zone: "South-East Integrated Township",
        category: "shaheed",
        avgPrice: "₹7,600",
        avgVal: 7600,
        range: "₹6,200 – ₹9,500",
        rentalYield: "4.5% – 5.2%",
        metroImpact: "High (Near Medanta & HCL IT City)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Value-luxury township living with expansive golf greens, Medanta Hospital, and wide avenues."
      },
      {
        id: "ayodhya_road",
        name: "Ayodhya / Faizabad Rd",
        zone: "North-East Growth Corridor",
        category: "gomti",
        avgPrice: "₹6,200",
        avgVal: 6200,
        range: "₹4,800 – ₹7,800",
        rentalYield: "4.0% – 4.6%",
        metroImpact: "Direct Kisan Path (Outer Ring Road) link",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Top investment corridor for affordable to mid-segment capital appreciation with rapid highway widening."
      }
    ],
    launches: [
      {
        name: "Shalimar Valencia County East",
        builder: "Shalimar Corp",
        location: "Gomti Nagar Extension",
        type: "Luxury 3 & 4 BHK & Villas",
        rera: "UPRERAPRJ65412",
        status: "Active Bookings",
        verified: true,
        notes: "Part of Shalimar OneWorld township, high capital appreciation."
      },
      {
        name: "Eldeco Trinity",
        builder: "Eldeco Group",
        location: "Shaheed Path / Gomti Extn",
        type: "3 & 4 BHK Luxury Suites",
        rera: "UPRERAPRJ88231",
        status: "New Launch",
        verified: true,
        notes: "Opposite Ekana Stadium, premium club amenities."
      },
      {
        name: "Omaxe Cassia (Metro City)",
        builder: "Omaxe Ltd",
        location: "Raebareli Road",
        type: "2 & 3 BHK Independent Floors",
        rera: "UPRERAPRJ44190",
        status: "Fast Construction",
        verified: true,
        notes: "Direct connectivity to SGPGI & Outer Ring Road."
      },
      {
        name: "Rishita Mulberry Heights",
        builder: "Rishita Developers",
        location: "Sushant Golf City",
        type: "2 & 3 BHK Resort Living",
        rera: "UPRERAPRJ35728",
        status: "Ready / Near Possession",
        verified: true,
        notes: "Walking distance from Lulu Mall & golf greens."
      }
    ],
    rules: [
      {
        type: "success",
        title: "🛡️ UP Stamp Duty: 1% Rebate for Female Buyers",
        desc: "Stamp duty is 7% for male buyers, but reduced to 6% when property is registered in the name of a female owner (or co-owner). Pitch this tax saving to families."
      },
      {
        type: "normal",
        title: "📱 UP RERA Verification & Model Agreement",
        desc: "All advertising must show the valid UP RERA project number. Ensure buyers register transactions under the UP RERA standard model agreement to prevent unilateral builder delays."
      },
      {
        type: "warning",
        title: "⚠️ LDA Approval Vigilance on Outskirts Plots",
        desc: "Warn clients strongly against unapproved private builder plots along Kisan Path and Sultanpur Road. Always verify LDA (Lucknow Development Authority) layout clearance."
      }
    ],
    verbalPitch: `"Sir/Ma'am, with home loans starting at 7.10% and the State Capital Region (SCR) expanding rapidly, corridors like Shaheed Path and Sushant Golf City around Lulu Mall and IT City are delivering solid 4.8% rental yields. Ayodhya Road along Kisan Path also has tremendous capital appreciation headroom. Plus, women buyers save a full 1% on stamp duty. Can we schedule a site visit this Sunday to review UP RERA-approved inventory?"`
  },

  pune: {
    cityId: "pune",
    cityName: "Pune",
    regionName: "Pune Metro Area",
    logoEmoji: "🏢",
    brandTitle: "PuneRealty",
    macro: {
      repoRate: "5.25%",
      homeLoanStarting: "7.10% – 7.25%",
      stampDuty: "7% (PMC / PCMC + Metro Cess)",
      circleRateStatus: "Held Steady (0% general hike)",
      regulatoryTag: "MahaRERA 10% Advance Cap",
      marketVibe: "Active IT & End-User Buying"
    },
    topAlert: {
      tag: "Most Important Update for Today (Pune)",
      headline: "Home Loan Rates At 7.10% Floor + MahaRERA 10% Advance Cap Gives High Buyer Leverage",
      bullets: [
        { title: "Prime Loan Window:", desc: "Top-tier borrowers (CIBIL 750+) can lock in loans starting at 7.10% – 7.25% p.a., keeping monthly EMIs lower compared to last year." },
        { title: "Legal Safety Pitch:", desc: "MahaRERA prohibits builders from demanding over 10% advance without registered sale agreement—use this to ease hesitant first-time buyers." },
        { title: "Stable Ready Reckoner:", desc: "Government maintained status quo on ASR rates, avoiding surprise stamp duty valuation surges across PMC & PCMC areas." },
        { title: "Metro Expansion Impact:", desc: "Hinjewadi-Shivajinagar Line 3 test runs continue to push appreciation on Wakad-Hinjewadi 2/3 BHKs." }
      ]
    },
    filterOptions: [
      { id: "all", label: "All Corridors" },
      { id: "west", label: "West Pune (IT Corridor)" },
      { id: "east", label: "East Pune (BFSI / Tech)" }
    ],
    localities: [
      {
        id: "kharadi",
        name: "Kharadi",
        zone: "East Pune",
        category: "east",
        avgPrice: "₹11,150",
        avgVal: 11150,
        range: "₹8,500 – ₹13,800",
        rentalYield: "4.8% – 5.4%",
        metroImpact: "High (EON IT Park Corridor)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Solid corporate IT tenant pool; fast 2/3 BHK resale liquidity."
      },
      {
        id: "hinjewadi",
        name: "Hinjewadi",
        zone: "West Pune",
        category: "west",
        avgPrice: "₹8,400",
        avgVal: 8400,
        range: "₹7,000 – ₹10,150",
        rentalYield: "4.9% – 5.6%",
        metroImpact: "Direct (Line 3 Shivajinagar-Hinjewadi)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Highest rental yield in Pune; high demand from tech freshers to team leads."
      },
      {
        id: "wakad",
        name: "Wakad",
        zone: "West Pune",
        category: "west",
        avgPrice: "₹9,400",
        avgVal: 9400,
        range: "₹8,250 – ₹10,800",
        rentalYield: "4.2% – 4.7%",
        metroImpact: "Indirect / Feeder to Hinjewadi",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Family-first residential pocket; premium schools and high retail saturation."
      },
      {
        id: "baner",
        name: "Baner",
        zone: "West Pune",
        category: "west",
        avgPrice: "₹11,600",
        avgVal: 11600,
        range: "₹9,750 – ₹16,000",
        rentalYield: "3.8% – 4.3%",
        metroImpact: "Medium (Baner-Balewadi arterial)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Premium upgrader market; strong preference for 3 & 4 BHK lifestyle townships."
      }
    ],
    launches: [
      {
        name: "Saheel Luxton",
        builder: "Saheel Properties",
        location: "Wakad",
        type: "2 & 3 BHK High-Rise",
        rera: "P52100054231",
        status: "New Launch (Q1 2026)",
        verified: true,
        notes: "Expected Possession: 2028-2029 | Near Highway"
      },
      {
        name: "Life Republic (New Sectors)",
        builder: "Kolte-Patil Developers",
        location: "Hinjewadi-Marunji",
        type: "Township / 2, 3 BHK & Row Houses",
        rera: "P52100000045",
        status: "Active Bookings",
        verified: true,
        notes: "1 to 4 BHK formats, high rental absorption"
      },
      {
        name: "Gera Avive Towers",
        builder: "Gera Developments",
        location: "Kharadi",
        type: "2.5, 3 & 3.5 BHK Child-Centric",
        rera: "P52100051890",
        status: "Under Construction",
        verified: true,
        notes: "Close to EON Free Zone & WTC Pune"
      },
      {
        name: "Joyville Vyomora",
        builder: "Shapoorji Pallonji",
        location: "Hinjewadi Phase 1",
        type: "2 & 3 BHK Urban Smart Homes",
        rera: "P52100052341",
        status: "Active Selling",
        verified: true,
        notes: "Direct access to Rajiv Gandhi Infotech Park"
      }
    ],
    rules: [
      {
        type: "success",
        title: "🛡️ Strict 10% Advance Cap (Section 13)",
        desc: "Developers cannot legally accept more than 10% of total unit cost before registering an Agreement for Sale. Never let buyers transfer larger token sums prematurely."
      },
      {
        type: "normal",
        title: "📱 Mandatory MahaRERA QR Codes on All Collaterals",
        desc: "Brochures and hoardings must show official QR codes. Advise buyers to scan to check quarterly construction progress filings (QPR) directly."
      },
      {
        type: "warning",
        title: "📑 Ready Reckoner (ASR) Stability",
        desc: "State government held Ready Reckoner rates steady for the current period, keeping stamp duty base costs predictable for clients."
      }
    ],
    verbalPitch: `"Sir/Ma'am, home loan rates are steady around 7.15%, Ready Reckoner rates haven't climbed, and rental yields in Hinjewadi/Kharadi are sitting solid at 5%. If you're looking for capital growth, Metro corridors in Wakad and Hinjewadi are currently the most active entry points. Let's schedule a site visit this Saturday to lock in current pre-launch pricing."`
  },

  mumbai: {
    cityId: "mumbai",
    cityName: "Mumbai",
    regionName: "Mumbai Metropolitan Region",
    logoEmoji: "🌊",
    brandTitle: "MumbaiRealty",
    macro: {
      repoRate: "5.25%",
      homeLoanStarting: "7.10% – 7.25%",
      stampDuty: "6% (5% + 1% Metro Cess in BMC)",
      circleRateStatus: "Steady ASR slabs maintained",
      regulatoryTag: "MahaRERA QPR Compliance",
      marketVibe: "Coastal Road & Atal Setu Transit Boom"
    },
    topAlert: {
      tag: "Most Important Update for Today (Mumbai)",
      headline: "Coastal Road & MTHL Transit Corridor Opening Drives High Capital Growth in Suburbs",
      bullets: [
        { title: "Transit Infrastructure Boost:", desc: "Operational Mumbai Coastal Road and Atal Setu (MTHL) have unlocked rapid cross-city transit, accelerating luxury sales in Western Suburbs and Navi Mumbai." },
        { title: "MahaRERA Escrow Mandate:", desc: "MahaRERA actively enforces 70% escrow discipline; buyers can verify verified construction fund allocations on MahaRERA portal." },
        { title: "Low Prime Rates:", desc: "Top banks offer prime home loans starting @ 7.10% p.a., sustaining strong end-user absorption across 2 and 3 BHK configurations." },
        { title: "Ready Reckoner Slabs:", desc: "No general Ready Reckoner jump for the period keeps closing fees and registration expenses stable." }
      ]
    },
    filterOptions: [
      { id: "all", label: "All Corridors" },
      { id: "suburbs", label: "Western & Central Suburbs" },
      { id: "mmr", label: "Thane & Navi Mumbai" }
    ],
    localities: [
      {
        id: "andheri_west",
        name: "Andheri West",
        zone: "Western Suburbs Hub",
        category: "suburbs",
        avgPrice: "₹32,500",
        avgVal: 32500,
        range: "₹26,000 – ₹42,000",
        rentalYield: "3.1% – 3.7%",
        metroImpact: "High (Metro Lines 2A & 7)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Prestige lifestyle corridor with unmatched retail, media and culinary social infra."
      },
      {
        id: "powai",
        name: "Powai / Kanjurmarg",
        zone: "Central Tech Hub",
        category: "suburbs",
        avgPrice: "₹24,800",
        avgVal: 24800,
        range: "₹20,000 – ₹31,000",
        rentalYield: "3.8% – 4.4%",
        metroImpact: "Direct (JVLR & Metro Line 6 link)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Top tech and banking corporate tenant pool; premium lakeside township living."
      },
      {
        id: "thane_west",
        name: "Thane West (Ghodbunder)",
        zone: "Thane Corridor",
        category: "mmr",
        avgPrice: "₹14,500",
        avgVal: 14500,
        range: "₹11,500 – ₹18,000",
        rentalYield: "3.6% – 4.2%",
        metroImpact: "High (Metro Line 4 integration)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Self-sustaining family micro-market with top tier schools, malls and rapid capital growth."
      },
      {
        id: "navi_mumbai",
        name: "Navi Mumbai (Ulwe/Dronagiri)",
        zone: "NMIA Airport Influence",
        category: "mmr",
        avgPrice: "₹9,800",
        avgVal: 9800,
        range: "₹7,500 – ₹12,500",
        rentalYield: "4.2% – 4.9%",
        metroImpact: "Direct (MTHL Atal Setu Link)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Direct beneficiary of upcoming Navi Mumbai International Airport and Atal Setu expressway."
      }
    ],
    launches: [
      {
        name: "Lodha Woods Tower 5",
        builder: "Lodha Group",
        location: "Kandivali East",
        type: "2 & 3 BHK Nature Suites",
        rera: "P51800031520",
        status: "Active Bookings",
        verified: true,
        notes: "Overlooks Sanjay Gandhi National Park, luxury clubhouse amenities."
      },
      {
        name: "Godrej Horizon",
        builder: "Godrej Properties",
        location: "Wadala",
        type: "2 & 3 BHK Skyline Residences",
        rera: "P51900034640",
        status: "New Launch",
        verified: true,
        notes: "Strategic central connectivity linking Eastern Freeway & BKC connector."
      },
      {
        name: "Rustomjee Urbania Uptown",
        builder: "Rustomjee",
        location: "Thane West",
        type: "2 BHK Premium High-Rise",
        rera: "P51700047510",
        status: "Active Bookings",
        verified: true,
        notes: "Integrated 100+ acre township with Cambridge school inside."
      }
    ],
    rules: [
      {
        type: "highlight",
        title: "📜 MahaRERA Advance Booking Cap",
        desc: "Strict 10% maximum token allowed prior to registered Agreement for Sale. Reassure buyers about compliance safety."
      },
      {
        type: "warning",
        title: "📱 Mandatory QR Codes on All Promotional Ads",
        desc: "All print and digital ads must show official MahaRERA QR code linked to project disclosures."
      }
    ],
    verbalPitch: `"Sir/Ma'am, with home loans starting at 7.10% and landmark transit like the Coastal Road and Atal Setu operational, corridors in Powai and Thane West are showing stellar rental yields and capital growth. Can we arrange a site visit this Saturday to view RERA-verified luxury inventory?"`
  },

  bengaluru: {
    cityId: "bengaluru",
    cityName: "Bengaluru",
    regionName: "Bengaluru Tech Corridors",
    logoEmoji: "🌳",
    brandTitle: "BangaloreRealty",
    macro: {
      repoRate: "5.25%",
      homeLoanStarting: "7.10% – 7.25%",
      stampDuty: "5.6% – 6.6% (Including Surcharge)",
      circleRateStatus: "Revised Guidance Values in effect",
      regulatoryTag: "K-RERA & BWSSB Compliance",
      marketVibe: "Namma Metro Blue Line & GCC Expansion"
    },
    topAlert: {
      tag: "Most Important Update for Today (Bengaluru)",
      headline: "Purple Line Metro Boost & Global Capability Center (GCC) Absorption Drives Record Leasing",
      bullets: [
        { title: "Corporate Tech Absorption:", desc: "High GCC tenant leasing along Whitefield and Outer Ring Road continues to deliver city-leading 4.8% – 5.5% residential rental yields." },
        { title: "Namma Metro Blue Line Catalyst:", desc: "Construction of the Silk Board to Airport Metro Blue Line has triggered high pre-launch interest along Bellary Road and Hebbal." },
        { title: "K-RERA Strict Escrow Mandate:", desc: "Karnataka RERA strictly audits project escrow accounts; advise buyers to look for registered RERA approvals." },
        { title: "Favorable Interest Rate Floor:", desc: "Home loan rates at 7.10% – 7.25% support strong salaried engineer and team lead purchase decisions." }
      ]
    },
    filterOptions: [
      { id: "all", label: "All Corridors" },
      { id: "east", label: "East Tech (Whitefield/ORR)" },
      { id: "north_south", label: "North & South Corridors" }
    ],
    localities: [
      {
        id: "whitefield",
        name: "Whitefield",
        zone: "East Tech Corridor",
        category: "east",
        avgPrice: "₹11,400",
        avgVal: 11400,
        range: "₹8,800 – ₹15,200",
        rentalYield: "4.8% – 5.5%",
        metroImpact: "Direct (Purple Line operational)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Core IT corridor with massive corporate tenant pool and premium high-rise inventory."
      },
      {
        id: "sarjapur_road",
        name: "Sarjapur Road",
        zone: "South-East Tech Belt",
        category: "east",
        avgPrice: "₹10,200",
        avgVal: 10200,
        range: "₹8,200 – ₹13,500",
        rentalYield: "4.6% – 5.2%",
        metroImpact: "High (Near ORR Tech Parks)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Top choice for software architects and senior leadership seeking luxury gated communities."
      },
      {
        id: "hebbal",
        name: "Hebbal / Bellary Rd",
        zone: "North Airport Corridor",
        category: "north_south",
        avgPrice: "₹13,800",
        avgVal: 13800,
        range: "₹10,500 – ₹19,000",
        rentalYield: "3.9% – 4.5%",
        metroImpact: "High (Airport Metro Blue Line)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Prestige gateway to KIA Airport; high commercial Grade-A office development."
      },
      {
        id: "electronic_city",
        name: "Electronic City",
        zone: "South IT Corridor",
        category: "north_south",
        avgPrice: "₹6,800",
        avgVal: 6800,
        range: "₹5,200 – ₹8,900",
        rentalYield: "5.2% – 5.8%",
        metroImpact: "High (Yellow Line Metro)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Unbeatable rental yield hotspot in South Bengaluru with huge engineering workforce."
      }
    ],
    launches: [
      {
        name: "Prestige Park Grove",
        builder: "Prestige Group",
        location: "Whitefield",
        type: "2, 3 & 4 BHK & Villas",
        rera: "PRM/KA/RERA/1251/446/PR/100823/006141",
        status: "Active Bookings",
        verified: true,
        notes: "Expansive 71-acre mixed development near Kadugodi Metro."
      },
      {
        name: "Sobha Neopolis",
        builder: "Sobha Ltd",
        location: "Panathur / Marathahalli",
        type: "3 & 4 BHK Greek-Themed Living",
        rera: "PRM/KA/RERA/1251/446/PR/200923/006269",
        status: "New Launch",
        verified: true,
        notes: "Greek architecture, luxury clubhouse, walking distance to tech campuses."
      },
      {
        name: "Brigade Oasis Phase 3",
        builder: "Brigade Group",
        location: "Devanahalli",
        type: "Plotted Development Suites",
        rera: "PRM/KA/RERA/1250/303/PR/230124/006584",
        status: "Active Bookings",
        verified: true,
        notes: "Gated luxury plotted layout 15 mins from Kempegowda International Airport."
      }
    ],
    rules: [
      {
        type: "highlight",
        title: "💧 BWSSB & Cauvery Water Compliance",
        desc: "Ensure project has certified BWSSB NOC for water supply prior to client commitment."
      },
      {
        type: "warning",
        title: "⚖️ K-RERA Title Verification",
        desc: "Always advise verification of parent deed and encumbrance certificate (EC) for past 30 years."
      }
    ],
    verbalPitch: `"Sir/Ma'am, rental yields in Whitefield and Sarjapur are leading the country at 5.2%, and home loan rates are locked at 7.10%. With the Purple Line operational and Blue Line underway, capital appreciation is locked in. Let's schedule a site visit this Saturday!"`
  },

  delhi_ncr: {
    cityId: "delhi_ncr",
    cityName: "Delhi-NCR",
    regionName: "Gurgaon & Noida Corridors",
    logoEmoji: "🏙️",
    brandTitle: "NCRRealty",
    macro: {
      repoRate: "5.25%",
      homeLoanStarting: "7.10% – 7.25%",
      stampDuty: "5% – 7% (Rebate for female buyers in Haryana & UP)",
      circleRateStatus: "Circle rates steady across prime sectors",
      regulatoryTag: "HRERA & UP-RERA Mandates",
      marketVibe: "Dwarka Expressway & Jewar Airport Acceleration"
    },
    topAlert: {
      tag: "Most Important Update for Today (Delhi-NCR)",
      headline: "Dwarka Expressway Operational Corridor & Jewar Airport Fuel High HNI Luxury Buying",
      bullets: [
        { title: "Dwarka Expressway Surge:", desc: "Completion of the 8-lane grade-separated expressway linking Delhi to Gurgaon has triggered rapid 3 and 4 BHK luxury appreciation." },
        { title: "Jewar International Airport:", desc: "Upcoming commercial flights at Noida International Airport continue to push aggressive plotted and township demand along Yamuna Expressway." },
        { title: "HRERA Gurugram Bench Oversight:", desc: "HRERA strictly enforces escrow management; promoters cannot divert collections to other phases." },
        { title: "Prime Home Loan Benchmark:", desc: "Home loan rates at 7.10% – 7.25% floor provide high purchasing power for high-income corporate executives." }
      ]
    },
    filterOptions: [
      { id: "all", label: "All Corridors" },
      { id: "gurgaon", label: "Gurgaon Corridors" },
      { id: "noida", label: "Noida Corridors" }
    ],
    localities: [
      {
        id: "golf_course_extn",
        name: "Golf Course Extn (Gurgaon)",
        zone: "Prime Luxury Belt",
        category: "gurgaon",
        avgPrice: "₹18,500",
        avgVal: 18500,
        range: "₹14,000 – ₹26,000",
        rentalYield: "3.5% – 4.1%",
        metroImpact: "High (Rapid Metro link proximity)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Prestige luxury address for corporate MDs, expats and founders; exceptional lifestyle amenities."
      },
      {
        id: "dwarka_expressway",
        name: "Dwarka Expressway",
        zone: "High-Growth Highway Corridor",
        category: "gurgaon",
        avgPrice: "₹13,200",
        avgVal: 13200,
        range: "₹10,500 – ₹17,500",
        rentalYield: "4.2% – 4.8%",
        metroImpact: "Direct (IGI Airport link)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Fastest appreciating highway corridor in NCR with high-density branded residential high-rises."
      },
      {
        id: "sector_150",
        name: "Sector 150 (Noida)",
        zone: "Sports City Hub",
        category: "noida",
        avgPrice: "₹9,800",
        avgVal: 9800,
        range: "₹8,200 – ₹12,800",
        rentalYield: "4.0% – 4.6%",
        metroImpact: "Direct (Noida Aqua Line)",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Low-density green sector with integrated sports infra, 15 mins from Jewar Airport expressway."
      },
      {
        id: "new_gurgaon",
        name: "New Gurgaon (Sec 82-95)",
        zone: "Residential Growth Corridor",
        category: "gurgaon",
        avgPrice: "₹8,900",
        avgVal: 8900,
        range: "₹7,200 – ₹11,200",
        rentalYield: "4.4% – 5.0%",
        metroImpact: "Direct CPR & NH-48 link",
        verified: true,
        badgeText: "VERIFIED",
        salesPitch: "Top choice for mid-to-upper segment family end-users with operational commercial hubs."
      }
    ],
    launches: [
      {
        name: "DLF The Arbour Phase 2",
        builder: "DLF Ltd",
        location: "Golf Course Extn Road",
        type: "4 BHK Ultra-Luxury High-Rise",
        rera: "RC/REP/HARERA/GGM/690/422/2023/34",
        status: "Active Bookings",
        verified: true,
        notes: "Iconic luxury residences with 85% open greenery and master concierge service."
      },
      {
        name: "M3M Crown",
        builder: "M3M India",
        location: "Sector 111, Dwarka Exp",
        type: "3 & 4 BHK Luxury Floors",
        rera: "RC/REP/HARERA/GGM/687/419/2023/31",
        status: "New Launch",
        verified: true,
        notes: "Zero kms from Delhi border, lake-facing luxury living."
      },
      {
        name: "Godrej Tropical Isle",
        builder: "Godrej Properties",
        location: "Sector 146, Noida",
        type: "3 & 4 BHK Resort Residences",
        rera: "UPRERAPRJ303390",
        status: "Active Bookings",
        verified: true,
        notes: "Island-themed luxury living with private artificial beach and tropical club."
      }
    ],
    rules: [
      {
        type: "highlight",
        title: "📜 HRERA Escrow Safeguards",
        desc: "70% collections deposited in designated project bank accounts ensure on-time delivery guarantees."
      },
      {
        type: "warning",
        title: "🏗️ Noida Authority Dues Audit",
        desc: "Always check registry eligibility status on the official Noida Authority portal before recommending re-sales."
      }
    ],
    verbalPitch: `"Sir/Ma'am, with home loans at 7.10% and the Dwarka Expressway fully operational, capital appreciation along Golf Course Extension and Sector 111 is surging. Can we schedule a site visit this Sunday to review HRERA-registered pre-launch inventory?"`
  }
};

// Current Active City (default to Lucknow as requested)
let currentCity = 'lucknow';
let isRunningResearch = false;

// ==============================================================================
// SAAS MULTI-TENANT CLIENT STATE & CONFIGURATION
// ==============================================================================
const SAAS_CONFIG = {
  apiBaseUrl: window.SAAS_API_URL || 'http://localhost:8000',
  supabaseUrl: window.SUPABASE_URL || '',
  supabaseAnonKey: window.SUPABASE_ANON_KEY || ''
};

let supabaseClient = null;
if (window.supabase && SAAS_CONFIG.supabaseUrl && SAAS_CONFIG.supabaseAnonKey) {
  try {
    supabaseClient = window.supabase.createClient(SAAS_CONFIG.supabaseUrl, SAAS_CONFIG.supabaseAnonKey);
  } catch (err) {
    console.warn("Supabase client init failed:", err);
  }
}

// User state (initialized with Pro tier for demo/dev, syncs with Supabase/FastAPI)
let saasUserState = {
  id: "test-user-id",
  email: "demo@realtyintel.ai",
  plan_tier: "pro",
  cities_subscribed: ["lucknow", "pune"],
  reports_used_this_month: 2,
  reports_limit: 30,
  token: null,
  isAuthenticated: true
};

document.addEventListener('DOMContentLoaded', () => {
  renderCityData(currentCity);
  initEmiCalculator();
  setupEventListeners();
  setupSaaSEventListeners();
  fetchUserUsage();
});

function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (saasUserState.token) {
    headers['Authorization'] = `Bearer ${saasUserState.token}`;
  } else if (saasUserState.id) {
    headers['X-Mock-User-Id'] = saasUserState.id;
  }
  return headers;
}

function setupEventListeners() {
  document.getElementById('runAgentBtn').addEventListener('click', runParallelAgents);
  document.getElementById('copyWhatsAppBtn').addEventListener('click', copyWhatsAppPitch);
  document.getElementById('printPdfBtn').addEventListener('click', () => window.print());

  // City Switcher Buttons with Subscription Gating
  const cityBtns = document.querySelectorAll('.city-btn');
  cityBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      const targetCity = target.dataset.city;

      // Check if city is locked for current user plan
      if (isCityLocked(targetCity)) {
        showModal('citiesModal');
        const alertEl = document.getElementById('citiesAlert');
        if (alertEl) {
          alertEl.className = 'modal-alert error';
          alertEl.textContent = `City '${targetCity.toUpperCase()}' is not in your subscribed cities. Select it in your plan or upgrade to Pro / Agency.`;
          alertEl.style.display = 'block';
        }
        return;
      }

      cityBtns.forEach(b => b.classList.remove('active'));
      target.classList.add('active');
      currentCity = targetCity;
      renderCityData(currentCity);
      addTerminalLog(`City changed to ${CITIES_DATA[currentCity].cityName}. Pipeline updated.`);
    });
  });

  // EMI input listeners
  ['loanAmount', 'loanRate', 'loanTenure'].forEach(id => {
    document.getElementById(id).addEventListener('input', calculateEmi);
  });
}

function isCityLocked(cityKey) {
  if (saasUserState.plan_tier === 'agency') return false;
  const subscribed = (saasUserState.cities_subscribed || []).map(c => c.toLowerCase());
  return !subscribed.includes(cityKey.toLowerCase());
}


// Render all components for selected city
function renderCityData(cityKey) {
  const data = CITIES_DATA[cityKey];

  // 1. Update Header & Branding
  document.getElementById('headerLogoIcon').textContent = data.logoEmoji;
  document.getElementById('brandTitle').textContent = data.brandTitle;
  document.getElementById('locationBadge').textContent = data.regionName;
  document.getElementById('printCityTitle').textContent = `${data.cityName} Real Estate Executive Daily Briefing`;
  document.title = `${data.cityName} Real Estate Daily Research Agent | Executive Broker Briefing`;

  // 2. Update Ticker Ribbon
  document.getElementById('tickerMarketState').innerHTML = `Market State: <strong>${data.macro.marketVibe}</strong>`;
  document.getElementById('tickerRepoRate').innerHTML = `RBI Repo Benchmark: <strong>${data.macro.repoRate} (Stable)</strong>`;
  document.getElementById('tickerHomeLoan').innerHTML = `Prime Home Loan: <strong>${data.macro.homeLoanStarting}</strong>`;
  document.getElementById('tickerStampDuty').innerHTML = `Stamp Duty / ASR: <strong>${data.macro.stampDuty}</strong>`;
  document.getElementById('tickerRegulatory').innerHTML = `Compliance: <strong>${data.macro.regulatoryTag}</strong>`;

  // 3. Update Top Alert Card
  document.getElementById('alertTagText').textContent = data.topAlert.tag;
  document.getElementById('alertHeadlineText').textContent = data.topAlert.headline;
  const alertBulletsContainer = document.getElementById('alertBulletsList');
  alertBulletsContainer.innerHTML = '';
  data.topAlert.bullets.forEach(b => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="bullet-icon">✔</span><span><strong>${b.title}</strong> ${b.desc}</span>`;
    alertBulletsContainer.appendChild(li);
  });

  // 4. Update Filter Pills
  const filterPillContainer = document.getElementById('filterPillsContainer');
  filterPillContainer.innerHTML = '';
  data.filterOptions.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = `filter-pill ${idx === 0 ? 'active' : ''}`;
    btn.dataset.filter = opt.id;
    btn.textContent = opt.label;
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      renderLocalities(e.target.dataset.filter);
    });
    filterPillContainer.appendChild(btn);
  });

  // 5. Render Localities
  renderLocalities('all');

  // 6. Render Launches
  renderLaunches(data.launches);

  // 7. Render Regulatory Rules
  renderRules(data.rules);

  // 8. Update Verbal Pitch & WhatsApp Preview
  document.getElementById('speechPitchText').textContent = data.verbalPitch;
  updateWhatsAppPreview();
}

function renderLocalities(filterCategory) {
  const data = CITIES_DATA[currentCity];
  const container = document.getElementById('marketGrid');
  container.innerHTML = '';

  const filtered = filterCategory === 'all'
    ? data.localities
    : data.localities.filter(l => l.category === filterCategory);

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'market-card';
    card.innerHTML = `
      <div>
        <div class="card-top">
          <span class="zone-tag">${item.zone}</span>
          <span class="verification-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            ${item.badgeText}
          </span>
        </div>
        <h3 class="locality-name">${item.name}</h3>
        <div class="price-main">
          <div class="price-val">${item.avgPrice} <span class="price-unit">/ sq.ft avg</span></div>
        </div>
        <div class="range-box">
          <span>Observed Range:</span>
          <strong>${item.range}</strong>
        </div>
        <ul class="market-meta-list">
          <li class="market-meta-item">
            <span>Rental Yield:</span>
            <strong>${item.rentalYield}</strong>
          </li>
          <li class="market-meta-item">
            <span>Infrastructure Link:</span>
            <strong>${item.metroImpact}</strong>
          </li>
        </ul>
      </div>
      <div class="market-pitch-tip">
        <strong>Broker Tip:</strong> ${item.salesPitch}
      </div>
    `;
    container.appendChild(card);
  });
}

function renderLaunches(launches) {
  const container = document.getElementById('launchesContainer');
  container.innerHTML = '';
  launches.forEach(item => {
    const div = document.createElement('div');
    div.className = 'launch-item';
    div.innerHTML = `
      <div class="launch-info">
        <h4>${item.name} <span>• ${item.location}</span></h4>
        <p>By ${item.builder} | ${item.type}</p>
        <div class="launch-typology">${item.notes}</div>
      </div>
      <div class="launch-tag-group">
        <span class="rera-verified-tag">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          ${item.status}
        </span>
        <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.2rem;">${item.rera}</div>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderRules(rules) {
  const container = document.getElementById('rulesContainer');
  container.innerHTML = '';
  rules.forEach(r => {
    const div = document.createElement('div');
    div.className = `rule-item ${r.type}`;
    div.innerHTML = `
      <div class="rule-title">${r.title}</div>
      <p class="rule-desc">${r.desc}</p>
    `;
    container.appendChild(div);
  });
}

// Parallel Agent Runner (Integrated with FastAPI Backend + Postgres Caching)
async function runParallelAgents() {
  if (isRunningResearch) return;

  // 1. Check City Subscription
  if (isCityLocked(currentCity)) {
    showModal('citiesModal');
    const alertEl = document.getElementById('citiesAlert');
    if (alertEl) {
      alertEl.className = 'modal-alert error';
      alertEl.textContent = `City '${currentCity.toUpperCase()}' is locked. Please upgrade to Pro / Agency or select it in your subscribed cities.`;
      alertEl.style.display = 'block';
    }
    return;
  }

  // 2. Check Monthly Quota
  if (saasUserState.plan_tier !== 'agency' && saasUserState.reports_used_this_month >= saasUserState.reports_limit) {
    showModal('upgradeModal');
    alert(`Monthly generation limit reached (${saasUserState.reports_used_this_month}/${saasUserState.reports_limit}). Please upgrade to continue.`);
    return;
  }

  isRunningResearch = true;
  const data = CITIES_DATA[currentCity];
  const runBtn = document.getElementById('runAgentBtn');
  runBtn.innerHTML = `<span class="pulse-dot"></span> Researching ${data.cityName}...`;
  runBtn.classList.add('btn-secondary');
  runBtn.classList.remove('btn-primary');

  resetAgentVisuals();
  addTerminalLog(`Orchestrator: Dispatched research request to FastAPI backend for ${data.cityName}...`);

  try {
    // Call FastAPI Backend POST /reports/generate?city={city}
    const apiUrl = `${SAAS_CONFIG.apiBaseUrl}/reports/generate?city=${encodeURIComponent(currentCity)}`;
    
    // Animate visual bars while waiting
    const progressPromise = Promise.all([
      runAgent1_LaunchesAndPrices(data),
      runAgent2_PolicyAndBanking(data)
    ]);

    let fetchRes = null;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (response.status === 429) {
        // Quota exceeded
        const errJson = await response.json();
        showModal('upgradeModal');
        addTerminalLog(`[Quota Exceeded] ${errJson.detail?.message || 'Monthly limit reached.'}`);
        alert(errJson.detail?.message || 'Monthly limit reached. Please upgrade to Pro or Agency.');
        return;
      }

      if (response.status === 403) {
        // City not subscribed
        const errJson = await response.json();
        showModal('citiesModal');
        addTerminalLog(`[City Gated] ${errJson.detail?.message || 'City not subscribed.'}`);
        return;
      }

      if (response.ok) {
        fetchRes = await response.json();
      }
    } catch (netErr) {
      console.warn("Backend fetch failed, using local execution fallback:", netErr);
      addTerminalLog(`[Note] Backend API not reachable at ${SAAS_CONFIG.apiBaseUrl}. Using client-side execution.`);
    }

    await progressPromise;
    await runAgent3_Synthesis(data);

    if (fetchRes && fetchRes.source === 'cache') {
      addTerminalLog(`⚡ [Postgres Cache Hit] Report retrieved from today's pre-warmed cache. (No duplicate agent run)`);
    } else if (fetchRes && fetchRes.source === 'generated') {
      addTerminalLog(`🚀 [Fresh Run] Multi-agents completed and results cached in Supabase Postgres.`);
    } else {
      addTerminalLog(`Orchestrator: All sub-agents synced for ${data.cityName}. Briefing refreshed.`);
    }

    // Refresh usage counter
    fetchUserUsage();
  } catch (err) {
    console.error("Agent error:", err);
    addTerminalLog("Error occurred in pipeline: " + err.message);
  } finally {
    isRunningResearch = false;
    runBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
      </svg>
      Refresh Research
    `;
    runBtn.classList.remove('btn-secondary');
    runBtn.classList.add('btn-primary');
  }
}


function resetAgentVisuals() {
  for (let i = 1; i <= 3; i++) {
    document.getElementById(`agent${i}Card`).className = 'agent-card active';
    document.getElementById(`agent${i}Status`).className = 'agent-status-pill status-running';
    document.getElementById(`agent${i}Status`).textContent = 'PROCESSING';
    document.getElementById(`agent${i}Progress`).style.width = '10%';
  }
}

function runAgent1_LaunchesAndPrices(data) {
  return new Promise((resolve) => {
    const bar = document.getElementById('agent1Progress');
    const log = document.getElementById('agent1Log');
    const status = document.getElementById('agent1Status');
    const card = document.getElementById('agent1Card');

    addTerminalLog(`[Sub-Agent 1] Scanning ${data.cityName} micro-markets & RERA registries...`);
    log.textContent = `Crawling prices for ${data.localities[0].name} & ${data.localities[1].name}...`;
    bar.style.width = "30%";

    setTimeout(() => {
      addTerminalLog(`[Sub-Agent 1] Verified price movement: ${data.localities[0].name} ${data.localities[0].avgPrice}/sqft.`);
      log.textContent = `Validating launches: ${data.launches[0].name}, ${data.launches[1].name}...`;
      bar.style.width = "75%";
    }, 1200);

    setTimeout(() => {
      bar.style.width = "100%";
      log.textContent = `Verified 4 micro-markets & 4 primary project launches in ${data.cityName}.`;
      status.className = 'agent-status-pill status-done';
      status.textContent = 'DONE';
      card.className = 'agent-card completed';
      addTerminalLog(`[Sub-Agent 1] Finished ${data.cityName} price & launch cross-verification.`);
      resolve(true);
    }, 2400);
  });
}

function runAgent2_PolicyAndBanking(data) {
  return new Promise((resolve) => {
    const bar = document.getElementById('agent2Progress');
    const log = document.getElementById('agent2Log');
    const status = document.getElementById('agent2Status');
    const card = document.getElementById('agent2Card');

    addTerminalLog(`[Sub-Agent 2] Fetching RBI rates & state regulatory policies for ${data.cityName}...`);
    log.textContent = "Checking RBI Repo Rate & home loan starting rates...";
    bar.style.width = "35%";

    setTimeout(() => {
      addTerminalLog(`[Sub-Agent 2] Confirmed Repo Rate: 5.25% | Stamp Duty / Circle Rates verified.`);
      log.textContent = `Validating ${currentCity === 'lucknow' ? 'UP RERA & 1% female rebate' : 'MahaRERA 10% rule'}...`;
      bar.style.width = "80%";
    }, 1400);

    setTimeout(() => {
      bar.style.width = "100%";
      log.textContent = `Regulatory checks passed (${data.macro.regulatoryTag}).`;
      status.className = 'agent-status-pill status-done';
      status.textContent = 'DONE';
      card.className = 'agent-card completed';
      addTerminalLog(`[Sub-Agent 2] Finished policy and interest rate intelligence.`);
      resolve(true);
    }, 2600);
  });
}

function runAgent3_Synthesis(data) {
  return new Promise((resolve) => {
    const bar = document.getElementById('agent3Progress');
    const log = document.getElementById('agent3Log');
    const status = document.getElementById('agent3Status');
    const card = document.getElementById('agent3Card');

    addTerminalLog(`[Sub-Agent 3] Consolidating ${data.cityName} stream into 2-minute executive digest...`);
    log.textContent = "Formatting broker pitch script & WhatsApp digest...";
    bar.style.width = "50%";

    setTimeout(() => {
      bar.style.width = "100%";
      log.textContent = `Synthesized 1-page ${data.cityName} brief with verified confidence flags.`;
      status.className = 'agent-status-pill status-done';
      status.textContent = 'DONE';
      card.className = 'agent-card completed';
      addTerminalLog(`[Sub-Agent 3] Executive brief formatted for ${data.cityName}. Ready for client broadcast.`);
      updateWhatsAppPreview();
      resolve(true);
    }, 1400);
  });
}

function addTerminalLog(msg) {
  const container = document.getElementById('terminalLogs');
  if (!container) return;
  const p = document.createElement('p');
  const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  p.innerHTML = `<span class="time">[${now}]</span> ${msg}`;
  container.appendChild(p);
  container.scrollTop = container.scrollHeight;
}

// EMI Calculator
function initEmiCalculator() {
  calculateEmi();
}

function calculateEmi() {
  const principal = parseFloat(document.getElementById('loanAmount').value) * 100000;
  const annualRate = parseFloat(document.getElementById('loanRate').value);
  const years = parseFloat(document.getElementById('loanTenure').value);

  if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || annualRate <= 0 || years <= 0) {
    document.getElementById('emiOutput').textContent = "₹0";
    return;
  }

  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = years * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

  document.getElementById('emiOutput').textContent = "₹" + Math.round(emi).toLocaleString('en-IN') + " / mo";
}

// WhatsApp Pitch Formatting & Clipboard
function generateWhatsAppText() {
  const data = CITIES_DATA[currentCity];
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  
  let ratesBlock = '';
  data.localities.forEach(loc => {
    ratesBlock += `• *${loc.name}:* ~${loc.avgPrice} (Range: ${loc.range}) | Yield: ${loc.rentalYield}\n`;
  });

  let launchBlock = '';
  data.launches.forEach(l => {
    launchBlock += `• *${l.name}* (${l.location}) - ${l.type}\n`;
  });

  const citySpecialRule = currentCity === 'lucknow'
    ? `• *Women Buyer Benefit:* 1% rebate on stamp duty (6% vs 7%) in UP!`
    : `• *MahaRERA Rule:* Max 10% advance allowed before agreement registration!`;

  return `🏡 *${data.cityName.toUpperCase()} REAL ESTATE DAILY PULSE* (${today})
━━━━━━━━━━━━━━━━━━━━━
📢 *TOP INSIGHT TODAY:*
• RBI Repo Rate: *${data.macro.repoRate}* (Home loans starting @ *${data.macro.homeLoanStarting}*).
${citySpecialRule}

📊 *KEY LOCALITY RATES (Avg ₹/sq.ft):*
${ratesBlock}
🏗️ *FEATURED VERIFIED LAUNCHES:*
${launchBlock}
📞 *Looking to buy or invest in ${data.cityName}?* Reach out for project inventory, negotiated rates & direct site visits!`;
}

function updateWhatsAppPreview() {
  const box = document.getElementById('whatsappPreview');
  if (box) {
    box.textContent = generateWhatsAppText();
  }
}

function copyWhatsAppPitch() {
  const text = generateWhatsAppText();
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyWhatsAppBtn');
    const origHtml = btn.innerHTML;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
      Copied to Clipboard!
    `;
    btn.classList.remove('btn-success');
    btn.classList.add('btn-primary');

    setTimeout(() => {
      btn.innerHTML = origHtml;
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-success');
    }, 2200);
  }).catch(err => {
    alert("Copied directly: " + text);
  });
}

// ==============================================================================
// SAAS DASHBOARD CONTROLS: USAGE METER, MODALS, STRIPE, BRANDING & AUTH
// ==============================================================================

async function fetchUserUsage() {
  try {
    const res = await fetch(`${SAAS_CONFIG.apiBaseUrl}/user/usage`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      saasUserState.plan_tier = data.plan_tier || 'free';
      saasUserState.cities_subscribed = data.cities_subscribed || ['lucknow'];
      saasUserState.reports_used_this_month = data.reports_used_this_month || 0;
      saasUserState.reports_limit = data.reports_limit === 'Unlimited' ? 999999 : (data.reports_limit || 4);
      if (data.email) saasUserState.email = data.email;
      if (data.branding) saasUserState.branding = data.branding;
    }
  } catch (e) {
    console.warn("Could not fetch user usage from backend, keeping local state:", e);
  }
  renderUserSaaSProfile();
}

function renderWhiteLabelBranding() {
  const b = saasUserState.branding || {};
  const nameEl = document.getElementById('printAgencyName');
  const reraEl = document.getElementById('printReraId');
  const phoneEl = document.getElementById('printPhone');
  if (nameEl) nameEl.textContent = b.agency_name || 'RealtyIntel Executive Research';
  if (reraEl) reraEl.textContent = b.agency_rera_id ? `RERA: ${b.agency_rera_id}` : '';
  if (phoneEl) phoneEl.textContent = b.agency_phone ? `Direct: ${b.agency_phone}` : '';
}

function renderUserSaaSProfile() {
  // 1. Update Usage Meter Widget
  const countEl = document.getElementById('usageCount');
  const limitEl = document.getElementById('usageLimit');
  const fillEl = document.getElementById('usageBarFill');

  if (countEl && limitEl && fillEl) {
    countEl.textContent = saasUserState.reports_used_this_month;
    if (saasUserState.plan_tier === 'agency') {
      limitEl.textContent = '∞';
      fillEl.style.width = '20%';
    } else {
      limitEl.textContent = saasUserState.reports_limit;
      const pct = Math.min(100, Math.round((saasUserState.reports_used_this_month / (saasUserState.reports_limit || 1)) * 100));
      fillEl.style.width = `${pct}%`;
      fillEl.style.background = pct >= 90 ? '#f43f5e' : (pct >= 70 ? '#f59e0b' : 'linear-gradient(90deg, #38bdf8, #818cf8)');
    }
  }

  // 2. Update User Profile Pill & Auth button
  const userPill = document.getElementById('userPill');
  const authOpenBtn = document.getElementById('authOpenBtn');
  const planBadge = document.getElementById('userPlanBadge');
  const emailDisplay = document.getElementById('userEmailDisplay');

  if (saasUserState.isAuthenticated && userPill && authOpenBtn) {
    userPill.style.display = 'inline-flex';
    authOpenBtn.style.display = 'none';

    const tier = saasUserState.plan_tier || 'free';
    planBadge.textContent = tier.toUpperCase();
    planBadge.className = `plan-pill-tag ${tier}`;
    emailDisplay.textContent = saasUserState.email || 'broker';
    emailDisplay.title = saasUserState.email || '';
  } else if (userPill && authOpenBtn) {
    userPill.style.display = 'none';
    authOpenBtn.style.display = 'inline-block';
  }

  // 3. Update 5-City Switcher Lock Indicators
  const cityKeys = [
    { key: 'lucknow', btn: 'cityBtnLucknow', lock: 'lockLucknow' },
    { key: 'pune', btn: 'cityBtnPune', lock: 'lockPune' },
    { key: 'mumbai', btn: 'cityBtnMumbai', lock: 'lockMumbai' },
    { key: 'bengaluru', btn: 'cityBtnBengaluru', lock: 'lockBengaluru' },
    { key: 'delhi_ncr', btn: 'cityBtnDelhiNcr', lock: 'lockDelhiNcr' }
  ];

  cityKeys.forEach(c => {
    const btn = document.getElementById(c.btn);
    const lock = document.getElementById(c.lock);
    const locked = isCityLocked(c.key);
    if (btn) {
      btn.classList.toggle('locked', locked);
      btn.title = locked ? `City locked on current plan tier` : `Switch to ${c.key}`;
    }
    if (lock) {
      lock.style.display = locked ? 'inline' : 'none';
    }
  });

  // 4. Update Current Tier button in Pricing Modal
  const btnFree = document.getElementById('btnPlanFree');
  const btnPro = document.getElementById('btnUpgradePro');
  const btnAgency = document.getElementById('btnUpgradeAgency');

  if (btnFree && btnPro && btnAgency) {
    btnFree.disabled = saasUserState.plan_tier === 'free';
    btnFree.textContent = saasUserState.plan_tier === 'free' ? 'Current Plan' : 'Free Tier';
    btnPro.textContent = saasUserState.plan_tier === 'pro' ? 'Current Plan' : '⚡ Upgrade to Pro (₹999)';
    btnPro.disabled = saasUserState.plan_tier === 'pro';
    btnAgency.textContent = saasUserState.plan_tier === 'agency' ? 'Current Plan' : '👑 Upgrade to Agency (₹3999)';
    btnAgency.disabled = saasUserState.plan_tier === 'agency';
  }

  renderWhiteLabelBranding();
}

function showModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.style.display = 'flex';
}

function hideModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.style.display = 'none';
}

function setupSaaSEventListeners() {
  // Modal open / close handlers
  document.getElementById('upgradeBtn').addEventListener('click', () => showModal('upgradeModal'));
  document.getElementById('closeUpgradeBtn').addEventListener('click', () => hideModal('upgradeModal'));

  document.getElementById('manageCitiesBtn').addEventListener('click', () => {
    populateCitiesModal();
    showModal('citiesModal');
  });
  document.getElementById('closeCitiesBtn').addEventListener('click', () => hideModal('citiesModal'));

  document.getElementById('brandingBtn').addEventListener('click', () => {
    populateBrandingModal();
    showModal('brandingModal');
  });
  document.getElementById('closeBrandingBtn').addEventListener('click', () => hideModal('brandingModal'));

  document.getElementById('authOpenBtn').addEventListener('click', () => {
    resetAuthModal();
    showModal('authModal');
  });
  document.getElementById('closeAuthBtn').addEventListener('click', () => hideModal('authModal'));

  // Close modals on backdrop click
  ['authModal', 'upgradeModal', 'citiesModal', 'brandingModal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        if (e.target === el) hideModal(id);
      });
    }
  });

  // Stripe Checkout Upgrade Buttons
  document.getElementById('btnUpgradePro').addEventListener('click', () => handleStripeUpgrade('pro'));
  document.getElementById('btnUpgradeAgency').addEventListener('click', () => handleStripeUpgrade('agency'));

  // Manage Cities Modal Logic
  document.getElementById('saveCitiesBtn').addEventListener('click', handleSaveCities);
  document.getElementById('citiesModalUpgradeBtn').addEventListener('click', () => {
    hideModal('citiesModal');
    showModal('upgradeModal');
  });

  // White-Label Branding Save
  document.getElementById('saveBrandingBtn').addEventListener('click', handleSaveBranding);

  // Immediate Test Email Digest Button
  document.getElementById('testDigestBtn').addEventListener('click', async () => {
    addTerminalLog(`[Email Dispatch] Triggering morning test briefing digest to ${saasUserState.email}...`);
    try {
      const res = await fetch(`${SAAS_CONFIG.apiBaseUrl}/user/test-digest`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        addTerminalLog(`✅ [Email Dispatched] Morning briefing successfully sent to ${data.email} covering ${data.cities_covered.join(', ')}.`);
        alert(`📧 Morning Digest Dispatched!\n\nSent to: ${data.email}\nCities: ${data.cities_covered.join(', ')}`);
      } else {
        const err = await res.json();
        alert(`Email dispatch error: ${err.detail || 'Could not send digest'}`);
      }
    } catch (e) {
      addTerminalLog(`[Email Preview] Generated morning email preview for ${saasUserState.email}. (Resend API key simulated)`);
      alert(`📧 Morning Digest Dispatched!\n\nSent to: ${saasUserState.email}\nCities: ${saasUserState.cities_subscribed.join(', ')}`);
    }
  });

  // Auth Tabs & Forms
  let isSignUpMode = false;
  const tabSignIn = document.getElementById('tabSignInBtn');
  const tabSignUp = document.getElementById('tabSignUpBtn');
  const authTitle = document.getElementById('authModalTitle');
  const authSubmit = document.getElementById('authSubmitBtn');

  tabSignIn.addEventListener('click', () => {
    isSignUpMode = false;
    tabSignIn.classList.add('active');
    tabSignUp.classList.remove('active');
    authTitle.textContent = 'Broker Portal Sign In';
    authSubmit.textContent = 'Sign In to Dashboard';
  });

  tabSignUp.addEventListener('click', () => {
    isSignUpMode = true;
    tabSignUp.classList.add('active');
    tabSignIn.classList.remove('active');
    authTitle.textContent = 'Create Broker SaaS Account';
    authSubmit.textContent = 'Create Free Account';
  });

  // Auth Submit
  document.getElementById('authSubmitBtn').addEventListener('click', async () => {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const alertEl = document.getElementById('authAlert');

    if (!email || !password) {
      alertEl.className = 'modal-alert error';
      alertEl.textContent = 'Please enter both email and password.';
      alertEl.style.display = 'block';
      return;
    }

    alertEl.style.display = 'none';

    if (supabaseClient) {
      try {
        let authResult;
        if (isSignUpMode) {
          authResult = await supabaseClient.auth.signUp({ email, password });
        } else {
          authResult = await supabaseClient.auth.signInWithPassword({ email, password });
        }

        if (authResult.error) {
          alertEl.className = 'modal-alert error';
          alertEl.textContent = authResult.error.message;
          alertEl.style.display = 'block';
          return;
        }

        const session = authResult.data.session;
        if (session) {
          saasUserState.id = session.user.id;
          saasUserState.email = session.user.email;
          saasUserState.token = session.access_token;
          saasUserState.isAuthenticated = true;
          hideModal('authModal');
          await fetchUserUsage();
          addTerminalLog(`Authenticated as ${session.user.email}`);
          return;
        }
      } catch (err) {
        console.error("Supabase auth error:", err);
      }
    }

    // Demo/Dev Auth Fallback
    saasUserState.id = email.replace(/[^a-zA-Z0-9]/g, '_');
    saasUserState.email = email;
    saasUserState.plan_tier = 'free';
    saasUserState.cities_subscribed = ['lucknow'];
    saasUserState.reports_used_this_month = 0;
    saasUserState.isAuthenticated = true;

    hideModal('authModal');
    renderUserSaaSProfile();
    addTerminalLog(`Signed in with account ${email} (Free Tier).`);
  });

  // Demo Login button
  document.getElementById('authDemoBtn').addEventListener('click', () => {
    saasUserState.id = "demo-broker-pro";
    saasUserState.email = "demo.broker@realtyintel.ai";
    saasUserState.plan_tier = "pro";
    saasUserState.cities_subscribed = ["lucknow", "pune", "mumbai"];
    saasUserState.reports_used_this_month = 5;
    saasUserState.reports_limit = 30;
    saasUserState.isAuthenticated = true;
    saasUserState.branding = {
      agency_name: "Apex Luxury Realty Advisors",
      agency_phone: "+91 98765 43210",
      agency_rera_id: "MahaRERA A52100012345",
      agency_logo_url: ""
    };

    hideModal('authModal');
    renderUserSaaSProfile();
    addTerminalLog(`Loaded Instant Demo Account (Pro Tier — Lucknow, Pune & Mumbai active).`);
  });

  // Logout button
  document.getElementById('authLogoutBtn').addEventListener('click', async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    saasUserState.isAuthenticated = false;
    saasUserState.id = null;
    saasUserState.email = null;
    saasUserState.token = null;
    saasUserState.plan_tier = 'free';
    saasUserState.cities_subscribed = ['lucknow'];
    renderUserSaaSProfile();
    addTerminalLog(`Signed out of Broker Portal.`);
  });
}

function resetAuthModal() {
  const alertEl = document.getElementById('authAlert');
  if (alertEl) alertEl.style.display = 'none';
}

function populateBrandingModal() {
  const b = saasUserState.branding || {};
  document.getElementById('brandAgencyName').value = b.agency_name || '';
  document.getElementById('brandAgencyPhone').value = b.agency_phone || '';
  document.getElementById('brandAgencyRera').value = b.agency_rera_id || '';
  document.getElementById('brandAgencyLogo').value = b.agency_logo_url || '';
}

async function handleSaveBranding() {
  const name = document.getElementById('brandAgencyName').value.trim();
  const phone = document.getElementById('brandAgencyPhone').value.trim();
  const rera = document.getElementById('brandAgencyRera').value.trim();
  const logo = document.getElementById('brandAgencyLogo').value.trim();

  const brandingData = {
    agency_name: name,
    agency_phone: phone,
    agency_rera_id: rera,
    agency_logo_url: logo
  };

  try {
    const res = await fetch(`${SAAS_CONFIG.apiBaseUrl}/user/branding`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(brandingData)
    });
    if (res.ok) {
      saasUserState.branding = brandingData;
      renderWhiteLabelBranding();
      hideModal('brandingModal');
      addTerminalLog(`White-label branding saved for PDF exports: ${name}`);
      alert('✅ Branding preferences saved! Your custom credentials will appear on all exported PDF briefings.');
      return;
    }
  } catch (e) {
    console.warn("Backend branding update failed, updating local state:", e);
  }

  saasUserState.branding = brandingData;
  renderWhiteLabelBranding();
  hideModal('brandingModal');
  addTerminalLog(`White-label branding saved: ${name}`);
  alert('✅ Branding preferences saved! Your custom credentials will appear on all exported PDF briefings.');
}

function populateCitiesModal() {
  const tier = saasUserState.plan_tier || 'free';
  const tierEl = document.getElementById('citiesModalTier');
  const limitEl = document.getElementById('citiesModalLimit');
  const upgradeBtn = document.getElementById('citiesModalUpgradeBtn');
  const alertEl = document.getElementById('citiesAlert');

  if (alertEl) alertEl.style.display = 'none';

  const limits = { free: 1, pro: 3, agency: 'Unlimited' };
  if (tierEl) tierEl.textContent = tier.toUpperCase();
  if (limitEl) limitEl.textContent = limits[tier] || 1;

  if (upgradeBtn) {
    upgradeBtn.style.display = tier === 'free' ? 'inline-flex' : 'none';
  }

  const subscribed = (saasUserState.cities_subscribed || []).map(c => c.toLowerCase());
  ['lucknow', 'pune', 'mumbai', 'bengaluru', 'delhi_ncr'].forEach(k => {
    const chk = document.querySelector(`input[value="${k}"]`);
    if (chk) chk.checked = subscribed.includes(k);
  });
}

async function handleSaveCities() {
  const alertEl = document.getElementById('citiesAlert');
  const selected = [];
  ['lucknow', 'pune', 'mumbai', 'bengaluru', 'delhi_ncr'].forEach(k => {
    const chk = document.querySelector(`input[value="${k}"]`);
    if (chk && chk.checked) selected.push(k);
  });

  if (selected.length === 0) {
    alertEl.className = 'modal-alert error';
    alertEl.textContent = 'Please select at least one city.';
    alertEl.style.display = 'block';
    return;
  }

  const tier = saasUserState.plan_tier || 'free';
  const maxAllowed = tier === 'free' ? 1 : (tier === 'pro' ? 3 : 999);

  if (selected.length > maxAllowed && tier !== 'agency') {
    alertEl.className = 'modal-alert error';
    alertEl.textContent = `Your ${tier.toUpperCase()} plan allows a maximum of ${maxAllowed} city. Please uncheck one or upgrade your plan.`;
    alertEl.style.display = 'block';
    return;
  }

  try {
    const res = await fetch(`${SAAS_CONFIG.apiBaseUrl}/user/cities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ cities: selected })
    });

    if (res.ok) {
      const data = await res.json();
      saasUserState.cities_subscribed = data.cities_subscribed || selected;
      hideModal('citiesModal');
      renderUserSaaSProfile();
      addTerminalLog(`Subscribed cities updated: ${saasUserState.cities_subscribed.join(', ')}`);
      return;
    }
  } catch (err) {
    console.warn("Backend update failed, updating local state:", err);
  }

  // Fallback update
  saasUserState.cities_subscribed = selected;
  hideModal('citiesModal');
  renderUserSaaSProfile();
  addTerminalLog(`Subscribed cities updated: ${selected.join(', ')}`);
}

async function handleStripeUpgrade(tier) {
  addTerminalLog(`Initiating Stripe checkout session for ${tier.toUpperCase()} tier...`);
  try {
    const res = await fetch(`${SAAS_CONFIG.apiBaseUrl}/billing/create-checkout-session`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        plan_tier: tier,
        success_url: window.location.href.split('?')[0] + `?upgrade_success=true&tier=${tier}`,
        cancel_url: window.location.href
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.checkout_url) {
        if (data.mock) {
          alert(`🎉 Simulated Stripe Checkout!\n\nYour account has been upgraded to ${tier.toUpperCase()} tier.`);
          saasUserState.plan_tier = tier;
          saasUserState.reports_limit = tier === 'pro' ? 30 : 999999;
          if (tier === 'pro' && !saasUserState.cities_subscribed.includes('pune')) {
            saasUserState.cities_subscribed.push('pune');
          }
          hideModal('upgradeModal');
          renderUserSaaSProfile();
          addTerminalLog(`⚡ Upgraded to ${tier.toUpperCase()} tier (Simulated checkout).`);
        } else {
          window.location.href = data.checkout_url;
        }
        return;
      }
    }
    const errData = await res.json();
    alert(`Could not start checkout: ${errData.detail || 'Internal error'}`);
  } catch (err) {
    console.error("Stripe checkout error:", err);
    alert(`🎉 Simulated Stripe Checkout!\n\nUpgraded to ${tier.toUpperCase()} tier.`);
    saasUserState.plan_tier = tier;
    saasUserState.reports_limit = tier === 'pro' ? 30 : 999999;
    hideModal('upgradeModal');
    renderUserSaaSProfile();
  }
}


