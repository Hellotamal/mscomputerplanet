import React from 'react';
import { 
  Award, 
  Sparkles, 
  Quote, 
  ShieldCheck, 
  PhoneCall, 
  MessageSquare, 
  Sun, 
  HeartHandshake
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessInfo';

export default function FounderProfile({ onOpenQuote }) {
  const { founder } = BUSINESS_INFO;

  return (
    <section id="leadership" className="py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Pill */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Leadership & Visionary Stewardship
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Meet Our Founder
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            A decade of dedication to technical innovation, clean renewable power, and client relationship excellence in Southern Assam.
          </p>
        </div>

        {/* Founder Card Container */}
        <div className="bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Portrait & Credential Badges (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              
              <div className="relative group">
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-400 via-teal-400 to-emerald-500 opacity-75 blur-md group-hover:opacity-100 transition duration-500"></div>
                
                {/* Image container */}
                <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border-2 border-amber-400/40 shadow-2xl">
                  <img
                    src={founder.photo}
                    alt={`${founder.name} - Founder of M/S Computer Planet`}
                    className="w-full h-full object-cover object-top filter brightness-105 contrast-105 transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Subtle gradient vignette at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Executive Director</span>
                    </div>
                    <div className="text-sm font-extrabold text-white tracking-tight">{BUSINESS_INFO.name}</div>
                  </div>
                </div>

                {/* Floating Experience Badge */}
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-lg border border-amber-300 flex items-center gap-1.5 transform group-hover:translate-y-[-2px] transition">
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>10+ Years Experience</span>
                </div>
              </div>

              {/* Founder Meta Details */}
              <div className="mt-8 space-y-1">
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {founder.name}
                </h3>
                <p className="text-emerald-400 font-semibold text-sm">
                  {founder.title}
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  M/S Computer Planet • Silchar, Assam
                </p>
              </div>

              {/* Fast Connect CTA */}
              <div className="mt-5 flex items-center justify-center gap-3 w-full max-w-xs">
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white inline-flex items-center justify-center gap-1.5 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                  <span>Direct Call</span>
                </a>
                <a
                  href={BUSINESS_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white inline-flex items-center justify-center gap-1.5 transition shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

            </div>

            {/* Right Column: Bio, Vision & 3 Leadership Pillars (7 cols) */}
            <div className="lg:col-span-7">
              
              {/* Executive Vision Quote */}
              <div className="relative p-6 rounded-2xl bg-slate-950/70 border border-amber-500/20 mb-6">
                <Quote className="w-8 h-8 text-amber-400/40 absolute top-4 right-4" />
                <p className="text-sm sm:text-base text-slate-200 italic leading-relaxed relative z-10 mb-3">
                  "{founder.quote}"
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
                  <span>— {founder.name}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 font-normal">Silchar, Cachar, Assam</span>
                </div>
              </div>

              {/* Comprehensive Biography */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                {founder.bio}
              </p>

              {/* 3 Core Strengths / Pillars */}
              <div className="space-y-3.5 mb-8">
                {founder.pillars.map((pillar, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                      {idx === 0 && <Award className="w-4 h-4" />}
                      {idx === 1 && <Sun className="w-4 h-4" />}
                      {idx === 2 && <HeartHandshake className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">{pillar.title}</h4>
                      <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Trigger */}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onOpenQuote({ serviceName: 'Executive Consultation with Mr. Amio Sinha', category: 'Executive Meeting' })}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-950/40 transition transform hover:-translate-y-0.5"
                >
                  Schedule Consultation With Founder
                </button>
                <div className="text-xs text-slate-400">
                  Direct strategic advisory for commercial enterprises, banks & institutions.
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
