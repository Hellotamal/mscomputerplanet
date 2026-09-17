import React, { useState, useEffect } from 'react';
import { verifyTerminalPinAsync, authenticateUserCredentialsAsync } from './erpStorage';
import { 
  checkBruteForceLockout, 
  recordFailedAttempt, 
  resetFailedAttempts 
} from './erpSecurity';
import { 
  Lock, 
  ArrowLeft, 
  ShieldCheck, 
  KeyRound, 
  AlertTriangle, 
  Clock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldAlert,
  ChevronRight,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export default function ERPLogin({ onLoginSuccess, onBackToSite }) {
  // Step 1: Terminal Access PIN | Step 2: Main Login (User ID + Password)
  const [step, setStep] = useState(() => {
    return sessionStorage.getItem("mcp_erp_terminal_unlocked") === "true" ? 2 : 1;
  });

  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  // Step 1: Verify Terminal Security PIN
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (lockoutState.isLocked || isAuthenticating) return;

    setIsAuthenticating(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const res = await verifyTerminalPinAsync(pin);

      if (res.success) {
        resetFailedAttempts();
        setError('');
        sessionStorage.setItem("mcp_erp_terminal_unlocked", "true");
        setStep(2);
      } else {
        const updated = recordFailedAttempt();
        setLockoutState(updated);
        if (updated.isLocked) {
          setCountdownSeconds(updated.lockoutRemainingMinutes * 60);
          setError("Security Lockout: 5 invalid attempts detected. Terminal locked for 10 minutes.");
        } else {
          setError(
            `${res.message || 'Invalid Terminal PIN.'} (${updated.remainingAttempts} attempt${updated.remainingAttempts === 1 ? '' : 's'} remaining)`
          );
        }
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected authentication error occurred.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Step 2: Verify Individual User ID & Password
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (lockoutState.isLocked || isAuthenticating) return;

    setIsAuthenticating(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const res = await authenticateUserCredentialsAsync(username, password);

      if (res.success) {
        resetFailedAttempts();
        setError('');
        onLoginSuccess(res.user);
      } else {
        const updated = recordFailedAttempt();
        setLockoutState(updated);
        if (updated.isLocked) {
          setCountdownSeconds(updated.lockoutRemainingMinutes * 60);
          setError("Security Lockout: 5 invalid attempts detected. Terminal locked for 10 minutes.");
        } else {
          setError(
            `${res.message || 'Invalid User ID or Password.'} (${updated.remainingAttempts} attempt${updated.remainingAttempts === 1 ? '' : 's'} remaining)`
          );
        }
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected authentication error occurred.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLockTerminal = () => {
    sessionStorage.removeItem("mcp_erp_terminal_unlocked");
    setPin('');
    setUsername('');
    setPassword('');
    setError('');
    setStep(1);
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

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-2xl relative">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
            step === 1 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
              : 'bg-slate-800/80 text-slate-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${step === 1 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
            <span>1. Terminal PIN Gate</span>
          </div>
          <span className="text-slate-600 text-xs">→</span>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
            step === 2 
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' 
              : 'bg-slate-800/80 text-slate-500'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${step === 2 ? 'bg-sky-400 animate-pulse' : 'bg-slate-600'}`}></span>
            <span>2. User ID & Password</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 p-0.5 mx-auto mb-3 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              {step === 1 ? (
                <Lock className="w-7 h-7 text-emerald-400" />
              ) : (
                <KeyRound className="w-7 h-7 text-sky-400" />
              )}
            </div>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            M/S COMPUTER PLANET
          </h2>
          <p className="text-xs uppercase font-bold text-emerald-400 tracking-wider mt-1">
            {step === 1 ? "Step 1: Security Terminal Gate" : "Step 2: Operations ERP Login"}
          </p>
          <p className="text-xs text-slate-400 mt-1.5">
            {step === 1
              ? "Enter authorized Terminal PIN to unlock the ERP credentials gate."
              : "Enter authorized User ID and Password to launch your workspace."}
          </p>
        </div>

        {/* Lockout Screen */}
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
        ) : step === 1 ? (
          /* =========================================================================
             STEP 1: TERMINAL PIN GATE
             ========================================================================= */
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
                Enter Terminal Access PIN
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
              <p className="text-[11px] text-slate-500 text-center mt-1.5">
                Default Master PIN: <span className="font-mono text-slate-400 font-semibold">99544</span>
              </p>
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
              <Lock className="w-4 h-4" />
              <span>{isAuthenticating ? "Verifying Terminal PIN..." : "Unlock Terminal Access →"}</span>
            </button>
          </form>
        ) : (
          /* =========================================================================
             STEP 2: USER ID & PASSWORD LOGIN
             ========================================================================= */
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                User ID / Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  autoFocus
                  required
                  disabled={isAuthenticating}
                  placeholder="e.g. admin, debashis, priyanka"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  className="w-full py-2.5 pl-10 pr-4 text-sm font-semibold rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-white disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isAuthenticating}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full py-2.5 pl-10 pr-10 text-sm font-semibold rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-white disabled:opacity-50 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Default for admin: <span className="font-mono text-slate-400">admin@99544</span>
              </p>
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
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-blue-950 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isAuthenticating ? "Authenticating Identity..." : "Open ERP Workspace"}</span>
            </button>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
              <button
                type="button"
                onClick={handleLockTerminal}
                className="hover:text-rose-400 transition flex items-center gap-1"
              >
                <Lock className="w-3 h-3 text-rose-400" />
                <span>Lock Terminal Gate (Back to Step 1)</span>
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-500">
          <div className="flex items-center justify-center gap-1.5 text-emerald-500/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2-Step Defense-in-Depth • Salted SHA-256 Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
