import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Send, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Cpu, 
  ShieldCheck, 
  Search, 
  FileText, 
  AlertTriangle, 
  Wrench, 
  Check, 
  Copy, 
  Phone, 
  Home,
  Sun,
  Printer,
  Wifi,
  Video
} from 'lucide-react';
import { loadErpData, saveErpData, recordAuditLog, INITIAL_TICKETS } from '../erp/erpStorage';
import { generateEntityId } from '../erp/erpSecurity';
import { PNB_BRANCHES_DATA } from '../data/pnbBranchesData';

export default function ComplaintRegister({ onBackToHome }) {
  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'track'
  const [ticketId, setTicketId] = useState(() => generateEntityId('TCK-2026'));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form States
  const [clientType, setClientType] = useState('amc'); // 'amc' | 'general'
  const [selectedPnbSolId, setSelectedPnbSolId] = useState('047220');

  const defaultPnbBranch = PNB_BRANCHES_DATA.find(b => b.solId === '047220') || PNB_BRANCHES_DATA[0];

  const [formData, setFormData] = useState({
    clientName: `Punjab National Bank - ${defaultPnbBranch.name}`,
    clientCode: `PNB-SOL-${defaultPnbBranch.solId}`,
    address: defaultPnbBranch.address,
    contactPerson: '',
    designation: 'Branch Manager',
    phone: '',
    email: '',
    district: 'Silchar (Main City)',
    category: 'Passbook Printer Jam / Printing Issue',
    priority: 'High Priority (Same Day SLA)',
    hardwareMake: 'Epson PLQ-20 / PLQ-30 Passbook Printer',
    serialNumber: '',
    description: ''
  });

  // Tracking State
  const [trackQuery, setTrackQuery] = useState('');
  const [foundTicket, setFoundTicket] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    document.title = 'Register Customer Service Complaint & Track Ticket | M/S Computer Planet Silchar';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePnbBranchSelect = (solId) => {
    setSelectedPnbSolId(solId);
    const branch = PNB_BRANCHES_DATA.find(b => b.solId === solId);
    if (branch) {
      setFormData(prev => ({
        ...prev,
        clientName: `Punjab National Bank - ${branch.name}`,
        clientCode: `PNB-SOL-${branch.solId}`,
        address: branch.address,
        designation: 'Branch Manager',
        hardwareMake: prev.hardwareMake || 'Epson PLQ-20/PLQ-30 Passbook Printer',
      }));
    }
  };

  const handleClientTypeChange = (type) => {
    setClientType(type);
    if (type === 'amc') {
      const branch = PNB_BRANCHES_DATA.find(b => b.solId === selectedPnbSolId) || defaultPnbBranch;
      setSelectedPnbSolId(branch.solId);
      setFormData(prev => ({
        ...prev,
        clientName: `Punjab National Bank - ${branch.name}`,
        clientCode: `PNB-SOL-${branch.solId}`,
        address: branch.address,
        designation: 'Branch Manager',
        hardwareMake: prev.hardwareMake || 'Epson PLQ-20/PLQ-30 Passbook Printer',
      }));
    } else {
      setSelectedPnbSolId('');
      setFormData(prev => ({
        ...prev,
        clientName: '',
        clientCode: 'COMMERCIAL-CLIENT',
        address: '',
        designation: 'Proprietor / IT Manager',
      }));
    }
  };

  const complaintCategories = [
    { label: 'Passbook Printer Jam / Printing Defect', icon: Printer },
    { label: 'Desktop / SMPS / Hardware Failure', icon: Cpu },
    { label: 'Solar Inverter Error Code / Grid Tripping', icon: Sun },
    { label: 'Solar Battery / Charging Anomaly', icon: Sun },
    { label: 'LaserJet Printer / Paper Feed Fault', icon: Printer },
    { label: 'Branch Switch / Router / LAN Outage', icon: Wifi },
    { label: 'CCTV Camera / NVR Recording Fault', icon: Video },
    { label: 'Preventive Maintenance (PM) AMC Request', icon: Wrench },
    { label: 'Emergency Resident Engineer On-Site Request', icon: AlertTriangle }
  ];

  const handleSubmitComplaint = (e) => {
    e.preventDefault();

    if (!formData.clientName.trim() || !formData.phone.trim()) {
      alert('Please enter your Full Name / Firm / Branch Name and WhatsApp Contact Phone Number.');
      return;
    }

    const finalMake = formData.hardwareMake.trim() || 'IT / Solar Hardware System';
    const finalSerial = formData.serialNumber.trim() || 'S/N-PENDING-INSPECTION';

    // 1. Save synchronously to ERP ticket database
    try {
      const existingTickets = loadErpData('tickets', INITIAL_TICKETS);
      const newTicket = {
        id: ticketId,
        caseCategory: clientType === 'amc' ? 'AMC Support Complaint Case' : 'Commercial/Residential Service Call',
        pnbSolId: selectedPnbSolId || null,
        clientName: formData.clientName.trim(),
        clientCode: formData.clientCode.trim() || 'UNREGISTERED-CLIENT',
        address: `${formData.address.trim()}, ${formData.district}`,
        contactPerson: formData.contactPerson.trim() || formData.clientName.trim(),
        designation: formData.designation.trim() || 'Authorized Client',
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        type: formData.category,
        priority: formData.priority,
        hardwareMake: finalMake,
        serialNumber: finalSerial,
        assignedTo: 'Resident Engineer - Auto Assigned (Silchar Circle)',
        status: 'Open',
        reportedDate: new Date().toISOString().split('T')[0],
        reportedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: formData.description.trim() || 'No specific symptoms provided.',
        resolution: 'Dispatched to Silchar Circle Engineering Desk.',
        source: 'Public Customer Complaint Portal App',
        timestamp: new Date().toISOString()
      };

      saveErpData('tickets', [newTicket, ...existingTickets]);

      recordAuditLog(
        'Customer Complaint Registered',
        'Tickets',
        `Complaint Case ${ticketId} registered by ${formData.clientName} [Priority: ${formData.priority}] for ${finalMake} (S/N: ${finalSerial})`,
        formData.contactPerson || 'Public App'
      );
    } catch (err) {
      console.error('Error saving complaint to ERP storage:', err);
    }

    // 2. Build WhatsApp Alert Payload
    const whatsappMsg = 
      `*🚨 EMERGENCY IT/SOLAR SERVICE COMPLAINT REGISTERED*%0A%0A` +
      `📌 *Ticket Ref:* ${ticketId}%0A` +
      `🏢 *Client / Branch:* ${encodeURIComponent(formData.clientName)}%0A` +
      (formData.clientCode ? `🏷️ *Client Code:* ${encodeURIComponent(formData.clientCode)}%0A` : '') +
      `👤 *Contact Person:* ${encodeURIComponent(formData.contactPerson || formData.clientName)}%0A` +
      `📞 *Phone:* ${encodeURIComponent(formData.phone)}%0A` +
      `📍 *District / Address:* ${encodeURIComponent(formData.district)} (${encodeURIComponent(formData.address || 'Silchar')})%0A%0A` +
      `⚠️ *Complaint Type:* ${encodeURIComponent(formData.category)}%0A` +
      `🔥 *Priority SLA:* ${encodeURIComponent(formData.priority)}%0A` +
      `🖥️ *Equipment Make:* ${encodeURIComponent(finalMake)}%0A` +
      `🔢 *Serial No:* ${encodeURIComponent(finalSerial)}%0A` +
      `📝 *Fault Symptoms:* ${encodeURIComponent(formData.description || 'Hardware fault reported')}%0A%0A` +
      `_Logged via www.mscomputerplanet.com Complaint Register App_`;

    window.open(`https://wa.me/918638083712?text=${whatsappMsg}`, '_blank');
    setIsSubmitted(true);
  };

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSearchTicket = (e) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    setHasSearched(true);
    const tickets = loadErpData('tickets', INITIAL_TICKETS);
    const q = trackQuery.trim().toLowerCase();

    const match = tickets.find(t => 
      t.id.toLowerCase() === q || 
      (t.phone && t.phone.replaceAll(' ', '').includes(q.replaceAll(' ', ''))) ||
      t.clientName.toLowerCase().includes(q)
    );

    setFoundTicket(match || null);
  };

  const handleResetForm = () => {
    setTicketId(generateEntityId('TCK-2026'));
    setIsSubmitted(false);
    setFormData({
      clientName: `Punjab National Bank - ${defaultPnbBranch.name}`,
      clientCode: `PNB-SOL-${defaultPnbBranch.solId}`,
      address: defaultPnbBranch.address,
      contactPerson: '',
      designation: 'Branch Manager',
      phone: '',
      email: '',
      district: 'Silchar (Main City)',
      category: 'Passbook Printer Jam / Printing Issue',
      priority: 'High Priority (Same Day SLA)',
      hardwareMake: 'Epson PLQ-20 / PLQ-30 Passbook Printer',
      serialNumber: '',
      description: ''
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased">
      {/* Top Header Bar */}
      <header className="pt-24 pb-12 px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          {/* Home Button link */}
          <div className="flex justify-start mb-6">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition shadow-md"
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span>← Back to Main Home Page</span>
            </button>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
              <Headphones className="w-4 h-4" />
              <span>24/7 Incident & Complaint Registration Desk</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Customer Complaint Register & SLA Tracker
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Log breakdown complaints for IT hardware, Passbook printers, solar inverters, and network systems in Silchar, Cachar, Karimganj, and Hailakandi. Instant reference ticket ID & SLA tracking.
            </p>

            {/* Response SLA Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>2-4 Hour Emergency SLA in Silchar</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Official PNB & Corporate AMC Portal</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Navigation Tabs */}
        <div className="flex rounded-2xl bg-slate-900 p-1.5 border border-slate-800 mb-8 shadow-inner">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>📝 Register New Complaint</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'track'
                ? 'bg-emerald-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>🔍 Track Complaint Status</span>
          </button>
        </div>

        {/* TAB 1: REGISTER NEW COMPLAINT */}
        {activeTab === 'register' && (
          <div>
            {isSubmitted ? (
              /* Success Receipt View */
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 text-center space-y-6 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold">
                    Official Service Ticket Registered
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Complaint Ticket #{ticketId}
                  </h2>
                  <p className="text-slate-400 text-sm max-w-md mx-auto">
                    Your complaint has been logged in our Silchar ERP System and forwarded to the resident engineering desk.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 max-w-md mx-auto space-y-3 text-xs text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Ticket Reference:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400 text-sm">{ticketId}</span>
                      <button
                        onClick={handleCopyTicket}
                        className="p-1 text-slate-400 hover:text-white bg-slate-900 rounded transition"
                        title="Copy Ticket ID"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Client / Branch:</span>
                    <span className="font-semibold text-white text-right">{formData.clientName}</span>
                  </div>

                  <div className="flex justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Complaint Category:</span>
                    <span className="font-semibold text-slate-200 text-right">{formData.category}</span>
                  </div>

                  <div className="flex justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Priority SLA:</span>
                    <span className="font-semibold text-amber-400">{formData.priority}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Circle:</span>
                    <span className="font-semibold text-emerald-400">Silchar Central Service Desk</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href="tel:+918638083712"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Call Desk: +91 86380 83712</span>
                  </a>
                  <button
                    onClick={handleResetForm}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition"
                  >
                    Log Another Complaint
                  </button>
                </div>
              </div>
            ) : (
              /* Complaint Form */
              <form onSubmit={handleSubmitComplaint} className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                
                {/* Header Ticket Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>Complaint Ticket Reference:</span>
                  </div>
                  <span className="font-mono font-black text-emerald-400 text-sm px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    {ticketId}
                  </span>
                </div>

                {/* Client Category Selector (AMC Bank Branch vs Commercial/Residential) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    1. Account Type *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleClientTypeChange('amc')}
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        clientType === 'amc'
                          ? 'bg-emerald-500/10 border-emerald-500 text-white ring-1 ring-emerald-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-emerald-400" />
                        <span>PNB Bank Branch / Corporate AMC</span>
                      </div>
                      <div className="text-[11px] text-slate-400">Pre-registered AMC branch in Barak Valley</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleClientTypeChange('general')}
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        clientType === 'general'
                          ? 'bg-emerald-500/10 border-emerald-500 text-white ring-1 ring-emerald-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center gap-2 mb-1">
                        <Wrench className="w-4 h-4 text-sky-400" />
                        <span>Commercial / Retail / Home Customer</span>
                      </div>
                      <div className="text-[11px] text-slate-400">General service call or on-demand repair</div>
                    </button>
                  </div>
                </div>

                {/* PNB Branch Dropdown if AMC mode */}
                {clientType === 'amc' && (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <label className="block text-xs font-bold text-slate-300">
                      Select PNB Branch (50+ Locations in Barak Valley):
                    </label>
                    <select
                      value={selectedPnbSolId}
                      onChange={(e) => handlePnbBranchSelect(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {PNB_BRANCHES_DATA.map(branch => (
                        <option key={branch.solId} value={branch.solId}>
                          SOL {branch.solId} - {branch.name} ({branch.district})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Customer Details */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    2. Customer & Contact Details
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name / Firm Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Debashis Roy / PNB Silchar Main"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        WhatsApp Contact Phone * <span className="text-[10px] text-emerald-400">(SLA Alerts)</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 94350 12345"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        District / City Location *
                      </label>
                      <select
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Silchar (Main City)">Silchar (Main City & Outskirts)</option>
                        <option value="Cachar District">Cachar District (Lakhipur / Sonai)</option>
                        <option value="Karimganj District">Karimganj District</option>
                        <option value="Hailakandi District">Hailakandi District</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Detailed Office / Delivery Address *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Park Road, Near Club Road, Silchar"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Complaint Classification */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    3. Complaint Classification & SLA Priority
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Complaint Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {complaintCategories.map((c, idx) => (
                          <option key={idx} value={c.label}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Priority Level SLA *
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Critical Emergency (2-4 Hr SLA)">🔴 Critical Emergency (2-4 Hr Response)</option>
                        <option value="High Priority (Same Day SLA)">🟠 High Priority (Same Day Response)</option>
                        <option value="Standard Maintenance (24 Hr SLA)">🟡 Standard Service Call (24 Hr Response)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Hardware Equipment Make & Model
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Epson PLQ-20 / HP ProDesk / Omnis Inverter"
                        value={formData.hardwareMake}
                        onChange={(e) => setFormData({ ...formData, hardwareMake: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Serial Number <span className="text-[10px] text-slate-400">(If available)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. S/N: G98K294101"
                        value={formData.serialNumber}
                        onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Detailed Fault Symptoms & Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe what error occurred, LED indicator colors, noise, or malfunction symptoms..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                </div>

                {/* Submit Action Footer */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    <span>Direct submission logs ticket in ERP & alerts resident engineer.</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Register Complaint & Send Alert</span>
                  </button>
                </div>

              </form>
            )}
          </div>
        )}

        {/* TAB 2: TRACK REGISTERED COMPLAINT */}
        {activeTab === 'track' && (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Track Service Complaint Status</h3>
              <p className="text-xs text-slate-400">
                Enter your Ticket Reference ID (e.g., <code className="text-emerald-400">TCK-2026-8412</code>) or your registered WhatsApp Phone Number.
              </p>
            </div>

            <form onSubmit={handleSearchTicket} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Enter Complaint ID (e.g. TCK-2026-...) or Phone Number"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="flex-1 px-4 py-3 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>

            {hasSearched && (
              <div className="pt-4 border-t border-slate-800">
                {foundTicket ? (
                  <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Ticket Reference</span>
                        <div className="text-lg font-black text-emerald-400 font-mono">{foundTicket.id}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        foundTicket.status === 'Open' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' :
                        foundTicket.status === 'In Progress' ? 'bg-sky-500/10 border border-sky-500/30 text-sky-400' :
                        'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      }`}>
                        {foundTicket.status || 'Active'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">Client / Branch Name:</span>
                        <span className="font-bold text-white">{foundTicket.clientName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Reported Date & Time:</span>
                        <span className="font-bold text-slate-200">{foundTicket.reportedDate || 'Today'} ({foundTicket.reportedTime || 'Recent'})</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Complaint Category:</span>
                        <span className="font-bold text-slate-200">{foundTicket.type}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Assigned Engineer:</span>
                        <span className="font-bold text-emerald-400">{foundTicket.assignedTo || 'Silchar Circle Resident Team'}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                      <span className="text-slate-500 block text-[10px] font-bold uppercase mb-1">Fault Description:</span>
                      <p className="text-slate-300">{foundTicket.description}</p>
                    </div>

                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Dispatched to Engineering Desk</span>
                      </div>
                      <a
                        href="tel:+918638083712"
                        className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px] hover:bg-emerald-400 transition"
                      >
                        Call Service Desk
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center mx-auto">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-white text-sm">No Matching Ticket Found</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      We could not find a ticket matching "<code className="text-slate-200">{trackQuery}</code>". Please check the Ticket ID or phone number, or register a new complaint.
                    </p>
                    <button
                      onClick={() => setActiveTab('register')}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                    >
                      Log New Service Complaint
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
