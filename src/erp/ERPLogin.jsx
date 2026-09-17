import React, { useState, useEffect } from 'react';
import { authenticateErpUserAsync } from './erpStorage';
import { 
  checkBruteForceLockout, 
  recordFailedAttempt, 
  resetFailedAttempts 
} from './erpSecurity';
import { Lock, ArrowLeft, ShieldCheck, KeyRound, AlertTriangle, Clock } from 'lucide-react';

export default function ERPLogin({ onLoginSuccess, onBackToSite }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [lockoutState, setLockoutState] = useState(() => checkBruteForceLockout());
  const [countdownSeconds, setCountdownSeconds] = useState(0);

  // Sync lockout timer countdown
  useEffect(() => {
    const checkStatus = () => {
      const status = checkBruteForceLockout();
      setLockoutState(status);
      if (status.isLocked) {
        setCountdownSeconds(status.lockoutRemainingMinutes * 60);
      } else {
        setCountdownSeconds(0);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // Per-second countdown timer when locked
  useEffect(() => {
    if (lockoutState.isLocked && countdownSeconds > 0) {
      const timer = setInterval(() => {
        setCountdownSeconds(prev => {
          if (prev <= 1) {
            setLockoutState(checkBruteForceLockout());
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutState.isLocked, countdownSeconds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lockoutState.isLocked || isAuthenticating) return;

    setIsAuthenticating(true);
    setError('');

    try {
      // Artificial 500ms delay to deter high-speed automated brute-forcing
      await new Promise(resolve => setTimeout(resolve, 500));

      const authResult = await authenticateErpUserAsync(pin);
      if (authResult.success) {
        resetFailedAttempts();
        setError('');
        onLoginSuccess(authResult.user);
      } else {
        const updatedStatus = recordFailedAttempt();
        setLockoutState(updatedStatus);
        if (updatedStatus.isLocked) {
          setCountdownSeconds(updatedStatus.lockoutRemainingMinutes * 60);
          setError(`Security Lockout: Too many failed attempts. Terminal locked for 10 minutes.`);
        } else {
          setError(
            `${authResult.message || 'Invalid Access PIN.'} (${updatedStatus.remainingAttempts} attempt${updatedStatus.remainingAttempts === 1 ? '' : 's'} left before lockout)`
          );
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("An unexpected authentication error occurred.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
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
            Enter authorized PIN to access internal management portal.
          </p>
        </div>

        {lockoutState.isLocked ? (
          <div className="bg-rose-950/40 border border-rose-800/80 rounded-2xl p-5 text-center mb-4 space-y-3">
            <div className="w-10 h-10 rounded-full bg-rose-900/60 border border-rose-700 flex items-center justify-center mx-auto text-rose-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-300">Security Auto-Lockout Active</h3>
              <p className="text-xs text-rose-300/80 mt-1">
                5 consecutive invalid attempts detected. Protection mode activated.
              </p>
            </div>
            <div className="text-2xl font-mono font-black text-rose-400">
              {formatCountdown(countdownSeconds)}
            </div>
            <p className="text-[11px] text-slate-400">
              Access will resume once cooldown expires. Please contact Proprietor for assistance.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
                Enter Access PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength="8"
                  autoFocus
                  required
                  disabled={isAuthenticating}
                  placeholder="•••••"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError('');
                  }}
                  className="w-full py-3 px-4 text-center tracking-[0.5em] text-lg font-mono font-bold rounded-2xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white disabled:opacity-50"
                />
              </div>
            </div>

            {error && (
              <div className="text-xs text-rose-400 bg-rose-950/50 border border-rose-900/60 p-2.5 rounded-xl text-center flex items-center justify-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-950 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isAuthenticating ? "Verifying Credentials..." : "Unlock ERP Dashboard"}</span>
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
          <div className="flex items-center justify-center gap-1.5 text-emerald-500/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Restricted Access • Salted SHA-256 Encryption Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
