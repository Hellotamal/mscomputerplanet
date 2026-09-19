import React, { useState } from 'react';
import { getCompanyPrintHeaderHtml } from '../data/companyLogo';
import { escapeHtml, generateEntityId } from './erpSecurity';
import { 
  Plus, 
  Search, 
  User, 
  Phone, 
  X,
  Printer,
  Edit2,
  Trash2,
  MessageSquare,
  Lock
} from 'lucide-react';

export default function TicketsModule({ tickets, setTickets, isAdmin = false, currentUser: _currentUser = null }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const handleSendTicketWhatsApp = (ticket) => {
    const rawPhone = (ticket.phone || '').replace(/[^0-9]/g, '');
    const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

    const message = `*M/S COMPUTER PLANET - SERVICE TICKET UPDATE*
---------------------------------------------
*Ticket ID:* ${ticket.id}
*Client:* ${ticket.clientName}
${ticket.clientCode ? `*Client / AMC Code:* ${ticket.clientCode}\n` : ''}${ticket.address ? `*Branch Address:* ${ticket.address}\n` : ''}*Reported Date:* ${ticket.reportedDate}
*Priority:* ${ticket.priority} SLA
*Assigned Engineer:* ${ticket.assignedTo}
*Current Status:* ${ticket.status}
${ticket.hardwareMake ? `*Hardware Make/Model:* ${ticket.hardwareMake}\n` : ''}${ticket.serialNumber ? `*Serial Number (S/N):* ${ticket.serialNumber}\n` : ''}---------------------------------------------
*Issue Description:*
${ticket.description}
${ticket.resolution ? `\n*Resolution Details:*\n${ticket.resolution}\n` : ''}---------------------------------------------
*Support Contact:* +91-8638083712
Chincoorie, Silchar, Cachar, Assam - 788007
*M/S COMPUTER PLANET (Banking IT & Solar AMC)*`;

    const targetUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(targetUrl, '_blank');
  };

  const [ticketForm, setTicketForm] = useState({
    clientName: '',
    clientCode: '',
    address: '',
    contactPerson: '',
    designation: '',
    phone: '',
    email: '',
    type: 'Hardware Breakdown',
    hardwareMake: '',
    serialNumber: '',
    priority: 'High',
    assignedTo: 'Resident Engineer Silchar',
    description: '',
    resolution: '',
    status: 'Open'
  });

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.clientName.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can create service tickets.');
      return;
    }
    if (!ticketForm.clientName || !ticketForm.description) {
      alert('Please provide Client Name and Description.');
      return;
    }

    const created = {
      ...ticketForm,
      id: generateEntityId('TCK'),
      status: 'Open',
      reportedDate: new Date().toISOString().split('T')[0]
    };

    setTickets([created, ...tickets]);
    setShowAddModal(false);
    resetForm();
  };

  const handleStartEdit = (ticket) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can edit service tickets.');
      return;
    }
    setEditingTicket(ticket);
    setTicketForm({ ...ticket });
  };

  const handleUpdateTicket = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can modify service tickets.');
      return;
    }
    setTickets(tickets.map(t => t.id === editingTicket.id ? { ...ticketForm, id: editingTicket.id } : t));
    setEditingTicket(null);
    resetForm();
  };

  const handleDeleteTicket = (id, clientName) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can remove service tickets.');
      return;
    }
    if (window.confirm(`Are you sure you want to remove ticket ${id} (${clientName})?`)) {
      setTickets(tickets.filter(t => t.id !== id));
    }
  };

  const resetForm = () => {
    setTicketForm({
      clientName: '',
      clientCode: '',
      address: '',
      contactPerson: '',
      designation: '',
      phone: '',
      email: '',
      type: 'Hardware Breakdown',
      hardwareMake: '',
      serialNumber: '',
      priority: 'High',
      assignedTo: 'Resident Engineer Silchar',
      description: '',
      resolution: '',
      status: 'Open'
    });
  };

  const updateTicketStatus = (id, newStatus) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can change ticket status.');
      return;
    }
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handlePrintSlip = (ticket) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Job Slip - ${ticket.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 25px; line-height: 1.5; color: #1e293b; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; background: #e2e8f0; }
            .section { margin-bottom: 15px; }
            .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
            .box { border: 1px dashed #cbd5e1; padding: 15px; border-radius: 6px; margin-top: 15px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
          </style>
        </head>
        <body>
          ${getCompanyPrintHeaderHtml({
            documentTitle: `SERVICE BREAKDOWN JOB SLIP: ${escapeHtml(ticket.id)}`,
            rightBadgeText: escapeHtml(ticket.id),
            rightBadgeSubtext: 'SERVICE TICKET'
          })}
          <div class="info-grid">
            <div><strong>Date Reported:</strong> ${escapeHtml(ticket.reportedDate || '')}</div>
            <div><strong>SLA Priority:</strong> ${escapeHtml(ticket.prioritySla || ticket.priority || 'High')}</div>
            <div><strong>Customer / Branch:</strong> ${escapeHtml(ticket.clientName || 'N/A')}</div>
            <div><strong>Client / AMC Code:</strong> ${escapeHtml(ticket.clientCode || 'N/A')}</div>
            <div><strong>Site Address:</strong> ${escapeHtml(ticket.address || 'Silchar')}</div>
            <div><strong>Reported By:</strong> ${escapeHtml(ticket.contactPerson || 'N/A')} (${escapeHtml(ticket.designation || 'Staff')})</div>
            <div><strong>Contact Phone:</strong> ${escapeHtml(ticket.phone || 'N/A')}</div>
            <div><strong>Service Category:</strong> ${escapeHtml(ticket.type || 'Breakdown')}</div>
            <div><strong>Hardware Make/Model:</strong> ${escapeHtml(ticket.hardwareMake || 'N/A')}</div>
            <div><strong>Serial Number (S/N):</strong> <span style="font-family: monospace; font-weight: bold;">${escapeHtml(ticket.serialNumber || 'N/A')}</span></div>
            <div><strong>Assigned Engineer:</strong> ${escapeHtml(ticket.assignedTo || 'Silchar Dispatch')}</div>
            <div><strong>Current Status:</strong> ${escapeHtml(ticket.status || 'Open')}</div>
          </div>
          <div class="box">
            <div class="label">Reported Malfunction / Breakdown Symptoms:</div>
            <div>${escapeHtml(ticket.description || 'No details provided.')}</div>
          </div>
          ${ticket.resolution ? `<div style="margin-top: 10px;"><strong>Action Taken / Field Resolution:</strong> ${escapeHtml(ticket.resolution)}</div>` : ''}
          <div style="margin-top: 40px; display: flex; justify-content: space-between;">
            <div>Customer / Branch Manager Signature: __________________</div>
            <div>Resident Engineer Signature: __________________</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Total Tickets</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{tickets.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="text-xs text-amber-700 font-semibold">Open Tickets</div>
          <div className="text-2xl font-black text-amber-800 mt-1">
            {tickets.filter(t => t.status === 'Open').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
          <div className="text-xs text-sky-700 font-semibold">In Progress</div>
          <div className="text-2xl font-black text-sky-800 mt-1">
            {tickets.filter(t => t.status === 'In Progress').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div className="text-xs text-emerald-700 font-semibold">Resolved</div>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            {tickets.filter(t => t.status === 'Resolved').length}
          </div>
        </div>
      </div>

      {/* Action and Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search tickets, branch, engineer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 overflow-x-auto no-scrollbar">
            {['All', 'Open', 'In Progress', 'Resolved'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                  filterStatus === status ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {isAdmin ? (
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Ticket</span>
            </button>
          ) : (
            <button
              onClick={() => alert("Access Denied: Ticket creation is restricted to Administrator accounts. Please contact admin for modifications.")}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 transition shrink-0"
              title="Ticket creation restricted to Administrator"
            >
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Add Ticket (Admin Only)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
            No service tickets found matching your query.
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {ticket.id}
                  </span>
                  {ticket.clientCode && (
                    <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Code: {ticket.clientCode}
                    </span>
                  )}
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                    ticket.status === 'In Progress' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ticket.status}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    ticket.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {ticket.priority} SLA
                  </span>
                  <span className="text-xs text-slate-400">
                    Reported: {ticket.reportedDate}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                  <span>{ticket.clientName}</span>
                  {ticket.contactPerson && (
                    <span className="text-xs font-normal text-slate-500">
                      • {ticket.contactPerson} {ticket.designation ? `(${ticket.designation})` : ''}
                    </span>
                  )}
                </h4>

                {(ticket.hardwareMake || ticket.serialNumber) && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex-wrap">
                    {ticket.hardwareMake && <span>🖥️ <strong>Make:</strong> {ticket.hardwareMake}</span>}
                    {ticket.serialNumber && (
                      <span className="font-mono text-emerald-700 font-bold">
                        | S/N: {ticket.serialNumber}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-600">
                  {ticket.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Eng: <strong className="text-slate-700">{ticket.assignedTo}</strong></span>
                  </span>
                  {ticket.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ticket.phone}</span>
                    </span>
                  )}
                  {ticket.resolution && (
                    <span className="text-emerald-700 font-medium">
                      Resolution: {ticket.resolution}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Toggles, Edit, Remove, Print */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <select
                  value={ticket.status}
                  disabled={!isAdmin}
                  onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                  className={`px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none ${
                    !isAdmin ? 'opacity-70 cursor-not-allowed bg-slate-100' : 'focus:ring-2 focus:ring-emerald-500'
                  }`}
                  title={!isAdmin ? 'Status modification restricted to Administrator' : 'Change Ticket Status'}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>

                {isAdmin ? (
                  <>
                    <button
                      onClick={() => handleStartEdit(ticket)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Edit Ticket"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteTicket(ticket.id, ticket.clientName)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                      title="Remove Ticket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <span
                    className="p-1.5 px-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold flex items-center gap-1 border border-slate-200"
                    title="Modifications restricted to Administrator"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10px]">Locked</span>
                  </span>
                )}

                <button
                  onClick={() => handleSendTicketWhatsApp(ticket)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm"
                  title="Notify Client / Engineer via WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>

                <button
                  onClick={() => handlePrintSlip(ticket)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="Print Job Slip"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Ticket Modal */}
      {(showAddModal || editingTicket) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingTicket ? `Edit Ticket: ${editingTicket.id}` : 'Create New Service Ticket'}
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); setEditingTicket(null); }} 
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingTicket ? handleUpdateTicket : handleCreateTicket} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Customer / Branch Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Punjab National Bank - Sonai Road Branch"
                    value={ticketForm.clientName}
                    onChange={(e) => setTicketForm({ ...ticketForm, clientName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client / AMC Code</label>
                  <input
                    type="text"
                    placeholder="e.g. PNB-SIL-012"
                    value={ticketForm.clientCode || ''}
                    onChange={(e) => setTicketForm({ ...ticketForm, clientCode: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hardware Make & Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Lipi PB2 / TVS MSP 240 / HP LaserJet"
                    value={ticketForm.hardwareMake || ''}
                    onChange={(e) => setTicketForm({ ...ticketForm, hardwareMake: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hardware Serial No (S/N)</label>
                  <input
                    type="text"
                    placeholder="e.g. LPB-2023-88741"
                    value={ticketForm.serialNumber || ''}
                    onChange={(e) => setTicketForm({ ...ticketForm, serialNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person & Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajib Sharma (Branch Manager)"
                    value={ticketForm.contactPerson}
                    onChange={(e) => setTicketForm({ ...ticketForm, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 94350..."
                    value={ticketForm.phone}
                    onChange={(e) => setTicketForm({ ...ticketForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Category</label>
                  <select
                    value={ticketForm.type}
                    onChange={(e) => setTicketForm({ ...ticketForm, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Hardware Breakdown">Hardware Breakdown</option>
                    <option value="Bank Application / Software Issue">Bank Application / Software Issue by User</option>
                    <option value="Preventive Maintenance">Preventive Maintenance (PM) AMC Visit</option>
                    <option value="Printer Maintenance">Printer Maintenance</option>
                    <option value="Solar Inverter Diagnostic">Solar Inverter Diagnostic</option>
                    <option value="LAN / Network Issue">LAN / Network Issue</option>
                    <option value="OS / Antivirus Support">OS / Antivirus Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SLA Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Normal">Normal (24-48 hrs)</option>
                    <option value="High">High (8-12 hrs)</option>
                    <option value="Critical">Critical (2-4 hrs SLA)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Resident Engineer</label>
                  <input
                    type="text"
                    placeholder="e.g. Debashis / Animesh / Rahul"
                    value={ticketForm.assignedTo}
                    onChange={(e) => setTicketForm({ ...ticketForm, assignedTo: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={ticketForm.status}
                    onChange={(e) => setTicketForm({ ...ticketForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fault Description *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Details of the reported failure or requirement..."
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resolution Notes (if completed)</label>
                <textarea
                  rows="2"
                  placeholder="Parts replaced, repairs made, engineer remarks..."
                  value={ticketForm.resolution}
                  onChange={(e) => setTicketForm({ ...ticketForm, resolution: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingTicket(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-500"
                >
                  {editingTicket ? 'Save Changes' : 'Save & Log Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
