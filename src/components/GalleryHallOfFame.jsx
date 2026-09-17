import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Landmark, 
  ArrowRight
} from 'lucide-react';
import { GALLERY_ITEMS } from '../data/galleryData';

export default function GalleryHallOfFame({ onOpenQuote }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeModalItem, setActiveModalItem] = useState(null);

  const categories = [
    { id: 'all', label: 'All Highlights' },
    { id: 'Felicitation & Awards', label: 'Felicitation & Awards' },
    { id: 'Banking & Enterprise', label: 'Banking & Enterprise' },
    { id: 'Team & Culture', label: 'Team & Culture' },
  ];

  const filteredItems = activeFilter === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeFilter);

  const handleOpenModal = (item) => {
    setActiveModalItem(item);
  };

  const handleCloseModal = () => {
    setActiveModalItem(null);
  };

  const handleNext = () => {
    if (!activeModalItem) return;
    const currentIndex = GALLERY_ITEMS.findIndex(i => i.id === activeModalItem.id);
    const nextIndex = (currentIndex + 1) % GALLERY_ITEMS.length;
    setActiveModalItem(GALLERY_ITEMS[nextIndex]);
  };

  const handlePrev = () => {
    if (!activeModalItem) return;
    const currentIndex = GALLERY_ITEMS.findIndex(i => i.id === activeModalItem.id);
    const prevIndex = (currentIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
    setActiveModalItem(GALLERY_ITEMS[prevIndex]);
  };

  return (
    <section id="gallery" className="py-20 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Hall of Fame • Executive Gallery & Milestones
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Wall of Honor & Proven Trust
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Real institutional moments, high-level banking summits, official felicitations by Punjab National Bank,
            and the passionate team driving technological excellence across Assam.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeFilter === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-bold shadow-lg shadow-amber-950/40 scale-105'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenModal(item)}
              className="group bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-400/50 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container with Hover Effects */}
              <div className="relative h-72 sm:h-80 overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 filter brightness-95 group-hover:brightness-105"
                  loading="lazy"
                />
                
                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                {/* Top Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.badge}</span>
                  </span>
                </div>

                {/* Enlarge Trigger Icon */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:border-amber-400 transition">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Location & Date Pill at Bottom Left */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg backdrop-blur-md border border-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="truncate max-w-[180px] sm:max-w-none">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg backdrop-blur-md border border-slate-800 font-mono text-[11px] text-amber-300">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>

              {/* Text Information Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-2">
                    {item.categoryTag}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {item.summary}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                  <span>Click to view full photo & record</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Credibility Callout Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                Partner With Assam's Most Trusted IT & Clean Energy Team
              </h4>
              <p className="text-xs sm:text-sm text-slate-400">
                Backed by 10+ years of institutional compliance, verified PNB felicitations, and seamless regional support.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenQuote({ serviceName: 'Enterprise Partnership Inquiry', category: 'General Inquiry' })}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md whitespace-nowrap transition"
          >
            Initiate Enterprise Engagement
          </button>
        </div>

      </div>

      {/* Lightbox / Modal View */}
      {activeModalItem && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Hall of Fame Record
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Previous Photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Next Photo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition ml-2"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Image Display */}
            <div className="relative bg-black flex items-center justify-center max-h-[55vh] overflow-hidden">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.title}
                className="max-h-[55vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Modal Details Body */}
            <div className="p-6 sm:p-8 bg-slate-900 overflow-y-auto">
              <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                <span className="text-emerald-400 font-bold">{activeModalItem.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {activeModalItem.location}
                </span>
                <span>•</span>
                <span>{activeModalItem.date}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                {activeModalItem.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                {activeModalItem.summary}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeModalItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
