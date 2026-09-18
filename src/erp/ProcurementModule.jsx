import React, { useState } from 'react';
import {
  ShoppingCart,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Printer,
  X,
  Package,
  TrendingDown,
  Building2,
  Layers,
  Lock
} from 'lucide-react';

export default function ProcurementModule({
  procurementData,
  setProcurementData,
  inventory,
  setInventory,
  currentUser: _currentUser,
  isAdmin = false
}) {
  const [activeTab, setActiveTab] = useState('pos'); // 'pos' | 'requisitions' | 'rfqs' | 'grns'
  const [search, setSearch] = useState('');
  const [selectedPo, setSelectedPo] = useState(null);
  const [showAddPoModal, setShowAddPoModal] = useState(false);
  const [showAddPrModal, setShowAddPrModal] = useState(false);
  const [showAddGrnModal, setShowAddGrnModal] = useState(false);

  // New PO Form State
  const [newPo, setNewPo] = useState({
    vendor: 'Waaree Energies Limited (Guwahati Regional Depot)',
    vendorGstin: '18AABBW1234D1Z5',
    itemDesc: 'Waaree 540W Mono PERC Bifacial Solar Modules',
    qty: 20,
    rate: 12100,
    gstRate: 12,
    deliveryLocation: 'Silchar Central Depot, West Kachudharam',
    paymentTerms: '50% Advance with PO, 50% Against Dispatch LR Copy'
  });

  // New PR Form State
  const [newPr, setNewPr] = useState({
    project: 'Stock Buffer - Silchar Central Depot',
    requestedBy: 'Debashis Roy (Engineer)',
    items: 'MikroTik RB750Gr3 Gigabit Routers (Qty: 10)',
    estimatedValue: 45000,
    urgency: 'High'
  });

  // New GRN Form State
  const [newGrn, setNewGrn] = useState({
    poId: procurementData?.purchaseOrders?.[0]?.id || 'PO-2026-081',
    receivedQty: 10,
    acceptedQty: 10,
    rejectedQty: 0,
    qcInspector: 'Debashis Roy (Hardware Tech)',
    qcRemarks: 'All units inspected and pass quality check.',
    warehouseLocation: 'Central Depot Silchar, Shelf A-1'
  });

  const { requisitions = [], rfqs = [], purchaseOrders = [], grns = [] } = procurementData || {};

  // Financial Summaries
  const totalPoValue = purchaseOrders.reduce((acc, po) => acc + (Number(po.grandTotal) || 0), 0);
  const pendingPrCount = requisitions.filter(pr => pr.status === 'Pending Approval').length;
  const activePoCount = purchaseOrders.filter(po => po.status !== 'Delivered & Inspected').length;

  const handleCreatePo = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can issue Purchase Orders.');
      return;
    }
    const subtotal = Number(newPo.qty) * Number(newPo.rate);
    const gstAmount = Math.round((subtotal * Number(newPo.gstRate)) / 100);
    const grandTotal = subtotal + gstAmount;

    const created = {
      id: `PO-2026-${String(purchaseOrders.length + 84).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      vendor: newPo.vendor,
      vendorGstin: newPo.vendorGstin,
      items: [
        {
          desc: newPo.itemDesc,
          qty: Number(newPo.qty),
          rate: Number(newPo.rate),
          gstRate: Number(newPo.gstRate),
          total: grandTotal
        }
      ],
      subtotal,
      gstAmount,
      grandTotal,
      deliveryLocation: newPo.deliveryLocation,
      paymentTerms: newPo.paymentTerms,
      status: 'Approved',
      grnRef: null
    };

    setProcurementData({
      ...procurementData,
      purchaseOrders: [created, ...purchaseOrders]
    });
    setShowAddPoModal(false);
  };

  const handleCreatePr = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can raise Purchase Requisitions.');
      return;
    }
    const created = {
      id: `PR-2026-${String(requisitions.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      project: newPr.project,
      requestedBy: newPr.requestedBy,
      items: newPr.items,
      estimatedValue: Number(newPr.estimatedValue),
      urgency: newPr.urgency,
      status: 'Pending Approval',
      poGenerated: null
    };

    setProcurementData({
      ...procurementData,
      requisitions: [created, ...requisitions]
    });
    setShowAddPrModal(false);
  };

  const handleCreateGrn = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can generate Goods Receipt Notes (GRN).');
      return;
    }
    const matchedPo = purchaseOrders.find(p => p.id === newGrn.poId);
    const created = {
      id: `GRN-2026-${String(grns.length + 43).padStart(3, '0')}`,
      poId: newGrn.poId,
      receiptDate: new Date().toISOString().split('T')[0],
      vendor: matchedPo ? matchedPo.vendor : 'Verified Supplier',
      receivedQty: Number(newGrn.receivedQty),
      acceptedQty: Number(newGrn.acceptedQty),
      rejectedQty: Number(newGrn.rejectedQty),
      qcInspector: newGrn.qcInspector,
      qcRemarks: newGrn.qcRemarks,
      warehouseLocation: newGrn.warehouseLocation,
      status: 'Verified & Stock Added'
    };

    // Auto-update PO status
    const updatedPos = purchaseOrders.map(p => {
      if (p.id === newGrn.poId) {
        return { ...p, status: 'Delivered & Inspected', grnRef: created.id };
      }
      return p;
    });

    // Auto-add stock to inventory if matched
    if (inventory && setInventory && matchedPo?.items?.[0]) {
      const itemDesc = matchedPo.items[0].desc.toLowerCase();
      const existing = inventory.find(i => itemDesc.includes(i.name.toLowerCase().slice(0, 10)));
      if (existing) {
        setInventory(inventory.map(inv => 
          inv.id === existing.id ? { ...inv, stock: inv.stock + Number(newGrn.acceptedQty) } : inv
        ));
      }
    }

    setProcurementData({
      ...procurementData,
      purchaseOrders: updatedPos,
      grns: [created, ...grns]
    });
    setShowAddGrnModal(false);
    alert(`GRN ${created.id} generated successfully. ${newGrn.acceptedQty} items verified and staged in warehouse.`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Pillar 5 • Procurement & Purchasing Lifecycle</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Enterprise Procurement & PO Management
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              End-to-end purchasing: Site Requisitions (PR), L1/L2/L3 RFQ Bidding, GST Purchase Orders, and QC Goods Receipt Notes (GRN).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setShowAddPrModal(true)}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Raise Requisition (PR)</span>
                </button>
                <button
                  onClick={() => setShowAddPoModal(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Purchase Order (PO)</span>
                </button>
              </>
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
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Total PO Value Issued</span>
            </div>
            <div className="text-xl font-black text-blue-400 font-mono">
              ₹{totalPoValue.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
              <span>Active Orders</span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              {activePoCount} <span className="text-xs font-sans text-slate-400 font-normal">POs Pending GRN</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Pending PR Requisitions</span>
            </div>
            <div className="text-xl font-black text-amber-400 font-mono">
              {pendingPrCount} <span className="text-xs font-sans text-slate-400 font-normal">Awaiting Review</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Package className="w-3.5 h-3.5 text-teal-400" />
              <span>GRNs Inspected</span>
            </div>
            <div className="text-xl font-black text-teal-400 font-mono">
              {grns.length} <span className="text-xs font-sans text-slate-400 font-normal">Inward Lots</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('pos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'pos' ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Purchase Orders (POs) ({purchaseOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('requisitions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'requisitions' ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Site Requisitions (PR) ({requisitions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rfqs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'rfqs' ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>L1/L2/L3 RFQ Comparison ({rfqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('grns')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'grns' ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Goods Receipt Notes (GRN) ({grns.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PO, Vendor, Item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-blue-500"
            />
          </div>

          {activeTab === 'grns' && (
            <button
              onClick={() => setShowAddGrnModal(true)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Inward GRN</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Purchase Orders (PO) */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {purchaseOrders
              .filter(po => 
                po.id.toLowerCase().includes(search.toLowerCase()) ||
                po.vendor.toLowerCase().includes(search.toLowerCase())
              )
              .map(po => (
                <div
                  key={po.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {po.id}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{po.date}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          po.status === 'Delivered & Inspected' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {po.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{po.vendor}</span>
                      </h4>
                      <div className="text-[11px] text-slate-500 font-mono">GSTIN: {po.vendorGstin}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400">Grand Total (Incl. GST)</div>
                      <div className="text-lg font-black text-slate-900 font-mono">
                        ₹{po.grandTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="bg-slate-50 rounded-xl p-3 text-xs divide-y divide-slate-200/80">
                    {po.items.map((item, idx) => (
                      <div key={idx} className="py-1.5 flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <strong className="text-slate-800">{item.desc}</strong>
                          <div className="text-[10px] text-slate-500">Qty: {item.qty} @ ₹{item.rate.toLocaleString('en-IN')} + {item.gstRate}% GST</div>
                        </div>
                        <span className="font-mono font-bold text-slate-900 shrink-0">
                          ₹{item.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="text-slate-500 truncate max-w-[280px]">
                      <strong>Payment:</strong> {po.paymentTerms}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPo(po)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>View Official PO</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Quick PO Summary / Status Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Purchasing Verification Policy</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-blue-900">
                  <strong>3-Way Matching Mandate:</strong> Payment vouchers for accounts department require PO Number + Verified GRN receipt copy + Vendor GST Invoice matching.
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Avg Supplier Lead Time:</span>
                    <strong className="text-slate-800 font-mono">3.4 Days</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Solar Panel Rate (Wp):</span>
                    <strong className="text-teal-700 font-mono">₹22.40 / Wp</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Standard Payment Terms:</span>
                    <strong className="text-slate-800">Net 15 / 30 Days</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <h4 className="font-bold text-sm text-indigo-300">Fast Inward Receipt (GRN)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Has a delivery vehicle arrived at Central Silchar Depot or project site? Record Goods Receipt Note to automatically update SKU stock.
              </p>
              <button
                onClick={() => setShowAddGrnModal(true)}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Inspect & Receive Goods
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Site Requisitions (PR) */}
      {activeTab === 'requisitions' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Site & Maintenance Requisitions (PR)</h3>
              <p className="text-xs text-slate-500">Material requests raised by site engineers for project deployment or depot buffer stock.</p>
            </div>
            <button
              onClick={() => setShowAddPrModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise Requisition</span>
            </button>
          </div>

          <div className="divide-y divide-slate-200 text-xs">
            {requisitions.map(pr => (
              <div key={pr.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {pr.id}
                    </span>
                    <span className="font-mono text-slate-400">{pr.date}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      pr.urgency === 'Urgent' ? 'bg-rose-100 text-rose-800' :
                      pr.urgency === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {pr.urgency} Priority
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      pr.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {pr.status}
                    </span>
                  </div>
                  <div className="font-bold text-slate-800 text-sm">{pr.items}</div>
                  <div className="text-slate-500">Project / Site: <strong className="text-slate-700">{pr.project}</strong> • Requested by: <strong>{pr.requestedBy}</strong></div>
                </div>

                <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <div>
                    <div className="text-[11px] text-slate-400">Est. Budget</div>
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      ₹{pr.estimatedValue.toLocaleString('en-IN')}
                    </div>
                  </div>
                  {pr.poGenerated ? (
                    <span className="text-[11px] text-emerald-600 font-mono font-bold">
                      PO: {pr.poGenerated}
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setNewPo({
                          ...newPo,
                          itemDesc: pr.items,
                          rate: pr.estimatedValue
                        });
                        setShowAddPoModal(true);
                      }}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition"
                    >
                      Convert to PO →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: L1/L2/L3 RFQ Comparison */}
      {activeTab === 'rfqs' && (
        <div className="space-y-6">
          {rfqs.map(rfq => (
            <div key={rfq.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {rfq.id}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{rfq.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                      {rfq.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{rfq.itemDescription}</h4>
                </div>
                <div className="text-xs text-slate-500">
                  Selected Supplier: <strong className="text-emerald-700">{rfq.selectedVendor}</strong>
                </div>
              </div>

              {/* Bidding Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600">
                      <th className="p-3 rounded-l-xl font-bold">Vendor Name</th>
                      <th className="p-3 font-bold">Quoted Unit Rate</th>
                      <th className="p-3 font-bold">Delivery Lead Time</th>
                      <th className="p-3 font-bold">Bidding Rank</th>
                      <th className="p-3 rounded-r-xl font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rfq.vendors.map((v, i) => (
                      <tr key={i} className={v.isL1 ? 'bg-emerald-50/50 font-semibold' : ''}>
                        <td className="p-3 text-slate-900">{v.name}</td>
                        <td className="p-3 font-mono">₹{v.quotePrice.toLocaleString('en-IN')}</td>
                        <td className="p-3">{v.leadDays} Days to Silchar</td>
                        <td className="p-3">
                          {v.isL1 ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-black">
                              L-1 (Lowest Bid)
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">L-{i + 1}</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {v.isL1 && (
                            <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Recommended
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Goods Receipt Notes (GRN) */}
      {activeTab === 'grns' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Goods Receipt & QC Inspection Notes (GRN)</h3>
              <p className="text-xs text-slate-500">Every inward receipt logs serial validation, QC checks, and automatically syncs with central warehouse stock.</p>
            </div>
            <button
              onClick={() => setShowAddGrnModal(true)}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record GRN</span>
            </button>
          </div>

          <div className="divide-y divide-slate-200 text-xs">
            {grns.map(grn => (
              <div key={grn.id} className="p-4 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {grn.id}
                    </span>
                    <span className="font-mono text-slate-400">Against {grn.poId}</span>
                    <span className="text-slate-400">• {grn.receiptDate}</span>
                    <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[10px]">
                      {grn.status}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    Warehouse: <strong className="text-slate-800">{grn.warehouseLocation}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Supplier</span>
                    <div className="font-bold text-slate-800 truncate">{grn.vendor}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Quantity Verification</span>
                    <div className="font-bold text-slate-800">
                      Recv: <span className="font-mono">{grn.receivedQty}</span> • Acc: <span className="font-mono text-emerald-600">{grn.acceptedQty}</span> • Rej: <span className="font-mono text-rose-600">{grn.rejectedQty}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">QC Inspector & Remarks</span>
                    <div className="text-slate-700 truncate">
                      <strong>{grn.qcInspector}:</strong> {grn.qcRemarks}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Purchase Order (PO) Modal */}
      {selectedPo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-8 shadow-2xl my-8 text-slate-900 print:m-0 print:p-4">
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black tracking-tight uppercase">M/S COMPUTER PLANET</h2>
                <p className="text-xs text-slate-600">West Kachudharam, Chincoorie, Silchar, Cachar, Assam - 788001</p>
                <p className="text-xs text-slate-600">GSTIN: 18ASTPR6755J1Z0 • MSME: UDYAM-AS-05-0019941</p>
                <p className="text-xs text-slate-600">Email: computerplanet.silchar@gmail.com • Ph: +91 86380 83712</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-md uppercase">
                  Official Purchase Order
                </span>
                <div className="font-mono text-sm font-black text-slate-900 mt-1">{selectedPo.id}</div>
                <div className="text-xs text-slate-500 font-mono">Date: {selectedPo.date}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs mb-6">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Supplier Details</div>
                <div className="font-bold text-slate-900 text-sm">{selectedPo.vendor}</div>
                <div className="font-mono text-slate-600 mt-0.5">GSTIN: {selectedPo.vendorGstin}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Delivery Destination</div>
                <div className="font-bold text-slate-900">{selectedPo.deliveryLocation}</div>
                <div className="text-slate-600 mt-0.5">Payment Terms: {selectedPo.paymentTerms}</div>
              </div>
            </div>

            <div className="mb-6">
              <table className="w-full border-collapse border border-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-left">
                    <th className="p-2 border border-slate-200">#</th>
                    <th className="p-2 border border-slate-200">Item Description</th>
                    <th className="p-2 border border-slate-200 text-right">Qty</th>
                    <th className="p-2 border border-slate-200 text-right">Unit Rate</th>
                    <th className="p-2 border border-slate-200 text-right">GST %</th>
                    <th className="p-2 border border-slate-200 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPo.items.map((item, i) => (
                    <tr key={i}>
                      <td className="p-2 border border-slate-200 font-mono">{i + 1}</td>
                      <td className="p-2 border border-slate-200 font-medium">{item.desc}</td>
                      <td className="p-2 border border-slate-200 text-right font-mono">{item.qty}</td>
                      <td className="p-2 border border-slate-200 text-right font-mono">₹{item.rate.toLocaleString('en-IN')}</td>
                      <td className="p-2 border border-slate-200 text-right font-mono">{item.gstRate}%</td>
                      <td className="p-2 border border-slate-200 text-right font-mono font-bold">
                        ₹{item.total.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" className="p-2 text-right font-bold border border-slate-200">Subtotal:</td>
                    <td className="p-2 text-right font-mono font-bold border border-slate-200">₹{selectedPo.subtotal.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="p-2 text-right font-bold border border-slate-200">CGST + SGST:</td>
                    <td className="p-2 text-right font-mono font-bold border border-slate-200">₹{selectedPo.gstAmount.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-slate-100 text-sm">
                    <td colSpan="5" className="p-2 text-right font-black border border-slate-200">Grand Total:</td>
                    <td className="p-2 text-right font-mono font-black text-blue-700 border border-slate-200">
                      ₹{selectedPo.grandTotal.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 mb-8">
              <strong>Terms & Conditions:</strong> Goods must be dispatched along with E-Way Bill and warranty cards. Defective or non-compliant lots will be quarantined on delivery.
            </div>

            <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <div className="border-t border-slate-400 pt-2 font-bold">Supplier Acceptance Signature</div>
                <div className="text-slate-500">{selectedPo.vendor}</div>
              </div>
              <div>
                <div className="border-t border-slate-400 pt-2 font-bold">Authorized Signatory</div>
                <div className="text-slate-500">M/S COMPUTER PLANET</div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setSelectedPo(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Purchase Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add PO Modal */}
      {showAddPoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-blue-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-300" />
                <span>Issue New Purchase Order (PO)</span>
              </h3>
              <button onClick={() => setShowAddPoModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePo} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Supplier / Vendor *</label>
                <input
                  type="text"
                  required
                  value={newPo.vendor}
                  onChange={(e) => setNewPo({ ...newPo, vendor: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vendor GSTIN</label>
                  <input
                    type="text"
                    value={newPo.vendorGstin}
                    onChange={(e) => setNewPo({ ...newPo, vendorGstin: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Item Description *</label>
                  <input
                    type="text"
                    required
                    value={newPo.itemDesc}
                    onChange={(e) => setNewPo({ ...newPo, itemDesc: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newPo.qty}
                    onChange={(e) => setNewPo({ ...newPo, qty: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit Rate (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={newPo.rate}
                    onChange={(e) => setNewPo({ ...newPo, rate: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GST Rate (%)</label>
                  <select
                    value={newPo.gstRate}
                    onChange={(e) => setNewPo({ ...newPo, gstRate: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-blue-500 font-semibold"
                  >
                    <option value="12">12% (Solar Panels/Inverters)</option>
                    <option value="18">18% (IT Hardware/Routers)</option>
                    <option value="28">28% (Batteries/Air Conditioning)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Delivery Destination</label>
                <input
                  type="text"
                  value={newPo.deliveryLocation}
                  onChange={(e) => setNewPo({ ...newPo, deliveryLocation: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Commercial Payment Terms</label>
                <input
                  type="text"
                  value={newPo.paymentTerms}
                  onChange={(e) => setNewPo({ ...newPo, paymentTerms: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddPoModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-600/20"
                >
                  Generate Official PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add PR Modal */}
      {showAddPrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Raise Site Purchase Requisition (PR)</h3>
              <button onClick={() => setShowAddPrModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePr} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project / Site Name</label>
                <input
                  type="text"
                  required
                  value={newPr.project}
                  onChange={(e) => setNewPr({ ...newPr, project: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Requested Items & Quantities</label>
                <textarea
                  rows="2"
                  required
                  value={newPr.items}
                  onChange={(e) => setNewPr({ ...newPr, items: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Value (₹)</label>
                  <input
                    type="number"
                    value={newPr.estimatedValue}
                    onChange={(e) => setNewPr({ ...newPr, estimatedValue: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Urgency Level</label>
                  <select
                    value={newPr.urgency}
                    onChange={(e) => setNewPr({ ...newPr, urgency: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-blue-500 font-semibold"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent (Breakdown)</option>
                  </select>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddPrModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Inward GRN Modal */}
      {showAddGrnModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-teal-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-300" />
                <span>Record Goods Receipt Note (GRN)</span>
              </h3>
              <button onClick={() => setShowAddGrnModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateGrn} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Link to Purchase Order (PO)</label>
                <select
                  value={newGrn.poId}
                  onChange={(e) => setNewGrn({ ...newGrn, poId: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500 font-mono font-semibold"
                >
                  {purchaseOrders.map(po => (
                    <option key={po.id} value={po.id}>
                      {po.id} - {po.vendor} (₹{po.grandTotal.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Received Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={newGrn.receivedQty}
                    onChange={(e) => setNewGrn({ ...newGrn, receivedQty: Number(e.target.value), acceptedQty: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">QC Accepted</label>
                  <input
                    type="number"
                    min="0"
                    value={newGrn.acceptedQty}
                    onChange={(e) => setNewGrn({ ...newGrn, acceptedQty: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500 font-mono text-emerald-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">QC Rejected</label>
                  <input
                    type="number"
                    min="0"
                    value={newGrn.rejectedQty}
                    onChange={(e) => setNewGrn({ ...newGrn, rejectedQty: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500 font-mono text-rose-700 font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">QC Inspecting Engineer</label>
                  <input
                    type="text"
                    value={newGrn.qcInspector}
                    onChange={(e) => setNewGrn({ ...newGrn, qcInspector: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Warehouse Staging Location</label>
                  <input
                    type="text"
                    value={newGrn.warehouseLocation}
                    onChange={(e) => setNewGrn({ ...newGrn, warehouseLocation: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Quality Inspection Remarks</label>
                <input
                  type="text"
                  value={newGrn.qcRemarks}
                  onChange={(e) => setNewGrn({ ...newGrn, qcRemarks: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddGrnModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-md shadow-teal-600/20"
                >
                  Verify QC & Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
