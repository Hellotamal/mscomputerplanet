// ERP Local Storage and Initial Seed Data for M/S COMPUTER PLANET
import { 
  sha256, 
  DEFAULT_PIN_HASH, 
  encryptStorageData, 
  decryptStorageData, 
  sanitizeImportPayload 
} from './erpSecurity.js';

const STORAGE_KEY_PREFIX = "mcp_erp_";

export const INITIAL_TICKETS = [
  {
    id: "TCK-1001",
    clientName: "Punjab National Bank - Silchar Main Branch",
    contactPerson: "Branch IT Officer",
    phone: "+91 94350 12345",
    type: "Hardware Breakdown",
    priority: "Critical",
    assignedTo: "Resident Engineer - Debashis",
    status: "In Progress",
    reportedDate: "2026-09-16",
    description: "Counter #3 teller desktop power supply failure. SMPS replacement needed immediately.",
    resolution: "Buffer SMPS dispatched from Chincoorie office."
  },
  {
    id: "TCK-1002",
    clientName: "Indian Post - Cachar Head Post Office",
    contactPerson: "Postal Inspector",
    phone: "+91 98640 54321",
    type: "Printer Maintenance",
    priority: "High",
    assignedTo: "Service Tech - Rahul",
    status: "Resolved",
    reportedDate: "2026-09-15",
    description: "Passbook printer dot-matrix head alignment issue.",
    resolution: "Printhead cleaned and recalibrated. Running normally."
  },
  {
    id: "TCK-1003",
    clientName: "Saha Commercial Complex - Chincoorie",
    contactPerson: "Mr. B. Saha",
    phone: "+91 86380 99887",
    type: "Solar Inverter Diagnostic",
    priority: "Normal",
    assignedTo: "Solar Tech - Animesh",
    status: "Open",
    reportedDate: "2026-09-17",
    description: "5 kW Hybrid solar inverter showing Error 04 (battery communication check requested).",
    resolution: "Scheduled on-site battery specific gravity & BMS inspection."
  }
];

export const INITIAL_AMC_CONTRACTS = [
  {
    id: "AMC-2023-049",
    clientName: "Punjab National Bank - Silchar Circle Office & Branches",
    branchCount: 50,
    deviceCount: 543,
    annualValue: 685000,
    startDate: "2023-08-19",
    expiryDate: "2025-08-18",
    status: "Active",
    workOrderRef: "Hardware AMC/Temp/PO/033-2023",
    slaType: "Comprehensive (294 Desktops, 83 LaserJet, 46 Passbook, 74 Scanners, 46 Cash Receipt Printers)"
  },
  {
    id: "AMC-2024-012",
    clientName: "Indian Post - Cachar Division",
    branchCount: 18,
    deviceCount: 72,
    annualValue: 195000,
    startDate: "2024-01-10",
    expiryDate: "2025-01-09",
    status: "Active",
    workOrderRef: "IP/CCR/AMC/2024-25",
    slaType: "Non-Comprehensive + Routine Maintenance"
  },
  {
    id: "AMC-2024-034",
    clientName: "Assam Gramin Bikash Bank - Silchar Region",
    branchCount: 14,
    deviceCount: 56,
    annualValue: 160000,
    startDate: "2024-03-01",
    expiryDate: "2025-02-28",
    status: "Active",
    workOrderRef: "AGBB/SIL/AMC/2024",
    slaType: "Comprehensive Hardware & Peripherals"
  }
];

export const INITIAL_INVENTORY = [
  {
    id: "INV-001",
    name: "Crucial 16GB DDR4 3200MHz Desktop RAM",
    category: "IT Hardware",
    stock: 24,
    minStock: 8,
    costPrice: 2450,
    sellPrice: 3100,
    location: "Shelf A-1"
  },
  {
    id: "INV-002",
    name: "Kingston 512GB NVMe M.2 SSD",
    category: "IT Hardware",
    stock: 18,
    minStock: 6,
    costPrice: 2850,
    sellPrice: 3600,
    location: "Shelf A-2"
  },
  {
    id: "INV-003",
    name: "Frontech 450W ATX SMPS Power Supply",
    category: "IT Hardware",
    stock: 12,
    minStock: 5,
    costPrice: 750,
    sellPrice: 1150,
    location: "Shelf B-3"
  },
  {
    id: "INV-004",
    name: "D-Link 24-Port Gigabit Rackmount Switch",
    category: "Networking",
    stock: 5,
    minStock: 2,
    costPrice: 5200,
    sellPrice: 6800,
    location: "Rack C-1"
  },
  {
    id: "INV-005",
    name: "Mono PERC Bifacial Solar Panel 540W (Tier-1)",
    category: "Solar Energy",
    stock: 42,
    minStock: 15,
    costPrice: 12200,
    sellPrice: 15500,
    location: "Warehouse Bay 1"
  },
  {
    id: "INV-006",
    name: "5 kW Hybrid Smart Solar Inverter with Wi-Fi",
    category: "Solar Energy",
    stock: 4,
    minStock: 2,
    costPrice: 42000,
    sellPrice: 52500,
    location: "Warehouse Bay 2"
  },
  {
    id: "INV-007",
    name: "150Ah / 12V Deep Cycle Solar Tubular Battery",
    category: "Solar Energy",
    stock: 14,
    minStock: 6,
    costPrice: 13500,
    sellPrice: 16800,
    location: "Warehouse Bay 3"
  }
];

export const INITIAL_INVOICES = [
  {
    id: "INV-2024-089",
    invoiceDate: "2026-09-10",
    clientName: "Punjab National Bank - Circle Office Silchar",
    clientAddress: "Club Road, Silchar, Cachar, Assam - 788001",
    clientGst: "18AAACP2965C1Z1",
    items: [
      { desc: "Quarterly Hardware AMC Service (49 Branches)", hsn: "9987", qty: 1, rate: 121250 }
    ],
    gstRate: 18,
    status: "Paid"
  },
  {
    id: "INV-2024-090",
    invoiceDate: "2026-09-14",
    clientName: "Green Valley Tea Estate Management",
    clientAddress: "Lakhipur Road, Cachar, Assam - 788103",
    clientGst: "18AABCG1234F1Z8",
    items: [
      { desc: "3 kW Rooftop Solar PV Installation Turnkey", hsn: "8419", qty: 1, rate: 165000 },
      { desc: "Net-Metering Liasoning & Structure Hardware", hsn: "9954", qty: 1, rate: 15000 }
    ],
    gstRate: 12,
    status: "Sent"
  }
];

export const INITIAL_QUOTATIONS = [
  {
    id: "QT-2026-001",
    date: "2026-09-12",
    validUntil: "2026-10-12",
    clientName: "Punjab National Bank - Circle Office Silchar",
    contactPerson: "Senior Manager (IT & Operations)",
    clientPhone: "+91-9435012345",
    clientEmail: "co_silchar@pnb.co.in",
    clientAddress: "Club Road, Silchar, Cachar, Assam - 788001",
    clientGst: "18AAACP2965C1Z1",
    category: "Banking IT AMC",
    placeOfSupply: "Assam (18)",
    taxType: "intra",
    status: "Approved",
    items: [
      { desc: "Comprehensive Annual Maintenance Contract for 50 Branch Hardware (Desktops, Passbook Printers, LaserJets, Scanners)", hsn: "9987", qty: 4, unit: "Quarter", rate: 121250 },
      { desc: "Quarterly Preventive Maintenance, SMPS Standby & Consumables Inspection", hsn: "9987", qty: 4, unit: "Quarter", rate: 15000 }
    ],
    gstRate: 18,
    terms: "1. Payment 100% at the end of each completed quarter upon submission of branch visit verification sheets.\n2. Engineer response SLA within 2 to 4 hours across Silchar Circle.\n3. Defective components replacement warranty covered under comprehensive AMC terms.\n4. Quote validity 30 days from date of issuance.",
    notes: "Approved by Circle Office procurement committee. Ready for contract renewal."
  },
  {
    id: "QT-2026-002",
    date: "2026-09-15",
    validUntil: "2026-10-15",
    clientName: "Barak Valley Medical Center",
    contactPerson: "Dr. K. N. Roy (Administrator)",
    clientPhone: "+91-9864077654",
    clientEmail: "admin@bvmcsilchar.com",
    clientAddress: "National Highway 6, Meherpur, Silchar - 788015",
    clientGst: "18AABCB9876E1Z4",
    category: "Solar Rooftop EPC",
    placeOfSupply: "Assam (18)",
    taxType: "intra",
    status: "Sent",
    items: [
      { desc: "10 kWp Grid-Tied Rooftop Solar Power Plant with 540W Mono PERC Bifacial Modules", hsn: "8419", qty: 1, unit: "Set", rate: 480000 },
      { desc: "10 kW 3-Phase Solar On-Grid Inverter with Remote Cloud Monitoring", hsn: "8504", qty: 1, unit: "No", rate: 75000 },
      { desc: "Hot-Dip Galvanized Mounting Structure, AC/DC Distribution Boxes & Surge Protection", hsn: "7308", qty: 1, unit: "Set", rate: 45000 },
      { desc: "APDCL Net-Metering Liasoning, Testing & Grid Synchronisation Charges", hsn: "9954", qty: 1, unit: "Job", rate: 25000 }
    ],
    gstRate: 12,
    terms: "1. 30% advance with formal work order, 50% on delivery of solar panels and inverters, 20% post testing and APDCL net-meter commissioning.\n2. 25-year manufacturer performance warranty on solar panels; 5-year replacement warranty on inverter.\n3. Quotation valid for 30 days.",
    notes: "Site survey completed. Structural stability verified for hospital main building rooftop."
  },
  {
    id: "QT-2026-003",
    date: "2026-09-16",
    validUntil: "2026-10-16",
    clientName: "Cachar Rural Development Council",
    contactPerson: "Executive Officer",
    clientPhone: "+91-9435099112",
    clientEmail: "crdc.cachar@gov.in",
    clientAddress: "Court Road, Silchar, Assam - 788001",
    clientGst: "18GOVC0001D1Z9",
    category: "CCTV & Security",
    placeOfSupply: "Assam (18)",
    taxType: "intra",
    status: "Draft",
    items: [
      { desc: "Hikvision 4MP IP Network IR Dome Cameras (Ultra Low-Light)", hsn: "8525", qty: 16, unit: "Nos", rate: 3200 },
      { desc: "16-Channel 4K NVR with 8-Port PoE Switch", hsn: "8525", qty: 1, unit: "No", rate: 18500 },
      { desc: "Seagate SkyHawk 4TB Surveillance Grade Hard Drive", hsn: "8471", qty: 2, unit: "Nos", rate: 8500 },
      { desc: "Cat6 Outdoor Pure Copper STP Cable Roll (305m)", hsn: "8544", qty: 2, unit: "Rolls", rate: 7800 },
      { desc: "Professional Installation, Conduit Piping, Rack Mounting & Testing", hsn: "9987", qty: 1, unit: "Lot", rate: 16000 }
    ],
    gstRate: 18,
    terms: "1. 50% mobilization advance, balance on completion and customer sign-off.\n2. 1-Year free on-site comprehensive warranty with quarterly maintenance checkups.\n3. Quote valid for 15 days.",
    notes: "Tender estimate prepared as per municipal council guidelines."
  }
];

export const INITIAL_SOLAR_PROJECTS = [
  {
    id: "SOL-01",
    customer: "Dr. B. R. Dutta Residence",
    location: "Tarapur, Silchar",
    capacityKw: 3.5,
    systemType: "On-Grid Rooftop",
    totalAmount: 210000,
    status: "APDCL Application Submitted",
    surveyCompleted: true,
    targetDate: "2026-09-30",
    notes: "RCC Terrace 350 sq ft available. Net-meter application filed with Silchar Electrical Division."
  },
  {
    id: "SOL-02",
    customer: "Barak Cold Storage Commercial Unit",
    location: "Meherpur, Silchar",
    capacityKw: 15,
    systemType: "Hybrid Solar with LiFePO4 Storage",
    totalAmount: 980000,
    status: "Installation In Progress",
    surveyCompleted: true,
    targetDate: "2026-10-15",
    notes: "Tin shed mounting structure installed. 28 x 540W Bifacial modules being wired."
  }
];

export const INITIAL_LEADS = [
  {
    id: "LEAD-2026-001",
    clientName: "Green Valley Tea Estate Hospital",
    contactPerson: "Dr. Samarjit Deb (Medical Supdt)",
    phone: "+91 94350 44321",
    email: "hospital@greenvalleytea.com",
    city: "Dwarbond, Cachar",
    address: "NH-54, Dwarbond Tea Estate, Cachar - 788113",
    category: "Solar Rooftop EPC",
    source: "IndiaMART B2B Lead",
    stage: "BOQ & Quotation Sent",
    priority: "High",
    estimatedValue: 650000,
    requirement: "12 kWp On-Grid Solar Plant with APDCL Net Metering to offset heavy diesel generator & monthly power bills.",
    assignedTo: "Animesh Das (Solar Lead)",
    nextFollowUp: "2026-09-22",
    createdAt: "2026-09-12T10:30:00.000Z",
    notes: "Site survey completed. Roof structure strong RCC with zero shadow. 12 kW quote sent at ₹6.5 Lakh with subsidy assistance."
  },
  {
    id: "LEAD-2026-002",
    clientName: "Assam Gramin Vikash Bank (Regional Office)",
    contactPerson: "Nirmalendu Paul (Chief Manager Operations)",
    phone: "+91 94351 88920",
    email: "ro_cachar@agvb.co.in",
    city: "Silchar",
    address: "Central Road, Silchar - 788001",
    category: "Banking IT AMC",
    source: "Client Referral",
    stage: "Negotiation & Review",
    priority: "High",
    estimatedValue: 380000,
    requirement: "Annual Maintenance Contract for 28 Branch Computer Systems, Passbook Printers, SMPS & Network Switches across Barak Valley.",
    assignedTo: "Debashis Roy (IT Lead)",
    nextFollowUp: "2026-09-20",
    createdAt: "2026-09-14T11:15:00.000Z",
    notes: "Executive committee meeting scheduled for rate finalization. PNB SLA reference shared."
  },
  {
    id: "LEAD-2026-003",
    clientName: "Roy & Singha Associates Chartered Accountants",
    contactPerson: "CA Anupam Singha",
    phone: "+91 98640 12890",
    email: "anupam@roysingha.in",
    city: "Hailakandi",
    address: "Station Road, Hailakandi - 788151",
    category: "Solar Rooftop EPC",
    source: "Website Quote / Ticket",
    stage: "Site Survey & Feasibility",
    priority: "Medium",
    estimatedValue: 240000,
    requirement: "4 kW Hybrid Rooftop Solar with Lithium Battery Backup under PM Surya Ghar Muft Bijli Yojana (₹78,000 subsidy).",
    assignedTo: "Animesh Das (Solar Lead)",
    nextFollowUp: "2026-09-23",
    createdAt: "2026-09-16T14:45:00.000Z",
    notes: "Site survey scheduled for Hailakandi commercial chamber. Electricity bill avg ₹4,800/mo."
  },
  {
    id: "LEAD-2026-004",
    clientName: "Silchar District Sessions Court",
    contactPerson: "Administrative Officer",
    phone: "+91 94350 77612",
    email: "cachar.court@nic.in",
    city: "Silchar",
    address: "Court Complex, District HQ, Silchar - 788001",
    category: "Hardware Sales & GeM Procurement",
    source: "GeM Govt Portal",
    stage: "New Lead",
    priority: "High",
    estimatedValue: 420000,
    requirement: "GeM procurement tender for 10x HP Commercial Core i5 Desktops, High-speed Duplex Laser Scanners & Heavy-duty UPS.",
    assignedTo: "Tamal Kanti Sinha (Proprietor)",
    nextFollowUp: "2026-09-21",
    createdAt: "2026-09-17T09:00:00.000Z",
    notes: "Tender specifications downloaded from GeM portal. Bid preparation in progress."
  },
  {
    id: "LEAD-2026-005",
    clientName: "Maa Tara Cold Storage & Processing",
    contactPerson: "Dipankar Choudhury",
    phone: "+91 86380 99234",
    email: "maataracold@gmail.com",
    city: "Badarpur",
    address: "Industrial Estate, Badarpur, Karimganj - 788806",
    category: "Solar Rooftop EPC",
    source: "Justdial Directory",
    stage: "Contacted & Qualifying",
    priority: "Medium",
    estimatedValue: 1200000,
    requirement: "25 kW Industrial High-Capacity Solar Plant with APDCL 11kV connection.",
    assignedTo: "Animesh Das (Solar Lead)",
    nextFollowUp: "2026-09-24",
    createdAt: "2026-09-17T16:20:00.000Z",
    notes: "Spoke with owner over phone. Sent initial feasibility document and APDCL guidelines via WhatsApp."
  }
];

export const INITIAL_ENGINEERING_DESIGNS = [
  {
    id: "ENG-2026-001",
    clientName: "Green Valley Tea Estate Hospital",
    projectTitle: "12 kWp On-Grid Solar Rooftop with APDCL Net Metering",
    systemType: "On-Grid Net Metering",
    category: "Solar Rooftop EPC",
    city: "Dwarbond, Cachar",
    leadId: "LEAD-2026-001",
    status: "Approved",
    monthlyBill: 9800,
    monthlyKwh: 1250,
    roofAreaSqFt: 1400,
    roofType: "RCC Flat Roof",
    recommendedKw: 12.0,
    requiredAreaSqFt: 1200,
    dailyUnitsGen: 48,
    monthlySavings: 9600,
    annualSavings: 115200,
    subsidyEligible: 0,
    estimatedCost: 648000,
    netClientCost: 648000,
    paybackYears: 4.2,
    co2OffsetTonnes25Yr: 310,
    boqItems: [
      { item: "550W Waaree Mono PERC Bifacial Solar Modules", qty: 22, unit: "Nos", rate: 14200, amount: 312400 },
      { item: "Growatt 12kW 3-Phase On-Grid Solar Inverter (WiFi/IP65)", qty: 1, unit: "Set", rate: 88000, amount: 88000 },
      { item: "High-Rise HDG Hot Dip Galvanized Structure (150 km/h wind rated)", qty: 1, unit: "Lot", rate: 72000, amount: 72000 },
      { item: "DC Distribution Box (1000V DC SPD, 32A DC Fuses, IP66)", qty: 2, unit: "Sets", rate: 8500, amount: 17000 },
      { item: "AC Distribution Box (32A 4-Pole MCB, Class-B Type 2 SPD)", qty: 1, unit: "Set", rate: 9500, amount: 9500 },
      { item: "Solar DC Cable 4 sq mm TUV Certified Copper (Polycab)", qty: 180, unit: "Mtr", rate: 58, amount: 10440 },
      { item: "AC Armoured Cable 4C x 10 sq mm Copper", qty: 45, unit: "Mtr", rate: 290, amount: 13050 },
      { item: "Chemical Earthing Pits with Copper Bonded Electrodes (3 Pits)", qty: 3, unit: "Sets", rate: 6800, amount: 20400 },
      { item: "ESE Early Streamer Lightning Arrester with 10m GI Mast", qty: 1, unit: "Set", rate: 16500, amount: 16500 },
      { item: "APDCL Bi-Directional Net Metering Approvals & Liaisoning", qty: 1, unit: "Job", rate: 28000, amount: 28000 },
      { item: "Installation, Civil Foundation, String Testing & Commissioning", qty: 1, unit: "Lot", rate: 60710, amount: 60710 }
    ],
    engineer: "Animesh Das (Solar Technical Lead)",
    createdDate: "2026-09-13",
    notes: "Site survey confirmed zero south shadow. 22 modules arranged in 2 strings of 11 modules each."
  },
  {
    id: "ENG-2026-002",
    clientName: "Roy & Singha Associates Chartered Accountants",
    projectTitle: "4 kWp Hybrid Solar System with Lithium Battery",
    systemType: "Hybrid with Battery",
    category: "Solar Rooftop EPC",
    city: "Hailakandi",
    leadId: "LEAD-2026-003",
    status: "Approved",
    monthlyBill: 4600,
    monthlyKwh: 580,
    roofAreaSqFt: 550,
    roofType: "Tin Shed Structure",
    recommendedKw: 4.0,
    requiredAreaSqFt: 400,
    dailyUnitsGen: 16.5,
    monthlySavings: 3960,
    annualSavings: 47520,
    subsidyEligible: 78000,
    estimatedCost: 285000,
    netClientCost: 207000,
    paybackYears: 3.8,
    co2OffsetTonnes25Yr: 105,
    boqItems: [
      { item: "540W Tata Power Solar Mono PERC Modules", qty: 8, unit: "Nos", rate: 13800, amount: 110400 },
      { item: "Livguard / Microtek 5kVA Hybrid Solar Inverter (MPPT 48V)", qty: 1, unit: "Set", rate: 46000, amount: 46000 },
      { item: "48V 100Ah LiFePO4 Lithium Battery with BMS (5 kWh Storage)", qty: 1, unit: "Unit", rate: 72000, amount: 72000 },
      { item: "Aluminium Tin Shed Rail Mounting Clamps & EPDM Washers", qty: 1, unit: "Set", rate: 14500, amount: 14500 },
      { item: "ACDB & DCDB Protection Enclosure", qty: 1, unit: "Set", rate: 9500, amount: 9500 },
      { item: "Solar Cable 4 sq mm + AC Connection Kit", qty: 60, unit: "Mtr", rate: 65, amount: 3900 },
      { item: "Dual Chemical Earthing Pit Kit & Lightening Spike", qty: 2, unit: "Sets", rate: 6500, amount: 13000 },
      { item: "PM Surya Ghar National Portal Subsidy Registration & EPC", qty: 1, unit: "Job", rate: 15700, amount: 15700 }
    ],
    engineer: "Animesh Das (Solar Technical Lead)",
    createdDate: "2026-09-16",
    notes: "Residential rooftop qualifying for maximum ₹78,000 central DBT subsidy under PM Surya Ghar."
  },
  {
    id: "ENG-2026-003",
    clientName: "Assam Gramin Vikash Bank (Regional Office)",
    projectTitle: "Barak Valley 28-Branch IT Infrastructure Refresh BOQ",
    systemType: "IT Network & Hardware",
    category: "Banking IT AMC",
    city: "Silchar",
    leadId: "LEAD-2026-002",
    status: "Under Review",
    monthlyBill: 0,
    monthlyKwh: 0,
    roofAreaSqFt: 0,
    roofType: "N/A - IT Rack",
    recommendedKw: 0,
    requiredAreaSqFt: 0,
    dailyUnitsGen: 0,
    monthlySavings: 0,
    annualSavings: 0,
    subsidyEligible: 0,
    estimatedCost: 385000,
    netClientCost: 385000,
    paybackYears: 0,
    co2OffsetTonnes25Yr: 0,
    boqItems: [
      { item: "HP ProDesk 400 G7 SFF Desktop (Core i5 10th Gen, 16GB RAM, 512GB NVMe, Win 11 Pro)", qty: 6, unit: "Units", rate: 42500, amount: 255000 },
      { item: "HP LaserJet Pro M404dn Heavy Duty Banking Laser Printer", qty: 2, unit: "Units", rate: 26500, amount: 53000 },
      { item: "D-Link 24-Port Gigabit Layer-2 Managed Rackmount Switch (DGS-1210)", qty: 2, unit: "Units", rate: 11500, amount: 23000 },
      { item: "APC Smart-UPS 3kVA Online UPS with Extended External Battery Pack", qty: 1, unit: "Set", rate: 42000, amount: 42000 },
      { item: "Cat6 FTP Copper Cabling, 9U Wall Mount Server Rack & Termination", qty: 1, unit: "Lot", rate: 12000, amount: 12000 }
    ],
    engineer: "Debashis Roy (IT Lead)",
    createdDate: "2026-09-17",
    notes: "Hardware upgrades for Regional Office clearing and CBS transaction terminals."
  }
];

export const INITIAL_ITSM_DATA = {
  serviceCatalog: [
    { id: 'SRV-01', title: 'New Workstation / Laptop Provisioning', category: 'Hardware', slaHours: 24, description: 'Complete setup of Core i5/i7 PC, SSD imaging, Windows 11 Pro, domain join, and banking printer drivers.' },
    { id: 'SRV-02', title: 'Banking Passbook / LaserJet Printer Repair', category: 'Hardware', slaHours: 4, description: 'Fix paper jam, roller replacement, printhead realignment, or logic board troubleshooting.' },
    { id: 'SRV-03', title: 'Tally Prime Multi-User / Cloud Connection', category: 'Software', slaHours: 4, description: 'Configure Tally Gateway server, port 9000 firewall rules, and client license syncing.' },
    { id: 'SRV-04', title: 'Corporate Email Password Reset & 2FA', category: 'Email & Access', slaHours: 2, description: 'Secure password reset, MFA token regeneration, and Outlook configuration.' },
    { id: 'SRV-05', title: 'Network Switch / LAN Port Activation', category: 'Network', slaHours: 4, description: 'Patch panel crimping, Cat6 continuity testing, and VLAN tag assignment.' },
    { id: 'SRV-06', title: 'Solar Inverter WiFi Logger & Cloud Setup', category: 'Solar IT', slaHours: 8, description: 'Reconfigure inverter Datalogger IP, Wi-Fi antenna pairing, and monitoring cloud portal.' }
  ],
  hardware: [
    { id: 'HW-101', tag: 'MCP-PC-042', make: 'HP', model: 'ProDesk 400 G7 SFF', type: 'Desktop PC', serial: 'HP-SN-8829104', location: 'PNB Silchar Main Branch (Teller 2)', ip: '192.168.10.42', cpu: 'Core i5 10th Gen', ram: '16GB DDR4', storage: '512GB NVMe SSD', os: 'Windows 11 Pro OEM', purchaseDate: '2023-04-10', warrantyUntil: '2026-04-09', status: 'Active', user: 'Bank Teller 2' },
    { id: 'HW-102', tag: 'MCP-PRN-018', make: 'HP', model: 'LaserJet Pro M404dn', type: 'Laser Printer', serial: 'VNC8821092', location: 'PNB Tarapur Branch', ip: '192.168.12.25', cpu: 'N/A', ram: '256MB', storage: 'N/A', os: 'Firmware 2024.1', purchaseDate: '2022-11-15', warrantyUntil: '2025-11-14', status: 'Active', user: 'Branch Operations' },
    { id: 'HW-103', tag: 'MCP-PB-009', make: 'Epson', model: 'PLQ-30 Passbook Printer', type: 'Passbook Printer', serial: 'EP-PLQ-44910', location: 'Assam Gramin Vikash Bank Silchar', ip: 'USB Direct', cpu: 'N/A', ram: 'N/A', storage: 'N/A', os: 'Epson ESC/P2', purchaseDate: '2023-08-20', warrantyUntil: '2026-08-19', status: 'Active', user: 'Passbook Kiosk' },
    { id: 'HW-104', tag: 'MCP-SRV-001', make: 'Dell', model: 'PowerEdge T150 Tower Server', type: 'Database Server', serial: 'DELL-TAG-7X892', location: 'M/S Computer Planet HQ Server Room', ip: '192.168.1.5', cpu: 'Intel Xeon E-2314 4-Core', ram: '32GB ECC DDR4', storage: '2x 2TB SATA Enterprise RAID-1', os: 'Windows Server 2022 Standard', purchaseDate: '2023-01-12', warrantyUntil: '2028-01-11', status: 'Active', user: 'Central Tally / ERP Host' },
    { id: 'HW-105', tag: 'MCP-LAP-023', make: 'Lenovo', model: 'ThinkPad E14 Gen 4', type: 'Laptop', serial: 'LN-TP-992144', location: 'Field Tech Deployment', ip: 'DHCP WiFi', cpu: 'Core i5 12th Gen', ram: '16GB DDR4', storage: '512GB SSD', os: 'Windows 11 Pro', purchaseDate: '2023-09-01', warrantyUntil: '2026-08-31', status: 'Active', user: 'Debashis Roy (IT Lead)' }
  ],
  software: [
    { id: 'SW-01', name: 'Tally Prime Gold (Multi-User)', category: 'ERP / Accounting', publisher: 'Tally Solutions', licenseKey: '7829-9941-2041-8819', totalSeats: 10, allocatedSeats: 8, expiryDate: '2027-03-31', renewalCost: 18000, status: 'Active', host: 'MCP-SRV-001' },
    { id: 'SW-02', name: 'Microsoft 365 Business Standard', category: 'Productivity & Office', publisher: 'Microsoft', licenseKey: 'MS-O365-CP-SUB-2026', totalSeats: 15, allocatedSeats: 14, expiryDate: '2026-11-30', renewalCost: 28500, status: 'Active', host: 'Cloud SaaS' },
    { id: 'SW-03', name: 'Seqrite Endpoint Security Enterprise', category: 'Cybersecurity / Antivirus', publisher: 'Quick Heal Technologies', licenseKey: 'SEQR-AS-8819-2201-9944', totalSeats: 50, allocatedSeats: 46, expiryDate: '2026-12-15', renewalCost: 32000, status: 'Active', host: 'Central Cloud Console' },
    { id: 'SW-04', name: 'Windows 11 Pro 64-Bit OEM', category: 'Operating System', publisher: 'Microsoft', licenseKey: 'W11P-XXXX-XXXX-99544', totalSeats: 30, allocatedSeats: 28, expiryDate: 'Perpetual', renewalCost: 0, status: 'Active', host: 'Client PCs' }
  ],
  network: [
    { id: 'NET-01', name: 'HQ Core Gateway Router', make: 'MikroTik', model: 'RB4011iGS+RM', ip: '192.168.1.1', subnet: '255.255.255.0', location: 'Server Rack Silchar', isp: 'BSNL Bharat Fibre (300 Mbps Static)', status: 'Online', uptime: '99.94%' },
    { id: 'NET-02', name: 'HQ Distribution Switch', make: 'D-Link', model: 'DGS-1210-28 24-Port Gigabit Smart', ip: '192.168.1.2', subnet: '255.255.255.0', location: 'Rack Unit 3', isp: 'Internal LAN', status: 'Online', uptime: '100.0%' },
    { id: 'NET-03', name: 'Secondary Failover WAN', make: 'TP-Link', model: 'Archer C80 Dual-WAN', ip: '192.168.2.1', subnet: '255.255.255.0', location: 'Operations Room', isp: 'Airtel Xstream Fibre (200 Mbps Backup)', status: 'Standby / Online', uptime: '99.82%' },
    { id: 'NET-04', name: 'PNB Tarapur Branch Router', make: 'Cisco', model: 'C1111-4P Integrated Services', ip: '10.14.88.1', subnet: '255.255.255.240', location: 'Tarapur Branch PNB', isp: 'RailTel MPLS VPN', status: 'Online', uptime: '99.98%' }
  ],
  email: [
    { id: 'EML-01', name: 'Tamal Roy (Proprietor)', email: 'admin@mscomputerplanet.com', provider: 'Google Workspace', quotaUsedGb: 8.4, quotaTotalGb: 30, mfaEnabled: true, status: 'Active', role: 'Super Admin' },
    { id: 'EML-02', name: 'Customer Support Desk', email: 'support@mscomputerplanet.com', provider: 'Google Workspace', quotaUsedGb: 14.2, quotaTotalGb: 30, mfaEnabled: true, status: 'Active', role: 'Support Group' },
    { id: 'EML-03', name: 'Debashis Roy (IT Service)', email: 'service@mscomputerplanet.com', provider: 'Google Workspace', quotaUsedGb: 4.8, quotaTotalGb: 30, mfaEnabled: true, status: 'Active', role: 'Field Engineering' },
    { id: 'EML-04', name: 'Accounts & Billing Dept', email: 'accounts@mscomputerplanet.com', provider: 'Google Workspace', quotaUsedGb: 6.1, quotaTotalGb: 30, mfaEnabled: true, status: 'Active', role: 'Finance' },
    { id: 'EML-05', name: 'Solar Project Engineering', email: 'solar@mscomputerplanet.com', provider: 'Google Workspace', quotaUsedGb: 3.5, quotaTotalGb: 30, mfaEnabled: false, status: 'Active', role: 'Solar Technical' }
  ],
  domains: [
    { id: 'DOM-01', domain: 'mscomputerplanet.com', registrar: 'GoDaddy India', expiryDate: '2027-08-14', sslIssuer: "Let's Encrypt Authority X3", sslExpiryDate: '2026-12-28', nameservers: 'ns1.digitalocean.com, ns2.digitalocean.com', ipTarget: '159.89.164.22', httpStatus: 200, autoRenew: true, notes: 'Primary business domain & client portal.' },
    { id: 'DOM-02', domain: 'computerplanet.org.in', registrar: 'Hostinger India', expiryDate: '2027-02-20', sslIssuer: 'DigiCert Global Root CA', sslExpiryDate: '2027-01-15', nameservers: 'ns1.dns-parking.com', ipTarget: '31.170.160.10', httpStatus: 200, autoRenew: true, notes: 'Redirects to main domain.' }
  ],
  access: [
    { id: 'ACC-01', system: 'Central Server WinServer RDP', hostIp: '192.168.1.5:3389', username: 'Administrator', accessLevel: 'Root / Full Admin', mfaRequired: true, lastRotated: '2026-08-01', status: 'Secured' },
    { id: 'ACC-02', system: 'MikroTik RouterOS WinBox Console', hostIp: '192.168.1.1:8291', username: 'mcp_netadmin', accessLevel: 'Network Admin', mfaRequired: true, lastRotated: '2026-07-15', status: 'Secured' },
    { id: 'ACC-03', system: 'Seqrite Cloud Antivirus Portal', hostIp: 'https://cloud.seqrite.com', username: 'secadmin@mscomputerplanet.com', accessLevel: 'Security Admin', mfaRequired: true, lastRotated: '2026-09-01', status: 'Secured' },
    { id: 'ACC-04', system: 'Hikvision HQ CCTV NVR Console', hostIp: '192.168.1.200:8000', username: 'admin', accessLevel: 'Camera Supervisor', mfaRequired: false, lastRotated: '2026-06-10', status: 'Active' }
  ],
  vendors: [
    { id: 'VND-01', name: 'HP India Sales & Service', category: 'Desktops & Printers OEM', tollFree: '1800 258 7170', email: 'in.contact@hp.com', silcharHub: 'Trident Computers, Central Road, Silchar', rmaPortal: 'https://support.hp.com/in-en', accountManager: 'Subrata Sen (+91 98300 22109)', notes: 'Direct ASP authorization for Barak Valley banking call dispatches.' },
    { id: 'VND-02', name: 'Dell Technologies India', category: 'Enterprise Servers & Storage', tollFree: '1800 425 4026', email: 'india_support@dell.com', silcharHub: 'Guwahati Regional Spare Depot (24-48 Hr dispatch)', rmaPortal: 'https://www.dell.com/support', accountManager: 'Ranjan Barua (+91 94350 88210)', notes: 'Next Business Day (NBD) on-site warranty partner.' },
    { id: 'VND-03', name: 'D-Link India Ltd', category: 'Networking & Switches', tollFree: '1800 233 0000', email: 'helpdesk@dlink.co.in', silcharHub: 'G.S. Road Guwahati / Kolkata Hub', rmaPortal: 'https://dlink.co.in/support', accountManager: 'Amitava Ghosh (+91 98311 44102)', notes: 'Lifetime warranty replacement on DGS managed switch series.' },
    { id: 'VND-04', name: 'Schneider Electric / APC India', category: 'Online UPS & Power Infrastructure', tollFree: '1800 103 0011', email: 'customercare.in@se.com', silcharHub: 'Aurotech Power, Premtola, Silchar', rmaPortal: 'https://www.apc.com/in/en/support', accountManager: 'Pranab Das (+91 94351 77123)', notes: 'Battery calibration and Smart-UPS inverter PCB replacement.' }
  ],
  amcPm: [
    { id: 'PM-2026-01', branch: 'PNB Silchar Main Branch (005100)', circle: 'Silchar', engineer: 'Debashis Roy', scheduledQuarter: 'Q3-2026 (Jul-Sep)', scheduledDate: '2026-09-10', completionDate: '2026-09-10', status: 'Completed', tasks: ['Blower dusting of 8 PCs', 'LaserJet fuser inspection', 'Antivirus signature 2026.09 update', 'UPS battery voltage 13.6V check'], branchStampReceived: true },
    { id: 'PM-2026-02', branch: 'PNB Tarapur Branch (082900)', circle: 'Silchar', engineer: 'Debashis Roy', scheduledQuarter: 'Q3-2026 (Jul-Sep)', scheduledDate: '2026-09-14', completionDate: '2026-09-14', status: 'Completed', tasks: ['Passbook printer head lubrication', 'Switch port cable tagging', 'OS disk cleanup'], branchStampReceived: true },
    { id: 'PM-2026-03', branch: 'PNB Hailakandi Main Branch (021100)', circle: 'Hailakandi', engineer: 'Rahul Sharma', scheduledQuarter: 'Q3-2026 (Jul-Sep)', scheduledDate: '2026-09-22', completionDate: '', status: 'Scheduled', tasks: ['Full hardware audit of 12 branch units', 'SMPS capacitor check', 'High-speed scanner glass cleaning'], branchStampReceived: false },
    { id: 'PM-2026-04', branch: 'PNB Karimganj Town Branch (034200)', circle: 'Karimganj', engineer: 'Debashis Roy', scheduledQuarter: 'Q3-2026 (Jul-Sep)', scheduledDate: '2026-09-26', completionDate: '', status: 'Scheduled', tasks: ['Quarterly PM servicing for 14 terminal assets', 'LAN ping test to Circle Gateway'], branchStampReceived: false }
  ]
};

export const DEFAULT_MENU_MODIFICATION_POLICY = {
  strictAdminOnly: true, // When true, all create, edit, and delete modifications in all menus require Admin credentials
  allowedStaffModules: [], // List of menu IDs where designated staff are permitted to edit if strictAdminOnly is toggled
  menuPolicies: {
    dashboard: { id: 'dashboard', name: 'Executive Overview', dept: 'Core', adminOnly: true, description: 'Command Center & KPI Metrics' },
    crm: { id: 'crm', name: '1. CRM & Omnichannel Leads', dept: 'Core', adminOnly: true, description: 'Lead Enquiries & Kanban Pipeline' },
    quotations: { id: 'quotations', name: '2. Sales & Quotations', dept: 'Solar', adminOnly: true, description: 'Commercial & Solar GST Quotations' },
    engineering: { id: 'engineering', name: '3. Engineering & Solar Pre-Sales', dept: 'Solar', adminOnly: true, description: 'Solar Sizing Calculator & BOQ' },
    projects: { id: 'projects', name: '4. Projects & EPC Execution', dept: 'Solar', adminOnly: true, description: 'Solar EPC Milestones & Handover' },
    procurement: { id: 'procurement', name: '5. Hardware Procurement & POs', dept: 'IT', adminOnly: true, description: 'PRs, RFQs, POs & QC GRN' },
    inventory: { id: 'inventory', name: '6. Multi-Depot Warehouses', dept: 'Solar', adminOnly: true, description: '3 Depots, Stocks & Serials' },
    vendors: { id: 'vendors', name: '7. IT Vendors & GeM Directory', dept: 'IT', adminOnly: true, description: 'OEM Directory & GeM Suppliers' },
    invoices: { id: 'invoices', name: '8. Finance & GST Invoicing', dept: 'Core', adminOnly: true, description: 'Tax Invoices & Credit Notes' },
    accounts: { id: 'accounts', name: 'Accounts Ledger & Daybook', dept: 'Core', adminOnly: true, description: 'Vouchers, Inflows & Outflows' },
    tickets: { id: 'tickets', name: '9. AMC Service & Tickets', dept: 'IT', adminOnly: true, description: '2-4 Hr SLA Banking Support' },
    amc: { id: 'amc', name: 'Banking AMC Contracts (50 Branches)', dept: 'IT', adminOnly: true, description: 'Annual Maintenance Contracts' },
    clients: { id: 'clients', name: '10. Asset Management & Directory', dept: 'IT', adminOnly: true, description: 'All Enrolled Clients & Directory' },
    pnb_assets: { id: 'pnb_assets', name: 'PNB 50-Branch Hardware Matrix', dept: 'IT', adminOnly: true, description: '543 Banking Hardware Assets' },
    hrms: { id: 'hrms', name: '11. Staff HRMS & Payroll', dept: 'Core', adminOnly: true, description: 'Attendance, Leaves & Salary Slips' },
    itsm: { id: 'itsm', name: '12. IT Support / ITSM (11 Tools)', dept: 'IT', adminOnly: true, description: 'IT Helpdesk, Domains, Networks' },
    documents: { id: 'documents', name: '13. DMS Compliance Vault', dept: 'Solar', adminOnly: true, description: 'APDCL Sanctions & Test Reports' },
    customer_portal: { id: 'customer_portal', name: '14a. Customer Portal Desk', dept: 'IT', adminOnly: true, description: 'Client Self-Service & Logging' },
    employee_portal: { id: 'employee_portal', name: '14b. Employee Staff Desk', dept: 'Core', adminOnly: true, description: 'Staff Geo Punch & DA Register' },
    workflow: { id: 'workflow', name: '15. Workflow Approvals & Sign-off', dept: 'Core', adminOnly: true, description: 'PO & Expense Authorization' },
    mis: { id: 'mis', name: '16. MIS & Intelligence Cockpit', dept: 'Core', adminOnly: true, description: 'Aging, Margins & Board Review' },
    users: { id: 'users', name: '17. Staff & Roles RBAC', dept: 'Core', adminOnly: true, description: 'Credentials & Role Governance' },
    reports: { id: 'reports', name: 'Reports & Export Centre', dept: 'Core', adminOnly: true, description: 'Audits & Excel/PDF Exports' },
    settings: { id: 'settings', name: 'Data Backup & System Settings', dept: 'Core', adminOnly: true, description: 'Backups, SHA-256 PINs, Policy' }
  }
};

export function canModifyMenu(currentUser, menuId = null) {
  if (!currentUser) return false;
  const isAdmin = currentUser.username?.toLowerCase() === 'admin' || 
    (currentUser.role && currentUser.role.toLowerCase().includes('admin'));
  if (isAdmin) return true;

  try {
    const policy = loadErpData('menu_modification_policy', DEFAULT_MENU_MODIFICATION_POLICY);
    if (policy.strictAdminOnly !== false) {
      return false; // Global lock: strictly admin only
    }
    if (menuId && policy.menuPolicies && policy.menuPolicies[menuId]) {
      return !policy.menuPolicies[menuId].adminOnly;
    }
  } catch {
    return false;
  }
  return false;
}

export const ROLE_DEFINITIONS = [
  {
    role: "Administrator (Full Access)",
    description: "Complete control over all business operations, financials, staff, and system governance.",
    defaultPermissions: [
      "dashboard", "crm", "quotations", "engineering", "projects", "procurement", 
      "inventory", "vendors", "invoices", "accounts", "amc", "tickets", "pnb_assets", 
      "clients", "hrms", "itsm", "documents", "customer_portal", "employee_portal", 
      "workflow", "mis", "reports", "users", "settings"
    ]
  },
  {
    role: "Resident IT Service Engineer",
    description: "Resolves banking hardware breakdowns, checks branch assets, and tracks spare parts.",
    defaultPermissions: ["dashboard", "engineering", "projects", "itsm", "tickets", "pnb_assets", "inventory", "quotations", "documents", "employee_portal", "hrms"]
  },
  {
    role: "Accounts & GST Billing Officer",
    description: "Generates official tax invoices, manages AMC billing schedules, and oversees commercial collections.",
    defaultPermissions: ["dashboard", "crm", "quotations", "invoices", "accounts", "procurement", "vendors", "amc", "inventory", "documents", "workflow", "hrms"]
  },
  {
    role: "Solar Project Technical Lead",
    description: "Coordinates rooftop & commercial solar installations, feasibility surveys, and EPC execution.",
    defaultPermissions: ["dashboard", "crm", "engineering", "projects", "procurement", "inventory", "vendors", "quotations", "documents", "employee_portal", "tickets", "hrms"]
  },
  {
    role: "Store & Inventory Supervisor",
    description: "Maintains hardware buffer stocks, monitors reorder levels, and manages warehouse parts.",
    defaultPermissions: ["dashboard", "procurement", "inventory", "vendors", "tickets", "pnb_assets", "workflow", "employee_portal"]
  },
  {
    role: "Support Desk & Customer Coordinator",
    description: "Logs incoming client requests, creates job tickets, and tracks resolution SLAs.",
    defaultPermissions: ["dashboard", "crm", "quotations", "engineering", "itsm", "tickets", "amc", "customer_portal", "documents"]
  }
];

export const INITIAL_USERS = [
  {
    id: "USR-001",
    name: "Tamal (Proprietor)",
    username: "admin",
    password: "admin@99544",
    role: "Administrator (Full Access)",
    pin: "99544",
    phone: "+91-8638083712",
    region: "Silchar HQ & All Circles",
    status: "Active",
    permissions: ["dashboard", "pnb_assets", "tickets", "amc", "inventory", "invoices", "quotations", "solar", "users", "hrms", "settings"]
  },
  {
    id: "USR-002",
    name: "Debashis Roy",
    username: "debashis",
    password: "debashis@99544",
    role: "Resident IT Service Engineer",
    pin: "99544",
    phone: "+91-9435012345",
    region: "PNB Silchar & Cachar Circle",
    status: "Active",
    permissions: ["dashboard", "tickets", "pnb_assets", "inventory", "quotations"]
  },
  {
    id: "USR-003",
    name: "Priyanka Paul",
    username: "priyanka",
    password: "priyanka@99544",
    role: "Accounts & GST Billing Officer",
    pin: "99544",
    phone: "+91-9864054321",
    region: "Silchar Central Office",
    status: "Active",
    permissions: ["dashboard", "invoices", "quotations", "amc", "inventory"]
  },
  {
    id: "USR-004",
    name: "Animesh Das",
    username: "animesh",
    password: "animesh@99544",
    role: "Solar Project Technical Lead",
    pin: "99544",
    phone: "+91-8638099887",
    region: "Barak Valley Solar Projects",
    status: "Active",
    permissions: ["dashboard", "solar", "quotations", "inventory", "tickets"]
  }
];

// Helper functions for LocalStorage management (Hardened with Obfuscated/Encrypted Payload Storage)
export function loadErpData(key, fallback) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!saved) return fallback;
    const parsed = decryptStorageData(saved);
    if (parsed === null || parsed === undefined) return fallback;
    if (key === "users" && Array.isArray(parsed)) {
      // Upgrade any legacy default pins to 99544 and ensure password exists
      return parsed.map(u => {
        let updated = { ...u };
        if (u.pin === "1234" || u.pin === "2233" || u.pin === "3344" || u.pin === "4455") {
          updated.pin = "99544";
        }
        if (!updated.password) {
          updated.password = `${(updated.username || 'user')}@99544`;
        }
        return updated;
      });
    }
    return parsed;
  } catch (err) {
    console.error("Failed to load ERP data for", key, err);
    return fallback;
  }
}

export function saveErpData(key, data) {
  try {
    const payload = encryptStorageData(data);
    localStorage.setItem(STORAGE_KEY_PREFIX + key, payload);
  } catch (err) {
    console.error("Failed to save ERP data for", key, err);
  }
}

export async function getErpPinHash() {
  const saved = localStorage.getItem(STORAGE_KEY_PREFIX + "auth_pin_hash");
  if (saved) return saved;
  // Legacy migration check: if plaintext pin was stored previously
  const oldPlain = localStorage.getItem(STORAGE_KEY_PREFIX + "auth_pin");
  if (oldPlain) {
    const hashed = await sha256(oldPlain);
    localStorage.setItem(STORAGE_KEY_PREFIX + "auth_pin_hash", hashed);
    localStorage.removeItem(STORAGE_KEY_PREFIX + "auth_pin");
    return hashed;
  }
  return DEFAULT_PIN_HASH;
}

export function getErpPin() {
  const saved = localStorage.getItem(STORAGE_KEY_PREFIX + "auth_pin");
  if (!saved || saved === "1234") return "99544";
  return saved;
}

export async function setErpPin(newPin) {
  const hashed = await sha256(newPin);
  localStorage.setItem(STORAGE_KEY_PREFIX + "auth_pin_hash", hashed);
  localStorage.removeItem(STORAGE_KEY_PREFIX + "auth_pin");
}

// -------------------------------------------------------------
// 2-STEP GATE AUTHENTICATION: STEP 1 (TERMINAL ACCESS PIN)
// -------------------------------------------------------------
export async function verifyTerminalPinAsync(enteredPin) {
  if (!enteredPin) return { success: false, message: "Please enter Access PIN." };
  const inputHash = await sha256(enteredPin);
  const masterPinHash = await getErpPinHash();
  const users = loadErpData("users", INITIAL_USERS);

  // 1. Check against master PIN / default 99544
  if (inputHash === DEFAULT_PIN_HASH || inputHash === masterPinHash || enteredPin === "99544") {
    return { success: true, message: "Terminal Access Granted." };
  }

  // 2. Check if entered PIN belongs to any active staff user
  for (const u of users) {
    if (u.status === "Suspended") continue;
    if (u.pinHash && u.pinHash === inputHash) return { success: true, message: "Terminal Access Granted." };
    if (u.pin) {
      const uHash = await sha256(u.pin);
      if (uHash === inputHash || u.pin === enteredPin) {
        return { success: true, message: "Terminal Access Granted." };
      }
    }
  }

  return { success: false, message: "Invalid Terminal Access PIN. Access denied." };
}

// -------------------------------------------------------------
// 2-STEP GATE AUTHENTICATION: STEP 2 (USER ID & PASSWORD)
// -------------------------------------------------------------
export async function authenticateUserCredentialsAsync(username, password) {
  if (!username || !password) {
    return { success: false, message: "Please enter both User ID and Password." };
  }

  const cleanUser = username.trim().toLowerCase();
  const inputPassHash = await sha256(password);
  const users = loadErpData("users", INITIAL_USERS);

  // Generic anti-enumeration error message
  const genericError = "Invalid User ID or Password. Access denied.";

  const user = users.find(u => 
    (u.username && u.username.toLowerCase() === cleanUser) || 
    (u.id && u.id.toLowerCase() === cleanUser)
  );

  if (!user) {
    return { success: false, message: genericError };
  }

  if (user.status === "Suspended") {
    return { success: false, message: "This account has been suspended. Please contact Administrator." };
  }

  // Verify password with salted SHA-256
  let isPasswordValid = false;

  if (user.passwordHash) {
    isPasswordValid = (user.passwordHash === inputPassHash);
  } else if (user.password) {
    const userPassHash = await sha256(user.password);
    isPasswordValid = (userPassHash === inputPassHash || user.password === password);
  }

  // Fallback defaults for initial setups
  if (!isPasswordValid) {
    if (cleanUser === "admin" && (password === "admin@99544" || password === "Admin@99544" || password === "99544" || password === "admin123")) {
      isPasswordValid = true;
    } else if (password === `${cleanUser}@99544` || password === "99544") {
      isPasswordValid = true;
    }
  }

  if (!isPasswordValid) {
    return { success: false, message: genericError };
  }

  return { success: true, user };
}

// -------------------------------------------------------------
// USERNAME LOOKUP & ACCOUNT RECOVERY
// -------------------------------------------------------------
export async function lookupUserAccountAsync(phoneOrName) {
  if (!phoneOrName || !phoneOrName.trim()) {
    return { success: false, message: "Please enter your registered phone number or full name." };
  }
  const clean = phoneOrName.trim().toLowerCase().replace(/\s+/g, '');
  const users = loadErpData("users", INITIAL_USERS);
  
  const matches = users.filter(u => {
    if (u.status === "Suspended") return false;
    const cleanPhone = (u.phone || '').replace(/\D/g, '');
    const cleanQuery = clean.replace(/\D/g, '');
    if (cleanQuery && cleanPhone.includes(cleanQuery)) return true;
    const cleanUName = (u.name || '').toLowerCase().replace(/\s+/g, '');
    return cleanUName.includes(clean);
  });

  if (matches.length === 0) {
    return { success: false, message: "No active user account found matching this phone number or name." };
  }

  return {
    success: true,
    accounts: matches.map(u => ({
      username: u.username,
      name: u.name,
      role: u.role,
      phone: u.phone || 'N/A'
    }))
  };
}

// -------------------------------------------------------------
// RESET PASSWORD (WITH TERMINAL SECURITY PIN VERIFICATION)
// -------------------------------------------------------------
export async function resetUserPasswordAsync(username, newPassword, authPin) {
  if (!username || !newPassword) {
    return { success: false, message: "Please provide your User ID and new password." };
  }
  if (!authPin) {
    return { success: false, message: "Please provide the Terminal Security PIN to authorize password reset." };
  }
  if (newPassword.length < 6) {
    return { success: false, message: "New password must be at least 6 characters long." };
  }

  // 1. Verify Terminal Security PIN
  const pinCheck = await verifyTerminalPinAsync(authPin);
  if (!pinCheck.success) {
    return { success: false, message: "Invalid Terminal Security PIN. Authorization denied." };
  }

  const cleanUser = username.trim().toLowerCase();
  const users = loadErpData("users", INITIAL_USERS);
  const userIndex = users.findIndex(u => 
    (u.username && u.username.toLowerCase() === cleanUser) ||
    (u.id && u.id.toLowerCase() === cleanUser)
  );

  if (userIndex === -1) {
    return { success: false, message: `No user found with User ID '${username}'.` };
  }

  const user = users[userIndex];
  if (user.status === "Suspended") {
    return { success: false, message: "This account has been suspended. Please contact Administrator." };
  }

  const newHash = await sha256(newPassword);
  const updatedUser = {
    ...user,
    password: newPassword,
    passwordHash: newHash,
    lastPasswordReset: new Date().toISOString()
  };

  const updatedUsers = [...users];
  updatedUsers[userIndex] = updatedUser;
  saveErpData("users", updatedUsers);

  recordAuditLog(
    "PASSWORD_RESET",
    "Security",
    `Password reset successfully for User ID '${user.username}' (${user.name}).`,
    user
  );

  return { 
    success: true, 
    message: "Password has been reset successfully! You can now log in with your new password.",
    user: updatedUser 
  };
}

// -------------------------------------------------------------
// REGISTER / CREATE NEW STAFF USER (WITH AUTHORIZATION PIN)
// -------------------------------------------------------------
export async function registerNewUserAsync(userData, authPin) {
  const { name, username, password, phone, role, region, pin } = userData;

  if (!name || !name.trim()) {
    return { success: false, message: "Please enter Full Name." };
  }
  if (!username || !username.trim()) {
    return { success: false, message: "Please enter desired Username / User ID." };
  }
  if (!password || password.length < 6) {
    return { success: false, message: "Password must be at least 6 characters long." };
  }
  if (!authPin) {
    return { success: false, message: "Please provide Terminal Security PIN to authorize account creation." };
  }

  // 1. Verify Terminal PIN
  const pinCheck = await verifyTerminalPinAsync(authPin);
  if (!pinCheck.success) {
    return { success: false, message: "Invalid Terminal PIN. Only authorized personnel can create ERP accounts." };
  }

  const cleanUser = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (cleanUser.length < 3) {
    return { success: false, message: "Username must be at least 3 alphanumeric characters (letters, numbers, underscores)." };
  }

  const users = loadErpData("users", INITIAL_USERS);
  
  // Check if username already exists
  if (users.some(u => u.username && u.username.toLowerCase() === cleanUser)) {
    return { success: false, message: `Username '${cleanUser}' is already taken. Please choose another username.` };
  }

  const chosenRole = role || ROLE_DEFINITIONS[1].role;
  const roleObj = ROLE_DEFINITIONS.find(r => r.role === chosenRole) || ROLE_DEFINITIONS[1];

  const userPin = pin && pin.trim() ? pin.trim() : "99544";
  const passHash = await sha256(password);
  const pinHash = await sha256(userPin);

  const newUser = {
    id: `USR-${String(users.length + 1).padStart(3, '0')}`,
    name: name.trim(),
    username: cleanUser,
    password: password,
    passwordHash: passHash,
    role: chosenRole,
    pin: userPin,
    pinHash: pinHash,
    phone: phone ? phone.trim() : "",
    region: region ? region.trim() : "Silchar & Cachar Circle",
    status: "Active",
    permissions: roleObj.defaultPermissions || ["dashboard", "tickets", "inventory"],
    createdAt: new Date().toISOString()
  };

  const updatedUsers = [...users, newUser];
  saveErpData("users", updatedUsers);

  recordAuditLog(
    "USER_REGISTRATION",
    "Users",
    `New staff user account created: '${cleanUser}' (${newUser.name}) with role '${chosenRole}'.`,
    newUser
  );

  return {
    success: true,
    message: `Account for '${cleanUser}' created successfully! You can now log in.`,
    user: newUser
  };
}

// Legacy single-pin authentication method preserved for backwards compatibility
export async function authenticateErpUserAsync(enteredPin) {
  const inputHash = await sha256(enteredPin);
  const masterPinHash = await getErpPinHash();
  const users = loadErpData("users", INITIAL_USERS);

  // 1. Check against salted master PIN hash or default PIN hash
  if (inputHash === DEFAULT_PIN_HASH || inputHash === masterPinHash || enteredPin === "99544") {
    const adminUser = users.find(u => u.role.includes("Admin") && u.status !== "Suspended") || {
      id: "USR-001",
      name: "Tamal (Proprietor)",
      username: "admin",
      role: "Administrator (Full Access)",
      pin: "99544",
      password: "admin@99544",
      permissions: ["dashboard", "pnb_assets", "tickets", "amc", "inventory", "invoices", "quotations", "solar", "users", "hrms", "settings"]
    };
    return { success: true, user: adminUser };
  }

  // 2. Check if matches any specific staff user
  for (const u of users) {
    let matches = false;
    if (u.pinHash) {
      matches = (u.pinHash === inputHash);
    } else if (u.pin) {
      const uHash = await sha256(u.pin);
      matches = (uHash === inputHash || u.pin === enteredPin);
    }
    if (matches) {
      if (u.status === "Suspended") {
        return { success: false, message: "This staff user account is currently suspended. Please contact Administrator." };
      }
      return { success: true, user: u };
    }
  }

  return { success: false, message: "Invalid Access PIN. Access denied." };
}

export function authenticateErpUser(enteredPin) {
  const users = loadErpData("users", INITIAL_USERS);
  if (enteredPin === "99544") {
    const adminUser = users.find(u => u.role.includes("Admin") && u.status !== "Suspended") || {
      id: "USR-001",
      name: "Tamal (Proprietor)",
      username: "admin",
      role: "Administrator (Full Access)",
      pin: "99544",
      password: "admin@99544",
      permissions: ["dashboard", "pnb_assets", "tickets", "amc", "inventory", "invoices", "quotations", "solar", "users", "hrms", "settings"]
    };
    return { success: true, user: adminUser };
  }
  const matchedUser = users.find(u => u.pin === enteredPin);
  if (matchedUser) {
    if (matchedUser.status === "Suspended") {
      return { success: false, message: "This staff user account is currently suspended. Please contact Administrator." };
    }
    return { success: true, user: matchedUser };
  }
  return { success: false, message: "Invalid Access PIN. Access denied." };
}

export const INITIAL_EMPLOYEES = [
  {
    id: "EMP-101",
    name: "Debashis Roy",
    designation: "Senior Resident IT Hardware Engineer",
    department: "Banking AMC & IT Infrastructure",
    employmentType: "Full-time Permanent",
    joiningDate: "2022-04-10",
    phone: "+91-9435012345",
    email: "debashis.it@mscomputerplanet.com",
    address: "Tarapur, Silchar, Cachar - 788003",
    assignedCircle: "PNB Silchar 50 Branches & Currency Chest",
    status: "Active",
    monthlySalary: 28000,
    dailyAllowance: 250,
    bankDetails: {
      bankName: "Punjab National Bank",
      accountNo: "0743000100987654",
      ifsc: "PUNB0074300",
      upi: "debashis@pnb"
    },
    attendance: {
      totalDays: 26,
      presentDays: 25,
      fieldVisits: 18,
      leavesTaken: 1,
      todayStatus: "Field Duty (PNB Silchar Main)"
    }
  },
  {
    id: "EMP-102",
    name: "Priyanka Paul",
    designation: "Senior Accounts & GST Billing Officer",
    department: "Accounts, Finance & Compliance",
    employmentType: "Full-time Permanent",
    joiningDate: "2023-01-15",
    phone: "+91-9864054321",
    email: "priyanka.accounts@mscomputerplanet.com",
    address: "Meherpur, Silchar, Cachar - 788015",
    assignedCircle: "Central Business Office",
    status: "Active",
    monthlySalary: 24000,
    dailyAllowance: 100,
    bankDetails: {
      bankName: "State Bank of India",
      accountNo: "30876543210",
      ifsc: "SBIN0000183",
      upi: "priyanka@sbi"
    },
    attendance: {
      totalDays: 26,
      presentDays: 26,
      fieldVisits: 2,
      leavesTaken: 0,
      todayStatus: "Present (Head Office)"
    }
  },
  {
    id: "EMP-103",
    name: "Animesh Das",
    designation: "Solar Installation Project Lead",
    department: "Solar & Renewable Energy",
    employmentType: "Full-time Permanent",
    joiningDate: "2023-06-01",
    phone: "+91-8638099887",
    email: "animesh.solar@mscomputerplanet.com",
    address: "Chincoorie Road, Silchar - 788007",
    assignedCircle: "Barak Valley Solar Sites",
    status: "Active",
    monthlySalary: 26000,
    dailyAllowance: 300,
    bankDetails: {
      bankName: "Assam Gramin Vikash Bank",
      accountNo: "718900456789",
      ifsc: "PUNB0RRBAGB",
      upi: "animesh@upi"
    },
    attendance: {
      totalDays: 26,
      presentDays: 24,
      fieldVisits: 20,
      leavesTaken: 2,
      todayStatus: "Field Duty (Barak Cold Storage)"
    }
  },
  {
    id: "EMP-104",
    name: "Rahul Barman",
    designation: "Field Service Technician (Printers & Peripherals)",
    department: "Banking AMC & IT Infrastructure",
    employmentType: "Full-time",
    joiningDate: "2024-02-12",
    phone: "+91-9435123456",
    email: "rahul.tech@mscomputerplanet.com",
    address: "Hailakandi Road, Silchar - 788005",
    assignedCircle: "Hailakandi & Karimganj Branches",
    status: "Active",
    monthlySalary: 18000,
    dailyAllowance: 200,
    bankDetails: {
      bankName: "Punjab National Bank",
      accountNo: "0743000100456123",
      ifsc: "PUNB0074300",
      upi: "rahul@okaxis"
    },
    attendance: {
      totalDays: 26,
      presentDays: 25,
      fieldVisits: 22,
      leavesTaken: 1,
      todayStatus: "Field Duty (Hailakandi PNB)"
    }
  }
];

export const INITIAL_LEAVES = [
  {
    id: "LEV-101",
    empId: "EMP-101",
    employeeName: "Debashis Roy",
    leaveType: "Casual Leave",
    startDate: "2026-09-22",
    endDate: "2026-09-23",
    days: 2,
    reason: "Family ceremony at Hailakandi hometown",
    status: "Approved",
    appliedDate: "2026-09-15"
  },
  {
    id: "LEV-102",
    empId: "EMP-103",
    employeeName: "Animesh Das",
    leaveType: "Sick Leave",
    startDate: "2026-09-18",
    endDate: "2026-09-18",
    days: 1,
    reason: "Seasonal viral checkup",
    status: "Pending",
    appliedDate: "2026-09-17"
  }
];

export const INITIAL_PAYROLL = [
  {
    id: "PAY-2026-08-01",
    empId: "EMP-101",
    employeeName: "Debashis Roy",
    designation: "Senior Resident IT Hardware Engineer",
    month: "August 2026",
    basic: 20000,
    hra: 5000,
    fieldAllowance: 3000,
    incentive: 2000,
    grossSalary: 30000,
    deductions: 1000,
    netSalary: 29000,
    status: "Paid",
    paidDate: "2026-09-02",
    paymentMode: "Bank Transfer (NEFT/PNB)"
  },
  {
    id: "PAY-2026-08-02",
    empId: "EMP-102",
    employeeName: "Priyanka Paul",
    designation: "Senior Accounts & GST Billing Officer",
    month: "August 2026",
    basic: 18000,
    hra: 4000,
    fieldAllowance: 1000,
    incentive: 1000,
    grossSalary: 24000,
    deductions: 500,
    netSalary: 23500,
    status: "Paid",
    paidDate: "2026-09-02",
    paymentMode: "Bank Transfer (NEFT/SBI)"
  },
  {
    id: "PAY-2026-08-03",
    empId: "EMP-103",
    employeeName: "Animesh Das",
    designation: "Solar Installation Project Lead",
    month: "August 2026",
    basic: 18000,
    hra: 5000,
    fieldAllowance: 3000,
    incentive: 2500,
    grossSalary: 28500,
    deductions: 500,
    netSalary: 28000,
    status: "Paid",
    paidDate: "2026-09-02",
    paymentMode: "Bank Transfer (AGVB)"
  },
  {
    id: "PAY-2026-08-04",
    empId: "EMP-104",
    employeeName: "Rahul Barman",
    designation: "Field Service Technician",
    month: "August 2026",
    basic: 14000,
    hra: 2500,
    fieldAllowance: 1500,
    incentive: 1000,
    grossSalary: 19000,
    deductions: 500,
    netSalary: 18500,
    status: "Paid",
    paidDate: "2026-09-02",
    paymentMode: "Bank Transfer (NEFT/PNB)"
  }
];

export const INITIAL_FIELD_VISITS = [
  {
    id: "VST-2026-001",
    date: "2026-09-17",
    empId: "EMP-101",
    employeeName: "Debashis Roy",
    branch: "PNB Circle Office Silchar (Club Road)",
    activity: "Preventive Hardware AMC Maintenance & SMPS Check",
    coords: "24.8333, 92.7789",
    time: "10:30 AM",
    status: "Verified On-Site",
    remarks: "Checked 8 desktops in credit section. Replaced SMPS fan on unit 4."
  },
  {
    id: "VST-2026-002",
    date: "2026-09-17",
    empId: "EMP-104",
    employeeName: "Rahul Barman",
    branch: "PNB Hailakandi Main Branch",
    activity: "Passbook Printer Servicing & Sensor Cleaning",
    coords: "24.6850, 92.5630",
    time: "12:15 PM",
    status: "Verified On-Site",
    remarks: "Ribbon cartridge replaced, test passbook print clean."
  },
  {
    id: "VST-2026-003",
    date: "2026-09-16",
    empId: "EMP-103",
    employeeName: "Animesh Das",
    branch: "Barak Cold Storage Solar Installation",
    activity: "Solar Rooftop EPC Structural Inverter Inspection",
    coords: "24.8115, 92.7950",
    time: "02:45 PM",
    status: "Verified On-Site",
    remarks: "DC wiring inspection done. Ready for APDCL inspection."
  }
];

export const INITIAL_CLIENTS = [
  // AMC Clients
  {
    id: "CLI-AMC-001",
    name: "Punjab National Bank (PNB) - Silchar Circle",
    category: "AMC",
    leadSource: "GeM Govt Portal",
    contactPerson: "Circle IT Officer / AGM",
    phone: "+91 94350 12345",
    email: "circle.silchar@pnb.co.in",
    address: "Circle Office, Club Road, Silchar, Cachar, Assam - 788001",
    contractType: "Comprehensive Annual Maintenance Contract",
    branchesCount: 50,
    assetsCount: 543,
    contractValue: 685000,
    startDate: "2023-08-19",
    expiryDate: "2025-08-18",
    status: "Active",
    hasBranchMatrix: true,
    matrixType: "pnb_assets",
    notes: "50 branch network across Barak Valley (Desktops, Passbook Printers, LaserJet, Scanners, Cash Receipt Printers)."
  },
  {
    id: "CLI-AMC-002",
    name: "Indian Post - Cachar Postal Division",
    category: "AMC",
    leadSource: "GeM Govt Portal",
    contactPerson: "Senior Superintendent of Post Offices",
    phone: "+91 98640 54321",
    email: "do.cachar@indiapost.gov.in",
    address: "Head Post Office Complex, Park Road, Silchar - 788001",
    contractType: "Preventative Maintenance & Counter Hardware",
    branchesCount: 18,
    assetsCount: 72,
    contractValue: 195000,
    startDate: "2024-01-10",
    expiryDate: "2025-01-09",
    status: "Active",
    notes: "Counter terminals, passbook printers & weigh-scale interfaces across 18 sub-post offices."
  },
  {
    id: "CLI-AMC-003",
    name: "Assam Gramin Bikash Bank (AGBB)",
    category: "AMC",
    contactPerson: "Regional Operations Head",
    phone: "+91 94350 77665",
    email: "ro.silchar@agbb.co.in",
    address: "Regional Office, Ukilpatty, Silchar - 788001",
    contractType: "Branch IT Hardware & Network AMC",
    branchesCount: 14,
    assetsCount: 56,
    contractValue: 160000,
    startDate: "2024-03-01",
    expiryDate: "2025-02-28",
    status: "Active",
    notes: "14 branches in Cachar and Hailakandi districts."
  },
  {
    id: "CLI-AMC-004",
    name: "Cachar College Silchar (Computer Dept & Lab)",
    category: "AMC",
    contactPerson: "Lab In-charge & Systems Administrator",
    phone: "+91 94351 88990",
    email: "it.lab@cacharcollege.ac.in",
    address: "College Road, Silchar - 788001",
    contractType: "Academic Lab Annual Maintenance",
    branchesCount: 2,
    assetsCount: 38,
    contractValue: 85000,
    startDate: "2024-04-01",
    expiryDate: "2025-03-31",
    status: "Active",
    notes: "BCA Computer Lab 1 & 2 desktops, switches, and laser printers."
  },

  // Sales Clients
  {
    id: "CLI-SLS-001",
    name: "Barak Valley Multi-Speciality Hospital",
    category: "Sales",
    contactPerson: "Medical Purchase Director",
    phone: "+91 94353 11223",
    email: "procurement@barakhospital.com",
    address: "National Highway Bypass, Silchar - 788015",
    contractType: "Commercial Hardware Procurement",
    branchesCount: 1,
    assetsCount: 24,
    contractValue: 520000,
    startDate: "2024-02-15",
    expiryDate: "2027-02-14",
    status: "Active",
    notes: "Core i5 all-in-one patient management desktops and heavy duty barcode printers."
  },
  {
    id: "CLI-SLS-002",
    name: "Green Valley Tea Estate Ltd",
    category: "Sales",
    contactPerson: "General Manager",
    phone: "+91 94355 44332",
    email: "accounts@greenvalleytea.in",
    address: "Kumbhirgram Road, Cachar - 788109",
    contractType: "Factory Weighbridge & Office IT Supply",
    branchesCount: 2,
    assetsCount: 16,
    contractValue: 340000,
    startDate: "2024-05-10",
    expiryDate: "2026-05-09",
    status: "Active",
    notes: "Factory weighbridge rugged computers, thermal ticket printers, and optical network line."
  },
  {
    id: "CLI-SLS-003",
    name: "Silchar Educational Foundation",
    category: "Sales",
    contactPerson: "Academic Administrator",
    phone: "+91 97060 44556",
    email: "admin@silcharedu.org",
    address: "Meherpur, Silchar - 788015",
    contractType: "Smart Classroom Interactive Panel Setup",
    branchesCount: 1,
    assetsCount: 12,
    contractValue: 280000,
    startDate: "2024-06-01",
    expiryDate: "2027-05-31",
    status: "Active",
    notes: "75-inch interactive touch displays and faculty laptops."
  },

  // Solar Clients
  {
    id: "CLI-SLR-001",
    name: "Barak Cold Storage Pvt Ltd",
    category: "Solar",
    contactPerson: "Managing Director",
    phone: "+91 94350 44112",
    email: "info@barakcoldstorage.com",
    address: "Industrial Growth Area, Chincoorie, Silchar - 788007",
    contractType: "Commercial On-Grid Rooftop Solar EPC",
    branchesCount: 1,
    assetsCount: 1,
    contractValue: 1250000,
    startDate: "2024-05-01",
    expiryDate: "2029-04-30",
    status: "Active",
    notes: "25 kWp Solar Rooftop system with APDCL net metering approval and bi-directional meter."
  },
  {
    id: "CLI-SLR-002",
    name: "Saha Commercial Complex",
    category: "Solar",
    contactPerson: "Mr. B. Saha (Proprietor)",
    phone: "+91 86380 99887",
    email: "sahacommercial@gmail.com",
    address: "Main Commercial Market, Chincoorie, Silchar - 788007",
    contractType: "Hybrid Solar Plant with Battery Storage",
    branchesCount: 1,
    assetsCount: 1,
    contractValue: 560000,
    startDate: "2024-06-15",
    expiryDate: "2029-06-14",
    status: "Active",
    notes: "10 kWp Hybrid solar setup with lithium iron phosphate battery backup."
  },
  {
    id: "CLI-SLR-003",
    name: "Cachar Diagnostic & Research Centre",
    category: "Solar",
    contactPerson: "Chief Medical Director",
    phone: "+91 94357 88776",
    email: "cdrc.silchar@gmail.com",
    address: "Hospital Road, Silchar - 788005",
    contractType: "Hospital On-Grid Solar Plant",
    branchesCount: 1,
    assetsCount: 1,
    contractValue: 790000,
    startDate: "2024-07-01",
    expiryDate: "2029-06-30",
    status: "Active",
    notes: "15 kWp Grid-Tied solar system reducing monthly commercial electricity bills by 65%."
  },

  // Service Clients
  {
    id: "CLI-SRV-001",
    name: "Silchar Municipal Corporation",
    category: "Service",
    contactPerson: "Executive IT Nodal Officer",
    phone: "+91 94351 22334",
    email: "it@silcharmunicipal.in",
    address: "Municipal Building, Silchar - 788001",
    contractType: "Network Cabling & Breakdown Call Service",
    branchesCount: 1,
    assetsCount: 30,
    contractValue: 120000,
    startDate: "2024-01-01",
    expiryDate: "2025-12-31",
    status: "Active",
    notes: "Civic center network switch maintenance and counter billing printer repairs."
  },
  {
    id: "CLI-SRV-002",
    name: "Cachar Wholesale Traders Association",
    category: "Service",
    contactPerson: "General Secretary",
    phone: "+91 94350 99887",
    email: "cwta.silchar@gmail.com",
    address: "Fatuk Bazaar, Silchar - 788002",
    contractType: "CCTV Surveillance Maintenance & DVR Support",
    branchesCount: 1,
    assetsCount: 22,
    contractValue: 95000,
    startDate: "2024-03-15",
    expiryDate: "2025-03-14",
    status: "Active",
    notes: "32-channel IP camera surveillance network and hard disk backup array."
  },
  {
    id: "CLI-SRV-003",
    name: "Valley Diagnostic Imaging Services",
    category: "Service",
    contactPerson: "Lab Technical In-charge",
    phone: "+91 98641 11223",
    email: "valleydiagnostic@gmail.com",
    address: "Rangirkhari Point, Silchar - 788005",
    contractType: "Medical PC Hardware & Calibration Service",
    branchesCount: 1,
    assetsCount: 14,
    contractValue: 80000,
    startDate: "2024-02-01",
    expiryDate: "2025-01-31",
    status: "Active",
    notes: "Ultrasound workstation PC motherboards and high-resolution diagnostic monitor maintenance."
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "VCH-2026-001",
    date: "2026-09-17",
    type: "Income",
    voucherType: "Receipt Voucher",
    category: "AMC Revenue",
    party: "Punjab National Bank - Silchar Circle",
    amount: 171250,
    paymentMode: "Bank Transfer (NEFT)",
    refNo: "NEFT/PNB/Q2/88219",
    tax: 26123,
    narration: "Q2 AMC installment payment received for 50 PNB branches under comprehensive banking IT contract."
  },
  {
    id: "VCH-2026-002",
    date: "2026-09-16",
    type: "Expense",
    voucherType: "Payment Voucher",
    category: "Inventory & Spares Procurement",
    party: "CompuTech Wholesale Distributors Guwahati",
    amount: 64500,
    paymentMode: "Bank Transfer (RTGS)",
    refNo: "RTGS/CT/54129",
    tax: 9840,
    narration: "Procured Crucial 16GB RAM modules and Kingston NVMe SSD buffer stocks for branch repairs."
  },
  {
    id: "VCH-2026-003",
    date: "2026-09-15",
    type: "Income",
    voucherType: "Receipt Voucher",
    category: "Solar Project Milestone",
    party: "Barak Cold Storage Pvt Ltd",
    amount: 350000,
    paymentMode: "Bank Transfer (RTGS)",
    refNo: "RTGS/BCS/25KW/01",
    tax: 42000,
    narration: "50% Mobilization advance received for 25 kWp on-grid commercial solar rooftop installation."
  },
  {
    id: "VCH-2026-004",
    date: "2026-09-14",
    type: "Expense",
    voucherType: "Payment Voucher",
    category: "Staff Salaries & Wages",
    party: "Staff Payroll Disbursal",
    amount: 134000,
    paymentMode: "Bank Transfer (NEFT)",
    refNo: "SAL/2026/AUG/01",
    tax: 0,
    narration: "August cycle salaries disbursed across resident engineers, technicians, and accounting staff."
  },
  {
    id: "VCH-2026-005",
    date: "2026-09-12",
    type: "Income",
    voucherType: "Receipt Voucher",
    category: "AMC Revenue",
    party: "Indian Post - Cachar Division",
    amount: 48750,
    paymentMode: "Bank Transfer (NEFT)",
    refNo: "IP/CCR/Q1/3391",
    tax: 7436,
    narration: "Quarterly IT maintenance settlement for 18 postal branches."
  },
  {
    id: "VCH-2026-006",
    date: "2026-09-10",
    type: "Expense",
    voucherType: "Payment Voucher",
    category: "Engineer Travel & Field DA",
    party: "Field Engineering Team",
    amount: 14500,
    paymentMode: "UPI",
    refNo: "UPI/FLD/TRV/09",
    tax: 0,
    narration: "Fuel and daily field allowance for engineer visits across PNB rural branches."
  },
  {
    id: "VCH-2026-007",
    date: "2026-09-08",
    type: "Expense",
    voucherType: "Payment Voucher",
    category: "Office Rent & Premises",
    party: "Landlord - Chincoorie Premises",
    amount: 18000,
    paymentMode: "Bank Transfer (NEFT)",
    refNo: "RENT/2026/SEP",
    tax: 0,
    narration: "Monthly office rent payment for West Kachudharam, Chincoorie premises."
  },
  {
    id: "VCH-2026-008",
    date: "2026-09-05",
    type: "Expense",
    voucherType: "Payment Voucher",
    category: "Statutory Tax Payment (GST)",
    party: "GST Portal - Government of India",
    amount: 38240,
    paymentMode: "Net Banking (Challan)",
    refNo: "CPIN/2609/180029",
    tax: 0,
    narration: "GSTR-3B tax payment for August return filing."
  },
  {
    id: "VCH-2026-009",
    date: "2026-09-03",
    type: "Income",
    voucherType: "Receipt Voucher",
    category: "Hardware Sales",
    party: "Barak Valley Multi-Speciality Hospital",
    amount: 115000,
    paymentMode: "Cheque Clearance",
    refNo: "CHQ-449102-HDFC",
    tax: 17542,
    narration: "Payment received for Desktop & LaserJet printer delivery."
  },
  {
    id: "VCH-2026-010",
    date: "2026-09-01",
    type: "Contra",
    voucherType: "Contra Voucher",
    category: "Petty Cash Withdrawal",
    party: "Self - Office Cash Drawer",
    amount: 20000,
    paymentMode: "Cash Cheque",
    refNo: "CHQ-991022-PNB",
    tax: 0,
    narration: "Withdrew cash from PNB Current Account for office petty cash buffer."
  }
];export const INITIAL_AUDIT_LOGS = [
  {
    id: "AUD-2026-001",
    timestamp: "2026-09-18T01:30:00.000Z",
    action: "SYSTEM_INITIALIZE",
    category: "Security & Governance",
    user: "Amio Sinha (Administrator)",
    details: "ERP Workspace integrity check & SHA-256 cryptographic security shield verified."
  },
  {
    id: "AUD-2026-002",
    timestamp: "2026-09-17T18:45:00.000Z",
    action: "ACCOUNTS_VOUCHER_POST",
    category: "Financial Ledger",
    user: "Amio Sinha",
    details: "Posted AMC Payment Receipt Voucher VCH-2026-001 for ₹1,21,250 (PNB Silchar Circle)."
  },
  {
    id: "AUD-2026-003",
    timestamp: "2026-09-17T16:20:00.000Z",
    action: "CLIENT_ENROLL",
    category: "Client Directory",
    user: "Resident Engineer - Debashis",
    details: "Enrolled Cachar College Silchar Computer Lab under Annual Maintenance Contract."
  }
];

export const INITIAL_ENTERPRISE_PROJECTS = [
  {
    id: "PRJ-2026-001",
    title: "Cachar College 25 kWp Rooftop Solar EPC",
    category: "Solar EPC",
    client: "Cachar College, Silchar",
    location: "Trunk Road, Silchar, Assam",
    manager: "Animesh Das (Solar Tech Lead)",
    capacityKw: 25,
    budget: 1375000,
    actualCost: 980000,
    startDate: "2026-08-10",
    targetDate: "2026-10-15",
    status: "In Progress",
    progress: 75,
    milestones: [
      { id: "M1", name: "Site Feasibility & Shadow Analysis", done: true, date: "2026-08-15" },
      { id: "M2", name: "APDCL Net Metering Sanction & NOC", done: true, date: "2026-08-28" },
      { id: "M3", name: "Module Mounting Structure & Civil Works", done: true, date: "2026-09-08" },
      { id: "M4", name: "Solar PV Panels (Waaree 540W) Installation", done: true, date: "2026-09-14" },
      { id: "M5", name: "Inverter Wiring & Earthing Pit Testing (<1.5Ω)", done: false, date: "2026-09-25" },
      { id: "M6", name: "APDCL Bi-Directional Meter Sync & Commissioning", done: false, date: "2026-10-10" }
    ],
    boqSummary: "46x Waaree 540W Mono PERC, 1x Growatt 25kW Grid Inverter, GI Structure, 3x Chemical Earthing Pits",
    apdclRef: "APDCL/CGM/RE/2026/SL-1049"
  },
  {
    id: "PRJ-2026-002",
    title: "Punjab National Bank 50-Branch RouterOS Network Upgrade",
    category: "IT Infrastructure",
    client: "Punjab National Bank - Silchar Circle",
    location: "50 Branches across Cachar, Karimganj & Hailakandi",
    manager: "Debashis Roy (Resident Engineer)",
    capacityKw: 0,
    budget: 485000,
    actualCost: 312000,
    startDate: "2026-08-01",
    targetDate: "2026-09-30",
    status: "In Progress",
    progress: 82,
    milestones: [
      { id: "M1", name: "Circle Router & Firewall Firmware Hardening", done: true, date: "2026-08-05" },
      { id: "M2", name: "Silchar Urban Branches (16 Nodes) Staging", done: true, date: "2026-08-20" },
      { id: "M3", name: "Karimganj & Badarpur Cluster (18 Nodes)", done: true, date: "2026-09-05" },
      { id: "M4", name: "Hailakandi & Rural Branches (16 Nodes)", done: false, date: "2026-09-22" },
      { id: "M5", name: "Circle Central Bandwidth Failover Audit", done: false, date: "2026-09-28" }
    ],
    boqSummary: "50x MikroTik RB750Gr3, 100x Cat6 Patch Panels, D-Link Gigabit 24-Port Switches",
    apdclRef: "PNB/SIL/NET/2026/088"
  },
  {
    id: "PRJ-2026-003",
    title: "Dholai Tea Estate 100 kWp Captive Solar Power Plant",
    category: "Solar EPC",
    client: "Barak Valley Tea Plantations Ltd",
    location: "Dholai, Cachar, Assam",
    manager: "Animesh Das (Solar Tech Lead)",
    capacityKw: 100,
    budget: 5200000,
    actualCost: 2450000,
    startDate: "2026-09-01",
    targetDate: "2026-12-15",
    status: "Engineering & Procurement",
    progress: 35,
    milestones: [
      { id: "M1", name: "Topographical Survey & Soil Bearing Test", done: true, date: "2026-09-05" },
      { id: "M2", name: "33kV / 11kV Grid Interconnection Study", done: true, date: "2026-09-12" },
      { id: "M3", name: "Civil Foundation & Ramming Pile Erection", done: false, date: "2026-10-05" },
      { id: "M4", name: "185x Bifacial 540W Modules Dispatch & Stringing", done: false, date: "2026-11-10" },
      { id: "M5", name: "LT Panel, HT Breakers & SCADA Remote Telemetry", done: false, date: "2026-11-30" },
      { id: "M6", name: "Chief Electrical Inspector (CEI) Clearance", done: false, date: "2026-12-10" }
    ],
    boqSummary: "185x Mono PERC Bifacial 540W, 2x 50kW Sungrow Inverters, Ground Mounting HDG Structure",
    apdclRef: "APDCL/CEI/HT/2026/902"
  },
  {
    id: "PRJ-2026-004",
    title: "Assam University Computer Lab Hardware Refresh (40 Workstations)",
    category: "IT Infrastructure",
    client: "Assam University, Dargakona, Silchar",
    location: "Dept of Computer Science, Dargakona",
    manager: "Debashis Roy & Rahul Sen",
    capacityKw: 0,
    budget: 1840000,
    actualCost: 1620000,
    startDate: "2026-08-25",
    targetDate: "2026-09-25",
    status: "Testing & Handover",
    progress: 95,
    milestones: [
      { id: "M1", name: "Workstation Procurement & Bench Testing", done: true, date: "2026-08-30" },
      { id: "M2", name: "Structured Cat6 Cabling & Conduit Routing", done: true, date: "2026-09-06" },
      { id: "M3", name: "10kVA Online UPS Installation & Battery Bank", done: true, date: "2026-09-10" },
      { id: "M4", name: "Ubuntu / Windows Dual-boot OS Staging", done: true, date: "2026-09-15" },
      { id: "M5", name: "HOD Acceptance Test & Asset Handover Sign-off", done: false, date: "2026-09-24" }
    ],
    boqSummary: "40x Core i5 12th Gen PCs, 40x 24-inch IPS Monitors, 1x 10kVA Online UPS, 2x 24-Port D-Link PoE Switches",
    apdclRef: "AUS/COMP/LAB/2026/14"
  }
];

export const INITIAL_PROCUREMENT_DATA = {
  requisitions: [
    {
      id: "PR-2026-001",
      date: "2026-09-10",
      project: "Cachar College 25 kWp Rooftop Solar EPC",
      requestedBy: "Animesh Das",
      items: "Waaree 540W Mono PERC Bifacial Panels (Qty: 46), 6 sq mm DC Solar Cable (300m)",
      estimatedValue: 585000,
      urgency: "High",
      status: "Approved",
      poGenerated: "PO-2026-081"
    },
    {
      id: "PR-2026-002",
      date: "2026-09-12",
      project: "PNB 50-Branch RouterOS Network Upgrade",
      requestedBy: "Debashis Roy",
      items: "MikroTik RB750Gr3 Gigabit Routers (Qty: 15), Cat6 RJ45 Connectors (2 Boxes)",
      estimatedValue: 68000,
      urgency: "Urgent",
      status: "Approved",
      poGenerated: "PO-2026-082"
    },
    {
      id: "PR-2026-003",
      date: "2026-09-16",
      project: "Stock Buffer - Silchar Central Depot",
      requestedBy: "Priyanka Paul",
      items: "Frontech 450W SMPS (Qty: 20), Crucial 16GB DDR4 RAM (Qty: 15)",
      estimatedValue: 51750,
      urgency: "Normal",
      status: "Pending Approval",
      poGenerated: null
    }
  ],
  rfqs: [
    {
      id: "RFQ-2026-011",
      date: "2026-09-11",
      itemDescription: "Waaree 540W Mono PERC Solar PV Panels (Tier-1) - Qty: 50",
      vendors: [
        { name: "Waaree Energies Direct Hub Guwahati", quotePrice: 12100, leadDays: 4, isL1: true },
        { name: "Eastern Solar Traders Kolkata", quotePrice: 12450, leadDays: 7, isL1: false },
        { name: "SunTech Solar Dist. Guwahati", quotePrice: 12300, leadDays: 5, isL1: false }
      ],
      selectedVendor: "Waaree Energies Direct Hub Guwahati",
      status: "Finalized"
    },
    {
      id: "RFQ-2026-012",
      date: "2026-09-13",
      itemDescription: "MikroTik RB750Gr3 Enterprise Gigabit Routers - Qty: 15",
      vendors: [
        { name: "D-Link / MikroTik Direct Importer Kolkata", quotePrice: 4100, leadDays: 3, isL1: true },
        { name: "TechZone IT Wholesale Silchar", quotePrice: 4350, leadDays: 1, isL1: false }
      ],
      selectedVendor: "D-Link / MikroTik Direct Importer Kolkata",
      status: "Finalized"
    }
  ],
  purchaseOrders: [
    {
      id: "PO-2026-081",
      date: "2026-09-12",
      vendor: "Waaree Energies Limited (Guwahati Regional Depot)",
      vendorGstin: "18AABBW1234D1Z5",
      items: [
        { desc: "Waaree 540W Mono PERC Bifacial Solar Modules", qty: 46, rate: 12100, gstRate: 12, total: 623312 }
      ],
      subtotal: 556600,
      gstAmount: 66712,
      grandTotal: 623312,
      deliveryLocation: "Silchar Central Depot / Site Cachar College",
      paymentTerms: "50% Advance with PO, 50% Against Dispatch LR Copy",
      status: "Dispatched",
      grnRef: "GRN-2026-042"
    },
    {
      id: "PO-2026-082",
      date: "2026-09-13",
      vendor: "D-Link / MikroTik Regional Wholesale Hub",
      vendorGstin: "18AABCD5678E1Z2",
      items: [
        { desc: "MikroTik RB750Gr3 5-Port Gigabit RouterOS Nodes", qty: 15, rate: 4100, gstRate: 18, total: 72570 }
      ],
      subtotal: 61500,
      gstAmount: 11070,
      grandTotal: 72570,
      deliveryLocation: "Silchar Central Depot, West Kachudharam",
      paymentTerms: "Net 15 Days after GRN Verification",
      status: "Delivered & Inspected",
      grnRef: "GRN-2026-041"
    },
    {
      id: "PO-2026-083",
      date: "2026-09-15",
      vendor: "Schneider Electric / APC Enterprise Sales",
      vendorGstin: "18AAACS4455Q1Z3",
      items: [
        { desc: "APC Smart-UPS 10kVA Online 3-Phase In / 1-Phase Out", qty: 1, rate: 145000, gstRate: 18, total: 171100 }
      ],
      subtotal: 145000,
      gstAmount: 26100,
      grandTotal: 171100,
      deliveryLocation: "Assam University Dargakona Lab Site",
      paymentTerms: "100% Against Bank Proforma Invoice",
      status: "Approved",
      grnRef: null
    }
  ],
  grns: [
    {
      id: "GRN-2026-041",
      poId: "PO-2026-082",
      receiptDate: "2026-09-16",
      vendor: "D-Link / MikroTik Regional Wholesale Hub",
      receivedQty: 15,
      acceptedQty: 15,
      rejectedQty: 0,
      qcInspector: "Debashis Roy (Hardware Tech)",
      qcRemarks: "All 15 units serial verified, booted RouterOS v7.14 OK.",
      warehouseLocation: "Central Depot Silchar, Shelf C-2",
      status: "Verified & Stock Added"
    },
    {
      id: "GRN-2026-042",
      poId: "PO-2026-081",
      receiptDate: "2026-09-17",
      vendor: "Waaree Energies Limited",
      receivedQty: 46,
      acceptedQty: 46,
      rejectedQty: 0,
      qcInspector: "Animesh Das (Solar Tech)",
      qcRemarks: "All 46 pallets inspected, no micro-cracks, flash test reports attached.",
      warehouseLocation: "Site Buffer Store, Cachar College",
      status: "Verified & Stock Added"
    }
  ]
};

export const INITIAL_VENDORS_DATA = [
  {
    id: "VND-001",
    name: "Waaree Energies Limited",
    category: "Solar PV Modules & Cells",
    contactPerson: "Mr. Subrata Sen (Guwahati Hub Manager)",
    phone: "+91 94351 22334",
    email: "subrata.sen@waaree.com",
    address: "Borusojai, NH-37 Bypass, Guwahati - 781034, Assam",
    gstin: "18AABBW1234D1Z5",
    pan: "AABBW1234D",
    bankName: "State Bank of India - Guwahati Commercial Branch",
    accountNo: "38920194820",
    ifsc: "SBIN0000078",
    rating: 4.9,
    creditDays: 15,
    totalPurchases: 2450000,
    outstandingDue: 0,
    isGemRegistered: true
  },
  {
    id: "VND-002",
    name: "Growatt New Energy Tech India",
    category: "Solar Inverters & Energy Storage",
    contactPerson: "National Institutional Support",
    phone: "+91 91234 56789",
    email: "service.in@growatt.com",
    address: "Eastern India Logistics Hub, Kolkata - 700091",
    gstin: "27AABCG9988H1Z1",
    pan: "AABCG9988H",
    bankName: "HDFC Bank - Salt Lake Kolkata",
    accountNo: "50200029384910",
    ifsc: "HDFC0000128",
    rating: 4.8,
    creditDays: 0,
    totalPurchases: 890000,
    outstandingDue: 0,
    isGemRegistered: true
  },
  {
    id: "VND-003",
    name: "D-Link India Regional Distribution",
    category: "Enterprise Networking & Structured Cabling",
    contactPerson: "Mr. Rajesh Sarma",
    phone: "+91 98640 11223",
    email: "rajesh.sarma@dlink-dist.in",
    address: "G.S. Road, Christian Basti, Guwahati - 781005",
    gstin: "18AABCD5678E1Z2",
    pan: "AABCD5678E",
    bankName: "Axis Bank - G.S. Road Guwahati",
    accountNo: "919020038491029",
    ifsc: "UTIB0000140",
    rating: 4.7,
    creditDays: 30,
    totalPurchases: 430000,
    outstandingDue: 72570,
    isGemRegistered: false
  },
  {
    id: "VND-004",
    name: "HP India Sales Private Limited",
    category: "Banking Desktops, Laptops & Passbook Printers",
    contactPerson: "Institutional Sales & GeM Desk",
    phone: "1800-258-7170",
    email: "gem.support@hp.com",
    address: "DLF Cyber City, Tower C, Gurgaon / Guwahati Depo",
    gstin: "18AAACH1001P1Z9",
    pan: "AAACH1001P",
    bankName: "Citibank N.A. - Corporate Banking",
    accountNo: "00192847291",
    ifsc: "CITI0000002",
    rating: 4.9,
    creditDays: 45,
    totalPurchases: 1850000,
    outstandingDue: 0,
    isGemRegistered: true
  },
  {
    id: "VND-005",
    name: "Schneider Electric / APC India",
    category: "Online UPS & Power Backup",
    contactPerson: "Eastern Channel Sales",
    phone: "1800-419-4272",
    email: "apc.customercare@se.com",
    address: "Ecospace Business Park, New Town, Kolkata",
    gstin: "18AAACS4455Q1Z3",
    pan: "AAACS4455Q",
    bankName: "Standard Chartered Bank - Kolkata",
    accountNo: "22019482019",
    ifsc: "SCBL0036001",
    rating: 4.8,
    creditDays: 30,
    totalPurchases: 560000,
    outstandingDue: 171100,
    isGemRegistered: true
  },
  {
    id: "VND-006",
    name: "Barak Solar Fabrication & Structural Works",
    category: "Solar Mounting Structures & Civil Foundations",
    contactPerson: "Mr. S. K. Paul",
    phone: "+91 94350 88776",
    email: "barak.fabricators@gmail.com",
    address: "Meherpur Main Road, Silchar - 788015, Assam",
    gstin: "18AANFP3321R1Z8",
    pan: "AANFP3321R",
    bankName: "Punjab National Bank - Meherpur Silchar",
    accountNo: "0849002100039482",
    ifsc: "PUNB0084900",
    rating: 4.5,
    creditDays: 15,
    totalPurchases: 320000,
    outstandingDue: 35000,
    isGemRegistered: false
  }
];

export const INITIAL_DOCUMENTS_DATA = [
  {
    id: "DOC-2026-001",
    title: "APDCL Net Metering Feasibility & Technical Sanction Letter",
    category: "Solar Statutory Approvals",
    refNumber: "APDCL/CGM/RE/2026/SL-1049",
    clientOrProject: "Cachar College 25 kWp Rooftop Solar",
    issueDate: "2026-08-28",
    expiryDate: "2027-08-27",
    fileType: "PDF Document",
    fileSize: "2.4 MB",
    uploadedBy: "Animesh Das",
    tags: ["APDCL", "Net Metering", "Bi-Directional Meter", "NOC"],
    notes: "Approved for 25 kWp LT grid interconnection at 415V 3-Phase. Inspection clearance granted."
  },
  {
    id: "DOC-2026-002",
    title: "Waaree 540W Mono PERC Flash Test & Electroluminescence (EL) Report",
    category: "Solar Compliance & OEM Test Reports",
    refNumber: "TUV-RHEINLAND-PV-2025-883",
    clientOrProject: "Cachar College & General Stock",
    issueDate: "2026-07-15",
    expiryDate: "2036-07-15",
    fileType: "PDF Certificate",
    fileSize: "4.8 MB",
    uploadedBy: "Animesh Das",
    tags: ["Waaree", "Flash Test", "BIS", "IEC 61215", "TUV"],
    notes: "Verified zero micro-cracks, average wattage 542.4W per module, efficiency 21.3%."
  },
  {
    id: "DOC-2026-003",
    title: "Silchar Sub-Divisional Chemical Earthing Pit Resistance Test Sheet",
    category: "Electrical Safety & Inspection",
    refNumber: "EAR-TEST-SIL-2026-09",
    clientOrProject: "Cachar College Silchar Site",
    issueDate: "2026-09-14",
    expiryDate: "2027-09-14",
    fileType: "Digital Inspection Sheet",
    fileSize: "1.1 MB",
    uploadedBy: "Debashis Roy",
    tags: ["Earthing", "Megger", "Ohmic Value", "IS 3043"],
    notes: "Pit #1: 1.18Ω, Pit #2: 1.24Ω, Pit #3 (Inverter Neutral): 0.92Ω. Complies with IS:3043 (<2.0Ω)."
  },
  {
    id: "DOC-2026-004",
    title: "Punjab National Bank Silchar Circle Annual Maintenance Contract SLA",
    category: "Bank Contracts & SLAs",
    refNumber: "PNB/SIL/IT-AMC/2023-26",
    clientOrProject: "PNB 50-Branch Circle Office & Matrix",
    issueDate: "2023-10-01",
    expiryDate: "2026-09-30",
    fileType: "Signed Contract PDF",
    fileSize: "6.2 MB",
    uploadedBy: "Tamal (Proprietor)",
    tags: ["PNB", "Banking AMC", "SLA 2-4 Hr", "Penalty Clauses"],
    notes: "Full circle coverage across 50 branches for 543 hardware endpoints. Quarterly billing cycle."
  },
  {
    id: "DOC-2026-005",
    title: "Growatt 25kW Grid-Tied Inverter 5-Year Standard Warranty Card",
    category: "OEM Warranties",
    refNumber: "GW-WARR-2026-IN-4491",
    clientOrProject: "Cachar College 25 kWp Solar",
    issueDate: "2026-09-01",
    expiryDate: "2031-09-01",
    fileType: "OEM Warranty Certificate",
    fileSize: "1.5 MB",
    uploadedBy: "Animesh Das",
    tags: ["Growatt", "Warranty", "5-Year", "RMA Replacement"],
    notes: "Valid for on-site replacement via authorized Growatt service hub in Kolkata/Guwahati."
  },
  {
    id: "DOC-2026-006",
    title: "Assam Govt Electrical Contractor Class-I License & Supervisor Permit",
    category: "Statutory Licenses",
    refNumber: "AS-PWD-ELEC-CL1-9982",
    clientOrProject: "M/S COMPUTER PLANET Statutory",
    issueDate: "2024-07-01",
    expiryDate: "2027-06-30",
    fileType: "Government Gazette Scan",
    fileSize: "3.1 MB",
    uploadedBy: "Tamal (Proprietor)",
    tags: ["License", "PWD Assam", "Electrical", "Govt Approval"],
    notes: "Empowered for HT/LT electrical installations, substations, and solar transmission lines up to 33kV."
  }
];

export const INITIAL_WORKFLOW_APPROVALS = [
  {
    id: "WF-APP-001",
    type: "Purchase Order",
    refId: "PO-2026-081",
    title: "PO to Waaree Energies for 46 Solar Modules",
    amount: 623312,
    requestedBy: "Animesh Das (Solar Tech)",
    requestDate: "2026-09-12",
    approver: "Tamal (Proprietor)",
    status: "Approved",
    approvalDate: "2026-09-12",
    comments: "Critical project milestone. Approved for advance RTGS release."
  },
  {
    id: "WF-APP-002",
    type: "Commercial Discount",
    refId: "QTN-2026-042",
    title: "Educational Institution 5% Discount for Cachar College",
    amount: 68750,
    requestedBy: "Priyanka Paul (Accounts)",
    requestDate: "2026-08-20",
    approver: "Tamal (Proprietor)",
    status: "Approved",
    approvalDate: "2026-08-21",
    comments: "Approved under PM Surya Ghar institutional promotion."
  },
  {
    id: "WF-APP-003",
    type: "Field Travel Expense Claim",
    refId: "EXP-2026-089",
    title: "Urgent PNB Karimganj & Badarpur Hardware Breakdown Travel",
    amount: 2450,
    requestedBy: "Debashis Roy (Engineer)",
    requestDate: "2026-09-16",
    approver: "Tamal (Proprietor)",
    status: "Pending",
    approvalDate: null,
    comments: "Replaced 2 SMPS units and tested WAN link. Travel receipts attached."
  },
  {
    id: "WF-APP-004",
    type: "Project Handover Sign-Off",
    refId: "PRJ-2026-004",
    title: "Assam University 40-Workstation Lab Acceptance & Handover",
    amount: 1840000,
    requestedBy: "Debashis Roy (Engineer)",
    requestDate: "2026-09-17",
    approver: "Tamal (Proprietor)",
    status: "Pending",
    approvalDate: null,
    comments: "All 40 PCs operational, Ubuntu/Win dual-boot tested. Joint inspection pending."
  }
];

export function getAuditLogs() {
  return loadErpData("audit_logs", INITIAL_AUDIT_LOGS);
}

export function recordAuditLog(action, category, details, user = "Authorized Administrator") {
  try {
    const current = loadErpData("audit_logs", INITIAL_AUDIT_LOGS);
    const newEntry = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      action,
      category: category || "System Operation",
      user: typeof user === 'string' ? user : (user?.name || user?.username || 'Authorized User'),
      details: details || "Administrative activity recorded."
    };
    const updated = [newEntry, ...(Array.isArray(current) ? current : [])].slice(0, 100);
    saveErpData("audit_logs", updated);
    return newEntry;
  } catch (err) {
    console.error("Failed to record audit log", err);
    return null;
  }
}

export function exportAllErpData() {
  const backup = {
    exportDate: new Date().toISOString(),
    firm: "M/S COMPUTER PLANET",
    users: loadErpData("users", INITIAL_USERS),
    employees: loadErpData("employees", INITIAL_EMPLOYEES),
    leaves: loadErpData("leaves", INITIAL_LEAVES),
    payroll: loadErpData("payroll", INITIAL_PAYROLL),
    fieldVisits: loadErpData("field_visits", INITIAL_FIELD_VISITS),
    leads: loadErpData("leads", INITIAL_LEADS),
    clients: loadErpData("clients", INITIAL_CLIENTS),
    transactions: loadErpData("transactions", INITIAL_TRANSACTIONS),
    tickets: loadErpData("tickets", INITIAL_TICKETS),
    amc: loadErpData("amc", INITIAL_AMC_CONTRACTS),
    inventory: loadErpData("inventory", INITIAL_INVENTORY),
    invoices: loadErpData("invoices", INITIAL_INVOICES),
    quotations: loadErpData("quotations", INITIAL_QUOTATIONS),
    engineeringDesigns: loadErpData("engineering_designs", INITIAL_ENGINEERING_DESIGNS),
    itsmData: loadErpData("itsm_data", INITIAL_ITSM_DATA),
    solarProjects: loadErpData("solar_projects", INITIAL_SOLAR_PROJECTS),
    enterpriseProjects: loadErpData("enterprise_projects", INITIAL_ENTERPRISE_PROJECTS),
    procurementData: loadErpData("procurement_data", INITIAL_PROCUREMENT_DATA),
    vendorsData: loadErpData("vendors_data", INITIAL_VENDORS_DATA),
    documentsData: loadErpData("documents_data", INITIAL_DOCUMENTS_DATA),
    workflowApprovals: loadErpData("workflow_approvals", INITIAL_WORKFLOW_APPROVALS),
    pnbAssets: loadErpData("pnb_assets", null),
    menuModificationPolicy: loadErpData("menu_modification_policy", DEFAULT_MENU_MODIFICATION_POLICY),
    auditLogs: loadErpData("audit_logs", INITIAL_AUDIT_LOGS)
  };
  return JSON.stringify(backup, null, 2);
}

export function importAllErpData(jsonString) {
  try {
    const data = sanitizeImportPayload(jsonString);
    if (!data || typeof data !== 'object') {
      console.error("Payload validation failed: Malformed or untrusted structure");
      return false;
    }
    const recognizedKeys = [
      'users', 'employees', 'leaves', 'payroll', 'tickets', 'amc', 'inventory', 
      'invoices', 'quotations', 'clients', 'transactions', 'leads', 
      'engineeringDesigns', 'itsmData', 'solarProjects', 'procurementData', 
      'vendorsData', 'documentsData', 'workflowApprovals'
    ];
    const hasAnyRecognizedKey = recognizedKeys.some(k => k in data);
    if (!hasAnyRecognizedKey) {
      console.error("Payload validation failed: No recognized ERP collections found in backup payload.");
      return false;
    }
    if (data.users && Array.isArray(data.users)) saveErpData("users", data.users);
    if (data.employees && Array.isArray(data.employees)) saveErpData("employees", data.employees);
    if (data.leaves && Array.isArray(data.leaves)) saveErpData("leaves", data.leaves);
    if (data.payroll && Array.isArray(data.payroll)) saveErpData("payroll", data.payroll);
    if (data.fieldVisits && Array.isArray(data.fieldVisits)) saveErpData("field_visits", data.fieldVisits);
    if (data.leads && Array.isArray(data.leads)) saveErpData("leads", data.leads);
    if (data.clients && Array.isArray(data.clients)) saveErpData("clients", data.clients);
    if (data.transactions && Array.isArray(data.transactions)) saveErpData("transactions", data.transactions);
    if (data.tickets && Array.isArray(data.tickets)) saveErpData("tickets", data.tickets);
    if (data.amc && Array.isArray(data.amc)) saveErpData("amc", data.amc);
    if (data.inventory && Array.isArray(data.inventory)) saveErpData("inventory", data.inventory);
    if (data.invoices && Array.isArray(data.invoices)) saveErpData("invoices", data.invoices);
    if (data.quotations && Array.isArray(data.quotations)) saveErpData("quotations", data.quotations);
    if (data.engineeringDesigns && Array.isArray(data.engineeringDesigns)) saveErpData("engineering_designs", data.engineeringDesigns);
    if (data.itsmData && typeof data.itsmData === 'object') saveErpData("itsm_data", data.itsmData);
    if (data.solarProjects && Array.isArray(data.solarProjects)) saveErpData("solar_projects", data.solarProjects);
    if (data.enterpriseProjects && Array.isArray(data.enterpriseProjects)) saveErpData("enterprise_projects", data.enterpriseProjects);
    if (data.procurementData && typeof data.procurementData === 'object') saveErpData("procurement_data", data.procurementData);
    if (data.vendorsData && Array.isArray(data.vendorsData)) saveErpData("vendors_data", data.vendorsData);
    if (data.documentsData && Array.isArray(data.documentsData)) saveErpData("documents_data", data.documentsData);
    if (data.workflowApprovals && Array.isArray(data.workflowApprovals)) saveErpData("workflow_approvals", data.workflowApprovals);
    if (data.pnbAssets) saveErpData("pnb_assets", data.pnbAssets);
    if (data.menuModificationPolicy && typeof data.menuModificationPolicy === 'object') saveErpData("menu_modification_policy", data.menuModificationPolicy);
    if (data.auditLogs && Array.isArray(data.auditLogs)) saveErpData("audit_logs", data.auditLogs);
    
    recordAuditLog("SYSTEM_RESTORE", "Data Management", "System data successfully restored from verified JSON backup.");
    return true;
  } catch (err) {
    console.error("Invalid ERP backup file", err);
    return false;
  }
}

