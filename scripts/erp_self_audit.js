// M/S COMPUTER PLANET - ERP Package Comprehensive Self-Audit & Automated Test Suite
import { 
  escapeHtml, 
  sha256, 
  DEFAULT_PIN_HASH, 
  generateEntityId 
} from '../src/erp/erpSecurity.js';

// Setup Mock Browser Environment for Node.js
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear()
};

const mockSession = new Map();
globalThis.sessionStorage = {
  getItem: (key) => mockSession.get(key) || null,
  setItem: (key, val) => mockSession.set(key, String(val)),
  removeItem: (key) => mockSession.delete(key),
  clear: () => mockSession.clear()
};

import {
  loadErpData,
  saveErpData,
  DEFAULT_MENU_MODIFICATION_POLICY,
  canModifyMenu,
  INITIAL_USERS,
  INITIAL_EMPLOYEES,
  INITIAL_LEAVES,
  INITIAL_PAYROLL,
  INITIAL_TICKETS,
  INITIAL_AMC_CONTRACTS,
  INITIAL_INVENTORY,
  INITIAL_INVOICES,
  INITIAL_QUOTATIONS,
  INITIAL_SOLAR_PROJECTS,
  INITIAL_CLIENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_LEADS,
  INITIAL_ENGINEERING_DESIGNS,
  INITIAL_ITSM_DATA,
  INITIAL_ENTERPRISE_PROJECTS,
  INITIAL_PROCUREMENT_DATA,
  INITIAL_VENDORS_DATA,
  INITIAL_DOCUMENTS_DATA,
  INITIAL_WORKFLOW_APPROVALS,
  exportAllErpData,
  importAllErpData,
  recordAuditLog,
  getAuditLogs
} from '../src/erp/erpStorage.js';

// Audit Results Tracker
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function assert(condition, testName, detail = '') {
  if (condition) {
    results.passed++;
    results.tests.push({ status: 'PASS', name: testName, detail });
    console.log(`  [PASS] ${testName}`);
  } else {
    results.failed++;
    results.tests.push({ status: 'FAIL', name: testName, detail });
    console.error(`  [FAIL] ${testName} - ${detail}`);
  }
}

async function runAllAudits() {
  console.log('===============================================================');
  console.log(' M/S COMPUTER PLANET - ERP PACKAGE SELF-AUDIT & TEST SUITE');
  console.log(' Silchar, Assam | Enterprise ERP v2.6.0');
  console.log('===============================================================\n');

  // --- SECTION 1: DATA SEED & REPOSITORY INTEGRITY AUDIT ---
  console.log('>>> [1/5] Running Data Schema & Seed Integrity Audit...');
  
  assert(Array.isArray(INITIAL_USERS) && INITIAL_USERS.length >= 3, 
    'INITIAL_USERS contains at least 3 active staff accounts');
  assert(INITIAL_USERS.some(u => u.username === 'admin' && u.role.includes('Admin')), 
    'Default administrator account exists with Administrator role');

  assert(Array.isArray(INITIAL_EMPLOYEES) && INITIAL_EMPLOYEES.length >= 3, 
    'INITIAL_EMPLOYEES contains resident engineers and staff');
  assert(Array.isArray(INITIAL_LEAVES) && INITIAL_LEAVES.length >= 2, 
    'INITIAL_LEAVES contains staff leave registers');
  assert(Array.isArray(INITIAL_PAYROLL) && INITIAL_PAYROLL.length >= 2, 
    'INITIAL_PAYROLL contains salary slips and deductions');
  assert(Array.isArray(INITIAL_TRANSACTIONS) && INITIAL_TRANSACTIONS.length >= 2, 
    'INITIAL_TRANSACTIONS contains cash/bank journal vouchers');
  
  assert(Array.isArray(INITIAL_CLIENTS) && INITIAL_CLIENTS.length >= 4, 
    'INITIAL_CLIENTS contains key regional enterprise accounts');
  assert(INITIAL_CLIENTS.some(c => c.name.includes('Punjab National Bank')), 
    'PNB 50-branch account exists in client dataset');

  assert(Array.isArray(INITIAL_TICKETS) && INITIAL_TICKETS.length >= 3, 
    'INITIAL_TICKETS contains SLA-tracked service tickets');
  assert(INITIAL_TICKETS.every(t => t.id && t.clientName && t.status), 
    'All tickets possess required fields (id, clientName, status)');

  assert(Array.isArray(INITIAL_AMC_CONTRACTS) && INITIAL_AMC_CONTRACTS.length >= 3, 
    'INITIAL_AMC_CONTRACTS contains comprehensive banking AMCs');
  
  assert(Array.isArray(INITIAL_INVENTORY) && INITIAL_INVENTORY.length >= 5, 
    'INITIAL_INVENTORY contains IT hardware and solar components');
  assert(INITIAL_INVENTORY.every(i => i.id && i.name && typeof i.stock === 'number' && i.stock >= 0), 
    'All inventory items have valid stock counts >= 0');

  assert(Array.isArray(INITIAL_INVOICES) && INITIAL_INVOICES.length >= 2, 
    'INITIAL_INVOICES contains GST compliant tax invoices');
  assert(INITIAL_INVOICES.every(inv => inv.id && inv.clientName && Array.isArray(inv.items)), 
    'Invoices have line items array and client references');

  assert(Array.isArray(INITIAL_QUOTATIONS) && INITIAL_QUOTATIONS.length >= 2, 
    'INITIAL_QUOTATIONS contains valid estimates');

  assert(Array.isArray(INITIAL_SOLAR_PROJECTS) && INITIAL_SOLAR_PROJECTS.length >= 2, 
    'INITIAL_SOLAR_PROJECTS contains active EPC installations');
  assert(INITIAL_SOLAR_PROJECTS.every(s => s.id && (s.customer || s.clientName)), 
    'Solar projects have valid identifiers and customer references');

  assert(Array.isArray(INITIAL_LEADS) && INITIAL_LEADS.length >= 3, 
    'INITIAL_LEADS contains omnichannel inquiries (IndiaMART, Justdial, Google)');

  assert(Array.isArray(INITIAL_ENGINEERING_DESIGNS) && INITIAL_ENGINEERING_DESIGNS.length >= 2, 
    'INITIAL_ENGINEERING_DESIGNS contains solar BOQ designs');

  assert(INITIAL_ITSM_DATA && typeof INITIAL_ITSM_DATA === 'object', 
    'INITIAL_ITSM_DATA structure exists');
  assert(Array.isArray(INITIAL_ITSM_DATA.hardware) && Array.isArray(INITIAL_ITSM_DATA.software), 
    'ITSM Suite contains hardware and software license registries');

  assert(Array.isArray(INITIAL_ENTERPRISE_PROJECTS) && INITIAL_ENTERPRISE_PROJECTS.length >= 2, 
    'INITIAL_ENTERPRISE_PROJECTS contains EPC milestones');

  assert(INITIAL_PROCUREMENT_DATA && typeof INITIAL_PROCUREMENT_DATA === 'object', 
    'INITIAL_PROCUREMENT_DATA structure exists');

  assert(Array.isArray(INITIAL_VENDORS_DATA) && INITIAL_VENDORS_DATA.length >= 3, 
    'INITIAL_VENDORS_DATA contains OEM and GeM vendors');

  assert(Array.isArray(INITIAL_DOCUMENTS_DATA) && INITIAL_DOCUMENTS_DATA.length >= 2, 
    'INITIAL_DOCUMENTS_DATA contains statutory compliance docs');

  assert(Array.isArray(INITIAL_WORKFLOW_APPROVALS) && INITIAL_WORKFLOW_APPROVALS.length >= 2, 
    'INITIAL_WORKFLOW_APPROVALS contains pending sign-off items');

  console.log('');

  // --- SECTION 2: ACCESS CONTROL & PERMISSION EVALUATOR AUDIT ---
  console.log('>>> [2/5] Running RBAC & Modification Permission Evaluator Audit...');

  const adminUser = { username: 'admin', role: 'Admin', name: 'Tamal Kanti Dey' };
  const superAdminUser = { username: 'superadmin', role: 'SuperAdministrator', name: 'Director' };
  const staffEngineer = { username: 'debashis', role: 'Hardware Engineer', name: 'Debashis Nandi' };
  const staffAccounts = { username: 'sunita', role: 'Accounts Executive', name: 'Sunita Paul' };

  // 1. Strict admin-only policy check
  assert(DEFAULT_MENU_MODIFICATION_POLICY.strictAdminOnly === true, 
    'Default Policy has strictAdminOnly enabled by default');
  
  const allMenuIds = Object.keys(DEFAULT_MENU_MODIFICATION_POLICY.menuPolicies);
  assert(allMenuIds.length === 24, 
    `Policy matrix covers all 24 ERP modules (Found: ${allMenuIds.length})`);

  // Admin and SuperAdmin permissions
  let adminPassedAll = true;
  for (const mId of allMenuIds) {
    if (!canModifyMenu(adminUser, mId)) {
      adminPassedAll = false;
      break;
    }
  }
  assert(adminPassedAll, 'Administrator has modification access across all 24 ERP menus');

  let superAdminPassedAll = true;
  for (const mId of allMenuIds) {
    if (!canModifyMenu(superAdminUser, mId)) {
      superAdminPassedAll = false;
      break;
    }
  }
  assert(superAdminPassedAll, 'SuperAdministrator has modification access across all 24 ERP menus');

  // Staff in Strict Admin-Only Mode
  let staffBlockedAll = true;
  for (const mId of allMenuIds) {
    if (canModifyMenu(staffEngineer, mId)) {
      staffBlockedAll = false;
      break;
    }
  }
  assert(staffBlockedAll, 'Staff engineer is locked out of modifications in Strict Admin-Only mode');

  assert(!canModifyMenu(staffAccounts, 'invoices'), 'Staff accounts user cannot modify invoices');
  assert(!canModifyMenu(null, 'crm'), 'Null/unauthenticated user is denied modification access');
  assert(!canModifyMenu(undefined, 'inventory'), 'Undefined user is denied modification access');

  // Staff when Strict Admin-Only is disabled (Custom granular policy)
  const customPolicy = {
    strictAdminOnly: false,
    menuPolicies: {
      tickets: { id: 'tickets', adminOnly: false },
      invoices: { id: 'invoices', adminOnly: true }
    }
  };
  saveErpData('menu_modification_policy', customPolicy);

  assert(canModifyMenu(staffEngineer, 'tickets') === true, 
    'Granular Policy: Staff permitted to edit tickets when specifically unlocked');
  assert(canModifyMenu(staffEngineer, 'invoices') === false, 
    'Granular Policy: Staff strictly blocked from invoices when locked to Admin');

  // Reset to default policy
  saveErpData('menu_modification_policy', DEFAULT_MENU_MODIFICATION_POLICY);
  console.log('');

  // --- SECTION 3: STORAGE SERIALIZATION & BACKUP RESTORE AUDIT ---
  console.log('>>> [3/5] Running Storage, Backup & Restore Audit...');

  // Test saveErpData and loadErpData
  const testKey = 'audit_test_key';
  const testPayload = [{ id: 1, test: 'Barak Valley Solar' }];
  saveErpData(testKey, testPayload);
  const loaded = loadErpData(testKey, []);
  assert(loaded.length === 1 && loaded[0].test === 'Barak Valley Solar', 
    'saveErpData and loadErpData serialize and deserialize state faithfully');

  // Test exportAllErpData
  const backupJson = exportAllErpData();
  assert(typeof backupJson === 'string' && backupJson.length > 500, 
    'exportAllErpData generates valid non-empty JSON backup');

  let parsedBackup;
  try {
    parsedBackup = JSON.parse(backupJson);
  } catch {
    parsedBackup = null;
  }
  assert(parsedBackup !== null, 'Backup payload parses as valid JSON');
  assert(parsedBackup.firm && parsedBackup.firm.includes('COMPUTER PLANET'), 
    'Backup contains valid enterprise firm signature ("M/S COMPUTER PLANET")');
  assert(Array.isArray(parsedBackup.users) && Array.isArray(parsedBackup.clients), 
    'Backup includes core users and client datasets directly');

  // Test importAllErpData
  const importResult = importAllErpData(backupJson);
  assert(importResult === true, 'importAllErpData successfully restores valid backup');

  // Test importAllErpData resilience against invalid JSON
  const badImport1 = importAllErpData('{ invalid: json ]');
  assert(badImport1 === false, 'importAllErpData rejects malformed JSON gracefully');

  const badImport2 = importAllErpData(JSON.stringify({ notAnErpBackup: true }));
  assert(badImport2 === false, 'importAllErpData rejects foreign JSON lacking ERP signature');

  console.log('');

  // --- SECTION 4: SECURITY ENGINE & SANITIZATION AUDIT ---
  console.log('>>> [4/5] Running Security, Sanitization & Hashing Audit...');

  // XSS Injection Sanitization Tests
  const xssPayloads = [
    { input: '<script>alert("XSS")</script>', expected: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;' },
    { input: '<img src=x onerror=alert(1)>', expected: '&lt;img src=x onerror=alert(1)&gt;' },
    { input: `Tom's "Hardware" & Cables`, expected: 'Tom&#039;s &quot;Hardware&quot; &amp; Cables' },
    { input: null, expected: '' },
    { input: undefined, expected: '' }
  ];

  let xssAllPassed = true;
  for (const p of xssPayloads) {
    const escaped = escapeHtml(p.input);
    if (escaped !== p.expected) {
      xssAllPassed = false;
      console.error(`  XSS Mismatch: input: "${p.input}", got: "${escaped}", expected: "${p.expected}"`);
    }
  }
  assert(xssAllPassed, 'escapeHtml strictly neutralizes script tags, attributes, and quotes');

  // SHA-256 Hashing Verification
  const pinHash = await sha256('99544');
  assert(pinHash === DEFAULT_PIN_HASH, 
    'sha256 matches pre-computed master default PIN hash ("99544")');

  // Entity ID Generator
  const idTck = generateEntityId('TCK');
  assert(idTck.startsWith('TCK-') && idTck.length >= 8, 
    'generateEntityId formats ID with correct prefix and entropy (e.g. TCK-...)');

  // Audit Log recording
  recordAuditLog('TEST_EVENT', 'AuditSuite', 'Self-audit automated test event recorded');
  const logs = getAuditLogs();
  assert(Array.isArray(logs) && logs.length > 0, 
    'Tamper-evident audit logs record events and can be retrieved');
  assert(logs[0].action === 'TEST_EVENT', 
    'Most recent audit entry matches logged event action');

  console.log('');

  // --- SECTION 5: DEPARTMENTAL TAXONOMY & MENU ROUTING AUDIT ---
  console.log('>>> [5/5] Running Departmental Taxonomy & Menu Routing Audit...');

  const itMenus = allMenuIds.filter(id => DEFAULT_MENU_MODIFICATION_POLICY.menuPolicies[id].dept === 'IT');
  const solarMenus = allMenuIds.filter(id => DEFAULT_MENU_MODIFICATION_POLICY.menuPolicies[id].dept === 'Solar');
  const coreMenus = allMenuIds.filter(id => DEFAULT_MENU_MODIFICATION_POLICY.menuPolicies[id].dept === 'Core');

  assert(itMenus.length >= 6, `IT Infrastructure & ITSM department has ${itMenus.length} categorized menus`);
  assert(solarMenus.length >= 5, `Renewable Energy & Solar department has ${solarMenus.length} categorized menus`);
  assert(coreMenus.length >= 8, `Corporate Operations & Core department has ${coreMenus.length} categorized menus`);

  // --- SECTION 6: COMPONENT MODULES & TAB BINDINGS AUDIT ---
  console.log('>>> [6/6] Running Component Modules & Tab Bindings Audit...');

  const fs = await import('fs');
  const path = await import('path');

  const erpComponentFiles = [
    'CRMModule.jsx',
    'EngineeringModule.jsx',
    'ITSMModule.jsx',
    'TicketsModule.jsx',
    'AMCModule.jsx',
    'InventoryModule.jsx',
    'InvoiceModule.jsx',
    'QuotationModule.jsx',
    'SolarProjectsModule.jsx',
    'PNBAssetModule.jsx',
    'UsersModule.jsx',
    'HRMSModule.jsx',
    'ClientsModule.jsx',
    'ReportsModule.jsx',
    'AccountsModule.jsx',
    'ProjectsModule.jsx',
    'ProcurementModule.jsx',
    'VendorsModule.jsx',
    'DocumentModule.jsx',
    'CustomerPortalModule.jsx',
    'EmployeePortalModule.jsx',
    'WorkflowModule.jsx',
    'MISModule.jsx',
    'ERPLogin.jsx',
    'ERPApp.jsx'
  ];

  let componentsVerified = 0;
  for (const file of erpComponentFiles) {
    const fullPath = path.resolve('src/erp', file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('export default') && content.length > 500) {
        componentsVerified++;
      } else {
        console.error(`  Component ${file} is missing standard default export!`);
      }
    } else {
      console.error(`  Component file ${file} does not exist!`);
    }
  }

  assert(componentsVerified === erpComponentFiles.length, 
    `All ${erpComponentFiles.length} ERP JSX component files exist with valid default exports (Verified: ${componentsVerified})`);

  // Verify ERPApp contains tab handlers for every policy menu
  const erpAppContent = fs.readFileSync(path.resolve('src/erp/ERPApp.jsx'), 'utf8');
  let missingTabHandlers = [];
  for (const mId of allMenuIds) {
    // Map policy ID to ERPApp tab key
    const tabKey = mId === 'solar' || mId === 'solar_projects' ? 'solar' : mId;
    if (!erpAppContent.includes(`activeTab === '${tabKey}'`) && !erpAppContent.includes(`activeTab === "${tabKey}"`)) {
      missingTabHandlers.push(mId);
    }
  }

  assert(missingTabHandlers.length === 0, 
    `All 24 ERP policy menus have activeTab handlers in ERPApp.jsx (Missing: ${missingTabHandlers.join(', ') || 'None'})`);

  console.log('\n===============================================================');
  console.log(` AUDIT SUMMARY: ${results.passed} PASSED | ${results.failed} FAILED | ${results.warnings} WARNINGS`);
  console.log('===============================================================\n');

  if (results.failed > 0) {
    console.error(`❌ Self-audit detected ${results.failed} failures.`);
    process.exit(1);
  } else {
    console.log('✅ ALL SELF-AUDIT TESTS PASSED SUCCESSFULLY! ERP PACKAGE IS OPERATIONAL.');
  }
}

runAllAudits().catch(err => {
  console.error('Fatal audit runner error:', err);
  process.exit(1);
});
