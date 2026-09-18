import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  X, 
  Edit2, 
  Trash2,
  Package,
  Building2,
  ArrowRightLeft,
  DollarSign,
  Download,
  Barcode,
  Lock
} from 'lucide-react';

export default function InventoryModule({ inventory, setInventory, isAdmin = false, currentUser: _currentUser = null }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [activeSubTab, setActiveSubTab] = useState('items'); // 'items' | 'transfers' | 'serials'
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [itemForm, setItemForm] = useState({
    name: '',
    category: 'IT Hardware',
    stock: 10,
    minStock: 4,
    costPrice: 1000,
    sellPrice: 1400,
    location: 'Central Depot - Shelf A-1',
    warehouse: 'Silchar Central Depot',
    serialPrefix: 'CP-IT'
  });

  const [transferForm, setTransferForm] = useState({
    itemId: inventory[0]?.id || 'INV-001',
    fromWarehouse: 'Silchar Central Depot',
    toWarehouse: 'Guwahati Transit Hub',
    qty: 2,
    stnNumber: 'STN-2026-019',
    remarks: 'Field engineer spare buffer'
  });

  const categories = ['All', 'IT Hardware', 'Networking', 'Solar Energy', 'Security / CCTV'];
  const warehouses = ['All', 'Silchar Central Depot', 'Guwahati Transit Hub', 'Site Field Stock'];

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesWarehouse = selectedWarehouse === 'All' || 
      (item.warehouse ? item.warehouse === selectedWarehouse : (selectedWarehouse === 'Silchar Central Depot'));
    return matchesSearch && matchesCategory && matchesWarehouse;
  });

  const totalCostValuation = inventory.reduce((acc, item) => acc + (item.stock * item.costPrice), 0);
  const totalSellValuation = inventory.reduce((acc, item) => acc + (item.stock * item.sellPrice), 0);
  const lowStockItems = inventory.filter(item => item.stock <= item.minStock);

  const adjustStock = (id, delta) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can adjust inventory stock levels.');
      return;
    }
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.stock + delta);
        return { ...item, stock: newStock };
      }
      return item;
    }));
  };

  const handleCreateItem = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can add items to inventory.');
      return;
    }
    if (!itemForm.name) {
      alert('Please provide item name.');
      return;
    }

    const created = {
      ...itemForm,
      id: `INV-00${inventory.length + 1}`,
      stock: Number(itemForm.stock) || 0,
      minStock: Number(itemForm.minStock) || 0,
      costPrice: Number(itemForm.costPrice) || 0,
      sellPrice: Number(itemForm.sellPrice) || 0
    };

    setInventory([...inventory, created]);
    setShowAddModal(false);
    resetForm();
  };

  const handleStartEdit = (item) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can modify inventory items.');
      return;
    }
    setEditingItem(item);
    setItemForm({ 
      ...item,
      warehouse: item.warehouse || 'Silchar Central Depot',
      serialPrefix: item.serialPrefix || 'CP-IT'
    });
  };

  const handleUpdateItem = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can update inventory items.');
      return;
    }
    setInventory(inventory.map(item => item.id === editingItem.id ? {
      ...itemForm,
      id: editingItem.id,
      stock: Number(itemForm.stock) || 0,
      minStock: Number(itemForm.minStock) || 0,
      costPrice: Number(itemForm.costPrice) || 0,
      sellPrice: Number(itemForm.sellPrice) || 0
    } : item));
    setEditingItem(null);
    resetForm();
  };

  const handleDeleteItem = (id, name) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can remove inventory items.');
      return;
    }
    if (window.confirm(`Are you sure you want to remove item "${name}" (${id}) from inventory?`)) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  const handleStockTransfer = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can execute stock transfers.');
      return;
    }
    const item = inventory.find(i => i.id === transferForm.itemId);
    if (!item) return;

    if (item.stock < transferForm.qty) {
      alert(`Insufficient stock in ${transferForm.fromWarehouse}. Only ${item.stock} available.`);
      return;
    }

    alert(`Stock Transfer Note ${transferForm.stnNumber} executed! Transferred ${transferForm.qty} units of "${item.name}" to ${transferForm.toWarehouse}.`);
    setShowTransferModal(false);
  };

  const resetForm = () => {
    setItemForm({
      name: '',
      category: 'IT Hardware',
      stock: 10,
      minStock: 4,
      costPrice: 1000,
      sellPrice: 1400,
      location: 'Central Depot - Shelf A-1',
      warehouse: 'Silchar Central Depot',
      serialPrefix: 'CP-IT'
    });
  };

  const exportInventoryCsv = () => {
    const headers = ["Item ID", "Item Name", "Category", "Warehouse", "Location", "Stock", "Min Stock", "Cost Price", "Sell Price", "Valuation"];
    const rows = filteredItems.map(i => [
      i.id,
      `"${i.name.replace(/"/g, '""')}"`,
      i.category,
      `"${i.warehouse || 'Silchar Central Depot'}"`,
      `"${i.location}"`,
      i.stock,
      i.minStock,
      i.costPrice,
      i.sellPrice,
      i.stock * i.costPrice
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `mcp_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with KPIs */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Package className="w-3.5 h-3.5" />
              <span>Pillar 6 • Inventory, Multi-Warehouse & Material Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Warehouse Inventory & Spares Management
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Multi-depot tracking (Silchar Central Depot, Guwahati Transit Hub, Site Field Stock), minimum order levels, and Stock Transfer Notes (STN).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
                >
                  <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                  <span>Stock Transfer (STN)</span>
                </button>
                <button
                  onClick={() => { resetForm(); setEditingItem(null); setShowAddModal(true); }}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Stock Item</span>
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
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cost Valuation</span>
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono">
              ₹{totalCostValuation.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Package className="w-3.5 h-3.5 text-teal-400" />
              <span>Retail Value</span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              ₹{totalSellValuation.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Low Stock Alerts</span>
            </div>
            <div className="text-xl font-black text-amber-400 font-mono">
              {lowStockItems.length} <span className="text-xs font-sans text-slate-400 font-normal">Reorder SKUs</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Active Warehouses</span>
            </div>
            <div className="text-xl font-black text-sky-400 font-mono">
              3 <span className="text-xs font-sans text-slate-400 font-normal">Locations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveSubTab('items')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'items' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory Master ({inventory.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('serials')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'serials' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Barcode className="w-3.5 h-3.5" />
            <span>Serial & Batch Tracking</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SKU name, shelf, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-emerald-500"
            />
          </div>

          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            {warehouses.map(w => <option key={w} value={w}>{w === 'All' ? 'All Warehouses' : w}</option>)}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
          </select>

          <button
            onClick={exportInventoryCsv}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            title="Export Inventory CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Items Table */}
      {activeSubTab === 'items' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="p-3.5 font-bold">Item Description</th>
                  <th className="p-3.5 font-bold">Category</th>
                  <th className="p-3.5 font-bold">Warehouse & Bin</th>
                  <th className="p-3.5 font-bold text-center">Stock Level</th>
                  <th className="p-3.5 font-bold text-right">Cost Price</th>
                  <th className="p-3.5 font-bold text-right">Selling Price</th>
                  <th className="p-3.5 font-bold text-right">Valuation</th>
                  <th className="p-3.5 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map(item => {
                  const isLow = item.stock <= item.minStock;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="font-mono text-[11px] text-slate-400">{item.id}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-slate-100 text-slate-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-800 font-medium">{item.warehouse || 'Silchar Central Depot'}</div>
                        <div className="text-slate-400 text-[10px]">{item.location}</div>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {isAdmin && (
                            <button
                              onClick={() => adjustStock(item.id, -1)}
                              className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold flex items-center justify-center"
                              title="Decrease stock"
                            >
                              -
                            </button>
                          )}
                          <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                            isLow ? 'bg-amber-100 text-amber-800' : 'text-slate-800'
                          }`}>
                            {item.stock}
                          </span>
                          {isAdmin && (
                            <button
                              onClick={() => adjustStock(item.id, 1)}
                              className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold flex items-center justify-center"
                              title="Increase stock"
                            >
                              +
                            </button>
                          )}
                        </div>
                        {isLow && (
                          <div className="text-[10px] text-amber-600 font-bold mt-0.5">Min: {item.minStock}</div>
                        )}
                      </td>
                      <td className="p-3.5 text-right font-mono">₹{item.costPrice.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-right font-mono">₹{item.sellPrice.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-emerald-700">
                        ₹{(item.stock * item.costPrice).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-center">
                        {isAdmin ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                              title="Edit SKU"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Remove SKU"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md">
                            <Lock className="w-3 h-3 text-slate-400" /> Locked
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Serial Number & Batch Tracking SubTab */}
      {activeSubTab === 'serials' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Serial Number & Warranty Tag Matrix</h3>
              <p className="text-xs text-slate-500">Track high-value Solar Inverters, MikroTik Routers, and SMPS units by serial numbers.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-2">
            {filteredItems.slice(0, 6).map((item, idx) => (
              <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">{item.name}</div>
                <div className="font-mono text-slate-500 text-[11px]">Batch ID: BAT-2026-0{idx + 1}</div>
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Sample Active Serials:</div>
                  <div className="font-mono text-[11px] text-teal-700 font-semibold bg-white p-2 rounded border border-slate-200/80">
                    SN-2026-{item.id.replace('INV-', '')}01 • SN-2026-{item.id.replace('INV-', '')}02 • SN-2026-{item.id.replace('INV-', '')}03
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingItem ? 'Edit Inventory Item' : 'Add New Inventory SKU'}
              </h3>
              <button onClick={() => { setShowAddModal(false); setEditingItem(null); }} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingItem ? handleUpdateItem : handleCreateItem} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Item / SKU Description *</label>
                <input
                  type="text"
                  required
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-emerald-500 font-semibold"
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Warehouse Depot</label>
                  <select
                    value={itemForm.warehouse}
                    onChange={(e) => setItemForm({ ...itemForm, warehouse: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-emerald-500 font-semibold"
                  >
                    {warehouses.filter(w => w !== 'All').map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shelf / Bin Location</label>
                  <input
                    type="text"
                    value={itemForm.location}
                    onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Stock Count</label>
                  <input
                    type="number"
                    min="0"
                    value={itemForm.stock}
                    onChange={(e) => setItemForm({ ...itemForm, stock: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reorder Level</label>
                  <input
                    type="number"
                    min="1"
                    value={itemForm.minStock}
                    onChange={(e) => setItemForm({ ...itemForm, minStock: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={itemForm.costPrice}
                    onChange={(e) => setItemForm({ ...itemForm, costPrice: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sell Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={itemForm.sellPrice}
                    onChange={(e) => setItemForm({ ...itemForm, sellPrice: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingItem(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20"
                >
                  {editingItem ? 'Save Changes' : 'Save SKU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Transfer Modal (STN) */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-teal-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-teal-300" />
                <span>Issue Stock Transfer Note (STN)</span>
              </h3>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockTransfer} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Item *</label>
                <select
                  value={transferForm.itemId}
                  onChange={(e) => setTransferForm({ ...transferForm, itemId: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500 font-semibold"
                >
                  {inventory.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.name} (Stock: {i.stock} in {i.warehouse || 'Central Depot'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Source Warehouse</label>
                  <select
                    value={transferForm.fromWarehouse}
                    onChange={(e) => setTransferForm({ ...transferForm, fromWarehouse: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500 font-semibold"
                  >
                    {warehouses.filter(w => w !== 'All').map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination Warehouse</label>
                  <select
                    value={transferForm.toWarehouse}
                    onChange={(e) => setTransferForm({ ...transferForm, toWarehouse: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500 font-semibold"
                  >
                    {warehouses.filter(w => w !== 'All').map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transfer Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={transferForm.qty}
                    onChange={(e) => setTransferForm({ ...transferForm, qty: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">STN Dispatch Number</label>
                  <input
                    type="text"
                    value={transferForm.stnNumber}
                    onChange={(e) => setTransferForm({ ...transferForm, stnNumber: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Transfer Purpose / Remarks</label>
                <input
                  type="text"
                  value={transferForm.remarks}
                  onChange={(e) => setTransferForm({ ...transferForm, remarks: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-md shadow-teal-600/20"
                >
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
