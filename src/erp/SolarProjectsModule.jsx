import React, { useState } from 'react';
import { 
  SunMedium, 
  Plus, 
  Search, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Calendar,
  X,
  Edit2,
  Trash2
} from 'lucide-react';

export default function SolarProjectsModule({ solarProjects, setSolarProjects }) {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [projectForm, setProjectForm] = useState({
    customer: '',
    location: 'Silchar',
    capacityKw: 3,
    systemType: 'On-Grid Rooftop',
    totalAmount: 180000,
    status: 'Site Survey Completed',
    surveyCompleted: true,
    targetDate: '',
    notes: ''
  });

  const totalKwPipeline = solarProjects.reduce((acc, p) => acc + (Number(p.capacityKw) || 0), 0);
  const totalSolarRevenue = solarProjects.reduce((acc, p) => acc + (Number(p.totalAmount) || 0), 0);

  const filteredProjects = solarProjects.filter(p =>
    p.customer.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!projectForm.customer) {
      alert('Please provide customer name.');
      return;
    }

    const created = {
      ...projectForm,
      id: `SOL-0${solarProjects.length + 1}`,
      capacityKw: Number(projectForm.capacityKw) || 1,
      totalAmount: Number(projectForm.totalAmount) || 0
    };

    setSolarProjects([...solarProjects, created]);
    setShowAddModal(false);
    resetForm();
  };

  const handleStartEdit = (project) => {
    setEditingProject(project);
    setProjectForm({ ...project });
  };

  const handleUpdateProject = (e) => {
    e.preventDefault();
    setSolarProjects(solarProjects.map(p => p.id === editingProject.id ? {
      ...projectForm,
      id: editingProject.id,
      capacityKw: Number(projectForm.capacityKw) || 1,
      totalAmount: Number(projectForm.totalAmount) || 0
    } : p));
    setEditingProject(null);
    resetForm();
  };

  const handleDeleteProject = (id, customer) => {
    if (window.confirm(`Are you sure you want to remove solar project ${id} for ${customer}?`)) {
      setSolarProjects(solarProjects.filter(p => p.id !== id));
    }
  };

  const resetForm = () => {
    setProjectForm({
      customer: '',
      location: 'Silchar',
      capacityKw: 3,
      systemType: 'On-Grid Rooftop',
      totalAmount: 180000,
      status: 'Site Survey Completed',
      surveyCompleted: true,
      targetDate: '',
      notes: ''
    });
  };

  const updateProjectStatus = (id, newStatus) => {
    setSolarProjects(solarProjects.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-900 text-white shadow-md">
          <div className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">Total Solar Pipeline</div>
          <div className="text-2xl sm:text-3xl font-black font-mono mt-1">
            {totalKwPipeline} <span className="text-base font-sans font-normal text-emerald-200">kWp Installed/Active</span>
          </div>
          <div className="text-[11px] text-emerald-200 mt-2">Rooftop & Commercial Solar Capacity</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Project Valuation</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 mt-1">
            ₹{totalSolarRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Turnkey system sales & commissioning</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Deployments</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 mt-1">
            {solarProjects.length} <span className="text-base font-sans font-normal text-slate-500">Sites</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Homes, institutions & bank branches</div>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search solar customer, location..."
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
          <span>New Solar Project</span>
        </button>
      </div>

      {/* Project Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {project.id}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {project.capacityKw} kWp
                  </span>
                  <button
                    onClick={() => handleStartEdit(project)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                    title="Edit Solar Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id, project.customer)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                    title="Remove Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-900 mb-1">
                {project.customer}
              </h4>
              <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{project.location}</span>
                <span className="mx-1">•</span>
                <span>{project.systemType}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Project Value:</span>
                  <strong className="text-slate-900 font-mono">₹{Number(project.totalAmount).toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">APDCL Net-Metering:</span>
                  <strong className="text-emerald-700">{project.status}</strong>
                </div>
                {project.notes && (
                  <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 mt-1">
                    {project.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <select
                value={project.status}
                onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Site Survey Scheduled">Site Survey Scheduled</option>
                <option value="Site Survey Completed">Site Survey Completed</option>
                <option value="APDCL Application Submitted">APDCL Application Submitted</option>
                <option value="Installation In Progress">Installation In Progress</option>
                <option value="Commissioned & Net-Metered">Commissioned & Net-Metered</option>
              </select>

              {project.targetDate && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{project.targetDate}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Project Modal */}
      {(showAddModal || editingProject) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProject ? `Edit Project: ${editingProject.id}` : 'New Solar Installation Project'}
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); setEditingProject(null); }} 
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingProject ? handleUpdateProject : handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer / Commercial Enterprise *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bank Branch / Home Owner"
                  value={projectForm.customer}
                  onChange={(e) => setProjectForm({ ...projectForm, customer: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Site Location (Silchar / Cachar)</label>
                  <input
                    type="text"
                    placeholder="e.g. Tarapur / Meherpur"
                    value={projectForm.location}
                    onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Capacity (kW)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={projectForm.capacityKw}
                    onChange={(e) => setProjectForm({ ...projectForm, capacityKw: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">System Type</label>
                  <select
                    value={projectForm.systemType}
                    onChange={(e) => setProjectForm({ ...projectForm, systemType: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="On-Grid Rooftop">On-Grid Rooftop</option>
                    <option value="Hybrid with Battery Backup">Hybrid with Battery Backup</option>
                    <option value="Off-Grid Solar Station">Off-Grid Solar Station</option>
                    <option value="Solar Water Pumping">Solar Water Pumping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Value (₹)</label>
                  <input
                    type="number"
                    value={projectForm.totalAmount}
                    onChange={(e) => setProjectForm({ ...projectForm, totalAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Site Survey Scheduled">Site Survey Scheduled</option>
                    <option value="Site Survey Completed">Site Survey Completed</option>
                    <option value="APDCL Application Submitted">APDCL Application Submitted</option>
                    <option value="Installation In Progress">Installation In Progress</option>
                    <option value="Commissioned & Net-Metered">Commissioned & Net-Metered</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    value={projectForm.targetDate}
                    onChange={(e) => setProjectForm({ ...projectForm, targetDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Roof Details</label>
                <textarea
                  rows="2"
                  placeholder="e.g. RCC terrace 400 sq ft, APDCL meter number..."
                  value={projectForm.notes}
                  onChange={(e) => setProjectForm({ ...projectForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingProject(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-500"
                >
                  {editingProject ? 'Save Project Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
