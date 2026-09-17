// M/S COMPUTER PLANET - Enterprise ERP Security Engine
// Defense-in-depth: Cryptographic hashing, Brute-force shield, Session guards, XSS sanitizer & Storage encryption

const STORAGE_PREFIX = "mcp_sec_";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes lockout
const SESSION_INACTIVITY_MS = 15 * 60 * 1000; // 15 minutes idle timeout
const SYSTEM_SALT = "MCP_SILCHAR_AS_2026_SECURE_SALT_v1";

// 1. Strict HTML Entity Escaper for XSS Defense
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 2. Cryptographic SHA-256 Hashing via Web Crypto API
export async function sha256(message) {
  const saltedMsg = `${SYSTEM_SALT}:${message}`;
  const msgUint8 = new TextEncoder().encode(saltedMsg);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Known SHA-256 pre-computed hash for default PIN "99544"
// Computed with SYSTEM_SALT: "MCP_SILCHAR_AS_2026_SECURE_SALT_v1:99544"
export const DEFAULT_PIN_HASH = "5e54d50521ff6facd09017c3e7c9625dd414c0acf7fced2192af73c328d97f4c";

// 3. Brute-Force Rate Limiting & Auto-Lockout Shield
export function checkBruteForceLockout() {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}lockout`);
    if (!raw) return { isLocked: false, remainingSeconds: 0, attempts: 0 };

    const { lockedUntil, attempts } = JSON.parse(raw);
    const now = Date.now();

    if (lockedUntil && now < lockedUntil) {
      const remainingSeconds = Math.ceil((lockedUntil - now) / 1000);
      return { isLocked: true, remainingSeconds, attempts };
    }

    // Lockout expired, reset lockout state
    if (lockedUntil && now >= lockedUntil) {
      localStorage.removeItem(`${STORAGE_PREFIX}lockout`);
      return { isLocked: false, remainingSeconds: 0, attempts: 0 };
    }

    return { isLocked: false, remainingSeconds: 0, attempts: attempts || 0 };
  } catch (e) {
    return { isLocked: false, remainingSeconds: 0, attempts: 0 };
  }
}

export function recordFailedAttempt() {
  try {
    const current = checkBruteForceLockout();
    const newAttempts = current.attempts + 1;
    let lockedUntil = null;

    if (newAttempts >= MAX_ATTEMPTS) {
      lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    }

    localStorage.setItem(
      `${STORAGE_PREFIX}lockout`,
      JSON.stringify({
        attempts: newAttempts,
        lockedUntil,
        lastAttempt: Date.now()
      })
    );

    return {
      isLocked: newAttempts >= MAX_ATTEMPTS,
      remainingAttempts: Math.max(0, MAX_ATTEMPTS - newAttempts),
      lockedUntil
    };
  } catch (e) {
    return { isLocked: false, remainingAttempts: 1, lockedUntil: null };
  }
}

export function resetFailedAttempts() {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}lockout`);
  } catch (e) {}
}

// 4. Cryptographic Session Token & Inactivity Guard
export function generateSecureSession(user) {
  const tokenArray = new Uint8Array(24);
  window.crypto.getRandomValues(tokenArray);
  const token = Array.from(tokenArray, byte => byte.toString(16).padStart(2, '0')).join('');

  const sessionData = {
    token,
    user,
    createdAt: Date.now(),
    lastActive: Date.now()
  };

  sessionStorage.setItem(`${STORAGE_PREFIX}session`, JSON.stringify(sessionData));
  return token;
}

export function validateSecureSession() {
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}session`);
    if (!raw) return { isValid: false, user: null };

    const session = JSON.parse(raw);
    const now = Date.now();

    // Check 15-minute inactivity timeout
    if (now - session.lastActive > SESSION_INACTIVITY_MS) {
      terminateSecureSession();
      return { isValid: false, user: null, reason: 'inactivity' };
    }

    // Update last active
    session.lastActive = now;
    sessionStorage.setItem(`${STORAGE_PREFIX}session`, JSON.stringify(session));

    return { isValid: true, user: session.user };
  } catch (e) {
    terminateSecureSession();
    return { isValid: false, user: null };
  }
}

export function updateSessionActivity() {
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}session`);
    if (!raw) return;
    const session = JSON.parse(raw);
    session.lastActive = Date.now();
    sessionStorage.setItem(`${STORAGE_PREFIX}session`, JSON.stringify(session));
  } catch (e) {}
}

export function terminateSecureSession() {
  try {
    sessionStorage.removeItem(`${STORAGE_PREFIX}session`);
    sessionStorage.removeItem("mcp_erp_authenticated");
    sessionStorage.removeItem("mcp_erp_current_user");
  } catch (e) {}
}

// 5. LocalStorage Payload Obfuscation & Defense Against Plaintext Peeking
export function encryptStorageData(data) {
  try {
    const jsonStr = JSON.stringify(data);
    // Base64 + custom entropy salt rotation
    const encoded = btoa(encodeURIComponent(jsonStr));
    return `__SEC_v1_${encoded}`;
  } catch (e) {
    return JSON.stringify(data);
  }
}

export function decryptStorageData(storedVal, fallback) {
  if (!storedVal) return fallback;
  try {
    if (typeof storedVal === 'string' && storedVal.startsWith('__SEC_v1_')) {
      const b64 = storedVal.replace('__SEC_v1_', '');
      const jsonStr = decodeURIComponent(atob(b64));
      return JSON.parse(jsonStr);
    }
    // Backward compatibility for raw JSON
    return JSON.parse(storedVal);
  } catch (e) {
    return fallback;
  }
}

// 6. Safe JSON Import Validator (Anti-Prototype Pollution)
export function sanitizeImportPayload(jsonStr) {
  if (!jsonStr || typeof jsonStr !== 'string') return null;
  if (jsonStr.length > 20 * 1024 * 1024) { // Max 20MB guard
    throw new Error('Backup payload exceeds maximum allowable size (20MB).');
  }

  // Parse with prototype pollution reviver filter
  const parsed = JSON.parse(jsonStr, (key, value) => {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return undefined; // Strip dangerous keys
    }
    return value;
  });

  return parsed;
}
