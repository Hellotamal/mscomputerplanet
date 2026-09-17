import React, { useState } from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { 
  Server, 
  SunMedium, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  PhoneCall, 
  Calculator, 
  Cpu, 
  CheckCircle,
  BatteryCharging,
  TrendingDown
} from 'lucide-react';

export default function Hero({ onOpenQuote }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'it', 'solar'

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-brand-lightBlue/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-brand-emerald/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Interactive Mode Filter Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 rounded-full bg-slate-800/90 border border-slate-700/80 backdrop-blur-md shadow-lg">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition ${
                activeTab === 'all' 
                  ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dual Solution Overview
            </button>
            <button
              onClick={() => setActiveTab('it')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition ${
                activeTab === 'it' 
                  ? 'bg-sky-600 text-white shadow' 
                  : 'text-slate-400 hover:text-sky-300'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              IT & AMC Services
            </button>
            <button
              onClick={() => setActiveTab('solar')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition ${
                activeTab === 'solar' 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <SunMedium className="w-3.5 h-3.5" />
              Solar Clean Energy
            </button>
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Assam's Trusted Enterprise IT & Green Energy Specialist
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none mb-6">
            Empowering Your Business With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
              Reliable IT Infrastructure
            </span>{' '}
            &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-yellow-400">
              Sustainable Solar Power
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            <strong className="text-white font-semibold">M/S COMPUTER PLANET</strong> provides turnkey computer sales,
            certified hardware maintenance, 24/7 AMC support, and cutting-edge rooftop solar installations for government
            departments, banking networks, and commercial institutions across Silchar & Barak Valley.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onOpenQuote()}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-brand-lightBlue to-emerald-600 hover:from-sky-500 hover:to-emerald-500 shadow-lg shadow-sky-950/50 hover:shadow-sky-500/20 transform hover:-translate-y-0.5 transition active:translate-y-0"
            >
              <span>Request Instant Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#solar-calculator"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/60 transition"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Calculate Solar Savings</span>
            </a>

            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-slate-200 bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition"
            >
              <PhoneCall className="w-4 h-4 text-sky-400" />
              <span>Direct Call</span>
            </a>
          </div>
        </div>

        {/* Dual Cards Interactive Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Card 1: IT Solutions */}
          <div className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
            activeTab === 'all' || activeTab === 'it' 
              ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-sky-500/40 shadow-xl shadow-sky-950/50' 
              : 'opacity-40 bg-slate-900/40 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
                <Server className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Division 01 • IT Sales & Service
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Enterprise IT Maintenance & AMC
            </h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Complete hardware upkeep, rapid emergency response, structured networking, and dedicated manpower for zero-downtime office operations.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Multi-branch banking & postal computer maintenance</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Priority 2-4 hour emergency replacement buffer</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Commercial PC, server, and printer sales</span>
              </li>
            </ul>
            <a
              href="#services-it"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-sky-400 hover:text-sky-300 group"
            >
              <span>Explore IT Maintenance Plans</span>
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </a>
          </div>

          {/* Card 2: Renewable Solar Energy */}
          <div className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
            activeTab === 'all' || activeTab === 'solar' 
              ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-emerald-500/40 shadow-xl shadow-emerald-950/50' 
              : 'opacity-40 bg-slate-900/40 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <SunMedium className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Division 02 • Clean Green Energy
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Turnkey Solar Rooftop & Power Backup
            </h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Slash electricity tariffs and beat persistent grid power outages with high-grade solar PV modules, hybrid inverters, and battery storage.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>On-grid, hybrid & off-grid rooftop solar systems</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Heavy-duty solar inverters & lithium/tubular batteries</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Complete APDCL net-metering & subsidy guidance</span>
              </li>
            </ul>
            <a
              href="#services-solar"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 group"
            >
              <span>Explore Solar Energy Systems</span>
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">49+</div>
            <div className="text-xs text-slate-400 mt-1">Bank Branches Maintained</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">Up to 80%</div>
            <div className="text-xs text-slate-400 mt-1">Solar Electricity Savings</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">2-4 Hrs</div>
            <div className="text-xs text-slate-400 mt-1">Emergency On-site SLA</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">100%</div>
            <div className="text-xs text-slate-400 mt-1">MSME & GST Certified</div>
          </div>
        </div>
      </div>
    </section>
  );
}
