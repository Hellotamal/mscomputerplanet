import React from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Sun, 
  Cpu, 
  ArrowUp, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export default function Footer({ onOpenERP }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Overview Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white font-black text-sm">
                  CP
                </div>
              </div>
              <div>
                <span className="text-lg font-extrabold text-white tracking-tight">
                  M/S COMPUTER PLANET
                </span>
                <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  IT Solutions & Renewable Energy
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              A pioneering force in IT maintenance, computer sales, AMC support, and sustainable solar energy systems.
              Proudly servicing government bodies, banking circles, and commercial businesses across Silchar & Barak Valley.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5 font-mono mb-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>UDYAM: {BUSINESS_INFO.legal.udyamRegNo}</span>
              </div>
              <div className="flex items-center gap-2 text-sky-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>GSTIN: {BUSINESS_INFO.legal.gstin}</span>
              </div>
            </div>

            {/* Omnis Trades Strategic Partner Chip */}
            <a
              href="https://omnistrades.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-300 hover:text-white hover:border-amber-400 transition flex items-center justify-between group"
              title="Visit Omnis Trades Solar EPC Portal"
            >
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-amber-300 text-[11px]">Omnis Trades Partner</div>
                  <div className="text-[10px] text-slate-400">Solar EPC Consultant (100 KM Radius)</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition" />
            </a>
          </div>

          {/* IT Services Links */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>IT & AMC</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li><a href="#services-it" className="hover:text-white transition">Hardware Maintenance</a></li>
              <li><a href="#services-it" className="hover:text-white transition">Operating System & Security</a></li>
              <li><a href="#services-it" className="hover:text-white transition">Annual Maintenance Contracts</a></li>
              <li><a href="#services-it" className="hover:text-white transition">Priority Emergency Response</a></li>
              <li><a href="#services-it" className="hover:text-white transition">Structured Cabling & LAN</a></li>
              <li><a href="#service-area" className="hover:text-white transition text-sky-400">100 KM Coverage Area</a></li>
            </ul>
          </div>

          {/* Solar Energy Links */}
          <div className="lg:col-span-3 sm:col-span-1">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-emerald-400" />
              <span>Solar Energy</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li><a href="#services-solar" className="hover:text-white transition">On-Grid & Hybrid Rooftops</a></li>
              <li><a href="#services-solar" className="hover:text-white transition">Bank & Commercial Solar Backup</a></li>
              <li><a href="#services-solar" className="hover:text-white transition">Solar Inverters & Batteries</a></li>
              <li><a href="#services-solar" className="hover:text-white transition">Solar Water Pumping Systems</a></li>
              <li><a href="#solar-calculator" className="hover:text-white transition">Solar Savings ROI Calculator</a></li>
              <li><a href="#services-solar" className="hover:text-white transition">APDCL Net-Metering Support</a></li>
              <li>
                <a href="https://omnistrades.in/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline inline-flex items-center gap-1 text-xs">
                  <span>Omnis Trades EPC Alliance</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Office & Direct Contact Column */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Registered Office
            </h4>
            <address className="not-italic text-xs sm:text-sm text-slate-400 space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{BUSINESS_INFO.address.full}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="text-white hover:text-emerald-400 transition font-mono">
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${BUSINESS_INFO.email}`} className="text-white hover:text-emerald-400 transition truncate">
                  {BUSINESS_INFO.email}
                </a>
              </div>
            </address>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>

        </div>

        {/* Legal & Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-400">M/S COMPUTER PLANET</strong> ({BUSINESS_INFO.domain}). All rights reserved.
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span>MSME Reg: {BUSINESS_INFO.legal.udyamRegNo}</span>
            <span>•</span>
            <span>GST: {BUSINESS_INFO.legal.gstin}</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">Channel Partner: Omnis Trades</span>
            <span>•</span>
            <span className="text-emerald-400">100 KM Southern Assam Coverage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
