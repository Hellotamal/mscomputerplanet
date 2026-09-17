import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import ServicesIT from './components/ServicesIT';
import ServicesSolar from './components/ServicesSolar';
import SolarCalculator from './components/SolarCalculator';
import ProductsCatalog from './components/ProductsCatalog';
import ClienteleTrack from './components/ClienteleTrack';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import QuoteModal from './components/QuoteModal';
import FloatingActions from './components/FloatingActions';
import OmnisPartnership from './components/OmnisPartnership';
import LocalSEOSection from './components/LocalSEOSection';
import FounderProfile from './components/FounderProfile';
import GalleryHallOfFame from './components/GalleryHallOfFame';
import ERPApp from './erp/ERPApp';
import SecurityShield from './components/SecurityShield';

export default function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteInitialData, setQuoteInitialData] = useState({});
  const [isErpMode, setIsErpMode] = useState(() => {
    return window.location.hash === '#erp';
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('cp_theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('cp_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('cp_theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#erp') {
        setIsErpMode(true);
      }
    };

    // Discreet shortcut for authorized administration: Ctrl+Shift+E or Alt+E
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) || 
          (e.altKey && (e.key === 'E' || e.key === 'e'))) {
        e.preventDefault();
        window.location.hash = 'erp';
        setIsErpMode(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenQuote = (data = {}) => {
    setQuoteInitialData(data);
    setQuoteModalOpen(true);
  };

  const handleCloseQuote = () => {
    setQuoteModalOpen(false);
    setQuoteInitialData({});
  };

  const handleOpenERP = () => {
    window.location.hash = 'erp';
    setIsErpMode(true);
  };

  const handleExitERP = () => {
    window.location.hash = '';
    setIsErpMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in ERP mode, render full-featured business ERP Workspace
  if (isErpMode) {
    return (
      <>
        <SecurityShield />
        <ERPApp onExit={handleExitERP} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased transition-colors duration-300">
      {/* Client-side Anti-Scrape & Security Shield */}
      <SecurityShield />

      {/* Top Navigation with ERP link and Day/Night Theme Toggle */}
      <Navbar 
        onOpenQuote={handleOpenQuote} 
        onOpenERP={handleOpenERP}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content */}
      <main className="flex-grow">
        <Hero onOpenQuote={handleOpenQuote} />
        <TrustBar />
        <OmnisPartnership onOpenQuote={handleOpenQuote} />
        <ServicesIT onOpenQuote={handleOpenQuote} />
        <ServicesSolar onOpenQuote={handleOpenQuote} />
        <SolarCalculator onOpenQuote={handleOpenQuote} />
        <ProductsCatalog onOpenQuote={handleOpenQuote} />
        <ClienteleTrack />
        <FounderProfile onOpenQuote={handleOpenQuote} />
        <GalleryHallOfFame onOpenQuote={handleOpenQuote} />
        <LocalSEOSection onOpenQuote={handleOpenQuote} />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenERP={handleOpenERP} />

      {/* Quote & Estimate Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={handleCloseQuote}
        initialData={quoteInitialData}
      />

      {/* Floating & Sticky Action Bars */}
      <FloatingActions 
        onOpenQuote={handleOpenQuote}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}
