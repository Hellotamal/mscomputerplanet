import React, { useState, useEffect } from 'react';
import { 
  verifyTerminalPinAsync, 
  authenticateUserCredentialsAsync, 
  recordAuditLog,
  resetUserPasswordAsync,
  registerNewUserAsync,
  lookupUserAccountAsync,
  ROLE_DEFINITIONS
} from './erpStorage';
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
  UserPlus,
  CheckCircle2,
  Search,
  Building2,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

export default function ERPLogin({ onLoginSuccess, onBackToSite }) {
  // Navigation view: 'login' | 'reset_password' | 'create_user'
  const [view, setView] = useState('login');

  // Step 1: Terminal Access PIN | Step 2: Main Login (User ID + Password)
  const [step, setStep] = useState(() => {
    return sessionStorage.getItem("mcp_erp_terminal_unlocked") === "true" ? 2 : 1;
  });

  // Login form state
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // General Status & Lockout
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [lockoutState, setLockoutState] = useState(() => checkBruteForceLockout());
  const [countdownSeconds, setCountdownSeconds] = useState(0);

  // Password Reset state
  const [resetUsername, setResetUsername] = useState('');
  const [resetAuthPin, setResetAuthPin] = useState('99544');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetMode, setResetMode] = useState('reset'); // 'reset' | 'find_username'
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResults, setLookupResults] = useState([]);
  const [lookupMessage, setLookupMessage] = useState('');

  // Create User state
  const [createName, setCreateName] = useState('');
  const [createUsername, setCreateUsername] = useState('');
  const [createRole, setCreateRole] = useState(ROLE_DEFINITIONS[1].role);
  const [createPhone, setCreatePhone] = useState('');
  const [createRegion, setCreateRegion] = useState('Silchar & Cachar Circle');
  const [createPassword, setCreatePassword] = useState('');
  const [createConfirmPassword, setCreateConfirmPassword] = useState('');
  const [createPin, setCreatePin] = useState('99544');
  const [createAuthPin, setCreateAuthPin] = useState('99544');
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  // Sync lockout timer countdown
  useEffect(() => {
    const checkStatus = () => {
      const status = checkBruteForceLockout();
      setLockoutState(status);
      if (status.isLocked) {
        setCountdownSeconds(status.remainingSeconds || (status.lockoutRemainingMinutes ? status.lockoutRemainingMinutes * 60 : 600));
      } else {
        setCountdownSeconds(0);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
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
        recordAuditLog("TERMINAL_PIN_SUCCESS", "Authentication", "Terminal Security PIN verified successfully.");
        setError('');
        sessionStorage.setItem("mcp_erp_terminal_unlocked", "true");
        setStep(2);
      } else {
        const updated = recordFailedAttempt();
        setLockoutState(updated);
        recordAuditLog("TERMINAL_PIN_FAILED", "Authentication", `Failed PIN attempt. Remaining: ${updated.remainingAttempts}`);
        if (updated.isLocked) {
          setCountdownSeconds(updated.remainingSeconds || 600);
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
        recordAuditLog("USER_LOGIN_SUCCESS", "Authentication", `User '${res.user?.name || res.user?.username}' authenticated.`, res.user);
        setError('');
        onLoginSuccess(res.user);
      } else {
        const updated = recordFailedAttempt();
        setLockoutState(updated);
        recordAuditLog("USER_LOGIN_FAILED", "Authentication", `Failed login for username '${username}'. Remaining: ${updated.remainingAttempts}`);
        if (updated.isLocked) {
          setCountdownSeconds(updated.remainingSeconds || 600);
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

  // Password Reset Handler
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!resetUsername.trim()) {
      setError('Please enter your User ID / Username.');
      return;
    }
    if (!resetAuthPin.trim()) {
      setError('Please enter Terminal Security PIN (99544).');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsAuthenticating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const res = await resetUserPasswordAsync(resetUsername.trim(), newPassword, resetAuthPin.trim());

      if (res.success) {
        setResetSuccess(true);
        setSuccessMsg(res.message || 'Password has been reset successfully!');
        setUsername(resetUsername.trim());
        setPassword(newPassword);
      } else {
        setError(res.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred during password reset.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Look up username by phone or name
  const handleLookupUsername = async (e) => {
    e.preventDefault();
    setLookupError('');
    setLookupResults([]);
    setLookupMessage('');

    if (!lookupQuery.trim()) {
      setLookupError('Please enter a phone number or name.');
      return;
    }

    setIsAuthenticating(true);
    try {
      const res = await lookupUserAccountAsync(lookupQuery);
      if (res.success && res.accounts.length > 0) {
        setLookupResults(res.accounts);
      } else {
        setLookupMessage(res.message || 'No accounts found matching this query.');
      }
    } catch (err) {
      console.error(err);
      setLookupError('Failed to search accounts.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const [lookupError, setLookupError] = useState('');

  // Create User Handler
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!createName.trim()) {
      setError('Please enter Full Name.');
      return;
    }
    if (!createUsername.trim()) {
      setError('Please enter desired Username / User ID.');
      return;
    }
    if (createPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (createPassword !== createConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!createAuthPin.trim()) {
      setError('Please provide Terminal Security PIN (99544) to authorize registration.');
      return;
    }

    setIsAuthenticating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const res = await registerNewUserAsync({
        name: createName,
        username: createUsername,
        password: createPassword,
        phone: createPhone,
        role: createRole,
        region: createRegion,
        pin: createPin || '99544'
      }, createAuthPin);

      if (res.success) {
        setCreateSuccess(true);
        setCreatedUser(res.user);
        setSuccessMsg(res.message || 'User registered successfully!');
        setUsername(res.user.username);
        setPassword(createPassword);
      } else {
        setError(res.message || 'Failed to create user account.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred during user registration.');
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
    setSuccessMsg('');
    setStep(1);
    setView('login');
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

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-2xl relative my-8">
        
        {/* =========================================================================
           TOP VIEW NAVIGATION TABS (Login | Reset Password | Create User)
           ========================================================================= */}
        <div className="flex items-center justify-center gap-1.5 mb-6 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => {
              setView('login');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              view === 'login' 
                ? 'bg-sky-500 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setView('reset_password');
              setResetSuccess(false);
              setError('');
              setSuccessMsg('');
              if (username) setResetUsername(username);
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              view === 'reset_password' 
                ? 'bg-amber-500 text-slate-950 shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Pass</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setView('create_user');
              setCreateSuccess(false);
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              view === 'create_user' 
                ? 'bg-emerald-500 text-slate-950 shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create User</span>
          </button>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 via-emerald-500 to-amber-500 p-0.5 mx-auto mb-3 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              {view === 'create_user' ? (
                <UserPlus className="w-7 h-7 text-emerald-400" />
              ) : view === 'reset_password' ? (
                <RefreshCw className="w-7 h-7 text-amber-400" />
              ) : step === 1 ? (
                <Lock className="w-7 h-7 text-emerald-400" />
              ) : (
                <KeyRound className="w-7 h-7 text-sky-400" />
              )}
            </div>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            M/S COMPUTER PLANET
          </h2>
          <p className="text-xs uppercase font-bold tracking-wider mt-1 text-slate-300">
            {view === 'create_user' 
              ? "New Staff User Registration" 
              : view === 'reset_password' 
                ? "Password Reset & Recovery Portal" 
                : step === 1 
                  ? "Step 1: Terminal Security Gate" 
                  : "Step 2: Operations ERP Login"}
          </p>
          <p className="text-xs text-slate-400 mt-1.5">
            {view === 'create_user'
              ? "Create a new authorized personnel account with custom operational role."
              : view === 'reset_password'
                ? "Reset forgotten password or look up your registered User ID."
                : step === 1
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
        ) : view === 'reset_password' ? (
          /* =========================================================================
             VIEW: PASSWORD RESET & ACCOUNT LOOKUP
             ========================================================================= */
          <div>
            {/* Submode Switcher */}
            <div className="flex gap-2 mb-4 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => { setResetMode('reset'); setError(''); setSuccessMsg(''); }}
                className={`text-xs font-bold pb-1 transition border-b-2 ${
                  resetMode === 'reset' 
                    ? 'border-amber-400 text-amber-400' 
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                1. Reset Password
              </button>
              <button
                type="button"
                onClick={() => { setResetMode('find_username'); setError(''); setSuccessMsg(''); }}
                className={`text-xs font-bold pb-1 transition border-b-2 ${
                  resetMode === 'find_username' 
                    ? 'border-amber-400 text-amber-400' 
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                2. Forgot Username? (Find by Phone)
              </button>
            </div>

            {resetSuccess ? (
              <div className="bg-emerald-950/50 border border-emerald-800 rounded-2xl p-5 text-center space-y-3 animate-in zoom-in-95">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">Password Reset Successful!</h3>
                <p className="text-xs text-slate-300">
                  Your credentials for User ID <span className="font-mono text-emerald-300 font-bold">@{resetUsername}</span> have been updated.
                </p>
                <button
                  onClick={() => {
                    setView('login');
                    setStep(2);
                    sessionStorage.setItem("mcp_erp_terminal_unlocked", "true");
                    setResetSuccess(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition text-xs shadow-md"
                >
                  Proceed to Login with New Password →
                </button>
              </div>
            ) : resetMode === 'reset' ? (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    User ID / Username *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. admin, debashis, priyanka"
                      value={resetUsername}
                      onChange={(e) => setResetUsername(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 text-xs font-semibold rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Terminal Security PIN *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      required
                      maxLength="8"
                      placeholder="Default master PIN: 99544"
                      value={resetAuthPin}
                      onChange={(e) => setResetAuthPin(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 text-xs font-mono font-bold rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white tracking-widest"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Authorized Master PIN: <span className="font-mono text-slate-400">99544</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    New Password * (Min 6 chars)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="Enter new strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-10 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
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
                  className="w-full py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-950 transition flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{isAuthenticating ? "Resetting Password..." : "Confirm & Reset Password"}</span>
                </button>
              </form>
            ) : (
              /* Submode: Find Username by Phone */
              <div className="space-y-4">
                <form onSubmit={handleLookupUsername} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Enter Registered Phone Number or Full Name
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. 8638083712, 9435012345, or Tamal"
                        value={lookupQuery}
                        onChange={(e) => setLookupQuery(e.target.value)}
                        className="w-full py-2.5 pl-10 pr-4 text-xs rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                      />
                    </div>
                  </div>

                  {lookupError && (
                    <div className="text-xs text-rose-400 bg-rose-950/50 border border-rose-900/60 p-2 rounded-xl text-center">
                      {lookupError}
                    </div>
                  )}

                  {lookupMessage && (
                    <div className="text-xs text-amber-300 bg-amber-950/50 border border-amber-900/60 p-2.5 rounded-xl text-center">
                      {lookupMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition text-xs shadow flex items-center justify-center gap-2"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search User Account</span>
                  </button>
                </form>

                {/* Lookup Results */}
                {lookupResults.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Found Matching Accounts:
                    </span>
                    {lookupResults.map((acc, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{acc.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-300">
                              @{acc.username}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {acc.role} • Tel: {acc.phone}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setResetUsername(acc.username);
                            setResetMode('reset');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold border border-amber-500/40 shrink-0"
                        >
                          Select & Reset
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 mt-4 text-center border-t border-slate-800 text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setView('login')}
                className="hover:text-white transition flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login Screen</span>
              </button>
            </div>
          </div>
        ) : view === 'create_user' ? (
          /* =========================================================================
             VIEW: CREATE NEW USER / REGISTER STAFF ACCOUNT
             ========================================================================= */
          <div>
            {createSuccess ? (
              <div className="bg-emerald-950/50 border border-emerald-800 rounded-2xl p-5 text-center space-y-3 animate-in zoom-in-95">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">Staff Account Created!</h3>
                <p className="text-xs text-slate-300">
                  Welcome aboard, <strong className="text-white">{createdUser?.name}</strong>! Your User ID is{' '}
                  <span className="font-mono text-emerald-300 font-bold">@{createdUser?.username}</span>.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      sessionStorage.setItem("mcp_erp_terminal_unlocked", "true");
                      onLoginSuccess(createdUser);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition text-xs shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Launch Workspace Directly</span>
                  </button>
                  <button
                    onClick={() => {
                      setView('login');
                      setStep(2);
                      sessionStorage.setItem("mcp_erp_terminal_unlocked", "true");
                      setCreateSuccess(false);
                    }}
                    className="py-2.5 px-3 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-700 transition text-xs border border-slate-700"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateUserSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Deb"
                      value={createName}
                      onChange={(e) => {
                        setCreateName(e.target.value);
                        if (!createUsername) {
                          setCreateUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10));
                        }
                      }}
                      className="w-full py-2 px-3 text-xs rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                      Desired User ID / Username *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ramesh_deb"
                      value={createUsername}
                      onChange={(e) => setCreateUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                      className="w-full py-2 px-3 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                      Operational Role *
                    </label>
                    <select
                      value={createRole}
                      onChange={(e) => setCreateRole(e.target.value)}
                      className="w-full py-2 px-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {ROLE_DEFINITIONS.map(r => (
                        <option key={r.role} value={r.role}>{r.role}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +91 94350 99887"
                      value={createPhone}
                      onChange={(e) => setCreatePhone(e.target.value)}
                      className="w-full py-2 px-3 text-xs rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span>Security Credentials Setup</span>
                    <span className="text-emerald-400 text-[10px]">Encrypted SHA-256</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-400 text-[10px] mb-1">
                        Password * (Min 6 chars)
                      </label>
                      <div className="relative">
                        <input
                          type={showCreatePassword ? "text" : "password"}
                          required
                          minLength={6}
                          placeholder="Password"
                          value={createPassword}
                          onChange={(e) => setCreatePassword(e.target.value)}
                          className="w-full py-2 pl-3 pr-8 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCreatePassword(!showCreatePassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showCreatePassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-400 text-[10px] mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type={showCreatePassword ? "text" : "password"}
                        required
                        placeholder="Confirm"
                        value={createConfirmPassword}
                        onChange={(e) => setCreateConfirmPassword(e.target.value)}
                        className="w-full py-2 px-3 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-400 text-[10px] mb-1">
                      Terminal Authorization PIN * (Required to register)
                    </label>
                    <input
                      type="password"
                      required
                      maxLength="8"
                      placeholder="Default master PIN: 99544"
                      value={createAuthPin}
                      onChange={(e) => setCreateAuthPin(e.target.value)}
                      className="w-full py-2 px-3 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-white tracking-widest"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Enter Terminal PIN <span className="font-mono text-slate-400 font-bold">99544</span> to confirm authorized personnel.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                    <div>
                      <label className="block font-semibold text-slate-400 text-[10px] mb-1">
                        Personal Staff PIN (Optional)
                      </label>
                      <input
                        type="text"
                        maxLength="8"
                        placeholder="e.g. 99544"
                        value={createPin}
                        onChange={(e) => setCreatePin(e.target.value.replace(/\D/g, ''))}
                        className="w-full py-2 px-3 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-400 text-[10px] mb-1">
                        Assigned Circle / Region
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Silchar Circle"
                        value={createRegion}
                        onChange={(e) => setCreateRegion(e.target.value)}
                        className="w-full py-2 px-3 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
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
                  className="w-full py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-950 transition flex items-center justify-center gap-2 disabled:opacity-50 text-xs mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isAuthenticating ? "Creating Account..." : "Create Staff Account →"}</span>
                </button>
              </form>
            )}

            <div className="pt-4 mt-4 text-center border-t border-slate-800 text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setView('login')}
                className="hover:text-white transition flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Already registered? Return to Login</span>
              </button>
            </div>
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

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setView('reset_password')}
                className="hover:text-amber-400 transition flex items-center gap-1 text-[11px]"
              >
                <RefreshCw className="w-3 h-3 text-amber-400" />
                <span>Forgot Password?</span>
              </button>
              <button
                type="button"
                onClick={() => setView('create_user')}
                className="hover:text-emerald-400 transition flex items-center gap-1 text-[11px]"
              >
                <UserPlus className="w-3 h-3 text-emerald-400" />
                <span>New User? Register</span>
              </button>
            </div>
          </form>
        ) : (
          /* =========================================================================
             STEP 2: USER ID & PASSWORD LOGIN
             ========================================================================= */
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  User ID / Username
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setView('reset_password');
                    setResetMode('find_username');
                  }}
                  className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Forgot Username?</span>
                </button>
              </div>
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setView('reset_password');
                    setResetMode('reset');
                    if (username) setResetUsername(username);
                  }}
                  className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Password</span>
                </button>
              </div>
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
                className="hover:text-rose-400 transition flex items-center gap-1 text-[11px]"
              >
                <Lock className="w-3 h-3 text-rose-400" />
                <span>Lock Terminal (Step 1)</span>
              </button>

              <button
                type="button"
                onClick={() => setView('create_user')}
                className="hover:text-emerald-400 transition flex items-center gap-1 text-[11px]"
              >
                <UserPlus className="w-3 h-3 text-emerald-400" />
                <span>Create User Account</span>
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
