import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SpiritualPost } from '../types';
import {
  Sparkles,
  MessageCircle,
  Search,
  ExternalLink,
  Heart,
  Feather,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Phone,
  Filter,
  CalendarCheck,
  Mic,
  Clock,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { SpiritualAppointmentModal } from '../components/SpiritualAppointmentModal';

interface SpiritualPageProps {
  onNavigateProduct?: (slug: string) => void;
  onExploreProducts: () => void;
}

export const SpiritualPage: React.FC<SpiritualPageProps> = ({
  onNavigateProduct,
  onExploreProducts,
}) => {
  const { spiritualPosts, spiritualSettings, contactInfo, products, appointmentConfig, language } = useStore();
  const isUrdu = language === 'ur';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<SpiritualPost | null>(null);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [appointmentCategory, setAppointmentCategory] = useState<string | undefined>(undefined);

  // Derive unique categories from active posts
  const categories = Array.from(
    new Set(spiritualPosts.filter((p) => p.active && p.category).map((p) => p.category as string))
  );

  const filteredPosts = spiritualPosts.filter((post) => {
    if (!post.active) return false;
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      (post.subtitle && post.subtitle.toLowerCase().includes(q)) ||
      post.description.toLowerCase().includes(q) ||
      (post.arabicQuote && post.arabicQuote.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const getWhatsAppInquiryUrl = (post: SpiritualPost) => {
    const phone = contactInfo.whatsappNumber || '923091655743';
    const msg = `Salam FARAABEE Apothecary,%0A%0AI am reading your Spiritual Sanctuary article:%0A"*${post.title}*"%0A%0AI would like to consult about this spiritual remedy and recommendations.%0AThank you!`;
    return `https://wa.me/${phone}?text=${msg}`;
  };

  const getGeneralConsultationUrl = () => {
    const phone = contactInfo.whatsappNumber || '923091655743';
    const msg = `Salam FARAABEE Apothecary,%0A%0AI am interested in personal spiritual & botanical consultation from your Spiritual Sanctuary page.%0AThank you!`;
    return `https://wa.me/${phone}?text=${msg}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF9F3] text-[#26312B]">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#E8F1DF]/70 via-[#FAF9F3] to-[#FAF9F3] pt-16 pb-20 sm:pt-20 sm:pb-24 border-b border-[#AFC7A5]/30">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#AFC7A5]/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#183F32]/5 blur-2xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#183F32]/10 border border-[#183F32]/20 text-[#183F32] text-xs font-semibold uppercase tracking-[0.2em] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B79A5B]" />
            <span>{spiritualSettings.badge || 'FARAABEE SPIRITUAL SANCTUARY • روحانی شفا'}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#183F32] tracking-tight leading-[1.15]">
            {spiritualSettings.title || 'Spiritual Sanctuary & Botanical Wisdom'}
          </h1>

          {/* Quranic / Hadith Banner Callout */}
          {spiritualSettings.headerQuote && (
            <div className="my-6 p-6 sm:p-8 bg-white/90 rounded-2xl border border-[#AFC7A5]/40 shadow-xs max-w-2xl mx-auto relative group hover:border-[#183F32]/40 transition-colors">
              <span className="text-2xl sm:text-3xl font-serif text-[#183F32] block font-urdu leading-relaxed" dir="rtl">
                {spiritualSettings.headerQuote}
              </span>
              {spiritualSettings.headerQuoteTranslation && (
                <p className="text-xs sm:text-sm text-[#26312B]/75 mt-3 italic font-serif leading-relaxed">
                  &ldquo;{spiritualSettings.headerQuoteTranslation}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#26312B]/85 max-w-2xl mx-auto leading-relaxed">
            {spiritualSettings.subtitle ||
              'A contemplative sanctuary dedicated to spiritual wellbeing, heart serenity, prophetic botanicals (Tibb-e-Nabawi), and holistic healing for soul, mind, and body.'}
          </p>

          {/* Quick Action Button to Consult */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setAppointmentCategory(undefined);
                setAppointmentModalOpen(true);
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border border-[#AFC7A5]/40 group"
            >
              <CalendarCheck className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span>{isUrdu ? 'وقتِ ملاقات حاصل کریں (صوتی / تحریری)' : 'Book Consultation & Appointment'}</span>
              <Mic className="w-3.5 h-3.5 text-amber-300" />
            </button>

            <a
              href={getGeneralConsultationUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-[#FAF9F3] text-[#183F32] text-xs font-bold uppercase tracking-wider rounded-xl border border-[#AFC7A5] hover:border-[#183F32] transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>{spiritualSettings.contactButtonText || 'Consult on Spiritual Formulations'}</span>
            </a>

            <button
              onClick={onExploreProducts}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-[#FAF9F3] text-[#183F32] text-xs font-semibold uppercase tracking-wider rounded-xl border border-[#AFC7A5] hover:border-[#183F32] transition-colors cursor-pointer"
            >
              <span>View Apothecary Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Appointment Intake Highlight Card */}
          <div className="mt-6 p-5 sm:p-6 bg-white/95 rounded-3xl border border-[#AFC7A5]/40 shadow-sm max-w-2xl mx-auto backdrop-blur-xs space-y-3 text-left sm:text-center">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#AFC7A5]/20">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${appointmentConfig?.acceptingAppointments ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-[11px] font-bold text-[#183F32] uppercase tracking-wider">
                  {appointmentConfig?.acceptingAppointments ? 'Intake Open • صوتی و تحریری ملاقات' : 'Intake Scheduled'}
                </span>
              </div>
              <span className="text-[11px] text-[#26312B]/70 font-medium">
                {appointmentConfig?.acceptingAppointments
                  ? 'Voice Note or Written Problem'
                  : (isUrdu ? appointmentConfig?.closedNoticeMessageUrdu : appointmentConfig?.closedNoticeMessage) || 'Limited Daily Slots'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#26312B]/85 font-serif leading-relaxed">
              {isUrdu
                ? 'روحانی سکون و طبِ نبوی مشاورت: بول کر اپنی کیفیت ریکارڈ کروائیں یا تحریر کریں تاکہ باقاعدہ وقتِ ملاقات طے کیا جا سکے۔'
                : 'Share your condition via a recorded voice message or written details to receive a confirmed consultation timeline with our practitioner.'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#AFC7A5]/30 shadow-xs">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#183F32] text-white shadow-xs'
                  : 'bg-[#FAF9F3] text-[#26312B]/75 hover:bg-[#E8F1DF] hover:text-[#183F32]'
              }`}
            >
              All Wisdom ({spiritualPosts.filter((p) => p.active).length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#183F32] text-white shadow-xs'
                    : 'bg-[#FAF9F3] text-[#26312B]/75 hover:bg-[#E8F1DF] hover:text-[#183F32]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#26312B]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spiritual topics..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-[#FAF9F3]/40"
            />
          </div>
        </div>

        {/* Spiritual Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#AFC7A5]/40 p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-[#183F32]/30 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#183F32]">No Articles Found</h3>
            <p className="text-xs text-[#26312B]/60 max-w-md mx-auto">
              No spiritual entries match your search criteria. Try selecting another category or resetting the search filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-bold text-[#183F32] bg-[#FAF9F3] border border-[#AFC7A5]/40 rounded-xl hover:bg-[#E8F1DF] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPosts.map((post) => {
              // Find related product if linked
              const relatedProduct = post.relatedProductSlug
                ? products.find((p) => p.slug === post.relatedProductSlug || p.id === post.relatedProductSlug)
                : null;

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#AFC7A5]/35 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:border-[#183F32]/50"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative aspect-16/10 overflow-hidden bg-[#FAF9F3]">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                      {/* Category Badge */}
                      {post.category && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-xs text-[#183F32] text-[10px] font-bold uppercase tracking-widest rounded-full shadow-xs border border-[#AFC7A5]/30">
                          {post.category}
                        </span>
                      )}

                      {/* Islamic / Spiritual Symbol badge */}
                      <span className="absolute top-4 right-4 p-2 bg-[#183F32]/85 text-white rounded-full backdrop-blur-xs shadow-xs">
                        <Feather className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* Content Box */}
                    <div className="p-6 sm:p-8 space-y-4">
                      {/* Subtitle / Topic tag */}
                      {post.subtitle && (
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#B79A5B]">
                          {post.subtitle}
                        </p>
                      )}

                      {/* Title */}
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#183F32] leading-snug group-hover:text-[#285844] transition-colors">
                        {post.title}
                      </h2>

                      {/* Arabic / Quranic Quote callout box */}
                      {post.arabicQuote && (
                        <div className="p-4 bg-[#FAF9F3] rounded-2xl border-l-4 border-[#183F32] space-y-2">
                          <p className="text-xl sm:text-2xl font-serif text-[#183F32] font-urdu leading-relaxed" dir="rtl">
                            {post.arabicQuote}
                          </p>
                          {post.quoteTranslation && (
                            <p className="text-xs text-[#26312B]/75 italic font-serif">
                              &ldquo;{post.quoteTranslation}&rdquo;
                            </p>
                          )}
                        </div>
                      )}

                      {/* Description Box (Rich Multi-paragraph text) */}
                      <div className="text-sm text-[#26312B]/85 leading-relaxed space-y-3 whitespace-pre-line font-serif">
                        {post.description}
                      </div>

                      {/* Optional Related Product Tag */}
                      {relatedProduct && onNavigateProduct && (
                        <div className="pt-3 border-t border-[#AFC7A5]/20 flex items-center justify-between text-xs">
                          <span className="text-[#26312B]/60 font-medium">Recommended Formulation:</span>
                          <button
                            type="button"
                            onClick={() => onNavigateProduct(relatedProduct.slug)}
                            className="font-bold text-[#183F32] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>{relatedProduct.name}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Contact & Book Actions */}
                  <div className="p-6 sm:p-8 pt-0 border-t border-[#AFC7A5]/20 mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <span className="text-[11px] text-[#26312B]/60 font-medium">
                      FARAABEE Apothecary Guidance Desk
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAppointmentCategory(post.category);
                          setAppointmentModalOpen(true);
                        }}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#E8F1DF]/70 hover:bg-[#E8F1DF] text-[#183F32] text-xs font-bold rounded-xl border border-[#AFC7A5]/50 transition-colors cursor-pointer shadow-2xs"
                        title="Book dedicated 1-on-1 spiritual consultation slot"
                      >
                        <CalendarCheck className="w-3.5 h-3.5 text-[#183F32]" />
                        <span>Book Appointment</span>
                        <Mic className="w-3 h-3 text-[#B79A5B]" />
                      </button>

                      {/* The WhatsApp Inquiry Button */}
                      <a
                        href={getWhatsAppInquiryUrl(post)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-bold rounded-xl transition-all shadow-2xs hover:shadow cursor-pointer border border-[#AFC7A5]/40"
                        title="Contact Faraabee on WhatsApp regarding this spiritual remedy"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>{post.contactPrompt || 'Consult on WhatsApp'}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom Consultation Concierge Banner */}
        <div className="bg-gradient-to-br from-[#183F32] to-[#285844] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#AFC7A5] block">
              INDIVIDUAL SPIRITUAL & HERBAL COUNSEL
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              Looking for personalized spiritual advice or prophetic formulations?
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-serif">
              {spiritualSettings.consultationText ||
                'Whether you are seeking advice regarding Ruqyah preparations, pure Sidr wash, heart-calming floral essences, or prophetic daily regimens, our concierge is here to assist with sincerity.'}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setAppointmentCategory(undefined);
                  setAppointmentModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B79A5B] hover:from-[#c5a132] hover:to-[#a78b50] text-[#183F32] text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer font-sans"
              >
                <CalendarCheck className="w-4 h-4 text-[#183F32]" />
                <span>Book Appointment (Voice / Text)</span>
                <Mic className="w-3.5 h-3.5 text-[#183F32]" />
              </button>

              <a
                href={getGeneralConsultationUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20BA5C] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp Concierge</span>
              </a>

              <a
                href={`tel:${contactInfo.phone}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#AFC7A5]" />
                <span>Direct Call ({contactInfo.whatsappDisplay || contactInfo.phone})</span>
              </a>
            </div>

            {/* Faith-Based Spiritual & Non-Medical Legal Shield */}
            <div className="mt-8 p-4 rounded-xl bg-white/10 border border-white/20 text-left text-[11px] text-white/90 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#D4AF37] uppercase tracking-wider text-[10px]">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Faith-Based Guidance & Non-Medical Practice Legal Notice</span>
              </div>
              <p className="leading-relaxed">
                <strong>Spiritual Nature of Consultations:</strong> All sessions, audio submissions, wazaif, and Ruqyah guidance provided through FARAABEE Spiritual Sanctuary are traditional Islamic religious, faith-based supplications and spiritual wellbeing practices.
              </p>
              <p className="leading-relaxed text-white/75 text-[10px]">
                <strong>No Medical or Psychiatric Advice:</strong> These services do <em>not</em> constitute medical diagnosis, clinical psychotherapy, psychiatric treatment, or licensed healthcare practice under national or international laws. Individuals experiencing medical, clinical, or psychiatric emergencies must seek care from licensed medical physicians and psychiatric professionals immediately. Spiritual recitation is supplementary to, and never a substitute for, professional medical treatment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Quick Action Appointment Button */}
      <aside aria-label="Quick appointment trigger" className="fixed bottom-6 left-6 z-40">
        <button
          type="button"
          onClick={() => {
            setAppointmentCategory(undefined);
            setAppointmentModalOpen(true);
          }}
          className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-3 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-bold rounded-full shadow-2xl border border-[#D4AF37]/50 transition-all hover:scale-105 group cursor-pointer"
          title="Book Spiritual Consultation & Appointment"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <CalendarCheck className="w-4 h-4 text-[#D4AF37]" />
          <span className="hidden sm:inline">Book Spiritual Appointment</span>
          <span className="sm:hidden">Appointment</span>
          <span className="p-1 rounded-full bg-white/15 text-amber-300">
            <Mic className="w-3 h-3" />
          </span>
        </button>
      </aside>

      {/* Spiritual Appointment Booking Modal */}
      <SpiritualAppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        defaultCategory={appointmentCategory}
      />
    </div>
  );
};
