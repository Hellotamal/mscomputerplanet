import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Check, 
  Copy, 
  Sparkles
} from 'lucide-react';

export default function SocialShareModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = 'https://www.mscomputerplanet.com';

  const sharePayloads = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Share directly to WhatsApp groups, contacts, or clients',
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      badge: 'Most Popular',
      getUrl: () => {
        const text = 
          `🌟 *M/S Computer Planet - Silchar, Assam*\n` +
          `Official Channel & Solar EPC Consultant Partner of Omnis Trades.\n\n` +
          `✅ *Turnkey Rooftop Solar:* Claim up to ₹78,000 Govt Subsidy under PM Surya Ghar Muft Bijli Yojana with APDCL net-metering.\n` +
          `✅ *Enterprise IT AMC & Hardware:* Trusted by Punjab National Bank, India Post & Southern Assam businesses for 99.8% uptime.\n\n` +
          `📍 100 KM Customer Service Radius across Cachar, Karimganj & Hailakandi.\n` +
          `👉 Check full details & get free site survey:\n` +
          `${currentUrl}?utm_source=whatsapp&utm_medium=social_share`;
        return `https://wa.me/?text=${encodeURIComponent(text)}`;
      }
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Recommend to corporate procurement, bank managers & IT leads',
      color: 'bg-blue-700 hover:bg-blue-600 text-white',
      badge: 'B2B Network',
      getUrl: () => {
        const shareUrl = `${currentUrl}?utm_source=linkedin&utm_medium=b2b_share`;
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Share with local communities, residential owners & business circles',
      color: 'bg-blue-600 hover:bg-blue-500 text-white',
      badge: 'Community',
      getUrl: () => {
        const shareUrl = `${currentUrl}?utm_source=facebook&utm_medium=community_share`;
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      }
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      description: 'Post clean energy, solar subsidy & digital tech updates',
      color: 'bg-slate-800 hover:bg-slate-700 text-white',
      badge: 'Trending',
      getUrl: () => {
        const text = `Explore M/S Computer Planet - Top IT AMC & Turnkey Solar EPC in Silchar, Assam. Official Omnis Trades Partner serving Southern Assam. #SolarEnergy #Assam #Silchar #ITServices`;
        const shareUrl = `${currentUrl}?utm_source=twitter&utm_medium=post`;
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
      }
    }
  ];

  const handleCopy = () => {
    const linkToCopy = `${currentUrl}?utm_source=direct_copy&utm_medium=referral`;
    navigator.clipboard.writeText(linkToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      alert('Link: ' + linkToCopy);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close share dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Digital Share & Referral Hub</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Share M/S Computer Planet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Recommend our Solar EPC consulting & IT hardware maintenance to colleagues, business partners, or family.
          </p>
        </div>

        {/* Share Buttons */}
        <div className="space-y-3 mb-6">
          {sharePayloads.map((platform) => (
            <a
              key={platform.id}
              href={platform.getUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full p-3 rounded-2xl flex items-center justify-between gap-3 font-semibold text-xs transition shadow-sm ${platform.color}`}
            >
              <div className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-bold">{platform.name}</div>
                  <div className="text-[10px] opacity-80">{platform.description}</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 font-medium">
                {platform.badge}
              </span>
            </a>
          ))}
        </div>

        {/* Copy Link Section */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Or Copy Direct Referral Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`${currentUrl}?utm_source=direct_copy`}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              Link copied with referral tracking parameters!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
