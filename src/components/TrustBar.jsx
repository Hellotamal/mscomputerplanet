import React from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { ShieldCheck, CheckCircle2, Award, Building2, Landmark, Mail } from 'lucide-react';

export default function TrustBar() {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: "MSME Registered",
      subtitle: BUSINESS_INFO.legal.udyamRegNo,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      icon: CheckCircle2,
      title: "GSTIN Registered",
      subtitle: BUSINESS_INFO.legal.gstin,
      color: "text-sky-500",
      bg: "bg-sky-500/10"
    },
    {
      icon: Award,
      title: "Trade Licence Holder",
      subtitle: "Silchar Municipal Authority",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      icon: Landmark,
      title: "Banking IT Partner",
      subtitle: "PNB (49 Branches) & AGBB",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Mail,
      title: "Govt Contractor",
      subtitle: "Indian Post, Cachar Div.",
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    }
  ];

  return (
    <section className="bg-slate-900 border-y border-slate-800 py-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <p className="text-center text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">
          Verified Government & Enterprise Accreditations
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur hover:border-slate-600 transition"
              >
                <div className={`p-2.5 rounded-lg ${item.bg} ${item.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-200 truncate">{item.title}</div>
                  <div className="text-[11px] font-mono text-slate-400 truncate">{item.subtitle}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
