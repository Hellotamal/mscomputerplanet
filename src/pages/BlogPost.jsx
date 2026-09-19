import React, { useEffect, useMemo } from 'react';
import { BLOG_POSTS } from '../data/blogPosts';
import { ArrowLeft, Clock, Tag, Share2, Phone } from 'lucide-react';

export default function BlogPost({ slug, onNavigateBack }) {
  const post = useMemo(() => BLOG_POSTS.find((p) => p.slug === slug), [slug]);

  useEffect(() => {
    if (post) {
      document.title = post.metaTitle;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Initialise AdSense units
    try {
      const ads = document.querySelectorAll('.adsbygoogle:not([data-ad-status])');
      ads.forEach(() => {
        if (window.adsbygoogle) window.adsbygoogle.push({});
      });
    } catch {
      // AdSense script fallback
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <button
            onClick={onNavigateBack}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition"
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const shareUrl = `https://www.mscomputerplanet.com/blog/${post.slug}`;
  const shareText = encodeURIComponent(`${post.title} – ${shareUrl}`);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Article Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.metaDescription,
            image: post.coverImage,
            datePublished: post.publishedISO,
            dateModified: post.publishedISO,
            author: {
              '@type': 'Organization',
              name: 'M/S Computer Planet',
              url: 'https://www.mscomputerplanet.com',
            },
            publisher: {
              '@type': 'Organization',
              name: 'M/S Computer Planet',
              url: 'https://www.mscomputerplanet.com',
            },
            url: shareUrl,
            mainEntityOfPage: shareUrl,
          }),
        }}
      />

      {/* Back Button */}
      <div className="pt-24 pb-0 px-4 max-w-4xl mx-auto">
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Blog
        </button>
      </div>

      {/* Cover Image */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="rounded-2xl overflow-hidden h-56 sm:h-80">
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
          <span>•</span>
          <span>{post.publishedDate}</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">{post.category}</span>
          <span>•</span>
          <span>By {post.author}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-6">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 border-l-4 border-emerald-500 pl-4 italic">
          {post.excerpt}
        </p>

        {/* AdSense – Top of article */}
        <div className="w-full flex justify-center my-6 min-h-[90px]">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-2887274841506101"
            data-ad-slot="auto"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {/* Article Sections */}
        <article className="space-y-8">
          {post.sections.map((section, idx) => (
            <React.Fragment key={idx}>
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 border-b border-slate-800 pb-2">
                  {section.heading}
                </h2>
                <p className="text-slate-300 leading-relaxed text-base">
                  {section.body}
                </p>
              </section>
              {/* Insert mid-article AdSense after section 3 */}
              {idx === 3 && (
                <div className="w-full flex justify-center my-4 min-h-[90px]">
                  <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-2887274841506101"
                    data-ad-slot="auto"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </article>

        {/* AdSense – Bottom of article */}
        <div className="w-full flex justify-center my-10 min-h-[90px]">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-2887274841506101"
            data-ad-slot="auto"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs border border-slate-700"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        {/* Social Share */}
        <div className="flex flex-wrap items-center gap-3 mb-10 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="flex items-center gap-1.5 text-slate-400 text-sm font-semibold">
            <Share2 className="w-4 h-4" />
            Share this article:
          </span>
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-semibold transition"
          >
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
          >
            Facebook
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold transition"
          >
            LinkedIn
          </a>
        </div>

        {/* CTA */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-sky-950/60 border border-emerald-800/30 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Ready to Get Started?</h3>
          <p className="text-slate-300 text-sm mb-4">
            Contact M/S Computer Planet — Silchar&apos;s trusted IT AMC &amp; Solar EPC partner for a free consultation.
          </p>
          <a
            href="tel:+918638083712"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20"
          >
            <Phone className="w-4 h-4" />
            Call +91 86380 83712
          </a>
        </div>
      </div>
    </div>
  );
}
