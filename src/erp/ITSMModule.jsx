import React, { useState } from 'react';
import {
  Server,
  Headphones,
  Wrench,
  Cpu,
  ShieldCheck,
  Globe,
  Mail,
  Network,
  KeyRound,
  Building2,
  Calendar,
  FileSpreadsheet,
  Search,
  Plus,
  Printer,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  Clock,
  Send,
  Download,
  Copy,
  Layers,
  X,
  Lock
} from 'lucide-react';
import { generateEntityId, escapeHtml } from './erpSecurity';
import { recordAuditLog, saveErpData } from './erpStorage';
import { getCompanyPrintHeaderHtml } from '../data/companyLogo';

const SUBMODULES = [
  { id: 'helpdesk', label: '1. IT Helpdesk', icon: Headphones },
  { id: 'tickets', label: '2. IT Tickets', icon: Wrench },
  { id: 'hardware', label: '3. Hardware Assets', icon: Cpu },
  { id: 'software', label: '4. Software & Licenses', icon: Layers },
  { id: 'network', label: '5. Network & IPs', icon: Network },
  { id: 'email', label: '6. Corporate Email', icon: Mail },
  { id: 'domains', label: '7. Website & Domain', icon: Globe },
  { id: 'access', label: '8. Access & Accounts', icon: KeyRound },
  { id: 'vendors', label: '9. IT Vendors & OEMs', icon: Building2 },
  { id: 'amc_pm', label: '10. IT AMC & PM', icon: Calendar },
  { id: 'reports', label: '11. IT Reports', icon: FileSpreadsheet }
];

export default function ITSMModule({
  itsmData = {},
  setItsmData,
  tickets = [],
  setTickets,
  currentUser: _currentUser,
  isAdmin = false
}) {
  const isUserAdmin = isAdmin || _currentUser?.role === 'Admin' || _currentUser?.role === 'SuperAdmin';
  const [activeSubModule, setActiveSubModule] = useState('helpdesk');
  const [search, setSearch] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const [revealedSecrets, setRevealedSecrets] = useState({});

  // Active sub-datasets
  const serviceCatalog = itsmData.serviceCatalog || [];
  const hardwareList = itsmData.hardware || [];
  const softwareList = itsmData.software || [];
  const networkNodes = itsmData.network || [];
  const emailAccounts = itsmData.email || [];
  const domainsList = itsmData.domains || [];
  const accessVault = itsmData.access || [];
  const vendorList = itsmData.vendors || [];
  const amcPmLogs = itsmData.amcPm || [];

  // Helper to persist itsmData
  const updateItsmSection = (sectionName, updatedData, auditAction, auditDesc) => {
    if (!isUserAdmin) {
      alert('Access Denied: Only Administrator accounts can modify ITSM assets, configurations, and records.');
      return;
    }
    const updated = { ...itsmData, [sectionName]: updatedData };
    setItsmData(updated);
    saveErpData("itsm_data", updated);
    if (auditAction && auditDesc) {
      recordAuditLog(auditAction, "ITSM", auditDesc);
    }
  };

  const toggleSecret = (id) => {
    setRevealedSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(''), 2500);
  };

  // --- 1. IT HELPDESK & SERVICE REQUESTS ---
  const [showReqModal, setShowReqModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [reqForm, setReqForm] = useState({
    clientName: 'Punjab National Bank - Silchar Main Branch',
    requesterName: '',
    phone: '',
    department: 'Cash & Operations',
    urgency: 'High',
    description: ''
  });

  const handleOpenReqModal = (srv) => {
    setSelectedService(srv);
    setReqForm({
      clientName: 'Punjab National Bank - Silchar Main Branch',
      requesterName: '',
      phone: '',
      department: 'Cash & Operations',
      urgency: srv.slaHours <= 4 ? 'Critical' : 'High',
      description: `Request for: ${srv.title} (${srv.description})`
    });
    setShowReqModal(true);
  };

  const handleSubmitServiceReq = (e) => {
    e.preventDefault();
    if (!isUserAdmin) {
      alert('Access Denied: Only Administrator accounts can log or dispatch ITSM service requests.');
      return;
    }
    const newTicketId = generateEntityId('TCK');
    const newTicket = {
      id: newTicketId,
      clientName: reqForm.clientName,
      contactPerson: reqForm.requesterName || 'Branch Staff',
      phone: reqForm.phone || '+91 94350 12345',
      type: selectedService?.category || 'IT Support',
      priority: reqForm.urgency,
      assignedTo: 'Resident Engineer - Debashis',
      status: 'Open',
      reportedDate: new Date().toISOString().split('T')[0],
      description: reqForm.description,
      resolution: `Service Catalog Request [${selectedService?.id || 'ITSM'}]: Ticket queued for field dispatch.`
    };

    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    saveErpData("tickets", updatedTickets);
    recordAuditLog("ITSM_SERVICE_REQUEST", "Helpdesk", `Logged ticket ${newTicketId} for ${newTicket.clientName} (${selectedService?.title})`);

    setShowReqModal(false);
    setCopiedKey(`Service Request ticket ${newTicketId} logged successfully!`);
    setTimeout(() => setCopiedKey(''), 3000);
  };

  // Knowledge base FAQs
  const faqList = [
    { q: 'Epson PLQ-20/PLQ-30 Passbook Printer is not taking passbook feed?', a: 'Check if ribbon cartridge is properly seated and sensors are free of paper dust. Clean front & rear optical sensors with dry lint-free cloth, power off for 10 seconds, then power on holding F1 button for auto-calibration.' },
    { q: 'HP LaserJet M404dn shows "Manual Feed Load Paper" error?', a: 'Ensure Tray 2 paper guides are snug against A4 sheets. Access Embedded Web Server (EWS) via printer IP, navigate to Settings > Paper Handling > Default Paper Size and verify it is set to A4 (not Letter).' },
    { q: 'Tally Prime Client displays "No Companies Found on Server"?', a: 'Check if central server MCP-SRV-001 (192.168.1.5) is reachable via ping. Verify Tally Gateway Server service is running in Windows Services (services.msc) and port 9000 is open in Windows Firewall.' },
    { q: 'Barak Valley BSNL FTTH Static IP Gateway connection dropped?', a: 'Verify LOS indicator on GPON ONT. If PON LED is blinking green or red, fiber attenuation has exceeded -27 dBm. Contact BSNL Silchar SDO (+91 94350 00022) with Circuit ID AS/SLR/FTTH/8821.' }
  ];

  // --- 2. IT TICKETS STATUS UPDATES ---
  const handleUpdateTicketStatus = (tId, newStatus) => {
    if (!isUserAdmin) {
      alert('Access Denied: Only Administrator accounts can update ticket statuses.');
      return;
    }
    const updated = tickets.map(t => t.id === tId ? { ...t, status: newStatus } : t);
    setTickets(updated);
    saveErpData("tickets", updated);
    recordAuditLog("TICKET_STATUS_CHANGED", "ITSM", `Updated ticket ${tId} status to ${newStatus}`);
  };

  const triggerWhatsAppClient = (t) => {
    const rawNum = (t.phone || '').replace(/\D/g, '');
    const phone = rawNum.startsWith('91') ? rawNum : `91${rawNum}`;
    const text = encodeURIComponent(
      `Dear ${t.contactPerson || t.clientName},\n\n` +
      `Update regarding IT Support Ticket *${t.id}* (${t.type}):\n` +
      `Current Status: *${t.status}*\n` +
      `Assigned Engineer: ${t.assignedTo}\n` +
      `Notes: ${t.resolution || t.description}\n\n` +
      `M/S Computer Planet Silchar Support Desk\n` +
      `Emergency Helpline: +91 86380 83712 / +91 94350 71052`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  // --- 3. HARDWARE ASSET MODAL ---
  const [showHwModal, setShowHwModal] = useState(false);
  const [hwForm, setHwForm] = useState(() => ({
    tag: '',
    make: 'HP',
    model: '',
    type: 'Desktop PC',
    serial: '',
    location: '',
    ip: '',
    cpu: 'Core i5',
    ram: '16GB',
    storage: '512GB SSD',
    os: 'Windows 11 Pro',
    purchaseDate: new Date().toISOString().split('T')[0],
    warrantyUntil: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    status: 'Active',
    user: ''
  }));

  const handleSaveHardware = (e) => {
    e.preventDefault();
    if (!isUserAdmin) {
      alert('Access Denied: Only Administrator accounts can enroll hardware assets.');
      return;
    }
    const newId = generateEntityId('HW');
    const newAsset = { ...hwForm, id: newId, tag: hwForm.tag || `MCP-HW-${Math.floor(100 + Math.random() * 900)}` };
    const updated = [newAsset, ...hardwareList];
    updateItsmSection('hardware', updated, "HARDWARE_ADDED", `Enrolled hardware asset ${newAsset.tag} (${newAsset.make} ${newAsset.model})`);
    setShowHwModal(false);
  };

  const handleDeleteHardware = (id, tag) => {
    if (!isUserAdmin) {
      alert('Access Denied: Only Administrator accounts can delete hardware assets.');
      return;
    }
    if (window.confirm(`Delete hardware asset ${tag}?`)) {
      const updated = hardwareList.filter(h => h.id !== id);
      updateItsmSection('hardware', updated, "HARDWARE_DELETED", `Deleted hardware asset ${tag}`);
    }
  };

  // --- 10. IT AMC PREVENTIVE MAINTENANCE ---
  const handleMarkPmComplete = (pmId, branchName) => {
    if (!isUserAdmin) {
      alert('Access Denied: Only Administrator accounts can complete PM records.');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const updated = amcPmLogs.map(pm => pm.id === pmId ? { ...pm, status: 'Completed', completionDate: today, branchStampReceived: true } : pm);
    updateItsmSection('amcPm', updated, "ITSM_PM_COMPLETED", `Marked quarterly maintenance complete for ${branchName}`);
  };

  // --- 11. PRINT MONTHLY ITSM PERFORMANCE REPORT ---
  const handlePrintItsmReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the report.');
      return;
    }

    const openCount = tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length;
    const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
    const totalCount = tickets.length || 1;
    const slaRate = Math.round((resolvedCount / totalCount) * 100);

    const pmCompleted = amcPmLogs.filter(p => p.status === 'Completed').length;
    const pmScheduled = amcPmLogs.length;

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ITSM Monthly Performance & Service Audit</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 25px; color: #0f172a; }
          .container { max-width: 800px; margin: 0 auto; }
          h2 { text-transform: uppercase; font-size: 18px; margin: 15px 0 5px 0; }
          .badge { background: #0284c7; color: white; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; }
          .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px 0; }
          .metric-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; text-align: center; }
          .metric-val { font-size: 22px; font-weight: 800; font-family: monospace; color: #0f172a; margin-top: 4px; }
          .metric-lbl { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
          th { background: #f1f5f9; padding: 8px; text-align: left; text-transform: uppercase; font-size: 10px; border-bottom: 2px solid #cbd5e1; }
          td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
          .footer { margin-top: 30px; font-size: 10px; color: #64748b; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          ${getCompanyPrintHeaderHtml()}
          <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom: 2px solid #0f172a; padding-bottom: 10px;">
            <div>
              <span class="badge">IT SERVICE MANAGEMENT (ITSM) AUDIT REPORT</span>
              <h2>Barak Valley IT Operations & Banking SLA Audit</h2>
              <div style="font-size: 11px; color: #64748b;">Circle: Silchar, Cachar, Hailakandi & Karimganj</div>
            </div>
            <div style="text-align: right; font-size: 11px;">
              <div>Audit Date: <strong>${new Date().toISOString().split('T')[0]}</strong></div>
              <div>Report Authorized by: <strong>Tamal Roy (Proprietor)</strong></div>
            </div>
          </div>

          <div class="metrics">
            <div class="metric-card">
              <div class="metric-lbl">Total Incidents</div>
              <div class="metric-val">${tickets.length}</div>
            </div>
            <div class="metric-card">
              <div class="metric-lbl">Pending Calls</div>
              <div class="metric-val" style="color:#d97706;">${openCount}</div>
            </div>
            <div class="metric-card">
              <div class="metric-lbl">SLA Compliance</div>
              <div class="metric-val" style="color:#059669;">${slaRate}%</div>
            </div>
            <div class="metric-card">
              <div class="metric-lbl">Q3 PM Servicing</div>
              <div class="metric-val">${pmCompleted}/${pmScheduled} Branches</div>
            </div>
          </div>

          <h3 style="font-size: 13px; text-transform: uppercase; margin-top: 20px;">Active Banking Hardware Service Register</h3>
          <table>
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Hardware Model</th>
                <th>Branch Location</th>
                <th>Assigned User</th>
                <th>IP Address</th>
                <th>Warranty Status</th>
              </tr>
            </thead>
            <tbody>
              ${hardwareList.map(h => `
                <tr>
                  <td><strong>${escapeHtml(h.tag)}</strong></td>
                  <td>${escapeHtml(h.make)} ${escapeHtml(h.model)}</td>
                  <td>${escapeHtml(h.location)}</td>
                  <td>${escapeHtml(h.user)}</td>
                  <td style="font-family: monospace;">${escapeHtml(h.ip)}</td>
                  <td>${escapeHtml(h.warrantyUntil)} (${escapeHtml(h.status)})</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            M/S COMPUTER PLANET | Authorized Banking IT & Solar EPC Enterprise | Silchar, Assam - 788001
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  // Export CSV for Hardware
  const handleExportHardwareCSV = () => {
    const headers = ['Asset Tag', 'Make', 'Model', 'Type', 'Serial No', 'Location', 'IP', 'CPU', 'RAM', 'Storage', 'OS', 'Warranty Expiry', 'Status'];
    const rows = hardwareList.map(h => [
      `"${h.tag || ''}"`,
      `"${h.make || ''}"`,
      `"${h.model || ''}"`,
      `"${h.type || ''}"`,
      `"${h.serial || ''}"`,
      `"${h.location || ''}"`,
      `"${h.ip || ''}"`,
      `"${h.cpu || ''}"`,
      `"${h.ram || ''}"`,
      `"${h.storage || ''}"`,
      `"${h.os || ''}"`,
      h.warrantyUntil || '',
      `"${h.status || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `mcp_itsm_hardware_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {copiedKey && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copiedKey}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            <Server className="w-4 h-4 text-blue-600" />
            <span>Enterprise IT Service Management (ITSM)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            IT Support & Infrastructure Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            11-Part ITIL-aligned operations suite managing banking helpdesk, assets, networks, licenses, and PM schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintItsmReport}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Monthly Audit</span>
          </button>
        </div>
      </div>

      {/* 11 Submodule Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-[980px]">
          {SUBMODULES.map((sm) => {
            const Icon = sm.icon;
            const isActive = activeSubModule === sm.id;
            return (
              <button
                key={sm.id}
                onClick={() => setActiveSubModule(sm.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sm.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBMODULE 1: IT HELPDESK & SERVICE CATALOG */}
      {activeSubModule === 'helpdesk' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceCatalog.map((srv) => (
              <div key={srv.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {srv.id}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>{srv.slaHours}h SLA</span>
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{srv.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{srv.description}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[11px] font-semibold text-slate-400">{srv.category}</span>
                  {isUserAdmin ? (
                    <button
                      onClick={() => handleOpenReqModal(srv)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1"
                    >
                      <span>Request Service</span>
                      <span>→</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => alert("Access Denied: Only Administrator accounts can log service requests.")}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-400 font-bold text-xs flex items-center gap-1 cursor-not-allowed opacity-80"
                      title="Admin privileges required"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Request (Admin Only)</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Knowledge Base FAQs */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Barak Valley IT Troubleshooting Knowledge Base (SOP)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqList.map((faq, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-start gap-1.5">
                    <span className="text-blue-600 shrink-0">Q:</span>
                    <span>{faq.q}</span>
                  </div>
                  <div className="text-xs text-slate-600 pl-4 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULE 2: IT TICKETS & SLA MATRIX */}
      {activeSubModule === 'tickets' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tickets by ID, branch, problem description or engineer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
              />
            </div>
            <div className="text-xs font-bold text-slate-500">
              Total Support Cases: <span className="text-slate-900">{tickets.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Client / Branch</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Assigned Engineer</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-mono font-bold text-blue-700">{t.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{t.clientName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{t.description}</div>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{t.type}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                        t.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={t.status}
                        onChange={(e) => handleUpdateTicketStatus(t.id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                          t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          t.status === 'In Progress' ? 'bg-blue-50 text-blue-800 border-blue-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">{t.assignedTo}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => triggerWhatsAppClient(t)}
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                        title="WhatsApp status update"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBMODULE 3: HARDWARE ASSETS */}
      {activeSubModule === 'hardware' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isUserAdmin ? (
                <button
                  onClick={() => setShowHwModal(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enroll New Hardware</span>
                </button>
              ) : (
                <button
                  onClick={() => alert("Access Denied: Only Administrator accounts can enroll hardware assets.")}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs flex items-center gap-1.5 border border-slate-200 cursor-not-allowed opacity-80"
                  title="Admin privileges required"
                >
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>Enroll Hardware (Admin Only)</span>
                </button>
              )}
              <button
                onClick={handleExportHardwareCSV}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 border border-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
            <div className="text-xs text-slate-500">
              Total Hardware Registered: <strong className="text-slate-900">{hardwareList.length} Units</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hardwareList.map((hw) => (
              <div key={hw.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {hw.tag}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{hw.make} {hw.model}</h3>
                    <div className="text-[11px] text-slate-500 font-medium">{hw.type} • {hw.location}</div>
                  </div>
                  {isUserAdmin ? (
                    <button
                      onClick={() => handleDeleteHardware(hw.id, hw.tag)}
                      className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => alert('Access Denied: Only Administrator accounts can delete hardware assets.')}
                      className="p-1 text-slate-300 cursor-not-allowed"
                      title="Admin privileges required"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Serial No:</span><strong className="font-mono text-slate-800">{hw.serial}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">IP Address:</span><strong className="font-mono text-slate-800">{hw.ip}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">Specs:</span><span className="text-slate-700 truncate">{hw.cpu} / {hw.ram} / {hw.storage}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Warranty Until:</span><strong className="text-emerald-700">{hw.warrantyUntil}</strong></div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Assigned: <strong>{hw.user || 'Unassigned'}</strong></span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">{hw.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMODULE 4: SOFTWARE & LICENSES */}
      {activeSubModule === 'software' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {softwareList.map((sw) => (
            <div key={sw.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {sw.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{sw.name}</h3>
                  <div className="text-[11px] text-slate-500">{sw.publisher} • Host: {sw.host}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {sw.status}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">License Key:</span>
                  <div className="flex items-center gap-1.5 font-mono text-slate-800">
                    <span>{revealedSecrets[sw.id] ? sw.licenseKey : '••••-••••-••••-' + sw.licenseKey.slice(-4)}</span>
                    <button onClick={() => toggleSecret(sw.id)} className="text-slate-400 hover:text-slate-700">
                      {revealedSecrets[sw.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => copyToClipboard(sw.licenseKey, `License key for ${sw.name} copied!`)} className="text-slate-400 hover:text-slate-700">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Seat Utilization:</span>
                    <strong>{sw.allocatedSeats} / {sw.totalSeats} Seats</strong>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${(sw.allocatedSeats / sw.totalSeats) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">License Expiry:</span>
                  <strong className="text-amber-700">{sw.expiryDate}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBMODULE 5: NETWORK & IP INFRASTRUCTURE */}
      {activeSubModule === 'network' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {networkNodes.map((net) => (
            <div key={net.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Network className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{net.name}</h3>
                    <div className="text-[11px] text-slate-500">{net.make} {net.model}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>{net.status}</span>
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs font-mono">
                <div className="flex justify-between"><span className="text-slate-500 font-sans">Static IP:</span><strong>{net.ip}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500 font-sans">Subnet Mask:</span><strong>{net.subnet}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500 font-sans">ISP Link:</span><span className="text-slate-800 truncate">{net.isp}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-sans">30-Day Uptime:</span><strong className="text-emerald-700 font-sans">{net.uptime}</strong></div>
              </div>

              <div className="text-[11px] text-slate-500">
                Location: <strong>{net.location}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBMODULE 6: CORPORATE EMAIL */}
      {activeSubModule === 'email' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">User & Mailbox</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Provider</th>
                <th className="p-3">Storage Quota</th>
                <th className="p-3">2FA MFA</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {emailAccounts.map((eml) => (
                <tr key={eml.id} className="hover:bg-slate-50/60">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{eml.name}</div>
                    <div className="text-[10px] text-slate-400">{eml.role}</div>
                  </td>
                  <td className="p-3 font-mono text-blue-700 font-bold">{eml.email}</td>
                  <td className="p-3 text-slate-600">{eml.provider}</td>
                  <td className="p-3">
                    <div className="text-[11px] font-mono mb-1">{eml.quotaUsedGb} / {eml.quotaTotalGb} GB</div>
                    <div className="w-28 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(eml.quotaUsedGb / eml.quotaTotalGb) * 100}%` }} />
                    </div>
                  </td>
                  <td className="p-3">
                    {eml.mfaEnabled ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">✓ 2FA Active</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">⚠️ Disabled</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">{eml.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUBMODULE 7: WEBSITE & DOMAIN */}
      {activeSubModule === 'domains' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {domainsList.map((dom) => (
              <div key={dom.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      HTTP {dom.httpStatus} OK
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span>{dom.domain}</span>
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Auto-Renew ON
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Domain Registrar:</span><strong>{dom.registrar}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">Domain Expiry:</span><strong className="text-blue-700">{dom.expiryDate}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">SSL Certificate:</span><strong>{dom.sslIssuer}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">SSL Valid Until:</span><strong className="text-emerald-700">{dom.sslExpiryDate}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">Server Target IP:</span><strong className="font-mono">{dom.ipTarget}</strong></div>
                </div>

                <p className="text-xs text-slate-500">{dom.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMODULE 8: ACCESS & CREDENTIALS VAULT */}
      {activeSubModule === 'access' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">Target System / Service</th>
                <th className="p-3">Host URL / IP</th>
                <th className="p-3">Username</th>
                <th className="p-3">Privilege Level</th>
                <th className="p-3">MFA Policy</th>
                <th className="p-3">Last Rotated</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accessVault.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-bold text-slate-900">{acc.system}</td>
                  <td className="p-3 font-mono text-slate-600">{acc.hostIp}</td>
                  <td className="p-3 font-mono text-blue-700">{acc.username}</td>
                  <td className="p-3 font-semibold text-slate-800">{acc.accessLevel}</td>
                  <td className="p-3">
                    {acc.mfaRequired ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">MFA Enforced</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">Standard</span>
                    )}
                  </td>
                  <td className="p-3 text-slate-500">{acc.lastRotated}</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">{acc.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUBMODULE 9: IT VENDORS & OEMS */}
      {activeSubModule === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendorList.map((vnd) => (
            <div key={vnd.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{vnd.category}</span>
                  <h3 className="font-bold text-slate-900 text-base mt-0.5">{vnd.name}</h3>
                </div>
                <a
                  href={vnd.rmaPortal}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 text-[11px] font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>RMA Portal</span>
                </a>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Toll-Free Helpline:</span><strong className="font-mono text-blue-700">{vnd.tollFree}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Support Email:</span><strong className="font-mono text-slate-800">{vnd.email}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Silchar Hub / ASP:</span><span className="text-slate-800 truncate">{vnd.silcharHub}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Account Manager:</span><strong className="text-slate-900">{vnd.accountManager}</strong></div>
              </div>

              <p className="text-xs text-slate-500">{vnd.notes}</p>
            </div>
          ))}
        </div>
      )}

      {/* SUBMODULE 10: IT AMC PREVENTIVE MAINTENANCE */}
      {activeSubModule === 'amc_pm' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {amcPmLogs.map((pm) => (
              <div key={pm.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{pm.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      pm.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {pm.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{pm.branch}</h3>
                  <div className="text-xs text-slate-500 font-semibold">{pm.scheduledQuarter} • Eng: {pm.engineer}</div>

                  <div className="mt-3 p-2.5 bg-slate-50 rounded-xl space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Quarterly Check Tasks:</div>
                    <ul className="text-xs text-slate-600 list-disc pl-4 space-y-0.5">
                      {pm.tasks.map((task, i) => <li key={i}>{task}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {pm.branchStampReceived ? '✓ Branch Stamp OK' : 'Stamp Pending'}
                  </span>
                  {pm.status !== 'Completed' && (
                    isUserAdmin ? (
                      <button
                        onClick={() => handleMarkPmComplete(pm.id, pm.branch)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        Mark Complete
                      </button>
                    ) : (
                      <button
                        onClick={() => alert("Access Denied: Only Administrator accounts can complete PM records.")}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed flex items-center gap-1"
                        title="Admin only"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Complete (Admin Only)</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMODULE 11: IT REPORTS & SLA METRICS */}
      {activeSubModule === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-slate-400 text-xs font-bold uppercase">Total Incidents</span>
              <div className="text-3xl font-black text-slate-900 mt-1 font-mono">{tickets.length}</div>
              <div className="text-[11px] text-slate-500 mt-1">Across 50 PNB branches & postal AMCs</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-slate-400 text-xs font-bold uppercase">SLA Resolution Rate</span>
              <div className="text-3xl font-black text-emerald-600 mt-1 font-mono">
                {Math.round((tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length / (tickets.length || 1)) * 100)}%
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">Under 2-4 Hr Priority SLA</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-slate-400 text-xs font-bold uppercase">Hardware Under Support</span>
              <div className="text-3xl font-black text-blue-600 mt-1 font-mono">{hardwareList.length}</div>
              <div className="text-[11px] text-blue-700 mt-1">Desktops, Printers & Servers</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-slate-400 text-xs font-bold uppercase">Network Nodes Online</span>
              <div className="text-3xl font-black text-purple-600 mt-1 font-mono">{networkNodes.length}</div>
              <div className="text-[11px] text-purple-700 mt-1">100% Uptime across Silchar HQ</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Official Monthly ITSM Audit Document</h3>
              <p className="text-xs text-slate-500 mt-1">
                Generate the official printable monthly SLA compliance sheet for Punjab National Bank Circle Office Silchar.
              </p>
            </div>
            <button
              onClick={handlePrintItsmReport}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center gap-2 shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>Generate Audit Sheet</span>
            </button>
          </div>
        </div>
      )}

      {/* SERVICE REQUEST MODAL */}
      {showReqModal && selectedService && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedService.id} • {selectedService.slaHours}h SLA
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{selectedService.title}</h3>
              </div>
              <button onClick={() => setShowReqModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitServiceReq} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client / Branch Organization</label>
                <input
                  type="text"
                  required
                  value={reqForm.clientName}
                  onChange={(e) => setReqForm({ ...reqForm, clientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requester Staff Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Branch Manager"
                    value={reqForm.requesterName}
                    onChange={(e) => setReqForm({ ...reqForm, requesterName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 94350 xxxxx"
                    value={reqForm.phone}
                    onChange={(e) => setReqForm({ ...reqForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Incident / Problem Notes</label>
                <textarea
                  rows="3"
                  value={reqForm.description}
                  onChange={(e) => setReqForm({ ...reqForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReqModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow"
                >
                  Confirm & Dispatch Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HARDWARE ENROLLMENT MODAL */}
      {showHwModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Enroll New Hardware Asset</h3>
              <button onClick={() => setShowHwModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHardware} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Asset Tag (e.g. MCP-PC-045)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank"
                    value={hwForm.tag}
                    onChange={(e) => setHwForm({ ...hwForm, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hardware Type</label>
                  <select
                    value={hwForm.type}
                    onChange={(e) => setHwForm({ ...hwForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <option value="Desktop PC">Desktop PC</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Laser Printer">Laser Printer</option>
                    <option value="Passbook Printer">Passbook Printer</option>
                    <option value="High Speed Scanner">High Speed Scanner</option>
                    <option value="Server">Database / Server</option>
                    <option value="Online UPS">Online UPS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Make / Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="HP, Dell, Epson, etc."
                    value={hwForm.make}
                    onChange={(e) => setHwForm({ ...hwForm, make: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    placeholder="ProDesk 400, M404dn"
                    value={hwForm.model}
                    onChange={(e) => setHwForm({ ...hwForm, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    required
                    placeholder="SN-XXXX-XXXX"
                    value={hwForm.serial}
                    onChange={(e) => setHwForm({ ...hwForm, serial: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch / Location</label>
                  <input
                    type="text"
                    required
                    placeholder="PNB Silchar, Tarapur, etc."
                    value={hwForm.location}
                    onChange={(e) => setHwForm({ ...hwForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowHwModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow"
                >
                  Save Hardware Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
