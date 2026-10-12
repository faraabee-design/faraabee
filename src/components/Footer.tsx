import React, { useState } from 'react';
import { FarabiLogo } from './FarabiLogo';
import { PageId } from '../types';
import { useStore } from '../context/StoreContext';
import { useCustomization, DynamicText } from '../context/CustomizationContext';
import { Mail, Phone, MapPin, Send, Check, MessageCircle, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

// Crisp SVG Icons for Social Platforms
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

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { socialLinks, contactInfo } = useStore();
  const { theme } = useCustomization();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3500);
    }
  };

  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compile social items list
  const socialIconsList = [
    { id: 'instagram', name: 'Instagram', url: socialLinks.instagram, icon: InstagramIcon },
    { id: 'x', name: 'X (Twitter)', url: socialLinks.x, icon: XIcon },
    { id: 'youtube', name: 'YouTube', url: socialLinks.youtube, icon: YouTubeIcon },
    { id: 'tiktok', name: 'TikTok', url: socialLinks.tiktok, icon: TikTokIcon },
    { id: 'facebook', name: 'Facebook', url: socialLinks.facebook, icon: FacebookIcon },
    { id: 'whatsapp', name: 'WhatsApp', url: socialLinks.whatsapp || `https://wa.me/${contactInfo.whatsappNumber}`, icon: MessageCircle },
    ...(socialLinks.linkedin ? [{ id: 'linkedin', name: 'LinkedIn', url: socialLinks.linkedin, icon: LinkedInIcon }] : []),
    ...(socialLinks.pinterest ? [{ id: 'pinterest', name: 'Pinterest', url: socialLinks.pinterest, icon: PinterestIcon }] : []),
    ...(socialLinks.customUrl ? [{ id: 'custom', name: socialLinks.customPlatform || 'Link', url: socialLinks.customUrl, icon: Globe }] : []),
  ].filter((item) => Boolean(item.url));

  const whatsappDeskUrl = socialLinks.whatsapp || `https://wa.me/${contactInfo.whatsappNumber || '923091655743'}`;

  return (
    <footer
      className="pt-16 pb-12 border-t border-black/10 transition-colors"
      style={{
        backgroundColor: theme.footerBgColor,
        color: theme.footerTextColor,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <FarabiLogo variant="light" size="lg" />
              <div className="mt-4 max-w-sm">
                <DynamicText
                  id="footerBrandBio"
                  as="p"
                  className="text-xs sm:text-sm opacity-85 leading-relaxed"
                />
              </div>
              <div className="mt-3" dir="rtl">
                <DynamicText
                  id="footerUrduTagline"
                  as="p"
                  className="font-urdu text-sm"
                />
              </div>
            </div>

            {/* Social Media Channels Row */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
              <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#AFC7A5]">
                Connect With FARABI
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {socialIconsList.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.name}
                      aria-label={item.name}
                      className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#AFC7A5] hover:text-[#183F32] text-[#FAF9F3] flex items-center justify-center transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-2">
                <a
                  href={whatsappDeskUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#285844] hover:bg-[#285844]/80 text-[#FAF9F3] text-xs font-semibold rounded-lg transition-colors border border-white/10"
                >
                  <MessageCircle className="w-4 h-4 text-[#AFC7A5]" />
                  <span>WhatsApp: {contactInfo.whatsappDisplay}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase font-semibold tracking-[0.16em] text-[#AFC7A5] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#FAF9F3]/80">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About FARAABEE
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('products')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Herbal Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('journal')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Herbal Journal
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about-herbal')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Herbal Wisdom
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Customer & Policy */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase font-semibold tracking-[0.16em] text-[#AFC7A5] mb-4">
              Care & Policies
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#FAF9F3]/80">
              <li>
                <button
                  onClick={() => handleNav('track-order')}
                  className="hover:text-white transition-colors cursor-pointer font-medium text-emerald-300"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about-herbal')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Herbal Usage Guidance
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Wholesale & Bulk Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs uppercase font-semibold tracking-[0.16em] text-[#AFC7A5] mb-4">
                Botanical Journal Dispatch
              </h4>
              <p className="text-xs text-[#FAF9F3]/75 mb-3 leading-relaxed">
                Receive new product updates and herbal journal essays on traditional botanical care.
              </p>

              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/50 focus:outline-none focus:border-[#AFC7A5] focus:ring-1 focus:ring-[#AFC7A5]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#AFC7A5] hover:bg-white text-[#183F32] font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  aria-label="Subscribe to newsletter"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-[#AFC7A5] mt-1.5 font-medium">
                  Thank you. You are now subscribed to FARAABEE Journal.
                </p>
              )}
            </div>

            {/* Physical & Digital touchpoints */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-xs text-[#FAF9F3]/75">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#AFC7A5]" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#AFC7A5]" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors">
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#AFC7A5]" />
                <span>{contactInfo.address}, {contactInfo.city}, {contactInfo.country}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Disclaimer & Hostinger Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#FAF9F3]/60 gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <p>© 2026 FARAABEE. All rights reserved. Handcrafted herbal wellness.</p>
            <span className="text-[#FAF9F3]/30">•</span>
            <button
              onClick={() => handleNav('admin')}
              className="hover:text-white transition-colors cursor-pointer text-[11px] underline opacity-70 hover:opacity-100"
            >
              Admin Portal
            </button>
          </div>

          <div className="text-center md:text-right text-[11px] max-w-xl opacity-60">
            <DynamicText id="footerDisclaimer" />
          </div>
        </div>
      </div>
    </footer>
  );
};
