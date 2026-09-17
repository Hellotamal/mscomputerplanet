import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

export default function SecurityShield() {
  const [alertNotice, setAlertNotice] = useState(null);

  const showAlert = (message) => {
    setAlertNotice(message);
    setTimeout(() => {
      setAlertNotice(null);
    }, 2800);
  };

  useEffect(() => {
    // 1. Block Context Menu (Right Click)
    const handleContextMenu = (e) => {
      const target = e.target;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      if (!isInput) {
        e.preventDefault();
        showAlert("🔒 Content Protected: Source code, data, and media are proprietary to M/S COMPUTER PLANET. Unauthorized duplication is prohibited.");
      }
    };

    // 2. Block Inspect & View Source Shortcuts
    const handleKeyDown = (e) => {
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';

      // F12 key (DevTools)
      if (e.keyCode === 123) {
        e.preventDefault();
        showAlert("🔒 Developer tools inspection is restricted to protect proprietary business logic and client data.");
        return;
      }

      // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element picker)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        showAlert("🔒 Developer tools inspection is restricted.");
        return;
      }

      // Cmd+Option+I (Mac Inspect)
      if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        showAlert("🔒 Developer tools inspection is restricted.");
        return;
      }

      // Ctrl+U / Cmd+U (View Page Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        showAlert("🔒 View Source is disabled. Source code is intellectual property of M/S COMPUTER PLANET.");
        return;
      }

      // Ctrl+S / Cmd+S (Save Webpage)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        if (!isInput) {
          e.preventDefault();
          showAlert("🔒 Direct page archiving is disabled.");
          return;
        }
      }
    };

    // 3. Block Image and Media Dragging
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG' || e.target.tagName === 'SVG') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  if (!alertNotice) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md bg-slate-950 text-white px-4 py-3 rounded-2xl border border-amber-500/40 shadow-2xl shadow-slate-950/80 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none">
      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
        <Lock className="w-4 h-4" />
      </div>
      <div>
        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          Security & IP Protection
        </div>
        <div className="text-xs text-slate-200 mt-0.5 leading-relaxed">
          {alertNotice}
        </div>
      </div>
    </div>
  );
}
