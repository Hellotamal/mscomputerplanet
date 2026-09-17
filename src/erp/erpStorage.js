// ERP Local Storage and Initial Seed Data for M/S COMPUTER PLANET
import { 
  sha256, 
  DEFAULT_PIN_HASH, 
  encryptStorageData, 
  decryptStorageData, 
  sanitizeImportPayload 
} from './erpSecurity';

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

export const ROLE_DEFINITIONS = [
  {
    role: "Administrator (Full Access)",
    description: "Complete control over all business operations, financials, staff, and system settings.",
    defaultPermissions: ["dashboard", "pnb_assets", "tickets", "amc", "inventory", "invoices", "quotations", "solar", "users", "hrms", "settings"]
  },
  {
    role: "Resident IT Service Engineer",
    description: "Resolves banking hardware breakdowns, checks branch assets, and tracks spare parts.",
    defaultPermissions: ["dashboard", "tickets", "pnb_assets", "inventory", "quotations", "hrms"]
  },
  {
    role: "Accounts & GST Billing Officer",
    description: "Generates official tax invoices, manages AMC billing schedules, and oversees commercial collections.",
    defaultPermissions: ["dashboard", "invoices", "quotations", "amc", "inventory", "hrms"]
  },
  {
    role: "Solar Project Technical Lead",
    description: "Coordinates rooftop & commercial solar installations, feasibility surveys, and inverter health.",
    defaultPermissions: ["dashboard", "solar", "quotations", "inventory", "tickets", "hrms"]
  },
  {
    role: "Store & Inventory Supervisor",
    description: "Maintains hardware buffer stocks, monitors reorder levels, and manages warehouse parts.",
    defaultPermissions: ["dashboard", "inventory", "tickets", "pnb_assets"]
  },
  {
    role: "Support Desk & Customer Coordinator",
    description: "Logs incoming client requests, creates job tickets, and tracks resolution SLAs.",
    defaultPermissions: ["dashboard", "tickets", "quotations", "amc"]
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
    clients: loadErpData("clients", INITIAL_CLIENTS),
    transactions: loadErpData("transactions", INITIAL_TRANSACTIONS),
    tickets: loadErpData("tickets", INITIAL_TICKETS),
    amc: loadErpData("amc", INITIAL_AMC_CONTRACTS),
    inventory: loadErpData("inventory", INITIAL_INVENTORY),
    invoices: loadErpData("invoices", INITIAL_INVOICES),
    quotations: loadErpData("quotations", INITIAL_QUOTATIONS),
    solarProjects: loadErpData("solar_projects", INITIAL_SOLAR_PROJECTS),
    pnbAssets: loadErpData("pnb_assets", null),
    auditLogs: loadErpData("audit_logs", INITIAL_AUDIT_LOGS)
  };
  return JSON.stringify(backup, null, 2);
}

export function importAllErpData(jsonString) {
  try {
    const data = sanitizeImportPayload(jsonString);
    if (!data) {
      console.error("Payload validation failed: Malformed or untrusted structure");
      return false;
    }
    if (data.users && Array.isArray(data.users)) saveErpData("users", data.users);
    if (data.employees && Array.isArray(data.employees)) saveErpData("employees", data.employees);
    if (data.leaves && Array.isArray(data.leaves)) saveErpData("leaves", data.leaves);
    if (data.payroll && Array.isArray(data.payroll)) saveErpData("payroll", data.payroll);
    if (data.fieldVisits && Array.isArray(data.fieldVisits)) saveErpData("field_visits", data.fieldVisits);
    if (data.clients && Array.isArray(data.clients)) saveErpData("clients", data.clients);
    if (data.transactions && Array.isArray(data.transactions)) saveErpData("transactions", data.transactions);
    if (data.tickets && Array.isArray(data.tickets)) saveErpData("tickets", data.tickets);
    if (data.amc && Array.isArray(data.amc)) saveErpData("amc", data.amc);
    if (data.inventory && Array.isArray(data.inventory)) saveErpData("inventory", data.inventory);
    if (data.invoices && Array.isArray(data.invoices)) saveErpData("invoices", data.invoices);
    if (data.quotations && Array.isArray(data.quotations)) saveErpData("quotations", data.quotations);
    if (data.solarProjects && Array.isArray(data.solarProjects)) saveErpData("solar_projects", data.solarProjects);
    if (data.pnbAssets) saveErpData("pnb_assets", data.pnbAssets);
    if (data.auditLogs && Array.isArray(data.auditLogs)) saveErpData("audit_logs", data.auditLogs);
    
    recordAuditLog("SYSTEM_RESTORE", "Data Management", "System data successfully restored from verified JSON backup.");
    return true;
  } catch (err) {
    console.error("Invalid ERP backup file", err);
    return false;
  }
}

