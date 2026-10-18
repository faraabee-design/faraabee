import React, { useState } from 'react';
import { Product } from '../types';
import { Eye, ShoppingBag, Check } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onViewProduct: (slug: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewProduct,
  onAddToCart,
}) => {
  const { activeCurrency } = useStore();
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    onAddToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const isUSD = activeCurrency === 'USD' || product.currency === 'USD';
  const effectivePrice = isUSD
    ? (product.priceUSD ?? (product.price ? Math.round(product.price / 280) : 0))
    : product.price;
  const effectiveSalePrice = isUSD
    ? (product.salePriceUSD ?? (product.salePrice ? Math.round(product.salePrice / 280) : undefined))
    : product.salePrice;
  const isDiscounted = effectiveSalePrice !== undefined && effectiveSalePrice < effectivePrice;
  const currencySymbol = isUSD ? '$' : (product.currency || 'Rs.');

  // Secondary tag when both PKR & USD prices exist
  const secondaryPriceTag = isUSD
    ? (product.price ? `Rs. ${product.price.toLocaleString()}` : null)
    : (product.priceUSD ? `$${product.priceUSD}` : null);

  return (
    <article
      onClick={() => onViewProduct(product.slug)}
      className="group relative flex flex-col bg-white rounded-2xl border border-[#AFC7A5]/35 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-[#183F32]/40 cursor-pointer text-left"
    >
      {/* Top Image Showcase */}
      <div className="relative aspect-square w-full bg-[#FAF9F3] overflow-hidden flex items-center justify-center p-4">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center rounded-xl transition-transform duration-500 group-hover:scale-103"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#E8F1DF]/50 text-[#183F32] p-4 text-center">
            <span className="font-serif text-lg font-medium">{product.name}</span>
            <span className="text-xs text-[#285844] mt-1">{product.volume}</span>
          </div>
        )}

        {/* Volume / Stock marker */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.volume && (
            <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-medium text-[#183F32] shadow-2xs border border-[#AFC7A5]/30">
              {product.volume}
            </div>
          )}
          {!product.inStock && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
              Out of Stock
            </div>
          )}
        </div>

        {/* Sale / Featured Badge */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {isDiscounted && (
            <span className="bg-[#183F32] text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Special Price
            </span>
          )}
        </div>

        {/* Quick action button overlay */}
        <div className="absolute inset-0 bg-[#183F32]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`w-full py-2.5 px-4 text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              !product.inStock
                ? 'bg-stone-400 cursor-not-allowed'
                : 'bg-[#183F32] hover:bg-[#285844]'
            }`}
            aria-label={`Add ${product.name} to bag`}
          >
            {!product.inStock ? (
              <span>Out of Stock</span>
            ) : added ? (
              <>
                <Check className="w-4 h-4 text-[#AFC7A5]" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category & Urdu subtitle */}
        <div className="flex items-center justify-between text-xs text-[#285844] font-medium mb-1.5">
          <span className="uppercase tracking-wider text-[11px]">{product.category}</span>
          {product.urduName && (
            <span className="font-urdu text-sm text-[#183F32]" dir="rtl">
              {product.urduName}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-serif text-lg font-semibold text-[#183F32] group-hover:text-[#285844] transition-colors leading-snug line-clamp-1 mb-2">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-[#26312B]/75 line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.shortDescription}
        </p>

        {/* Price & View Link */}
        <div className="pt-3 border-t border-[#AFC7A5]/25 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[#26312B]/60 font-medium">
                Price
              </span>
              {secondaryPriceTag && (
                <span className="text-[10px] font-semibold text-[#183F32]/60 bg-[#E8F1DF]/50 px-1.5 py-0.2 rounded">
                  {secondaryPriceTag}
                </span>
              )}
            </div>
            {isDiscounted ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-semibold text-[#183F32] tabular-nums">
                  {currencySymbol} {effectiveSalePrice?.toLocaleString()}
                </span>
                <span className="text-xs text-[#26312B]/40 line-through tabular-nums">
                  {currencySymbol} {effectivePrice.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-base font-semibold text-[#183F32] tabular-nums">
                {currencySymbol} {effectivePrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewProduct(product.slug);
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#183F32] hover:text-[#285844] hover:underline cursor-pointer"
          >
            <span>View Details</span>
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
