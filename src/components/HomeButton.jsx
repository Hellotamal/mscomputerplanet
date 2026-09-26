import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';

export default function HomeButton() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoHome = (e) => {
    e.preventDefault();
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <a
      href="#home"
      onClick={handleGoHome}
      className={`fixed top-3 left-3 sm:top-4 sm:left-4 z-[9999] inline-flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-full bg-slate-900/90 dark:bg-slate-900/95 text-white hover:bg-emerald-500 hover:text-slate-950 border border-slate-700/80 shadow-2xl backdrop-blur-md transition-all duration-300 group cursor-pointer ${
        scrolled ? 'scale-100 opacity-100' : 'scale-95 opacity-90 hover:opacity-100'
      }`}
      title="Return to Main Home Page"
      aria-label="Back to Home Page"
    >
      <Home className="w-4 h-4 text-emerald-400 group-hover:text-slate-950 transition-colors shrink-0" />
      <span className="text-xs font-extrabold tracking-wider hidden sm:inline uppercase">Home</span>
    </a>
  );
}
