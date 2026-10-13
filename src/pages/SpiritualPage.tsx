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
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface SpiritualPageProps {
  onNavigateProduct?: (slug: string) => void;
  onExploreProducts: () => void;
}

export const SpiritualPage: React.FC<SpiritualPageProps> = ({
  onNavigateProduct,
  onExploreProducts,
}) => {
  const { spiritualPosts, spiritualSettings, contactInfo, products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<SpiritualPost | null>(null);

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
            <a
              href={getGeneralConsultationUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer border border-[#AFC7A5]/40"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>{spiritualSettings.contactButtonText || 'Consult on Spiritual Formulations'}</span>
            </a>
            <button
              onClick={onExploreProducts}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#FAF9F3] text-[#183F32] text-xs font-semibold uppercase tracking-wider rounded-xl border border-[#AFC7A5] hover:border-[#183F32] transition-colors cursor-pointer"
            >
              <span>View Apothecary Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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

                  {/* Card Footer: Little Contact Button & Actions */}
                  <div className="p-6 sm:p-8 pt-0 border-t border-[#AFC7A5]/20 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] text-[#26312B]/60 font-medium">
                      FARAABEE Apothecary Guidance Desk
                    </span>

                    {/* The Little Contact Button */}
                    <a
                      href={getWhatsAppInquiryUrl(post)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-bold rounded-xl transition-all shadow-xs hover:shadow cursor-pointer border border-[#AFC7A5]/40"
                      title="Contact Faraabee on WhatsApp regarding this spiritual remedy"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>{post.contactPrompt || 'Consult on WhatsApp'}</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
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

            <div className="pt-4 flex flex-wrap items-center gap-4">
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
          </div>
        </div>
      </section>
    </div>
  );
};
