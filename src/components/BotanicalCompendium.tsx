import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BotanicalIngredient } from '../types';
import { Leaf, MapPin, Sparkles, Filter, ShieldCheck, ArrowRight } from 'lucide-react';

interface BotanicalCompendiumProps {
  onExploreProduct?: (slug: string) => void;
}

export const BotanicalCompendium: React.FC<BotanicalCompendiumProps> = ({
  onExploreProduct,
}) => {
  const { botanicals } = useStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'warm' | 'cold' | 'balanced'>('all');

  const filteredBotanicals = botanicals.filter((b) => {
    if (!b.active) return false;
    if (activeFilter === 'warm') return b.temperament.toLowerCase().includes('warm') || b.temperament.includes('گرم');
    if (activeFilter === 'cold') return b.temperament.toLowerCase().includes('cold') || b.temperament.includes('سرد');
    if (activeFilter === 'balanced') return b.temperament.toLowerCase().includes('balanced') || b.temperament.includes('معتدل');
    return true;
  });

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#AFC7A5]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3EBDD] text-[#183F32] text-xs font-semibold uppercase tracking-wider mb-3">
              <Leaf className="w-3.5 h-3.5 text-[#285844]" />
              <span>Native Apothecary Herbarium</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#183F32] tracking-tight">
              Indigenous Botanical Compendium
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#26312B]/75 max-w-xl">
              Explore the raw botanical treasures sourced directly from Pakistan’s fertile soils, harvested at dawn and cold-pressed to preserve cellular vitality.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#183F32] uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Mizaj:</span>
            </span>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#183F32] text-white shadow-xs'
                  : 'bg-[#FAF9F3] text-[#26312B] hover:bg-[#E3EBDD]'
              }`}
            >
              All Herbs ({botanicals.length})
            </button>
            <button
              onClick={() => setActiveFilter('warm')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeFilter === 'warm'
                  ? 'bg-[#183F32] text-white shadow-xs'
                  : 'bg-[#FAF9F3] text-[#26312B] hover:bg-[#E3EBDD]'
              }`}
            >
              Warm & Dry (گرم)
            </button>
            <button
              onClick={() => setActiveFilter('cold')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeFilter === 'cold'
                  ? 'bg-[#183F32] text-white shadow-xs'
                  : 'bg-[#FAF9F3] text-[#26312B] hover:bg-[#E3EBDD]'
              }`}
            >
              Cooling (سرد)
            </button>
            <button
              onClick={() => setActiveFilter('balanced')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeFilter === 'balanced'
                  ? 'bg-[#183F32] text-white shadow-xs'
                  : 'bg-[#FAF9F3] text-[#26312B] hover:bg-[#E3EBDD]'
              }`}
            >
              Balanced (معتدل)
            </button>
          </div>
        </div>

        {/* Botanical Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBotanicals.map((botanical) => (
            <div
              key={botanical.id}
              className="group bg-[#FAF9F3] rounded-3xl border border-[#AFC7A5]/35 overflow-hidden hover:border-[#183F32]/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Header Origin & Latin */}
                <div className="flex items-center justify-between text-[11px] text-[#285844] font-semibold mb-2">
                  <span className="italic">{botanical.botanicalName}</span>
                  <div className="flex items-center gap-1 text-[10px] bg-white px-2 py-0.5 rounded-md border border-[#AFC7A5]/30">
                    <MapPin className="w-2.5 h-2.5" />
                    <span className="truncate max-w-[110px]">{botanical.origin.split(',')[0]}</span>
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#183F32] group-hover:text-[#285844] transition-colors">
                  {botanical.name}
                </h3>
                {botanical.urduName && (
                  <p className="font-urdu text-sm text-[#285844] mt-0.5" dir="rtl">
                    {botanical.urduName}
                  </p>
                )}

                {/* Temperament Badge */}
                <div className="my-3 inline-block px-2.5 py-1 rounded-md bg-[#E3EBDD] text-[#183F32] text-[11px] font-semibold border border-[#AFC7A5]/30">
                  {botanical.temperament}
                </div>

                {/* Benefits */}
                <div className="space-y-1.5 mt-2">
                  {botanical.keyBenefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-1.5 text-xs text-[#26312B]/80 leading-snug">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#285844] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Craft extraction note */}
                <div className="mt-4 pt-3 border-t border-[#AFC7A5]/25">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#183F32]/70 block mb-0.5">
                    Traditional Technique:
                  </span>
                  <p className="text-[11px] text-[#26312B]/75 italic leading-relaxed">
                    {botanical.traditionalUsage}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              {botanical.featuredInProducts.length > 0 && onExploreProduct && (
                <div className="px-5 py-3 bg-white border-t border-[#AFC7A5]/30 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#183F32]">
                    Used in Formula
                  </span>
                  <button
                    onClick={() => onExploreProduct(botanical.featuredInProducts[0])}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#183F32] hover:text-[#285844] group cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
