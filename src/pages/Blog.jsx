import React, { useEffect } from 'react';
import { BLOG_POSTS } from '../data/blogPosts';
import { BookOpen, Tag, Clock, ArrowRight, Sun, Cpu, Rss, Phone } from 'lucide-react';

const categoryIcons = {
  'Solar Energy': Sun,
  'IT & Technology': Cpu,
};

const categoryBg = {
  'Solar Energy': 'bg-emerald-600/80',
  'IT & Technology': 'bg-sky-600/80',
};

export default function Blog({ onNavigateToPost }) {
  useEffect(() => {
    document.title = 'Blog – IT AMC & Solar EPC Articles | M/S Computer Planet Silchar';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Push AdSense ads after page load
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
        window.adsbygoogle.push({});
      }
    } catch {
      // AdSense script fallback
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 pt-28 pb-16 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Rss className="w-3.5 h-3.5" />
            Knowledge Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
            IT & Solar Energy Insights
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Expert guides on solar subsidies, IT maintenance, and technology for businesses
            in Silchar, Cachar, Karimganj, and Hailakandi.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* AdSense – Top of Blog */}
        <div className="w-full flex justify-center mb-10 min-h-[90px]">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-2887274841506101"
            data-ad-slot="auto"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => {
            const Icon = categoryIcons[post.category] || BookOpen;
            const bgClass = categoryBg[post.category] || 'bg-slate-600/80';
            return (
              <article
                key={post.id}
                className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 hover:shadow-2xl hover:shadow-slate-900/50 transition-all duration-300 cursor-pointer flex flex-col"
                onClick={() => onNavigateToPost(post.slug)}
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden shrink-0">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${bgClass} backdrop-blur-sm text-white text-xs font-bold`}>
                    <Icon className="w-3 h-3" />
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                    <span>•</span>
                    <span>{post.publishedDate}</span>
                  </div>

                  <h2 className="font-bold text-white text-base leading-snug mb-3 group-hover:text-emerald-400 transition-colors line-clamp-3 flex-1">
                    {post.title}
                  </h2>

                  <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs">
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors group/btn mt-auto"
                    onClick={(e) => { e.stopPropagation(); onNavigateToPost(post.slug); }}
                  >
                    Read Full Article
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mid-page AdSense */}
        <div className="w-full flex justify-center my-12 min-h-[90px]">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-2887274841506101"
            data-ad-slot="auto"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {/* CTA Section */}
        <div className="mt-4 p-8 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-sky-950/50 border border-emerald-800/30 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Need Expert Advice?</h3>
          <p className="text-slate-300 text-sm mb-5">
            Our team in Silchar is available 6 days a week. Call us for a free consultation
            on solar installation or IT maintenance.
          </p>
          <a
            href="tel:+918638083712"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20"
          >
            <Phone className="w-4 h-4" />
            Call +91 86380 83712
          </a>
        </div>
      </div>
    </div>
  );
}
