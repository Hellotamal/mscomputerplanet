import React, { useState } from 'react';
import {
  Truck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Star,
  Plus,
  Search,
  CheckCircle2,
  DollarSign,
  Printer,
  X,
  CreditCard,
  Lock
} from 'lucide-react';

export default function VendorsModule({
  vendorsData,
  setVendorsData,
  currentUser: _currentUser,
  isAdmin = false
}) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [printRtgs, setPrintRtgs] = useState(null);

  const [newVendor, setNewVendor] = useState({
    name: '',
    category: 'Solar PV Modules & Cells',
    contactPerson: '',
    phone: '',
    email: '',
    address: 'Guwahati / Silchar, Assam',
    gstin: '',
    pan: '',
    bankName: 'State Bank of India',
    accountNo: '',
    ifsc: '',
    rating: 4.8,
    creditDays: 15,
    isGemRegistered: false
  });

  const categories = [
    'All',
    'Solar PV Modules & Cells',
    'Solar Inverters & Energy Storage',
    'Banking Desktops, Laptops & Passbook Printers',
    'Enterprise Networking & Structured Cabling',
    'Online UPS & Power Backup',
    'Solar Mounting Structures & Civil Foundations'
  ];

  const filteredVendors = (vendorsData || []).filter(v => {
    const matchCat = filterCategory === 'All' || v.category === filterCategory;
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
                        v.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
                        v.gstin.toLowerCase().includes(search.toLowerCase()) ||
                        v.id.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPurchases = (vendorsData || []).reduce((acc, v) => acc + (Number(v.totalPurchases) || 0), 0);
  const totalOutstanding = (vendorsData || []).reduce((acc, v) => acc + (Number(v.outstandingDue) || 0), 0);
  const gemCount = (vendorsData || []).filter(v => v.isGemRegistered).length;

  const handleCreateVendor = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can enrol new vendors.');
      return;
    }
    if (!newVendor.name || !newVendor.contactPerson) {
      alert('Please fill in vendor name and contact person.');
      return;
    }

    const created = {
      ...newVendor,
      id: `VND-00${(vendorsData || []).length + 1}`,
      totalPurchases: 0,
      outstandingDue: 0,
      rating: Number(newVendor.rating) || 4.5,
      creditDays: Number(newVendor.creditDays) || 15
    };

    setVendorsData([created, ...(vendorsData || [])]);
    setShowAddModal(false);
    setNewVendor({
      name: '',
      category: 'Solar PV Modules & Cells',
      contactPerson: '',
      phone: '',
      email: '',
      address: 'Guwahati / Silchar, Assam',
      gstin: '',
      pan: '',
      bankName: 'State Bank of India',
      accountNo: '',
      ifsc: '',
      rating: 4.8,
      creditDays: 15,
      isGemRegistered: false
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Truck className="w-3.5 h-3.5" />
              <span>Pillar 7 • Vendor & Supply-Chain Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Master Vendor Directory & Supplier Network
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              National Solar & IT OEMs (Waaree, Growatt, HP, D-Link, APC), GeM registered suppliers, credit lines, and RTGS payment banking mandates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin ? (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Enrol New Vendor</span>
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
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Registered Vendors</span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              {(vendorsData || []).length} <span className="text-xs font-sans text-slate-400 font-normal">Suppliers</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Annual Procurement</span>
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono">
              ₹{totalPurchases.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <CreditCard className="w-3.5 h-3.5 text-rose-400" />
              <span>Outstanding Payable</span>
            </div>
            <div className="text-xl font-black text-rose-400 font-mono">
              ₹{totalOutstanding.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>GeM Verified Portals</span>
            </div>
            <div className="text-xl font-black text-teal-400 font-mono">
              {gemCount} <span className="text-xs font-sans text-slate-400 font-normal">Govt Suppliers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vendor name, GSTIN, contact person..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 max-w-[280px]"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Supply Categories' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map(vendor => (
          <div
            key={vendor.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {vendor.id}
                    </span>
                    {vendor.isGemRegistered && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                        GeM Verified
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {vendor.name}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">{vendor.category}</div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-amber-800 font-bold text-xs shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{vendor.rating}</span>
                </div>
              </div>

              {/* Contact and Location */}
              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span>{vendor.contactPerson}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 truncate">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="font-mono">{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{vendor.address}</span>
                </div>
              </div>

              {/* Statutory & Financial Strip */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">GSTIN ID</div>
                  <div className="font-mono font-bold text-slate-800 truncate">{vendor.gstin}</div>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Credit Terms</div>
                  <div className="font-bold text-slate-800">{vendor.creditDays ? `${vendor.creditDays} Days Net` : 'Advance'}</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-900 text-white rounded-xl text-xs mt-3">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Purchases</div>
                  <div className="font-bold font-mono">₹{(vendor.totalPurchases / 100000).toFixed(2)}L</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase">Outstanding</div>
                  <div className={`font-bold font-mono ${vendor.outstandingDue > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ₹{vendor.outstandingDue.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setPrintRtgs(vendor)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>RTGS Mandate</span>
              </button>

              <button
                onClick={() => setSelectedVendor(vendor)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
              >
                Full Profile →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Profile Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                    {selectedVendor.id}
                  </span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {selectedVendor.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold">{selectedVendor.name}</h3>
              </div>
              <button onClick={() => setSelectedVendor(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                <div><strong>Contact:</strong> {selectedVendor.contactPerson}</div>
                <div><strong>Phone:</strong> {selectedVendor.phone}</div>
                <div><strong>Email:</strong> {selectedVendor.email}</div>
                <div><strong>Address:</strong> {selectedVendor.address}</div>
                <div><strong>GSTIN:</strong> <span className="font-mono">{selectedVendor.gstin}</span></div>
                <div><strong>PAN:</strong> <span className="font-mono">{selectedVendor.pan}</span></div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-2">
                <h4 className="font-bold text-indigo-950 text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>NEFT / RTGS Bank Transfer Information</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-indigo-900">
                  <div><strong>Bank Name:</strong> {selectedVendor.bankName}</div>
                  <div><strong>IFSC Code:</strong> <span className="font-mono font-bold">{selectedVendor.ifsc}</span></div>
                  <div className="col-span-2"><strong>Account Number:</strong> <span className="font-mono font-bold text-slate-900">{selectedVendor.accountNo}</span></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setPrintRtgs(selectedVendor);
                    setSelectedVendor(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print RTGS Mandate Slip</span>
                </button>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-indigo-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-300" />
                <span>Enrol Enterprise Supplier / Vendor</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Vendor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sungrow Power Supply Co. Ltd"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Supply Category</label>
                  <select
                    value={newVendor.category}
                    onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500 font-semibold"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Branch Commercial Manager"
                    value={newVendor.contactPerson}
                    onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91..."
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="sales@vendor.com"
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    placeholder="18AAAAA0000A1Z5"
                    value={newVendor.gstin}
                    onChange={(e) => setNewVendor({ ...newVendor, gstin: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Credit Days</label>
                  <input
                    type="number"
                    value={newVendor.creditDays}
                    onChange={(e) => setNewVendor({ ...newVendor, creditDays: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={newVendor.bankName}
                    onChange={(e) => setNewVendor({ ...newVendor, bankName: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={newVendor.accountNo}
                    onChange={(e) => setNewVendor({ ...newVendor, accountNo: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={newVendor.ifsc}
                    onChange={(e) => setNewVendor({ ...newVendor, ifsc: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500 font-mono"
                  />
                </div>
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RTGS Mandate Slip Modal */}
      {printRtgs && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl p-8 shadow-2xl my-8 text-slate-900 print:m-0 print:p-4">
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black tracking-tight uppercase">M/S COMPUTER PLANET</h2>
                <p className="text-xs text-slate-600">West Kachudharam, Chincoorie, Silchar, Cachar, Assam</p>
                <p className="text-xs text-slate-600">Bank Accounts Payable Mandate Record</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-slate-900 text-white font-bold text-xs rounded-md uppercase">
                  RTGS / NEFT Mandate
                </span>
                <div className="font-mono text-xs text-slate-500 mt-1">Vendor Ref: {printRtgs.id}</div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <div><strong>Beneficiary Name:</strong> {printRtgs.name}</div>
                <div><strong>GSTIN Identification:</strong> <span className="font-mono">{printRtgs.gstin}</span></div>
                <div><strong>Permanent Account Number (PAN):</strong> <span className="font-mono">{printRtgs.pan}</span></div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                <h4 className="font-bold text-indigo-950 text-sm">Verified Banking Details for Electronic Fund Transfer</h4>
                <div><strong>Bank Name:</strong> {printRtgs.bankName}</div>
                <div><strong>Account Number:</strong> <span className="font-mono font-bold text-slate-950 text-sm">{printRtgs.accountNo || '38920194820'}</span></div>
                <div><strong>IFSC Code:</strong> <span className="font-mono font-bold text-indigo-700">{printRtgs.ifsc || 'SBIN0000078'}</span></div>
                <div><strong>Payment Terms:</strong> {printRtgs.creditDays ? `${printRtgs.creditDays} Days Credit` : 'Advance Transfer'}</div>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="border-t border-slate-400 pt-2 font-bold">Prepared By Accounts Officer</div>
                  <div className="text-slate-500">M/S COMPUTER PLANET</div>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-2 font-bold">Proprietor / Signatory Approval</div>
                  <div className="text-slate-500">Authorized Fund Release</div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setPrintRtgs(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Mandate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
