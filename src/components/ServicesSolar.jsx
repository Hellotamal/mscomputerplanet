import React from 'react';
import { SOLAR_SERVICES } from '../data/productsServices';
import { 
  SunMedium, 
  BatteryCharging, 
  Compass, 
  Droplets, 
  ShieldAlert, 
  FileSpreadsheet,
  CheckCircle2, 
  ArrowRight,
  Calculator,
  Leaf,
  Sun,
  IndianRupee,
  Lightbulb
} from 'lucide-react';

const iconMap = {
  SunMedium,
  BatteryCharging,
  Compass,
  Droplets,
  ShieldAlert,
  FileSpreadsheet
};

export default function ServicesSolar({ onOpenQuote }) {
  return (
    <section id="services-solar" className="py-20 bg-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <SunMedium className="w-3.5 h-3.5 text-emerald-600" />
            Division 02: Renewable Clean Energy • Omnis Trades EPC Partner
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Next-Gen Rooftop Solar & Clean Power Solutions
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            As the official Channel & Solar EPC Consultant Partner of <strong className="text-slate-900">Omnis Trades</strong>, 
            we eliminate reliance on erratic power grids, reduce electricity bills by up to 80%, facilitate PM Surya Ghar central subsidies up to ₹78,000, 
            and deliver turnkey on-grid, off-grid, and hybrid solar installations across Silchar, Cachar, Karimganj, and Hailakandi.
          </p>
        </div>

        {/* 6 Core Solar Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {SOLAR_SERVICES.map((srv) => {
            const Icon = iconMap[srv.icon] || SunMedium;
            return (
              <div
                key={srv.id}
                className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-card hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2.5 group-hover:text-emerald-600 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {srv.description}
                  </p>

                  <div className="border-t border-slate-200/80 pt-4 mb-5">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                      Highlights & Standards:
                    </div>
                    <ul className="space-y-2">
                      {srv.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onOpenQuote({ serviceName: srv.title, category: 'Solar Energy' })}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    <span>Get Solar Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight Banner: Solar Advantages */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-4">
              <Leaf className="w-3.5 h-3.5" />
              Green Energy Transformation
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-3">
              Ready to Lower Your Electricity Bill and Go Solar?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We handle the entire process from structural rooftop survey, APDCL net-metering approvals, 
              Tier-1 bifacial panels, to heavy-duty solar battery backups for uninterrupted branch and home operations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
            <a
              href="#solar-calculator"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg"
            >
              <Calculator className="w-4 h-4" />
              <span>Use Solar Calculator</span>
            </a>
            <button
              onClick={() => onOpenQuote({ serviceName: 'Site Survey & Solar Assessment', category: 'Solar Energy' })}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold border border-emerald-400/50 hover:bg-emerald-800/50 text-white transition"
            >
              <span>Book Free Site Survey</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
