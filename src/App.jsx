import React, { useState } from 'react';
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
import ERPModal from './components/ERPModal';
import FloatingActions from './components/FloatingActions';

export default function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteInitialData, setQuoteInitialData] = useState({});
  const [erpModalOpen, setErpModalOpen] = useState(false);

  const handleOpenQuote = (data = {}) => {
    setQuoteInitialData(data);
    setQuoteModalOpen(true);
  };

  const handleCloseQuote = () => {
    setQuoteModalOpen(false);
    setQuoteInitialData({});
  };

  const handleOpenERP = () => {
    setErpModalOpen(true);
  };

  const handleCloseERP = () => {
    setErpModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Navigation */}
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

      {/* Backend Operations & ERP Gateway Modal */}
      <ERPModal
        isOpen={erpModalOpen}
        onClose={handleCloseERP}
      />

      {/* Floating & Sticky Action Bars */}
      <FloatingActions onOpenQuote={handleOpenQuote} />
    </div>
  );
}
