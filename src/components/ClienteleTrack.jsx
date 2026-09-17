import React from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { 
  Landmark, 
  Mail, 
  Building2, 
  CheckCircle, 
  ShieldCheck, 
  Award
} from 'lucide-react';

export default function ClienteleTrack() {
  return (
    <section id="clientele" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            Verified Government & Financial Clientele
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Proven Track Record Across Barak Valley
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Since our incorporation, M/S Computer Planet has been the trusted service provider for prominent banking
            institutions, postal networks, and government departments in Assam.
          </p>
        </div>

        {/* 4 Major Institutional Clientele Cards (Privacy-Compliant & Professional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Punjab National Bank */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Landmark className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  <CheckCircle className="w-3 h-3" />
                  Banking Partner
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">
                Punjab National Bank
              </h4>
              <div className="text-xs font-semibold text-blue-600 mb-3">
                Circle Office Silchar & Regional Branches
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Comprehensive maintenance and technical engineering support for computer hardware, passbook printers, scanners, and branch IT peripherals across the Barak Valley.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-600">
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Branch IT AMC</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Priority SLA</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Field Support</span>
            </div>
          </div>

          {/* Indian Post */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-rose-300 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  <CheckCircle className="w-3 h-3" />
                  Postal Network
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">
                Indian Post
              </h4>
              <div className="text-xs font-semibold text-rose-600 mb-3">
                Cachar Division & Postal Counters
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Timely delivery, hardware setup, and ongoing preventative maintenance of essential computing systems, printers, and peripheral support for postal counter operations.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-600">
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Counter Hardware</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Heavy Printers</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Regular AMC</span>
            </div>
          </div>

          {/* Assam Gramin Bikash Bank */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle className="w-3 h-3" />
                  Regional Banking
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">
                Assam Gramin Bikash Bank
              </h4>
              <div className="text-xs font-semibold text-emerald-600 mb-3">
                Silchar Regional Office & Branches
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Rapid troubleshooting, component-level hardware servicing, and system maintenance keeping branch services and customer transaction counters consistently operational.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-600">
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Hardware Servicing</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Network Uptime</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Component Spares</span>
            </div>
          </div>

          {/* Regional Commercial & Institutions */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-sky-300 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                  <CheckCircle className="w-3 h-3" />
                  Enterprises
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">
                Barak Valley Enterprises
              </h4>
              <div className="text-xs font-semibold text-sky-600 mb-3">
                Cachar, Hailakandi & Karimganj
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Serving colleges, medical centers, tea estate management offices, and private commercial enterprises with turnkey IT infrastructure, CCTV surveillance, and solar energy setups.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-600">
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Solar Rooftop</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">IP CCTV</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Turnkey Labs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
