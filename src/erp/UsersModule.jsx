import React, { useState } from 'react';
import { 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert,
  Search, 
  Lock, 
  Eye, 
  EyeOff, 
  Edit2, 
  Trash2, 
  X, 
  Phone, 
  MapPin, 
  KeyRound,
  RefreshCw,
  User
} from 'lucide-react';
import { ROLE_DEFINITIONS, recordAuditLog, saveErpData } from './erpStorage';
import { sha256 } from './erpSecurity';

const ALL_MODULES = [
  { id: 'dashboard', label: 'Dashboard & Metrics' },
  { id: 'crm', label: 'CRM & Sales Funnel' },
  { id: 'engineering', label: 'Engineering & BOQ Sizing' },
  { id: 'itsm', label: 'IT Support / ITSM Suite (11 Tools)' },
  { id: 'clients', label: 'Clients & Assets Register' },
  { id: 'pnb_assets', label: 'PNB Asset Register (543)' },
  { id: 'tickets', label: 'Service Tickets' },
  { id: 'amc', label: 'AMC Contracts' },
  { id: 'inventory', label: 'Spares & Stock Inventory' },
  { id: 'invoices', label: 'GST Tax Invoicing' },
  { id: 'quotations', label: 'Quotations & Estimates' },
  { id: 'solar', label: 'Solar Projects' },
  { id: 'accounts', label: 'Accounts & Finance' },
  { id: 'reports', label: 'Audit & Reports Centre' },
  { id: 'hrms', label: 'Staff HRMS & Payslips' },
  { id: 'users', label: 'Staff & Role Management' },
  { id: 'settings', label: 'Data Backup & Settings' }
];

export default function UsersModule({ users, setUsers, currentUser }) {
  const isAdmin = Boolean(
    currentUser && (
      currentUser.username?.toLowerCase() === 'admin' ||
      (currentUser.role && currentUser.role.toLowerCase().includes('admin'))
    )
  );

  const [search, setSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [revealedPins, setRevealedPins] = useState({});

  // Reset Password Modal State
  const [resetModalUser, setResetModalUser] = useState(null);
  const [resetPasswordInput, setResetPasswordInput] = useState('');
  const [resetPinInput, setResetPinInput] = useState('');
  const [showResetPass, setShowResetPass] = useState(false);

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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can create staff users.');
      return;
    }
    if (!formData.name.trim() || !formData.pin.trim()) {
      alert('Please provide Full Name and Staff Access PIN.');
      return;
    }

    if (formData.pin.length < 4) {
      alert('PIN should be at least 4 digits for security.');
      return;
    }

    const cleanUsername = (formData.username.trim() || formData.name.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 12)).toLowerCase();

    if (users.some(u => u.username && u.username.toLowerCase() === cleanUsername)) {
      alert(`Username '${cleanUsername}' is already taken. Please enter a different User ID.`);
      return;
    }

    // Check PIN uniqueness (except for shared default PIN 99544)
    if (formData.pin !== '99544' && users.some(u => u.pin === formData.pin)) {
      alert('This custom PIN is already in use by another staff user. Please choose a unique PIN.');
      return;
    }

    const rawPassword = formData.password.trim() || `${cleanUsername}@99544`;
    const passHash = await sha256(rawPassword);
    const pinHash = await sha256(formData.pin);

    const newUser = {
      ...formData,
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      name: formData.name.trim(),
      username: cleanUsername,
      password: rawPassword,
      passwordHash: passHash,
      pinHash: pinHash,
      createdAt: new Date().toISOString()
    };

    const updated = [...users, newUser];
    setUsers(updated);
    saveErpData("users", updated);
    recordAuditLog("USER_CREATED_ADMIN", "Users", `Admin created user '${cleanUsername}' (${newUser.name}).`);
    setShowAddModal(false);
    resetForm();
  };

  const handleStartEdit = (user) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can edit staff users.');
      return;
    }
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

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can update staff users.');
      return;
    }
    if (!formData.name.trim() || !formData.pin.trim()) {
      alert('Please provide Full Name and Staff Access PIN.');
      return;
    }

    const cleanUsername = (formData.username.trim() || editingUser.username).toLowerCase();

    // Check username collision with other users
    if (users.some(u => u.id !== editingUser.id && u.username && u.username.toLowerCase() === cleanUsername)) {
      alert(`Username '${cleanUsername}' is already assigned to another staff member.`);
      return;
    }

    // Check PIN collision with other users
    if (users.some(u => u.id !== editingUser.id && u.pin === formData.pin)) {
      alert('This PIN is already assigned to another staff member.');
      return;
    }

    const rawPassword = formData.password.trim() || editingUser.password || `${cleanUsername}@99544`;
    const passHash = await sha256(rawPassword);
    const pinHash = await sha256(formData.pin);

    const updated = users.map(u => u.id === editingUser.id ? {
      ...formData,
      id: editingUser.id,
      name: formData.name.trim(),
      username: cleanUsername,
      password: rawPassword,
      passwordHash: passHash,
      pinHash: pinHash
    } : u);

    setUsers(updated);
    saveErpData("users", updated);
    recordAuditLog("USER_UPDATED_ADMIN", "Users", `Admin updated profile for user '${cleanUsername}'.`);
    setEditingUser(null);
    resetForm();
  };

  // Open Reset Password Modal for a user
  const handleOpenResetModal = (user) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can reset user credentials.');
      return;
    }
    setResetModalUser(user);
    setResetPasswordInput('');
    setResetPinInput(user.pin || '99544');
    setShowResetPass(false);
  };

  const handleResetPasswordAdmin = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can reset user credentials.');
      return;
    }
    if (!resetModalUser) return;
    if (!resetPasswordInput || resetPasswordInput.length < 6) {
      alert('New password must be at least 6 characters long.');
      return;
    }

    const passHash = await sha256(resetPasswordInput);
    const pinVal = resetPinInput.trim() || resetModalUser.pin || '99544';
    const pinHash = await sha256(pinVal);

    const updated = users.map(u => u.id === resetModalUser.id ? {
      ...u,
      password: resetPasswordInput,
      passwordHash: passHash,
      pin: pinVal,
      pinHash: pinHash,
      lastPasswordReset: new Date().toISOString()
    } : u);

    setUsers(updated);
    saveErpData("users", updated);
    recordAuditLog("PASSWORD_RESET_ADMIN", "Users", `Admin reset credentials for User ID '${resetModalUser.username}' (${resetModalUser.name}).`);
    alert(`Credentials successfully reset for @${resetModalUser.username}!`);
    setResetModalUser(null);
    setResetPasswordInput('');
    setResetPinInput('');
  };

  const handleDeleteUser = (id, name, role) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can remove staff accounts.');
      return;
    }
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

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-900">Administrator Access Required</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          User creation, role assignment, and staff credentials management are strictly restricted to the Administrator account.
        </p>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Logged in as: {currentUser?.name || currentUser?.username || 'Staff Member'} ({currentUser?.role || 'Restricted'})
          </span>
        </div>
      </div>
    );
  }

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
                        <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 flex items-center gap-1">
                          <User className="w-3 h-3 text-sky-500" />
                          <span>@{u.username}</span>
                        </span>
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
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleOpenResetModal(u)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition border border-amber-200"
                  title="Reset Password & Access PIN"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Reset Password</span>
                </button>
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
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        name: val,
                        username: prev.username || val.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    User ID / Username * <span className="text-[10px] text-slate-400 font-normal">(Login ID)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">@</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. debashis"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                      className="w-full pl-7 pr-3 py-2 text-xs font-mono font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                </div>
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

      {/* Admin Reset Password Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reset Staff Password</h3>
                  <p className="text-xs text-slate-500">
                    User: <strong className="text-slate-800">{resetModalUser.name}</strong> (@{resetModalUser.username})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResetModalUser(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPasswordAdmin} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    New Password * (Min 6 chars)
                  </label>
                  <button
                    type="button"
                    onClick={() => setResetPasswordInput(`${resetModalUser.username}@99544`)}
                    className="text-[10px] text-amber-700 hover:underline font-semibold"
                  >
                    Set: {resetModalUser.username}@99544
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showResetPass ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Enter new password"
                    value={resetPasswordInput}
                    onChange={(e) => setResetPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 pr-9 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPass(!showResetPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showResetPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Update Terminal Access PIN (Optional)
                </label>
                <input
                  type="text"
                  maxLength="8"
                  placeholder="e.g. 99544"
                  value={resetPinInput}
                  onChange={(e) => setResetPinInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-xs font-mono tracking-widest rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Staff member can use this personal PIN or the master PIN (99544) to unlock the Step 1 gate.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Update Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
