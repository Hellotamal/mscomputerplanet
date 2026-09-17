import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Phone, 
  X,
  Printer
} from 'lucide-react';

export default function TicketsModule({ tickets, setTickets }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [newTicket, setNewTicket] = useState({
    clientName: '',
    contactPerson: '',
    phone: '',
    type: 'Hardware Breakdown',
    priority: 'High',
    assignedTo: 'Resident Engineer Silchar',
    description: '',
    resolution: ''
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
    if (!newTicket.clientName || !newTicket.description) {
      alert('Please provide Client Name and Description.');
      return;
    }

    const created = {
      ...newTicket,
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Open',
      reportedDate: new Date().toISOString().split('T')[0]
    };

    setTickets([created, ...tickets]);
    setShowAddModal(false);
    setNewTicket({
      clientName: '',
      contactPerson: '',
      phone: '',
      type: 'Hardware Breakdown',
      priority: 'High',
      assignedTo: 'Resident Engineer Silchar',
      description: '',
      resolution: ''
    });
  };

  const updateTicketStatus = (id, newStatus) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
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
          </style>
        </head>
        <body>
          <div class="header">
            <h2>M/S COMPUTER PLANET</h2>
            <div>West Kachudharam, Chincoorie, Silchar - 788007 | Tel: +91-8638083712</div>
            <small>MSME: UDYAM-AS-05-0019941 | GSTIN: 18ASTPR6755J1Z0</small>
          </div>
          <h3>SERVICE JOB SLIP: ${ticket.id}</h3>
          <p><strong>Date:</strong> ${ticket.reportedDate} | <strong>Priority:</strong> ${ticket.priority}</p>
          <p><strong>Customer / Branch:</strong> ${ticket.clientName} (${ticket.contactPerson || 'N/A'})</p>
          <p><strong>Phone:</strong> ${ticket.phone || 'N/A'}</p>
          <p><strong>Service Type:</strong> ${ticket.type}</p>
          <p><strong>Assigned Engineer:</strong> ${ticket.assignedTo}</p>
          <div class="box">
            <div class="label">Reported Fault / Requirement:</div>
            <div>${ticket.description}</div>
          </div>
          <div style="margin-top: 40px; display: flex; justify-content: space-between;">
            <div>Customer Signature: __________________</div>
            <div>Engineer Signature: __________________</div>
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

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            {['All', 'Open', 'In Progress', 'Resolved'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterStatus === status ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </button>
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

                <h4 className="text-base font-bold text-slate-900">
                  {ticket.clientName}
                </h4>
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

              {/* Status Toggles & Print Action */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <select
                  value={ticket.status}
                  onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>

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

      {/* Add Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Create New Service Ticket</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer / Branch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Punjab National Bank - Sonai Road Branch"
                  value={newTicket.clientName}
                  onChange={(e) => setNewTicket({ ...newTicket, clientName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Branch Manager"
                    value={newTicket.contactPerson}
                    onChange={(e) => setNewTicket({ ...newTicket, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 94350..."
                    value={newTicket.phone}
                    onChange={(e) => setNewTicket({ ...newTicket, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Category</label>
                  <select
                    value={newTicket.type}
                    onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Hardware Breakdown">Hardware Breakdown</option>
                    <option value="Printer Maintenance">Printer Maintenance</option>
                    <option value="Solar Inverter Diagnostic">Solar Inverter Diagnostic</option>
                    <option value="LAN / Network Issue">LAN / Network Issue</option>
                    <option value="OS / Antivirus Support">OS / Antivirus Support</option>
                    <option value="Preventive AMC Visit">Preventive AMC Visit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SLA Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Normal">Normal (24-48 hrs)</option>
                    <option value="High">High (8-12 hrs)</option>
                    <option value="Critical">Critical (2-4 hrs SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Resident Engineer</label>
                <input
                  type="text"
                  placeholder="e.g. Debashis / Animesh / Rahul"
                  value={newTicket.assignedTo}
                  onChange={(e) => setNewTicket({ ...newTicket, assignedTo: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fault Description *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Details of the reported failure or requirement..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-500"
                >
                  Save & Log Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
