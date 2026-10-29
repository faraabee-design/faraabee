import React from 'react';
import { Shield, Lock, CheckCircle2, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DEFAULT_LEGAL_POLICIES } from '../config/defaultLegal';

export const PrivacyPolicyPage: React.FC = () => {
  const { legalPolicies, language } = useStore();
  const isUrdu = language === 'ur';

  const cfg = legalPolicies || DEFAULT_LEGAL_POLICIES;

  const title = (isUrdu && cfg.privacyTitleUrdu) ? cfg.privacyTitleUrdu : (cfg.privacyTitle || DEFAULT_LEGAL_POLICIES.privacyTitle);
  const subtitle = (isUrdu && cfg.privacySubtitleUrdu) ? cfg.privacySubtitleUrdu : (cfg.privacySubtitle || DEFAULT_LEGAL_POLICIES.privacySubtitle);
  const effectiveDate = cfg.privacyEffectiveDate || DEFAULT_LEGAL_POLICIES.privacyEffectiveDate;
  const intro = (isUrdu && cfg.privacyIntroUrdu) ? cfg.privacyIntroUrdu : (cfg.privacyIntro || DEFAULT_LEGAL_POLICIES.privacyIntro);
  const sections = cfg.privacySections || DEFAULT_LEGAL_POLICIES.privacySections;
  const contactNotice = (isUrdu && cfg.privacyContactNoticeUrdu) ? cfg.privacyContactNoticeUrdu : (cfg.privacyContactNotice || DEFAULT_LEGAL_POLICIES.privacyContactNotice);

  return (
    <div className="bg-[#FAF9F3] min-h-screen py-12 sm:py-16" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#AFC7A5]/35 shadow-xs space-y-8">
          {/* Header */}
          <div className="border-b border-[#AFC7A5]/25 pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#285844]">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>{isUrdu ? 'فارابی امانت داری و رازداری' : 'FARAABEE BOTANICAL INTEGRITY'}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#183F32]">
              {title}
            </h1>
            <p className="text-sm text-[#26312B]/75 leading-relaxed font-sans">
              {subtitle}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8F1DF] text-[#183F32] rounded-lg text-xs font-semibold mt-2">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isUrdu ? `مؤثر تاریخ: ${effectiveDate}` : `Effective Date: ${effectiveDate}`}</span>
            </div>
          </div>

          {/* Opening Introduction */}
          {intro && (
            <div className="p-5 sm:p-6 bg-[#FAF9F3] rounded-2xl border border-[#AFC7A5]/30 text-xs sm:text-sm text-[#183F32] font-serif leading-relaxed italic">
              &ldquo;{intro}&rdquo;
            </div>
          )}

          {/* Dynamic Policy Sections */}
          <div className="space-y-6 text-xs sm:text-sm text-[#26312B]/85 leading-relaxed">
            {sections.map((sec, idx) => {
              const secTitle = (isUrdu && sec.titleUrdu) ? sec.titleUrdu : sec.title;
              const secContent = (isUrdu && sec.contentUrdu) ? sec.contentUrdu : sec.content;
              return (
                <section key={sec.id || idx} className="space-y-2 p-4 rounded-2xl hover:bg-[#FAF9F3]/50 transition-colors">
                  <h2 className="font-serif text-lg font-bold text-[#183F32] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{secTitle}</span>
                  </h2>
                  <p className="whitespace-pre-line text-[#26312B]/80 pl-6 leading-relaxed">
                    {secContent}
                  </p>
                </section>
              );
            })}
          </div>

          {/* Contact / Help Footer Notice */}
          {contactNotice && (
            <div className="pt-6 border-t border-[#AFC7A5]/25 flex items-start gap-3 p-4 bg-[#E8F1DF]/50 rounded-2xl text-xs sm:text-sm text-[#183F32]">
              <MessageCircle className="w-5 h-5 text-[#183F32] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-1">
                  {isUrdu ? 'محفوظ رابطہ و استفسار:' : 'Direct Custodian Assistance:'}
                </strong>
                <p className="text-[#26312B]/80 leading-relaxed">{contactNotice}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
