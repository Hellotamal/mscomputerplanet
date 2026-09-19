import React, { useState } from 'react';
import { 
  X, 
  Headphones, 
  Send, 
  CheckCircle2, 
  Copy, 
  Check, 
  Clock, 
  Building2,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { loadErpData, saveErpData, recordAuditLog, INITIAL_TICKETS } from '../erp/erpStorage';
import { generateEntityId } from '../erp/erpSecurity';
import { PNB_BRANCHES_DATA } from '../data/pnbBranchesData';

export default function SupportTicketModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return <SupportTicketDialog onClose={onClose} />;
}

function SupportTicketDialog({ onClose }) {
  const [ticketId] = useState(() => generateEntityId('TCK-2026'));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Top-level complaint mode: 'new' = New Service Complaint Case; 'amc' = AMC Support Complaint Case
  const [complaintMode, setComplaintMode] = useState('amc');
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
    category: 'Passbook Printer Jam / Printing Issue',
    hardwareMake: 'Epson PLQ-20 / PLQ-30 Passbook Printer',
    serialNumber: '',
    description: ''
  });

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

  const handleModeChange = (mode) => {
    setComplaintMode(mode);
    if (mode === 'amc') {
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
        clientCode: 'NEW-SERVICE-CALL',
        address: '',
        designation: 'Authorized Staff',
      }));
    }
  };

  const categories = [
    'Passbook Printer Jam / Printing Issue',
    'Bank Application / CBS / Software Issue by User',
    'Preventive Maintenance (PM) AMC Visit',
    'Desktop Hardware / SMPS / Boot Failure',
    'LaserJet Printer / Toner / Paper Feed Defect',
    'Branch Switch / Router / Network LAN Failure',
    'Solar Inverter Fault / Error Code / Tripping',
    'Solar Battery Storage / Charging Anomaly',
    'Solar PV Panel Output / Wiring Issue',
    'General IT Peripherals / Scanner / CCTV Breakdown',
    'Emergency Resident Engineer On-Site Visit'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.clientName.trim() || !formData.phone.trim()) {
      alert('Please fill in your Name/Branch and Contact Phone Number.');
      return;
    }

    const finalMake = formData.hardwareMake.trim() || 'IT / Solar Hardware System';
    const finalSerial = formData.serialNumber.trim() || 'S/N-PENDING-INSPECTION';

    // 1. Synchronous ERP Database Save
    try {
      const existingTickets = loadErpData('tickets', INITIAL_TICKETS);
      const newTicket = {
        id: ticketId,
        caseCategory: complaintMode === 'amc' ? '2. AMC Support Complaint Case' : '1. New Service Complaint Case',
        pnbSolId: selectedPnbSolId || null,
        clientName: formData.clientName.trim(),
        clientCode: formData.clientCode.trim() || 'UNREGISTERED-CLIENT',
        address: formData.address.trim() || 'Silchar, Assam',
        contactPerson: formData.contactPerson.trim() || formData.clientName.trim(),
        designation: formData.designation.trim() || 'Authorized Representative',
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        type: formData.category,
        hardwareMake: finalMake,
        serialNumber: finalSerial,
        priority: 'Pending Assignment',
        prioritySla: 'To Be Defined by ERP Admin',
        assignedTo: 'Resident Engineer - Auto Assigned (Silchar Circle)',
        status: 'Open',
        reportedDate: new Date().toISOString().split('T')[0],
        reportedTime: new Date().toLocaleTimeString(),
        description: formData.description.trim() || 'No symptoms provided.',
        resolution: '',
        source: 'Public Customer Portal (Web/WhatsApp)',
        timestamp: new Date().toISOString()
      };

      saveErpData('tickets', [newTicket, ...existingTickets]);

      // Record in ERP IT Audit Trail
      recordAuditLog(
        'Support Ticket Logged (Portal)',
        'Tickets',
        `Case ${ticketId} registered by ${formData.clientName} [Client Code: ${formData.clientCode || 'N/A'}] for ${finalMake} (S/N: ${finalSerial})`,
        formData.contactPerson || 'Customer Portal'
      );
    } catch (err) {
      console.error('Error saving ticket to ERP:', err);
    }

    // 2. WhatsApp Official Dispatch
    const waText = 
      `🚨 *OFFICIAL BREAKDOWN CALL LOG - M/S COMPUTER PLANET*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🎫 *Case Ticket No:* ${ticketId}\n` +
      `🏢 *Client Name:* ${formData.clientName}\n` +
      `🏷️ *Client / AMC Code:* ${formData.clientCode || 'Pending Verification'}\n` +
      `📍 *Branch / Site Address:* ${formData.address || 'Silchar Circle'}\n\n` +
      `👤 *Reported By:* ${formData.contactPerson || formData.clientName}\n` +
      `💼 *Designation:* ${formData.designation || 'Staff'}\n` +
      `📞 *Contact Phone:* ${formData.phone}\n` +
      `✉️ *Email:* ${formData.email || 'N/A'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⚙️ *Complaint Category:* ${formData.category}\n` +
      `🖥️ *Hardware Make & Model:* ${finalMake}\n` +
      `🔢 *Serial Number (S/N):* ${finalSerial}\n` +
      `⚡ *Priority SLA:* Defined in ERP by Admin Upon Verification\n\n` +
      `📝 *Breakdown Symptoms / Issue:*\n` +
      `${formData.description || 'Hardware malfunction reported. Urgent engineer inspection required.'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✅ *ERP Status:* Registered in Central Database & Assigned to Resident Field Engineer.\n` +
      `_Logged via www.mscomputerplanet.com_`;

    const waUrl = `https://wa.me/918638083712?text=${encodeURIComponent(waText)}`;
    try {
      window.open(waUrl, '_blank');
    } catch (waErr) {
      console.warn('Popup blocked or failed to open WhatsApp URL:', waErr);
    }

    setIsSubmitted(true);
  };

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-3xl lg:max-w-4xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close support modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Confirmation State */
          <div className="text-center py-6 sm:py-8 space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Ticket Registered in Central ERP
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-3">
                Complaint Call Logged Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Your case has been recorded into the M/S Computer Planet Central ERP & dispatched via WhatsApp to our resident engineering lead.
              </p>
            </div>

            {/* Ticket ID Box */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-sm mx-auto">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Official Case Ticket Number
              </div>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1 flex items-center justify-center gap-2">
                <span>{ticketId}</span>
                <button
                  onClick={handleCopyTicket}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition"
                  title="Copy Case Number"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copied && (
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Copied to clipboard!
                </div>
              )}
            </div>

            {/* SLA Notice */}
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-left max-w-md mx-auto flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 dark:text-emerald-200">
                <strong>SLA Priority Assignment:</strong> Ticket registered successfully. Official SLA level will be assigned in ERP by M/S Computer Planet administration upon verification.
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md transition hover:opacity-90"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <Headphones className="w-3 h-3" />
                  <span>AMC & Support Call Log</span>
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Case #{ticketId}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Log Support Call & Breakdown Ticket
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Directly registered into our ERP ticket system and sent via WhatsApp to the assigned resident engineer for rapid on-site dispatch.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Step 0: Case Category Selector */}
              <div className="p-3 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Select Complaint Case Category</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleModeChange('new')}
                    className={`p-3 rounded-xl border text-left font-bold text-xs transition flex items-center gap-2.5 ${
                      complaintMode === 'new'
                        ? 'bg-sky-600 text-white border-sky-500 shadow-md ring-2 ring-sky-400/40'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-sky-400'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${complaintMode === 'new' ? 'border-white bg-white' : 'border-slate-400'}`}>
                      {complaintMode === 'new' && <div className="w-2 h-2 rounded-full bg-sky-600" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold">1. New Service Complaint Case</div>
                      <div className="text-[10px] font-normal opacity-85">Open / Commercial / Non-AMC Call</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleModeChange('amc')}
                    className={`p-3 rounded-xl border text-left font-bold text-xs transition flex items-center gap-2.5 ${
                      complaintMode === 'amc'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/40'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${complaintMode === 'amc' ? 'border-white bg-white' : 'border-slate-400'}`}>
                      {complaintMode === 'amc' && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold">2. AMC Support Complaint Case</div>
                      <div className="text-[10px] font-normal opacity-85">Contracted PNB & Enterprise AMC Clients</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Client & Authorized Contact Information */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between uppercase text-[10px] tracking-wider text-emerald-600 dark:text-emerald-400">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>1. Client & Branch Identification</span>
                  </div>
                  {complaintMode === 'amc' && (
                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                      Pre-default AMC Accounts Active
                    </span>
                  )}
                </div>

                {/* Pre-default PNB Branch Selection Dropdown for AMC Mode */}
                {complaintMode === 'amc' && (
                  <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Pre-default PNB Customer Branch (Silchar Circle — 50 Locations)</span>
                      </label>
                      <span className="text-[10px] font-mono bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded font-bold">
                        50 Branches Pre-loaded
                      </span>
                    </div>

                    <select
                      value={selectedPnbSolId}
                      onChange={(e) => handlePnbBranchSelect(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-400 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="">-- Select Pre-default PNB Branch --</option>
                      {PNB_BRANCHES_DATA.map((b) => (
                        <option key={`${b.solId}-${b.name}`} value={b.solId}>
                          [{b.solId}] Punjab National Bank - {b.name} ({b.be})
                        </option>
                      ))}
                    </select>

                    {(() => {
                      const selectedPnbBranch = PNB_BRANCHES_DATA.find(b => b.solId === selectedPnbSolId);
                      if (!selectedPnbBranch) return null;
                      return (
                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5 border border-emerald-200 dark:border-emerald-800">
                          <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                            <span>PNB Asset Registry ({selectedPnbBranch.name})</span>
                            <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">SOL ID: {selectedPnbBranch.solId}</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5 font-mono text-[10px]">
                            <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded text-center">
                              <span className="text-slate-400 block text-[9px] uppercase">Total Assets</span>
                              <span className="font-bold text-emerald-600">{selectedPnbBranch.totalAssets} Units</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded text-center">
                              <span className="text-slate-400 block text-[9px] uppercase">Desktops</span>
                              <span className="font-bold">{selectedPnbBranch.desktop}</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded text-center">
                              <span className="text-slate-400 block text-[9px] uppercase">Passbook</span>
                              <span className="font-bold">{selectedPnbBranch.passbook}</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded text-center">
                              <span className="text-slate-400 block text-[9px] uppercase">Printers/Scanners</span>
                              <span className="font-bold">{selectedPnbBranch.laserjet + selectedPnbBranch.cashPrinter + selectedPnbBranch.highspeedScanner}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Organization / Bank Branch Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Punjab National Bank - Tarapur Branch"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span>Client / AMC Code *</span>
                      <span className="text-[10px] text-slate-400 font-normal">(e.g. PNB-SIL-012)</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PNB-SIL-012 or CLI-AMC-001"
                      value={formData.clientCode}
                      onChange={(e) => setFormData({ ...formData, clientCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Complete Branch / Site Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Club Road / Tarapur, Silchar, Cachar, Assam - 788003"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Reported By (Person) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajib Sharma"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Designation *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Branch Manager"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 94350 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Official Email
                    </label>
                    <input
                      type="email"
                      placeholder="bm.branch@pnb.co.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Hardware & Malfunction Specifics */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase text-[10px] tracking-wider text-amber-600 dark:text-amber-400">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>2. Fault Domain & Hardware Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Complaint Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span>Product Make & Model</span>
                      <span className="text-[10px] text-slate-400 font-normal">(e.g. Lipi PB2 / TVS MSP)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lipi PB2 Passbook Printer / HP LaserJet M1005"
                      value={formData.hardwareMake}
                      onChange={(e) => setFormData({ ...formData, hardwareMake: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span>Hardware Serial Number (S/N)</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">(Optional if unknown)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LPB-2023-88741 / S/N: ACR-99420 (or leave blank if unknown)"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Malfunction Symptoms / Problem Description
                  </label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Describe exact error code, blinking LEDs, paper jam or power failure..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  ></textarea>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Generate ERP Ticket & Dispatch via WhatsApp</span>
                </button>
                <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                  Auto-generates Case #{ticketId} directly into M/S Computer Planet Central ERP database and notifies the Silchar resident engineer.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
