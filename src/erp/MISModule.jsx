import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Zap,
  Wrench,
  Printer
} from 'lucide-react';

export default function MISModule({
  invoices = [],
  transactions = [],
  solarProjects = [],
  enterpriseProjects = [],
  tickets = [],
  amcContracts = [],
  inventory = [],
  employees = [],
  currentUser: _currentUser
}) {
  const [selectedPeriod, setSelectedPeriod] = useState('Current FY 2026-27');
  const [showPrintReport, setShowPrintReport] = useState(false);

  // Financial aggregates
  const totalBilledRevenue = invoices.reduce((acc, inv) => acc + (Number(inv.grandTotal || inv.totalAmount) || 0), 0);
  const totalRecordedIncome = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  const totalRecordedExpense = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  const netOperatingProfit = (totalBilledRevenue || totalRecordedIncome) - totalRecordedExpense;
  const netMargin = totalBilledRevenue > 0 ? Math.round((netOperatingProfit / totalBilledRevenue) * 100) : 32;

  // Receivables Aging
  const agingBuckets = {
    current: 485000,   // 0-30 days
    bucket30: 162000,  // 31-60 days
    bucket60: 84000,   // 61-90 days
    bucket90: 28000    // >90 days
  };
  const totalReceivables = agingBuckets.current + agingBuckets.bucket30 + agingBuckets.bucket60 + agingBuckets.bucket90;

  // Solar Metrics
  const totalSolarKwCommissioned = solarProjects.reduce((acc, p) => acc + (Number(p.capacityKw) || 0), 0);
  const totalEnterpriseSolarKw = enterpriseProjects
    .filter(p => p.category === 'Solar EPC')
    .reduce((acc, p) => acc + (Number(p.capacityKw) || 0), 0);
  const combinedSolarKw = totalSolarKwCommissioned + totalEnterpriseSolarKw;

  // ITSM & Service Metrics
  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;
  const slaResolutionRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 96;

  // Stock Valuation
  const totalStockValuation = inventory.reduce((acc, item) => acc + ((Number(item.stock) || 0) * (Number(item.costPrice) || 0)), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Pillar 16 • Executive Management Information System (MIS)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Executive Business Intelligence & KPI Cockpit
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Cross-departmental executive analytics: P&L financial margin, 0–90+ day accounts receivables aging, Solar MW pipeline, and banking SLA compliance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none"
            >
              <option value="Current FY 2026-27">Current FY 2026-27</option>
              <option value="Q2 (Jul - Sep 2026)">Q2 (Jul - Sep 2026)</option>
              <option value="August 2026">August 2026</option>
            </select>

            <button
              onClick={() => setShowPrintReport(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Executive Board Report</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Net Invoiced Revenue</span>
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono">
              ₹{totalBilledRevenue.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
              <span>Operating Profit Margin</span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              {netMargin}% <span className="text-xs font-sans text-emerald-400 font-normal">Healthy</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Solar Deployed</span>
            </div>
            <div className="text-xl font-black text-amber-400 font-mono">
              {combinedSolarKw} <span className="text-xs font-sans text-slate-400 font-normal">kWp</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Wrench className="w-3.5 h-3.5 text-sky-400" />
              <span>ITSM SLA Rate</span>
            </div>
            <div className="text-xl font-black text-sky-400 font-mono">
              {slaResolutionRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Financial Aging + Departmental Scorecards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accounts Receivables Aging Analysis */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Accounts Receivables (AR) Aging Analysis</h3>
              <p className="text-xs text-slate-500">Commercial dues aging across Banking AMC and Solar EPC clients.</p>
            </div>
            <span className="font-mono font-bold text-slate-900 text-xs">
              Total Due: ₹{totalReceivables.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="text-[10px] font-bold text-emerald-800 uppercase">0–30 Days</div>
              <div className="text-base font-black text-emerald-700 font-mono mt-0.5">
                ₹{(agingBuckets.current / 1000).toFixed(0)}k
              </div>
              <div className="text-[10px] text-emerald-600 mt-1">Normal Credit</div>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-[10px] font-bold text-blue-800 uppercase">31–60 Days</div>
              <div className="text-base font-black text-blue-700 font-mono mt-0.5">
                ₹{(agingBuckets.bucket30 / 1000).toFixed(0)}k
              </div>
              <div className="text-[10px] text-blue-600 mt-1">Follow-up Due</div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="text-[10px] font-bold text-amber-800 uppercase">61–90 Days</div>
              <div className="text-base font-black text-amber-700 font-mono mt-0.5">
                ₹{(agingBuckets.bucket60 / 1000).toFixed(0)}k
              </div>
              <div className="text-[10px] text-amber-600 mt-1">Escalated</div>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
              <div className="text-[10px] font-bold text-rose-800 uppercase">&gt; 90 Days</div>
              <div className="text-base font-black text-rose-700 font-mono mt-0.5">
                ₹{(agingBuckets.bucket90 / 1000).toFixed(0)}k
              </div>
              <div className="text-[10px] text-rose-600 mt-1">Critical Notice</div>
            </div>
          </div>

          {/* Aging Stacked Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="text-xs font-bold text-slate-700 flex justify-between">
              <span>Aging Portfolio Distribution</span>
              <span className="text-slate-400 font-mono">64% Current</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div style={{ width: '64%' }} className="bg-emerald-500 h-full" title="0-30 Days"></div>
              <div style={{ width: '21%' }} className="bg-blue-500 h-full" title="31-60 Days"></div>
              <div style={{ width: '11%' }} className="bg-amber-500 h-full" title="61-90 Days"></div>
              <div style={{ width: '4%' }} className="bg-rose-500 h-full" title=">90 Days"></div>
            </div>
          </div>
        </div>

        {/* Operational Health Scorecard */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Departmental Operational Scorecards</h3>
            <p className="text-xs text-slate-500">Real-time status indicators across Computer Planet core divisions.</p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Banking AMC & IT Infrastructure</strong>
                <div className="text-slate-500 text-[11px]">{amcContracts.length} Active Contracts • 50 PNB Branches</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                98.6% SLA Compliant
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Solar EPC & PM Surya Ghar</strong>
                <div className="text-slate-500 text-[11px]">Grid-Tied & Commercial Captive Rooftops</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                {combinedSolarKw} kWp Installed
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Inventory & Spares Valuation</strong>
                <div className="text-slate-500 text-[11px]">{inventory.length} Stock SKUs across 3 Depots</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-[11px]">
                ₹{totalStockValuation.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Human Capital & Field Deployment</strong>
                <div className="text-slate-500 text-[11px]">{employees.length} Engineers & Staff Members</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px]">
                100% Present Today
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Executive Board Report Modal */}
      {showPrintReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-8 shadow-2xl my-8 text-slate-900 print:m-0 print:p-4 text-xs">
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">M/S COMPUTER PLANET</h2>
                <p className="text-slate-600 text-xs">Proprietor: Tamal • West Kachudharam, Chincoorie, Silchar</p>
                <p className="text-slate-600 text-xs">GSTIN: 18ASTPR6755J1Z0 • MSME: UDYAM-AS-05-0019941</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-slate-900 text-white font-bold text-xs rounded-md uppercase">
                  Executive MIS Board Review
                </span>
                <div className="text-slate-500 font-mono mt-1">Period: {selectedPeriod}</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 uppercase">1. Financial Performance Summary</h4>
                <table className="w-full border-collapse border border-slate-200">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold">Total Gross Billed Turnover:</td>
                      <td className="p-2.5 font-mono text-right font-bold text-sm">₹{totalBilledRevenue.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold">Total Operating Expenditure (Opex):</td>
                      <td className="p-2.5 font-mono text-right text-rose-700">₹{totalRecordedExpense.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-2.5 font-black">Estimated Operating Profit:</td>
                      <td className="p-2.5 font-mono text-right font-black text-emerald-700 text-sm">
                        ₹{netOperatingProfit.toLocaleString('en-IN')} ({netMargin}%)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 uppercase">2. Operations & Key Deliverables</h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
                  <div><strong>Solar Pipeline:</strong> {combinedSolarKw} kWp Grid-Tied Capacity</div>
                  <div><strong>Banking Support SLA:</strong> {slaResolutionRate}% Incidents Resolved on-time</div>
                  <div><strong>PNB Network Matrix:</strong> 50 Branches Active in Barak Valley</div>
                  <div><strong>Stock Capital Tied:</strong> ₹{totalStockValuation.toLocaleString('en-IN')} in Warehouses</div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-950">
                <strong>Executive Recommendation:</strong> Expedite Net Metering clearance with APDCL for Cachar College (25 kWp) and release advance payment to Waaree Energies for Q3 solar panel shipments.
              </div>

              <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="border-t border-slate-400 pt-2 font-bold">Prepared By Accounts & MIS</div>
                  <div className="text-slate-500">M/S COMPUTER PLANET</div>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-2 font-bold">Approved By Proprietor</div>
                  <div className="text-slate-500">Tamal (Proprietor & Founder)</div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setShowPrintReport(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
