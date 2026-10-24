import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { SecurityAlert } from '../../types';
import {
  ShieldAlert,
  Clock,
  Trash2,
  RefreshCw,
  Mail,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface AdminSecurityProps {
  onNotify: (msg: string) => void;
}

export const AdminSecurity: React.FC<AdminSecurityProps> = ({ onNotify }) => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const STORAGE_FAILED_KEY = 'faraabee_admin_failed_attempts';
  const STORAGE_LOCKOUT_KEY = 'faraabee_admin_lockout_until';

  // Read live security alerts from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'security_alerts'),
      (snapshot) => {
        const loaded: SecurityAlert[] = [];
        snapshot.forEach((d) => {
          loaded.push({ id: d.id, ...d.data() } as SecurityAlert);
        });
        loaded.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setAlerts(loaded);
        setLoading(false);
      },
      (err) => {
        console.warn('Could not read security alerts:', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleDeleteAlert = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'security_alerts', id));
      onNotify('Security log entry removed');
    } catch {
      onNotify('Failed to delete log entry');
    }
  };

  const handleResetDeviceLockout = () => {
    try {
      localStorage.removeItem(STORAGE_FAILED_KEY);
      localStorage.removeItem(STORAGE_LOCKOUT_KEY);
      onNotify('Device security lockout & attempt counter reset to 0');
    } catch {
      onNotify('Failed to reset local lockout');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#AFC7A5]/30 shadow-xs">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#183F32] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span>Security Logs & Device Lockouts</span>
          </h2>
          <p className="text-xs text-[#26312B]/70 mt-1">
            Real-time audit log of unauthorized login attempts and automatic lockouts dispatched to <strong>faraabee1@gmail.com</strong>.
          </p>
        </div>

        <button
          onClick={handleResetDeviceLockout}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#183F32] bg-[#FAF9F3] hover:bg-[#E8F1DF] rounded-xl border border-[#AFC7A5]/40 transition-colors cursor-pointer self-start sm:self-auto"
          title="Reset lockout state stored on this browser"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#183F32]" />
          <span>Reset Browser Lockout State</span>
        </button>
      </div>

      {/* Security Policies Overview Card */}
      {/* Security Policies Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-2xs space-y-1 bg-gradient-to-b from-emerald-50/40 to-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Authorized Account</span>
          </div>
          <p className="text-sm font-bold text-[#183F32] truncate">faraabee1@gmail.com</p>
          <p className="text-xs text-[#26312B]/70">
            Strict whitelist enforced. All other Google or email accounts are rejected.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#AFC7A5]/30 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#183F32] uppercase tracking-wider">
            <Laptop className="w-4 h-4 text-[#183F32]" />
            <span>Single Device Policy</span>
          </div>
          <p className="text-xl font-bold text-[#183F32]">1 Device Only</p>
          <p className="text-xs text-[#26312B]/70">
            Logging in on a second device instantly terminates the previous session.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#AFC7A5]/30 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#183F32] uppercase tracking-wider">
            <Clock className="w-4 h-4 text-[#183F32]" />
            <span>Session Lifetime</span>
          </div>
          <p className="text-xl font-bold text-[#183F32]">Ephemeral</p>
          <p className="text-xs text-[#26312B]/70">
            Closing tab or window requires re-entering email and password.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#AFC7A5]/30 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#183F32] uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Failed Attempt Limit</span>
          </div>
          <p className="text-xl font-bold text-[#183F32]">3 Attempts</p>
          <p className="text-xs text-[#26312B]/70">
            3 failed tries trigger 1-min lockdown and email alert to faraabee1@gmail.com.
          </p>
        </div>
      </div>

      {/* Incidents Table / Cards */}
      <div className="bg-white rounded-2xl border border-[#AFC7A5]/30 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#AFC7A5]/20 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-[#183F32] flex items-center gap-2">
            <span>Recorded Incidents</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#E8F1DF] text-[#183F32]">
              {alerts.length}
            </span>
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#26312B]/60">
            Loading security logs...
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#26312B]/60 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#183F32] mx-auto opacity-70" />
            <p className="font-semibold text-sm text-[#183F32]">No Security Incidents</p>
            <p>No unauthorized failed login threshold attempts have been detected.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#AFC7A5]/20">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-[#FAF9F3]/40 transition-colors">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-lg flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{alert.failedAttempts} Failed Attempts</span>
                    </span>
                    <span className="text-xs text-[#26312B]/60 font-medium">
                      {alert.localTime || new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-xs text-[#26312B]/80 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5 text-[#183F32] shrink-0" />
                      <span><strong>Device:</strong> {alert.device || alert.platform || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span><strong>Alert Sent To:</strong> {alert.targetEmail}</span>
                    </div>
                    {alert.userAgent && (
                      <p className="text-[11px] text-[#26312B]/50 font-mono truncate max-w-xl">
                        {alert.userAgent}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer self-end sm:self-center"
                  title="Remove log entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
