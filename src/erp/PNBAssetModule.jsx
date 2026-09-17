import React, { useState } from 'react';
import { PNB_BRANCH_ASSETS, PNB_SUMMARY_METRICS } from '../data/pnbAssetData';
import { 
  Landmark, 
  Search, 
  Printer, 
  Download, 
  Monitor, 
  Receipt, 
  Scan, 
  CheckCircle, 
  Filter,
  FileSpreadsheet
} from 'lucide-react';

export default function PNBAssetModule() {
  const [search, setSearch] = useState('');
  const [beFilter, setBeFilter] = useState('All');

  const filteredBranches = PNB_BRANCH_ASSETS.filter(b => {
    const matchesSearch = b.branchName.toLowerCase().includes(search.toLowerCase()) ||
      b.solId.includes(search);
    const matchesBe = beFilter === 'All' || b.be === beFilter;
    return matchesSearch && matchesBe;
  });

  // Calculate totals for currently filtered rows
  const currentTotals = filteredBranches.reduce((acc, b) => ({
    desktop: acc.desktop + b.desktop,
    passbook: acc.passbook + b.passbook,
    laserjet: acc.laserjet + b.laserjet,
    scanner: acc.scanner + b.scanner,
    hsScanner: acc.hsScanner + b.hsScanner,
    cashReceipt: acc.cashReceipt + b.cashReceipt,
    total: acc.total + b.total
  }), { desktop: 0, passbook: 0, laserjet: 0, scanner: 0, hsScanner: 0, cashReceipt: 0, total: 0 });

  const handleExportCSV = () => {
    const headers = ["Sl.No", "BE", "Branch Name", "Sol ID", "Desktop", "Passbook", "Laserjet Printer", "Scanner", "High Speed Scanner", "Cash Receipt Printer", "Total Assets"];
    const rows = PNB_BRANCH_ASSETS.map(b => [
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
          <div class="header">
            <h2>PUNJAB NATIONAL BANK - CIRCLE OFFICE SILCHAR</h2>
            <h4>Branchwise Total Hardware Asset Counts (M/S COMPUTER PLANET AMC Support)</h4>
            <div>Coverage: Silchar, Cachar, Hailakandi, Karimganj, Dima Hasao (50 Locations)</div>
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
              ${PNB_BRANCH_ASSETS.map(b => `
                <tr>
                  <td class="text-center">${b.slNo}</td>
                  <td>${b.be}</td>
                  <td><strong>${b.branchName}</strong></td>
                  <td class="text-center">${b.solId}</td>
                  <td class="text-right">${b.desktop}</td>
                  <td class="text-right">${b.passbook}</td>
                  <td class="text-right">${b.laserjet}</td>
                  <td class="text-right">${b.scanner}</td>
                  <td class="text-right">${b.hsScanner}</td>
                  <td class="text-right">${b.cashReceipt}</td>
                  <td class="text-right"><strong>${b.total}</strong></td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="4" class="text-center">GRAND TOTAL (50 LOCATIONS)</td>
                <td class="text-right">${PNB_SUMMARY_METRICS.desktops}</td>
                <td class="text-right">${PNB_SUMMARY_METRICS.passbookPrinters}</td>
                <td class="text-right">${PNB_SUMMARY_METRICS.laserjetPrinters}</td>
                <td class="text-right">${PNB_SUMMARY_METRICS.scanners}</td>
                <td class="text-right">${PNB_SUMMARY_METRICS.highSpeedScanners}</td>
                <td class="text-right">${PNB_SUMMARY_METRICS.cashReceiptPrinters}</td>
                <td class="text-right">${PNB_SUMMARY_METRICS.totalAssets}</td>
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

        <div className="flex gap-2.5 shrink-0">
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
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition"
            title="Print Official Asset Sheet"
          >
            <Printer className="w-4 h-4" />
            <span>Print Asset Register</span>
          </button>
        </div>
      </div>

      {/* 7 Summary Hardware Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Assets</div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{PNB_SUMMARY_METRICS.totalAssets}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">50 Locations</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Desktops</div>
          <div className="text-2xl font-black text-sky-900 font-mono mt-1">{PNB_SUMMARY_METRICS.desktops}</div>
          <div className="text-[10px] text-sky-700 font-medium mt-0.5">Workstations</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">LaserJet</div>
          <div className="text-2xl font-black text-indigo-900 font-mono mt-1">{PNB_SUMMARY_METRICS.laserjetPrinters}</div>
          <div className="text-[10px] text-indigo-700 font-medium mt-0.5">Heavy Duty</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Passbook</div>
          <div className="text-2xl font-black text-amber-900 font-mono mt-1">{PNB_SUMMARY_METRICS.passbookPrinters}</div>
          <div className="text-[10px] text-amber-700 font-medium mt-0.5">Dot-Matrix</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700">HS Scanners</div>
          <div className="text-2xl font-black text-purple-900 font-mono mt-1">{PNB_SUMMARY_METRICS.highSpeedScanners}</div>
          <div className="text-[10px] text-purple-700 font-medium mt-0.5">High Speed</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Flat Scanners</div>
          <div className="text-2xl font-black text-rose-900 font-mono mt-1">{PNB_SUMMARY_METRICS.scanners}</div>
          <div className="text-[10px] text-rose-700 font-medium mt-0.5">Flatbed</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Cash Receipt</div>
          <div className="text-2xl font-black text-emerald-900 font-mono mt-1">{PNB_SUMMARY_METRICS.cashReceiptPrinters}</div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Teller Printers</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search branch name or Sol ID (e.g. Karimganj, 003620)..."
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
                <th className="py-3 px-3 text-center">#</th>
                <th className="py-3 px-3">BE</th>
                <th className="py-3 px-4">Branch Name</th>
                <th className="py-3 px-3 text-center">Sol ID</th>
                <th className="py-3 px-3 text-right">Desktop</th>
                <th className="py-3 px-3 text-right">Passbook</th>
                <th className="py-3 px-3 text-right">LaserJet</th>
                <th className="py-3 px-3 text-right">Scanner</th>
                <th className="py-3 px-3 text-right">HS Scan</th>
                <th className="py-3 px-3 text-right">Cash Rcpt</th>
                <th className="py-3 px-4 text-right font-black text-slate-900">Total Assets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBranches.map((b) => (
                <tr key={b.slNo} className="hover:bg-slate-50/80 transition">
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
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
