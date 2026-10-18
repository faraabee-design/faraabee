import React from 'react';
import { useStore } from '../context/StoreContext';
import { BookOpen, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface HikmatSectionProps {
  onExploreProduct?: (slug: string) => void;
  onExploreSpiritual?: () => void;
}

export const HikmatSection: React.FC<HikmatSectionProps> = ({
  onExploreProduct,
  onExploreSpiritual,
}) => {
  const { hikmatCards } = useStore();
  const activeCards = hikmatCards.filter((c) => c.active);

  if (activeCards.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-[#FAF9F3] border-b border-[#AFC7A5]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3EBDD] text-[#183F32] text-xs font-semibold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5 text-[#285844]" />
              <span>Tibb-e-Nabawi & Classical Wisdom</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#183F32] tracking-tight">
              Prophetic Herbs & Holistic Healing
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#26312B]/75 max-w-xl">
              Authentic Sunnah citations harmonized with modern botanical pharmacology. We formulate according to timeless principles of purity and intention.
            </p>
          </div>

          {onExploreSpiritual && (
            <button
              onClick={onExploreSpiritual}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-[#183F32] hover:text-[#285844] uppercase tracking-wider group cursor-pointer"
            >
              <span>Explore Spiritual Sanctuary</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-3xl border border-[#AFC7A5]/40 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-6 pb-4">
                {/* Reference tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#183F32] bg-[#FAF9F3] px-2.5 py-1 rounded-md border border-[#AFC7A5]/30">
                    {card.propheticReference}
                  </span>
                  <span className="text-xs font-semibold text-[#285844]">
                    {card.botanicalHerb}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#183F32] mb-1">
                  {card.title}
                </h3>
                {card.urduTitle && (
                  <p className="font-urdu text-sm text-[#285844] mb-3" dir="rtl">
                    {card.urduTitle}
                  </p>
                )}

                {/* Hadith Box */}
                <div className="p-4 rounded-2xl bg-[#FAF9F3] border border-[#AFC7A5]/30 my-4 space-y-2">
                  <p className="text-xs sm:text-sm text-[#183F32] font-serif italic leading-relaxed">
                    {card.hadithText}
                  </p>
                  {card.urduHadithText && (
                    <p className="font-urdu text-sm text-[#285844] leading-loose pt-1 border-t border-[#AFC7A5]/20" dir="rtl">
                      {card.urduHadithText}
                    </p>
                  )}
                </div>

                {/* Modern Significance */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#183F32]/80 block mb-1">
                    Contemporary Pharmacological Insight:
                  </span>
                  <p className="text-xs text-[#26312B]/75 leading-relaxed">
                    {card.modernSignificance}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              {card.relatedProductSlug && onExploreProduct && (
                <div className="px-6 py-4 bg-[#FAF9F3]/60 border-t border-[#AFC7A5]/25 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#183F32]">
                    Formulated into our apothecary
                  </span>
                  <button
                    onClick={() => onExploreProduct(card.relatedProductSlug!)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#183F32] hover:text-[#285844] group cursor-pointer"
                  >
                    <span>View Formula</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
