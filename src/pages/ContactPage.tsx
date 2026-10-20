import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle2, ExternalLink, Globe } from 'lucide-react';

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

export const ContactPage: React.FC = () => {
  const { socialLinks, contactInfo } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 600);
  };

  const openWhatsApp = () => {
    const text = `Salam FARAABEE Team,%0A%0AI have an inquiry regarding your herbal wellness products.`;
    const num = contactInfo.whatsappNumber || '923091655743';
    window.open(`https://wa.me/${num}?text=${text}`, '_blank');
  };

  // Compile active social media channels
  const activeSocials = [
    {
      id: 'instagram',
      name: 'Instagram',
      url: socialLinks.instagram,
      handle: '@faraabeeherbal',
      icon: InstagramIcon,
      color: 'text-[#E1306C]',
      bgColor: 'bg-[#E1306C]/10',
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      url: socialLinks.x,
      handle: '@faraabeeherbal',
      icon: XIcon,
      color: 'text-black',
      bgColor: 'bg-black/5',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: socialLinks.youtube,
      handle: 'FARAABEE Herbal',
      icon: YouTubeIcon,
      color: 'text-[#FF0000]',
      bgColor: 'bg-[#FF0000]/10',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      url: socialLinks.tiktok,
      handle: '@faraabeeherbal',
      icon: TikTokIcon,
      color: 'text-[#000000]',
      bgColor: 'bg-[#000000]/5',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: socialLinks.facebook,
      handle: 'faraabeeherbal',
      icon: FacebookIcon,
      color: 'text-[#1877F2]',
      bgColor: 'bg-[#1877F2]/10',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Desk',
      url: socialLinks.whatsapp || `https://wa.me/${contactInfo.whatsappNumber}`,
      handle: contactInfo.whatsappDisplay,
      icon: MessageCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    ...(socialLinks.linkedin
      ? [
          {
            id: 'linkedin',
            name: 'LinkedIn',
            url: socialLinks.linkedin,
            handle: 'FARAABEE Herbal Wellness',
            icon: LinkedInIcon,
            color: 'text-[#0A66C2]',
            bgColor: 'bg-[#0A66C2]/10',
          },
        ]
      : []),
    ...(socialLinks.pinterest
      ? [
          {
            id: 'pinterest',
            name: 'Pinterest',
            url: socialLinks.pinterest,
            handle: 'faraabeeherbal',
            icon: PinterestIcon,
            color: 'text-[#BD081C]',
            bgColor: 'bg-[#BD081C]/10',
          },
        ]
      : []),
    ...(socialLinks.customPlatform && socialLinks.customUrl
      ? [
          {
            id: 'custom',
            name: socialLinks.customPlatform,
            url: socialLinks.customUrl,
            handle: 'Official Channel',
            icon: Globe,
            color: 'text-[#183F32]',
            bgColor: 'bg-[#183F32]/10',
          },
        ]
      : []),
  ].filter((item) => Boolean(item.url));

  return (
    <div className="bg-[#FAF9F3] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Hero */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#285844]">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#183F32] mt-2">
            Contact FARAABEE
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#26312B]/75 leading-relaxed">
            Have questions regarding botanical preparations, custom orders, or wholesale inquiries? Our herbal desk in Gujranwala is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#AFC7A5]/35 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#E8F1DF] text-[#183F32] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#285844]" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#183F32]">
                  Message Dispatched
                </h3>
                <p className="text-sm text-[#26312B]/80 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to FARAABEE Herbal Wellness. An apothecary advisor will review your note and respond within 24 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-[#183F32] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#285844] transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="font-serif text-2xl font-medium text-[#183F32] mb-1">
                    Send a Message
                  </h3>
                  <p className="text-xs text-[#26312B]/70">
                    Fill out the fields below and our herbal team will assist you.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#26312B] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Faraabee"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#AFC7A5]/50 focus:border-[#183F32] focus:outline-none bg-[#FAF9F3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#26312B] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#AFC7A5]/50 focus:border-[#183F32] focus:outline-none bg-[#FAF9F3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#26312B] mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone or WhatsApp number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#AFC7A5]/50 focus:border-[#183F32] focus:outline-none bg-[#FAF9F3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#26312B] mb-1">
                      Subject Inquiry
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#AFC7A5]/50 focus:border-[#183F32] focus:outline-none bg-[#FAF9F3] text-[#26312B] cursor-pointer"
                    >
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Order Tracking">Order & Delivery Assistance</option>
                      <option value="Wholesale / Stockist">Wholesale & Stockist Inquiries</option>
                      <option value="Botanical Guidance">Botanical Usage Guidance</option>
                      <option value="General Feedback">General Note</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#26312B] mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How may our herbalist desk assist you today?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#AFC7A5]/50 focus:border-[#183F32] focus:outline-none bg-[#FAF9F3] text-[#26312B]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {loading ? (
                    <span>Transmitting...</span>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Direct Touchpoints, WhatsApp & Social Channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Quick Order Highlight Box */}
            <div className="p-6 rounded-3xl bg-[#183F32] text-white shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#AFC7A5]" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-medium">
                    Immediate WhatsApp Desk
                  </h4>
                  <p className="text-xs text-[#FAF9F3]/70">
                    Connect directly with our team for prompt orders
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#FAF9F3]/80 leading-relaxed">
                Prefer direct messaging? Send us a WhatsApp text with your requested herbal products, quantity, and delivery city for expedited dispatch.
              </p>

              <button
                onClick={openWhatsApp}
                className="w-full py-2.5 px-4 bg-[#AFC7A5] hover:bg-white text-[#183F32] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp ({contactInfo.whatsappDisplay})</span>
              </button>
            </div>

            {/* Official Social Media Channels Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#AFC7A5]/35 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#AFC7A5]/25">
                <div>
                  <h4 className="font-serif text-lg font-semibold text-[#183F32]">
                    Official Social Channels
                  </h4>
                  <p className="text-[11px] text-[#26312B]/70 mt-0.5">
                    Follow FARABI for botanical insights, remedies, and news.
                  </p>
                </div>
                <Globe className="w-5 h-5 text-[#183F32]/60" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {activeSocials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F3]/60 hover:bg-[#FAF9F3] border border-[#AFC7A5]/30 hover:border-[#183F32]/40 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl ${s.bgColor} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 ${s.color}`} />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-[#183F32] truncate">
                            {s.name}
                          </span>
                          <span className="block text-[10px] text-[#26312B]/60 truncate">
                            {s.handle}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#26312B]/40 group-hover:text-[#183F32] group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Direct Contact Points */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#AFC7A5]/35 shadow-xs space-y-4">
              <h4 className="font-serif text-lg font-semibold text-[#183F32] pb-3 border-b border-[#AFC7A5]/25">
                Headquarters & Hours
              </h4>

              <div className="space-y-3.5 text-xs sm:text-sm text-[#26312B]/85">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF9F3]/60 border border-[#AFC7A5]/30">
                  <div className="p-2 bg-[#E3EBDD] text-[#183F32] rounded-xl shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#183F32]" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#183F32] block text-xs uppercase tracking-wider mb-0.5">
                      Apothecary Atelier & Headquarters
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#183F32] leading-relaxed block tracking-wide">
                      {contactInfo.address}, {contactInfo.city}, {contactInfo.country}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#285844] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#183F32] block">Business Hours</span>
                    <span className="text-xs">{contactInfo.businessHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#285844] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#183F32] block">Electronic Correspondence</span>
                    <a href={`mailto:${contactInfo.email}`} className="text-xs hover:text-[#183F32] underline">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#285844] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#183F32] block">Phone Desk</span>
                    <a href={`tel:${contactInfo.phone}`} className="text-xs hover:text-[#183F32]">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
