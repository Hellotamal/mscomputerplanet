import React, { useState } from 'react';
import { getCompanyPrintHeaderHtml } from '../data/companyLogo';
import { escapeHtml } from './erpSecurity';
import PNBAssetModule from './PNBAssetModule';
import { 
  Landmark, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Phone, 
  MapPin, 
  Calendar, 
  Printer, 
  X, 
  Filter, 
  SunMedium, 
  Wrench, 
  ShoppingBag, 
  Layers, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';

export default function ClientsModule({ clients, setClients, initialCategory = 'All' }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [expandedPnbMatrix, setExpandedPnbMatrix] = useState(false);

  // Form State for Add / Edit
  const [clientForm, setClientForm] = useState({
    id: '',
    name: '',
    category: 'AMC',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    contractType: 'Comprehensive Annual Maintenance Contract',
    branchesCount: 1,
    assetsCount: 10,
    contractValue: 150000,
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    status: 'Active',
    notes: ''
  });

  const categories = [
    { id: 'All', name: 'All Clients', icon: Layers, count: clients.length },
    { id: 'AMC', name: 'Banking & AMC', icon: Landmark, count: clients.filter(c => c.category === 'AMC').length },
    { id: 'Sales', name: 'Hardware Sales', icon: ShoppingBag, count: clients.filter(c => c.category === 'Sales').length },
    { id: 'Solar', name: 'Solar EPC', icon: SunMedium, count: clients.filter(c => c.category === 'Solar').length },
    { id: 'Service', name: 'Service & Repairs', icon: Wrench, count: clients.filter(c => c.category === 'Service').length }
  ];

  const filteredClients = clients.filter(c => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesSearch = 
      (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.contactPerson || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.address || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.phone || '').includes(search) ||
      (c.id || '').toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // KPI Metrics
  const totalValue = clients.reduce((acc, c) => acc + (Number(c.contractValue) || 0), 0);
  const totalAssets = clients.reduce((acc, c) => acc + (Number(c.assetsCount) || 0), 0);
  const totalBranches = clients.reduce((acc, c) => acc + (Number(c.branchesCount) || 0), 0);

  const handleOpenAdd = () => {
    setClientForm({
      id: `CLI-${selectedCategory !== 'All' ? selectedCategory.toUpperCase().slice(0, 3) : 'GEN'}-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      category: selectedCategory !== 'All' ? selectedCategory : 'AMC',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      contractType: 'Comprehensive Annual Maintenance Contract',
      branchesCount: 1,
      assetsCount: 1,
      contractValue: 50000,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      status: 'Active',
      notes: ''
    });
    setEditingClient(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);
    setClientForm({ ...client });
    setShowAddModal(true);
  };

  const handleSaveClient = (e) => {
    e.preventDefault();
    if (!clientForm.name.trim()) {
      alert('Please provide client organization name.');
      return;
    }

    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...clientForm } : c));
    } else {
      setClients([clientForm, ...clients]);
    }
    setShowAddModal(false);
  };

  const handleDeleteClient = (id, name) => {
    if (confirm(`Are you sure you want to remove client "${name}" (${id}) from ERP?`)) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  const handlePrintClient = (client) => {
    const printWindow = window.open('', '_blank');
    const headerHtml = getCompanyPrintHeaderHtml("CLIENT ACCOUNT & ASSET AUDIT REPORT");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Client Profile - ${client.name}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; color: #1e293b; font-size: 13px; line-height: 1.5; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; }
          .badge-amc { background: #e0f2fe; color: #0369a1; }
          .badge-sales { background: #fef3c7; color: #b45309; }
          .badge-solar { background: #ccfbf1; color: #0f766e; }
          .badge-service { background: #f3e8ff; color: #7e22ce; }
          .table-bordered { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .table-bordered th, .table-bordered td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
          .table-bordered th { background: #f8fafc; font-weight: bold; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
          .footer-sign { margin-top: 50px; display: flex; justify-content: space-between; padding-top: 20px; }
        </style>
      </head>
      <body>
        ${headerHtml}
        
        <div style="margin: 15px 0; border-bottom: 2px solid #0f172a; padding-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="margin: 0; font-size: 18px; color: #0f172a;">${escapeHtml(client.name)}</h2>
            <div style="color: #64748b; font-size: 12px; margin-top: 2px;">Client ID: <strong>${escapeHtml(client.id)}</strong> | Category: <span class="badge badge-${escapeHtml(client.category.toLowerCase())}">${escapeHtml(client.category)}</span></div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: #64748b;">Contract Status</div>
            <strong style="color: #059669; font-size: 14px;">${escapeHtml(client.status)}</strong>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <h4 style="margin: 0 0 8px 0; color: #334155; font-size: 12px; text-transform: uppercase;">Contact & Location</h4>
            <div><strong>Contact Person:</strong> ${escapeHtml(client.contactPerson || 'N/A')}</div>
            <div><strong>Phone Number:</strong> ${escapeHtml(client.phone || 'N/A')}</div>
            <div><strong>Email Address:</strong> ${escapeHtml(client.email || 'N/A')}</div>
            <div><strong>Physical Address:</strong> ${escapeHtml(client.address || 'Silchar, Assam')}</div>
          </div>

          <div class="card">
            <h4 style="margin: 0 0 8px 0; color: #334155; font-size: 12px; text-transform: uppercase;">Contract & Asset Metrics</h4>
            <div><strong>Agreement Type:</strong> ${escapeHtml(client.contractType || 'Standard Contract')}</div>
            <div><strong>Total Managed Branches/Sites:</strong> ${Number(client.branchesCount) || 0}</div>
            <div><strong>Total Hardware Units:</strong> ${Number(client.assetsCount) || 0} Units</div>
            <div><strong>Total Agreement Value:</strong> ₹${Number(client.contractValue || 0).toLocaleString('en-IN')}</div>
            <div><strong>Validity Period:</strong> ${escapeHtml(client.startDate)} to ${escapeHtml(client.expiryDate)}</div>
          </div>
        </div>

        <table class="table-bordered">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Operational Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Service Category</strong></td>
              <td>${escapeHtml(client.category)} Support & Engineering</td>
            </tr>
            <tr>
              <td><strong>SLA Turnaround Priority</strong></td>
              <td>2-4 Hour Priority On-Site Response (Cachar, Hailakandi & Karimganj)</td>
            </tr>
            <tr>
              <td><strong>Engineering Support Hub</strong></td>
              <td>West Kachudharam, Chincoorie, Silchar Service Center</td>
            </tr>
            <tr>
              <td><strong>Operational Notes / Scope</strong></td>
              <td>${escapeHtml(client.notes || 'All routine maintenance and hardware health checks logged in ERP.')}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer-sign">
          <div>
            <p style="margin: 0; color: #64748b; font-size: 11px;">Prepared by Operations ERP</p>
            <p style="margin: 30px 0 0 0; font-weight: bold;">Resident IT Engineer / Technical Executive</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; color: #64748b; font-size: 11px;">Authorised Signatory</p>
            <p style="margin: 30px 0 0 0; font-weight: bold;">For M/S COMPUTER PLANET</p>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  // If user clicked to view the full 50-branch PNB Matrix directly inside the Clients Module
  if (expandedPnbMatrix) {
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setExpandedPnbMatrix(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1.5"
            >
              ← Back to All Clients
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Punjab National Bank (PNB) — 543 Hardware Assets Across 50 Branches
              </h2>
              <p className="text-xs text-slate-500">
                Under AMC Category • Cachar, Karimganj, Hailakandi & Silchar Circles
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            Active Banking AMC
          </span>
        </div>

        <PNBAssetModule />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-blue to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Multi-Client Matrix
            </span>
            <span className="text-xs text-slate-300">
              Categorized Directory & Managed Assets
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Clients & Asset Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Central management of all client contracts across <strong>Sales, AMC, Solar, and Service</strong>.
            Easily locate client branches, inspect hardware assets, and print official reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Client</span>
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total Enrolled Clients</div>
          <div className="text-2xl font-black text-slate-900 font-mono">{clients.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {clients.filter(c => c.status === 'Active').length} Active Contracts
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">Managed Branches & Sites</div>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalBranches}</div>
          <div className="text-[11px] text-sky-600 font-medium mt-1">
            50 PNB + Postal + AGBB + Labs
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">Hardware Units in Field</div>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalAssets}</div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">
            Desktops, Printers & Solar Plants
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total Agreement Value</div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ₹{totalValue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-teal-600 font-medium mt-1">
            Commercial Turnover Managed
          </div>
        </div>
      </div>

      {/* Category Tabs & Quick Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{cat.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clients by name, contact person, location, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Contracts</option>
              <option value="Pending Renewal">Pending Renewal</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          const isPnb = client.hasBranchMatrix || client.id === 'CLI-AMC-001';
          return (
            <div 
              key={client.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Category & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                    client.category === 'AMC' ? 'bg-sky-100 text-sky-800' :
                    client.category === 'Sales' ? 'bg-amber-100 text-amber-800' :
                    client.category === 'Solar' ? 'bg-teal-100 text-teal-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {client.category} Client
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    client.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {client.status}
                  </span>
                </div>

                {/* Client Name & ID */}
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {client.name}
                </h3>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5 mb-3">
                  {client.id}
                </div>

                {/* Key Metrics Pill */}
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl mb-3 text-center">
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">Branches</div>
                    <div className="font-black text-slate-800 text-xs font-mono mt-0.5">{client.branchesCount}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">Assets</div>
                    <div className="font-black text-slate-800 text-xs font-mono mt-0.5">{client.assetsCount}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">Value</div>
                    <div className="font-black text-emerald-700 text-xs font-mono mt-0.5">
                      ₹{(Number(client.contractValue || 0) / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>

                {/* Info Rows */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{client.address || 'Silchar, Assam'}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{client.phone} ({client.contactPerson})</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] text-slate-500">Valid: {client.startDate} to {client.expiryDate}</span>
                  </div>
                </div>

                {/* Highlight Button if PNB Branch Matrix available */}
                {isPnb && (
                  <button
                    onClick={() => setExpandedPnbMatrix(true)}
                    className="w-full mb-3 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-blue-200"
                  >
                    <Landmark className="w-4 h-4 text-blue-600" />
                    <span>Open 50-Branch Hardware Matrix (543)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-1.5">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePrintClient(client)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                    title="Print Official Client & Asset Audit Slip"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <a
                    href={`https://wa.me/${(client.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Greetings from M/S Computer Planet regarding your ${client.category} contract.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                    title="Chat on WhatsApp"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(client)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit Client Details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id, client.name)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    title="Remove Client"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700 text-sm">No clients found matching your filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try switching categories or clearing search keywords.</p>
        </div>
      )}

      {/* Add / Edit Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-3 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                {editingClient ? `Edit Client Profile — ${editingClient.name}` : 'Enroll New Client & Asset Account'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Punjab National Bank, Silchar Educational Foundation"
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business Category</label>
                  <select
                    value={clientForm.category}
                    onChange={(e) => setClientForm({ ...clientForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="AMC">Banking & Institutional AMC</option>
                    <option value="Sales">Hardware & Spares Sales</option>
                    <option value="Solar">Solar Rooftop EPC</option>
                    <option value="Service">On-Demand Breakdown & Servicing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Name & Designation"
                    value={clientForm.contactPerson}
                    onChange={(e) => setClientForm({ ...clientForm, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 94350 XXXXX"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="contact@client.org"
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Address / Location</label>
                  <input
                    type="text"
                    placeholder="Branch location, City, District, Assam"
                    value={clientForm.address}
                    onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Managed Branches / Sites Count</label>
                  <input
                    type="number"
                    min="1"
                    value={clientForm.branchesCount}
                    onChange={(e) => setClientForm({ ...clientForm, branchesCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Hardware Assets Count</label>
                  <input
                    type="number"
                    min="0"
                    value={clientForm.assetsCount}
                    onChange={(e) => setClientForm({ ...clientForm, assetsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contract / Turnover Value (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={clientForm.contractValue}
                    onChange={(e) => setClientForm({ ...clientForm, contractValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={clientForm.status}
                    onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending Renewal">Pending Renewal</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Agreement Start Date</label>
                  <input
                    type="date"
                    value={clientForm.startDate}
                    onChange={(e) => setClientForm({ ...clientForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Agreement Expiry Date</label>
                  <input
                    type="date"
                    value={clientForm.expiryDate}
                    onChange={(e) => setClientForm({ ...clientForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Scope & Operational Notes</label>
                  <textarea
                    rows="2"
                    placeholder="Specific SLA terms, device types, or branch coverage details..."
                    value={clientForm.notes}
                    onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow"
                >
                  {editingClient ? 'Save Changes' : 'Enroll Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
