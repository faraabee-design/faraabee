import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import {
  Sparkles,
  X,
  ChevronRight,
  ArrowLeft,
  ShoppingBag,
  Check,
  BookOpen,
  Feather,
  Shield,
  HeartHandshake,
  RotateCcw,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface RemedyQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProduct?: (slug: string) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
}

export const RemedyQuizModal: React.FC<RemedyQuizModalProps> = ({
  isOpen,
  onClose,
  onViewProduct,
  onAddToCart,
}) => {
  const { quizConcerns, products, activeCurrency } = useStore();
  const [selectedConcernId, setSelectedConcernId] = useState<string | null>(null);
  const [selectedSubOptionId, setSelectedSubOptionId] = useState<string | null>(null);
  const [copiedWazifa, setCopiedWazifa] = useState(false);
  const [added, setAdded] = useState(false);

  if (!isOpen) return null;

  const currentConcern = quizConcerns.find((c) => c.id === selectedConcernId);
  const currentSubOption = currentConcern?.subOptions.find((s) => s.id === selectedSubOptionId);

  // Recommended product lookup
  const recommendedProduct = currentSubOption
    ? products.find((p) => p.slug === currentSubOption.productSlug || p.id === currentSubOption.productSlug)
    : null;

  const handleReset = () => {
    setSelectedConcernId(null);
    setSelectedSubOptionId(null);
    setCopiedWazifa(false);
    setAdded(false);
  };

  const handleCopyWazifa = () => {
    if (!currentSubOption) return;
    const text = `${currentSubOption.wazifaTitle}\n${currentSubOption.wazifaArabic}\n${currentSubOption.wazifaTranslation}\n\nRecommended Usage:\n${currentSubOption.usageGuidance}\n\nFrom FARAABEE Botanical Apothecary`;
    navigator.clipboard?.writeText(text);
    setCopiedWazifa(true);
    setTimeout(() => setCopiedWazifa(false), 2000);
  };

  const handleAddToCart = () => {
    if (!recommendedProduct || !onAddToCart) return;
    onAddToCart(recommendedProduct, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FAF9F3] rounded-3xl border border-[#AFC7A5]/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-white border-b border-[#AFC7A5]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E3EBDD] flex items-center justify-center text-[#183F32]">
              <Sparkles className="w-5 h-5 text-[#183F32]" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#183F32]">
                Tibb & Sunnah Remedy Finder
              </h2>
              <p className="text-xs text-[#285844]">
                Personalized Botanical & Spiritual Guidance
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="p-2 text-[#26312B]/60 hover:text-[#183F32] hover:bg-[#FAF9F3] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Select Primary Concern */}
          {!selectedConcernId && (
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto mb-6">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#285844] bg-[#E3EBDD] px-3 py-1 rounded-full">
                  Step 1 of 2
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#183F32] mt-3">
                  What area of vitality would you like to restore?
                </h3>
                <p className="text-xs text-[#26312B]/75 mt-1">
                  Choose your primary bodily or spiritual focus to discover tailored cold-pressed formulas and authentic Prophetic wazaif.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {quizConcerns.map((concern) => (
                  <button
                    key={concern.id}
                    onClick={() => setSelectedConcernId(concern.id)}
                    className="p-4 rounded-2xl bg-white border border-[#AFC7A5]/40 hover:border-[#183F32] hover:bg-[#FAF9F3] hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF9F3] group-hover:bg-[#E3EBDD] flex items-center justify-center shrink-0 border border-[#AFC7A5]/30">
                        {concern.icon === 'Feather' && <Feather className="w-5 h-5 text-[#183F32]" />}
                        {concern.icon === 'Sparkles' && <Sparkles className="w-5 h-5 text-[#183F32]" />}
                        {concern.icon === 'Shield' && <Shield className="w-5 h-5 text-[#183F32]" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-lg font-bold text-[#183F32] group-hover:text-[#285844]">
                            {concern.label}
                          </h4>
                          {concern.urduLabel && (
                            <span className="font-urdu text-sm text-[#285844]/80" dir="rtl">
                              {concern.urduLabel}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#26312B]/70 mt-1 leading-relaxed">
                          {concern.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#183F32]/50 group-hover:text-[#183F32] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Specific Sub-Condition */}
          {selectedConcernId && !selectedSubOptionId && (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedConcernId(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#183F32] hover:underline mb-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All Concerns</span>
              </button>

              <div className="text-center max-w-md mx-auto mb-6">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#285844] bg-[#E3EBDD] px-3 py-1 rounded-full">
                  Step 2 of 2: {currentConcern?.label}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#183F32] mt-3">
                  Select your specific symptom or condition
                </h3>
              </div>

              <div className="space-y-3">
                {currentConcern?.subOptions.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubOptionId(sub.id)}
                    className="w-full p-4 rounded-2xl bg-white border border-[#AFC7A5]/40 hover:border-[#183F32] hover:bg-[#FAF9F3] hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#183F32] group-hover:text-[#285844]">
                        {sub.label}
                      </h4>
                      {sub.urduLabel && (
                        <p className="font-urdu text-sm text-[#285844]/85 mt-0.5" dir="rtl">
                          {sub.urduLabel}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#183F32]/50 group-hover:text-[#183F32] group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Tailored Shifa Recommendation Card */}
          {currentSubOption && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#AFC7A5]/30">
                <button
                  onClick={() => setSelectedSubOptionId(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#183F32] hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Choose Another Condition</span>
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-xs text-[#26312B]/60 hover:text-[#183F32] cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Start Over</span>
                </button>
              </div>

              {/* Wazifa Card */}
              <div className="p-5 rounded-2xl bg-white border border-[#AFC7A5]/50 shadow-xs relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#E3EBDD] text-[#183F32] text-xs font-bold uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Sunnah Wazifa & Supplication</span>
                  </div>
                  <button
                    onClick={handleCopyWazifa}
                    className="inline-flex items-center gap-1 text-xs text-[#183F32] font-semibold hover:underline cursor-pointer"
                  >
                    {copiedWazifa ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Wazifa</span>
                      </>
                    )}
                  </button>
                </div>

                <h4 className="font-serif text-lg font-bold text-[#183F32] mb-3">
                  {currentSubOption.wazifaTitle}
                </h4>

                {/* Calligraphy block */}
                <div className="p-4 rounded-xl bg-[#FAF9F3] border border-[#AFC7A5]/30 text-center mb-3">
                  <p className="font-arabic text-2xl sm:text-3xl text-[#183F32] leading-loose" dir="rtl">
                    {currentSubOption.wazifaArabic}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#26312B]/85 italic mb-4 leading-relaxed">
                  {currentSubOption.wazifaTranslation}
                </p>

                {/* Application Guidance */}
                <div className="pt-3 border-t border-[#AFC7A5]/25">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#183F32] block mb-1">
                    Artisanal Application Guidance:
                  </span>
                  <p className="text-xs text-[#26312B]/80 leading-relaxed">
                    {currentSubOption.usageGuidance}
                  </p>
                </div>
              </div>

              {/* Recommended Product Section */}
              {recommendedProduct && (
                <div className="p-5 rounded-2xl bg-[#E3EBDD]/40 border border-[#AFC7A5]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={recommendedProduct.image}
                      alt={recommendedProduct.name}
                      className="w-16 h-16 rounded-xl object-cover border border-[#AFC7A5]/40 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#183F32] bg-white px-2 py-0.5 rounded-md border border-[#AFC7A5]/30">
                        Prescribed Formula
                      </span>
                      <h5 className="font-serif text-lg font-bold text-[#183F32] mt-1">
                        {recommendedProduct.name}
                      </h5>
                      <span className="text-sm font-bold text-[#183F32]">
                        {activeCurrency === 'USD' ? `$${recommendedProduct.priceUSD || Math.round(recommendedProduct.price / 280)}` : `Rs. ${recommendedProduct.price.toLocaleString()}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {onViewProduct && (
                      <button
                        onClick={() => {
                          onViewProduct(recommendedProduct.slug);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl border border-[#AFC7A5]/50 bg-white text-[#183F32] hover:bg-[#FAF9F3] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        title="View Full Product Details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    )}
                    <button
                      onClick={handleAddToCart}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm ${
                        added
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#183F32] text-white hover:bg-[#285844]'
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
