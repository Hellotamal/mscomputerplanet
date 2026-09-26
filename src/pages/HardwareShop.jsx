import React, { useState, useEffect } from 'react';
import { HARDWARE_STORE_PRODUCTS } from '../data/hardwareProducts';
import DirectOrderModal from '../components/DirectOrderModal';
import {
  ShoppingBag,
  Search,
  ShieldCheck,
  Truck,
  Check,
  Phone,
  FileCheck,
  Wrench
} from 'lucide-react';

export default function HardwareShop({ onBackToHome }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    document.title = 'IT Hardware Store & Direct Buy | M/S Computer Planet Silchar';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const categories = ['All', 'Desktops & Laptops', 'Printers & Banking', 'Components & Power', 'Networking & Security'];

  const filteredProducts = HARDWARE_STORE_PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.specs.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased">
      {/* Direct Purchase Modal */}
      {selectedProduct && (
        <DirectOrderModal
          isOpen={orderModalOpen}
          onClose={() => { setOrderModalOpen(false); setSelectedProduct(null); }}
          product={selectedProduct}
        />
      )}

      {/* Hero Header */}
      <header className="relative pt-24 pb-16 px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-4 shadow-inner">
            <ShoppingBag className="w-4 h-4" />
            <span>Direct Commercial IT Hardware Store</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Buy IT Hardware Directly Online
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-8">
            Genuine multi-brand enterprise desktops, commercial laptops, LaserJet & passbook printers, SMPS power units, and networking equipment in Silchar. Delivered directly with GST tax invoice and OEM warranty.
          </p>

          {/* Quick Assurance Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>24-48 Hour Delivery in Silchar & Cachar</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>100% Genuine OEM Warranty</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <FileCheck className="w-4 h-4 text-purple-400" />
              <span>Official GST Tax Invoice (B2B Credit)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Store Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search desktops, laptops, printers, RAM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    {product.tags.map((tag, ti) => (
                      <span key={ti} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {product.discount && (
                    <span className="absolute top-3 right-3 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-500 text-white shadow-md">
                      {product.discount}
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {product.specs}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      {product.stock}
                    </span>
                    <span>{product.warranty}</span>
                  </div>

                  <div className="text-[10px] text-sky-400 font-medium bg-sky-950/60 border border-sky-800/50 rounded-lg px-2 py-1 flex items-center justify-between">
                    <span>⚡ RAM / SSD / Warranty Upgrades</span>
                    <span className="font-semibold text-emerald-400">Modifiable</span>
                  </div>
                </div>
              </div>

              {/* Price & Direct Buy Button */}
              <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-slate-800/40 mt-2">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Direct Price</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-white font-mono">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.mrp && (
                      <span className="text-xs text-slate-500 line-through font-mono">
                        ₹{product.mrp.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBuyClick(product)}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 shrink-0"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Customize & Buy</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Support & Bulk Purchase CTA Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-sky-950/60 border border-emerald-500/30 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Need Bulk Hardware Procurement for your Office or Bank?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            We provide specialized B2B pricing, GeM portal invoicing, and customized AMC installation for Punjab National Bank, India Post, schools, and corporate offices across Barak Valley.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="tel:+918638083712"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call Sales: +91 86380 83712</span>
            </a>
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                ← Back to Main Website
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
