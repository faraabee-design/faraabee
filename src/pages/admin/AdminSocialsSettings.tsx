import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { SocialLinks } from '../../types';
import {
  Globe,
  Save,
  ExternalLink,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface AdminSocialsSettingsProps {
  onNotify: (msg: string) => void;
}

// Custom crisp SVG icons for accurate brand logos
const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YouTubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TikTokIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.52c-.01 1.95-.77 3.88-2.14 5.25-1.58 1.58-3.84 2.37-6.07 2.16-2.52-.24-4.83-1.63-6.09-3.79-1.26-2.17-1.28-4.94-.06-7.14 1.22-2.2 3.54-3.64 6.07-3.9v4.14c-1.1.13-2.15.75-2.73 1.7-.58.95-.59 2.18-.03 3.14.56.96 1.62 1.59 2.73 1.69 1.16.1 2.33-.36 3.05-1.27.42-.53.66-1.19.66-1.87V.02z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const PinterestIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
);

export const AdminSocialsSettings: React.FC<AdminSocialsSettingsProps> = ({ onNotify }) => {
  const { socialLinks, contactInfo, updateSocialLinks, updateContactInfo } = useStore();

  const [links, setLinks] = useState<SocialLinks>(socialLinks);
  const [contact, setContact] = useState(contactInfo);
  const [savingSocials, setSavingSocials] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  useEffect(() => {
    setLinks(socialLinks);
  }, [socialLinks]);

  useEffect(() => {
    setContact(contactInfo);
  }, [contactInfo]);

  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSocials(true);
    try {
      await updateSocialLinks(links);
      onNotify('Social media channels updated successfully!');
    } catch {
      onNotify('Failed to save social media channels.');
    } finally {
      setSavingSocials(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      await updateContactInfo(contact);
      onNotify('Contact touchpoints updated successfully!');
    } catch {
      onNotify('Failed to save contact info.');
    } finally {
      setSavingContact(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#AFC7A5]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#183F32]">
              Live Real-Time Sync
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#183F32] mt-1">
            Social Media & Contact Channels
          </h2>
          <p className="text-xs text-[#26312B]/70 mt-1 max-w-2xl leading-relaxed">
            Configure your official social handles and direct communication channels. Any link you add here is published to <strong>faraabee.com</strong> in real time across the Contact Page, Footer, and customer order points.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Social Media Platforms */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#AFC7A5]/30 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#AFC7A5]/25 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E3EBDD] flex items-center justify-center text-[#183F32]">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#183F32]">
                  Social Media Links
                </h3>
                <p className="text-[11px] text-[#26312B]/70">
                  Paste the full URL to your profile or page (leave blank to hide).
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveSocials} className="space-y-5">
            {/* Instagram */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#183F32]">
                  <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
                  <span>Instagram URL</span>
                </label>
                {links.instagram && (
                  <a
                    href={links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#183F32] hover:underline"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={links.instagram || ''}
                onChange={(e) => setLinks({ ...links, instagram: e.target.value })}
                placeholder="https://instagram.com/faraabeeherbal"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] focus:ring-1 focus:ring-[#183F32] bg-[#FAF9F3]/30"
              />
            </div>

            {/* X (formerly Twitter) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#183F32]">
                  <XIcon className="w-3.5 h-3.5 text-black" />
                  <span>X (Twitter) URL</span>
                </label>
                {links.x && (
                  <a
                    href={links.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#183F32] hover:underline"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={links.x || ''}
                onChange={(e) => setLinks({ ...links, x: e.target.value })}
                placeholder="https://x.com/faraabeeherbal"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] focus:ring-1 focus:ring-[#183F32] bg-[#FAF9F3]/30"
              />
            </div>

            {/* YouTube */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#183F32]">
                  <YouTubeIcon className="w-4 h-4 text-[#FF0000]" />
                  <span>YouTube Channel URL</span>
                </label>
                {links.youtube && (
                  <a
                    href={links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#183F32] hover:underline"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={links.youtube || ''}
                onChange={(e) => setLinks({ ...links, youtube: e.target.value })}
                placeholder="https://youtube.com/@faraabeeherbal"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] focus:ring-1 focus:ring-[#183F32] bg-[#FAF9F3]/30"
              />
            </div>

            {/* TikTok */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#183F32]">
                  <TikTokIcon className="w-3.5 h-3.5 text-black" />
                  <span>TikTok Profile URL</span>
                </label>
                {links.tiktok && (
                  <a
                    href={links.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#183F32] hover:underline"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={links.tiktok || ''}
                onChange={(e) => setLinks({ ...links, tiktok: e.target.value })}
                placeholder="https://tiktok.com/@faraabeeherbal"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] focus:ring-1 focus:ring-[#183F32] bg-[#FAF9F3]/30"
              />
            </div>

            {/* Facebook */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#183F32]">
                  <FacebookIcon className="w-4 h-4 text-[#1877F2]" />
                  <span>Facebook Page URL</span>
                </label>
                {links.facebook && (
                  <a
                    href={links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#183F32] hover:underline"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={links.facebook || ''}
                onChange={(e) => setLinks({ ...links, facebook: e.target.value })}
                placeholder="https://facebook.com/faraabeeherbal"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] focus:ring-1 focus:ring-[#183F32] bg-[#FAF9F3]/30"
              />
            </div>

            {/* WhatsApp Direct Link */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#183F32]">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Direct Chat Link</span>
                </label>
                {links.whatsapp && (
                  <a
                    href={links.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#183F32] hover:underline"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={links.whatsapp || ''}
                onChange={(e) => setLinks({ ...links, whatsapp: e.target.value })}
                placeholder="https://wa.me/your-number"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] focus:ring-1 focus:ring-[#183F32] bg-[#FAF9F3]/30"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#183F32]">
                  <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />
                  <span>LinkedIn Profile / Company URL (Optional)</span>
                </label>
                {links.linkedin && (
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#183F32] hover:underline"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={links.linkedin || ''}
                onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
                placeholder="https://linkedin.com/company/faraabee"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] focus:ring-1 focus:ring-[#183F32] bg-[#FAF9F3]/30"
              />
            </div>

            {/* Pinterest */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#183F32]">
                  <PinterestIcon className="w-4 h-4 text-[#BD081C]" />
                  <span>Pinterest Board / Profile URL (Optional)</span>
                </label>
                {links.pinterest && (
                  <a
                    href={links.pinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#183F32] hover:underline"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={links.pinterest || ''}
                onChange={(e) => setLinks({ ...links, pinterest: e.target.value })}
                placeholder="https://pinterest.com/faraabeeherbal"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#AFC7A5]/40 focus:border-[#183F32] focus:ring-1 focus:ring-[#183F32] bg-[#FAF9F3]/30"
              />
            </div>

            {/* Custom Additional Platform */}
            <div className="p-4 bg-[#FAF9F3] rounded-2xl border border-[#AFC7A5]/30 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#183F32]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#183F32]">
                  Custom Link / Any Other Platform
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#26312B]/75 mb-1">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={links.customPlatform || ''}
                    onChange={(e) => setLinks({ ...links, customPlatform: e.target.value })}
                    placeholder="e.g. Threads, Telegram, Snapchat"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 bg-white focus:outline-none focus:ring-1 focus:ring-[#183F32]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#26312B]/75 mb-1">
                    Destination URL
                  </label>
                  <input
                    type="url"
                    value={links.customUrl || ''}
                    onChange={(e) => setLinks({ ...links, customUrl: e.target.value })}
                    placeholder="https://threads.net/@..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 bg-white focus:outline-none focus:ring-1 focus:ring-[#183F32]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingSocials}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#183F32] hover:bg-[#122F25] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingSocials ? 'Saving to Cloud...' : 'Save Social Channels'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Contact Details (Address, Phone, Email, Hours) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#AFC7A5]/30 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#AFC7A5]/25">
            <div className="w-9 h-9 rounded-xl bg-[#E3EBDD] flex items-center justify-center text-[#183F32]">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#183F32]">
                Contact Info & Desk
              </h3>
              <p className="text-[11px] text-[#26312B]/70">
                Shown on Contact Page and store footer.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveContact} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                Official Email
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#26312B]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 bg-[#FAF9F3]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                Phone Hotline
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[#26312B]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 bg-[#FAF9F3]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                WhatsApp Display Number
              </label>
              <div className="relative">
                <MessageCircle className="w-3.5 h-3.5 text-[#26312B]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={contact.whatsappDisplay}
                  onChange={(e) => setContact({ ...contact, whatsappDisplay: e.target.value })}
                  placeholder="WhatsApp Display Number"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 bg-[#FAF9F3]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                Street Address
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-[#26312B]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={contact.address}
                  onChange={(e) => setContact({ ...contact, address: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 bg-[#FAF9F3]/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={contact.city}
                  onChange={(e) => setContact({ ...contact, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 bg-[#FAF9F3]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                  Country
                </label>
                <input
                  type="text"
                  required
                  value={contact.country}
                  onChange={(e) => setContact({ ...contact, country: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 bg-[#FAF9F3]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                Business & Desk Hours
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-[#26312B]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={contact.businessHours}
                  onChange={(e) => setContact({ ...contact, businessHours: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#AFC7A5]/40 bg-[#FAF9F3]/30"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingContact}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#183F32] hover:bg-[#122F25] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingContact ? 'Saving...' : 'Save Contact Info'}</span>
              </button>
            </div>
          </form>

          {/* Quick Preview Card */}
          <div className="p-4 rounded-2xl bg-[#FAF9F3] border border-[#AFC7A5]/30 space-y-2 text-xs text-[#26312B]">
            <div className="flex items-center gap-1.5 font-bold text-[#183F32]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-Time Sync Activated</span>
            </div>
            <p className="text-[11px] text-[#26312B]/75 leading-relaxed">
              When you save, the Contact page and Footer reflect these new phone numbers and links immediately without requiring any code deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
