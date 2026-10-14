import React from 'react';
import { Hero } from '../components/Hero';
import { TrustStrip } from '../components/TrustStrip';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { PromotionBanner } from '../components/PromotionBanner';
import { HerbalPhilosophy } from '../components/HerbalPhilosophy';
import { BotanicalStory } from '../components/BotanicalStory';
import { WhyFarabi } from '../components/WhyFarabi';
import { JournalPreview } from '../components/JournalPreview';
import { CallToAction } from '../components/CallToAction';
import { Product, Article, PageId } from '../types';

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
  return (
    <div>
      <Hero
        onExploreClick={() => onNavigate('products')}
        onAboutClick={() => onNavigate('about')}
        onSpiritualClick={() => onNavigate('spiritual')}
      />

      <TrustStrip />

      <FeaturedProducts
        products={products}
        onViewProduct={(slug) => onNavigate('product-detail', slug)}
        onAddToCart={onAddToCart}
        onViewAllClick={() => onNavigate('products')}
      />

      {/* Dynamic Promotion Banner (renders when admin has active promotion) */}
      <PromotionBanner
        onViewProduct={(slug) => onNavigate('product-detail', slug)}
        onExploreProducts={() => onNavigate('products')}
      />

      <HerbalPhilosophy
        onLearnMoreClick={() => onNavigate('about')}
      />

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
    </div>
  );
};
