import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Sparkles, Check, ExternalLink, X, FileText, Heart } from 'lucide-react';
import { PageId } from '../types';

interface LegalConsentBannerProps {
  onNavigatePolicy: (page: PageId) => void;
}

const STORAGE_CONSENT_KEY = 'farabi_legal_consent_v1';

export const LegalConsentBanner: React.FC<LegalConsentBannerProps> = ({ onNavigatePolicy }) => {
  const { legalPolicies, language } = useStore();
  const [isVisible, setIsVisible] = useState(false);
  const isUrdu = language === 'ur';

  useEffect(() => {
    // If disabled by admin in portal settings, don't show
    if (legalPolicies && legalPolicies.consentBannerEnabled === false) {
      setIsVisible(false);
      return;
    }

    try {
      const accepted = localStorage.getItem(STORAGE_CONSENT_KEY);
      if (!accepted) {
        // Short pleasant delay so it feels organic upon entering website
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsVisible(true);
    }
  }, [legalPolicies?.consentBannerEnabled]);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_CONSENT_KEY, 'true');
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const title = (isUrdu && legalPolicies.consentTitleUrdu)
    ? legalPolicies.consentTitleUrdu
    : (legalPolicies.consentTitle || 'Welcome to FARAABEE Apothecary');

  const message = (isUrdu && legalPolicies.consentMessageUrdu)
    ? legalPolicies.consentMessageUrdu
    : (legalPolicies.consentMessage || 'We respect your privacy and honor traditional wellness care. By continuing your visit, you accept our transparent Privacy Policy & Terms of Use designed to protect your wellness journey.');

  const acceptBtnText = (isUrdu && legalPolicies.consentAcceptButtonTextUrdu)
    ? legalPolicies.consentAcceptButtonTextUrdu
    : (legalPolicies.consentAcceptButtonText || 'Accept & Enter Sanctuary');

  const badgeText = (isUrdu && legalPolicies.consentBadgeTextUrdu)
    ? legalPolicies.consentBadgeTextUrdu
    : (legalPolicies.consentBadgeText || 'Botanical Discretion & Trust');

  return (
    <aside
      role="dialog"
      aria-live="polite"
      aria-label="Privacy and Terms Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-fade-in"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#AFC7A5]/50 ring-1 ring-[#183F32]/10 space-y-4">
        {/* Header with warm trust badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F1DF] text-[#183F32] text-[11px] font-bold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{badgeText}</span>
          </div>

          <button
            onClick={handleAccept}
            className="p-1.5 text-[#26312B]/40 hover:text-[#183F32] rounded-full hover:bg-[#FAF9F3] transition-colors cursor-pointer"
            title="Acknowledge and dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title and Reassuring Message */}
        <div className="space-y-1.5">
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#183F32] flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#B79A5B] shrink-0" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-[#26312B]/80 leading-relaxed font-sans">
            {message}
          </p>
        </div>

        {/* Quick Links to Legal Pages */}
        <div className="flex flex-wrap items-center gap-3 text-xs pt-1 border-t border-[#AFC7A5]/25 text-[#183F32]">
          <button
            type="button"
            onClick={() => onNavigatePolicy('privacy')}
            className="font-semibold underline hover:text-[#285844] cursor-pointer flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{isUrdu ? 'رازداری کی پالیسی' : 'Privacy Policy'}</span>
          </button>
          <span className="text-[#AFC7A5]">•</span>
          <button
            type="button"
            onClick={() => onNavigatePolicy('terms')}
            className="font-semibold underline hover:text-[#285844] cursor-pointer flex items-center gap-1"
          >
            <FileText className="w-3 h-3" />
            <span>{isUrdu ? 'شرائطِ استعمال' : 'Terms of Use'}</span>
          </button>
        </div>

        {/* Big Stress-Free Accept Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleAccept}
            className="w-full py-3 px-5 rounded-2xl bg-[#183F32] hover:bg-[#122F25] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-300" />
            <span>{acceptBtnText}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
