import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  IndianRupee,
  Landmark,
  X,
  Edit2,
  Trash2
} from 'lucide-react';

export default function AMCModule({ amcContracts, setAmcContracts }) {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAmc, setEditingAmc] = useState(null);

  const [amcForm, setAmcForm] = useState({
    clientName: '',
    branchCount: 1,
    deviceCount: 10,
    annualValue: 50000,
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    workOrderRef: '',
    slaType: 'Comprehensive Hardware AMC',
    status: 'Active'
  });

  const totalAnnualRevenue = amcContracts.reduce((acc, c) => acc + (Number(c.annualValue) || 0), 0);
  const totalBranches = amcContracts.reduce((acc, c) => acc + (Number(c.branchCount) || 0), 0);
  const totalDevices = amcContracts.reduce((acc, c) => acc + (Number(c.deviceCount) || 0), 0);

  const filteredContracts = amcContracts.filter(c => 
    c.clientName.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    (c.workOrderRef && c.workOrderRef.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateAmc = (e) => {
    e.preventDefault();
    if (!amcForm.clientName || !amcForm.annualValue) {
      alert('Please fill in Client Name and Annual Contract Value.');
      return;
    }

    const created = {
      ...amcForm,
      id: `AMC-2024-${Math.floor(100 + Math.random() * 900)}`,
      branchCount: Number(amcForm.branchCount) || 1,
      deviceCount: Number(amcForm.deviceCount) || 1,
      annualValue: Number(amcForm.annualValue) || 0,
      status: 'Active'
    };

    setAmcContracts([created, ...amcContracts]);
    setShowAddModal(false);
    resetForm();
  };

  const handleStartEdit = (amc) => {
    setEditingAmc(amc);
    setAmcForm({ ...amc });
  };

  const handleUpdateAmc = (e) => {
    e.preventDefault();
    setAmcContracts(amcContracts.map(c => c.id === editingAmc.id ? { 
      ...amcForm, 
      id: editingAmc.id,
      branchCount: Number(amcForm.branchCount) || 1,
      deviceCount: Number(amcForm.deviceCount) || 1,
      annualValue: Number(amcForm.annualValue) || 0
    } : c));
    setEditingAmc(null);
    resetForm();
  };

  const handleDeleteAmc = (id, clientName) => {
    if (window.confirm(`Are you sure you want to remove the AMC contract for ${clientName} (${id})?`)) {
      setAmcContracts(amcContracts.filter(c => c.id !== id));
    }
  };

  const resetForm = () => {
    setAmcForm({
      clientName: '',
      branchCount: 1,
      deviceCount: 10,
      annualValue: 50000,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      workOrderRef: '',
      slaType: 'Comprehensive Hardware AMC',
      status: 'Active'
    });
  };

  const calculateDaysLeft = (expiryDate) => {
    if (!expiryDate) return 'N/A';
    const diff = new Date(expiryDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
          <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Total Active AMC Value</div>
          <div className="text-2xl sm:text-3xl font-black font-mono mt-1">
            ₹{totalAnnualRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Annual contracted maintenance revenue</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Covered Branches & Offices</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
            {totalBranches} <span className="text-sm font-sans font-normal text-slate-500">Locations</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Across Silchar & Barak Valley</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Managed Devices</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
            {totalDevices} <span className="text-sm font-sans font-normal text-slate-500">Units</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Desktops, Servers, Printers & Scanners</div>
        </div>
      </div>

      {/* Filter and New AMC Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search AMC client, work order..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Contract</span>
        </button>
      </div>

      {/* AMC Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredContracts.map((amc) => {
          const daysLeft = calculateDaysLeft(amc.expiryDate);
          const isExpiringSoon = typeof daysLeft === 'number' && daysLeft < 60 && daysLeft > 0;

          return (
            <div
              key={amc.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {amc.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {amc.status}
                    </span>
                    <button
                      onClick={() => handleStartEdit(amc)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                      title="Edit Contract"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAmc(amc.id, amc.clientName)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                      title="Remove Contract"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900 mb-1">
                  {amc.clientName}
                </h4>
                <div className="text-xs text-slate-500 mb-3 font-mono">
                  Order Ref: {amc.workOrderRef || 'Direct Commercial AMC'}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Branches Covered:</span>
                    <strong className="text-slate-900">{amc.branchCount} Branches</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hardware Units:</span>
                    <strong className="text-slate-900">{amc.deviceCount} Devices</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Annual Value:</span>
                    <strong className="text-emerald-700 font-mono">₹{Number(amc.annualValue).toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="text-xs text-slate-600 mb-2">
                  <span className="text-slate-400">SLA: </span>
                  {amc.slaType}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Valid till: {amc.expiryDate || 'Ongoing'}</span>
                </span>
                {isExpiringSoon && (
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    {daysLeft}d left
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit AMC Modal */}
      {(showAddModal || editingAmc) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingAmc ? `Edit Contract: ${editingAmc.id}` : 'Record New Annual Maintenance Contract'}
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); setEditingAmc(null); }} 
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingAmc ? handleUpdateAmc : handleCreateAmc} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Bank Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Punjab National Bank Silchar"
                  value={amcForm.clientName}
                  onChange={(e) => setAmcForm({ ...amcForm, clientName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Branches</label>
                  <input
                    type="number"
                    min="1"
                    value={amcForm.branchCount}
                    onChange={(e) => setAmcForm({ ...amcForm, branchCount: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Devices Covered</label>
                  <input
                    type="number"
                    min="1"
                    value={amcForm.deviceCount}
                    onChange={(e) => setAmcForm({ ...amcForm, deviceCount: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Contract Value (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 150000"
                    value={amcForm.annualValue}
                    onChange={(e) => setAmcForm({ ...amcForm, annualValue: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Order Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. PO/044-2024"
                    value={amcForm.workOrderRef}
                    onChange={(e) => setAmcForm({ ...amcForm, workOrderRef: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contract Start Date</label>
                  <input
                    type="date"
                    value={amcForm.startDate}
                    onChange={(e) => setAmcForm({ ...amcForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contract Expiry Date</label>
                  <input
                    type="date"
                    value={amcForm.expiryDate}
                    onChange={(e) => setAmcForm({ ...amcForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contract Status</label>
                  <select
                    value={amcForm.status}
                    onChange={(e) => setAmcForm({ ...amcForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending Renewal">Pending Renewal</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SLA Scope</label>
                  <input
                    type="text"
                    placeholder="e.g. Comprehensive with 4-hr buffer replacement"
                    value={amcForm.slaType}
                    onChange={(e) => setAmcForm({ ...amcForm, slaType: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingAmc(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-500"
                >
                  {editingAmc ? 'Save Contract Changes' : 'Save Contract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
