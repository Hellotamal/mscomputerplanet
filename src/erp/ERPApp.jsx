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
  recordAuditLog,
  isModuleEnabledInPackages
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
  Zap,
  Cpu,
  Sun,
  Lock
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
  const [deptFilter, setDeptFilter] = useState('all'); // 'all' | 'it' | 'solar'

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

  // Filter tabs based on currentUser permissions & Package Subscriptions (Admin-only for users & settings)
  const hasTabPermission = (tabId) => {
    if (tabId === 'users' || tabId === 'settings') {
      return isAdmin;
    }
    if (isAdmin) return true;
    if (!currentUser) return false;

    // Check if module's package subscription is enabled for user profile
    if (!isModuleEnabledInPackages(currentUser, tabId)) {
      return false;
    }

    if (!currentUser.permissions || currentUser.permissions.length === 0) return true;
    return currentUser.permissions.includes(tabId);
  };

  // Left Sidebar Navigation Hierarchy - Divided into Two Primary Departments + Enterprise Core
  const departmentSections = [
    {
      deptId: 'it',
      deptName: 'IT & Technology',
      shortName: 'IT & Tech',
      badge: 'ITSM & Banking',
      accentColor: 'bg-cyan-400',
      icon: Cpu,
      themeColor: 'cyan',
      items: [
        { 
          id: 'itsm', 
          name: 'IT Support & ITSM', 
          icon: Server, 
          badge: '11 Tools', 
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
          dept: 'it'
        },
        { 
          id: 'clients', 
          name: 'Asset & Client Directory', 
          icon: Landmark, 
          badge: clients.length > 0 ? clients.length : null, 
          badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700/50',
          dept: 'it',
          hasSubmenu: true,
          subExpanded: isClientsExpanded,
          toggleSubmenu: () => setIsClientsExpanded(!isClientsExpanded),
          subItems: [
            { id: 'all_clients', name: 'All Clients', icon: Layers, badge: clients.length, isCurrent: activeTab === 'clients' && clientSubCategory === 'All', onSelect: () => { setActiveTab('clients'); setClientSubCategory('All'); } },
            { id: 'amc_clients', name: 'Banking & AMC', icon: Landmark, badge: clients.filter(c => c.category === 'AMC').length, isCurrent: activeTab === 'clients' && clientSubCategory === 'AMC', onSelect: () => { setActiveTab('clients'); setClientSubCategory('AMC'); } },
            { id: 'pnb_branch_matrix', name: 'PNB 50-Branch Matrix', icon: Building2, badge: '543', badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30', isCurrent: activeTab === 'pnb_assets', onSelect: () => { setActiveTab('pnb_assets'); } }
          ]
        },
        { 
          id: 'tickets', 
          name: 'Service Desk & Tickets', 
          icon: Wrench, 
          badge: openTicketsCount > 0 ? `${openTicketsCount} Open` : null, 
          badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold',
          dept: 'it'
        },
        { 
          id: 'amc', 
          name: 'Banking AMC Contracts', 
          icon: Building2,
          badge: amcContracts.length > 0 ? amcContracts.length : null,
          badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700/50',
          dept: 'it'
        },
        { 
          id: 'procurement', 
          name: 'Hardware Procurement', 
          icon: ShoppingCart, 
          badge: procurementData?.purchaseOrders?.length > 0 ? procurementData.purchaseOrders.length : null, 
          badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700/50',
          dept: 'it'
        },
        { 
          id: 'vendors', 
          name: 'IT Vendors & GeM', 
          icon: Truck, 
          badge: (vendorsData || []).length > 0 ? vendorsData.length : null,
          badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700/50',
          dept: 'it'
        },
        { 
          id: 'customer_portal', 
          name: 'Customer Self-Service', 
          icon: ShieldCheck,
          dept: 'it'
        }
      ]
    },
    {
      deptId: 'solar',
      deptName: 'Solar EPC & Power',
      shortName: 'Solar EPC',
      badge: 'Solar EPC',
      accentColor: 'bg-amber-400',
      icon: Sun,
      themeColor: 'amber',
      items: [
        { 
          id: 'engineering', 
          name: 'Engineering & Pre-Sales', 
          icon: Calculator, 
          badge: engineeringDesigns.length > 0 ? engineeringDesigns.length : null, 
          badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700/50',
          dept: 'solar'
        },
        { 
          id: 'projects', 
          name: 'Solar Projects Execution', 
          icon: Briefcase, 
          badge: enterpriseProjects.length > 0 ? enterpriseProjects.length : null, 
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
          dept: 'solar'
        },
        { 
          id: 'documents', 
          name: 'DMS Compliance Vault', 
          icon: FolderOpen, 
          badge: (documentsData || []).length > 0 ? documentsData.length : null, 
          badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700/50',
          dept: 'solar'
        },
        { 
          id: 'inventory', 
          name: 'Multi-Depot Warehouses', 
          icon: Package, 
          badge: inventory.length > 0 ? inventory.length : null,
          badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700/50',
          dept: 'solar'
        },
        { 
          id: 'quotations', 
          name: 'Solar Quotes & Proposals', 
          icon: ClipboardList, 
          badge: pendingQuotesCount > 0 ? pendingQuotesCount : null, 
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold',
          dept: 'solar'
        }
      ]
    },
    {
      deptId: 'core',
      deptName: 'Corporate Operations',
      shortName: 'Corporate Hub',
      badge: 'Operations',
      accentColor: 'bg-emerald-400',
      icon: Layers,
      themeColor: 'emerald',
      items: [
        { id: 'dashboard', name: 'Executive Overview', icon: LayoutDashboard, dept: 'core' },
        { id: 'mis', name: 'MIS Analytics', icon: TrendingUp, badge: 'Executive', badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold', dept: 'core' },
        { 
          id: 'workflow', 
          name: 'Workflow & Approvals', 
          icon: CheckSquare, 
          badge: workflowApprovals.filter(a => a.status === 'Pending').length > 0 ? workflowApprovals.filter(a => a.status === 'Pending').length : null, 
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold',
          dept: 'core'
        },
        { 
          id: 'crm', 
          name: 'CRM & Omnichannel Leads', 
          icon: Target, 
          badge: activeLeadsCount > 0 ? activeLeadsCount : null, 
          badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold',
          dept: 'core'
        },
        { id: 'invoices', name: 'Finance & Invoicing', icon: FileText, dept: 'core' },
        { id: 'accounts', name: 'Accounts Ledger', icon: IndianRupee, badge: transactions.length > 0 ? transactions.length : null, badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700/50', dept: 'core' },
        { 
          id: 'hrms', 
          name: 'Staff HRMS & Payroll', 
          icon: Users, 
          badge: employees.length > 0 ? employees.length : null, 
          badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700/50',
          dept: 'core',
          hasSubmenu: true,
          subExpanded: isHrmsExpanded,
          toggleSubmenu: () => setIsHrmsExpanded(!isHrmsExpanded),
          subItems: [
            { id: 'directory', name: 'Employee Directory', icon: Users, badge: employees.length, isCurrent: activeTab === 'hrms' && hrmsSubTab === 'directory', onSelect: () => { setActiveTab('hrms'); setHrmsSubTab('directory'); } },
            { id: 'attendance', name: 'Daily Attendance', icon: UserCheck, isCurrent: activeTab === 'hrms' && hrmsSubTab === 'attendance', onSelect: () => { setActiveTab('hrms'); setHrmsSubTab('attendance'); } },
            { id: 'field_visits', name: 'Field Duty Register', icon: MapPin, isCurrent: activeTab === 'hrms' && hrmsSubTab === 'field_visits', onSelect: () => { setActiveTab('hrms'); setHrmsSubTab('field_visits'); } },
            { id: 'leaves', name: 'Leave Requests', icon: Calendar, badge: pendingLeavesCount > 0 ? pendingLeavesCount : null, badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30', isCurrent: activeTab === 'hrms' && hrmsSubTab === 'leaves', onSelect: () => { setActiveTab('hrms'); setHrmsSubTab('leaves'); } },
            { id: 'payroll', name: 'Payroll & Slips', icon: IndianRupee, isCurrent: activeTab === 'hrms' && hrmsSubTab === 'payroll', onSelect: () => { setActiveTab('hrms'); setHrmsSubTab('payroll'); } }
          ]
        },
        { id: 'employee_portal', name: 'Employee Staff Desk', icon: UserCheck, dept: 'core' },
        { id: 'reports', name: 'Reports & Audit Centre', icon: FileSpreadsheet, dept: 'core' },
        ...(isAdmin ? [
          { id: 'users', name: 'Administration & RBAC', icon: ShieldCheck, badge: users.length, badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold', dept: 'core' },
          { id: 'settings', name: 'System & Data Settings', icon: Settings, dept: 'core' }
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

        {/* Department Switcher Bar */}
        <div className="p-2 border-b border-slate-800/80 bg-slate-950/40 shrink-0">
          <div className="grid grid-cols-3 gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setDeptFilter('all')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                deptFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Show All Departments"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>All</span>
            </button>
            <button
              onClick={() => setDeptFilter('it')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                deptFilter === 'it'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-xs'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
              title="Filter IT & Technology Solutions"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>IT & Tech</span>
            </button>
            <button
              onClick={() => setDeptFilter('solar')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                deptFilter === 'solar'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-xs'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
              title="Filter Renewable Energy & Solar EPC"
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Solar EPC</span>
            </button>
          </div>
        </div>

        {/* Quick Operations Hub (Restricted: Administrator Only) */}
        {isAdmin && (
          <div className="px-3 py-2.5 border-b border-slate-800/80 shrink-0">
            <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2 px-1 flex items-center justify-between">
              <span>Fast-Track Hub</span>
              <span className="text-[9px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.2 rounded-full">Admin</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => { setActiveTab('clients'); setIsSidebarOpen(false); }}
                className={`px-2.5 py-2 rounded-xl text-left transition flex items-center justify-between border text-xs font-medium ${
                  activeTab === 'clients'
                    ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-200'
                    : 'bg-slate-850/50 hover:bg-slate-800 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Landmark className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Clients</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-slate-800 text-cyan-300 border border-slate-700/50 shrink-0 ml-1">
                  {clients.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('tickets'); setIsSidebarOpen(false); }}
                className={`px-2.5 py-2 rounded-xl text-left transition flex items-center justify-between border text-xs font-medium ${
                  activeTab === 'tickets'
                    ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                    : 'bg-slate-850/50 hover:bg-slate-800 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Wrench className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">Tickets</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono shrink-0 ml-1 ${
                  openTicketsCount > 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold' : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                }`}>
                  {openTicketsCount}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('accounts'); setIsSidebarOpen(false); }}
                className={`px-2.5 py-2 rounded-xl text-left transition flex items-center justify-between border text-xs font-medium ${
                  activeTab === 'accounts'
                    ? 'bg-teal-950/60 border-teal-500/40 text-teal-200'
                    : 'bg-slate-850/50 hover:bg-slate-800 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <IndianRupee className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="truncate">Accounts</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-slate-800 text-teal-300 border border-slate-700/50 shrink-0 ml-1">
                  {transactions.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }}
                className={`px-2.5 py-2 rounded-xl text-left transition flex items-center justify-between border text-xs font-medium ${
                  activeTab === 'reports'
                    ? 'bg-blue-950/60 border-blue-500/40 text-blue-200'
                    : 'bg-slate-850/50 hover:bg-slate-800 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">Reports</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-slate-800 text-blue-300 border border-slate-700/50 shrink-0 ml-1">
                  Audit
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 no-scrollbar">
          {departmentSections
            .filter(section => deptFilter === 'all' || section.deptId === deptFilter || section.deptId === 'core')
            .map((section) => {
              const visibleItems = section.items.filter(item => hasTabPermission(item.id));
              if (visibleItems.length === 0) return null;

              return (
                <div key={section.deptId} className="space-y-1">
                  {/* Clean Uppercase Section Header */}
                  <div className="pt-2 pb-1 px-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${section.accentColor}`} />
                      <span>{section.deptName}</span>
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {visibleItems.map(item => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;

                      return (
                        <div key={item.id}>
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
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition group ${
                              isActive
                                ? 'bg-slate-800/90 text-white font-semibold border-l-2 border-emerald-400 shadow-xs'
                                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                                isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                              }`} />
                              <span className="truncate">{item.name}</span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                              {item.badge && (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700/50'}`}>
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

                          {/* Expandable Sub-Menu */}
                          {item.hasSubmenu && item.subExpanded && (
                            <div className="mt-1 ml-4 pl-3 border-l border-slate-800 space-y-0.5 my-1">
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
                                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition ${
                                      isSubActive
                                        ? 'bg-slate-800/80 text-emerald-400 font-semibold'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      <SubIcon className={`w-3.5 h-3.5 shrink-0 ${
                                        isSubActive ? 'text-emerald-400' : 'text-slate-500'
                                      }`} />
                                      <span className="truncate">{sub.name}</span>
                                    </div>

                                    {sub.badge && (
                                      <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-800 text-slate-400 font-mono">
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
                    {activeTab === 'crm' && 'CRM & Sales Pipeline Hub'}
                    {activeTab === 'engineering' && 'Engineering & Solar Pre-Sales'}
                    {activeTab === 'itsm' && 'IT Support / ITSM Suite (11 Modules)'}
                    {activeTab === 'projects' && 'Projects & EPC Execution'}
                    {activeTab === 'procurement' && 'Hardware Procurement & POs'}
                    {activeTab === 'vendors' && 'Vendors & OEM Directory'}
                    {activeTab === 'documents' && 'Document Management & Vault'}
                    {activeTab === 'customer_portal' && 'Customer Self-Service Portal'}
                    {activeTab === 'employee_portal' && 'Employee Self-Service Desk'}
                    {activeTab === 'workflow' && 'Workflow & Approvals'}
                    {activeTab === 'mis' && 'MIS & Executive Intelligence Cockpit'}
                    {activeTab === 'settings' && 'Data & Settings'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Top Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {isAdmin ? (
                <button
                  onClick={() => setActiveTab('users')}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition"
                  title="Admin Privilege: Full modification rights active across all menus. Click to configure menu modification policies."
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden md:inline">Admin: Full Modifications</span>
                  <span className="md:hidden">Admin</span>
                </button>
              ) : (
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200"
                  title="Staff Access: Modifications across all menus are restricted to Admin users. Contact administrator for edit access."
                >
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden md:inline">Staff: View-Only Mode</span>
                  <span className="md:hidden">View-Only</span>
                </div>
              )}

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

            {/* Enterprise 17-Domain Operational Matrix Categorized into Two Departments */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-600" />
                    <span>Enterprise Operations Matrix by Department</span>
                  </h3>
                  <p className="text-xs text-slate-500">Fast access to operational modules organized across Computer Planet's two core divisions.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-cyan-600" /> Dept 1: IT & Tech
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-600" /> Dept 2: Solar EPC
                  </span>
                </div>
              </div>

              {/* Department 1: IT & Technology Solutions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-cyan-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <span>Department 1: IT & Technology Services</span>
                    <span className="text-[10px] font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">50 PNB Branches • ITSM • AMC</span>
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
                  <button onClick={() => setActiveTab('itsm')} className="p-3 rounded-xl bg-slate-50 hover:bg-cyan-50 hover:border-cyan-300 border border-slate-200 text-left transition group">
                    <Server className="w-5 h-5 text-cyan-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">12. ITSM Suite</div>
                    <div className="text-[10px] text-slate-400">11 IT Tools</div>
                  </button>
                  <button onClick={() => setActiveTab('pnb_assets')} className="p-3 rounded-xl bg-slate-50 hover:bg-cyan-50 hover:border-cyan-300 border border-slate-200 text-left transition group">
                    <Landmark className="w-5 h-5 text-cyan-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">10. Assets Matrix</div>
                    <div className="text-[10px] text-slate-400">543 PNB Assets</div>
                  </button>
                  <button onClick={() => setActiveTab('tickets')} className="p-3 rounded-xl bg-slate-50 hover:bg-rose-50 hover:border-rose-300 border border-slate-200 text-left transition group">
                    <Wrench className="w-5 h-5 text-rose-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">9. AMC Service</div>
                    <div className="text-[10px] text-slate-400">2-4 Hr SLA Calls</div>
                  </button>
                  <button onClick={() => setActiveTab('amc')} className="p-3 rounded-xl bg-slate-50 hover:bg-cyan-50 hover:border-cyan-300 border border-slate-200 text-left transition group">
                    <Building2 className="w-5 h-5 text-cyan-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">AMC Contracts</div>
                    <div className="text-[10px] text-slate-400">50 Branches</div>
                  </button>
                  <button onClick={() => setActiveTab('procurement')} className="p-3 rounded-xl bg-slate-50 hover:bg-cyan-50 hover:border-cyan-300 border border-slate-200 text-left transition group">
                    <ShoppingCart className="w-5 h-5 text-cyan-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">5. Procurement</div>
                    <div className="text-[10px] text-slate-400">Hardware PO & GRN</div>
                  </button>
                  <button onClick={() => setActiveTab('vendors')} className="p-3 rounded-xl bg-slate-50 hover:bg-cyan-50 hover:border-cyan-300 border border-slate-200 text-left transition group">
                    <Truck className="w-5 h-5 text-cyan-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">7. IT Vendors</div>
                    <div className="text-[10px] text-slate-400">HP, D-Link, GeM</div>
                  </button>
                  <button onClick={() => setActiveTab('customer_portal')} className="p-3 rounded-xl bg-slate-50 hover:bg-sky-50 hover:border-sky-300 border border-slate-200 text-left transition group">
                    <ShieldCheck className="w-5 h-5 text-sky-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">14a. Client Portal</div>
                    <div className="text-[10px] text-slate-400">Ticket Self-Service</div>
                  </button>
                </div>
              </div>

              {/* Department 2: Renewable Energy & Solar EPC */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                    <span>Department 2: Renewable Energy & Solar EPC</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Solar EPC • APDCL • Net Metering</span>
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs">
                  <button onClick={() => setActiveTab('engineering')} className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-left transition group">
                    <Calculator className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">3. Solar Engineering</div>
                    <div className="text-[10px] text-slate-400">Sizing & Barak PSH</div>
                  </button>
                  <button onClick={() => setActiveTab('projects')} className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-left transition group">
                    <Briefcase className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">4. Solar EPC Execution</div>
                    <div className="text-[10px] text-slate-400">Milestones & Handover</div>
                  </button>
                  <button onClick={() => setActiveTab('documents')} className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-left transition group">
                    <FolderOpen className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">13. DMS Solar Vault</div>
                    <div className="text-[10px] text-slate-400">APDCL, Test Reports</div>
                  </button>
                  <button onClick={() => setActiveTab('inventory')} className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-left transition group">
                    <Package className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">6. Solar Warehouses</div>
                    <div className="text-[10px] text-slate-400">3 Depots & Panels</div>
                  </button>
                  <button onClick={() => setActiveTab('quotations')} className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-left transition group">
                    <ClipboardList className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">2. Solar Quotations</div>
                    <div className="text-[10px] text-slate-400">PM Surya Ghar Subsidy</div>
                  </button>
                </div>
              </div>

              {/* Corporate & Governance Suite */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <span>Enterprise Core & Corporate Governance</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Finance • HRMS • Workflow</span>
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs">
                  <button onClick={() => setActiveTab('crm')} className="p-3 rounded-xl bg-slate-50 hover:bg-violet-50 hover:border-violet-300 border border-slate-200 text-left transition group">
                    <Target className="w-5 h-5 text-violet-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">1. CRM & Leads</div>
                    <div className="text-[10px] text-slate-400">7-Stage Funnel</div>
                  </button>
                  <button onClick={() => setActiveTab('invoices')} className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition group">
                    <FileText className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">8. GST Invoicing</div>
                    <div className="text-[10px] text-slate-400">Tax Invoices & Ledger</div>
                  </button>
                  <button onClick={() => setActiveTab('hrms')} className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 text-left transition group">
                    <Users className="w-5 h-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">11. Staff HRMS</div>
                    <div className="text-[10px] text-slate-400">Attendance & Payslips</div>
                  </button>
                  <button onClick={() => setActiveTab('employee_portal')} className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition group">
                    <UserCheck className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">14b. Staff Desk</div>
                    <div className="text-[10px] text-slate-400">Geo Punch & DA Log</div>
                  </button>
                  <button onClick={() => setActiveTab('workflow')} className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-left transition group">
                    <CheckSquare className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">15. Approvals</div>
                    <div className="text-[10px] text-slate-400">PO & Expense Sign-off</div>
                  </button>
                  <button onClick={() => setActiveTab('mis')} className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 text-left transition group">
                    <TrendingUp className="w-5 h-5 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-slate-900">16. MIS Cockpit</div>
                    <div className="text-[10px] text-slate-400">Aging & Board Review</div>
                  </button>
                </div>
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
            isAdmin={isAdmin}
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
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'itsm' && (
          <ITSMModule 
            itsmData={itsmData}
            setItsmData={setItsmData}
            tickets={tickets}
            setTickets={setTickets}
            currentUser={currentUser}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsModule 
            clients={clients} 
            setClients={setClients} 
            initialCategory={clientSubCategory} 
            isAdmin={isAdmin}
            currentUser={currentUser}
          />
        )}
        {activeTab === 'pnb_assets' && <PNBAssetModule />}
        {activeTab === 'tickets' && (
          <TicketsModule 
            tickets={tickets} 
            setTickets={setTickets} 
            isAdmin={isAdmin}
            currentUser={currentUser}
          />
        )}
        {activeTab === 'amc' && (
          <AMCModule 
            amcContracts={amcContracts} 
            setAmcContracts={setAmcContracts} 
            isAdmin={isAdmin}
            currentUser={currentUser}
          />
        )}
        {activeTab === 'inventory' && (
          <InventoryModule 
            inventory={inventory} 
            setInventory={setInventory} 
            isAdmin={isAdmin}
            currentUser={currentUser}
          />
        )}
        {activeTab === 'invoices' && (
          <InvoiceModule 
            invoices={invoices} 
            setInvoices={setInvoices} 
            isAdmin={isAdmin}
            currentUser={currentUser}
          />
        )}
        {activeTab === 'quotations' && (
          <QuotationModule 
            quotations={quotations} 
            setQuotations={setQuotations} 
            invoices={invoices} 
            setInvoices={setInvoices} 
            setActiveTab={setActiveTab} 
            isAdmin={isAdmin}
            currentUser={currentUser}
          />
        )}
        {activeTab === 'solar' && (
          <SolarProjectsModule 
            solarProjects={solarProjects} 
            setSolarProjects={setSolarProjects} 
            isAdmin={isAdmin}
            currentUser={currentUser}
          />
        )}
        {activeTab === 'projects' && (
          <ProjectsModule 
            enterpriseProjects={enterpriseProjects} 
            setEnterpriseProjects={setEnterpriseProjects} 
            currentUser={currentUser} 
            isAdmin={isAdmin}
          />
        )}
        {activeTab === 'procurement' && (
          <ProcurementModule 
            procurementData={procurementData} 
            setProcurementData={setProcurementData} 
            inventory={inventory} 
            setInventory={setInventory} 
            currentUser={currentUser} 
            isAdmin={isAdmin}
          />
        )}
        {activeTab === 'vendors' && (
          <VendorsModule 
            vendorsData={vendorsData} 
            setVendorsData={setVendorsData} 
            currentUser={currentUser} 
            isAdmin={isAdmin}
          />
        )}
        {activeTab === 'documents' && (
          <DocumentModule 
            documentsData={documentsData} 
            setDocumentsData={setDocumentsData} 
            currentUser={currentUser} 
            isAdmin={isAdmin}
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
            isAdmin={isAdmin}
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
            isAdmin={isAdmin}
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
