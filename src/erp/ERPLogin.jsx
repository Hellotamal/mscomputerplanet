import React, { useState } from 'react';
import { getErpPin } from './erpStorage';
import { Lock, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';

export default function ERPLogin({ onLoginSuccess, onBackToSite }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPin = getErpPin();
    if (pin === correctPin) {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid Access PIN. (Default master PIN is 1234)');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white relative">
      <div className="absolute top-6 left-6">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Website</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 p-0.5 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Lock className="w-7 h-7 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            M/S COMPUTER PLANET
          </h2>
          <p className="text-xs uppercase font-bold text-emerald-400 tracking-wider mt-1">
            Backend ERP & Operations Portal
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Enter authorized PIN to manage service tickets, AMCs, stock inventory, and GST billing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Staff / Owner Access PIN
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength="8"
                autoFocus
                required
                placeholder="Enter PIN (Default: 1234)"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                className="w-full py-3 px-4 text-center tracking-[0.5em] text-lg font-mono font-bold rounded-2xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs text-rose-400 bg-rose-950/50 border border-rose-900/60 p-2.5 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-950 transition flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Unlock ERP Dashboard</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
          <div className="flex items-center justify-center gap-1.5 text-emerald-500/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Internal Business Software • Data Persists in Your Browser</span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1">
            Default Master PIN: <strong className="text-slate-400 font-mono">1234</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
