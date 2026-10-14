import React from 'react';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/farabi_hero_composition_1790683539660.jpg';
import { useCustomization, DynamicText } from '../context/CustomizationContext';

interface HeroProps {
  onExploreClick: () => void;
  onAboutClick: () => void;
  onSpiritualClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onAboutClick, onSpiritualClick }) => {
  const { theme } = useCustomization();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF9F3] via-[#FAF9F3] to-[#E8F1DF]/40 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#AFC7A5]/25">
      {/* Decorative organic background curves */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#E8F1DF]/70 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#AFC7A5]/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[540px]">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center max-w-2xl">
            {/* Eyebrow / Badge */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Leaf className="w-4 h-4 text-[#285844]" />
              <DynamicText
                id="heroBadge"
                className="text-xs font-semibold tracking-[0.2em] uppercase"
              />
              <span className="text-xs text-[#AFC7A5]" aria-hidden="true">·</span>
              <DynamicText
                id="heroUrduHeading"
                className="font-urdu text-sm"
              />
            </div>

            {/* Display Headline */}
            <div className="mb-6 leading-[1.12] tracking-tight">
              <DynamicText
                id="heroHeading"
                as="h1"
                className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium leading-[1.12]"
              />
            </div>

            {/* Supporting Copy */}
            <div className="mb-8 max-w-xl">
              <DynamicText
                id="heroSubtitle"
                as="p"
                className="text-base sm:text-lg font-normal leading-relaxed text-[#26312B]/85"
              />
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold tracking-wide uppercase rounded-xl shadow-xs hover:shadow transition-all duration-200 cursor-pointer focus-visible:outline-2"
                style={{
                  backgroundColor: theme.buttonBgColor,
                  color: theme.buttonTextColor,
                }}
              >
                <DynamicText id="heroBtnPrimary" />
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onAboutClick}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold tracking-wide uppercase bg-white hover:bg-[#FAF9F3] border border-[#AFC7A5] hover:border-[#183F32] rounded-xl transition-all duration-200 cursor-pointer"
                style={{ color: theme.primaryColor }}
              >
                <DynamicText id="heroBtnSecondary" />
              </button>

              {onSpiritualClick && (
                <button
                  onClick={onSpiritualClick}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold tracking-wide uppercase bg-[#183F32] hover:bg-[#285844] text-white rounded-xl shadow-xs hover:shadow transition-all duration-200 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#B79A5B]" />
                  <span>Spiritual Sanctuary</span>
                </button>
              )}
            </div>

            {/* Trust highlights bar */}
            <div className="mt-10 pt-6 border-t border-[#AFC7A5]/30 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#26312B]/75 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                <span>Small Batch Maceration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.secondaryColor }} />
                <span>Zero Synthetic Fragrances</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#AFC7A5]" />
                <span>100% Botanical Goodness</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Composition Artwork */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E8F1DF] to-[#FAF9F3] rounded-[2.5rem] transform rotate-1 scale-102 border border-[#AFC7A5]/40 shadow-xs" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-[#AFC7A5]/25 blur-xl pointer-events-none" />

            {/* Product image container */}
            <div className="relative z-10 w-full overflow-hidden rounded-3xl bg-white shadow-md border border-[#AFC7A5]/30 p-2 sm:p-3 group">
              <img
                src={heroImg}
                alt="FARAABEE botanical herbal wellness collection"
                className="w-full h-auto object-cover rounded-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                loading="eager"
              />

              <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md py-2.5 px-4 rounded-xl border border-[#AFC7A5]/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#B79A5B]" />
                  <span className="font-medium text-[#183F32]">Artisanal Botanical Series</span>
                </div>
                <span className="text-[#285844] font-urdu text-xs">خالص قدرتی اجزاء</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
