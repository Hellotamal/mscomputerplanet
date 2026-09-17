import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Search, 
  Filter, 
  Lock, 
  Eye, 
  EyeOff, 
  Edit2, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MapPin, 
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { ROLE_DEFINITIONS } from './erpStorage';

const ALL_MODULES = [
  { id: 'dashboard', label: 'Dashboard & Metrics' },
  { id: 'pnb_assets', label: 'PNB Asset Register (543)' },
  { id: 'tickets', label: 'Service Tickets' },
  { id: 'amc', label: 'AMC Contracts' },
  { id: 'inventory', label: 'Spares & Stock Inventory' },
  { id: 'invoices', label: 'GST Tax Invoicing' },
  { id: 'quotations', label: 'Quotations & Estimates' },
  { id: 'solar', label: 'Solar Projects' },
  { id: 'users', label: 'Staff & Role Management' },
  { id: 'hrms', label: 'Staff HRMS & Payslips' },
  { id: 'settings', label: 'Data Backup & Settings' }
];

export default function UsersModule({ users, setUsers, currentUser }) {
  const [search, setSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [revealedPins, setRevealedPins] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: ROLE_DEFINITIONS[1].role,
    pin: '99544',
    password: '',
    phone: '',
    region: 'Silchar & Cachar Circle',
    status: 'Active',
    permissions: ROLE_DEFINITIONS[1].defaultPermissions
  });

  const togglePinVisibility = (id) => {
    setRevealedPins(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      (u.region && u.region.toLowerCase().includes(search.toLowerCase())) ||
      (u.phone && u.phone.includes(search));
    const matchesRole = selectedRoleFilter === 'All' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (newRole) => {
    const roleObj = ROLE_DEFINITIONS.find(r => r.role === newRole);
    setFormData(prev => ({
      ...prev,
      role: newRole,
      permissions: roleObj ? [...roleObj.defaultPermissions] : prev.permissions
    }));
  };

  const togglePermission = (permId) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(permId);
      const newPerms = exists 
        ? prev.permissions.filter(p => p !== permId) 
        : [...prev.permissions, permId];
      return { ...prev, permissions: newPerms };
    });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.pin) {
      alert('Please provide Full Name and Staff Access PIN.');
      return;
    }

    if (formData.pin.length < 4) {
      alert('PIN should be at least 4 digits for security.');
      return;
    }

    // Check PIN uniqueness (except for shared default PIN 99544)
    if (formData.pin !== '99544' && users.some(u => u.pin === formData.pin)) {
      alert('This custom PIN is already in use by another staff user. Please choose a unique PIN.');
      return;
    }

    const autoUsername = formData.username.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
    const newUser = {
      ...formData,
      id: `USR-00${users.length + 1}`,
      username: autoUsername,
      password: formData.password || `${autoUsername}@99544`
    };

    setUsers([...users, newUser]);
    setShowAddModal(false);
    resetForm();
  };

  const handleStartEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      role: user.role,
      pin: user.pin,
      password: user.password || `${user.username || 'staff'}@99544`,
      phone: user.phone || '',
      region: user.region || 'Silchar',
      status: user.status || 'Active',
      permissions: user.permissions || []
    });
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.pin) {
      alert('Please provide Full Name and Staff Access PIN.');
      return;
    }

    // Check PIN collision with other users
    if (users.some(u => u.id !== editingUser.id && u.pin === formData.pin)) {
      alert('This PIN is already assigned to another staff member.');
      return;
    }

    setUsers(users.map(u => u.id === editingUser.id ? {
      ...formData,
      id: editingUser.id,
      password: formData.password || u.password || `${u.username}@99544`
    } : u));

    setEditingUser(null);
    resetForm();
  };

  const handleDeleteUser = (id, name, role) => {
    if (role.includes('Admin') && users.filter(u => u.role.includes('Admin')).length <= 1) {
      alert('Cannot remove the primary Administrator account.');
      return;
    }

    if (window.confirm(`Are you sure you want to remove staff user: ${name} (${role})?`)) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      role: ROLE_DEFINITIONS[1].role,
      pin: '99544',
      password: '',
      phone: '',
      region: 'Silchar & Cachar Circle',
      status: 'Active',
      permissions: ROLE_DEFINITIONS[1].defaultPermissions
    });
  };

  const getRoleBadgeClass = (role) => {
    if (role.includes('Admin')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (role.includes('Engineer')) return 'bg-sky-100 text-sky-800 border-sky-200';
    if (role.includes('Accounts') || role.includes('Billing')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (role.includes('Solar')) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-3 border border-indigo-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Staff & User Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Authorize engineers, billing officers, and solar supervisors with custom module permissions and secure PIN logins.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff User</span>
        </button>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Staff</div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{users.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Registered personnel</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">Active Users</div>
          <div className="text-2xl font-black text-emerald-900 mt-1 font-mono">
            {users.filter(u => u.status === 'Active').length}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Enabled login PINs</div>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
          <div className="text-xs text-purple-700 font-semibold uppercase tracking-wider">Administrators</div>
          <div className="text-2xl font-black text-purple-900 mt-1 font-mono">
            {users.filter(u => u.role.includes('Admin')).length}
          </div>
          <div className="text-[10px] text-purple-600 mt-0.5">Full access owners</div>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
          <div className="text-xs text-sky-700 font-semibold uppercase tracking-wider">Field Engineers</div>
          <div className="text-2xl font-black text-sky-900 mt-1 font-mono">
            {users.filter(u => u.role.includes('Engineer') || u.role.includes('Lead')).length}
          </div>
          <div className="text-[10px] text-sky-600 mt-0.5">Assigned to Silchar & Cachar</div>
        </div>
      </div>

      {/* Search and Role Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search staff name, role, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold shrink-0">Filter Role:</span>
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Roles ({users.length})</option>
            {ROLE_DEFINITIONS.map(r => (
              <option key={r.role} value={r.role}>{r.role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map((u) => {
          const isRevealed = revealedPins[u.id];
          return (
            <div
              key={u.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-base">{u.name}</h4>
                        <span className="text-xs font-mono text-slate-400 font-semibold">{u.id}</span>
                      </div>
                      <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getRoleBadgeClass(u.role)}`}>
                        {u.role}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {u.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mt-3">
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{u.phone || 'No phone set'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{u.region || 'Silchar'}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between col-span-2 pt-1.5 border-t border-slate-200/60 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-500">PIN:</span>
                      <strong className="font-mono text-slate-900 tracking-wider">
                        {isRevealed ? u.pin : '••••'}
                      </strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-500">Pass:</span>
                      <strong className="font-mono text-slate-900">
                        {isRevealed ? (u.password || `${u.username}@99544`) : '••••••••'}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePinVisibility(u.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 ml-auto"
                      title={isRevealed ? "Hide Credentials" : "Show Credentials"}
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Permissions Badges */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Authorized ERP Modules ({u.permissions ? u.permissions.length : 0})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(u.permissions || []).map(permId => {
                      const mod = ALL_MODULES.find(m => m.id === permId);
                      return (
                        <span key={permId} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {mod ? mod.label : permId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleStartEdit(u)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => handleDeleteUser(u.id, u.name, u.role)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit User Modal */}
      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingUser ? `Edit Staff Profile: ${editingUser.name}` : 'Register New Staff Member'}
                </h3>
                <p className="text-xs text-slate-400">Configure role, credentials, and access permissions</p>
              </div>
              <button 
                onClick={() => { setShowAddModal(false); setEditingUser(null); }} 
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Debashis Roy"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 94350 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operational Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {ROLE_DEFINITIONS.map(r => (
                    <option key={r.role} value={r.role}>{r.role}</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  {ROLE_DEFINITIONS.find(r => r.role === formData.role)?.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Territory / Circle</label>
                  <input
                    type="text"
                    placeholder="e.g. PNB Silchar Circle / Cachar"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Active">Active (Permitted Login)</option>
                    <option value="Suspended">Suspended (Access Blocked)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Security Credentials (2-Step Gate)
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    2-Factor Portal
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Step 1: Terminal PIN *
                    </label>
                    <input
                      type="password"
                      required
                      maxLength="8"
                      placeholder="e.g. 99544"
                      value={formData.pin}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono tracking-widest text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Step 2: Password *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. staff@99544"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-slate-400">
                  Staff member enters Terminal PIN first, then User ID (<span className="font-mono text-slate-700 font-bold">{formData.username || 'auto-generated'}</span>) and Password.
                </p>
              </div>

              {/* Granular Module Access Checklist */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2.5">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Module Permissions Checklist
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {ALL_MODULES.map(m => {
                    const isChecked = formData.permissions.includes(m.id);
                    return (
                      <label 
                        key={m.id} 
                        className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition border ${
                          isChecked ? 'bg-white border-emerald-300 text-slate-900 shadow-sm' : 'bg-transparent border-transparent text-slate-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(m.id)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span className="font-medium text-xs">{m.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingUser(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  {editingUser ? 'Save User Changes' : 'Create Staff Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
