import React from 'react';
import { IT_SERVICES, KEY_BENEFITS } from '../data/productsServices';
import { 
  Cpu, 
  Terminal, 
  Headset, 
  Zap, 
  Network, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  PiggyBank,
  Gauge,
  HeartHandshake,
  SlidersHorizontal,
  UserCheck
} from 'lucide-react';

const iconMap = {
  Cpu,
  Terminal,
  Headset,
  Zap,
  Network,
  Users,
  PiggyBank,
  Gauge,
  ShieldCheck,
  HeartHandshake,
  SlidersHorizontal,
  UserCheck
};

export default function ServicesIT({ onOpenQuote }) {
  return (
    <section id="services-it" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5 text-sky-600" />
            Division 01: IT Infrastructure & Support
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Comprehensive IT Hardware Maintenance & AMC Services
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            From multi-branch banking networks to corporate offices in Silchar, we deliver proactive maintenance,
            rapid fault repair, dedicated manpower, and emergency SLA response to keep your operations running seamlessly.
          </p>
        </div>

        {/* 6 Core IT Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {IT_SERVICES.map((srv) => {
            const Icon = iconMap[srv.icon] || Cpu;
            return (
              <div
                key={srv.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-card hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2.5 group-hover:text-sky-600 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {srv.description}
                  </p>

                  <div className="border-t border-slate-100 pt-4 mb-5">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                      Key Deliverables:
                    </div>
                    <ul className="space-y-2">
                      {srv.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => onOpenQuote({ serviceName: srv.title, category: 'IT Support & AMC' })}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-sky-700 bg-sky-50 hover:bg-sky-600 hover:text-white transition-colors"
                >
                  <span>Request Proposal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Why Choose Computer Planet for IT */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mb-8">
            <h3 className="text-2xl sm:text-3xl font-black mb-3">
              Why Government & Banking Institutions Rely on Computer Planet
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              With a proven track record maintaining 49+ branches of Punjab National Bank and multiple regional post offices,
              we ensure strict adherence to turnaround times, transparent billing, and dedicated engineering resources.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {KEY_BENEFITS.map((benefit, i) => {
              const BenefitIcon = iconMap[benefit.icon] || ShieldCheck;
              return (
                <div key={i} className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 shrink-0">
                    <BenefitIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{benefit.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
