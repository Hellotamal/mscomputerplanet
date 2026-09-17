import React from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { 
  ShieldCheck, 
  ExternalLink, 
  Star, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  FileText,
  MessageSquare
} from 'lucide-react';

export default function B2BMarketplaceHub({ onOpenQuote, onOpenShare }) {
  const marketplaces = BUSINESS_INFO.marketplaceProfiles || [];

  return (
    <section id="b2b-platforms" className="py-20 bg-slate-900 text-white relative overflow-hidden border-t border-b border-slate-800">
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Platform Certified & Verified</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Find Us on India's Top <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">B2B & Search Platforms</span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            M/S Computer Planet is a verified, certified vendor across national procurement portals, B2B marketplaces, and local search directories. We ensure 100% genuine products, GST statutory invoicing, and localized field engineering.
          </p>
        </div>

        {/* Marketplace Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {marketplaces.map((m) => (
            <div 
              key={m.id}
              className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/80 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Platform Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-700/80 text-emerald-300 border border-slate-600/60">
                    {m.badge}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{m.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {m.platform}
                </h3>
                <p className="text-xs font-medium text-emerald-400/90 mt-0.5">
                  {m.reviewsCount} • {m.status}
                </p>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  {m.tagline}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between gap-3">
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  <span>{m.cta}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onOpenQuote({ 
                    category: m.id.includes('solar') ? 'Solar Energy' : 'IT Support & AMC',
                    serviceName: `${m.platform} Verified Inquiry`,
                    notes: `Lead referred from ${m.platform} (${m.badge})`
                  })}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition flex items-center gap-1"
                >
                  <span>Quick RFQ</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {/* Special GeM / Tender Direct Card */}
          <div className="bg-gradient-to-br from-slate-800 to-emerald-950/60 rounded-2xl p-6 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
                  Govt of India MSME
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Institutional & GeM Tenders
              </h3>
              <p className="text-xs font-medium text-emerald-300 mt-0.5">
                Udyam: {BUSINESS_INFO.legal.udyamRegNo}
              </p>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                Registered MSME supplier for Public Sector Banks, Indian Post, educational institutes, and Assam state government departmental computer lab & solar tenders.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center gap-2">
              <button
                onClick={() => onOpenQuote({ 
                  category: 'IT Hardware Sales',
                  serviceName: 'GeM / Institutional Tender RFQ',
                  notes: 'Inquiry regarding MSME GeM tender procurement.'
                })}
                className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Submit Tender Specs</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Banner: Multi-Channel Share & Connect */}
        <div className="bg-slate-800/90 rounded-2xl p-6 sm:p-8 border border-slate-700 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <h4 className="text-lg sm:text-xl font-black text-white flex items-center justify-center lg:justify-start gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Are You a Procurement Officer, Bank Manager or Business Owner?</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Get official GST quotation, rate contract estimates, or solar feasibility surveys delivered directly within 15 minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {onOpenShare && (
              <button
                onClick={onOpenShare}
                className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Share Profile with Colleagues</span>
              </button>
            )}

            <a
              href={`https://wa.me/918638083712?text=${encodeURIComponent('Hello M/S Computer Planet, I found your verified business profile online and would like to request an official quotation/survey.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Instant WhatsApp Inquiry</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
