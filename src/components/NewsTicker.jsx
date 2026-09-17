import React, { useState } from 'react';
import { LOCAL_NEWS_DATA, NEWS_CATEGORIES } from '../data/localNewsData';
import { 
  Sun, 
  Cpu, 
  Radio, 
  Play, 
  Pause, 
  ExternalLink, 
  X, 
  Newspaper, 
  ChevronRight, 
  Search
} from 'lucide-react';

export default function NewsTicker({ onOpenQuote }) {
  const [isPaused, setIsPaused] = useState(false);
  const [newsList] = useState(LOCAL_NEWS_DATA);
  const [selectedNews, setSelectedNews] = useState(null);
  const [activeCategory, setActiveCategory] = useState(NEWS_CATEGORIES.ALL);
  const [isAllModalOpen, setIsAllModalOpen] = useState(false);

  // Filter items for modal
  const filteredModalNews = activeCategory === NEWS_CATEGORIES.ALL
    ? newsList
    : newsList.filter(item => item.category === activeCategory);

  const getBadgeColorClasses = (color) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'sky':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'amber':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'blue':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'purple':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <>
      {/* Ticker Bar Container */}
      <div 
        className="relative z-40 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-b border-slate-800/80 text-xs shadow-sm overflow-hidden select-none"
        aria-label="Latest local news and industry updates"
      >
        <div className="max-w-7xl mx-auto flex items-stretch">
          {/* Static Left Badge */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-950/90 to-slate-900 border-r border-slate-800 shrink-0 z-10 shadow-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold uppercase tracking-wider text-[10px] sm:text-[11px] text-emerald-400 flex items-center gap-1.5">
              <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
              <span>Live News</span>
            </span>
            <span className="hidden md:inline-flex items-center text-[10px] text-slate-400 font-medium border-l border-slate-800 pl-2">
              Google News Verified
            </span>
          </div>

          {/* Scrolling Marquee Track */}
          <div 
            className="relative flex-1 overflow-hidden flex items-center py-2"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Soft fade gradients on edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none z-10"></div>

            <div className={`animate-ticker flex items-center gap-8 ${isPaused ? 'ticker-paused' : ''}`}>
              {/* Duplicate array for seamless infinite marquee loop */}
              {[...newsList, ...newsList].map((item, idx) => (
                <div 
                  key={`${item.id}-${idx}`}
                  onClick={() => setSelectedNews(item)}
                  className="inline-flex items-center gap-2 cursor-pointer group hover:text-emerald-300 transition-colors whitespace-nowrap"
                  title="Click to view full news details"
                >
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeColorClasses(item.badgeColor)}`}>
                    {item.badge}
                  </span>
                  <span className="font-semibold text-slate-200 group-hover:text-emerald-300 text-xs">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    • {item.source}
                  </span>
                  <span className="text-slate-600 px-1">•</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 bg-slate-900 border-l border-slate-800 shrink-0 z-10">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={isPaused ? "Resume automated scrolling" : "Pause scrolling"}
              aria-label={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </button>
            <button
              onClick={() => setIsAllModalOpen(true)}
              className="px-2 py-1 rounded text-[10px] sm:text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition inline-flex items-center gap-1 border border-slate-800"
              title="View all latest news"
            >
              <Newspaper className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">All News ({newsList.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Single News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getBadgeColorClasses(selectedNews.badgeColor)}`}>
                {selectedNews.badge}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {selectedNews.date}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug mb-3">
              {selectedNews.title}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
              {selectedNews.summary}
            </p>

            <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 mb-6 text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Verified Source: </span>
                <span>{selectedNews.source}</span>
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Topic: {selectedNews.tag}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(selectedNews.title)}&tbm=nws`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Verify on Google News</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>

              {selectedNews.category.includes('Solar') ? (
                <button
                  onClick={() => {
                    setSelectedNews(null);
                    onOpenQuote({ serviceName: 'PM Surya Ghar Solar Rooftop Feasibility', category: 'Solar Energy' });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition"
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Apply for Solar Subsidy</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedNews(null);
                    onOpenQuote({ serviceName: 'Enterprise IT AMC & Hardware Maintenance', category: 'IT Support & AMC' });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Inquire IT Support</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* All News Modal */}
      {isAllModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col relative">
            <button
              onClick={() => setIsAllModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close all news modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Radio className="w-3 h-3 text-emerald-600" />
                Live Feed & Dispatch
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Today's Local IT, Solar & Regional News
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Verified headlines from Google News, The Assam Tribune, The Sentinel Assam, and APDCL.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
              {Object.values(NEWS_CATEGORIES).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeCategory === cat
                      ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* News Cards List */}
            <div className="overflow-y-auto space-y-3.5 pr-1 flex-1">
              {filteredModalNews.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => {
                    setIsAllModalOpen(false);
                    setSelectedNews(item);
                  }}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:bg-white dark:hover:bg-slate-800/90 hover:border-emerald-300 dark:hover:border-emerald-500/50 transition cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeColorClasses(item.badgeColor)}`}>
                      {item.badge}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.date}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span>Source: {item.source}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      Read Full Detail <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
