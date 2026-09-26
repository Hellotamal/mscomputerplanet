import React, { useState, useEffect } from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
import NewsTicker from './NewsTicker';
import { 
  Phone, 
  Mail, 
  Menu, 
  X, 
  ShieldCheck, 
  Sun, 
  Moon,
  FileText,
  Headphones
} from 'lucide-react';

export default function Navbar({ onOpenQuote, onOpenERP: _onOpenERP, theme, onToggleTheme, onOpenSupportTicket }) {
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
    { name: '🛒 IT Store (Buy Direct)', href: '#shop' },
    { name: '🛠️ Register Complaint', href: '#complaint' },
    { name: 'IT Services', href: '#services-it' },
    { name: 'Solar EPC', href: '#services-solar' },
    { name: 'Calculator', href: '#solar-calculator' },
    { name: 'Products', href: '#products' },
    { name: 'Clientele', href: '#clientele' },
    { name: 'B2B Hub', href: '#b2b-platforms' },
    { name: 'Blog', href: '#blog' },
    { name: 'Hall of Fame', href: '#gallery' },
    { name: '100 KM Area', href: '#service-area' },
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

          {/* Right: Quick Direct Contact & Day/Night Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-4 text-xs">
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

            {/* Day / Night Theme Switcher */}
            <button
              onClick={onToggleTheme}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-amber-400 border border-slate-700 transition shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Day (Light)' : 'Night (Dark)'} Mode`}
              aria-label="Toggle Day and Night Theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-bold text-amber-400">Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-300" />
                  <span className="text-[11px] font-bold text-sky-300">Night</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Automated Scrolling Local IT & Solar News Ticker */}
      <NewsTicker onOpenQuote={onOpenQuote} />

      {/* Main Navigation Bar */}
      <nav className={`transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-slate-950/95 dark:border-b dark:border-slate-800 backdrop-blur-md shadow-md py-2' 
          : 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm py-2.5 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-emerald-600 p-0.5 shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white">
                <span className="font-black text-sm sm:text-base tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                  CP
                </span>
              </div>
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                <span>M/S COMPUTER PLANET</span>
              </div>
              <p className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                IT Solutions & Renewable Energy
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 2xl:gap-1.5 shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="whitespace-nowrap text-[11px] xl:text-xs 2xl:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 px-1.5 xl:px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA & Mobile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Day/Night Icon Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-800"
              title={`Switch to ${theme === 'dark' ? 'Day (Light)' : 'Night (Dark)'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Log Support Ticket (AMC Breakdown & Incident Log) */}
            <button
              onClick={() => onOpenSupportTicket?.()}
              className="hidden md:inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-3.5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              title="Log AMC Breakdown Call / Service Ticket"
            >
              <Headphones className="w-4 h-4" />
              <span>Log Ticket</span>
            </button>

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
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900 px-3 py-2.5 rounded-lg transition"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onToggleTheme();
                  }}
                  className="w-full text-center border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-900 transition"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Switch to Day Mode (Light)</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-sky-400" />
                      <span>Switch to Night Mode (Dark)</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSupportTicket?.();
                  }}
                  className="w-full text-center bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold py-2.5 rounded-xl shadow flex items-center justify-center gap-2 text-sm"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Log Support / Breakdown Ticket</span>
                </button>
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
                  className="w-full text-center border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
