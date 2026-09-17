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
import ERPApp from './erp/ERPApp';
import SecurityShield from './components/SecurityShield';

export default function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteInitialData, setQuoteInitialData] = useState({});
  const [isErpMode, setIsErpMode] = useState(() => {
    return window.location.hash === '#erp';
  });

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Client-side Anti-Scrape & Security Shield */}
      <SecurityShield />

      {/* Top Navigation with ERP link */}
      <Navbar onOpenQuote={handleOpenQuote} onOpenERP={handleOpenERP} />

      {/* Main Content */}
      <main className="flex-grow">
        <Hero onOpenQuote={handleOpenQuote} />
        <TrustBar />
        <ServicesIT onOpenQuote={handleOpenQuote} />
        <ServicesSolar onOpenQuote={handleOpenQuote} />
        <SolarCalculator onOpenQuote={handleOpenQuote} />
        <ProductsCatalog onOpenQuote={handleOpenQuote} />
        <ClienteleTrack />
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
      <FloatingActions onOpenQuote={handleOpenQuote} />
    </div>
  );
}
