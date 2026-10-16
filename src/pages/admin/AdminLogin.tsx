import React, { useState, useEffect } from 'react';
import { FarabiLogo } from '../../components/FarabiLogo';
import { useAuth } from '../../context/FirebaseContext';
import { db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ShieldAlert,
  Clock,
  Send,
  Laptop,
} from 'lucide-react';

interface AdminLoginProps {
  onBackToStore: () => void;
}

const STORAGE_FAILED_KEY = 'faraabee_admin_failed_attempts';
const STORAGE_LOCKOUT_KEY = 'faraabee_admin_lockout_until';
const ALERT_EMAIL = 'faraabee1@gmail.com';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToStore }) => {
  const { currentUser, isAdmin, loginWithEmail, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertDispatched, setAlertDispatched] = useState(false);

  // Read initial failure count & lockout from localStorage
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAILED_KEY);
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [lockoutUntil, setLockoutUntil] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOCKOUT_KEY);
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  // Active real-time countdown timer running every 1 second
  useEffect(() => {
    const checkCountdown = () => {
      const now = Date.now();
      if (lockoutUntil > now) {
        const diff = Math.max(0, Math.ceil((lockoutUntil - now) / 1000));
        setRemainingSeconds(diff);
      } else {
        setRemainingSeconds(0);
        if (lockoutUntil !== 0) {
          try {
            localStorage.removeItem(STORAGE_LOCKOUT_KEY);
          } catch {}
          setLockoutUntil(0);
        }
      }
    };

    checkCountdown();
    const interval = setInterval(checkCountdown, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const isLocked = remainingSeconds > 0;

  // Format countdown seconds into MM:SS
  const formatCountdown = (totalSecs: number): string => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to extract device diagnostics
  const getDeviceDiagnostics = () => {
    const ua = navigator.userAgent || 'Unknown Device Browser';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const platform = (navigator as any).userAgentData?.platform || navigator.platform || (isMobile ? 'Mobile' : 'Desktop');
    const screenRes = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'Standard';
    return {
      platform,
      isMobile,
      screenRes,
      userAgent: ua,
      summary: `${platform} • ${isMobile ? 'Mobile Device' : 'Desktop Device'} (${screenRes})`,
      localTime: new Date().toLocaleString(),
    };
  };

  // Security alert dispatcher: logs to Firestore & dispatches email to faraabee1@gmail.com
  const dispatchSecurityAlert = async (attemptCount: number) => {
    const diagnostics = getDeviceDiagnostics();
    const alertId = `alert-${Date.now()}`;

    // 1. Record in Firestore for persistent audit log
    try {
      await setDoc(doc(db, 'security_alerts', alertId), {
        id: alertId,
        targetEmail: ALERT_EMAIL,
        failedAttempts: attemptCount,
        deviceSummary: diagnostics.summary,
        platform: diagnostics.platform,
        isMobile: diagnostics.isMobile,
        screen: diagnostics.screenRes,
        userAgent: diagnostics.userAgent,
        localTime: diagnostics.localTime,
        timestamp: new Date().toISOString(),
        sourceUrl: window.location.href,
        status: 'dispatched',
      });
    } catch (dbErr) {
      console.warn('Firestore security record note:', dbErr);
    }

    // 2. Dispatch email notification to faraabee1@gmail.com
    try {
      await fetch(`https://formsubmit.co/ajax/${ALERT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: `⚠️ FARAABEE Security Alert: ${attemptCount} Failed Admin Login Attempts Detected`,
          recipient: ALERT_EMAIL,
          failed_attempts: attemptCount,
          device: diagnostics.summary,
          time_of_attempt: diagnostics.localTime,
          user_agent: diagnostics.userAgent,
          portal_url: window.location.href,
          alert_message: `SECURITY ALERT: Someone attempted to log in to the FARAABEE Admin Portal and failed ${attemptCount} times from this device (${diagnostics.summary}) at ${diagnostics.localTime}. The admin portal has been locked down. If this was not you, your store is safe and locked.`,
        }),
      });
      setAlertDispatched(true);
    } catch (mailErr) {
      console.warn('Mail relay note:', mailErr);
      setAlertDispatched(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      setError(`Admin Portal is locked for security. Please wait ${formatCountdown(remainingSeconds)}.`);
      return;
    }

    if (!email || !password) {
      setError('Please enter your administrator credentials.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await loginWithEmail(email.trim(), password);

      // Successful login: reset failed counters and lockouts completely
      try {
        localStorage.removeItem(STORAGE_FAILED_KEY);
        localStorage.removeItem(STORAGE_LOCKOUT_KEY);
      } catch {}
      setFailedAttempts(0);
      setLockoutUntil(0);
      setRemainingSeconds(0);
    } catch (err: unknown) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      try {
        localStorage.setItem(STORAGE_FAILED_KEY, String(newAttempts));
      } catch {}

      if (newAttempts < 3) {
        const remainingTries = 3 - newAttempts;
        setError(
          `Invalid administrator email or password. Attempt ${newAttempts} of 3 (${remainingTries} try remaining before security lockout).`
        );
      } else if (newAttempts === 3) {
        // Exactly 3 failed tries: lock for 1 minute (60s) and send alert
        const lockoutSeconds = 60;
        const until = Date.now() + lockoutSeconds * 1000;
        setLockoutUntil(until);
        setRemainingSeconds(lockoutSeconds);
        try {
          localStorage.setItem(STORAGE_LOCKOUT_KEY, String(until));
        } catch {}

        setError(
          `3 failed login attempts reached. For security, the portal is locked for 1 minute. A security alert was dispatched to ${ALERT_EMAIL}.`
        );
        dispatchSecurityAlert(newAttempts);
      } else {
        // Each failed try after the 1-minute timer adds another 3 more minutes
        // Attempt 4: 1 min + 3 min = 4 min (240s)
        // Attempt 5: 4 min + 3 min = 7 min (420s)
        const totalDurationSecs = 60 + (newAttempts - 3) * 180;
        const until = Date.now() + totalDurationSecs * 1000;
        setLockoutUntil(until);
        setRemainingSeconds(totalDurationSecs);
        try {
          localStorage.setItem(STORAGE_LOCKOUT_KEY, String(until));
        } catch {}

        const durationMinutes = Math.round(totalDurationSecs / 60);
        setError(
          `Security lockout extended: Attempt ${newAttempts} failed. Portal is locked for ${durationMinutes} minutes. An alert was dispatched to ${ALERT_EMAIL}.`
        );
        dispatchSecurityAlert(newAttempts);
      }
    } finally {
      setLoading(false);
    }
  };

  const diagnostics = getDeviceDiagnostics();
  const directMailtoUrl = `mailto:${ALERT_EMAIL}?subject=${encodeURIComponent(
    `FARAABEE Security Alert: ${failedAttempts} Failed Admin Logins`
  )}&body=${encodeURIComponent(
    `Security Incident Report:\nFailed Attempts: ${failedAttempts}\nDevice: ${diagnostics.summary}\nTime: ${diagnostics.localTime}\nPortal URL: ${window.location.href}`
  )}`;

  return (
    <div className="min-h-screen bg-[#FAF9F3] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button
          onClick={onBackToStore}
          className="inline-block transition-transform hover:scale-105 cursor-pointer"
          title="Return to FARABI Herbal Wellness Store"
        >
          <FarabiLogo variant="dark" size="lg" />
        </button>
        <h2 className="mt-4 text-2xl font-serif font-bold text-[#183F32] tracking-tight">
          Admin Portal
        </h2>
        <p className="mt-1 text-sm text-[#26312B]/70">
          Private catalog and formulation management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-[#AFC7A5]/30 sm:px-10">
          {/* If signed in but not authorized as admin */}
          {currentUser && !isAdmin ? (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800">
                  <p className="font-semibold">Account Not Authorized</p>
                  <p className="mt-1">
                    Signed in as <strong>{currentUser.email}</strong>. This account does not have administrator privileges.
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full py-2.5 px-4 bg-[#183F32] text-white text-sm font-medium rounded-xl hover:bg-[#122F25] transition-colors cursor-pointer"
              >
                Sign Out & Switch Account
              </button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
              {/* Hidden decoy inputs to suppress browser credential autofill */}
              <input type="text" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="off" />
              <input type="password" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="new-password" />

              {/* Active Lockout Banner with Real-time Countdown */}
              {isLocked ? (
                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl space-y-3 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                      <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                      <span>Portal Locked for Security</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg font-mono font-bold text-xs tracking-wider shadow-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatCountdown(remainingSeconds)}</span>
                    </span>
                  </div>

                  <p className="text-xs text-red-800 leading-relaxed">
                    Maximum failed attempts reached ({failedAttempts} failed tries). Sign-in has been temporarily disabled.
                  </p>

                  <div className="pt-2.5 border-t border-red-200 text-[11px] text-red-800 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>Security alert dispatched to: <strong>{ALERT_EMAIL}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-red-700">
                      <Laptop className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>Device logged: {diagnostics.summary}</span>
                    </div>
                    <a
                      href={directMailtoUrl}
                      className="inline-flex items-center gap-1.5 text-red-800 font-semibold underline hover:text-red-950 pt-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Click to verify or send direct alert to {ALERT_EMAIL}</span>
                    </a>
                  </div>
                </div>
              ) : null}

              {/* Attempt Counter Indicator when failures have occurred but not yet locked */}
              {!isLocked && failedAttempts > 0 && (
                <div className="flex items-center justify-between text-xs px-3.5 py-2.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-200">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    Security Attempt Counter
                  </span>
                  <span className="font-bold px-2 py-0.5 bg-amber-200/80 rounded-md">
                    {failedAttempts} / 3 Attempts
                  </span>
                </div>
              )}

              {/* Error Notification */}
              {error && !isLocked && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* Admin Email Input (Watermark placeholder removed, autofill disabled) */}
              <div>
                <label
                  htmlFor="faraabee_admin_identity"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#183F32] mb-1.5"
                >
                  Admin Email
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#26312B]/40">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="faraabee_admin_identity"
                    name="faraabee_admin_identity"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLocked || loading}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    data-lpignore="true"
                    data-form-type="other"
                    className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#183F32] focus:border-transparent ${
                      isLocked
                        ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                        : 'border-[#AFC7A5]/40 bg-[#FAF9F3]/40 text-[#26312B]'
                    }`}
                  />
                </div>
              </div>

              {/* Password Input (Placeholder removed, autofill disabled) */}
              <div>
                <label
                  htmlFor="faraabee_admin_secret"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#183F32] mb-1.5"
                >
                  Password
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#26312B]/40">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="faraabee_admin_secret"
                    name="faraabee_admin_secret"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLocked || loading}
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    data-lpignore="true"
                    data-form-type="other"
                    className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#183F32] focus:border-transparent ${
                      isLocked
                        ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                        : 'border-[#AFC7A5]/40 bg-[#FAF9F3]/40 text-[#26312B]'
                    }`}
                  />
                </div>
              </div>

              {/* Submit Button (Disables during lockout and shows countdown timer) */}
              <button
                type="submit"
                disabled={isLocked || loading}
                className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white transition-all ${
                  isLocked
                    ? 'bg-gray-400 cursor-not-allowed opacity-80'
                    : 'bg-[#183F32] hover:bg-[#122F25] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#183F32] cursor-pointer'
                }`}
              >
                {isLocked ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Locked ({formatCountdown(remainingSeconds)})</span>
                  </>
                ) : loading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-[#AFC7A5]/20 flex items-center justify-between text-xs text-[#26312B]/70">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#183F32]" />
              Zero-Trust Protected
            </span>
            <button
              onClick={onBackToStore}
              className="text-[#183F32] font-semibold hover:underline cursor-pointer"
            >
              ← Back to Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
