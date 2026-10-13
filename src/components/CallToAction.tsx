import React from 'react';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';

interface CallToActionProps {
  onExploreClick: () => void;
  onContactClick: () => void;
  onSpiritualClick?: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({
  onExploreClick,
  onContactClick,
  onSpiritualClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E8F1DF] via-[#FAF9F3] to-[#E8F1DF]/70 py-20 sm:py-24 border-b border-[#AFC7A5]/30">
      {/* Subtle organic curved botanical elements */}
      <div className="absolute top-0 right-10 w-72 h-72 rounded-full bg-[#AFC7A5]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-[#183F32]/5 blur-2xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 mb-4 text-[#285844] text-xs font-semibold uppercase tracking-[0.2em]">
          <Sparkles className="w-3.5 h-3.5 text-[#B79A5B]" />
          <span>TIME-TESTED BOTANICALS</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#183F32] mb-5 tracking-tight">
          Explore the FARAABEE Collection
        </h2>

        <p className="text-base sm:text-lg text-[#26312B]/85 max-w-2xl mx-auto mb-9 leading-relaxed">
          Discover a considered approach to herbal wellness, inspired by tradition and presented for modern living. Pure plant oils, soothing salves, and handcrafted preparations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#183F32] hover:bg-[#285844] rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onContactClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#183F32] bg-white hover:bg-[#FAF9F3] border border-[#AFC7A5] hover:border-[#183F32] rounded-lg transition-all duration-200 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#285844]" />
            <span>Contact FARAABEE</span>
          </button>
        </div>

        <p className="font-urdu text-sm text-[#285844] mt-8" dir="rtl">
          قدرت کی حکمت، آپ کی روزمرہ صحت کے لیے
        </p>

        {/* Button just down the Urdu line in website signature green */}
        <div className="mt-6 flex flex-col items-center justify-center">
          <button
            onClick={onSpiritualClick}
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#183F32] hover:bg-[#285844] rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-[#AFC7A5]/40 hover:scale-102 ring-2 ring-[#183F32]/10"
          >
            <Sparkles className="w-4 h-4 text-[#B79A5B] transition-transform group-hover:rotate-12" />
            <span>Explore Our Spiritual Sanctuary</span>
            <ArrowRight className="w-4 h-4 text-[#AFC7A5] transition-transform group-hover:translate-x-1" />
          </button>
          <span className="text-[11px] text-[#285844]/80 mt-2 font-urdu" dir="rtl">
            روحانی شفا، نبوی نباتات اور دلی سکون کی رہنمائی
          </span>
        </div>
      </div>
    </section>
  );
};
