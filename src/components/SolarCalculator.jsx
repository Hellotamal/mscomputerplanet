import React, { useState } from 'react';
import { 
  Calculator, 
  Sun, 
  Zap, 
  IndianRupee, 
  TrendingUp, 
  Maximize2, 
  Sparkles, 
  Leaf,
  ArrowRight
} from 'lucide-react';

export default function SolarCalculator({ onOpenQuote }) {
  const [monthlyBill, setMonthlyBill] = useState(6000);
  const [propertyType, setPropertyType] = useState('commercial'); // 'residential' or 'commercial'

  // Calculations based on Northeast / Assam solar irradiance (~4.0 - 4.2 peak sun hours/day)
  // Average electricity unit cost: ~ ₹7.50 for residential, ~ ₹9.00 for commercial/institutional
  const unitRate = propertyType === 'commercial' ? 8.5 : 7.2;
  const estimatedUnitsPerMonth = Math.round(monthlyBill / unitRate);

  // 1 kW generates approx 115 units per month in Assam
  const calculatedKw = Math.max(1, Math.round((estimatedUnitsPerMonth / 115) * 2) / 2);
  
  // Required shadow-free roof area: ~ 90-100 sq ft per kW
  const roofAreaSqFt = Math.round(calculatedKw * 95);

  // Monthly generation from recommended solar system
  const monthlyGeneration = Math.round(calculatedKw * 115);

  // Estimated monthly savings (up to 85% of total bill)
  const monthlySavings = Math.min(monthlyBill, Math.round(monthlyGeneration * unitRate));
  const annualSavings = monthlySavings * 12;
  const lifetime25YrSavings = annualSavings * 25;

  // CO2 offset: ~ 1.3 metric tons per kW per year
  const co2OffsetTons = (calculatedKw * 1.3).toFixed(1);

  return (
    <section id="solar-calculator" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-1/2 -right-48 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-20 bottom-10 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            Interactive Solar ROI Tool
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Calculate Your Solar Capacity & Monthly Savings
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Estimate the ideal rooftop solar photovoltaic capacity, required roof area, and total savings
            tailored for homes, banks, post offices, and businesses in Assam.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-8 backdrop-blur flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span>Input Your Power Parameters</span>
              </h3>

              {/* Property Type Toggle */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Installation Category
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setPropertyType('commercial')}
                    className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition ${
                      propertyType === 'commercial'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bank / Commercial
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropertyType('residential')}
                    className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition ${
                      propertyType === 'residential'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Residential / Home
                  </button>
                </div>
              </div>

              {/* Monthly Bill Slider */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Average Monthly Electricity Bill
                  </label>
                  <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                    ₹{monthlyBill.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="60000"
                  step="500"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
                  <span>₹1,500</span>
                  <span>₹25,000</span>
                  <span>₹60,000+</span>
                </div>
              </div>

              {/* Estimated Units Tag */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 mb-6">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Estimated Monthly Consumption:</span>
                  <span className="font-bold text-white font-mono">{estimatedUnitsPerMonth} kWh (Units)</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                  <span>Assam Tariff Model:</span>
                  <span className="font-mono">₹{unitRate}/unit (approx)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/60">
              <button
                onClick={() => onOpenQuote({
                  serviceName: `Rooftop Solar ${calculatedKw} kW System`,
                  category: 'Solar Energy',
                  notes: `Calculated requirements: ${calculatedKw} kW system, ~${roofAreaSqFt} sq ft rooftop area for monthly bill of ₹${monthlyBill}.`
                })}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-950 transition"
              >
                <span>Request Custom Quote for {calculatedKw} kW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Metric 1: Recommended System Size */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-850 p-6 rounded-2xl border border-emerald-500/30 flex flex-col justify-between shadow-card">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                    Recommended Capacity
                  </span>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Sun className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white mb-1">
                  {calculatedKw} <span className="text-xl text-emerald-400 font-sans">kWp</span>
                </div>
                <p className="text-xs text-slate-300">
                  Tier-1 Mono PERC or TOPCon Bifacial Solar Module array.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400">
                Generates ~{monthlyGeneration} units/month
              </div>
            </div>

            {/* Metric 2: Required Roof Area */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-850 p-6 rounded-2xl border border-sky-500/30 flex flex-col justify-between shadow-card">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-sky-400">
                    Rooftop Space Needed
                  </span>
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white mb-1">
                  ~{roofAreaSqFt} <span className="text-xl text-sky-400 font-sans">Sq. Ft.</span>
                </div>
                <p className="text-xs text-slate-300">
                  Unshaded terrace, metal shed or RCC roof area.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400">
                Galvanized rust-proof elevated structures
              </div>
            </div>

            {/* Metric 3: Estimated Monthly & Annual Savings */}
            <div className="bg-gradient-to-br from-emerald-950/70 to-slate-900 p-6 rounded-2xl border border-emerald-500/40 flex flex-col justify-between shadow-card">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                    Estimated Monthly Savings
                  </span>
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-300 mb-1">
                  ₹{monthlySavings.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-slate-300">
                  Save up to <strong className="text-white">₹{annualSavings.toLocaleString('en-IN')}</strong> per year on your power bill.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-emerald-400 font-medium">
                Slashes peak grid tariff charges
              </div>
            </div>

            {/* Metric 4: Lifetime 25-Year Savings & Green Impact */}
            <div className="bg-gradient-to-br from-teal-950/70 to-slate-900 p-6 rounded-2xl border border-teal-500/40 flex flex-col justify-between shadow-card">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-teal-400">
                    25-Year Lifetime Savings
                  </span>
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-teal-300 mb-1">
                  ₹{(lifetime25YrSavings / 100000).toFixed(2)} <span className="text-xl font-sans">Lakhs</span>
                </div>
                <p className="text-xs text-slate-300">
                  Offset ~{co2OffsetTons} metric tons of carbon emissions annually.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-teal-400 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-teal-400" />
                <span>Equivalent to planting ~{Math.round(calculatedKw * 60)} trees</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subsidy Note */}
        <div className="mt-8 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-400 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Government Subsidy & Net-Metering:</strong> Residential installations may be eligible
            for Central Financial Assistance (CFA) under the PM Surya Ghar Scheme. We assist you with complete APDCL net-metering paperwork and grid commissioning.
          </span>
        </div>
      </div>
    </section>
  );
}
