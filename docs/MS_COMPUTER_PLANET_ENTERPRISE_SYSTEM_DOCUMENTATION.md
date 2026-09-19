# M/S COMPUTER PLANET — Complete System Documentation & ERP Operational Manual
**Enterprise Version:** v2.6.0  
**Headquarters:** Silchar, Cachar, Assam, India (788007)  
**Primary Domain:** [https://www.mscomputerplanet.com](https://www.mscomputerplanet.com)  
**GitHub Repository:** `https://github.com/Hellotamal/mscomputerplanet.git` (Branch: `main`)

---

## 1. System Architecture & Tech Stack

### 1.1 Dual-Architecture Design
The codebase is structured into two distinct layers that run on a unified React 18 single-page application (SPA):
1. **Public Marketing & Lead Generation Web Platform:** High-speed client-facing landing page featuring the interactive Solar ROI Calculator, Product Catalog, Customer Support Modal, Google AdSense Monetization, and SEO Blog System.
2. **Authorized Enterprise ERP Suite (`#erp` Mode):** Full-featured business management software covering 25 modules separated into 2 primary operational departments (*IT Infrastructure & ITSM* and *Renewable Energy & Solar*), plus corporate core administration.

### 1.2 Tech Stack & Key Libraries
- **Framework:** React 18 with Vite 8 bundler and Rolldown chunking.
- **Styling:** Tailwind CSS with custom dark mode anti-flicker script.
- **Icons:** `lucide-react` component library.
- **Data Persistence:** LocalStorage with JSON backup/restore (`cp_erp_data_v2`).
- **Security & Cryptography:** SHA-256 PIN hashing, HTML sanitization against XSS, tamper-evident audit logs.
- **Performance Optimization:** Code-splitting (`React.lazy`), manual vendor chunking (`vendor-react`), non-render-blocking font loading.

---

## 2. Public Website & Monetization Manual

### 2.1 Accessing & Navigating the Website
- **Public URL:** `https://www.mscomputerplanet.com`
- **Navigation Bar Items:** Home, IT Services, Solar EPC, Calculator, Products, Clientele, B2B Hub, Blog, Hall of Fame, 100 KM Area, Contact.

### 2.2 Solar ROI Calculator Formulas
Calculates rooftop solar estimates tailored to Assam solar irradiance (~4.0–4.2 peak sun hours/day):
- **Unit Tariff Rates:** ₹8.50/unit for Commercial/Institutional; ₹7.20/unit for Residential.
- **Monthly Generation:** 1 kW solar photovoltaic system produces ~115 units/month in Barak Valley.
- **Rooftop Shadow-Free Area:** ~95 sq. ft. required per 1 kW system.
- **PM Surya Ghar Subsidy Calculation:**
  - Up to 2 kW: ₹30,000 per kW (Max ₹60,000).
  - 2 kW to 3 kW: ₹18,000 per kW for additional capacity.
  - Above 3 kW: Fixed maximum subsidy cap of ₹78,000.

### 2.3 Google AdSense Monetization Setup
- **Publisher Account ID:** `ca-pub-2887274841506101`
- **Authorized Digital Sellers File:** `public/ads.txt` containing:
  `google.com, pub-2887274841506101, DIRECT, f08c47fec0942fa0`
- **Verification Meta Tag:** `<meta name="google-adsense-account" content="ca-pub-2887274841506101">` in `index.html`.
- **GDPR & Privacy Compliance:** Integrated `LegalModal.jsx` with full third-party DART cookie disclosures accessible from the footer.

### 2.4 SEO Blog Content Engine
- **Routes:** `#blog` (Listing) and `#blog/:slug` (Individual Article Reader).
- **Schema Markup:** Implements `BlogPosting` and `LocalBusiness` JSON-LD structured data.
- **Active Articles:**
  1. *How to Get PM Surya Ghar Solar Subsidy in Assam (2026 Complete Guide)*
  2. *Top 5 IT AMC Mistakes Small Businesses in Silchar Are Making*
  3. *Why a Local Solar EPC Partner in Silchar is Better Than an Out-of-Town Company*

---

## 3. Enterprise ERP Suite Manual (25 Modules)

### 3.1 Accessing the ERP System
To launch the Enterprise ERP Suite:
- **Option A (Secret Keyboard Shortcut):** Press `Ctrl + Shift + E` or `Alt + E` anywhere on the website.
- **Option B (URL Hash):** Append `#erp` to the URL (`https://www.mscomputerplanet.com/#erp`).
- **Option C (Footer Link):** Click "Business Portal / ERP Workspace" in the website footer.
- **Default Master Security PIN:** `99544` (Hashed with SHA-256).

### 3.2 Departmental Taxonomy & Module Breakdown

#### Department 1: IT Infrastructure & ITSM (8 Modules)
1. **Network & Server Infrastructure:** Monitor regional enterprise servers, bank network routers, and LAN switches.
2. **Hardware & AMC Registry:** Manage IT asset serial numbers, warranty status, and AMC contracts (e.g. Punjab National Bank 50+ branches).
3. **Service Ticket Dispatch & SLA Tracking:** Log, assign, and track IT support tickets with SLA countdown timers.
4. **ITSM Software License Manager:** Maintain records of operating systems, antivirus licenses, Tally subscriptions, and renewals.
5. **Vendor & GeM Procurement Hub:** Manage OEM suppliers, GeM portal registrations, and hardware purchase orders.
6. **Client Management & Contract Renewals:** Enterprise CRM for commercial clients, government offices, and institutions.
7. **Quotation & Commercial Estimate Builder:** Generate professional IT & solar price quotes with instant PDF export.
8. **Statutory Compliance & Document Manager:** Store and retrieve MSME Udyam certificates, GST registrations, municipal licenses, and audit documents.

#### Department 2: Renewable Energy & Solar EPC (5 Modules)
9. **Solar Project Portfolio Tracker:** Track ongoing and completed rooftop solar installations across Cachar, Karimganj, and Hailakandi.
10. **Rooftop Solar BOQ & Design Calculator:** Solar Bill of Quantities builder (panels, inverters, cables, mounting structures).
11. **Solar EPC Milestones & Grid Interconnection:** Track APDCL net-metering approvals, site inspections, and grid synchronizations.
12. **Lead Management & Omnichannel CRM:** Capture and qualify solar inquiries arriving from IndiaMART, Justdial, Google, and website forms.
13. **Sub-contractor & Vendor Hub:** Manage local electrical installation crews, civil work contractors, and material logistics.

#### Department 3: Corporate Operations & Core Administration (11 Modules)
14. **Executive Dashboard & Financial KPI Center:** Key performance indicators, monthly turnover, active tickets, and energy capacity metrics.
15. **User Management & Global RBAC Matrix:** Manage staff roles (Administrator, SuperAdministrator, Resident Engineer, Accounts Staff) and enforce modification permissions.
16. **Cash & Bank Journal Vouchers:** Record cash inflows/outflows, bank transfers, and expense vouchers.
17. **Invoicing & GST Tax Receipt Generator:** Create GST-compliant tax invoices (`18ASTPR6755J1Z0`) with line items and automatic totals.
18. **Employee HR & Payroll System:** Manage employee master profiles, salary structures, deductions, and monthly pay slips.
19. **Staff Leave Register:** Track casual leave, medical leave, and attendance registers for resident engineers.
20. **Inventory & Hardware Stock Manager:** Manage stock counts for IT hardware (SSDs, RAM, routers) and Solar EPC components.
21. **Multi-Departmental Workflow Approvals:** Multi-stage sign-off queue for quotes, expenses, and major procurement.
22. **Automated Data Backup, Export & Instant JSON Restore:** Export full system state as a tamper-evident JSON payload and restore backups instantly.
23. **Tamper-Evident Security Audit Logs:** Real-time logging of user actions, logins, updates, and deletions for security auditing.
24. **Security Shield & Access Control Settings:** Change master PINs, manage session timeouts, and toggle strict admin-only lock modes.

---

## 4. Developer & Maintenance Guide

### 4.1 Local Development Commands
Run all commands inside the project root (`d:\Projects\IT_website_MCP`):

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run full project production build
npm run build

# Run linter
npm run lint

# Run ERP Self-Audit Test Suite (55 automated tests)
npm test
```

### 4.2 GitHub Source Code Synchronization
The complete source code is version-controlled on GitHub:
- **Repository URL:** `https://github.com/Hellotamal/mscomputerplanet.git`
- **Primary Branch:** `main`

To pull the latest code or push new changes:
```bash
git pull origin main
git add .
git commit -m "your commit message"
git push origin main
```

---

## 5. Emergency Backup & Recovery Procedure

1. Open the ERP Suite (`#erp`).
2. Log in using the master PIN (`99544`).
3. Navigate to **Data Backup & Restore** module (in Corporate Core department).
4. Click **Export Enterprise Backup (JSON)**. A file named `ms_computer_planet_erp_backup_YYYY-MM-DD.json` will download automatically.
5. Store this file in a safe location. To restore state on any browser or computer, open the same module and click **Import Enterprise Backup**.

---

*Documentation compiled for M/S COMPUTER PLANET (Silchar, Assam, India).*
