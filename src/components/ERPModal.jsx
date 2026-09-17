import React, { useState } from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Wrench, 
  PackageCheck, 
  ReceiptText, 
  SunMedium, 
  Users, 
  Lock, 
  Server,
  ArrowRight,
  Settings2
} from 'lucide-react';

export default function ERPModal({ isOpen, onClose }) {
  const [customErpUrl, setCustomErpUrl] = useState(BUSINESS_INFO.erpUrl);
  const [showConfig, setShowConfig] = useState(false);

  if (!isOpen) return null;

  const erpModules = [
    {
      title: "Service Tickets & AMC Desk",
      desc: "Track banking & postal hardware incidents, SLA response timers, and maintenance history.",
      icon: Wrench,
      color: "text-sky-500",
      bg: "bg-sky-50"
    },
    {
      title: "Inventory & Spare Parts",
      desc: "Real-time stock of computer components, replacement buffer units, and solar inverters.",
      icon: PackageCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      title: "GST Invoicing & Quotes",
      desc: "Commercial billing, AMC contracts, purchase orders, and tax invoice generation.",
      icon: ReceiptText,
      color: "text-indigo-500",
      bg: "bg-indigo-50"
    },
    {
      title: "Solar Project Management",
      desc: "Rooftop survey data, APDCL net-metering status, and solar commissioning logs.",
      icon: SunMedium,
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
    {
      title: "Field Engineers Dispatch",
      desc: "On-site resident engineer attendance, route planning across Barak Valley, and digital job cards.",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      title: "Enterprise Server Logs",
      desc: "System uptime monitoring, scheduled backup logs, and security audit records.",
      icon: Server,
      color: "text-rose-500",
      bg: "bg-rose-50"
    }
  ];

  const handleLaunchERP = () => {
    window.open(customErpUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="Close ERP modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-brand-blue flex items-center justify-center text-white shrink-0 shadow-md">
            <Lock className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 uppercase tracking-wider">
                Internal Operations
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Authorized Staff Gateway
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Backend ERP & Operations Portal
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Access M/S Computer Planet internal workflows, AMC ticketing, inventory, and solar project management.
            </p>
          </div>
        </div>

        {/* Quick Launch Banner */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl mb-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Gateway Endpoint:
            </div>
            <div className="font-bold text-sm text-white truncate max-w-sm mt-0.5 font-mono">
              {customErpUrl}
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleLaunchERP}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition shadow"
            >
              <span>Launch ERP Portal</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition"
              title="Change ERP URL"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Optional URL Config Box */}
        {showConfig && (
          <div className="p-4 mb-6 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in duration-150">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Configure ERP Portal URL (e.g. ERPNext / Odoo / Custom Server):
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customErpUrl}
                onChange={(e) => setCustomErpUrl(e.target.value)}
                placeholder="https://erp.mscomputerplanet.com or http://ip:port"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <button
                onClick={() => setShowConfig(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Operational Modules Grid */}
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Integrated Backend Modules
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {erpModules.map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <div
                  key={idx}
                  onClick={handleLaunchERP}
                  className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 transition cursor-pointer group"
                >
                  <div className={`p-2.5 rounded-xl ${mod.bg} ${mod.color} shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {mod.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-normal mt-0.5 line-clamp-2">
                      {mod.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & Access Notice */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Encrypted internal communication for M/S Computer Planet engineers & admin staff.</span>
          </div>
          <a
            href={customErpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
          >
            <span>Direct Sign In</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
