import React from 'react';
import { 
  Sun, 
  Zap, 
  ShieldCheck, 
  ExternalLink, 
  Award, 
  Building2, 
  Droplets, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessInfo';

export default function OmnisPartnership({ onOpenQuote }) {
  const partner = BUSINESS_INFO.omnisTradesPartner;

  const keyMetrics = [
    { label: "Northeast Projects Delivered", value: "1,000+", icon: Award, color: "text-amber-400" },
    { label: "Solar Power Plants Installed", value: "150+", icon: Building2, color: "text-emerald-400" },
    { label: "Solar Water Pumps (KUSUM)", value: "500+", icon: Droplets, color: "text-sky-400" },
    { label: "Barak Valley On-Site Coverage", value: "100 KM", icon: Zap, color: "text-yellow-400" },
  ];

  const highlights = [
    {
      title: "PM Surya Ghar Muft Bijli Yojana",
      desc: "End-to-end guidance to claim up to ₹78,000 direct central government subsidy for residential rooftop solar."
    },
    {
      title: "APDCL Net-Metering Liaison",
      desc: "Fast-track documentation, bi-directional net meter installation, and APDCL grid synchronization in Assam."
    },
    {
      title: "MNRE-Compliant 3D DPR Engineering",
      desc: "Precision roof shadow analysis, optimum tilt calculation, and bank-grade Detailed Project Reports (DPR)."
    },
    {
      title: "Tier-1 Solar Panels & Inverters",
      desc: "Sourcing premium Mono PERC/TOPCon bifacial panels with 25-year performance warranty and heavy-duty hybrid inverters."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 relative overflow-hidden">
      {/* Decorative ambient lighting */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Strategic Alliance Banner Card */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-amber-500/30 p-8 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Subtle watermark background pattern */}
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-amber-400">
            <Sun className="w-80 h-80" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 7 Columns: Context & Badges */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Strategic Clean Energy Partnership
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug mb-4">
                M/S Computer Planet is the Official{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-emerald-400">
                  Channel & Solar EPC Consultant Partner
                </span>{' '}
                of Omnis Trades
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Through this strategic alliance with <strong className="text-white">Omnis Trades</strong> (Guwahati, Assam),
                we bring tier-1 engineering, MNRE-compliant solar EPC capabilities, and national solar subsidy execution directly 
                to homeowners, commercial enterprises, hospitals, tea estates, and banking institutions across <strong className="text-emerald-400">Silchar, Cachar, Karimganj, and Hailakandi</strong>.
              </p>

              {/* 4 Feature Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white mb-0.5">{h.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-normal">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => onOpenQuote({ serviceName: 'Omnis Solar EPC Consultation', category: 'Solar Energy' })}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-950/40 transition transform hover:-translate-y-0.5"
                >
                  <span>Consult With Solar EPC Expert</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm transition"
                  title="Visit Omnis Trades Guwahati Official Website"
                >
                  <span>Explore Omnis Trades</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </a>
              </div>
            </div>

            {/* Right 5 Columns: Partner Card & Verified Track Record */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              
              {/* Partner Card */}
              <div className="bg-slate-950/80 border border-amber-500/20 rounded-2xl p-6 relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 flex items-center justify-center">
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
                        <Sun className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-white">Omnis Trades / Omnis Solar</div>
                      <div className="text-[11px] text-amber-400 font-medium">Headquarters: Guwahati, Assam</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                    Verified Partner
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-4 space-y-1">
                  <div><strong className="text-slate-300">Office:</strong> {partner.headquarters}</div>
                  <div><strong className="text-slate-300">Consultant Region:</strong> {partner.region}</div>
                  <div><strong className="text-slate-300">Official Portal:</strong> <span className="text-sky-400">omnistrades.in</span></div>
                </div>

                {/* 4 Track-Record Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
                  {keyMetrics.map((m, idx) => (
                    <div key={idx} className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-center">
                        <div className={`text-xl sm:text-2xl font-black font-mono ${m.color} mb-0.5`}>
                          {m.value}
                        </div>
                        <div className="text-[10px] text-slate-400 leading-tight">
                          {m.label}
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              {/* Local Field Support Badge */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>100 KM Southern Assam Advantage:</strong> Local Silchar engineering support combined with Guwahati EPC procurement power.
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
