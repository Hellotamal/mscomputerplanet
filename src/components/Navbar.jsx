import React, { useState, useEffect } from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ShieldCheck, 
  Server, 
  Sun, 
  Calculator, 
  Layers, 
  FileText, 
  MessageSquare,
  ExternalLink
} from 'lucide-react';

export default function Navbar({ onOpenQuote, onOpenERP }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'IT Services & AMC', href: '#services-it' },
    { name: 'Solar Energy', href: '#services-solar' },
    { name: 'Solar Calculator', href: '#solar-calculator' },
    { name: 'Products', href: '#products' },
    { name: 'Clientele', href: '#clientele' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Credentials & Contact Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Official Registration Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              MSME Reg: <span className="text-white font-mono">{BUSINESS_INFO.legal.udyamRegNo}</span>
            </span>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-sky-400 font-medium">
              GSTIN: <span className="text-white font-mono">{BUSINESS_INFO.legal.gstin}</span>
            </span>
            <span className="hidden lg:inline-block text-slate-600">|</span>
            <span className="hidden lg:inline-flex text-slate-300">
              Silchar, Cachar, Assam
            </span>
          </div>

          {/* Right: Quick Direct Contact & ERP Login */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            <a 
              href={`tel:${BUSINESS_INFO.phoneRaw}`} 
              className="flex items-center gap-1 text-slate-200 hover:text-emerald-400 transition"
              title="Call Silchar Office"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold">{BUSINESS_INFO.phoneDisplay}</span>
            </a>
            <a 
              href={`mailto:${BUSINESS_INFO.email}`} 
              className="hidden sm:flex items-center gap-1 text-slate-200 hover:text-sky-400 transition"
              title="Email Us"
            >
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>{BUSINESS_INFO.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3' 
          : 'bg-white/90 backdrop-blur-sm py-4 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-emerald-600 p-0.5 shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white">
                <span className="font-black text-base tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                  CP
                </span>
              </div>
            </div>
            <div>
              <div className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1">
                <span>M/S COMPUTER PLANET</span>
              </div>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-emerald-600">
                IT Solutions & Renewable Energy
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-700 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA & Mobile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onOpenQuote()}
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-brand-blue to-emerald-600 hover:from-slate-900 hover:to-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <FileText className="w-4 h-4" />
              <span>Get Free Quote</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-800 hover:text-emerald-600 hover:bg-slate-50 px-3 py-2.5 rounded-lg transition"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuote();
                  }}
                  className="w-full text-center bg-gradient-to-r from-brand-blue to-emerald-600 text-white font-semibold py-3 rounded-xl shadow"
                >
                  Get Instant Quote
                </button>
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="w-full text-center border border-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  Call {BUSINESS_INFO.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
