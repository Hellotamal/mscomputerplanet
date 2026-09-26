import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Send, 
  CheckCircle2, 
  Search, 
  Phone, 
  Download, 
  Copy, 
  Check, 
  AlertCircle,
  Wrench,
  Smartphone,
  MapPin
} from 'lucide-react';
import { loadErpData, saveErpData } from '../erp/erpStorage';
import { generateEntityId } from '../erp/erpSecurity';
import { PNB_BRANCHES_DATA } from '../data/pnbBranchesData';

export default function CustomerComplaintApp({ onBackToHome }) {
  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'track' | 'helpline'
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Form State
  const [ticketId] = useState(() => generateEntityId('TCK-2026'));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [copied, setCopied] = useState(false);

  const [customerType, setCustomerType] = useState('pnb'); // 'pnb' | 'amc' | 'retail'
  const [selectedPnbSolId, setSelectedPnbSolId] = useState('047220');

  const defaultPnb = PNB_BRANCHES_DATA.find(b => b.solId === '047220') || PNB_BRANCHES_DATA[0];

  const [formData, setFormData] = useState({
    clientName: `Punjab National Bank - ${defaultPnb.name}`,
    clientCode: `PNB-SOL-${defaultPnb.solId}`,
    address: defaultPnb.address,
    contactPerson: '',
    designation: 'Branch Manager',
    phone: '',
    email: '',
    category: 'Passbook Printer Jam / Printing Issue',
    hardwareMake: 'Epson PLQ-20 / PLQ-30 Passbook Printer',
    serialNumber: '',
    urgency: 'Medium (24-Hour SLA)',
    description: ''
  });

  // Track Ticket State
  const [searchTicketId, setSearchTicketId] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');

  // Handle PWA Install Prompt
  useEffect(() => {
    document.title = 'Service Complaint Register App | M/S Computer Planet Silchar';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert('App is ready! On Chrome/Android, tap the menu (3 dots) and select "Add to Home screen" to install.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handlePnbSelect = (solId) => {
    setSelectedPnbSolId(solId);
    const branch = PNB_BRANCHES_DATA.find(b => b.solId === solId);
    if (branch) {
      setFormData(prev => ({
        ...prev,
        clientName: `Punjab National Bank - ${branch.name}`,
        clientCode: `PNB-SOL-${branch.solId}`,
        address: branch.address,
        designation: 'Branch Manager'
      }));
    }
  };

  const handleCustomerTypeChange = (type) => {
    setCustomerType(type);
    if (type === 'pnb') {
      const branch = PNB_BRANCHES_DATA.find(b => b.solId === selectedPnbSolId) || defaultPnb;
      setFormData(prev => ({
        ...prev,
        clientName: `Punjab National Bank - ${branch.name}`,
        clientCode: `PNB-SOL-${branch.solId}`,
        address: branch.address,
        designation: 'Branch Manager'
      }));
    } else if (type === 'amc') {
      setFormData(prev => ({
        ...prev,
        clientName: '',
        clientCode: 'AMC-ENTERPRISE',
        address: '',
        designation: 'IT In-Charge'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        clientName: '',
        clientCode: 'GENERAL-CUSTOMER',
        address: '',
        designation: 'Customer'
      }));
    }
  };

  const categories = [
    'Passbook Printer Jam / Printing Issue',
    'Bank Application / CBS / Software Issue',
    'Desktop Hardware / Boot Failure',
    'LaserJet Printer / Toner / Paper Feed Fault',
    'Branch Switch / Router / LAN Network Failure',
    'Solar Inverter Fault / Error Code / Tripping',
    'Solar Battery Charging / Power Storage Issue',
    'Preventive Maintenance (PM) AMC Request',
    'Emergency Resident Engineer On-Site Visit'
  ];

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    if (!formData.contactPerson.trim() || !formData.phone.trim() || !formData.description.trim()) {
      alert('Please fill in your Name, Phone Number, and Complaint Description.');
      return;
    }

    const newTicket = {
      id: ticketId,
      clientName: formData.clientName || 'General Customer',
      clientCode: formData.clientCode || 'GEN-01',
      address: formData.address || 'Silchar, Cachar',
      contactPerson: formData.contactPerson,
      designation: formData.designation,
      phone: formData.phone,
      email: formData.email,
      category: formData.category,
      hardwareMake: formData.hardwareMake,
      serialNumber: formData.serialNumber || 'N/A',
      urgency: formData.urgency,
      description: formData.description,
      status: 'Open',
      assignedEngineer: 'Dipankar Das (Resident Engineer - Silchar)',
      createdAt: new Date().toISOString().split('T')[0],
      slaHours: formData.urgency.includes('2-Hour') ? 2 : 24,
      priority: formData.urgency.includes('Emergency') ? 'Emergency' : 'High'
    };

    // Save ticket to local ERP storage
    try {
      const erpData = loadErpData();
      const updatedTickets = [newTicket, ...(erpData.tickets || [])];
      saveErpData({ ...erpData, tickets: updatedTickets });
    } catch {
      // Fallback
    }

    setSubmittedTicket(newTicket);
    setIsSubmitted(true);

    // Dispatch instant alert to WhatsApp Engineer Desk
    const msg = 
      `*🚨 SERVICE COMPLAINT REGISTERED - M/S COMPUTER PLANET*%0A%0A` +
      `🎫 *Ticket Ref:* ${newTicket.id}%0A` +
      `🏢 *Client / Branch:* ${encodeURIComponent(newTicket.clientName)}%0A` +
      `📍 *Location:* ${encodeURIComponent(newTicket.address)}%0A` +
      `👤 *Contact:* ${encodeURIComponent(newTicket.contactPerson)} (${encodeURIComponent(newTicket.designation)})%0A` +
      `📞 *Phone:* ${encodeURIComponent(newTicket.phone)}%0A` +
      `⚠️ *Category:* ${encodeURIComponent(newTicket.category)}%0A` +
      `🖥️ *Equipment:* ${encodeURIComponent(newTicket.hardwareMake)} (S/N: ${encodeURIComponent(newTicket.serialNumber)})%0A` +
      `🚨 *Urgency:* ${encodeURIComponent(newTicket.urgency)}%0A` +
      `📝 *Issue Description:* ${encodeURIComponent(newTicket.description)}%0A%0A` +
      `_Logged via Mobile Complaint Register App_`;

    window.open(`https://wa.me/918638083712?text=${msg}`, '_blank');
  };

  const handleTrackSearch = (e) => {
    e.preventDefault();
    if (!searchTicketId.trim()) return;

    setTrackError('');
    setTrackResult(null);

    const query = searchTicketId.trim().toUpperCase();

    try {
      const erpData = loadErpData();
      const allTickets = erpData.tickets || [];
      const found = allTickets.find(t => 
        t.id.toUpperCase() === query || 
        t.phone.includes(query) || 
        t.clientName.toLowerCase().includes(query.toLowerCase())
      );

      if (found) {
        setTrackResult(found);
      } else {
        setTrackError(`No active complaint ticket found matching "${searchTicketId}". Please check your Ticket Ref (e.g. TCK-2026-1001) or phone number.`);
      }
    } catch {
      setTrackError('Could not load tickets. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased pb-20">
      {/* App Top Bar Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                Computer Planet Complaint Desk
              </h1>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                Silchar • Cachar • Karimganj • Hailakandi
              </span>
            </div>
          </div>

          <button
            onClick={handleInstallPWA}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 shrink-0"
            title="Install App on Android Home Screen"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Install App</span>
          </button>
        </div>
      </header>

      {/* Navigation App Tabs */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>New Complaint</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'track'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track Status</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('helpline')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'helpline'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Helpline</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        
        {/* TAB 1: REGISTER NEW COMPLAINT */}
        {activeTab === 'register' && (
          <div>
            {isSubmitted && submittedTicket ? (
              /* Success Confirmation Card */
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                    Complaint Registered Successfully
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Ticket Ref: {submittedTicket.id}
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mt-2 leading-relaxed">
                    Your breakdown complaint has been logged and dispatched to our resident engineers in Silchar.
                  </p>
                </div>

                {/* Ticket Details Summary Card */}
                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/80 text-left text-xs space-y-2.5 font-sans">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Client / Branch:</span>
                    <span className="font-bold text-white text-right">{submittedTicket.clientName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Issue Category:</span>
                    <span className="font-semibold text-emerald-400 text-right">{submittedTicket.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Assigned Engineer:</span>
                    <span className="font-semibold text-sky-400 text-right">{submittedTicket.assignedEngineer}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">SLA Target Resolution:</span>
                    <span className="font-mono font-bold text-amber-400">{submittedTicket.urgency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contact Person:</span>
                    <span className="font-medium text-slate-200">{submittedTicket.contactPerson} ({submittedTicket.phone})</span>
                  </div>
                </div>

                {/* Copy Ticket ID & Quick Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(submittedTicket.id);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied Ticket ID!' : 'Copy Ticket ID'}</span>
                  </button>

                  <a
                    href="tel:+918638083712"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Resident Engineer</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-slate-400 hover:text-white underline pt-2 block mx-auto"
                >
                  Register Another Complaint
                </button>
              </div>
            ) : (
              /* Complaint Form */
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Wrench className="w-3.5 h-3.5" />
                    Official Breakdown Ticket Register
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Register IT Hardware / Solar Service Complaint
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Log service breakdowns for PNB branches, enterprise AMC clients, or commercial customers across Silchar & Barak Valley.
                  </p>
                </div>

                {/* Customer Type Choice Pills */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    Select Customer Category *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'pnb', label: 'PNB Bank Branch', desc: 'Punjab National Bank 50+ Branches' },
                      { id: 'amc', label: 'Commercial AMC', desc: 'Offices / Schools / Colleges' },
                      { id: 'retail', label: 'Home / Retail', desc: 'Personal Computers & Solar' }
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleCustomerTypeChange(type.id)}
                        className={`p-3 rounded-2xl border text-left transition ${
                          customerType === type.id
                            ? 'bg-emerald-500/10 border-emerald-500 text-white ring-1 ring-emerald-500'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{type.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmitComplaint} className="space-y-4">
                  {/* PNB Branch Select Dropdown */}
                  {customerType === 'pnb' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Select PNB Branch Location *
                      </label>
                      <select
                        value={selectedPnbSolId}
                        onChange={(e) => handlePnbSelect(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {PNB_BRANCHES_DATA.map(b => (
                          <option key={b.solId} value={b.solId}>
                            SOL #{b.solId} - {b.name} ({b.district})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Client Name & Code */}
                  {customerType !== 'pnb' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Firm / Customer Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Saha Enterprise / Debashis Roy"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  {/* Contact Person & Designation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Designation / Role
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Branch Manager / Accountant"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        WhatsApp Phone Number * <span className="text-[10px] text-slate-500 font-normal">(For SLA SMS/Alerts)</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 94350 12345"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. pnb047220@pnb.co.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Breakdown Category Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Fault / Issue Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {categories.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Hardware Model & Serial Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Equipment / Model Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Epson PLQ-20 / HP LaserJet Pro"
                        value={formData.hardwareMake}
                        onChange={(e) => setFormData({ ...formData, hardwareMake: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Equipment Serial Number <span className="text-[10px] text-slate-500 font-normal">(If available)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SN-892182-E"
                        value={formData.serialNumber}
                        onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Urgency SLA Level */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Service Urgency & SLA Level *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { id: 'Emergency (2-Hour On-Site SLA)', label: '🚨 Emergency (2-Hour On-Site)', desc: 'Critical Banking / Counter Halt' },
                        { id: 'Medium (24-Hour SLA)', label: '⚡ Standard (24-Hour SLA)', desc: 'Routine Maintenance / Software' }
                      ].map(u => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, urgency: u.id })}
                          className={`p-2.5 rounded-xl border text-left transition ${
                            formData.urgency === u.id
                              ? 'bg-emerald-500/10 border-emerald-500 text-white ring-1 ring-emerald-500'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <div className="text-xs font-bold">{u.label}</div>
                          <div className="text-[10px] text-slate-500">{u.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Detailed Problem Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Passbook printer paper feed gear slipping during customer transaction printing. Displaying error light."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Register Complaint & Send Alert</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TRACK TICKET STATUS */}
        {activeTab === 'track' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Search className="w-3.5 h-3.5" />
                  Live SLA Tracker
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Track Complaint Ticket Status
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Enter your Ticket Ref (e.g. TCK-2026-1001) or WhatsApp Phone Number to view assigned engineer & resolution status.
                </p>
              </div>

              <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  placeholder="Enter Ticket ID (e.g. TCK-2026-1001) or Phone..."
                  value={searchTicketId}
                  onChange={(e) => setSearchTicketId(e.target.value)}
                  className="flex-grow px-4 py-3 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Ticket</span>
                </button>
              </form>
            </div>

            {/* Track Search Error */}
            {trackError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{trackError}</span>
              </div>
            )}

            {/* Track Result Card */}
            {trackResult && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ticket Identifier</span>
                    <h3 className="text-xl font-black text-white font-mono">{trackResult.id}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    trackResult.status === 'Resolved' || trackResult.status === 'Closed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                  }`}>
                    Status: {trackResult.status || 'In Progress (Open)'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800/60 pb-2">
                    <span className="text-slate-400">Client / Branch:</span>
                    <span className="font-bold text-white">{trackResult.clientName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-2">
                    <span className="text-slate-400">Fault Category:</span>
                    <span className="font-semibold text-emerald-400">{trackResult.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-2">
                    <span className="text-slate-400">Assigned Resident Engineer:</span>
                    <span className="font-semibold text-sky-400">{trackResult.assignedEngineer || 'Dipankar Das (Silchar)'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-2">
                    <span className="text-slate-400">Logged On:</span>
                    <span className="font-mono text-slate-300">{trackResult.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Issue Description:</span>
                    <p className="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                      {trackResult.description}
                    </p>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="pt-2">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-3">Live Service Timeline</div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                      1. Logged & Alerted
                    </div>
                    <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold">
                      2. Engineer En Route
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                      3. Closure Sign-Off
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="tel:+918638083712"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Assigned Engineer Desk: +91 86380 83712</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DIRECT HELPLINE */}
        {activeTab === 'helpline' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <Headphones className="w-9 h-9" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                24/7 Regional Helpdesk
              </span>
              <h2 className="text-2xl font-black text-white">
                Silchar Service & Repair Helpline
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mt-2 leading-relaxed">
                Direct phone & WhatsApp support for emergency banking hardware breakdowns, passbook printer failures, and solar inverter tripping.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <a
                href="tel:+918638083712"
                className="p-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-left transition shadow-lg shadow-emerald-500/20 space-y-1 block"
              >
                <div className="flex items-center gap-2 font-black text-sm">
                  <Phone className="w-4 h-4" />
                  <span>Call Direct Sales Desk</span>
                </div>
                <div className="font-mono text-xs font-bold">+91 86380 83712</div>
                <div className="text-[10px] opacity-80">9:00 AM – 8:00 PM (Mon - Sat)</div>
              </a>

              <a
                href="https://wa.me/918638083712?text=Hello%20M/S%20Computer%20Planet,%20I%20need%20urgent%20technical%20support%20for%20a%20hardware%20complaint."
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white text-left transition shadow-lg shadow-green-600/20 space-y-1 block"
              >
                <div className="flex items-center gap-2 font-black text-sm">
                  <Send className="w-4 h-4" />
                  <span>WhatsApp Engineer Desk</span>
                </div>
                <div className="font-mono text-xs font-bold">+91 86380 83712</div>
                <div className="text-[10px] opacity-90">Instant WhatsApp Dispatch</div>
              </a>
            </div>

            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="text-xs text-slate-400 hover:text-white underline pt-4 block mx-auto"
              >
                ← Return to Website Home Page
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
