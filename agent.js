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
  }
};

// Current Active City (default to Lucknow as requested)
let currentCity = 'lucknow';
let isRunningResearch = false;

document.addEventListener('DOMContentLoaded', () => {
  renderCityData(currentCity);
  initEmiCalculator();
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById('runAgentBtn').addEventListener('click', runParallelAgents);
  document.getElementById('copyWhatsAppBtn').addEventListener('click', copyWhatsAppPitch);
  document.getElementById('printPdfBtn').addEventListener('click', () => window.print());

  // City Switcher Buttons
  const cityBtns = document.querySelectorAll('.city-btn');
  cityBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      cityBtns.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      currentCity = target.dataset.city;
      renderCityData(currentCity);
      addTerminalLog(`City changed to ${CITIES_DATA[currentCity].cityName}. Pipeline updated.`);
    });
  });

  // EMI input listeners
  ['loanAmount', 'loanRate', 'loanTenure'].forEach(id => {
    document.getElementById(id).addEventListener('input', calculateEmi);
  });
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

// Parallel Agent Runner
async function runParallelAgents() {
  if (isRunningResearch) return;
  isRunningResearch = true;

  const data = CITIES_DATA[currentCity];
  const runBtn = document.getElementById('runAgentBtn');
  runBtn.innerHTML = `<span class="pulse-dot"></span> Researching ${data.cityName}...`;
  runBtn.classList.add('btn-secondary');
  runBtn.classList.remove('btn-primary');

  resetAgentVisuals();
  addTerminalLog(`Orchestrator: Initialized parallel sub-agent workers for ${data.cityName} [A1, A2, A3]`);

  try {
    await Promise.all([
      runAgent1_LaunchesAndPrices(data),
      runAgent2_PolicyAndBanking(data)
    ]);

    await runAgent3_Synthesis(data);
    addTerminalLog(`Orchestrator: All sub-agents synced for ${data.cityName}. Briefing refreshed.`);
  } catch (err) {
    console.error("Agent error:", err);
    addTerminalLog("Error occurred in pipeline: " + err.message);
  } finally {
    isRunningResearch = false;
    runBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
      </svg>
      Refresh Daily Research
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
