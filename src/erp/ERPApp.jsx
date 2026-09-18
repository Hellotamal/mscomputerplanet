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
import ERPLogin from './ERPLogin';
import { PNB_SUMMARY_METRICS } from '../data/pnbAssetData';
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
  ShoppingBag,
  Target,
  Calculator
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
      title: "Core Overview",
      items: [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: "1. CRM & Sales",
      items: [
        { 
          id: 'crm', 
          name: 'CRM & Sales Funnel', 
          icon: Target, 
          badge: activeLeadsCount > 0 ? activeLeadsCount : null, 
          badgeColor: 'bg-violet-500 text-white' 
        }
      ]
    },
    {
      title: "2. Engineering & Pre-Sales",
      items: [
        { 
          id: 'engineering', 
          name: 'Solar Sizing & BOQ', 
          icon: Calculator, 
          badge: engineeringDesigns.length, 
          badgeColor: 'bg-teal-500 text-slate-950' 
        }
      ]
    },
    {
      title: "Clients & Managed Assets",
      items: [
        { 
          id: 'clients', 
          name: 'Clients & Assets', 
          icon: Landmark, 
          badge: clients.length, 
          badgeColor: 'bg-emerald-500 text-slate-950',
          hasSubmenu: true,
          subExpanded: isClientsExpanded,
          toggleSubmenu: () => setIsClientsExpanded(!isClientsExpanded),
          subItems: [
            { id: 'all_clients', name: 'All Enrolled Clients', icon: Layers, badge: clients.length, isCurrent: activeTab === 'clients' && clientSubCategory === 'All', onSelect: () => { setActiveTab('clients'); setClientSubCategory('All'); } },
            { id: 'amc_clients', name: 'Banking & AMC', icon: Landmark, badge: clients.filter(c => c.category === 'AMC').length, isCurrent: activeTab === 'clients' && clientSubCategory === 'AMC', onSelect: () => { setActiveTab('clients'); setClientSubCategory('AMC'); } },
            { id: 'sales_clients', name: 'Hardware Sales', icon: ShoppingBag, badge: clients.filter(c => c.category === 'Sales').length, isCurrent: activeTab === 'clients' && clientSubCategory === 'Sales', onSelect: () => { setActiveTab('clients'); setClientSubCategory('Sales'); } },
            { id: 'solar_clients', name: 'Solar EPC Clients', icon: SunMedium, badge: clients.filter(c => c.category === 'Solar').length, isCurrent: activeTab === 'clients' && clientSubCategory === 'Solar', onSelect: () => { setActiveTab('clients'); setClientSubCategory('Solar'); } },
            { id: 'service_clients', name: 'Service & Repairs', icon: Wrench, badge: clients.filter(c => c.category === 'Service').length, isCurrent: activeTab === 'clients' && clientSubCategory === 'Service', onSelect: () => { setActiveTab('clients'); setClientSubCategory('Service'); } },
            { id: 'pnb_branch_matrix', name: 'PNB 50-Branch Matrix', icon: Building2, badge: '543', badgeColor: 'bg-amber-500 text-slate-950', isCurrent: activeTab === 'pnb_assets', onSelect: () => { setActiveTab('pnb_assets'); } }
          ]
        },
        { id: 'tickets', name: 'Service Tickets', icon: Wrench, badge: openTicketsCount > 0 ? openTicketsCount : null, badgeColor: 'bg-rose-500 text-white' },
        { id: 'amc', name: 'AMC Contracts', icon: Building2 },
        { id: 'inventory', name: 'Inventory & Spares', icon: Package },
        { id: 'solar', name: 'Solar Projects', icon: SunMedium }
      ]
    },
    {
      title: "Commercial & Accounts",
      items: [
        { id: 'quotations', name: 'Quotations', icon: ClipboardList, badge: pendingQuotesCount > 0 ? pendingQuotesCount : null, badgeColor: 'bg-blue-500 text-white' },
        { id: 'invoices', name: 'GST Invoices', icon: FileText },
        { id: 'accounts', name: 'Accounts & Finance', icon: IndianRupee, badge: transactions.length, badgeColor: 'bg-teal-500 text-slate-950' }
      ]
    },
    {
      title: "Audit & Downloads",
      items: [
        { id: 'reports', name: 'Reports Centre', icon: FileSpreadsheet, badge: 'Audit', badgeColor: 'bg-indigo-500 text-white' }
      ]
    },
    {
      title: "Human Resources (HRMS)",
      items: [
        { 
          id: 'hrms', 
          name: 'Staff HRMS', 
          icon: Briefcase, 
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
        },
        ...(isAdmin ? [
          { id: 'users', name: 'Staff & Roles', icon: ShieldCheck, badge: users.length, badgeColor: 'bg-indigo-500 text-white' }
        ] : [])
      ]
    },
    ...(isAdmin ? [{
      title: "Administration",
      items: [
        { id: 'settings', name: 'Data & Settings', icon: Settings }
      ]
    }] : [])
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
            {/* Business Welcome Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-brand-blue to-slate-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 border border-slate-800">
              <div className="max-w-2xl">
                <span className="text-[11px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Internal Operations Centre
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                  Welcome to Computer Planet ERP
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Manage Punjab National Bank branch service calls, post office AMCs, stock levels of computer & solar spares,
                  and generate GST-compliant tax invoices directly from your website.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 shrink-0 w-full sm:w-auto">
                {hasTabPermission('crm') && (
                  <button
                    onClick={() => setActiveTab('crm')}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition"
                  >
                    <Target className="w-4 h-4 text-violet-200" />
                    <span>CRM Funnel ({activeLeadsCount})</span>
                  </button>
                )}
                {hasTabPermission('engineering') && (
                  <button
                    onClick={() => setActiveTab('engineering')}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition"
                  >
                    <Calculator className="w-4 h-4 text-teal-200" />
                    <span>Solar BOQ ({engineeringDesigns.length})</span>
                  </button>
                )}
                {hasTabPermission('clients') && (
                  <button
                    onClick={() => setActiveTab('clients')}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow flex items-center justify-center gap-1.5 transition"
                  >
                    <Landmark className="w-4 h-4" />
                    <span>Clients & Assets ({clients.length})</span>
                  </button>
                )}
                {hasTabPermission('accounts') && (
                  <button
                    onClick={() => setActiveTab('accounts')}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition"
                  >
                    <IndianRupee className="w-4 h-4" />
                    <span>Accounts Ledger</span>
                  </button>
                )}
                {hasTabPermission('reports') && (
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Reports Centre</span>
                  </button>
                )}
                {hasTabPermission('tickets') && (
                  <button
                    onClick={() => setActiveTab('tickets')}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition"
                  >
                    Active Tickets
                  </button>
                )}
              </div>
            </div>

            {/* Official PNB Silchar Circle Highlight Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                    <Landmark className="w-4 h-4 text-blue-600" />
                    <span>Active Banking AMC Highlight</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    PNB Circle Office Silchar — 543 Total Managed Hardware Assets
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Branchwise total counts across 50 branches, regional currency chests & PLP office under AMC support.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('pnb_assets')}
                  className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow transition shrink-0"
                >
                  <span>Open Full Branch Matrix</span>
                  <span>→</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-4">
                <div className="p-3 bg-slate-50 rounded-xl text-center min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase truncate">Desktops</div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-0.5">{PNB_SUMMARY_METRICS.desktops}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl text-center min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase truncate">LaserJet</div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-0.5">{PNB_SUMMARY_METRICS.laserjetPrinters}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl text-center min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase truncate">Passbook</div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-0.5">{PNB_SUMMARY_METRICS.passbookPrinters}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl text-center min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase truncate">HS Scanners</div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-0.5">{PNB_SUMMARY_METRICS.highSpeedScanners}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl text-center min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase truncate">Flat Scanners</div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-0.5">{PNB_SUMMARY_METRICS.scanners}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl text-center min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase truncate">Cash Receipt</div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-0.5">{PNB_SUMMARY_METRICS.cashReceiptPrinters}</div>
                </div>
              </div>
            </div>

            {/* 5 Primary Operational Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
              <div
                onClick={() => setActiveTab('crm')}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Sales Pipeline</span>
                  <div className="p-2 rounded-xl bg-violet-50 text-violet-600 group-hover:scale-110 transition-transform">
                    <Target className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  ₹{totalPipelineVal.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-violet-600 font-medium mt-2">
                  {activeLeadsCount} Leads in Funnel
                </div>
              </div>

              <div
                onClick={() => setActiveTab('amc')}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Annual AMC Value</span>
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-600 group-hover:scale-110 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  ₹{totalAmcRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-sky-600 font-medium mt-2">
                  {amcContracts.length} Active Contracts
                </div>
              </div>

              <div
                onClick={() => setActiveTab('tickets')}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Pending Service Calls</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                    <Wrench className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {openTicketsCount}
                </div>
                <div className="text-xs text-amber-600 font-medium mt-2">
                  Under 2-4 Hr Priority SLA
                </div>
              </div>

              <div
                onClick={() => setActiveTab('inventory')}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Stock Valuation</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  ₹{totalInventoryVal.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-emerald-600 font-medium mt-2">
                  {inventory.length} Hardware & Solar SKUs
                </div>
              </div>

              <div
                onClick={() => setActiveTab('solar')}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Solar Capacity</span>
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:scale-110 transition-transform">
                    <SunMedium className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {totalSolarKw} <span className="text-sm font-sans font-normal text-slate-500">kWp</span>
                </div>
                <div className="text-xs text-teal-600 font-medium mt-2">
                  {solarProjects.length} Active Solar Deployments
                </div>
              </div>
            </div>

            {/* Quick Operational Shortcuts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              {/* Recent Open Tickets */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-emerald-600" />
                    <span>Recent Support Incidents</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('tickets')}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-2.5">
                  {tickets.slice(0, 3).map((t) => (
                    <div key={t.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">{t.clientName}</div>
                        <div className="text-slate-500 truncate">{t.description}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-bold shrink-0 text-[11px] ${
                        t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Legal Credentials Reference */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Business Legal Credentials (For Invoicing)</span>
                </h3>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">MSME Registration:</span>
                    <strong className="font-mono text-slate-900">UDYAM-AS-05-0019941</strong>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">GSTIN Identification:</span>
                    <strong className="font-mono text-slate-900">18ASTPR6755J1Z0</strong>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">Trade License:</span>
                    <strong className="text-slate-900">Silchar Municipal Authority</strong>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-500">Registered Office:</span>
                    <span className="text-slate-700 font-medium truncate ml-2">West Kachudharam, Chincoorie, Silchar</span>
                  </div>
                </div>
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
