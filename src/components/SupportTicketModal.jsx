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
  Cpu
} from 'lucide-react';
import { loadErpData, saveErpData, recordAuditLog, INITIAL_TICKETS } from '../erp/erpStorage';
import { generateEntityId } from '../erp/erpSecurity';

export default function SupportTicketModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return <SupportTicketDialog onClose={onClose} />;
}

function SupportTicketDialog({ onClose }) {
  const [ticketId] = useState(() => generateEntityId('TCK-2026'));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    clientCode: '',
    address: '',
    contactPerson: '',
    designation: 'Branch Manager',
    phone: '',
    email: '',
    category: 'Passbook Printer Jam / Printing Issue',
    hardwareMake: '',
    serialNumber: '',
    priority: 'Critical Breakdown (2 to 4-Hour SLA)',
    description: ''
  });

  const categories = [
    'Passbook Printer Jam / Printing Issue',
    'Desktop Hardware / SMPS / Boot Failure',
    'LaserJet Printer / Toner / Paper Feed Defect',
    'Branch Switch / Router / Network LAN Failure',
    'Solar Inverter Fault / Error Code / Tripping',
    'Solar Battery Storage / Charging Anomaly',
    'Solar PV Panel Output / Wiring Issue',
    'General IT Peripherals / Scanner / CCTV Breakdown',
    'Emergency Resident Engineer On-Site Visit'
  ];

  const priorities = [
    'Critical Breakdown (2 to 4-Hour SLA)',
    'High Priority (Same-Day Resolution)',
    'Standard Maintenance Call (24-Hour SLA)'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.clientName.trim() || !formData.phone.trim() || !formData.hardwareMake.trim() || !formData.serialNumber.trim()) {
      alert('Please fill in all mandatory fields marked with an asterisk (*).');
      return;
    }

    // 1. Synchronous ERP Database Save
    try {
      const existingTickets = loadErpData('tickets', INITIAL_TICKETS);
      const newTicket = {
        id: ticketId,
        clientName: formData.clientName.trim(),
        clientCode: formData.clientCode.trim() || 'UNREGISTERED-CLIENT',
        address: formData.address.trim() || 'Silchar, Assam',
        contactPerson: formData.contactPerson.trim() || formData.clientName.trim(),
        designation: formData.designation.trim() || 'Authorized Representative',
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        type: formData.category,
        hardwareMake: formData.hardwareMake.trim(),
        serialNumber: formData.serialNumber.trim(),
        priority: formData.priority.split(' ')[0] || 'High',
        prioritySla: formData.priority,
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
        `Case ${ticketId} registered by ${formData.clientName} [Client Code: ${formData.clientCode || 'N/A'}] for ${formData.hardwareMake} (S/N: ${formData.serialNumber})`,
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
      `🖥️ *Hardware Make & Model:* ${formData.hardwareMake}\n` +
      `🔢 *Serial Number (S/N):* ${formData.serialNumber}\n` +
      `⚡ *Priority SLA:* ${formData.priority}\n\n` +
      `📝 *Breakdown Symptoms / Issue:*\n` +
      `${formData.description || 'Hardware malfunction reported. Urgent engineer inspection required.'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✅ *ERP Status:* Registered in Central Database & Assigned to Resident Field Engineer.\n` +
      `_Logged via www.mscomputerplanet.com_`;

    const waUrl = `https://wa.me/918638083712?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');

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
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
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
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left max-w-md mx-auto flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-300">
                <strong>Assigned SLA:</strong> {formData.priority}. Our resident engineer will arrive on-site with standby buffer spares or contact your designated officer shortly.
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
              {/* Client & Authorized Contact Information */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase text-[10px] tracking-wider text-emerald-600 dark:text-emerald-400">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>1. Client & Branch Identification</span>
                </div>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
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
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Priority SLA Level *
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {priorities.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span>Product Make & Model *</span>
                      <span className="text-[10px] text-slate-400 font-normal">(e.g. Lipi PB2 / TVS MSP 240)</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lipi PB2 Passbook Printer / HP LaserJet M1005"
                      value={formData.hardwareMake}
                      onChange={(e) => setFormData({ ...formData, hardwareMake: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span>Hardware Serial Number (S/N) *</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">For ERP Tracking</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LPB-2023-88741 / S/N: ACR-99420"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Malfunction Symptoms / Problem Description *
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
