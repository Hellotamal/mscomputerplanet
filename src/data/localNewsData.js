/**
 * Local News & Industry Dispatch
 * Curated from Google News, The Assam Tribune, The Sentinel Assam, APDCL, and PIB
 * Covering Solar Clean Energy, IT Hardware & Banking Tech, and Barak Valley / Silchar regional developments.
 */

export const NEWS_CATEGORIES = {
  ALL: 'All Updates',
  SOLAR: 'Solar & Clean Energy',
  IT: 'IT & Banking Tech',
  LOCAL: 'Silchar & Barak Valley'
};

export const LOCAL_NEWS_DATA = [
  {
    id: 'news-1',
    category: 'Solar & Clean Energy',
    badge: 'Solar Boom',
    badgeColor: 'emerald',
    title: 'Over 1.10 Lakh Assam Households Receive "Zero Electricity Bills" Under PM Surya Ghar Solar Scheme',
    summary: 'Assam achieves milestone with over 1.80 lakh rooftop solar applications and 1.10 lakh homes recording zero net electricity bills via APDCL net-metering. Central subsidy of up to ₹78,000 credited via DBT directly to bank accounts.',
    source: 'The Assam Tribune / Google News',
    date: '18 Sep 2026',
    url: 'https://pmsuryaghar.gov.in',
    tag: 'APDCL Net Metering',
    isBreaking: true
  },
  {
    id: 'news-2',
    category: 'Silchar & Barak Valley',
    badge: 'Regional Governance',
    badgeColor: 'sky',
    title: 'Assam Secretariat Barak Valley Formally Operationalized in Silchar Housing 32 Departments',
    summary: 'In a landmark administrative decentralization, the Assam Government operationalizes the Barak Valley Secretariat in Silchar, providing high-speed digital public services for Cachar, Hailakandi, and Sribhumi.',
    source: 'The Sentinel Assam / Google News',
    date: '17 Sep 2026',
    url: 'https://cachar.gov.in',
    tag: 'Barak Valley',
    isBreaking: true
  },
  {
    id: 'news-3',
    category: 'Solar & Clean Energy',
    badge: 'AERC Directive',
    badgeColor: 'amber',
    title: 'AERC Directs APDCL to Process Rooftop Solar Net-Metering Applications Without Disruption',
    summary: 'The Assam Electricity Regulatory Commission mandates rapid grid synchronization for residential and commercial rooftop solar installations across Silchar and Barak Valley, safeguarding consumer energy banking.',
    source: 'SolarQuarter / Google News',
    date: '16 Sep 2026',
    url: 'https://www.apdcl.org',
    tag: 'Regulatory Notice',
    isBreaking: false
  },
  {
    id: 'news-4',
    category: 'IT & Banking Tech',
    badge: 'Banking IT SLA',
    badgeColor: 'blue',
    title: 'Barak Valley Banking Sector Mandates 99.8% Hardware Uptime & High-Speed Passbook Printer SLAs',
    summary: 'Punjab National Bank, Assam Gramin Bikash Bank, and post offices reinforce strict IT maintenance standards to ensure uninterrupted customer transaction counters across Cachar and Karimganj circles.',
    source: 'Financial & Regional Bureau / Google News',
    date: '15 Sep 2026',
    url: 'https://www.pnbindia.in',
    tag: 'Enterprise AMC',
    isBreaking: false
  },
  {
    id: 'news-5',
    category: 'Silchar & Barak Valley',
    badge: 'Connectivity',
    badgeColor: 'indigo',
    title: '₹24,000 Crore Shillong–Silchar High-Speed Corridor Project Accelerates Trade & Logistics Hub',
    summary: 'The landmark infrastructure project along with Badarpur–Silchar rail electrification transforms Barak Valley into a major commercial gateway for the Northeast and neighboring border trade routes.',
    source: 'PIB India / Google News',
    date: '14 Sep 2026',
    url: 'https://morth.nic.in',
    tag: 'Infrastructure',
    isBreaking: false
  },
  {
    id: 'news-6',
    category: 'Solar & Clean Energy',
    badge: 'Omnis EPC Partnership',
    badgeColor: 'emerald',
    title: 'M/S Computer Planet & Omnis Trades Ramp Up Free Rooftop Solar Feasibility Surveys in Silchar',
    summary: 'Official Channel & Solar EPC Consultant Partner M/S Computer Planet deploys certified technical survey teams for residential homes, tea gardens, and commercial complexes across a 100 KM radius.',
    source: 'Omnis Trades & Clean Tech Wire',
    date: '18 Sep 2026',
    url: 'https://omnistrades.in',
    tag: 'Local EPC Survey',
    isBreaking: false
  },
  {
    id: 'news-7',
    category: 'IT & Banking Tech',
    badge: 'GeM Procurement',
    badgeColor: 'purple',
    title: 'Southern Assam Colleges & Public Offices Expand GeM IT Hardware Procurement for Smart Labs',
    summary: 'Government e-Marketplace procurement drives influx of high-performance desktop labs, servers, and biometric surveillance systems across educational institutions in Cachar and Hailakandi.',
    source: 'Tech India Review / Google News',
    date: '13 Sep 2026',
    url: 'https://gem.gov.in',
    tag: 'GeM Compliance',
    isBreaking: false
  }
];
