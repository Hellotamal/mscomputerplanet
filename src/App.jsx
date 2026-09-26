import React, { useState, useEffect, Suspense, lazy } from 'react';
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
import FloatingActions from './components/FloatingActions';
import OmnisPartnership from './components/OmnisPartnership';
import LocalSEOSection from './components/LocalSEOSection';
import FounderProfile from './components/FounderProfile';
import GalleryHallOfFame from './components/GalleryHallOfFame';
import B2BMarketplaceHub from './components/B2BMarketplaceHub';
import SecurityShield from './components/SecurityShield';
import HomeButton from './components/HomeButton';

// Code-split heavy interactive modals & enterprise ERP suite for ultra-fast mobile loading
const ERPApp = lazy(() => import('./erp/ERPApp'));
const QuoteModal = lazy(() => import('./components/QuoteModal'));
const SupportTicketModal = lazy(() => import('./components/SupportTicketModal'));
const SocialShareModal = lazy(() => import('./components/SocialShareModal'));
const LegalModal = lazy(() => import('./components/LegalModal'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const HardwareShop = lazy(() => import('./pages/HardwareShop'));
const CustomerComplaintApp = lazy(() => import('./pages/CustomerComplaintApp'));

export default function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteInitialData, setQuoteInitialData] = useState({});
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalActiveTab, setLegalActiveTab] = useState('privacy');
  const [isErpMode, setIsErpMode] = useState(() => {
    return window.location.hash === '#erp';
  });
  const [isShopMode, setIsShopMode] = useState(() => {
    const h = window.location.hash;
    return h === '#shop' || h === '#store' || h === '#buy';
  });
  const [isComplaintAppMode, setIsComplaintAppMode] = useState(() => {
    const h = window.location.hash;
    return h === '#complaint-app' || h === '#register-complaint' || h === '#track-ticket' || h === '#complaint';
  });
  const [blogPage, setBlogPage] = useState(() => {
    const h = window.location.hash;
    if (h.startsWith('#blog/')) return { type: 'post', slug: h.slice(6) };
    if (h === '#blog') return { type: 'listing' };
    return null;
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
      const h = window.location.hash;
      if (h === '#erp') {
        setIsErpMode(true);
        setIsShopMode(false);
        setIsComplaintAppMode(false);
        setBlogPage(null);
      } else if (h === '#shop' || h === '#store' || h === '#buy') {
        setIsShopMode(true);
        setIsErpMode(false);
        setIsComplaintAppMode(false);
        setBlogPage(null);
      } else if (h === '#complaint-app' || h === '#register-complaint' || h === '#track-ticket' || h === '#complaint') {
        setIsComplaintAppMode(true);
        setIsErpMode(false);
        setIsShopMode(false);
        setBlogPage(null);
      } else if (h === '#blog') {
        setBlogPage({ type: 'listing' });
        setIsErpMode(false);
        setIsShopMode(false);
        setIsComplaintAppMode(false);
      } else if (h.startsWith('#blog/')) {
        setBlogPage({ type: 'post', slug: h.slice(6) });
        setIsErpMode(false);
        setIsShopMode(false);
        setIsComplaintAppMode(false);
      } else if (h === '#support-ticket' || h === '#log-ticket' || h === '#ticket' || h === '#support') {
        setSupportModalOpen(true);
        setBlogPage(null);
        setIsShopMode(false);
        setIsComplaintAppMode(false);
      } else {
        setBlogPage(null);
        setIsShopMode(false);
        setIsComplaintAppMode(false);
      }
    };

    handleHashChange();

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

  const handleOpenSupportTicket = () => {
    setSupportModalOpen(true);
  };

  const handleCloseSupportTicket = () => {
    setSupportModalOpen(false);
  };

  const handleOpenShare = () => {
    setShareModalOpen(true);
  };

  const handleCloseShare = () => {
    setShareModalOpen(false);
  };

  const handleOpenLegal = (tab = 'privacy') => {
    setLegalActiveTab(tab);
    setLegalModalOpen(true);
  };

  const handleCloseLegal = () => {
    setLegalModalOpen(false);
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
      <Suspense fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xs font-bold tracking-widest uppercase text-slate-300">Loading Enterprise ERP Suite...</p>
        </div>
      }>
        <SecurityShield />
        <HomeButton />
        <ERPApp onExit={handleExitERP} />
      </Suspense>
    );
  }

  // Blog pages (lazy-loaded, code-split)
  if (blogPage) {
    const blogFallback = (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
    return (
      <Suspense fallback={blogFallback}>
        <HomeButton />
        {blogPage.type === 'listing' ? (
          <Blog
            onNavigateToPost={(slug) => {
              window.location.hash = `blog/${slug}`;
              setBlogPage({ type: 'post', slug });
            }}
          />
        ) : (
          <BlogPost
            slug={blogPage.slug}
            onNavigateBack={() => {
              window.location.hash = 'blog';
              setBlogPage({ type: 'listing' });
            }}
          />
        )}
      </Suspense>
    );
  }

  // IT Hardware Direct Store page (lazy-loaded)
  if (isShopMode) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <HomeButton />
        <HardwareShop onBackToHome={() => { window.location.hash = ''; setIsShopMode(false); }} />
      </Suspense>
    );
  }

  // Customer Mobile Complaint App (lazy-loaded)
  if (isComplaintAppMode) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <HomeButton />
        <CustomerComplaintApp onBackToHome={() => { window.location.hash = ''; setIsComplaintAppMode(false); }} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased transition-colors duration-300">
      {/* Client-side Anti-Scrape & Security Shield */}
      <SecurityShield />

      {/* Persistent Top-Left Home Icon Button */}
      <HomeButton />

      {/* Top Navigation with ERP link and Day/Night Theme Toggle */}
      <Navbar 
        onOpenQuote={handleOpenQuote} 
        onOpenERP={handleOpenERP}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSupportTicket={handleOpenSupportTicket}
      />

      {/* Main Content */}
      <main className="flex-grow">
        <Hero onOpenQuote={handleOpenQuote} onOpenSupportTicket={handleOpenSupportTicket} />
        <TrustBar />
        <OmnisPartnership onOpenQuote={handleOpenQuote} />
        <ServicesIT onOpenQuote={handleOpenQuote} onOpenSupportTicket={handleOpenSupportTicket} />
        <ServicesSolar onOpenQuote={handleOpenQuote} />
        <SolarCalculator onOpenQuote={handleOpenQuote} />
        <ProductsCatalog onOpenQuote={handleOpenQuote} />
        <ClienteleTrack />
        <B2BMarketplaceHub onOpenQuote={handleOpenQuote} onOpenShare={handleOpenShare} />
        <FounderProfile onOpenQuote={handleOpenQuote} />
        <GalleryHallOfFame onOpenQuote={handleOpenQuote} />
        <LocalSEOSection onOpenQuote={handleOpenQuote} />
        <ContactSection onOpenSupportTicket={handleOpenSupportTicket} />
      </main>

      {/* Footer */}
      <Footer onOpenERP={handleOpenERP} onOpenLegal={handleOpenLegal} />

      {/* Lazy-loaded Interactive Modals */}
      <Suspense fallback={null}>
        {quoteModalOpen && (
          <QuoteModal
            isOpen={quoteModalOpen}
            onClose={handleCloseQuote}
            initialData={quoteInitialData}
          />
        )}
        {supportModalOpen && (
          <SupportTicketModal
            isOpen={supportModalOpen}
            onClose={handleCloseSupportTicket}
          />
        )}
        {shareModalOpen && (
          <SocialShareModal
            isOpen={shareModalOpen}
            onClose={handleCloseShare}
          />
        )}
        {legalModalOpen && (
          <LegalModal
            isOpen={legalModalOpen}
            onClose={handleCloseLegal}
            initialTab={legalActiveTab}
          />
        )}
      </Suspense>

      {/* Floating & Sticky Action Bars */}
      <FloatingActions 
        onOpenQuote={handleOpenQuote}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenShare={handleOpenShare}
        onOpenSupportTicket={handleOpenSupportTicket}
      />
    </div>
  );
}
