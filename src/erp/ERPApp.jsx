import React, { useState, useEffect } from 'react';
import { 
  loadErpData, 
  saveErpData, 
  INITIAL_TICKETS, 
  INITIAL_AMC_CONTRACTS, 
  INITIAL_INVENTORY, 
  INITIAL_INVOICES, 
  INITIAL_QUOTATIONS,
  INITIAL_SOLAR_PROJECTS,
  INITIAL_USERS,
  INITIAL_EMPLOYEES,
  INITIAL_LEAVES,
  INITIAL_PAYROLL,
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
  setErpPin,
  recordAuditLog
} from './erpStorage';
import { 
  generateSecureSession, 
  validateSecureSession, 
  updateSessionActivity, 
  terminateSecureSession 
} from './erpSecurity';
import CRMModule from './CRMModule';
import EngineeringModule from './EngineeringModule';
import ITSMModule from './ITSMModule';
import TicketsModule from './TicketsModule';
import AMCModule from './AMCModule';
import InventoryModule from './InventoryModule';
import InvoiceModule from './InvoiceModule';
import QuotationModule from './QuotationModule';
import SolarProjectsModule from './SolarProjectsModule';
import PNBAssetModule from './PNBAssetModule';
import UsersModule from './UsersModule';
import HRMSModule from './HRMSModule';
import ClientsModule from './ClientsModule';
import ReportsModule from './ReportsModule';
import AccountsModule from './AccountsModule';
import ProjectsModule from './ProjectsModule';
import ProcurementModule from './ProcurementModule';
import VendorsModule from './VendorsModule';
import DocumentModule from './DocumentModule';
import CustomerPortalModule from './CustomerPortalModule';
import EmployeePortalModule from './EmployeePortalModule';
import WorkflowModule from './WorkflowModule';
import MISModule from './MISModule';
import ERPLogin from './ERPLogin';
import { 
  LayoutDashboard, 
  Wrench, 
  Building2, 
  Package, 
  FileText, 
  ClipboardList,
  SunMedium, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  Download, 
  Upload, 
  ShieldCheck, 
  IndianRupee,
  Layers,
  KeyRound,
  CheckCircle2,
  Landmark,
  Users,
  UserCheck,
  Briefcase,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  MapPin,
  Calendar,
  FileSpreadsheet,
  Target,
  Calculator,
  Server,
  Truck,
  ShoppingCart,
  FolderOpen,
  CheckSquare,
  TrendingUp,
  Zap
} from 'lucide-react';

export default function ERPApp({ onExit }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const session = validateSecureSession();
    return session && session.isValid ? session.user : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const session = validateSecureSession();
    return session && session.isValid;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [hrmsSubTab, setHrmsSubTab] = useState('directory');
  const [clientSubCategory, setClientSubCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClientsExpanded, setIsClientsExpanded] = useState(true);
  const [isHrmsExpanded, setIsHrmsExpanded] = useState(false);

  // Inactivity Auto-Lockout (15 minutes idle timeout)
  useEffect(() => {
    if (!isAuthenticated) return;

    let throttleTimer = null;
    const handleUserActivity = () => {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          updateSessionActivity();
          throttleTimer = null;
        }, 5000);
      }
    };

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(evt => window.addEventListener(evt, handleUserActivity, { passive: true }));

    const sessionChecker = setInterval(() => {
      const activeSession = validateSecureSession();
      if (!activeSession || !activeSession.isValid) {
        terminateSecureSession();
        recordAuditLog("SESSION_AUTO_LOCK", "Security", "Session automatically locked after 15 minutes of idle inactivity.");
        sessionStorage.removeItem("mcp_erp_terminal_unlocked");
        setCurrentUser(null);
        setIsAuthenticated(false);
        alert("Security Auto-Lock: You have been logged out due to 15 minutes of inactivity.");
      }
    }, 15000);

    return () => {
      if (throttleTimer) clearTimeout(throttleTimer);
      activityEvents.forEach(evt => window.removeEventListener(evt, handleUserActivity));
      clearInterval(sessionChecker);
    };
  }, [isAuthenticated]);

  // Persistent States
  const [users, setUsers] = useState(() => loadErpData("users", INITIAL_USERS));
  const [employees, setEmployees] = useState(() => loadErpData("employees", INITIAL_EMPLOYEES));
  const [leaves, setLeaves] = useState(() => loadErpData("leaves", INITIAL_LEAVES));
  const [payroll, setPayroll] = useState(() => loadErpData("payroll", INITIAL_PAYROLL));
  const [tickets, setTickets] = useState(() => loadErpData("tickets", INITIAL_TICKETS));
  const [amcContracts, setAmcContracts] = useState(() => loadErpData("amc", INITIAL_AMC_CONTRACTS));
  const [inventory, setInventory] = useState(() => loadErpData("inventory", INITIAL_INVENTORY));
  const [invoices, setInvoices] = useState(() => loadErpData("invoices", INITIAL_INVOICES));
  const [quotations, setQuotations] = useState(() => loadErpData("quotations", INITIAL_QUOTATIONS));
  const [solarProjects, setSolarProjects] = useState(() => loadErpData("solar_projects", INITIAL_SOLAR_PROJECTS));
  const [clients, setClients] = useState(() => loadErpData("clients", INITIAL_CLIENTS));
  const [transactions, setTransactions] = useState(() => loadErpData("transactions", INITIAL_TRANSACTIONS));
  const [leads, setLeads] = useState(() => loadErpData("leads", INITIAL_LEADS));
  const [engineeringDesigns, setEngineeringDesigns] = useState(() => loadErpData("engineering_designs", INITIAL_ENGINEERING_DESIGNS));
  const [itsmData, setItsmData] = useState(() => loadErpData("itsm_data", INITIAL_ITSM_DATA));
  const [enterpriseProjects, setEnterpriseProjects] = useState(() => loadErpData("enterprise_projects", INITIAL_ENTERPRISE_PROJECTS));
  const [procurementData, setProcurementData] = useState(() => loadErpData("procurement_data", INITIAL_PROCUREMENT_DATA));
  const [vendorsData, setVendorsData] = useState(() => loadErpData("vendors_data", INITIAL_VENDORS_DATA));
  const [documentsData, setDocumentsData] = useState(() => loadErpData("documents_data", INITIAL_DOCUMENTS_DATA));
  const [workflowApprovals, setWorkflowApprovals] = useState(() => loadErpData("workflow_approvals", INITIAL_WORKFLOW_APPROVALS));

  // Sync to local storage on state change
  useEffect(() => { saveErpData("users", users); }, [users]);
  useEffect(() => { saveErpData("employees", employees); }, [employees]);
  useEffect(() => { saveErpData("leaves", leaves); }, [leaves]);
  useEffect(() => { saveErpData("payroll", payroll); }, [payroll]);
  useEffect(() => { saveErpData("tickets", tickets); }, [tickets]);
  useEffect(() => { saveErpData("amc", amcContracts); }, [amcContracts]);
  useEffect(() => { saveErpData("inventory", inventory); }, [inventory]);
  useEffect(() => { saveErpData("invoices", invoices); }, [invoices]);
  useEffect(() => { saveErpData("quotations", quotations); }, [quotations]);
  useEffect(() => { saveErpData("solar_projects", solarProjects); }, [solarProjects]);
  useEffect(() => { saveErpData("clients", clients); }, [clients]);
  useEffect(() => { saveErpData("transactions", transactions); }, [transactions]);
  useEffect(() => { saveErpData("leads", leads); }, [leads]);
  useEffect(() => { saveErpData("engineering_designs", engineeringDesigns); }, [engineeringDesigns]);
  useEffect(() => { saveErpData("itsm_data", itsmData); }, [itsmData]);
  useEffect(() => { saveErpData("enterprise_projects", enterpriseProjects); }, [enterpriseProjects]);
  useEffect(() => { saveErpData("procurement_data", procurementData); }, [procurementData]);
  useEffect(() => { saveErpData("vendors_data", vendorsData); }, [vendorsData]);
  useEffect(() => { saveErpData("documents_data", documentsData); }, [documentsData]);
  useEffect(() => { saveErpData("workflow_approvals", workflowApprovals); }, [workflowApprovals]);

  // Settings State
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState('');

  const handleLoginSuccess = (authenticatedUser) => {
    // Refresh users from storage in case user was registered or password was reset on login screen
    setUsers(loadErpData("users", INITIAL_USERS));
    generateSecureSession(authenticatedUser);
    setCurrentUser(authenticatedUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    terminateSecureSession();
    sessionStorage.removeItem("mcp_erp_terminal_unlocked");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportAllErpData());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mcp_erp_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importAllErpData(event.target.result);
      if (success) {
        setUsers(loadErpData("users", INITIAL_USERS));
        setEmployees(loadErpData("employees", INITIAL_EMPLOYEES));
        setLeaves(loadErpData("leaves", INITIAL_LEAVES));
        setPayroll(loadErpData("payroll", INITIAL_PAYROLL));
        setTickets(loadErpData("tickets", INITIAL_TICKETS));
        setAmcContracts(loadErpData("amc", INITIAL_AMC_CONTRACTS));
        setInventory(loadErpData("inventory", INITIAL_INVENTORY));
        setInvoices(loadErpData("invoices", INITIAL_INVOICES));
        setQuotations(loadErpData("quotations", INITIAL_QUOTATIONS));
        setSolarProjects(loadErpData("solar_projects", INITIAL_SOLAR_PROJECTS));
        setClients(loadErpData("clients", INITIAL_CLIENTS));
        setTransactions(loadErpData("transactions", INITIAL_TRANSACTIONS));
        setLeads(loadErpData("leads", INITIAL_LEADS));
        setEngineeringDesigns(loadErpData("engineering_designs", INITIAL_ENGINEERING_DESIGNS));
        setItsmData(loadErpData("itsm_data", INITIAL_ITSM_DATA));
        setEnterpriseProjects(loadErpData("enterprise_projects", INITIAL_ENTERPRISE_PROJECTS));
        setProcurementData(loadErpData("procurement_data", INITIAL_PROCUREMENT_DATA));
        setVendorsData(loadErpData("vendors_data", INITIAL_VENDORS_DATA));
        setDocumentsData(loadErpData("documents_data", INITIAL_DOCUMENTS_DATA));
        setWorkflowApprovals(loadErpData("workflow_approvals", INITIAL_WORKFLOW_APPROVALS));
        alert("ERP Data successfully restored from backup!");
      } else {
        alert("Invalid backup file format or security policy violation.");
      }
    };
    reader.readAsText(file);
  };

  const handleUpdatePin = async (e) => {
    e.preventDefault();
    if (newPinInput.length >= 4) {
      await setErpPin(newPinInput);
      setPinChangeMsg('PIN updated successfully with salted SHA-256 hash!');
      setNewPinInput('');
      setTimeout(() => setPinChangeMsg(''), 3000);
    } else {
      alert('PIN must be at least 4 digits.');
    }
  };

  // Administrator verification check (Proprietor / Full Admin Role)
  const isAdmin = Boolean(
    currentUser && (
      currentUser.username?.toLowerCase() === 'admin' ||
      (currentUser.role && currentUser.role.toLowerCase().includes('admin'))
    )
  );

  if (!isAuthenticated) {
    return <ERPLogin onLoginSuccess={handleLoginSuccess} onBackToSite={onExit} />;
  }

  // Dashboard Aggregates
  const totalAmcRevenue = amcContracts.reduce((acc, c) => acc + (Number(c.annualValue) || 0), 0);
  const totalInventoryVal = inventory.reduce((acc, i) => acc + (i.stock * i.sellPrice), 0);
  const totalSolarKw = solarProjects.reduce((acc, p) => acc + (Number(p.capacityKw) || 0), 0);
  const openTicketsCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  const pendingQuotesCount = quotations.filter(q => q.status === 'Sent' || q.status === 'Draft').length;
  const pendingLeavesCount = leaves.filter(l => l.status === 'Pending').length;
  const activeLeads = leads.filter(l => l.stage !== 'Won' && l.stage !== 'Lost');
  const activeLeadsCount = activeLeads.length;
  const totalPipelineVal = activeLeads.reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);

  // Filter tabs based on currentUser permissions if set (Admin-only for users & settings)
  const hasTabPermission = (tabId) => {
    if (tabId === 'users' || tabId === 'settings') {
      return isAdmin;
    }
    if (isAdmin) return true;
    if (!currentUser || !currentUser.permissions || currentUser.permissions.length === 0) return true;
    return currentUser.permissions.includes(tabId);
  };

  // Left Sidebar Menu & Submenu Navigation Hierarchy
  const navSections = [
    {
      title: "Core & Intelligence",
      items: [
        { id: 'dashboard', name: 'Executive Overview', icon: LayoutDashboard },
        { id: 'mis', name: '16. MIS & Intelligence', icon: TrendingUp, badge: 'Executive', badgeColor: 'bg-indigo-600 text-white' },
        { 
          id: 'workflow', 
          name: '15. Workflow & Approvals', 
          icon: CheckSquare, 
          badge: workflowApprovals.filter(a => a.status === 'Pending').length > 0 ? workflowApprovals.filter(a => a.status === 'Pending').length : null, 
          badgeColor: 'bg-amber-500 text-slate-950' 
        }
      ]
    },
    {
      title: "Commercial & Pre-Sales",
      items: [
        { 
          id: 'crm', 
          name: '1. CRM & Leads', 
          icon: Target, 
          badge: activeLeadsCount > 0 ? activeLeadsCount : null, 
          badgeColor: 'bg-violet-500 text-white' 
        },
        { 
          id: 'quotations', 
          name: '2. Sales & Quotations', 
          icon: ClipboardList, 
          badge: pendingQuotesCount > 0 ? pendingQuotesCount : null, 
          badgeColor: 'bg-blue-500 text-white' 
        },
        { 
          id: 'engineering', 
          name: '3. Engineering & Solar', 
          icon: Calculator, 
          badge: engineeringDesigns.length, 
          badgeColor: 'bg-teal-500 text-slate-950' 
        }
      ]
    },
    {
      title: "Operations & Supply-Chain",
      items: [
        { 
          id: 'projects', 
          name: '4. Projects & EPC Execution', 
          icon: Briefcase, 
          badge: enterpriseProjects.length, 
          badgeColor: 'bg-emerald-500 text-slate-950' 
        },
        { 
          id: 'procurement', 
          name: '5. Procurement & POs', 
          icon: ShoppingCart, 
          badge: procurementData?.purchaseOrders?.length || null, 
          badgeColor: 'bg-blue-600 text-white' 
        },
        { 
          id: 'inventory', 
          name: '6. Inventory & Warehouses', 
          icon: Package, 
          badge: inventory.length 
        },
        { 
          id: 'vendors', 
          name: '7. Master Vendor Directory', 
          icon: Truck, 
          badge: (vendorsData || []).length 
        }
      ]
    },
    {
      title: "Financials & After-Sales",
      items: [
        { id: 'invoices', name: '8. Finance & Invoicing', icon: FileText },
        { id: 'accounts', name: 'Accounts & Ledger', icon: IndianRupee, badge: transactions.length, badgeColor: 'bg-teal-500 text-slate-950' },
        { id: 'tickets', name: '9. AMC Service Tickets', icon: Wrench, badge: openTicketsCount > 0 ? openTicketsCount : null, badgeColor: 'bg-rose-500 text-white' },
        { id: 'amc', name: 'AMC Contracts', icon: Building2 },
        { 
          id: 'clients', 
          name: '10. Asset Management', 
          icon: Landmark, 
          badge: clients.length, 
          badgeColor: 'bg-emerald-500 text-slate-950',
          hasSubmenu: true,
          subExpanded: isClientsExpanded,
          toggleSubmenu: () => setIsClientsExpanded(!isClientsExpanded),
          subItems: [
            { id: 'all_clients', name: 'All Enrolled Clients', icon: Layers, badge: clients.length, isCurrent: activeTab === 'clients' && clientSubCategory === 'All', onSelect: () => { setActiveTab('clients'); setClientSubCategory('All'); } },
            { id: 'amc_clients', name: 'Banking & AMC', icon: Landmark, badge: clients.filter(c => c.category === 'AMC').length, isCurrent: activeTab === 'clients' && clientSubCategory === 'AMC', onSelect: () => { setActiveTab('clients'); setClientSubCategory('AMC'); } },
            { id: 'pnb_branch_matrix', name: 'PNB 50-Branch Matrix', icon: Building2, badge: '543', badgeColor: 'bg-amber-500 text-slate-950', isCurrent: activeTab === 'pnb_assets', onSelect: () => { setActiveTab('pnb_assets'); } }
          ]
        }
      ]
    },
    {
      title: "IT Support & Digital Vault",
      items: [
        { 
          id: 'itsm', 
          name: '12. IT Support / ITSM', 
          icon: Server, 
          badge: '11 Tools', 
          badgeColor: 'bg-blue-600 text-white' 
        },
        { 
          id: 'documents', 
          name: '13. DMS Compliance Vault', 
          icon: FolderOpen, 
          badge: (documentsData || []).length, 
          badgeColor: 'bg-indigo-500 text-white' 
        }
      ]
    },
    {
      title: "Portals & Workforce",
      items: [
        { id: 'customer_portal', name: '14a. Customer Portal Desk', icon: ShieldCheck },
        { id: 'employee_portal', name: '14b. Employee Staff Desk', icon: UserCheck },
        { 
          id: 'hrms', 
          name: '11. Staff HRMS & Payroll', 
          icon: Users, 
          badge: employees.length, 
          badgeColor: 'bg-emerald-500 text-slate-950',
          hasSubmenu: true,
          subExpanded: isHrmsExpanded,
          toggleSubmenu: () => setIsHrmsExpanded(!isHrmsExpanded),
          subItems: [
            { id: 'directory', name: 'Employee Directory', icon: Users, badge: employees.length, isCurrent: activeTab === 'hrms' && hrmsSubTab === 'directory', onSelect: () => { setActiveTab('hrms'); setHrmsSubTab('directory'); } },
            { id: 'attendance', name: 'Daily Attendance', icon: UserCheck, isCurrent: activeTab === 'hrms' && hrmsSubTab === 'attendance', onSelect: () => { setActiveTab('hrms'); setHrmsSubTab('attendance'); } },
            { id: 'field_visits', name: 'Field Duty Register', icon: MapPin, isCurrent: activeTab === 'hrms' && hrmsSubTab === 'field_visits', onSelect: () => { setActiveTab('hrms'); setHrmsSubTab('field_visits'); } },
            { id: 'leaves', name: 'Leave Requests', icon: Calendar, badge: pendingLeavesCount > 0 ? pendingLeavesCount : null, badgeColor: 'bg-amber-500 text-slate-950', isCurrent: activeTab === 'hrms' && hrmsSubTab === 'leaves', onSelect: () => { setActiveTab('hrms'); setHrmsSubTab('leaves'); } },
            { id: 'payroll', name: 'Payroll & Slips', icon: IndianRupee, isCurrent: activeTab === 'hrms' && hrmsSubTab === 'payroll', onSelect: () => { setActiveTab('hrms'); setHrmsSubTab('payroll'); } }
          ]
        }
      ]
    },
    {
      title: "Governance & Reports",
      items: [
        { id: 'reports', name: 'Reports & Export Centre', icon: FileSpreadsheet },
        ...(isAdmin ? [
          { id: 'users', name: '17. Staff & Roles RBAC', icon: ShieldCheck, badge: users.length, badgeColor: 'bg-indigo-500 text-white' },
          { id: 'settings', name: 'Data & Settings', icon: Settings }
        ] : [])
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex antialiased text-slate-800">
      {/* Mobile Sidebar Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar Menu & Sub-Menus */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 xl:w-72 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Top Brand Area */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 shrink-0">
              CP
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-xs sm:text-sm text-white tracking-tight truncate leading-tight">
                COMPUTER PLANET
              </div>
              <div className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>ERP Suite v2.0</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Operations Menu / Fast Access Hub (Restricted: Administrator Only) */}
        {isAdmin && (
          <div className="p-3 border-b border-slate-800/80 bg-slate-950/40 shrink-0">
            <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-1 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Quick Navigation Hub</span>
              </span>
              <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded-full">Core</span>
            </div>

            <div className="space-y-1.5">
              {/* 1. Clients & Assets Button */}
              <button
                onClick={() => { setActiveTab('clients'); setIsSidebarOpen(false); }}
                className={`w-full px-3 py-2 rounded-xl text-left transition flex items-center justify-between shadow-xs ${
                  activeTab === 'clients'
                    ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300 shadow-md shadow-amber-400/25'
                    : 'bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-500/30'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Landmark className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold truncate">Clients & Assets ({clients.length})</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'clients' ? 'text-slate-950' : 'text-amber-400/70'}`} />
              </button>

              {/* 2. Accounts Ledger Button */}
              <button
                onClick={() => { setActiveTab('accounts'); setIsSidebarOpen(false); }}
                className={`w-full px-3 py-2 rounded-xl text-left transition flex items-center justify-between shadow-xs ${
                  activeTab === 'accounts'
                    ? 'bg-teal-600 text-white font-black ring-2 ring-teal-400 shadow-md shadow-teal-600/25'
                    : 'bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <IndianRupee className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold truncate">Accounts Ledger</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeTab === 'accounts' ? 'bg-teal-950 text-teal-200' : 'bg-teal-900/60 text-teal-300'
                }`}>
                  {transactions.length}
                </span>
              </button>

              {/* 3. Reports Centre Button */}
              <button
                onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }}
                className={`w-full px-3 py-2 rounded-xl text-left transition flex items-center justify-between shadow-xs ${
                  activeTab === 'reports'
                    ? 'bg-blue-600 text-white font-black ring-2 ring-blue-400 shadow-md shadow-blue-600/25'
                    : 'bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileSpreadsheet className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold truncate">Reports Centre</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeTab === 'reports' ? 'bg-blue-950 text-blue-200' : 'bg-blue-900/60 text-blue-300'
                }`}>
                  Audit
                </span>
              </button>

              {/* 4. Active Tickets Button */}
              <button
                onClick={() => { setActiveTab('tickets'); setIsSidebarOpen(false); }}
                className={`w-full px-3 py-2 rounded-xl text-left transition flex items-center justify-between shadow-xs ${
                  activeTab === 'tickets'
                    ? 'bg-emerald-500 text-slate-950 font-black ring-2 ring-emerald-300 shadow-md shadow-emerald-500/25'
                    : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Wrench className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold truncate">Active Tickets</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeTab === 'tickets' 
                    ? 'bg-slate-950 text-emerald-400' 
                    : openTicketsCount > 0 ? 'bg-rose-500 text-white' : 'bg-emerald-900/60 text-emerald-300'
                }`}>
                  {openTicketsCount > 0 ? `${openTicketsCount} Open` : `${tickets.length}`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Navigation Items & Sub-Menus */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
          {navSections.map((section, sIdx) => {
            const visibleItems = section.items.filter(item => hasTabPermission(item.id));
            if (visibleItems.length === 0) return null;

            return (
              <div key={sIdx} className="space-y-1">
                <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500 px-3 py-1">
                  {section.title}
                </div>

                <div className="space-y-1">
                  {visibleItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <div key={item.id} className="space-y-1">
                        <button
                          onClick={() => {
                            if (item.hasSubmenu) {
                              setActiveTab(item.id);
                              if (item.toggleSubmenu) item.toggleSubmenu();
                            } else {
                              setActiveTab(item.id);
                              setIsSidebarOpen(false);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                            isActive
                              ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/30 ring-1 ring-emerald-400/40'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                            <span className="truncate">{item.name}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                            {item.badge && (
                              <span className={`px-1.5 py-0.2 rounded-full font-black text-[10px] ${item.badgeColor || 'bg-amber-500 text-slate-950'}`}>
                                {item.badge}
                              </span>
                            )}
                            {item.hasSubmenu && (
                              <span className="text-slate-400 group-hover:text-white">
                                {item.subExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                              </span>
                            )}
                          </div>
                        </button>

                        {/* Expandable Sub-Menu in the Left Side */}
                        {item.hasSubmenu && item.subExpanded && (
                          <div className="mt-1 ml-3.5 pl-2.5 border-l border-slate-800 space-y-1">
                            {item.subItems.map((sub) => {
                              const SubIcon = sub.icon;
                              const isSubActive = sub.isCurrent;

                              return (
                                <button
                                  key={sub.id}
                                  onClick={() => {
                                    if (sub.onSelect) sub.onSelect();
                                    setIsSidebarOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition ${
                                    isSubActive
                                      ? 'bg-slate-800 text-emerald-400 font-bold border-l-2 border-emerald-400 shadow-xs'
                                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                                    <span className="truncate">{sub.name}</span>
                                  </div>

                                  {sub.badge && (
                                    <span className={`px-1.5 py-0.2 rounded-full font-black text-[9px] ${sub.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                                      {sub.badge}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer: User Card & Direct Actions */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 shrink-0 space-y-2">
          {currentUser && (
            <div 
              onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 cursor-pointer transition text-xs"
              title="Manage Staff & Roles"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs shrink-0">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-white text-xs truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{currentUser.role || 'Staff'}</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={onExit}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700/60 transition"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white text-[11px] font-semibold border border-rose-800/40 transition"
              title="Log Out of ERP"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Right Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="bg-white sticky top-0 z-30 border-b border-slate-200/90 shadow-xs">
          <div className="px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
            {/* Left: Mobile hamburger + Breadcrumb */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition shrink-0"
                title="Open Menu"
                aria-label="Open Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumbs & Active Section Title */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium shrink-0">
                  <span>ERP</span>
                  <span>/</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-sm sm:text-base text-slate-900 truncate">
                    {activeTab === 'dashboard' && 'Operations Dashboard'}
                    {activeTab === 'clients' && (
                      <span>
                        Clients & Assets <span className="text-slate-400 font-normal">/</span> {clientSubCategory === 'All' ? 'All Clients' : clientSubCategory + ' Directory'}
                      </span>
                    )}
                    {activeTab === 'pnb_assets' && 'PNB Asset Matrix (543)'}
                    {activeTab === 'tickets' && 'Service Tickets'}
                    {activeTab === 'amc' && 'AMC Contracts'}
                    {activeTab === 'inventory' && 'Inventory & Spares'}
                    {activeTab === 'invoices' && 'GST Tax Invoices'}
                    {activeTab === 'quotations' && 'Quotations & Estimates'}
                    {activeTab === 'accounts' && 'Accounts & Bookkeeping Ledger'}
                    {activeTab === 'reports' && 'Reports & Downloads Centre'}
                    {activeTab === 'solar' && 'Solar Rooftop Projects'}
                    {activeTab === 'users' && 'Staff & Role Management'}
                    {activeTab === 'hrms' && (
                      <span>
                        Staff HRMS <span className="text-slate-400 font-normal">/</span> {
                          hrmsSubTab === 'directory' ? 'Employee Directory' :
                          hrmsSubTab === 'attendance' ? 'Daily Attendance' :
                          hrmsSubTab === 'field_visits' ? 'Field Duty Register' :
                          hrmsSubTab === 'leaves' ? 'Leave Requests' :
                          'Payroll & Salary Slips'
                        }
                      </span>
                    )}
                    {activeTab === 'settings' && 'Data & Settings'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Top Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportBackup}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition"
                title="Backup ERP database to JSON file"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline">Backup JSON</span>
              </button>

              <button
                onClick={onExit}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
                title="Exit ERP to Website"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Website</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main ERP Workspace Area */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Executive Hero Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>17 Enterprise Domains Active • Computer Planet ERP Suite</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Welcome back, {currentUser?.name?.split(' ')[0] || 'Administrator'}
                  </h1>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                    Barak Valley operations hub: Managing 50 PNB branches, Solar EPC installations with APDCL Net Metering, multi-depot stock, and commercial financials.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 50 PNB Branches Online
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 text-teal-300 font-semibold">
                      <Zap className="w-3.5 h-3.5" /> {solarProjects.reduce((acc, p) => acc + (Number(p.capacityKw) || 0), 0) + enterpriseProjects.filter(p => p.category === 'Solar EPC').reduce((acc, p) => acc + (Number(p.capacityKw) || 0), 0)} kWp Solar Fleet
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 text-sky-300 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Encrypted Session
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setActiveTab('crm')}
                    className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
                  >
                    <Target className="w-4 h-4 text-violet-200" />
                    <span>CRM Lead ({activeLeadsCount})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('engineering')}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
                  >
                    <Calculator className="w-4 h-4 text-teal-200" />
                    <span>Solar Sizing</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('projects')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
                  >
                    <Briefcase className="w-4 h-4 text-emerald-200" />
                    <span>Projects ({enterpriseProjects.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('mis')}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
                  >
                    <TrendingUp className="w-4 h-4 text-indigo-200" />
                    <span>MIS Cockpit</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Core Financial & Fleet KPI Command Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Card 1: Revenue & Pipeline */}
              <div
                onClick={() => setActiveTab('invoices')}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Invoiced Revenue</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  ₹{invoices.reduce((acc, inv) => acc + (Number(inv.grandTotal || inv.totalAmount) || 0), 0).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-emerald-600 font-medium mt-2 flex items-center justify-between">
                  <span>{invoices.length} Tax Invoices</span>
                  <span className="font-mono text-slate-500">Pipeline: ₹{(totalPipelineVal / 100000).toFixed(1)}L</span>
                </div>
              </div>

              {/* Card 2: Banking AMC & 50 Branches */}
              <div
                onClick={() => setActiveTab('amc')}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Banking AMC Fleet</span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                    <Landmark className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  ₹{totalAmcRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-blue-600 font-medium mt-2 flex items-center justify-between">
                  <span>50 PNB Branches</span>
                  <span className="font-mono text-slate-500">543 Devices</span>
                </div>
              </div>

              {/* Card 3: Solar EPC Installed */}
              <div
                onClick={() => setActiveTab('projects')}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solar EPC Deployed</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                    <SunMedium className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {totalSolarKw + enterpriseProjects.filter(p => p.category === 'Solar EPC').reduce((acc, p) => acc + (Number(p.capacityKw) || 0), 0)} <span className="text-sm font-sans font-normal text-slate-500">kWp</span>
                </div>
                <div className="text-xs text-amber-600 font-medium mt-2 flex items-center justify-between">
                  <span>Grid-Tied + Hybrid</span>
                  <span className="font-mono text-slate-500">APDCL Net Meter</span>
                </div>
              </div>

              {/* Card 4: Inventory & Depots */}
              <div
                onClick={() => setActiveTab('inventory')}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Warehouse Stock</span>
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:scale-110 transition-transform">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  ₹{totalInventoryVal.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-teal-600 font-medium mt-2 flex items-center justify-between">
                  <span>{inventory.length} Active SKUs</span>
                  <span className="font-mono text-slate-500">3 Depots</span>
                </div>
              </div>
            </div>

            {/* Active Operations Matrix (Two Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1 & 2: Active Projects & EPC Progress */}
              <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                      <span>Active Projects & EPC Execution Status</span>
                    </h3>
                    <p className="text-xs text-slate-500">Solar grid installations and banking IT network infrastructure in Barak Valley.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    View All Projects →
                  </button>
                </div>

                <div className="space-y-3">
                  {enterpriseProjects.slice(0, 4).map(project => (
                    <div
                      key={project.id}
                      onClick={() => setActiveTab('projects')}
                      className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer space-y-2 border border-slate-200/60 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[10px]">
                            {project.id}
                          </span>
                          <strong className="text-slate-900 truncate">{project.title}</strong>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0 ${
                          project.progress >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {project.progress}% Done
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Client: <strong className="text-slate-700">{project.client}</strong></span>
                        <span className="font-mono">Budget: ₹{(project.budget / 100000).toFixed(2)}L</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Approvals & Service Incidents */}
              <div className="space-y-6">
                {/* Governance Approvals Card */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-amber-500" />
                      <span>Pending Approvals ({workflowApprovals.filter(a => a.status === 'Pending').length})</span>
                    </h4>
                    <button
                      onClick={() => setActiveTab('workflow')}
                      className="text-[11px] font-bold text-amber-600 hover:text-amber-700"
                    >
                      Hub →
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {workflowApprovals.slice(0, 3).map(wf => (
                      <div key={wf.id} className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-slate-500">{wf.type}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            wf.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {wf.status}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-800 truncate">{wf.title}</div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                          <span>By {wf.requestedBy.split(' ')[0]}</span>
                          <span className="font-mono font-bold text-slate-700">₹{wf.amount?.toLocaleString('en-IN') || 'N/A'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Service Calls */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-rose-500" />
                      <span>Support Incidents ({openTicketsCount} Open)</span>
                    </h4>
                    <button
                      onClick={() => setActiveTab('tickets')}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700"
                    >
                      Tickets →
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {tickets.slice(0, 3).map(t => (
                      <div key={t.id} className="p-2.5 bg-slate-50 rounded-xl space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-slate-600">{t.id}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            t.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 truncate">{t.clientName}</div>
                        <div className="text-[11px] text-slate-500 truncate">{t.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise 17-Domain Quick Navigation Hub */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <span>Enterprise 17-Domain Operational Matrix</span>
                </h3>
                <p className="text-xs text-slate-500">Quick-launch any operational pillar across Computer Planet enterprise architecture.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
                <button onClick={() => setActiveTab('crm')} className="p-3 rounded-xl bg-slate-50 hover:bg-violet-50 hover:border-violet-200 border border-slate-200 text-left transition group">
                  <Target className="w-5 h-5 text-violet-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">1. CRM & Leads</div>
                  <div className="text-[10px] text-slate-400">7-Stage Funnel</div>
                </button>

                <button onClick={() => setActiveTab('quotations')} className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 text-left transition group">
                  <ClipboardList className="w-5 h-5 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">2. Sales & Quotes</div>
                  <div className="text-[10px] text-slate-400">GST Estimates</div>
                </button>

                <button onClick={() => setActiveTab('engineering')} className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50 hover:border-teal-200 border border-slate-200 text-left transition group">
                  <Calculator className="w-5 h-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">3. Engineering</div>
                  <div className="text-[10px] text-slate-400">Solar Sizing & BOQ</div>
                </button>

                <button onClick={() => setActiveTab('projects')} className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 text-left transition group">
                  <Briefcase className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">4. Projects & EPC</div>
                  <div className="text-[10px] text-slate-400">Gantt Milestones</div>
                </button>

                <button onClick={() => setActiveTab('procurement')} className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 text-left transition group">
                  <ShoppingCart className="w-5 h-5 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">5. Procurement</div>
                  <div className="text-[10px] text-slate-400">PO & QC GRN</div>
                </button>

                <button onClick={() => setActiveTab('inventory')} className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 text-left transition group">
                  <Package className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">6. Warehouses</div>
                  <div className="text-[10px] text-slate-400">3 Depots & Serials</div>
                </button>

                <button onClick={() => setActiveTab('vendors')} className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-left transition group">
                  <Truck className="w-5 h-5 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">7. Vendors & OEMs</div>
                  <div className="text-[10px] text-slate-400">Waaree, HP, D-Link</div>
                </button>

                <button onClick={() => setActiveTab('invoices')} className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 text-left transition group">
                  <FileText className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">8. GST Invoicing</div>
                  <div className="text-[10px] text-slate-400">Tax Invoices & Accounts</div>
                </button>

                <button onClick={() => setActiveTab('tickets')} className="p-3 rounded-xl bg-slate-50 hover:bg-rose-50 hover:border-rose-200 border border-slate-200 text-left transition group">
                  <Wrench className="w-5 h-5 text-rose-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">9. AMC Service</div>
                  <div className="text-[10px] text-slate-400">2-4 Hr Banking SLA</div>
                </button>

                <button onClick={() => setActiveTab('pnb_assets')} className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 text-left transition group">
                  <Landmark className="w-5 h-5 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">10. Assets Matrix</div>
                  <div className="text-[10px] text-slate-400">543 PNB Assets</div>
                </button>

                <button onClick={() => setActiveTab('hrms')} className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50 hover:border-teal-200 border border-slate-200 text-left transition group">
                  <Users className="w-5 h-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">11. Staff HRMS</div>
                  <div className="text-[10px] text-slate-400">Attendance & Payslips</div>
                </button>

                <button onClick={() => setActiveTab('itsm')} className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 text-left transition group">
                  <Server className="w-5 h-5 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">12. ITSM Suite</div>
                  <div className="text-[10px] text-slate-400">11 Specialized Tools</div>
                </button>

                <button onClick={() => setActiveTab('documents')} className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-left transition group">
                  <FolderOpen className="w-5 h-5 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">13. DMS Vault</div>
                  <div className="text-[10px] text-slate-400">APDCL, Test Reports</div>
                </button>

                <button onClick={() => setActiveTab('customer_portal')} className="p-3 rounded-xl bg-slate-50 hover:bg-sky-50 hover:border-sky-200 border border-slate-200 text-left transition group">
                  <ShieldCheck className="w-5 h-5 text-sky-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">14a. Client Portal</div>
                  <div className="text-[10px] text-slate-400">Ticket & Invoices</div>
                </button>

                <button onClick={() => setActiveTab('employee_portal')} className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 text-left transition group">
                  <UserCheck className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">14b. Staff Desk</div>
                  <div className="text-[10px] text-slate-400">Geo Punch & DA Log</div>
                </button>

                <button onClick={() => setActiveTab('workflow')} className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-200 text-left transition group">
                  <CheckSquare className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">15. Approvals</div>
                  <div className="text-[10px] text-slate-400">PO & Expense Sign-off</div>
                </button>

                <button onClick={() => setActiveTab('mis')} className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-left transition group">
                  <TrendingUp className="w-5 h-5 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">16. MIS Cockpit</div>
                  <div className="text-[10px] text-slate-400">Aging & Board Review</div>
                </button>

                <button onClick={() => setActiveTab('users')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-200 border border-slate-200 text-left transition group">
                  <ShieldCheck className="w-5 h-5 text-slate-700 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900">17. Governance</div>
                  <div className="text-[10px] text-slate-400">RBAC & Audits</div>
                </button>
              </div>
            </div>

            {/* Quick Legal Credentials Ribbon */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-slate-400">MSME Udyam:</span> <strong className="font-mono text-slate-900">UDYAM-AS-05-0019941</strong>
                </div>
                <div>
                  <span className="text-slate-400">GSTIN ID:</span> <strong className="font-mono text-slate-900">18ASTPR6755J1Z0</strong>
                </div>
                <div>
                  <span className="text-slate-400">Electrical License:</span> <strong className="text-slate-900">Assam PWD Class-I</strong>
                </div>
              </div>
              <div className="text-slate-500 font-medium">
                West Kachudharam, Chincoorie, Silchar, Assam - 788001
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crm' && (
          <CRMModule 
            leads={leads} 
            setLeads={setLeads} 
            clients={clients} 
            setClients={setClients} 
            currentUser={currentUser} 
          />
        )}

        {activeTab === 'engineering' && (
          <EngineeringModule 
            engineeringDesigns={engineeringDesigns}
            setEngineeringDesigns={setEngineeringDesigns}
            quotations={quotations}
            setQuotations={setQuotations}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'itsm' && (
          <ITSMModule 
            itsmData={itsmData}
            setItsmData={setItsmData}
            tickets={tickets}
            setTickets={setTickets}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsModule 
            clients={clients} 
            setClients={setClients} 
            initialCategory={clientSubCategory} 
          />
        )}
        {activeTab === 'pnb_assets' && <PNBAssetModule />}
        {activeTab === 'tickets' && <TicketsModule tickets={tickets} setTickets={setTickets} />}
        {activeTab === 'amc' && <AMCModule amcContracts={amcContracts} setAmcContracts={setAmcContracts} />}
        {activeTab === 'inventory' && <InventoryModule inventory={inventory} setInventory={setInventory} />}
        {activeTab === 'invoices' && <InvoiceModule invoices={invoices} setInvoices={setInvoices} />}
        {activeTab === 'quotations' && (
          <QuotationModule 
            quotations={quotations} 
            setQuotations={setQuotations} 
            invoices={invoices} 
            setInvoices={setInvoices} 
            setActiveTab={setActiveTab} 
          />
        )}
        {activeTab === 'solar' && <SolarProjectsModule solarProjects={solarProjects} setSolarProjects={setSolarProjects} />}
        {activeTab === 'projects' && (
          <ProjectsModule 
            enterpriseProjects={enterpriseProjects} 
            setEnterpriseProjects={setEnterpriseProjects} 
            currentUser={currentUser} 
          />
        )}
        {activeTab === 'procurement' && (
          <ProcurementModule 
            procurementData={procurementData} 
            setProcurementData={setProcurementData} 
            inventory={inventory} 
            setInventory={setInventory} 
            currentUser={currentUser} 
          />
        )}
        {activeTab === 'vendors' && (
          <VendorsModule 
            vendorsData={vendorsData} 
            setVendorsData={setVendorsData} 
            currentUser={currentUser} 
          />
        )}
        {activeTab === 'documents' && (
          <DocumentModule 
            documentsData={documentsData} 
            setDocumentsData={setDocumentsData} 
            currentUser={currentUser} 
          />
        )}
        {activeTab === 'customer_portal' && (
          <CustomerPortalModule 
            clients={clients} 
            tickets={tickets} 
            setTickets={setTickets} 
            amcContracts={amcContracts} 
            invoices={invoices} 
            currentUser={currentUser} 
          />
        )}
        {activeTab === 'employee_portal' && (
          <EmployeePortalModule 
            employees={employees} 
            leaves={leaves} 
            setLeaves={setLeaves} 
            payroll={payroll} 
            tickets={tickets} 
            setTickets={setTickets} 
            currentUser={currentUser} 
          />
        )}
        {activeTab === 'workflow' && (
          <WorkflowModule 
            workflowApprovals={workflowApprovals} 
            setWorkflowApprovals={setWorkflowApprovals} 
            currentUser={currentUser} 
          />
        )}
        {activeTab === 'mis' && (
          <MISModule 
            invoices={invoices} 
            transactions={transactions} 
            solarProjects={solarProjects} 
            enterpriseProjects={enterpriseProjects} 
            tickets={tickets} 
            amcContracts={amcContracts} 
            inventory={inventory} 
            employees={employees} 
            currentUser={currentUser} 
          />
        )}
        {activeTab === 'accounts' && (
          <AccountsModule 
            transactions={transactions} 
            setTransactions={setTransactions} 
            currentUser={currentUser} 
          />
        )}
        {activeTab === 'reports' && (
          <ReportsModule 
            invoices={invoices}
            quotations={quotations}
            amcContracts={amcContracts}
            inventory={inventory}
            solarProjects={solarProjects}
            tickets={tickets}
            employees={employees}
            payroll={payroll}
            leaves={leaves}
            clients={clients}
            transactions={transactions}
          />
        )}
        {activeTab === 'users' && isAdmin && <UsersModule users={users} setUsers={setUsers} currentUser={currentUser} />}
        {activeTab === 'hrms' && (
          <HRMSModule 
            employees={employees} 
            setEmployees={setEmployees} 
            leaves={leaves} 
            setLeaves={setLeaves} 
            payroll={payroll} 
            setPayroll={setPayroll} 
            currentUser={currentUser} 
            activeSubTab={hrmsSubTab}
            onSubTabChange={setHrmsSubTab}
          />
        )}

        {activeTab === 'settings' && isAdmin && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Staff & Role Quick Access */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span>Staff & Role-Based Access Control</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage {users.length} registered staff members, assign roles, reset PINs, and configure module permissions.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('users')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition shrink-0"
              >
                Manage Staff
              </button>
            </div>

            {/* Backup and Restore */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-2">
                ERP Data Backup & Restore
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                All tickets, AMC contracts, inventory, and invoices are automatically saved in your browser.
                Download a JSON backup anytime to transfer data between computers or protect records.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleExportBackup}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs shadow hover:bg-slate-800 transition"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Backup File (JSON)</span>
                </button>

                <label className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 cursor-pointer transition">
                  <Upload className="w-4 h-4 text-sky-600" />
                  <span>Restore from Backup File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Change Access PIN */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <span>Change Staff Access PIN</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Update the master PIN used to unlock this ERP workspace.
              </p>

              <form onSubmit={handleUpdatePin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">New 4-8 Digit PIN</label>
                  <input
                    type="password"
                    maxLength="8"
                    placeholder="Enter new numeric PIN"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-mono tracking-widest"
                  />
                </div>
                {pinChangeMsg && (
                  <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-xl flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{pinChangeMsg}</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-500"
                >
                  Update Master PIN
                </button>
              </form>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}
