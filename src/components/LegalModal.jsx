import React, { useState } from 'react';
import { X, ShieldCheck, FileText, HelpCircle, Lock } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessInfo';

export default function LegalModal({ isOpen, onClose, initialTab = 'privacy' }) {
  if (!isOpen) return null;
  return <LegalModalDialog onClose={onClose} initialTab={initialTab} />;
}

function LegalModalDialog({ onClose, initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Legal Compliance & Privacy Center</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'disclaimer'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            AdSense & Cookies
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">Privacy Policy for M/S COMPUTER PLANET</h4>
              <p className="text-slate-400 text-xs">Last Updated: September 2026 | Governing Law: India</p>

              <p>
                At <strong>M/S COMPUTER PLANET</strong> ({BUSINESS_INFO.domain}), accessible from{' '}
                <a href="https://www.mscomputerplanet.com" className="text-emerald-400 underline">
                  https://www.mscomputerplanet.com
                </a>
                , one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by M/S COMPUTER PLANET and how we use it.
              </p>

              <h5 className="font-bold text-white pt-2">1. Information We Collect</h5>
              <p>
                When you request a quotation, service ticket, or solar EPC consultation, we may ask for contact information including:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>Full Name and Organization/Enterprise Name</li>
                <li>Contact phone number (for WhatsApp/SMS support and engineer dispatch)</li>
                <li>Service location / address in Silchar, Cachar, Karimganj, or Hailakandi</li>
                <li>Estimated electricity bill or solar installation requirements</li>
              </ul>

              <h5 className="font-bold text-white pt-2">2. Google AdSense & Third-Party Advertising (Cookie Policy)</h5>
              <p>
                Google is one of the third-party vendors on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.mscomputerplanet.com and other sites on the internet.
              </p>
              <p className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-slate-300">
                <strong>Important Notice:</strong> Visitors may choose to decline the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at the following URL:{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline font-mono"
                >
                  https://policies.google.com/technologies/ads
                </a>
              </p>
              <p>
                Some of our advertising partners may use cookies and web beacons on our site. Our advertising partners include <strong>Google AdSense</strong>. Each of our advertising partners has their own Privacy Policy for their policies on user data.
              </p>

              <h5 className="font-bold text-white pt-2">3. Log Files</h5>
              <p>
                M/S COMPUTER PLANET follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected includes IP addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks. These are not linked to any personally identifiable information.
              </p>

              <h5 className="font-bold text-white pt-2">4. Data Protection & Security</h5>
              <p>
                We do not sell, rent, or trade your personal contact details to external marketers. All client records and AMC contracts are handled strictly for customer service fulfillment and statutory GST compliance in Assam, India.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">Terms & Conditions</h4>
              <p className="text-slate-400 text-xs">Effective for all customers in Southern Assam (100 KM Radius)</p>

              <h5 className="font-bold text-white">1. Service Scope & Jurisdiction</h5>
              <p>
                M/S COMPUTER PLANET operates under MSME Udyam Registration ({BUSINESS_INFO.legal.udyamRegNo}) and GST Registration ({BUSINESS_INFO.legal.gstin}), headquartered in Silchar, Cachar, Assam. All contracts and legal disputes are subject to the exclusive jurisdiction of the competent courts in Silchar, Assam.
              </p>

              <h5 className="font-bold text-white pt-2">2. IT AMC & Hardware Repairs</h5>
              <p>
                AMC agreements cover scheduled preventive maintenance, hardware diagnostics, and emergency breakdown attendance as specified in individual contract agreements. Data backup prior to hardware servicing is the responsibility of the client.
              </p>

              <h5 className="font-bold text-white pt-2">3. Solar EPC & Subsidy Consultancy</h5>
              <p>
                Solar estimates generated via our digital Solar Calculator are simulations based on standard regional solar irradiation in Southern Assam. Final rooftop capacity, subsidy disbursements under PM Surya Ghar Muft Bijli Yojana, and net-metering approvals are governed by APDCL (Assam Power Distribution Company Limited) and MNRE statutory guidelines.
              </p>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">Google AdSense Disclosure & Cookie Controls</h4>

              <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-2">
                <p className="font-semibold text-emerald-300">Third-Party Advertising Compliance</p>
                <p className="text-slate-300 text-xs leading-relaxed">
                  We use third-party advertising companies, including Google LLC, to serve advertisements when you visit our website. These companies may use aggregated information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
                </p>
              </div>

              <h5 className="font-bold text-white pt-2">How to Manage or Opt-Out of Personalized Ads:</h5>
              <ul className="list-disc pl-5 space-y-2 text-slate-400">
                <li>
                  You can opt out of personalized Google advertising by visiting{' '}
                  <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">
                    Google Ads Settings
                  </a>.
                </li>
                <li>
                  You can opt out of third-party vendor cookies for personalized advertising by visiting{' '}
                  <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">
                    www.aboutads.info
                  </a>.
                </li>
              </ul>

              <h5 className="font-bold text-white pt-2">Official Contact for Privacy Inquiries</h5>
              <p className="text-slate-400">
                If you have any questions about this Privacy Policy or Cookie Disclosures, please contact us:
                <br />
                <strong>Email:</strong> {BUSINESS_INFO.email}
                <br />
                <strong>Phone:</strong> {BUSINESS_INFO.phoneDisplay}
                <br />
                <strong>Office:</strong> {BUSINESS_INFO.address.full}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex justify-end bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
}
