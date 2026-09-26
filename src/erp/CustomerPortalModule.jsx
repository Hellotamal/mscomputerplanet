import React, { useState } from 'react';
import {
  ShieldCheck,
  Wrench,
  Search,
  Calendar,
  Download,
  Building2,
  MessageSquare,
  FileText,
  Clock,
  X
} from 'lucide-react';

export default function CustomerPortalModule({
  clients = [],
  tickets = [],
  setTickets,
  amcContracts = [],
  invoices = [],
  currentUser: _currentUser
}) {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || 'CLT-001');
  const [searchClient, setSearchClient] = useState('');
  const [showLogTicketModal, setShowLogTicketModal] = useState(false);

  // Ticket Log Form
  const [ticketForm, setTicketForm] = useState({
    contactPerson: '',
    phone: '',
    productMake: 'HP ProDesk 400 G7',
    serialNumber: '',
    type: 'Hardware Breakdown',
    priority: 'High',
    description: ''
  });

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // Match client's tickets, AMC, and invoices
  const clientTickets = tickets.filter(t => 
    selectedClient && (
      t.clientName.toLowerCase().includes(selectedClient.name.toLowerCase()) ||
      t.clientName.toLowerCase().includes(selectedClient.company?.toLowerCase() || '')
    )
  );

  const clientAmc = amcContracts.find(a => 
    selectedClient && a.clientName.toLowerCase().includes(selectedClient.name.toLowerCase())
  );

  const clientInvoices = invoices.filter(inv =>
    selectedClient && (
      inv.customerName?.toLowerCase().includes(selectedClient.name.toLowerCase()) ||
      inv.customerName?.toLowerCase().includes(selectedClient.company?.toLowerCase() || '')
    )
  );

  const handleLogTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.serialNumber || !ticketForm.description) {
      alert('Please enter hardware serial number and issue description.');
      return;
    }

    const newTicketId = `TCK-2026-${String(tickets.length + 1004)}`;
    const created = {
      id: newTicketId,
      clientName: selectedClient.name,
      contactPerson: ticketForm.contactPerson || selectedClient.contactPerson || 'Authorized Representative',
      phone: ticketForm.phone || selectedClient.phone || '+91 86380 83712',
      type: ticketForm.type,
      priority: ticketForm.priority,
      assignedTo: 'Resident IT Engineer - Debashis Roy',
      status: 'Open',
      reportedDate: new Date().toISOString().split('T')[0],
      description: `[S/N: ${ticketForm.serialNumber} | ${ticketForm.productMake}] ${ticketForm.description}`,
      resolution: 'Logged via Client Self-Service Desk. Dispatched to regional resident engineer.'
    };

    setTickets([created, ...tickets]);
    setShowLogTicketModal(false);

    // Prompt for WhatsApp Dispatch
    const waText = encodeURIComponent(
      `*M/S COMPUTER PLANET - SUPPORT TICKET LOGGED*\n` +
      `Ticket ID: ${newTicketId}\n` +
      `Client: ${selectedClient.name} (${selectedClient.id})\n` +
      `Equipment: ${ticketForm.productMake}\n` +
      `Serial No: ${ticketForm.serialNumber}\n` +
      `Issue: ${ticketForm.description}\n` +
      `Priority: ${ticketForm.priority}\n` +
      `Resident Engineer assigned under SLA.`
    );
    const waUrl = `https://wa.me/918638083712?text=${waText}`;

    if (window.confirm(`Ticket ${newTicketId} logged successfully! Would you like to notify Computer Planet Support on WhatsApp?`)) {
      window.open(waUrl, '_blank');
    }

    setTicketForm({
      contactPerson: '',
      phone: '',
      productMake: 'HP ProDesk 400 G7',
      serialNumber: '',
      type: 'Hardware Breakdown',
      priority: 'High',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Customer Self-Service Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Customer AMC & Service Self-Service Portal
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Dedicated client view for Bank Branch Managers, Solar Plant Owners, and AMC clients to log service calls with hardware serial numbers and track live resolution SLAs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowLogTicketModal(true)}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center gap-2 transition"
            >
              <Wrench className="w-4 h-4" />
              <span>Log Support Call / Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Client Quick Selector Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-sky-600 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Viewing Client Portal For:</div>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="text-sm font-bold text-slate-900 bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id}) - {c.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by branch or phone..."
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Client Profile & AMC Status Grid */}
      {selectedClient && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Client Bio */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                {selectedClient.id}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Verified Client
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-base">{selectedClient.name}</h3>
            <div className="text-xs text-slate-600 space-y-1.5">
              <div><strong>Contact:</strong> {selectedClient.contactPerson || selectedClient.name}</div>
              <div><strong>Phone:</strong> <span className="font-mono">{selectedClient.phone}</span></div>
              <div><strong>Address:</strong> {selectedClient.address || 'Silchar, Assam'}</div>
              <div><strong>Category:</strong> {selectedClient.category}</div>
            </div>
          </div>

          {/* Card 2: AMC & SLA Status */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase">Service Contract / Warranty</div>
            {clientAmc ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{clientAmc.id}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-bold text-[10px]">
                    ACTIVE
                  </span>
                </div>
                <div className="text-slate-600">
                  Branches Covered: <strong>{clientAmc.branchCount || 'Circle Matrix'}</strong> • Devices: <strong>{clientAmc.deviceCount || 'All Units'}</strong>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pt-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Valid through: <strong>{clientAmc.expiryDate || '2026-12-31'}</strong></span>
                </div>
                <div className="p-2 bg-sky-50 text-sky-900 rounded-lg text-[11px]">
                  <strong>SLA Priority:</strong> 2–4 Hour Critical Breakdown Response in Silchar & Cachar Circle.
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-4 text-center">
                Standard On-Demand Service & Product Warranty Active.
              </div>
            )}
          </div>

          {/* Card 3: Resident Support Team */}
          <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="text-xs text-sky-300 font-bold uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Assigned IT Support Hub</span>
            </div>
            <div className="text-sm font-bold">Silchar Central Support Depot</div>
            <div className="text-xs text-slate-300 space-y-1">
              <div>Lead Engineer: <strong>Debashis Roy</strong> (+91 94350 12345)</div>
              <div>Solar Technical Lead: <strong>Animesh Das</strong> (+91 86380 99887)</div>
              <div>Proprietor Support: <strong>Tamal</strong> (+91 86380 83712)</div>
            </div>
            <button
              onClick={() => setShowLogTicketModal(true)}
              className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition"
            >
              Report New Issue
            </button>
          </div>
        </div>
      )}

      {/* Client Tickets & Invoice History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Ticket History */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Wrench className="w-4 h-4 text-sky-600" />
              <span>Client Incident & Service Tickets ({clientTickets.length})</span>
            </h3>
            <button
              onClick={() => setShowLogTicketModal(true)}
              className="text-xs font-bold text-sky-600 hover:text-sky-700"
            >
              + Log Call
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {clientTickets.length > 0 ? (
              clientTickets.map(t => (
                <div key={t.id} className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {t.id}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{t.reportedDate}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800">{t.description}</div>
                  <div className="text-slate-500 text-[11px]">
                    Assigned: <strong>{t.assignedTo}</strong> • Resolution: {t.resolution || 'In Progress'}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                No tickets on record. Everything is running smoothly!
              </div>
            )}
          </div>
        </div>

        {/* GST Invoices & Documents */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Official GST Invoices ({clientInvoices.length})</span>
            </h3>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {clientInvoices.length > 0 ? (
              clientInvoices.map(inv => (
                <div key={inv.id} className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {inv.id}
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">{inv.date}</span>
                    </div>
                    <div className="text-slate-600 font-medium truncate max-w-[240px]">
                      {inv.items?.map(i => i.desc).join(', ') || 'Tax Invoice'}
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      ₹{inv.grandTotal?.toLocaleString('en-IN') || inv.totalAmount?.toLocaleString('en-IN')}
                    </div>
                    <button
                      onClick={() => alert(`Downloading official PDF copy for Tax Invoice ${inv.id}...`)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                No past invoices found for this client.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Ticket Modal */}
      {showLogTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-sky-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Wrench className="w-5 h-5 text-sky-300" />
                <span>Log Service Call / Breakdown Ticket</span>
              </h3>
              <button onClick={() => setShowLogTicketModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogTicket} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-sky-50 rounded-xl text-sky-950">
                Logging for: <strong>{selectedClient.name}</strong> ({selectedClient.id})
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Branch IT Officer"
                    value={ticketForm.contactPerson}
                    onChange={(e) => setTicketForm({ ...ticketForm, contactPerson: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    placeholder="+91..."
                    value={ticketForm.phone}
                    onChange={(e) => setTicketForm({ ...ticketForm, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hardware Product Make & Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HP ProDesk 400 G7 / Lipi PB Printer"
                    value={ticketForm.productMake}
                    onChange={(e) => setTicketForm({ ...ticketForm, productMake: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hardware Serial Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. INA2284910 / S/N"
                    value={ticketForm.serialNumber}
                    onChange={(e) => setTicketForm({ ...ticketForm, serialNumber: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-sky-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Complaint Category</label>
                  <select
                    value={ticketForm.type}
                    onChange={(e) => setTicketForm({ ...ticketForm, type: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-sky-500 font-semibold"
                  >
                    <option value="Hardware Breakdown">Hardware Breakdown</option>
                    <option value="Bank Application / Software Issue">Bank Application / Software Issue by User</option>
                    <option value="Preventive Maintenance">Preventive Maintenance (PM) AMC Visit</option>
                    <option value="Printer Maintenance">Passbook / Laser Printer</option>
                    <option value="Solar Inverter Diagnostic">Solar Inverter Diagnostic</option>
                    <option value="Network / Switch Node">LAN / Router / Switch Node</option>
                    <option value="UPS & Battery Failure">UPS & Battery Failure</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority SLA</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-sky-500 font-semibold"
                  >
                    <option value="Normal">Normal (24-48 Hr)</option>
                    <option value="High">High (4-8 Hr)</option>
                    <option value="Critical">Critical (2-4 Hr Banking SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Problem Description *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Describe error code, symptoms, or breakdown details..."
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogTicketModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold shadow-md shadow-sky-600/20 flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Generate Ticket & WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
