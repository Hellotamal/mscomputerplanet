import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Plus,
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  MapPin,
  User,
  Zap,
  Printer,
  X,
  ChevronRight,
  Layers,
  Lock
} from 'lucide-react';

export default function ProjectsModule({ 
  enterpriseProjects, 
  setEnterpriseProjects,
  currentUser: _currentUser,
  isAdmin = false
}) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'gantt' | 'milestones'
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [printProject, setPrintProject] = useState(null);

  // Form State
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Solar EPC',
    client: '',
    location: 'Silchar, Assam',
    manager: 'Animesh Das (Solar Tech Lead)',
    capacityKw: 10,
    budget: 650000,
    actualCost: 0,
    startDate: new Date().toISOString().split('T')[0],
    targetDate: '',
    status: 'In Progress',
    boqSummary: '',
    apdclRef: ''
  });

  const categories = ['All', 'Solar EPC', 'IT Infrastructure'];
  const statuses = ['All', 'In Progress', 'Engineering & Procurement', 'Testing & Handover', 'Completed'];

  const filteredProjects = enterpriseProjects.filter(p => {
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.client.toLowerCase().includes(search.toLowerCase()) ||
                        p.id.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  // Financial aggregates
  const totalBudget = enterpriseProjects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0);
  const totalActual = enterpriseProjects.reduce((acc, p) => acc + (Number(p.actualCost) || 0), 0);
  const totalSolarKw = enterpriseProjects
    .filter(p => p.category === 'Solar EPC')
    .reduce((acc, p) => acc + (Number(p.capacityKw) || 0), 0);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can launch enterprise projects.');
      return;
    }
    if (!newProject.title || !newProject.client) {
      alert('Please fill in project title and client name');
      return;
    }

    const created = {
      ...newProject,
      id: `PRJ-2026-${String(enterpriseProjects.length + 1).padStart(3, '0')}`,
      progress: 10,
      milestones: [
        { id: "M1", name: "Site Feasibility & Shadow / Network Audit", done: true, date: newProject.startDate },
        { id: "M2", name: "Engineering Design & BOM / Sizing Sanction", done: false, date: "" },
        { id: "M3", name: "Procurement & Dispatch of Key Equipment", done: false, date: "" },
        { id: "M4", name: "Site Civil / Structure / Network Cabling", done: false, date: "" },
        { id: "M5", name: "Inverter Grid Sync / Server Configuration & Testing", done: false, date: "" },
        { id: "M6", name: "Final Client Acceptance & Handover Certificate", done: false, date: "" }
      ]
    };

    setEnterpriseProjects([created, ...enterpriseProjects]);
    setShowAddModal(false);
    setNewProject({
      title: '',
      category: 'Solar EPC',
      client: '',
      location: 'Silchar, Assam',
      manager: 'Animesh Das (Solar Tech Lead)',
      capacityKw: 10,
      budget: 650000,
      actualCost: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: '',
      status: 'In Progress',
      boqSummary: '',
      apdclRef: ''
    });
  };

  const toggleMilestone = (projectId, milestoneId) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can update project milestones.');
      return;
    }
    setEnterpriseProjects(enterpriseProjects.map(prj => {
      if (prj.id !== projectId) return prj;
      const updatedMilestones = prj.milestones.map(m => {
        if (m.id === milestoneId) return { ...m, done: !m.done };
        return m;
      });
      const doneCount = updatedMilestones.filter(m => m.done).length;
      const newProgress = Math.round((doneCount / updatedMilestones.length) * 100);
      return {
        ...prj,
        milestones: updatedMilestones,
        progress: newProgress,
        status: newProgress === 100 ? 'Completed' : prj.status
      };
    }));

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prev => {
        const updatedMilestones = prev.milestones.map(m => {
          if (m.id === milestoneId) return { ...m, done: !m.done };
          return m;
        });
        const doneCount = updatedMilestones.filter(m => m.done).length;
        return {
          ...prev,
          milestones: updatedMilestones,
          progress: Math.round((doneCount / updatedMilestones.length) * 100)
        };
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Pillar 4 • Project Management & EPC Execution</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Enterprise Projects & Infrastructure
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Solar EPC (Rooftop & Ground-mount with APDCL Net Metering) and Enterprise IT Infrastructure (PNB Banking LAN, RouterOS & Server rollouts).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin ? (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Launch New Project</span>
              </button>
            ) : (
              <div className="px-3.5 py-2 bg-slate-800/80 text-amber-300 rounded-xl font-semibold text-xs border border-amber-500/30 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>View-Only Mode (Admin Controlled)</span>
              </div>
            )}
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Solar Capacity in Pipeline</span>
            </div>
            <div className="text-xl font-black text-amber-400 font-mono">
              {totalSolarKw} <span className="text-xs font-sans text-slate-300 font-normal">kWp</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Briefcase className="w-3.5 h-3.5 text-teal-400" />
              <span>Active Projects</span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              {enterpriseProjects.length} <span className="text-xs font-sans text-slate-300 font-normal">Deployments</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Total Contract Value</span>
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono">
              ₹{totalBudget.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Actual Expenditure</span>
            </div>
            <div className="text-xl font-black text-sky-400 font-mono">
              ₹{totalActual.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'list' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Project Cards</span>
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'milestones' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Milestone Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('gantt')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'gantt' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeline / Gantt View</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search project, client, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-teal-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map(project => {
            const isSolar = project.category === 'Solar EPC';
            const margin = project.budget > 0 ? Math.round(((project.budget - project.actualCost) / project.budget) * 100) : 0;

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                          {project.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          isSolar ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {project.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          project.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {project.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => setPrintProject(project)}
                      className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                      title="Print Commissioning Handover Sheet"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 my-4 bg-slate-50 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate"><strong>Client:</strong> {project.client}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate"><strong>Lead:</strong> {project.manager}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span><strong>Target:</strong> {project.targetDate || 'TBD'}</span>
                    </div>
                  </div>

                  {/* Financial & Progress Bar */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">Project Completion:</span>
                      <span className="font-mono font-bold text-teal-600">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center p-2.5 bg-slate-900 text-white rounded-xl text-xs mb-4">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Budget</div>
                      <div className="font-bold font-mono">₹{(project.budget / 100000).toFixed(2)}L</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Actual Cost</div>
                      <div className="font-bold font-mono text-emerald-400">₹{(project.actualCost / 100000).toFixed(2)}L</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Gross Margin</div>
                      <div className="font-bold font-mono text-amber-400">{margin}%</div>
                    </div>
                  </div>

                  {/* Milestones Quick Peek */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Key Milestone Checklist ({project.milestones.filter(m => m.done).length}/{project.milestones.length})
                    </div>
                    {project.milestones.slice(0, 3).map(m => (
                      <div 
                        key={m.id}
                        onClick={() => toggleMilestone(project.id, m.id)}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100 hover:bg-slate-50 cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${m.done ? 'text-emerald-500' : 'text-slate-300'}`} />
                          <span className={m.done ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}>
                            {m.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{m.date || 'Pending'}</span>
                      </div>
                    ))}
                    {project.milestones.length > 3 && (
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 pt-1"
                      >
                        <span>View all {project.milestones.length} milestones & BOQ →</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Ref: <span className="font-mono font-semibold">{project.apdclRef || 'N/A'}</span>
                  </div>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>Manage Project</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Milestone Matrix Tab */}
      {activeTab === 'milestones' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Execution Milestone Matrix</h3>
              <p className="text-xs text-slate-500">Click any milestone circle to toggle completion status and recalculate project progress in real time.</p>
            </div>
          </div>
          <div className="divide-y divide-slate-200">
            {filteredProjects.map(project => (
              <div key={project.id} className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-teal-600 mr-2">{project.id}</span>
                    <strong className="text-slate-900 text-sm">{project.title}</strong>
                    <span className="text-xs text-slate-500 ml-2">({project.client})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold font-mono text-teal-600">{project.progress}% Complete</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
                  {project.milestones.map((m, idx) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(project.id, m.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-2.5 text-xs ${
                        m.done 
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' 
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        m.done ? 'bg-emerald-500 text-white' : 'border border-slate-300'
                      }`}>
                        {m.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold flex items-center justify-between">
                          <span>Stage {idx + 1}</span>
                          <span className="font-mono text-[10px] text-slate-400 font-normal">{m.date || 'TBD'}</span>
                        </div>
                        <div className="text-xs mt-0.5 leading-snug">{m.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gantt Timeline Tab */}
      {activeTab === 'gantt' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">EPC Timeline & Schedule (Gantt View)</h3>
              <p className="text-xs text-slate-500">Scheduled vs Completed execution windows for Q3-Q4 2026.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1 text-teal-600">
                <span className="w-3 h-3 bg-teal-500 rounded"></span> Solar EPC
              </span>
              <span className="flex items-center gap-1 text-blue-600">
                <span className="w-3 h-3 bg-blue-500 rounded"></span> IT Infrastructure
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {filteredProjects.map(project => {
              const isSolar = project.category === 'Solar EPC';
              return (
                <div key={project.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      <span className="font-mono text-slate-400">{project.id}</span>
                      <span>{project.title}</span>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {project.startDate} → {project.targetDate || 'Ongoing'} ({project.progress}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-6 rounded-xl overflow-hidden p-1 flex items-center">
                    <div
                      className={`h-full rounded-lg transition-all duration-500 flex items-center px-2 text-[10px] font-bold text-white shadow-sm ${
                        isSolar ? 'bg-gradient-to-r from-teal-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      }`}
                      style={{ width: `${Math.max(project.progress, 15)}%` }}
                    >
                      <span className="truncate">{project.client}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Project Detail & Management Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between rounded-t-2xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-xs font-bold">
                    {selectedProject.id}
                  </span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {selectedProject.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold">{selectedProject.title}</h2>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs text-slate-700">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Client</div>
                  <div className="font-bold text-slate-900">{selectedProject.client}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Location</div>
                  <div className="font-bold text-slate-900">{selectedProject.location}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Engineer Lead</div>
                  <div className="font-bold text-slate-900">{selectedProject.manager}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Ref / Sanction</div>
                  <div className="font-bold font-mono text-teal-700">{selectedProject.apdclRef || 'N/A'}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">BOQ & Equipment Specification</h4>
                <div className="p-3 bg-slate-100 rounded-xl font-mono text-xs text-slate-800 leading-relaxed">
                  {selectedProject.boqSummary || 'Bill of quantities loaded from engineering sizing.'}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Project Execution Milestones</h4>
                <div className="space-y-2">
                  {selectedProject.milestones.map((m, i) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(selectedProject.id, m.id)}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-teal-50/50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className={`w-4 h-4 ${m.done ? 'text-emerald-500' : 'text-slate-300'}`} />
                        <div>
                          <strong className="text-slate-900">{i + 1}. {m.name}</strong>
                          <div className="text-[11px] text-slate-500">Estimated Target Date: {m.date || 'TBD'}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        m.done ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {m.done ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setPrintProject(selectedProject);
                    setSelectedProject(null);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Generate Commissioning Certificate</span>
                </button>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-teal-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-teal-300" />
                <span>Launch New EPC / Infrastructure Project</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silchar Municipal Council 50 kWp Rooftop Solar"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500 font-semibold"
                  >
                    <option value="Solar EPC">Solar EPC (Rooftop/Ground)</option>
                    <option value="IT Infrastructure">IT Infrastructure (LAN/Server/CCTV)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Silchar Municipal Board"
                    value={newProject.client}
                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Site Location</label>
                  <input
                    type="text"
                    value={newProject.location}
                    onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project Lead</label>
                  <input
                    type="text"
                    value={newProject.manager}
                    onChange={(e) => setNewProject({ ...newProject, manager: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacity (kWp)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProject.capacityKw}
                    onChange={(e) => setNewProject({ ...newProject, capacityKw: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newProject.targetDate}
                    onChange={(e) => setNewProject({ ...newProject, targetDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">BOQ Summary</label>
                <textarea
                  rows="2"
                  placeholder="e.g. 92x 540W Mono PERC Panels, 1x 50kW Sungrow Inverter..."
                  value={newProject.boqSummary}
                  onChange={(e) => setNewProject({ ...newProject, boqSummary: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">APDCL / Statutory Work Order Ref</label>
                <input
                  type="text"
                  placeholder="e.g. APDCL/CGM/RE/2026/SL-1049"
                  value={newProject.apdclRef}
                  onChange={(e) => setNewProject({ ...newProject, apdclRef: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-md shadow-teal-600/20"
                >
                  Initialize Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Commissioning Handover Sheet Modal */}
      {printProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-8 shadow-2xl my-8 text-slate-900 print:m-0 print:p-4">
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black tracking-tight uppercase">M/S COMPUTER PLANET</h2>
                <p className="text-xs text-slate-600">West Kachudharam, Chincoorie, Silchar, Cachar, Assam - 788001</p>
                <p className="text-xs text-slate-600">GSTIN: 18ASTPR6755J1Z0 • MSME: UDYAM-AS-05-0019941</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-slate-900 text-white font-bold text-xs rounded-md uppercase">
                  Commissioning & Handover Certificate
                </span>
                <div className="font-mono text-xs text-slate-500 mt-1">Ref: {printProject.id}</div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl">
                <div><strong>Project Name:</strong> {printProject.title}</div>
                <div><strong>Category:</strong> {printProject.category}</div>
                <div><strong>Client:</strong> {printProject.client}</div>
                <div><strong>Site Location:</strong> {printProject.location}</div>
                <div><strong>Capacity / Scope:</strong> {printProject.capacityKw ? `${printProject.capacityKw} kWp Solar` : 'Enterprise IT Setup'}</div>
                <div><strong>Lead Engineer:</strong> {printProject.manager}</div>
              </div>

              <div>
                <h4 className="font-bold uppercase text-[11px] text-slate-500 mb-2">Verified Execution Stages</h4>
                <table className="w-full border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 text-left">
                      <th className="p-2 border border-slate-200">#</th>
                      <th className="p-2 border border-slate-200">Milestone Task</th>
                      <th className="p-2 border border-slate-200">Execution Date</th>
                      <th className="p-2 border border-slate-200">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printProject.milestones.map((m, i) => (
                      <tr key={m.id}>
                        <td className="p-2 border border-slate-200 font-mono">{i + 1}</td>
                        <td className="p-2 border border-slate-200">{m.name}</td>
                        <td className="p-2 border border-slate-200 font-mono">{m.date || 'Completed On-Site'}</td>
                        <td className="p-2 border border-slate-200 font-bold text-emerald-700">
                          {m.done ? 'PASSED / VERIFIED' : 'PENDING'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900">
                <strong>Certification Statement:</strong> This is to certify that the installation has been tested in accordance with standard engineering norms (IS:3043 for Earthing, IEC 61215 for PV Modules, APDCL Interconnection guidelines) and is handed over in fully working condition.
              </div>

              <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="border-t border-slate-400 pt-2 font-bold">Authorized Signatory</div>
                  <div className="text-slate-500">M/S COMPUTER PLANET, Silchar</div>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-2 font-bold">Client Acceptance Representative</div>
                  <div className="text-slate-500">{printProject.client}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setPrintProject(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
