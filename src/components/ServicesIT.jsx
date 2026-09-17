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
  UserCheck,
  Headphones
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

export default function ServicesIT({ onOpenQuote, onOpenSupportTicket }) {
  return (
    <section id="services-it" className="py-20 bg-slate-50 dark:bg-slate-950 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-3 border border-sky-200 dark:border-sky-800">
            <Cpu className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            Division 01: IT Infrastructure & Support
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Comprehensive IT Hardware Maintenance & AMC Services
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
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
                className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-xl hover:border-sky-300 dark:hover:border-sky-500/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent dark:border-slate-700">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                    {srv.description}
                  </p>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mb-5">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                      Key Deliverables:
                    </div>
                    <ul className="space-y-2">
                      {srv.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => onOpenQuote({ serviceName: srv.title, category: 'IT Support & AMC' })}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-slate-800 hover:bg-sky-600 hover:dark:bg-sky-600 hover:text-white transition-colors"
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

          {/* AMC Customer Support Quick Trigger Banner */}
          {onOpenSupportTicket && (
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/40 -mx-4 -mb-4 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 rounded-b-3xl">
              <div>
                <h4 className="text-base font-bold text-amber-400 flex items-center gap-2">
                  <Headphones className="w-5 h-5" />
                  <span>Enrolled AMC Branch or Corporate Client facing a breakdown?</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Log your breakdown call with your Client Code and Hardware Serial No. for 2–4 hr priority engineer dispatch.
                </p>
              </div>
              <button
                onClick={onOpenSupportTicket}
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm font-bold shadow-lg transition transform hover:-translate-y-0.5"
              >
                <Headphones className="w-4 h-4" />
                <span>Log Breakdown Ticket</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
