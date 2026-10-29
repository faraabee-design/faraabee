import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { LegalPoliciesConfig, PolicySection } from '../../types';
import { DEFAULT_LEGAL_POLICIES } from '../../config/defaultLegal';
import {
  FileText,
  Shield,
  ShieldCheck,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  Eye,
  Sliders,
  Sparkles,
  Heart,
  MessageCircle,
  AlertCircle,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AdminLegalPoliciesProps {
  onNotify: (msg: string) => void;
  onPreviewPage?: (page: 'privacy' | 'terms') => void;
}

export const AdminLegalPolicies: React.FC<AdminLegalPoliciesProps> = ({ onNotify, onPreviewPage }) => {
  const { legalPolicies, updateLegalPolicies, resetLegalPoliciesToDefault } = useStore();
  const [formData, setFormData] = useState<LegalPoliciesConfig>(() => ({
    ...DEFAULT_LEGAL_POLICIES,
    ...(legalPolicies || {}),
  }));
  const [activeTab, setActiveTab] = useState<'consent_banner' | 'privacy_policy' | 'terms_of_use'>('consent_banner');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (legalPolicies) {
      setFormData((prev) => ({
        ...prev,
        ...legalPolicies,
      }));
    }
  }, [legalPolicies]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await updateLegalPolicies(formData);
      onNotify('Legal policies and consent pop-up banner successfully saved live!');
    } catch {
      onNotify('Failed to save legal settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset all Privacy Policy, Terms of Use, and Consent Banner texts back to original factory botanical wording?')) {
      await resetLegalPoliciesToDefault();
      setFormData(DEFAULT_LEGAL_POLICIES);
      onNotify('Legal policies reset to factory botanical defaults.');
    }
  };

  const handleResetBrowserConsent = () => {
    try {
      localStorage.removeItem('farabi_legal_consent_v1');
      onNotify('Your browser consent record was cleared. When you visit the store, the pop-up will display fresh!');
    } catch {
      onNotify('Could not clear browser storage');
    }
  };

  // Section manipulation for Privacy
  const handleAddPrivacySection = () => {
    const newSec: PolicySection = {
      id: `sec_${Date.now()}`,
      title: 'New Privacy Clause',
      titleUrdu: 'نئی شق برائے رازداری',
      content: 'Describe the confidentiality or security guideline here.',
      contentUrdu: 'یہاں رازداری یا ڈیٹا کے تحفظ کی تفصیل درج فرمائیں۔',
    };
    setFormData((prev) => ({
      ...prev,
      privacySections: [...(prev.privacySections || []), newSec],
    }));
  };

  const handleDeletePrivacySection = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      privacySections: prev.privacySections.filter((_, i) => i !== idx),
    }));
  };

  const handlePrivacySectionChange = (idx: number, field: keyof PolicySection, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.privacySections];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, privacySections: updated };
    });
  };

  // Section manipulation for Terms
  const handleAddTermsSection = () => {
    const newSec: PolicySection = {
      id: `terms_sec_${Date.now()}`,
      title: 'New Terms Clause',
      titleUrdu: 'نئی شق برائے شرائط',
      content: 'Specify formulation guidelines, customer responsibility, or delivery notes here.',
      contentUrdu: 'یہاں نباتاتی مصنوعات کے استعمال، ذمہ داری یا ترسیل کے رہنما اصول درج فرمائیں۔',
    };
    setFormData((prev) => ({
      ...prev,
      termsSections: [...(prev.termsSections || []), newSec],
    }));
  };

  const handleDeleteTermsSection = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      termsSections: prev.termsSections.filter((_, i) => i !== idx),
    }));
  };

  const handleTermsSectionChange = (idx: number, field: keyof PolicySection, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.termsSections];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, termsSections: updated };
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#AFC7A5]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-serif font-bold text-[#183F32]">
              Legal Policies & Device Consent Banner
            </h2>
          </div>
          <p className="text-xs text-[#26312B]/70">
            Fully customize your Privacy Policy, Terms of Use, and the reassuring pop-up shown to visitors on every device.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#183F32] bg-[#FAF9F3] hover:bg-[#E8F1DF] rounded-xl border border-[#AFC7A5]/40 transition-colors cursor-pointer"
            title="Reset to factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#183F32] hover:bg-[#122F25] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#AFC7A5]/25 pb-2">
        <button
          onClick={() => setActiveTab('consent_banner')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'consent_banner'
              ? 'bg-[#183F32] text-white shadow-xs'
              : 'bg-white text-[#26312B]/75 hover:bg-[#E8F1DF]/50 border border-[#AFC7A5]/30'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#B79A5B]" />
          <span>Device Consent Pop-up Banner</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy_policy')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'privacy_policy'
              ? 'bg-[#183F32] text-white shadow-xs'
              : 'bg-white text-[#26312B]/75 hover:bg-[#E8F1DF]/50 border border-[#AFC7A5]/30'
          }`}
        >
          <Shield className="w-4 h-4 text-emerald-700" />
          <span>Privacy & Data Policy</span>
        </button>

        <button
          onClick={() => setActiveTab('terms_of_use')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'terms_of_use'
              ? 'bg-[#183F32] text-white shadow-xs'
              : 'bg-white text-[#26312B]/75 hover:bg-[#E8F1DF]/50 border border-[#AFC7A5]/30'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-700" />
          <span>Terms of Use & Engagement</span>
        </button>
      </div>

      {/* TAB 1: Consent Pop-up Banner Customizer */}
      {activeTab === 'consent_banner' && (
        <div className="space-y-6">
          {/* Live Interactive Preview Card */}
          <div className="bg-gradient-to-r from-[#FAF9F3] via-[#E8F1DF]/50 to-[#FAF9F3] p-6 rounded-3xl border border-[#AFC7A5]/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#183F32] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-700" />
                <span>Live Preview of Visitor Pop-up Banner</span>
              </span>
              <button
                onClick={handleResetBrowserConsent}
                className="text-xs font-semibold text-[#183F32] hover:underline cursor-pointer"
              >
                Reset My Browser Memory to Test Live Pop-up
              </button>
            </div>

            {/* Mocked Popup as shown on devices */}
            <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-xl border border-[#AFC7A5]/50 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F1DF] text-[#183F32] text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{formData.consentBadgeText || 'Botanical Discretion & Trust'}</span>
                </div>
                <span className="text-gray-400 text-xs">✕</span>
              </div>

              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-[#183F32] flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#B79A5B]" />
                  <span>{formData.consentTitle || 'Welcome to FARAABEE Apothecary'}</span>
                </h4>
                <p className="text-xs text-[#26312B]/80 leading-relaxed font-sans">
                  {formData.consentMessage || 'We respect your privacy and care for your wellness. By continuing, you agree to our simple Privacy Policy & Terms of Use.'}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs pt-1 border-t border-[#AFC7A5]/25 text-[#183F32]">
                <span className="font-semibold underline cursor-pointer">Privacy Policy</span>
                <span className="text-[#AFC7A5]">•</span>
                <span className="font-semibold underline cursor-pointer">Terms of Use</span>
              </div>

              <div className="pt-1">
                <div className="w-full py-2.5 px-4 rounded-2xl bg-[#183F32] text-white font-bold text-xs uppercase tracking-wider text-center shadow-xs flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{formData.consentAcceptButtonText || 'Accept & Enter Sanctuary'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Controls */}
          <div className="bg-white p-6 rounded-3xl border border-[#AFC7A5]/30 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#AFC7A5]/20">
              <div>
                <h3 className="font-bold text-sm text-[#183F32]">Pop-up Display Settings</h3>
                <p className="text-xs text-[#26312B]/70">Control whether the consent banner appears when visitors load the store.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentBannerEnabled}
                  onChange={(e) => setFormData({ ...formData, consentBannerEnabled: e.target.checked })}
                  className="w-4 h-4 accent-[#183F32]"
                />
                <span className="text-xs font-bold text-[#183F32]">
                  {formData.consentBannerEnabled ? 'Banner Enabled' : 'Banner Disabled'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">
                  Pop-up Heading (English)
                </label>
                <input
                  type="text"
                  value={formData.consentTitle}
                  onChange={(e) => setFormData({ ...formData, consentTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none"
                  placeholder="Welcome to FARAABEE Apothecary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">
                  Pop-up Heading (Urdu)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.consentTitleUrdu || ''}
                  onChange={(e) => setFormData({ ...formData, consentTitleUrdu: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none font-urdu"
                  placeholder="فارابی ہربل میں خوش آمدید"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#183F32] mb-1">
                  Reassuring Warm Message (English)
                </label>
                <textarea
                  rows={2}
                  value={formData.consentMessage}
                  onChange={(e) => setFormData({ ...formData, consentMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#183F32] mb-1">
                  Reassuring Warm Message (Urdu)
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={formData.consentMessageUrdu || ''}
                  onChange={(e) => setFormData({ ...formData, consentMessageUrdu: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none font-urdu"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">
                  Accept Button Label (English)
                </label>
                <input
                  type="text"
                  value={formData.consentAcceptButtonText}
                  onChange={(e) => setFormData({ ...formData, consentAcceptButtonText: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">
                  Accept Button Label (Urdu)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.consentAcceptButtonTextUrdu || ''}
                  onChange={(e) => setFormData({ ...formData, consentAcceptButtonTextUrdu: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none font-urdu"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">
                  Trust Badge Label (English)
                </label>
                <input
                  type="text"
                  value={formData.consentBadgeText || ''}
                  onChange={(e) => setFormData({ ...formData, consentBadgeText: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">
                  Trust Badge Label (Urdu)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.consentBadgeTextUrdu || ''}
                  onChange={(e) => setFormData({ ...formData, consentBadgeTextUrdu: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none font-urdu"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Privacy Policy Editor */}
      {activeTab === 'privacy_policy' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#AFC7A5]/30 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#183F32]">General Privacy Page Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">Page Title (English)</label>
                <input
                  type="text"
                  value={formData.privacyTitle}
                  onChange={(e) => setFormData({ ...formData, privacyTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">Page Title (Urdu)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.privacyTitleUrdu || ''}
                  onChange={(e) => setFormData({ ...formData, privacyTitleUrdu: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none font-urdu"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">Page Subtitle (English)</label>
                <input
                  type="text"
                  value={formData.privacySubtitle}
                  onChange={(e) => setFormData({ ...formData, privacySubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">Page Subtitle (Urdu)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.privacySubtitleUrdu || ''}
                  onChange={(e) => setFormData({ ...formData, privacySubtitleUrdu: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none font-urdu"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">Effective Date Notice</label>
                <input
                  type="text"
                  value={formData.privacyEffectiveDate}
                  onChange={(e) => setFormData({ ...formData, privacyEffectiveDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#183F32] mb-1">Opening Statement / Introduction (English)</label>
                <textarea
                  rows={2}
                  value={formData.privacyIntro}
                  onChange={(e) => setFormData({ ...formData, privacyIntro: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#183F32] mb-1">Opening Statement / Introduction (Urdu)</label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={formData.privacyIntroUrdu || ''}
                  onChange={(e) => setFormData({ ...formData, privacyIntroUrdu: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none font-urdu"
                />
              </div>
            </div>
          </div>

          {/* Privacy Clauses & Sections */}
          <div className="bg-white p-6 rounded-3xl border border-[#AFC7A5]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#AFC7A5]/20">
              <div>
                <h3 className="font-serif font-bold text-base text-[#183F32]">Privacy Policy Clauses ({formData.privacySections?.length || 0})</h3>
                <p className="text-xs text-[#26312B]/70">Add, edit, or customize individual clauses in English and Urdu.</p>
              </div>
              <button
                type="button"
                onClick={handleAddPrivacySection}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#183F32] rounded-xl hover:bg-[#122F25] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Policy Clause</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.privacySections?.map((sec, idx) => (
                <div key={sec.id || idx} className="p-4 rounded-2xl border border-[#AFC7A5]/35 bg-[#FAF9F3]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#183F32] uppercase tracking-wider">Clause #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeletePrivacySection(idx)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      title="Remove this clause"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#183F32] mb-1">Clause Title (English)</label>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handlePrivacySectionChange(idx, 'title', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#183F32] mb-1">Clause Title (Urdu)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={sec.titleUrdu || ''}
                        onChange={(e) => handlePrivacySectionChange(idx, 'titleUrdu', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl bg-white font-urdu"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-[#183F32] mb-1">Clause Content (English)</label>
                      <textarea
                        rows={3}
                        value={sec.content}
                        onChange={(e) => handlePrivacySectionChange(idx, 'content', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl bg-white leading-relaxed"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-[#183F32] mb-1">Clause Content (Urdu)</label>
                      <textarea
                        rows={3}
                        dir="rtl"
                        value={sec.contentUrdu || ''}
                        onChange={(e) => handlePrivacySectionChange(idx, 'contentUrdu', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl bg-white font-urdu leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Closing Contact Notice */}
            <div className="pt-3 border-t border-[#AFC7A5]/20 space-y-2">
              <label className="block text-xs font-semibold text-[#183F32]">Bottom Contact / Removal Notice</label>
              <textarea
                rows={2}
                value={formData.privacyContactNotice}
                onChange={(e) => setFormData({ ...formData, privacyContactNotice: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Terms of Use Editor */}
      {activeTab === 'terms_of_use' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#AFC7A5]/30 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#183F32]">General Terms Page Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">Page Title (English)</label>
                <input
                  type="text"
                  value={formData.termsTitle}
                  onChange={(e) => setFormData({ ...formData, termsTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">Page Title (Urdu)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.termsTitleUrdu || ''}
                  onChange={(e) => setFormData({ ...formData, termsTitleUrdu: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none font-urdu"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">Page Subtitle (English)</label>
                <input
                  type="text"
                  value={formData.termsSubtitle}
                  onChange={(e) => setFormData({ ...formData, termsSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">Page Subtitle (Urdu)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.termsSubtitleUrdu || ''}
                  onChange={(e) => setFormData({ ...formData, termsSubtitleUrdu: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none font-urdu"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183F32] mb-1">Effective Date Notice</label>
                <input
                  type="text"
                  value={formData.termsEffectiveDate}
                  onChange={(e) => setFormData({ ...formData, termsEffectiveDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#183F32] mb-1">
                  Responsible Botanical Wellness Disclaimer Banner (English)
                </label>
                <textarea
                  rows={2}
                  value={formData.termsDisclaimerBox}
                  onChange={(e) => setFormData({ ...formData, termsDisclaimerBox: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-[#E8F1DF]/40"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#183F32] mb-1">
                  Responsible Botanical Wellness Disclaimer Banner (Urdu)
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={formData.termsDisclaimerBoxUrdu || ''}
                  onChange={(e) => setFormData({ ...formData, termsDisclaimerBoxUrdu: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:ring-2 focus:ring-[#183F32] focus:outline-none bg-[#E8F1DF]/40 font-urdu"
                />
              </div>
            </div>
          </div>

          {/* Terms Clauses & Sections */}
          <div className="bg-white p-6 rounded-3xl border border-[#AFC7A5]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#AFC7A5]/20">
              <div>
                <h3 className="font-serif font-bold text-base text-[#183F32]">Terms & Engagement Clauses ({formData.termsSections?.length || 0})</h3>
                <p className="text-xs text-[#26312B]/70">Add, edit, or customize individual terms clauses in English and Urdu.</p>
              </div>
              <button
                type="button"
                onClick={handleAddTermsSection}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#183F32] rounded-xl hover:bg-[#122F25] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Terms Clause</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.termsSections?.map((sec, idx) => (
                <div key={sec.id || idx} className="p-4 rounded-2xl border border-[#AFC7A5]/35 bg-[#FAF9F3]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#183F32] uppercase tracking-wider">Clause #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteTermsSection(idx)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      title="Remove this clause"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#183F32] mb-1">Clause Title (English)</label>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleTermsSectionChange(idx, 'title', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#183F32] mb-1">Clause Title (Urdu)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={sec.titleUrdu || ''}
                        onChange={(e) => handleTermsSectionChange(idx, 'titleUrdu', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl bg-white font-urdu"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-[#183F32] mb-1">Clause Content (English)</label>
                      <textarea
                        rows={3}
                        value={sec.content}
                        onChange={(e) => handleTermsSectionChange(idx, 'content', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl bg-white leading-relaxed"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-[#183F32] mb-1">Clause Content (Urdu)</label>
                      <textarea
                        rows={3}
                        dir="rtl"
                        value={sec.contentUrdu || ''}
                        onChange={(e) => handleTermsSectionChange(idx, 'contentUrdu', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl bg-white font-urdu leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Closing Contact Notice */}
            <div className="pt-3 border-t border-[#AFC7A5]/20 space-y-2">
              <label className="block text-xs font-semibold text-[#183F32]">Bottom Contact Notice</label>
              <textarea
                rows={2}
                value={formData.termsContactNotice}
                onChange={(e) => setFormData({ ...formData, termsContactNotice: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
