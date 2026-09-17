import React from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { 
  Landmark, 
  Mail, 
  Building2, 
  FileCheck2, 
  CheckCircle, 
  ShieldCheck, 
  Award,
  Calendar
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

        {/* Featured Certificate Card: Punjab National Bank */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white rounded-3xl p-6 sm:p-10 mb-12 shadow-2xl border border-blue-900/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Official Work Completion & Satisfaction Certificate</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-black mb-2 text-white">
                Punjab National Bank (Circle Office, Silchar)
              </h3>
              <p className="text-sky-300 font-mono text-xs sm:text-sm mb-4">
                Ref. No: PNB/CO/SIL/021/2023-24 • Performance Verified
              </p>

              <blockquote className="border-l-4 border-emerald-500 pl-4 py-1 text-slate-200 text-sm sm:text-base leading-relaxed italic mb-6">
                "This is certifying that M/S COMPUTER PLANET, having their registered office at West Kachudharam,
                Chincoorie, Silchar-788007, Assam, has successfully completed the maintenance services of Computer Hardware,
                Software and Peripherals devices installed in various branches (49 No.) of the PNB Silchar Circle Office...
                The service provided by M/S COMPUTER PLANET during the period was found to be satisfactory."
              </blockquote>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-slate-400">Coverage</div>
                  <div className="text-white font-bold text-sm mt-0.5">49 Bank Branches</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-slate-400">Scope of Work</div>
                  <div className="text-white font-bold text-sm mt-0.5">Hardware, OS & Peripherals</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-slate-400">Issuing Authority</div>
                  <div className="text-white font-bold text-sm mt-0.5">IT Dept, PNB Silchar Circle</div>
                </div>
              </div>
            </div>

            {/* Certificate Seal & Stats Badge */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-800/60 rounded-2xl border border-slate-700 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 mb-4 flex items-center justify-center shadow-lg">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                  <Landmark className="w-9 h-9 text-amber-400" />
                </div>
              </div>
              <div className="text-lg font-black text-white">Punjab National Bank</div>
              <div className="text-xs text-amber-300 font-semibold mb-2">Silchar Circle Office</div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Work Order ref no: <span className="font-mono text-slate-200">Hardware AMC/Temp/PO/033-2023</span>
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified Banking Contractor
              </div>
            </div>
          </div>
        </div>

        {/* Other Notable Clientele Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Indian Post */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">
              Indian Post
            </h4>
            <div className="text-xs font-semibold text-rose-600 mb-3">
              Cachar Division & under Post Offices
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Timely delivery and maintenance of essential computing systems, printers, and peripheral support for postal counters.
            </p>
          </div>

          {/* Assam Gramin Bikash Bank */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">
              Assam Gramin Bikash Bank
            </h4>
            <div className="text-xs font-semibold text-emerald-600 mb-3">
              Silchar Regional Office & Branches
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Rapid troubleshooting, hardware component servicing, and system maintenance keeping branch services up and running.
            </p>
          </div>

          {/* Regional Commercial & Institutions */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">
              Barak Valley Enterprises
            </h4>
            <div className="text-xs font-semibold text-sky-600 mb-3">
              Cachar, Hailakandi & Karimganj
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Serving schools, educational labs, tea garden management offices, and private enterprises with turnkey IT & solar setups.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
