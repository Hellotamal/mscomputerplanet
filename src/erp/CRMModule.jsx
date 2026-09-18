import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Plus,
  Search,
  Kanban,
  List,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Clock,
  Send,
  Download,
  Printer,
  UserPlus,
  Trash2,
  Edit2,
  SunMedium,
  Landmark,
  ShoppingBag,
  Wrench
} from 'lucide-react';
import { recordAuditLog, saveErpData } from './erpStorage';

const CRM_STAGES = [
  { id: 'New Lead', label: 'New Inquiries', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-400', badgeColor: 'bg-indigo-500 text-white' },
  { id: 'Contacted & Qualifying', label: 'Contacted & Scoped', color: 'border-sky-500 bg-sky-500/10 text-sky-400', badgeColor: 'bg-sky-500 text-white' },
  { id: 'Site Survey & Feasibility', label: 'Site Survey & Tech', color: 'border-amber-500 bg-amber-500/10 text-amber-400', badgeColor: 'bg-amber-500 text-slate-950' },
  { id: 'BOQ & Quotation Sent', label: 'BOQ / Quote Sent', color: 'border-purple-500 bg-purple-500/10 text-purple-400', badgeColor: 'bg-purple-500 text-white' },
  { id: 'Negotiation & Review', label: 'Negotiation / Review', color: 'border-teal-500 bg-teal-500/10 text-teal-400', badgeColor: 'bg-teal-500 text-slate-950' },
  { id: 'Deal Won', label: 'Won / Work Order', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400', badgeColor: 'bg-emerald-500 text-white' },
  { id: 'Deal Lost', label: 'Closed Lost', color: 'border-rose-500 bg-rose-500/10 text-rose-400', badgeColor: 'bg-rose-500 text-white' }
];

const LEAD_SOURCES = [
  { id: 'IndiaMART B2B Lead', label: 'IndiaMART TrustSEAL', badge: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'Justdial Directory', label: 'Justdial Preferred', badge: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'Google Business', label: 'Google 4.9★ Search', badge: 'bg-blue-100 text-blue-900 border-blue-300' },
  { id: 'GeM Govt Portal', label: 'GeM Govt Tender', badge: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  { id: 'Website Quote / Ticket', label: 'Direct Website Portal', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'Client Referral', label: 'Banking Referral', badge: 'bg-teal-100 text-teal-900 border-teal-300' },
  { id: 'Omnis Trades Channel', label: 'Omnis Solar Partner', badge: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { id: 'Direct Walk-in', label: 'Walk-in / Direct Call', badge: 'bg-slate-100 text-slate-900 border-slate-300' }
];

const CATEGORIES = [
  'Solar Rooftop EPC',
  'Banking IT AMC',
  'Hardware Sales & GeM Procurement',
  'Service & Repairs',
  'CCTV & Security'
];

const createInitialLeadForm = (userName) => ({
  clientName: '',
  contactPerson: '',
  phone: '',
  email: '',
  city: 'Silchar',
  address: '',
  category: 'Solar Rooftop EPC',
  source: 'IndiaMART B2B Lead',
  stage: 'New Lead',
  priority: 'High',
  estimatedValue: '',
  requirement: '',
  assignedTo: userName || 'Technical Sales Lead',
  nextFollowUp: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
  notes: ''
});

export default function CRMModule({
  leads = [],
  setLeads,
  clients = [],
  setClients,
  currentUser
}) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [conversionSuccess, setConversionSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState(() => createInitialLeadForm(currentUser?.name));

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        l.clientName?.toLowerCase().includes(q) ||
        l.contactPerson?.toLowerCase().includes(q) ||
        l.phone?.includes(q) ||
        l.city?.toLowerCase().includes(q) ||
        l.requirement?.toLowerCase().includes(q) ||
        l.id?.toLowerCase().includes(q);

      const matchesStage = selectedStage === 'All' || l.stage === selectedStage;
      const matchesSource = selectedSource === 'All' || l.source === selectedSource;
      const matchesCategory = selectedCategory === 'All' || l.category === selectedCategory;
      const matchesPriority = selectedPriority === 'All' || l.priority === selectedPriority;

      return matchesSearch && matchesStage && matchesSource && matchesCategory && matchesPriority;
    });
  }, [leads, search, selectedStage, selectedSource, selectedCategory, selectedPriority]);

  // Aggregate Metrics
  const activePipelineLeads = leads.filter(l => l.stage !== 'Deal Won' && l.stage !== 'Deal Lost');
  const totalPipelineVal = activePipelineLeads.reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);
  const wonDeals = leads.filter(l => l.stage === 'Deal Won');
  const totalWonVal = wonDeals.reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);
  const closedTotal = leads.filter(l => l.stage === 'Deal Won' || l.stage === 'Deal Lost').length;
  const conversionRate = closedTotal > 0 ? Math.round((wonDeals.length / closedTotal) * 100) : 0;

  // Handle Save (Create / Update)
  const handleSaveLead = (e) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.phone.trim()) {
      alert('Please provide Client / Organization Name and Phone Number.');
      return;
    }

    if (editingLead) {
      const updated = leads.map(l => l.id === editingLead.id ? {
        ...formData,
        id: editingLead.id,
        estimatedValue: Number(formData.estimatedValue) || 0,
        updatedAt: new Date().toISOString()
      } : l);

      setLeads(updated);
      saveErpData("leads", updated);
      recordAuditLog("LEAD_UPDATED", "CRM", `Updated lead ${editingLead.id} for ${formData.clientName}`);
      setEditingLead(null);
    } else {
      const newId = `LEAD-2026-${String(leads.length + 1).padStart(3, '0')}`;
      const newLead = {
        ...formData,
        id: newId,
        estimatedValue: Number(formData.estimatedValue) || 0,
        createdAt: new Date().toISOString()
      };

      const updated = [newLead, ...leads];
      setLeads(updated);
      saveErpData("leads", updated);
      recordAuditLog("LEAD_CREATED", "CRM", `Captured new lead ${newId} (${newLead.clientName}) from ${newLead.source}`);
      setShowAddModal(false);
    }

    setFormData(initialForm);
  };

  // Change Stage with 1-click
  const handleAdvanceStage = (leadId, nextStage) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return { ...l, stage: nextStage, updatedAt: new Date().toISOString() };
      }
      return l;
    });
    setLeads(updated);
    saveErpData("leads", updated);
    recordAuditLog("LEAD_STAGE_CHANGED", "CRM", `Lead ${leadId} advanced to stage '${nextStage}'`);
  };

  // Convert Lead directly to Active Client in Clients Module
  const handleConvertToClient = (lead) => {
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const clientExists = clients.some(c => c.phone && c.phone.replace(/\D/g, '') === cleanPhone);

    if (clientExists) {
      alert(`A client with phone number ${lead.phone} already exists in your Clients & Assets database.`);
      return;
    }

    const newClientId = `CLT-${String(clients.length + 1).padStart(3, '0')}`;
    const newClient = {
      id: newClientId,
      name: lead.clientName,
      contactPerson: lead.contactPerson || lead.clientName,
      phone: lead.phone,
      email: lead.email || '',
      address: lead.address || `${lead.city || 'Silchar'}, Assam`,
      category: lead.category.includes('Solar') ? 'Solar' : lead.category.includes('AMC') ? 'AMC' : 'Sales',
      leadSource: lead.source || 'IndiaMART B2B Lead',
      gst: '',
      status: 'Active',
      contractStart: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      notes: `Converted from CRM Lead ${lead.id}. Requirement: ${lead.requirement || 'N/A'}`
    };

    const updatedClients = [newClient, ...clients];
    setClients(updatedClients);
    saveErpData("clients", updatedClients);

    // Also mark the lead as Deal Won
    handleAdvanceStage(lead.id, 'Deal Won');

    recordAuditLog("LEAD_CONVERTED_TO_CLIENT", "CRM", `Lead ${lead.id} successfully converted to official client ${newClientId} (${newClient.name})`);

    setConversionSuccess(`Lead ${lead.id} successfully enrolled as Client ${newClientId} (${newClient.name})!`);
    setTimeout(() => setConversionSuccess(''), 6000);
  };

  // Delete Lead
  const handleDeleteLead = (id, name) => {
    if (window.confirm(`Are you sure you want to delete lead: ${name} (${id})?`)) {
      const updated = leads.filter(l => l.id !== id);
      setLeads(updated);
      saveErpData("leads", updated);
      recordAuditLog("LEAD_DELETED", "CRM", `Deleted CRM lead ${id} (${name})`);
    }
  };

  // WhatsApp quick trigger
  const triggerWhatsAppFollowUp = (lead) => {
    const rawNum = lead.phone.replace(/\D/g, '');
    const targetPhone = rawNum.startsWith('91') ? rawNum : `91${rawNum}`;
    const text = encodeURIComponent(
      `Dear ${lead.contactPerson || lead.clientName},\n\n` +
      `Greetings from M/S Computer Planet, Silchar! Regarding your inquiry for ${lead.category} (${lead.requirement || 'Services'}), our technical team is ready with your feasibility proposal.\n\n` +
      `Please let us know a suitable time for discussion.\n` +
      `Best regards,\n` +
      `${lead.assignedTo || 'Technical Team'}\n` +
      `M/S Computer Planet (Club Road, Silchar)\n` +
      `Ph: +91 86380 83712 / +91 94350 71052`
    );
    window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank');
  };

  // Print Lead Register
  const handlePrintReport = () => {
    window.print();
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Lead ID', 'Client Name', 'Contact Person', 'Phone', 'Email', 'City', 'Category', 'Source', 'Stage', 'Priority', 'Est. Value', 'Next Followup', 'Assigned To'];
    const rows = filteredLeads.map(l => [
      l.id,
      `"${l.clientName || ''}"`,
      `"${l.contactPerson || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.city || ''}"`,
      `"${l.category || ''}"`,
      `"${l.source || ''}"`,
      `"${l.stage || ''}"`,
      `"${l.priority || ''}"`,
      l.estimatedValue || 0,
      l.nextFollowUp || '',
      `"${l.assignedTo || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mcp_crm_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getCategoryIcon = (category) => {
    if (category.includes('Solar')) return SunMedium;
    if (category.includes('AMC') || category.includes('Banking')) return Landmark;
    if (category.includes('Hardware') || category.includes('GeM')) return ShoppingBag;
    return Wrench;
  };

  return (
    <div className="space-y-6">
      {/* Conversion Success Notification Banner */}
      {conversionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-emerald-500/20 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{conversionSuccess}</span>
          </div>
          <button 
            onClick={() => setConversionSuccess('')}
            className="px-2.5 py-1 rounded-lg bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 font-mono text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Title & Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-3 border border-indigo-500/30">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Enterprise Pillar 1: CRM & Commercial Growth</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            CRM & Sales Pipeline Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            Manage inbound inquiries from IndiaMART, Justdial, Google & GeM tenders. Track site surveys, BOQ proposals, and deal conversions across Silchar and the Barak Valley.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                viewMode === 'list' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>

          <button
            onClick={() => {
              setEditingLead(null);
              setFormData(initialForm);
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/40 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Active Pipeline</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono">
            {activePipelineLeads.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Leads in progress
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 shadow-sm">
          <div className="flex items-center justify-between text-indigo-800 text-xs font-semibold uppercase tracking-wider">
            <span>Pipeline Value</span>
            <IndianRupee className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-indigo-950 mt-2 font-mono truncate">
            ₹{totalPipelineVal.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-indigo-700 mt-1">
            Potential deal value
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold uppercase tracking-wider">
            <span>Deals Won</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-950 mt-2 font-mono truncate">
            ₹{totalWonVal.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">
            {wonDeals.length} deals closed won
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between text-amber-800 text-xs font-semibold uppercase tracking-wider">
            <span>Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-950 mt-2 font-mono">
            {conversionRate}%
          </div>
          <div className="text-[11px] text-amber-700 mt-1">
            {wonDeals.length} won out of {closedTotal || 1} closed
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client, organization, phone, requirement or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Stages ({leads.length})</option>
              {CRM_STAGES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>

            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Channels</option>
              {LEAD_SOURCES.map(src => (
                <option key={src.id} value={src.id}>{src.label}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
              title="Export filtered leads to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={handlePrintReport}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
              title="Print lead register"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Mode 1: Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4 no-scrollbar">
          <div className="flex gap-4 min-w-[1300px]">
            {CRM_STAGES.map(stage => {
              const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
              const stageTotalVal = stageLeads.reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);

              return (
                <div 
                  key={stage.id} 
                  className="flex-1 min-w-[280px] bg-slate-50/70 rounded-2xl p-3 border border-slate-200/80 flex flex-col max-h-[750px]"
                >
                  {/* Stage Column Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-lg ${stage.badgeColor}`}>
                        {stageLeads.length}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {stage.label}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      ₹{(stageTotalVal / 1000).toFixed(0)}k
                    </span>
                  </div>

                  {/* Stage Cards Container */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {stageLeads.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">
                        No leads in this stage
                      </div>
                    ) : (
                      stageLeads.map(lead => {
                        const Icon = getCategoryIcon(lead.category);
                        const sourceObj = LEAD_SOURCES.find(s => s.id === lead.source) || LEAD_SOURCES[0];

                        return (
                          <div
                            key={lead.id}
                            className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition space-y-2.5 relative group"
                          >
                            {/* Card Top: Source Badge & Amount */}
                            <div className="flex items-center justify-between gap-1">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border truncate max-w-[140px] ${sourceObj.badge}`}>
                                {sourceObj.label}
                              </span>
                              <span className="text-xs font-black font-mono text-indigo-950 shrink-0">
                                ₹{Number(lead.estimatedValue).toLocaleString('en-IN')}
                              </span>
                            </div>

                            {/* Client Name & Requirement */}
                            <div>
                              <h5 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                                {lead.clientName}
                              </h5>
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                                <Icon className="w-3 h-3 text-indigo-500 shrink-0" />
                                <span className="truncate">{lead.category}</span>
                              </div>
                            </div>

                            {lead.requirement && (
                              <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg line-clamp-2 leading-relaxed border border-slate-100">
                                {lead.requirement}
                              </p>
                            )}

                            {/* Location & Followup */}
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                              <span className="flex items-center gap-1 truncate max-w-[110px]">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{lead.city}</span>
                              </span>
                              <span className="flex items-center gap-1 font-mono text-indigo-600 font-bold">
                                <Calendar className="w-3 h-3 shrink-0" />
                                <span>{lead.nextFollowUp}</span>
                              </span>
                            </div>

                            {/* Card Footer Quick Actions */}
                            <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-100">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => triggerWhatsAppFollowUp(lead)}
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                                  title="Send WhatsApp Followup"
                                >
                                  <Send className="w-3 h-3" />
                                </button>
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition"
                                  title={`Call ${lead.phone}`}
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                                <button
                                  onClick={() => {
                                    setEditingLead(lead);
                                    setFormData(lead);
                                    setShowAddModal(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                                  title="Edit Lead"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Stage Advancement Quick Dropdown */}
                              <select
                                value={lead.stage}
                                onChange={(e) => handleAdvanceStage(lead.id, e.target.value)}
                                className="text-[10px] font-bold px-1.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 focus:outline-none"
                              >
                                {CRM_STAGES.map(s => (
                                  <option key={s.id} value={s.id}>→ {s.id.split(' ')[0]}</option>
                                ))}
                              </select>
                            </div>

                            {/* Convert to Client Action for Won/Negotiation stages */}
                            {lead.stage !== 'Deal Won' && lead.stage !== 'Deal Lost' && (
                              <button
                                onClick={() => handleConvertToClient(lead)}
                                className="w-full py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center gap-1 transition"
                              >
                                <UserPlus className="w-3 h-3" />
                                <span>Convert to Enrolled Client →</span>
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View Mode 2: Dense Table Register */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Lead ID & Date</th>
                  <th className="py-3.5 px-4">Client & Contact</th>
                  <th className="py-3.5 px-4">Domain & Requirement</th>
                  <th className="py-3.5 px-4">Source Channel</th>
                  <th className="py-3.5 px-4">Stage & Priority</th>
                  <th className="py-3.5 px-4 text-right">Est. Value</th>
                  <th className="py-3.5 px-4">Next Follow-Up</th>
                  <th className="py-3.5 px-4 text-center">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No matching leads found in CRM pipeline.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map(lead => {
                    const stageObj = CRM_STAGES.find(s => s.id === lead.stage) || CRM_STAGES[0];
                    const sourceObj = LEAD_SOURCES.find(s => s.id === lead.source) || LEAD_SOURCES[0];

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition group">
                        <td className="py-3 px-4 font-mono">
                          <span className="font-bold text-indigo-600 block">{lead.id}</span>
                          <span className="text-[10px] text-slate-400">{lead.createdAt ? lead.createdAt.split('T')[0] : '2026-09-18'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{lead.clientName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{lead.contactPerson}</span>
                            <span className="font-mono text-slate-400">({lead.phone})</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-semibold text-slate-800 truncate">{lead.category}</div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">{lead.requirement}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sourceObj.badge}`}>
                            {sourceObj.label}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stageObj.badgeColor}`}>
                            {stageObj.label}
                          </span>
                          <span className={`block text-[9px] font-bold mt-1 uppercase ${
                            lead.priority === 'High' ? 'text-rose-600' : 'text-slate-500'
                          }`}>
                            • {lead.priority} Priority
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          ₹{Number(lead.estimatedValue).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-indigo-600 font-bold">
                          {lead.nextFollowUp}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => triggerWhatsAppFollowUp(lead)}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                              title="WhatsApp Message"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleConvertToClient(lead)}
                              className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                              title="Convert to Enrolled Client"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingLead(lead);
                                setFormData(lead);
                                setShowAddModal(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                              title="Edit Lead"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id, lead.clientName)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  {editingLead ? `Editing Lead: ${editingLead.id}` : "Lead Acquisition & Commercial Ingestion"}
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {editingLead ? "Update CRM Lead Record" : "Capture New Sales Lead"}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Client / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cachar Rural Hospital / PNB Branch"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Contact Person & Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. K. N. Roy (Medical Supdt)"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 94350 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. contact@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    City / Territory
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Silchar, Hailakandi"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Service / Business Domain *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Lead Acquisition Channel *
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    {LEAD_SOURCES.map(src => (
                      <option key={src.id} value={src.id}>{src.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pipeline Stage *
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    {CRM_STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Estimated Deal Value (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 500000"
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Next Follow-Up Date
                  </label>
                  <input
                    type="date"
                    value={formData.nextFollowUp}
                    onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Normal">Normal Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Client Requirement / Scope of Work
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 10 kW rooftop solar with APDCL net metering / 50 PNB branch passbook printer AMC"
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Site Address / Location Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tarapur Point, Silchar, Cachar - 788003"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingLead ? "Update Lead" : "Save Lead to Pipeline"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
