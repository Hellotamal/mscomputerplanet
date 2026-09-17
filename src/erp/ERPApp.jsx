import React, { useState, useEffect, useRef } from 'react';
import { 
  loadErpData, 
  saveErpData, 
  INITIAL_TICKETS, 
  INITIAL_AMC_CONTRACTS, 
  INITIAL_INVENTORY, 
  INITIAL_INVOICES, 
  INITIAL_SOLAR_PROJECTS,
  INITIAL_USERS,
  INITIAL_EMPLOYEES,
  INITIAL_LEAVES,
  INITIAL_PAYROLL,
  exportAllErpData,
  importAllErpData,
  getErpPin,
  setErpPin
} from './erpStorage';
import TicketsModule from './TicketsModule';
import AMCModule from './AMCModule';
import InventoryModule from './InventoryModule';
import InvoiceModule from './InvoiceModule';
import SolarProjectsModule from './SolarProjectsModule';
import PNBAssetModule from './PNBAssetModule';
import UsersModule from './UsersModule';
import HRMSModule from './HRMSModule';
import ERPLogin from './ERPLogin';
import { PNB_SUMMARY_METRICS } from '../data/pnbAssetData';
import { 
  LayoutDashboard, 
  Wrench, 
  Building2, 
  Package, 
  FileText, 
  SunMedium, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  Download, 
  Upload, 
  ShieldCheck, 
  TrendingUp, 
  IndianRupee,
  Layers,
  KeyRound,
  CheckCircle2,
  Landmark,
  Monitor,
  Printer,
  Users,
  UserCheck,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function ERPApp({ onExit }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("mcp_erp_authenticated") === "true";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("mcp_erp_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  // Persistent States
  const [users, setUsers] = useState(() => loadErpData("users", INITIAL_USERS));
  const [employees, setEmployees] = useState(() => loadErpData("employees", INITIAL_EMPLOYEES));
  const [leaves, setLeaves] = useState(() => loadErpData("leaves", INITIAL_LEAVES));
  const [payroll, setPayroll] = useState(() => loadErpData("payroll", INITIAL_PAYROLL));
  const [tickets, setTickets] = useState(() => loadErpData("tickets", INITIAL_TICKETS));
  const [amcContracts, setAmcContracts] = useState(() => loadErpData("amc", INITIAL_AMC_CONTRACTS));
  const [inventory, setInventory] = useState(() => loadErpData("inventory", INITIAL_INVENTORY));
  const [invoices, setInvoices] = useState(() => loadErpData("invoices", INITIAL_INVOICES));
  const [solarProjects, setSolarProjects] = useState(() => loadErpData("solar_projects", INITIAL_SOLAR_PROJECTS));

  // Sync to local storage on state change
  useEffect(() => { saveErpData("users", users); }, [users]);
  useEffect(() => { saveErpData("employees", employees); }, [employees]);
  useEffect(() => { saveErpData("leaves", leaves); }, [leaves]);
  useEffect(() => { saveErpData("payroll", payroll); }, [payroll]);
  useEffect(() => { saveErpData("tickets", tickets); }, [tickets]);
  useEffect(() => { saveErpData("amc", amcContracts); }, [amcContracts]);
  useEffect(() => { saveErpData("inventory", inventory); }, [inventory]);
  useEffect(() => { saveErpData("invoices", invoices); }, [invoices]);
  useEffect(() => { saveErpData("solar_projects", solarProjects); }, [solarProjects]);

  // Settings State
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState('');

  // Horizontal Tab Scroll Ref & Handlers
  const navTabsRef = useRef(null);

  const scrollTabs = (direction) => {
    if (navTabsRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      navTabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleTabsWheel = (e) => {
    if (navTabsRef.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        navTabsRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  const handleLoginSuccess = (authenticatedUser) => {
    sessionStorage.setItem("mcp_erp_authenticated", "true");
    if (authenticatedUser) {
      sessionStorage.setItem("mcp_erp_current_user", JSON.stringify(authenticatedUser));
      setCurrentUser(authenticatedUser);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("mcp_erp_authenticated");
    sessionStorage.removeItem("mcp_erp_current_user");
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
        setSolarProjects(loadErpData("solar_projects", INITIAL_SOLAR_PROJECTS));
        alert("ERP Data successfully restored from backup!");
      } else {
        alert("Invalid backup file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleUpdatePin = (e) => {
    e.preventDefault();
    if (newPinInput.length >= 4) {
      setErpPin(newPinInput);
      setPinChangeMsg('PIN updated successfully!');
      setNewPinInput('');
      setTimeout(() => setPinChangeMsg(''), 3000);
    } else {
      alert('PIN must be at least 4 digits.');
    }
  };

  if (!isAuthenticated) {
    return <ERPLogin onLoginSuccess={handleLoginSuccess} onBackToSite={onExit} />;
  }

  // Dashboard Aggregates
  const totalAmcRevenue = amcContracts.reduce((acc, c) => acc + (Number(c.annualValue) || 0), 0);
  const totalInventoryVal = inventory.reduce((acc, i) => acc + (i.stock * i.sellPrice), 0);
  const totalSolarKw = solarProjects.reduce((acc, p) => acc + (Number(p.capacityKw) || 0), 0);
  const openTicketsCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;

  const allNavTabs = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'pnb_assets', name: 'PNB Asset Matrix', icon: Landmark, badge: '543' },
    { id: 'tickets', name: 'Service Tickets', icon: Wrench, badge: openTicketsCount > 0 ? openTicketsCount : null },
    { id: 'amc', name: 'AMC Contracts', icon: Building2 },
    { id: 'inventory', name: 'Inventory & Spares', icon: Package },
    { id: 'invoices', name: 'GST Invoices', icon: FileText },
    { id: 'solar', name: 'Solar Projects', icon: SunMedium },
    { id: 'users', name: 'Staff & Roles', icon: Users, badge: users.length },
    { id: 'hrms', name: 'Staff HRMS', icon: Briefcase, badge: employees.length },
    { id: 'settings', name: 'Data & Settings', icon: Settings },
  ];

  // Filter tabs based on currentUser permissions if set
  const navTabs = allNavTabs.filter(tab => {
    if (!currentUser || !currentUser.permissions || currentUser.permissions.length === 0) return true;
    return currentUser.permissions.includes(tab.id);
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800">
      {/* ERP Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Left: Exit to Website and Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={onExit}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold shrink-0"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Website</span>
            </button>

            <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white truncate">
                M/S COMPUTER PLANET
              </span>
              <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                ERP Operations
              </span>
            </div>
          </div>

          {/* Right: Actions and Active User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {currentUser && (
              <div 
                onClick={() => setActiveTab('users')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs cursor-pointer transition"
                title="Manage Staff & Roles"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="font-bold text-white max-w-[130px] truncate">{currentUser.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-emerald-400 font-mono">
                  {currentUser.role?.includes('Admin') ? 'Admin' : currentUser.role?.includes('Engineer') ? 'Engineer' : currentUser.role?.includes('Accounts') ? 'Accounts' : 'Staff'}
                </span>
              </div>
            )}

            <button
              onClick={handleExportBackup}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
              title="Backup all data to JSON file"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Backup Data</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold border border-rose-800/60 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar - Seamless Dark Slate Background with interactive scroll controls */}
        <div className="bg-slate-900 border-t border-slate-800/80 px-2 sm:px-4 lg:px-6 relative">
          <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-1.5">
            {/* Left Scroll Button */}
            <button
              onClick={() => scrollTabs('left')}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition shrink-0 flex items-center justify-center border border-slate-700/60 shadow-sm"
              title="Scroll Tabs Left"
              aria-label="Scroll Tabs Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Tabs Container */}
            <div
              ref={navTabsRef}
              onWheel={handleTabsWheel}
              className="flex-1 flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-2 no-scrollbar scroll-smooth touch-pan-x"
            >
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={(e) => {
                      setActiveTab(tab.id);
                      e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow ring-2 ring-emerald-400/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{tab.name}</span>
                    {tab.badge && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Button */}
            <button
              onClick={() => scrollTabs('right')}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition shrink-0 flex items-center justify-center border border-slate-700/60 shadow-sm"
              title="Scroll Tabs Right"
              aria-label="Scroll Tabs Right"
            >
              <ChevronRight className="w-4 h-4" />
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
                <button
                  onClick={() => setActiveTab('pnb_assets')}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow flex items-center justify-center gap-1.5 transition"
                >
                  <Landmark className="w-4 h-4" />
                  <span>PNB Asset Register (543)</span>
                </button>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition"
                >
                  View Active Tickets
                </button>
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

            {/* 4 Primary Operational Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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

        {activeTab === 'pnb_assets' && <PNBAssetModule />}
        {activeTab === 'tickets' && <TicketsModule tickets={tickets} setTickets={setTickets} />}
        {activeTab === 'amc' && <AMCModule amcContracts={amcContracts} setAmcContracts={setAmcContracts} />}
        {activeTab === 'inventory' && <InventoryModule inventory={inventory} setInventory={setInventory} />}
        {activeTab === 'invoices' && <InvoiceModule invoices={invoices} setInvoices={setInvoices} />}
        {activeTab === 'solar' && <SolarProjectsModule solarProjects={solarProjects} setSolarProjects={setSolarProjects} />}
        {activeTab === 'users' && <UsersModule users={users} setUsers={setUsers} currentUser={currentUser} />}
        {activeTab === 'hrms' && (
          <HRMSModule 
            employees={employees} 
            setEmployees={setEmployees} 
            leaves={leaves} 
            setLeaves={setLeaves} 
            payroll={payroll} 
            setPayroll={setPayroll} 
            currentUser={currentUser} 
          />
        )}

        {activeTab === 'settings' && (
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
  );
}
