import React, { useState } from 'react';
import { PRODUCTS_LIST } from '../data/productsServices';
import { 
  Package, 
  MessageSquare, 
  ArrowUpRight, 
  Shield 
} from 'lucide-react';

export default function ProductsCatalog({ onOpenQuote }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const allItems = PRODUCTS_LIST.flatMap((cat) => cat.items.map(item => ({ ...item, parentCategory: cat.category })));
  
  const displayedItems = selectedCategory === 'All' 
    ? allItems 
    : allItems.filter(item => item.parentCategory === selectedCategory);

  return (
    <section id="products" className="py-20 bg-slate-100/70 dark:bg-slate-950 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Package className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" />
            Hardware & Renewable Equipment Sales
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Commercial Hardware & Clean Energy Catalog
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Genuine multi-brand enterprise computing systems, networking gears, and Tier-1 solar generation components with authorized OEM warranties.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            {['All', 'IT Hardware', 'Renewable Energy'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 dark:bg-sky-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat === 'All' ? 'All Products' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedItems.map((item, idx) => {
            const isSolar = item.parentCategory === 'Renewable Energy';
            const whatsappMsg = encodeURIComponent(`Hello M/S Computer Planet, I want to inquire about availability and pricing for: ${item.name}`);
            const itemWhatsappUrl = `https://wa.me/918638083712?text=${whatsappMsg}`;

            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card hover:shadow-xl dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  {/* Image Container with Fallback Overlay */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>
                    <span className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm text-white ${
                      isSolar ? 'bg-emerald-600' : 'bg-sky-600'
                    }`}>
                      {item.tag}
                    </span>
                    <span className="absolute bottom-3 left-3 text-xs font-semibold text-white/90 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.brands.split('/')[0]} & Partners</span>
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-slate-700 dark:group-hover:text-sky-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {item.specs}
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-950/70 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Brands & Makes: </span>
                      {item.brands}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 mt-2">
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      onClick={() => onOpenQuote({ serviceName: item.name, category: item.parentCategory })}
                      className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-center"
                    >
                      Get Quote
                    </button>
                    <a
                      href={itemWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition text-center shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Institutional Bulk Supply Notice */}
        <div className="mt-12 text-center bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl mx-auto">
          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
            Need Bulk Hardware Supply or Custom Institutional Procurement?
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4">
            We handle GeM (Government e-Marketplace) compliance, enterprise tenders, educational computer labs, and multi-kW rooftop installations.
          </p>
          <button
            onClick={() => onOpenQuote({ serviceName: 'Bulk Institutional Procurement / GeM Tender', category: 'General' })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 dark:bg-sky-600 text-white hover:bg-slate-800 dark:hover:bg-sky-500 transition"
          >
            <span>Inquire for Institutional Bulk Rates</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
