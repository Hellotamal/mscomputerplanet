import React, { useState, useEffect } from 'react';
import { PNB_BRANCH_ASSETS } from '../data/pnbAssetData';
import { loadErpData, saveErpData } from './erpStorage';
import { getCompanyPrintHeaderHtml } from '../data/companyLogo';
import { escapeHtml } from './erpSecurity';
import { 
  Landmark, 
  Search, 
  Printer, 
  Download, 
  Plus,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

export default function PNBAssetModule() {
  const [branches, setBranches] = useState(() => loadErpData("pnb_assets", PNB_BRANCH_ASSETS));
  const [search, setSearch] = useState('');
  const [beFilter, setBeFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const [branchForm, setBranchForm] = useState({
    be: 'E-UNI',
    branchName: '',
    solId: '',
    desktop: 0,
    passbook: 1,
    laserjet: 1,
    scanner: 0,
    hsScanner: 1,
    cashReceipt: 1
  });

  // Persist whenever branches change
  useEffect(() => {
    saveErpData("pnb_assets", branches);
  }, [branches]);

  const filteredBranches = branches.filter(b => {
    const matchesSearch = b.branchName.toLowerCase().includes(search.toLowerCase()) ||
      b.solId.includes(search);
    const matchesBe = beFilter === 'All' || b.be === beFilter;
    return matchesSearch && matchesBe;
  });

  // Overall totals across all branches
  const grandTotals = branches.reduce((acc, b) => ({
    desktop: acc.desktop + Number(b.desktop || 0),
    passbook: acc.passbook + Number(b.passbook || 0),
    laserjet: acc.laserjet + Number(b.laserjet || 0),
    scanner: acc.scanner + Number(b.scanner || 0),
    hsScanner: acc.hsScanner + Number(b.hsScanner || 0),
    cashReceipt: acc.cashReceipt + Number(b.cashReceipt || 0),
    total: acc.total + Number(b.total || 0)
  }), { desktop: 0, passbook: 0, laserjet: 0, scanner: 0, hsScanner: 0, cashReceipt: 0, total: 0 });

  // Filtered totals
  const currentTotals = filteredBranches.reduce((acc, b) => ({
    desktop: acc.desktop + Number(b.desktop || 0),
    passbook: acc.passbook + Number(b.passbook || 0),
    laserjet: acc.laserjet + Number(b.laserjet || 0),
    scanner: acc.scanner + Number(b.scanner || 0),
    hsScanner: acc.hsScanner + Number(b.hsScanner || 0),
    cashReceipt: acc.cashReceipt + Number(b.cashReceipt || 0),
    total: acc.total + Number(b.total || 0)
  }), { desktop: 0, passbook: 0, laserjet: 0, scanner: 0, hsScanner: 0, cashReceipt: 0, total: 0 });

  const handleCreateBranch = (e) => {
    e.preventDefault();
    if (!branchForm.branchName || !branchForm.solId) {
      alert('Please provide Branch Name and Sol ID.');
      return;
    }

    const desktop = Number(branchForm.desktop) || 0;
    const passbook = Number(branchForm.passbook) || 0;
    const laserjet = Number(branchForm.laserjet) || 0;
    const scanner = Number(branchForm.scanner) || 0;
    const hsScanner = Number(branchForm.hsScanner) || 0;
    const cashReceipt = Number(branchForm.cashReceipt) || 0;
    const total = desktop + passbook + laserjet + scanner + hsScanner + cashReceipt;

    const created = {
      slNo: branches.length + 1,
      be: branchForm.be,
      branchName: branchForm.branchName.toUpperCase(),
      solId: branchForm.solId,
      desktop,
      passbook,
      laserjet,
      scanner,
      hsScanner,
      cashReceipt,
      total
    };

    setBranches([...branches, created]);
    setShowAddModal(false);
    resetForm();
  };

  const handleStartEdit = (b) => {
    setEditingBranch(b);
    setBranchForm({ ...b });
  };

  const handleUpdateBranch = (e) => {
    e.preventDefault();
    const desktop = Number(branchForm.desktop) || 0;
    const passbook = Number(branchForm.passbook) || 0;
    const laserjet = Number(branchForm.laserjet) || 0;
    const scanner = Number(branchForm.scanner) || 0;
    const hsScanner = Number(branchForm.hsScanner) || 0;
    const cashReceipt = Number(branchForm.cashReceipt) || 0;
    const total = desktop + passbook + laserjet + scanner + hsScanner + cashReceipt;

    setBranches(branches.map(b => b.solId === editingBranch.solId ? {
      ...branchForm,
      slNo: editingBranch.slNo,
      branchName: branchForm.branchName.toUpperCase(),
      desktop,
      passbook,
      laserjet,
      scanner,
      hsScanner,
      cashReceipt,
      total
    } : b));

    setEditingBranch(null);
    resetForm();
  };

  const handleDeleteBranch = (solId, branchName) => {
    if (window.confirm(`Are you sure you want to remove PNB Branch: ${branchName} (Sol ID: ${solId}) from AMC records?`)) {
      setBranches(branches.filter(b => b.solId !== solId).map((b, idx) => ({ ...b, slNo: idx + 1 })));
    }
  };

  const resetForm = () => {
    setBranchForm({
      be: 'E-UNI',
      branchName: '',
      solId: '',
      desktop: 0,
      passbook: 1,
      laserjet: 1,
      scanner: 0,
      hsScanner: 1,
      cashReceipt: 1
    });
  };

  const handleExportCSV = () => {
    const headers = ["Sl.No", "BE", "Branch Name", "Sol ID", "Desktop", "Passbook", "Laserjet Printer", "Scanner", "High Speed Scanner", "Cash Receipt Printer", "Total Assets"];
    const rows = branches.map(b => [
      b.slNo,
      `"${b.be}"`,
      `"${b.branchName}"`,
      `"${b.solId}"`,
      b.desktop,
      b.passbook,
      b.laserjet,
      b.scanner,
      b.hsScanner,
      b.cashReceipt,
      b.total
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PNB_Silchar_Circle_Assets_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePrintSheet = () => {
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html>
        <head>
          <title>PNB Circle Office Silchar - Branchwise Total Asset Counts</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; color: #1e293b; font-size: 11px; }
            h2, h4 { margin: 0; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left; }
            th { background: #f1f5f9; font-weight: bold; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .total-row { background: #e2e8f0; font-weight: bold; font-size: 12px; }
          </style>
        </head>
        <body>
          ${getCompanyPrintHeaderHtml({
            documentTitle: 'PUNJAB NATIONAL BANK - CIRCLE OFFICE SILCHAR',
            rightBadgeText: `${branches.length} LOCATIONS`,
            rightBadgeSubtext: 'AMC ASSET REGISTER'
          })}
          <div style="text-align: center; font-size: 11px; color: #475569; margin-bottom: 12px; font-weight: 500;">
            Branchwise Hardware Asset Matrix under M/S COMPUTER PLANET Comprehensive AMC Support<br/>
            Coverage: Silchar, Cachar, Hailakandi, Karimganj, Dima Hasao Circles
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 4%;">#</th>
                <th style="width: 6%;">BE</th>
                <th>Branch Name</th>
                <th style="width: 10%;">Sol ID</th>
                <th class="text-right">Desktop</th>
                <th class="text-right">Passbook</th>
                <th class="text-right">LaserJet</th>
                <th class="text-right">Scanner</th>
                <th class="text-right">HS Scan</th>
                <th class="text-right">Cash Rcpt</th>
                <th class="text-right">Total Assets</th>
              </tr>
            </thead>
            <tbody>
              ${branches.map(b => `
                <tr>
                  <td class="text-center">${escapeHtml(b.slNo)}</td>
                  <td>${escapeHtml(b.be)}</td>
                  <td><strong>${escapeHtml(b.branchName)}</strong></td>
                  <td class="text-center">${escapeHtml(b.solId)}</td>
                  <td class="text-right">${Number(b.desktop) || 0}</td>
                  <td class="text-right">${Number(b.passbook) || 0}</td>
                  <td class="text-right">${Number(b.laserjet) || 0}</td>
                  <td class="text-right">${Number(b.scanner) || 0}</td>
                  <td class="text-right">${Number(b.hsScanner) || 0}</td>
                  <td class="text-right">${Number(b.cashReceipt) || 0}</td>
                  <td class="text-right"><strong>${Number(b.total) || 0}</strong></td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="4" class="text-center">GRAND TOTAL (${branches.length} LOCATIONS)</td>
                <td class="text-right">${grandTotals.desktop}</td>
                <td class="text-right">${grandTotals.passbook}</td>
                <td class="text-right">${grandTotals.laserjet}</td>
                <td class="text-right">${grandTotals.scanner}</td>
                <td class="text-right">${grandTotals.hsScanner}</td>
                <td class="text-right">${grandTotals.cashReceipt}</td>
                <td class="text-right">${grandTotals.total}</td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top: 30px; display: flex; justify-content: space-between;">
            <div>AMC Maintenance Partner: <strong>M/S COMPUTER PLANET</strong></div>
            <div>Authorized PNB IT Circle Representative</div>
          </div>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    printWin.print();
  };

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
            <Landmark className="w-4 h-4" />
            <span>Official Banking Contract Asset Register</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            PNB Circle Office - SILCHAR
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Branchwise Hardware Assets Under Active Maintenance by M/S Computer Planet.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Branch</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
            title="Download CSV Spreadsheet"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintSheet}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
            title="Print Official Asset Sheet"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>Print Register</span>
          </button>
        </div>
      </div>

      {/* 7 Summary Hardware Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2.5 sm:gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">Total Assets</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1">{grandTotals.total}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">{branches.length} Locations</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sky-700 truncate">Desktops</div>
          <div className="text-xl sm:text-2xl font-black text-sky-900 font-mono mt-1">{grandTotals.desktop}</div>
          <div className="text-[10px] text-sky-700 font-medium mt-0.5">Workstations</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 truncate">LaserJet</div>
          <div className="text-xl sm:text-2xl font-black text-indigo-900 font-mono mt-1">{grandTotals.laserjet}</div>
          <div className="text-[10px] text-indigo-700 font-medium mt-0.5">Printers</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 truncate">Passbook</div>
          <div className="text-xl sm:text-2xl font-black text-amber-900 font-mono mt-1">{grandTotals.passbook}</div>
          <div className="text-[10px] text-amber-700 font-medium mt-0.5">Printers</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700 truncate">HS Scanners</div>
          <div className="text-xl sm:text-2xl font-black text-purple-900 font-mono mt-1">{grandTotals.hsScanner}</div>
          <div className="text-[10px] text-purple-700 font-medium mt-0.5">High Speed</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700 truncate">Flat Scanners</div>
          <div className="text-xl sm:text-2xl font-black text-rose-900 font-mono mt-1">{grandTotals.scanner}</div>
          <div className="text-[10px] text-rose-700 font-medium mt-0.5">Flatbed</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 truncate">Cash Receipt</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-900 font-mono mt-1">{grandTotals.cashReceipt}</div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Teller Printers</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search branch name or Sol ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold">Entity Filter:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            {['All', 'E-UNI', 'PNB-1', 'CO SIL'].map(be => (
              <button
                key={be}
                onClick={() => setBeFilter(be)}
                className={`px-3 py-1 rounded-lg transition ${
                  beFilter === be ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                }`}
              >
                {be}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Branch Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 text-center whitespace-nowrap">#</th>
                <th className="py-3 px-3 whitespace-nowrap">BE</th>
                <th className="py-3 px-4 whitespace-nowrap">Branch Name</th>
                <th className="py-3 px-3 text-center whitespace-nowrap">Sol ID</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Desktop</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Passbook</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">LaserJet</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Scanner</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">HS Scan</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Cash Rcpt</th>
                <th className="py-3 px-4 text-right font-black text-slate-900 whitespace-nowrap">Total</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBranches.map((b) => (
                <tr key={b.solId} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-xs">{b.slNo}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                      {b.be}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">{b.branchName}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-xs text-slate-600">{b.solId}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{b.desktop}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{b.passbook}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{b.laserjet}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{b.scanner}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{b.hsScanner}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{b.cashReceipt}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-700">
                    {b.total}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartEdit(b)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        title="Edit Branch Asset Counts"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBranch(b.solId, b.branchName)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                        title="Remove Branch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td colSpan="4" className="py-3 px-4 text-center">
                  FILTERED TOTALS ({filteredBranches.length} LOCATIONS)
                </td>
                <td className="py-3 px-3 text-right font-mono">{currentTotals.desktop}</td>
                <td className="py-3 px-3 text-right font-mono">{currentTotals.passbook}</td>
                <td className="py-3 px-3 text-right font-mono">{currentTotals.laserjet}</td>
                <td className="py-3 px-3 text-right font-mono">{currentTotals.scanner}</td>
                <td className="py-3 px-3 text-right font-mono">{currentTotals.hsScanner}</td>
                <td className="py-3 px-3 text-right font-mono">{currentTotals.cashReceipt}</td>
                <td className="py-3 px-4 text-right font-mono font-black text-emerald-800 text-base">
                  {currentTotals.total}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Add / Edit Branch Modal */}
      {(showAddModal || editingBranch) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingBranch ? `Edit PNB Branch: ${editingBranch.branchName}` : 'Add New PNB Branch Location'}
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); setEditingBranch(null); }} 
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingBranch ? handleUpdateBranch : handleCreateBranch} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Entity (BE)</label>
                  <select
                    value={branchForm.be}
                    onChange={(e) => setBranchForm({ ...branchForm, be: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="E-UNI">E-UNI</option>
                    <option value="PNB-1">PNB-1</option>
                    <option value="CO SIL">CO SIL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sol ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 074320"
                    value={branchForm.solId}
                    onChange={(e) => setBranchForm({ ...branchForm, solId: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Branch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SILCHAR MAIN"
                  value={branchForm.branchName}
                  onChange={(e) => setBranchForm({ ...branchForm, branchName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                />
              </div>

              {/* Hardware Counters */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Hardware Device Counts
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Desktops</label>
                    <input
                      type="number"
                      min="0"
                      value={branchForm.desktop}
                      onChange={(e) => setBranchForm({ ...branchForm, desktop: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">LaserJet Printers</label>
                    <input
                      type="number"
                      min="0"
                      value={branchForm.laserjet}
                      onChange={(e) => setBranchForm({ ...branchForm, laserjet: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Passbook Printers</label>
                    <input
                      type="number"
                      min="0"
                      value={branchForm.passbook}
                      onChange={(e) => setBranchForm({ ...branchForm, passbook: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Cash Receipt Printers</label>
                    <input
                      type="number"
                      min="0"
                      value={branchForm.cashReceipt}
                      onChange={(e) => setBranchForm({ ...branchForm, cashReceipt: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">High Speed Scanners</label>
                    <input
                      type="number"
                      min="0"
                      value={branchForm.hsScanner}
                      onChange={(e) => setBranchForm({ ...branchForm, hsScanner: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Flatbed Scanners</label>
                    <input
                      type="number"
                      min="0"
                      value={branchForm.scanner}
                      onChange={(e) => setBranchForm({ ...branchForm, scanner: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingBranch(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-500"
                >
                  {editingBranch ? 'Save Branch Changes' : 'Add Branch Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
