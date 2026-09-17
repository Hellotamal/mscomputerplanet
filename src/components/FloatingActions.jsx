import React, { useState, useEffect } from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { MessageSquare, Phone, ArrowUp, Sun, Moon, Share2 } from 'lucide-react';

export default function FloatingActions({ onOpenQuote, theme, onToggleTheme, onOpenShare }) {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  return (
    <>
      {/* Floating Action Buttons for Desktop / Tablet */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-3">
        {/* Share & Refer Hub Button */}
        {onOpenShare && (
          <button
            onClick={onOpenShare}
            className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-800 text-teal-400 border border-slate-700/80 flex items-center justify-center shadow-lg hover:scale-110 transition transform hover:bg-slate-800"
            title="Share M/S Computer Planet on WhatsApp, LinkedIn & Social Media"
            aria-label="Share Business Profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}

        {/* Quick Day / Night Toggle Floating Button */}
        <button
          onClick={onToggleTheme}
          className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-800 text-amber-400 dark:text-amber-300 border border-slate-700/80 flex items-center justify-center shadow-lg hover:scale-110 transition transform"
          title={`Switch to ${theme === 'dark' ? 'Day (Light)' : 'Night (Dark)'} Mode`}
          aria-label="Toggle Day and Night Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-sky-300" />
          )}
        </button>

        {showScroll && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shadow-lg hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700/80 transition transform hover:-translate-y-1"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* WhatsApp Direct */}
        <a
          href={BUSINESS_INFO.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-emerald-500/25 transition transform hover:-translate-y-1"
          title="Chat with M/S Computer Planet on WhatsApp"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs font-bold max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300">
            WhatsApp Support
          </span>
        </a>
      </div>

      {/* Sticky Bottom Bar on Mobile Devices */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-2.5 px-4 flex items-center justify-between gap-2 shadow-2xl">
        <button
          onClick={onToggleTheme}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-amber-400 flex items-center justify-center"
          title={`Switch to ${theme === 'dark' ? 'Day' : 'Night'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {onOpenShare && (
          <button
            onClick={onOpenShare}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-teal-600 dark:text-teal-400 flex items-center justify-center"
            title="Share with Contacts"
            aria-label="Share Business Profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}

        <a
          href={`tel:${BUSINESS_INFO.phoneRaw}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-800"
        >
          <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Call</span>
        </a>

        <a
          href={BUSINESS_INFO.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={() => onOpenQuote()}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 text-xs font-bold shadow-md"
        >
          <span>Get Quote</span>
        </button>
      </div>
    </>
  );
}
