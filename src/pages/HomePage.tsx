import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { TrustStrip } from '../components/TrustStrip';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { BundlesSection } from '../components/BundlesSection';
import { RemedyQuizModal } from '../components/RemedyQuizModal';
import { HikmatSection } from '../components/HikmatSection';
import { BotanicalCompendium } from '../components/BotanicalCompendium';
import { ReviewsSection } from '../components/ReviewsSection';
import { PromotionBanner } from '../components/PromotionBanner';
import { HerbalPhilosophy } from '../components/HerbalPhilosophy';
import { BotanicalStory } from '../components/BotanicalStory';
import { WhyFarabi } from '../components/WhyFarabi';
import { JournalPreview } from '../components/JournalPreview';
import { CallToAction } from '../components/CallToAction';
import { Product, Article, PageId } from '../types';
import { Sparkles, ArrowRight, BookOpen, Compass } from 'lucide-react';

interface HomePageProps {
  products: Product[];
  articles: Article[];
  onNavigate: (page: PageId, slug?: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectArticle: (article: Article) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  articles,
  onNavigate,
  onAddToCart,
  onSelectArticle,
}) => {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <div>
      <Hero
        onExploreClick={() => onNavigate('products')}
        onAboutClick={() => onNavigate('about')}
        onSpiritualClick={() => onNavigate('spiritual')}
      />

      <TrustStrip />

      {/* Interactive Remedy Finder Quick Launch Bar */}
      <div className="bg-[#E3EBDD]/70 border-y border-[#AFC7A5]/40 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#183F32] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Compass className="w-5 h-5 text-[#AFC7A5]" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#183F32]">
                Not sure which botanical formulation aligns with your need?
              </h3>
              <p className="text-xs text-[#285844]">
                Take our 30-second Tibb & Sunnah assessment for personalized cold-pressed remedies and prophetic wazaif.
              </p>
            </div>
          </div>

          <button
            onClick={() => setQuizOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#183F32] text-white hover:bg-[#285844] text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#AFC7A5]" />
            <span>Launch Remedy Finder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <FeaturedProducts
        products={products}
        onViewProduct={(slug) => onNavigate('product-detail', slug)}
        onAddToCart={onAddToCart}
        onViewAllClick={() => onNavigate('products')}
      />

      {/* Curated Care Bundles / Value Sets */}
      <BundlesSection
        onViewProduct={(slug) => onNavigate('product-detail', slug)}
        onAddToCart={onAddToCart}
      />

      {/* Prophetic Herbs & Tibb-e-Nabawi Cards */}
      <HikmatSection
        onExploreProduct={(slug) => onNavigate('product-detail', slug)}
        onExploreSpiritual={() => onNavigate('spiritual')}
      />

      {/* Indigenous Botanical Compendium / Herbarium */}
      <BotanicalCompendium
        onExploreProduct={(slug) => onNavigate('product-detail', slug)}
      />

      {/* Dynamic Promotion Banner */}
      <PromotionBanner
        onViewProduct={(slug) => onNavigate('product-detail', slug)}
        onExploreProducts={() => onNavigate('products')}
      />

      <HerbalPhilosophy
        onLearnMoreClick={() => onNavigate('about')}
      />

      {/* Customer Verified Reviews & Testimonials */}
      <ReviewsSection />

      <BotanicalStory />

      <WhyFarabi />

      <JournalPreview
        articles={articles}
        onSelectArticle={onSelectArticle}
        onViewJournalClick={() => onNavigate('journal')}
      />

      <CallToAction
        onExploreClick={() => onNavigate('products')}
        onContactClick={() => onNavigate('contact')}
        onSpiritualClick={() => onNavigate('spiritual')}
      />

      {/* Interactive Remedy Quiz Modal */}
      <RemedyQuizModal
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        onViewProduct={(slug) => onNavigate('product-detail', slug)}
        onAddToCart={onAddToCart}
      />
    </div>
  );
};
