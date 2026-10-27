import React, { useState } from 'react';
import { FarabiLogo } from '../../components/FarabiLogo';
import { useAuth, AUTHORIZED_ADMIN_EMAILS } from '../../context/FirebaseContext';
import { FirewallEngine } from '../../lib/firewallEngine';
import { Lock, Mail, ArrowRight, AlertCircle, Laptop } from 'lucide-react';

interface AdminLoginProps {
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToStore }) => {
  const {
    currentUser,
    isAdmin,
    loginWithEmail,
    logout,
    sessionTerminatedNotice,
  } = useAuth();

  // Clean empty state — zero autofill or pre-filled emails
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Please fill in both email and password to enter the admin portal.');
      return;
    }

    if (!AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail)) {
      await FirewallEngine.recordThreatIncident({
        category: 'unauthorized_access',
        severity: 'high',
        description: `Unauthorized admin login attempt for email: ${cleanEmail}`,
        sourceEndpoint: '/admin/login',
        payloadSnippet: `Attempted Email: ${cleanEmail}`,
        actionTaken: 'blocked_and_quarantined',
      });
      setError('Access Denied: Invalid email or password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await loginWithEmail(cleanEmail, password);
    } catch (err: any) {
      const errMsg = err?.message || 'Invalid administrator credentials.';

      await FirewallEngine.recordThreatIncident({
        category: 'brute_force_login',
        severity: 'high',
        description: `Failed admin authentication attempt for ${cleanEmail}`,
        sourceEndpoint: '/admin/login',
        payloadSnippet: `Target: ${cleanEmail}`,
        actionTaken: 'blocked_and_quarantined',
      });

      if (errMsg.includes('Access Denied')) {
        setError(errMsg);
      } else {
        setError('Incorrect email or password. Please verify your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F3] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
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
        <p className="mt-1 text-xs text-[#26312B]/70">
          Enter your authorized credentials to access the console
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-[#AFC7A5]/30 sm:px-10">
          {currentUser && !isAdmin ? (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800">
                  <p className="font-semibold">Session Ended or Unauthorized</p>
                  <p className="mt-1">
                    Please log in with the correct email and password to continue.
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full py-2.5 px-4 bg-[#183F32] text-white text-sm font-medium rounded-xl hover:bg-[#122F25] transition-colors cursor-pointer"
              >
                Sign In Again
              </button>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={handleSubmit}
              autoComplete="off"
              method="post"
              action="#"
            >
              {/* Browser Autofill Trap (Decoy Inputs) */}
              <input
                type="text"
                name="fakeusernameremembered"
                id="fakeusernameremembered"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />
              <input
                type="password"
                name="fakepasswordremembered"
                id="fakepasswordremembered"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="new-password"
              />

              {/* Single Device Displaced Notice if previous session was replaced */}
              {sessionTerminatedNotice && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Laptop className="w-4 h-4 text-amber-700" />
                    <span>Session Notice</span>
                  </div>
                  <p className="leading-relaxed">
                    A newer session was opened from another device ({sessionTerminatedNotice.device}). Please re-enter your email and password to log in here.
                  </p>
                </div>
              )}

              {/* Error Notification */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* Email Bar */}
              <div>
                <label
                  htmlFor="farabi_adm_user"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#183F32] mb-1.5"
                >
                  Email
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#26312B]/40">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="farabi_adm_user"
                    name="farabi_adm_user"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                    disabled={loading}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    data-lpignore="true"
                    data-form-type="other"
                    className="block w-full pl-10 pr-3 py-2.5 border border-[#AFC7A5]/40 bg-[#FAF9F3]/40 text-[#26312B] placeholder:text-[#26312B]/35 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#183F32] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password Bar */}
              <div>
                <label
                  htmlFor="farabi_adm_key"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#183F32] mb-1.5"
                >
                  Password
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#26312B]/40">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="farabi_adm_key"
                    name="farabi_adm_key"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    data-lpignore="true"
                    data-form-type="other"
                    className="block w-full pl-10 pr-3 py-2.5 border border-[#AFC7A5]/40 bg-[#FAF9F3]/40 text-[#26312B] placeholder:text-[#26312B]/35 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#183F32] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sign In Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#183F32] hover:bg-[#122F25] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#183F32] transition-colors cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <span>Sign In to Admin</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer Back to Store Link */}
          <div className="mt-6 pt-5 border-t border-[#AFC7A5]/20 flex items-center justify-center text-xs">
            <button
              type="button"
              onClick={onBackToStore}
              className="text-[#183F32] font-semibold hover:underline cursor-pointer flex items-center gap-1.5"
            >
              <span>← Back to Live Store</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
