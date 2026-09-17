// ERP Local Storage and Initial Seed Data for M/S COMPUTER PLANET

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
    defaultPermissions: ["dashboard", "pnb_assets", "tickets", "amc", "inventory", "invoices", "solar", "users", "settings"]
  },
  {
    role: "Resident IT Service Engineer",
    description: "Resolves banking hardware breakdowns, checks branch assets, and tracks spare parts.",
    defaultPermissions: ["dashboard", "tickets", "pnb_assets", "inventory"]
  },
  {
    role: "Accounts & GST Billing Officer",
    description: "Generates official tax invoices, manages AMC billing schedules, and oversees commercial collections.",
    defaultPermissions: ["dashboard", "invoices", "amc", "inventory"]
  },
  {
    role: "Solar Project Technical Lead",
    description: "Coordinates rooftop & commercial solar installations, feasibility surveys, and inverter health.",
    defaultPermissions: ["dashboard", "solar", "inventory", "tickets"]
  },
  {
    role: "Store & Inventory Supervisor",
    description: "Maintains hardware buffer stocks, monitors reorder levels, and manages warehouse parts.",
    defaultPermissions: ["dashboard", "inventory", "tickets", "pnb_assets"]
  },
  {
    role: "Support Desk & Customer Coordinator",
    description: "Logs incoming client requests, creates job tickets, and tracks resolution SLAs.",
    defaultPermissions: ["dashboard", "tickets", "amc"]
  }
];

export const INITIAL_USERS = [
  {
    id: "USR-001",
    name: "Tamal (Proprietor)",
    username: "admin",
    role: "Administrator (Full Access)",
    pin: "1234",
    phone: "+91-8638083712",
    region: "Silchar HQ & All Circles",
    status: "Active",
    permissions: ["dashboard", "pnb_assets", "tickets", "amc", "inventory", "invoices", "solar", "users", "settings"]
  },
  {
    id: "USR-002",
    name: "Debashis Roy",
    username: "debashis",
    role: "Resident IT Service Engineer",
    pin: "2233",
    phone: "+91-9435012345",
    region: "PNB Silchar & Cachar Circle",
    status: "Active",
    permissions: ["dashboard", "tickets", "pnb_assets", "inventory"]
  },
  {
    id: "USR-003",
    name: "Priyanka Paul",
    username: "priyanka",
    role: "Accounts & GST Billing Officer",
    pin: "3344",
    phone: "+91-9864054321",
    region: "Silchar Central Office",
    status: "Active",
    permissions: ["dashboard", "invoices", "amc", "inventory"]
  },
  {
    id: "USR-004",
    name: "Animesh Das",
    username: "animesh",
    role: "Solar Project Technical Lead",
    pin: "4455",
    phone: "+91-8638099887",
    region: "Barak Valley Solar Projects",
    status: "Active",
    permissions: ["dashboard", "solar", "inventory", "tickets"]
  }
];

// Helper functions for LocalStorage management
export function loadErpData(key, fallback) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (err) {
    console.error("Failed to load ERP data for", key, err);
    return fallback;
  }
}

export function saveErpData(key, data) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save ERP data for", key, err);
  }
}

export function getErpPin() {
  return localStorage.getItem(STORAGE_KEY_PREFIX + "auth_pin") || "1234";
}

export function setErpPin(newPin) {
  localStorage.setItem(STORAGE_KEY_PREFIX + "auth_pin", newPin);
}

export function authenticateErpUser(enteredPin) {
  const masterPin = getErpPin();
  const users = loadErpData("users", INITIAL_USERS);

  // 1. Check if matches any specific staff user
  const matchedUser = users.find(u => u.pin === enteredPin);
  if (matchedUser) {
    if (matchedUser.status === "Suspended") {
      return { success: false, message: "This staff user account is currently suspended. Please contact Administrator." };
    }
    return { success: true, user: matchedUser };
  }

  // 2. Check if matches master PIN
  if (enteredPin === masterPin) {
    const adminUser = users.find(u => u.role.includes("Admin")) || {
      id: "MASTER-001",
      name: "Tamal (Proprietor)",
      username: "admin",
      role: "Administrator (Full Access)",
      pin: masterPin,
      permissions: ["dashboard", "pnb_assets", "tickets", "amc", "inventory", "invoices", "solar", "users", "settings"]
    };
    return { success: true, user: adminUser };
  }

  return { success: false, message: "Invalid Access PIN. (Default master PIN is 1234)" };
}

export function exportAllErpData() {
  const backup = {
    exportDate: new Date().toISOString(),
    firm: "M/S COMPUTER PLANET",
    users: loadErpData("users", INITIAL_USERS),
    tickets: loadErpData("tickets", INITIAL_TICKETS),
    amc: loadErpData("amc", INITIAL_AMC_CONTRACTS),
    inventory: loadErpData("inventory", INITIAL_INVENTORY),
    invoices: loadErpData("invoices", INITIAL_INVOICES),
    solarProjects: loadErpData("solar_projects", INITIAL_SOLAR_PROJECTS),
    pnbAssets: loadErpData("pnb_assets", null)
  };
  return JSON.stringify(backup, null, 2);
}

export function importAllErpData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.users) saveErpData("users", data.users);
    if (data.tickets) saveErpData("tickets", data.tickets);
    if (data.amc) saveErpData("amc", data.amc);
    if (data.inventory) saveErpData("inventory", data.inventory);
    if (data.invoices) saveErpData("invoices", data.invoices);
    if (data.solarProjects) saveErpData("solar_projects", data.solarProjects);
    if (data.pnbAssets) saveErpData("pnb_assets", data.pnbAssets);
    return true;
  } catch (err) {
    console.error("Invalid ERP backup file", err);
    return false;
  }
}

