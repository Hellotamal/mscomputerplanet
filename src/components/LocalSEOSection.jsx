import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Navigation, 
  PhoneCall 
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessInfo';

const LOCAL_FAQS = [
  {
    q: "How can homeowners and commercial businesses in Silchar and Barak Valley claim the PM Surya Ghar subsidy?",
    a: "Under the PM Surya Ghar Muft Bijli Yojana, residential consumers can receive up to ₹78,000 in direct central government financial assistance for rooftop solar systems (up to 3 kWp and above). As the official Channel & Solar EPC Consultant Partner of Omnis Trades, M/S Computer Planet provides complete turnkey assistance: we conduct the 3D shadow analysis site survey, submit the APDCL feasibility application, install MNRE-compliant Tier-1 bifacial panels, coordinate bi-directional net meter testing, and guide you until the subsidy is credited directly into your bank account."
  },
  {
    q: "How does the APDCL net-metering connection process work in Cachar and Southern Assam?",
    a: "APDCL (Assam Power Distribution Company Limited) net-metering allows solar system owners to export surplus clean electricity back into the power grid during daytime hours. In return, your monthly electric meter runs backward, slashing power bills by up to 80-90%. Our engineering team handles all documentation, technical feasibility clearances with local APDCL sub-divisional offices in Silchar, Karimganj, and Hailakandi, and ensures grid synchronization with CEIG-compliant safety standards."
  },
  {
    q: "Which IT maintenance and computer AMC services are available within the 100 KM customer radius?",
    a: "We provide comprehensive IT hardware and peripheral AMC solutions across Cachar, Karimganj, and Hailakandi districts. Trusted by premier institutions like Punjab National Bank (50+ branches), Indian Post, and Assam Gramin Bikash Bank, our services include routine preventive health maintenance, motherboard/SMPS diagnostics, thermal refurbishment, Cat6/fiber network cabling, CCTV surveillance setups, and resident on-site technician deployment."
  },
  {
    q: "Why is M/S Computer Planet considered the top-rated solar EPC company in Silchar and Barak Valley?",
    a: "Unlike generic resellers, M/S Computer Planet combines over a decade of regional technical trust with the Tier-1 engineering powerhouse of Omnis Trades (Guwahati), which has successfully deployed over 1,000+ Northeast solar installations and 150+ solar power plants. Clients benefit from local, immediate on-the-ground engineer dispatch in Silchar coupled with institutional-grade EPC procurement and MNRE compliance."
  },
  {
    q: "What is your emergency on-site response time for hardware breakdowns in Silchar and nearby towns?",
    a: "For AMC contracted clients, banks, and critical operations in Silchar urban and Chincoorie areas, our emergency response SLA is 2 to 4 hours with standby replacement hardware buffers. For Karimganj town, Badarpur, Hailakandi, and Lala, our mobile field engineers provide guaranteed same-day on-site service dispatch."
  }
];

export default function LocalSEOSection({ onOpenQuote }) {
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedDistrict, setSelectedDistrict] = useState(0);

  const districts = BUSINESS_INFO.serviceRadius.districts;

  return (
    <section id="service-area" className="py-20 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            100 KM Regional Service Coverage • Southern Assam
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Serving Silchar, Cachar, Hailakandi & Karimganj
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            With our central technical headquarters in Silchar, we deliver high-velocity IT Annual Maintenance 
            and turnkey Omnis Trades Solar EPC installations across an active 100-kilometer regional radius.
          </p>
        </div>

        {/* 100 KM Coverage Tabs & Details */}
        <div className="bg-slate-950/80 rounded-3xl border border-slate-800 p-6 sm:p-8 lg:p-10 mb-16 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-6 mb-6">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Local Operational Hub</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>Base Location: {BUSINESS_INFO.address.city}, Assam ({BUSINESS_INFO.address.pincode})</span>
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {districts.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDistrict(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedDistrict === idx
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active District Information Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-900/90 rounded-2xl p-6 border border-slate-800">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
                <Clock className="w-4 h-4" />
                <span>Field SLA: {districts[selectedDistrict].sla}</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                {districts[selectedDistrict].name} Regional Coverage
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                <strong>Towns, Sub-Divisions & Villages Covered:</strong> {districts[selectedDistrict].towns}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Turnkey Solar Rooftop Installation
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  Banking & Enterprise IT AMC Support
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  On-Site Free Solar Survey
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={() => onOpenQuote({ serviceName: `Site Service (${districts[selectedDistrict].name})`, category: 'Regional Service' })}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm text-center transition"
              >
                Schedule Site Visit in {districts[selectedDistrict].name}
              </button>
              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs sm:text-sm text-center inline-flex items-center justify-center gap-2 transition"
              >
                <PhoneCall className="w-4 h-4 text-sky-400" />
                <span>Immediate Dispatch Helpline</span>
              </a>
            </div>
          </div>
        </div>

        {/* Localized Search FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions (Barak Valley & Assam)
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Got Questions About Solar Subsidies or IT AMC in Silchar?
            </h3>
          </div>

          <div className="space-y-4">
            {LOCAL_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? 'bg-slate-950 border-emerald-500/40 shadow-lg' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-sm sm:text-base text-white leading-snug">
                      {faq.q}
                    </span>
                    <span className={`p-1.5 rounded-lg shrink-0 transition ${isOpen ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
