import React, { useState } from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: 'IT Hardware Maintenance & AMC',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please enter your Name and Contact Phone Number.');
      return;
    }

    const text = `New Inquiry from mscomputerplanet.com:%0A` +
      `👤 Name: ${encodeURIComponent(formData.name)}%0A` +
      `📞 Phone: ${encodeURIComponent(formData.phone)}%0A` +
      `✉️ Email: ${encodeURIComponent(formData.email || 'N/A')}%0A` +
      `🛠️ Service: ${encodeURIComponent(formData.serviceType)}%0A` +
      `📝 Details: ${encodeURIComponent(formData.message || 'Please contact me.')}`;

    // Open WhatsApp
    window.open(`https://wa.me/918638083712?text=${text}`, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Contact M/S Computer Planet
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Have a question about IT maintenance, computer AMC, or installing rooftop solar panels?
            Our Silchar-based team is here to assist you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Info Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span>Office & Service Headquarters</span>
            </h3>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Address</div>
                  <div className="text-sm font-semibold text-slate-900 mt-1">
                    {BUSINESS_INFO.address.line1}
                  </div>
                  <div className="text-sm text-slate-600">
                    {BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.district}, {BUSINESS_INFO.address.state} - {BUSINESS_INFO.address.pincode}
                  </div>
                  <a 
                    href={BUSINESS_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 mt-2"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone & Hotline</div>
                  <a 
                    href={`tel:${BUSINESS_INFO.phoneRaw}`}
                    className="text-base font-bold text-slate-900 hover:text-emerald-600 transition block mt-1 font-mono"
                  >
                    {BUSINESS_INFO.phoneDisplay}
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">Available for direct voice call and SMS</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Official Email</div>
                  <a 
                    href={`mailto:${BUSINESS_INFO.email}`}
                    className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition block mt-1"
                  >
                    {BUSINESS_INFO.email}
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">Quotations, tenders & AMC documentation</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operating Schedule</div>
                  <div className="text-sm font-medium text-slate-900 mt-1">
                    Monday – Saturday: 9:00 AM – 8:00 PM
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                    24/7 Priority SLA for contracted banking branches
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Summary Box */}
            <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-3xl text-xs space-y-2 text-slate-600">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-800">Govt MSME Udyam:</span>
                <span className="font-mono">{BUSINESS_INFO.legal.udyamRegNo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-800">GST Registration:</span>
                <span className="font-mono">{BUSINESS_INFO.legal.gstin}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-800">Trade License:</span>
                <span>Municipal Registered</span>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Send an Inquiry or Schedule a Site Visit
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Fill in your requirement below. We will respond with pricing, technical feasibility, and customized proposal.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-slate-900 mb-1">Inquiry Sent via WhatsApp!</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Thank you for reaching out to M/S Computer Planet. We will connect with you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name / Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. name@organization.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Service / Product Interest *
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="IT Hardware Maintenance & AMC">IT Hardware Maintenance & AMC</option>
                      <option value="New Desktop / Laptop / Server Purchase">New Desktop / Laptop / Server Purchase</option>
                      <option value="Rooftop Solar Installation (1 - 10 kW+)">Rooftop Solar Installation (1 - 10 kW+)</option>
                      <option value="Commercial Bank / Office Solar Backup">Commercial Bank / Office Solar Backup</option>
                      <option value="Networking, CCTV & Biometrics">Networking, CCTV & Biometrics</option>
                      <option value="Emergency Hardware Repair">Emergency Hardware Repair</option>
                      <option value="Institutional GeM / Bulk Order">Institutional GeM / Bulk Order</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Requirement Details / Location / Office
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Provide details such as number of computers, monthly electricity bill, or location in Silchar / Barak Valley..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-brand-blue to-emerald-600 hover:from-slate-900 hover:to-emerald-700 shadow-md hover:shadow-lg transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Inquiry to WhatsApp & Email</span>
                  </button>
                  <span className="block sm:inline-block sm:ml-4 text-xs text-slate-500 mt-2 sm:mt-0">
                    Fast response guaranteed within business hours.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
