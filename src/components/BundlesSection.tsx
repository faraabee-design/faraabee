import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CareBundle, Product } from '../types';
import { Sparkles, ShoppingBag, Check, ShieldCheck, ArrowRight, Tag, Percent } from 'lucide-react';

interface BundlesSectionProps {
  onViewProduct?: (slug: string) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
}

export const BundlesSection: React.FC<BundlesSectionProps> = ({
  onViewProduct,
  onAddToCart,
}) => {
  const { bundles, products, activeCurrency } = useStore();
  const [addedBundleId, setAddedBundleId] = useState<string | null>(null);

  const activeBundles = bundles.filter((b) => b.active);

  if (activeBundles.length === 0) return null;

  const handleAddBundleToCart = (bundle: CareBundle) => {
    // Check if there are component products
    const bundleProducts = products.filter((p) => bundle.productIds.includes(p.id) || bundle.productIds.includes(p.slug));
    
    if (onAddToCart) {
      if (bundleProducts.length > 0) {
        // Add component products or create virtual bundle product
        const bundleAsProduct: Product = {
          id: bundle.id,
          name: bundle.name,
          slug: bundle.slug,
          category: 'Herbal Bundles',
          price: bundle.bundlePrice,
          priceUSD: bundle.bundlePriceUSD,
          currency: activeCurrency,
          shortDescription: bundle.subtitle,
          description: bundle.description,
          image: bundle.image,
          inStock: true,
          featured: false,
          volume: `${bundle.productIds.length} Curated Items`,
          ingredients: ['Prophetic Herbal Blends', 'Pure Cold-Pressed Oils'],
        };
        onAddToCart(bundleAsProduct, 1);
      } else {
        // Virtual item
        const bundleAsProduct: Product = {
          id: bundle.id,
          name: bundle.name,
          slug: bundle.slug,
          category: 'Herbal Bundles',
          price: bundle.bundlePrice,
          priceUSD: bundle.bundlePriceUSD,
          currency: activeCurrency,
          shortDescription: bundle.subtitle,
          description: bundle.description,
          image: bundle.image,
          inStock: true,
          featured: false,
          volume: 'Complete Regimen',
        };
        onAddToCart(bundleAsProduct, 1);
      }
    }

    setAddedBundleId(bundle.id);
    setTimeout(() => setAddedBundleId(null), 2000);
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#FAF9F3] via-[#F4F1E8] to-[#FAF9F3] border-y border-[#AFC7A5]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183F32]/10 border border-[#183F32]/20 text-[#183F32] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#285844]" />
            <span>Curated Bachat Packages & Sets</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#183F32] tracking-tight">
            Holistic Care Bundles
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#26312B]/75 leading-relaxed">
            Thoughtfully paired herbal preparations working in physiological harmony. Enjoy privileged apothecary pricing on complete restorative regimens.
          </p>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeBundles.map((bundle) => {
            const isUSD = activeCurrency === 'USD';
            const price = isUSD ? (bundle.bundlePriceUSD || Math.round(bundle.bundlePrice / 280)) : bundle.bundlePrice;
            const origPrice = isUSD ? (bundle.originalPriceUSD || Math.round(bundle.originalPrice / 280)) : bundle.originalPrice;
            const currencySymbol = isUSD ? '$' : 'Rs.';
            const isAdded = addedBundleId === bundle.id;

            return (
              <div
                key={bundle.id}
                className="group relative bg-white rounded-3xl border border-[#AFC7A5]/40 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Badge Header */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-[#FAF9F3]">
                  <img
                    src={bundle.image}
                    alt={bundle.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
                    {bundle.badge && (
                      <span className="px-3 py-1 bg-[#183F32] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                        {bundle.badge}
                      </span>
                    )}
                    <span className="px-2.5 py-1 bg-amber-500 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      <span>Save {bundle.savingsPercentage}%</span>
                    </span>
                  </div>

                  {bundle.urduName && (
                    <div className="absolute bottom-3 right-3 text-right">
                      <span className="font-urdu text-base text-white/95 drop-shadow-sm" dir="rtl">
                        {bundle.urduName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#183F32] leading-snug mb-1 group-hover:text-[#285844] transition-colors">
                      {bundle.name}
                    </h3>
                    <p className="text-xs font-medium text-[#285844] mb-3">
                      {bundle.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-[#26312B]/75 leading-relaxed mb-5 line-clamp-3">
                      {bundle.description}
                    </p>
                  </div>

                  {/* Included items chips */}
                  <div className="pt-4 border-t border-[#AFC7A5]/25 mb-5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#183F32]/70 block mb-2">
                      Included in this Regimen:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {bundle.productIds.map((pid, idx) => {
                        const matchedProduct = products.find((p) => p.id === pid || p.slug === pid);
                        const label = matchedProduct ? matchedProduct.name : pid.replace(/-/g, ' ');
                        return (
                          <span
                            key={idx}
                            onClick={() => matchedProduct && onViewProduct && onViewProduct(matchedProduct.slug)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF9F3] border border-[#AFC7A5]/40 text-xs text-[#183F32] font-medium hover:bg-[#E3EBDD] transition-colors cursor-pointer"
                          >
                            <ShieldCheck className="w-3 h-3 text-[#285844]" />
                            <span>{label}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-[#183F32]">
                          {currencySymbol}{price.toLocaleString()}
                        </span>
                        <span className="text-sm text-[#26312B]/40 line-through">
                          {currencySymbol}{origPrice.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700">
                        Bundle Special Pricing
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddBundleToCart(bundle)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm ${
                        isAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#183F32] text-white hover:bg-[#285844] hover:shadow-md active:scale-97'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add Set to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
