import React, { useState, useEffect } from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { X, Send, CheckCircle, Shield, MessageSquare, Phone, Mail } from 'lucide-react';

export default function QuoteModal({ isOpen, onClose, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    orgName: '',
    serviceCategory: 'IT Support & AMC',
    details: '',
    systemCount: '5-15',
    solarCapacity: '3 kW'
  });

  useEffect(() => {
    if (initialData.serviceName || initialData.category) {
      setFormData(prev => ({
        ...prev,
        serviceCategory: initialData.category || prev.serviceCategory,
        details: initialData.notes || (initialData.serviceName ? `Interested in: ${initialData.serviceName}` : '')
      }));
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please fill in your Name and Contact Phone.');
      return;
    }

    const msg = 
      `*QUOTATION REQUEST - M/S COMPUTER PLANET*%0A%0A` +
      `👤 *Client Name:* ${encodeURIComponent(formData.name)}%0A` +
      `🏢 *Organization / Office:* ${encodeURIComponent(formData.orgName || 'Individual / Private')}%0A` +
      `📞 *Phone:* ${encodeURIComponent(formData.phone)}%0A` +
      `⚙️ *Category:* ${encodeURIComponent(formData.serviceCategory)}%0A` +
      (formData.serviceCategory.includes('Solar') 
        ? `☀️ *Solar Requirement:* ${encodeURIComponent(formData.solarCapacity)}%0A` 
        : `💻 *Computer / Hardware Scale:* ${encodeURIComponent(formData.systemCount)} units%0A`) +
      `📋 *Additional Notes:* ${encodeURIComponent(formData.details || 'Standard pricing requested.')}%0A%0A` +
      `_Sent from www.mscomputerplanet.com_`;

    window.open(`https://wa.me/918638083712?text=${msg}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close quote modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            Quick Estimate & Proposal
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            Request an Official Quotation
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            M/S Computer Planet provides transparent pricing for IT AMC, hardware sales & solar installations.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Joydeep Nath"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 86380 83712"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company / Office Name
              </label>
              <input
                type="text"
                placeholder="e.g. PNB Branch / School"
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Service Vertical
            </label>
            <select
              value={formData.serviceCategory}
              onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="IT Support & AMC">IT Support & Annual Maintenance Contract (AMC)</option>
              <option value="Solar Energy">Renewable Solar Energy & Rooftop Setup</option>
              <option value="IT Hardware Sales">New Desktop / Laptop / Server Purchase</option>
              <option value="Solar Batteries & Inverters">Solar Inverters & Battery Storage</option>
              <option value="Networking & CCTV">Networking, Server Rack & CCTV</option>
              <option value="Emergency IT SLA">Emergency On-Site Hardware Repair</option>
            </select>
          </div>

          {formData.serviceCategory.includes('Solar') ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Solar Capacity
              </label>
              <select
                value={formData.solarCapacity}
                onChange={(e) => setFormData({ ...formData, solarCapacity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="1 - 2 kW (Small Home / Shop)">1 - 2 kW (Small Home / Shop)</option>
                <option value="3 - 5 kW (Medium Home / Bank Counter)">3 - 5 kW (Medium Home / Bank Counter)</option>
                <option value="6 - 10 kW (Commercial Office / Clinic)">6 - 10 kW (Commercial Office / Clinic)</option>
                <option value="15 kW+ (Institutional / Factory / Hospital)">15 kW+ (Institutional / Factory / Hospital)</option>
                <option value="Need Site Survey to Decide">Need Site Survey to Decide</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estimated Number of Systems / Devices
              </label>
              <select
                value={formData.systemCount}
                onChange={(e) => setFormData({ ...formData, systemCount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="1 - 5 Computers">1 - 5 Computers</option>
                <option value="5 - 20 Computers (Branch)">5 - 20 Computers (Standard Branch)</option>
                <option value="20 - 50 Systems (Regional Office)">20 - 50 Systems (Regional Office)</option>
                <option value="50+ Systems (Multi-Branch AMC)">50+ Systems (Multi-Branch Network AMC)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Details or Specific Requirements
            </label>
            <textarea
              rows="2"
              placeholder="Tell us any details (e.g. Silchar location, printer models, urgency)..."
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400 dark:placeholder-slate-500"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-brand-blue to-emerald-600 hover:from-slate-900 hover:to-emerald-700 flex items-center justify-center gap-2 shadow-lg transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Submit & Dispatch via WhatsApp</span>
            </button>
            <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-2">
              Instant quote confirmation directly with our engineering department.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
