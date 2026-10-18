import React, { useState } from 'react';
import { Product } from '../types';
import { siteConfig } from '../config/siteConfig';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  ShoppingBag,
  MessageCircle,
  Plus,
  Minus,
  ChevronDown,
  Check,
  ShieldCheck,
  ArrowLeft,
  Share2,
  Sparkles,
  Tag,
  AlertCircle,
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onViewProduct: (slug: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onDirectOrder: (product: Product, quantity: number) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onViewProduct,
  onAddToCart,
  onDirectOrder,
}) => {
  const { activeCurrency } = useStore();
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<string>('ingredients');

  const galleryImages = [
    product.image,
    ...(product.secondaryImage ? [product.secondaryImage] : []),
    ...(product.additionalImages || []),
  ].filter(Boolean);

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.status === 'active' && (p.category === product.category || p.featured))
    .slice(0, 4);

  const isUSD = activeCurrency === 'USD' || product.currency === 'USD';
  const effectiveBasePrice = isUSD
    ? (product.priceUSD ?? (product.price ? Math.round(product.price / 280) : 0))
    : product.price;
  const effectiveSalePrice = isUSD
    ? (product.salePriceUSD ?? (product.salePrice ? Math.round(product.salePrice / 280) : undefined))
    : product.salePrice;
  const isDiscounted = effectiveSalePrice !== undefined && effectiveSalePrice < effectiveBasePrice;
  const effectivePrice = isDiscounted ? (effectiveSalePrice as number) : effectiveBasePrice;
  const currencySymbol = isUSD ? '$' : (product.currency || 'Rs.');
  const secondaryPriceTag = isUSD
    ? (product.price ? `Rs. ${product.price.toLocaleString()}` : null)
    : (product.priceUSD ? `$${product.priceUSD}` : null);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const text = `Salam FARAABEE Herbal,%0A%0AI would like to order:%0A• ${product.name} (${product.volume || 'Standard'}) x ${quantity}%0ATotal: ${currencySymbol} ${(effectivePrice * quantity).toLocaleString()}%0A%0APlease let me know the delivery schedule.`;
    window.open(`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${text}`, '_blank');
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? '' : key);
  };

  return (
    <div className="bg-[#FAF9F3] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation & breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#AFC7A5]/25">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#183F32] hover:text-[#285844] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>

          <div className="text-xs text-[#26312B]/60 hidden sm:block">
            <span>Apothecary</span> / <span>{product.category}</span> /{' '}
            <span className="text-[#183F32] font-semibold">{product.name}</span>
          </div>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-[#AFC7A5]/40 shadow-sm p-3">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              {product.volume && (
                <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-md text-xs font-medium text-[#183F32] shadow-2xs border border-[#AFC7A5]/30">
                  {product.volume}
                </div>
              )}
              {isDiscounted && (
                <div className="absolute top-5 right-5 bg-[#183F32] text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#AFC7A5]" />
                  <span>Special Offer</span>
                </div>
              )}
            </div>

            {/* Thumbnail switcher */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 bg-white p-1 transition-all shrink-0 cursor-pointer ${
                      selectedImage === img
                        ? 'border-[#183F32] shadow-sm'
                        : 'border-[#AFC7A5]/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail`} className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Purchase Module */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            {/* Category & Urdu Name */}
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#285844] mb-2">
              <span>{product.category}</span>
              {product.urduName && (
                <span className="font-urdu text-lg text-[#183F32]" dir="rtl">
                  {product.urduName}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#183F32] leading-tight mb-3">
              {product.name}
            </h1>

            {/* Pricing Area */}
            <div className="flex items-baseline gap-3 mb-6 pb-4 border-b border-[#AFC7A5]/30">
              {isDiscounted ? (
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-bold text-[#183F32] tabular-nums">
                    {currencySymbol} {effectiveSalePrice?.toLocaleString()}
                  </span>
                  <span className="text-base text-[#26312B]/40 line-through tabular-nums">
                    {currencySymbol} {effectiveBasePrice.toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="text-2xl sm:text-3xl font-bold text-[#183F32] tabular-nums">
                  {currencySymbol} {effectiveBasePrice.toLocaleString()}
                </span>
              )}

              {secondaryPriceTag && (
                <span className="text-sm font-semibold text-[#183F32]/70 bg-[#E8F1DF]/70 px-2 py-0.5 rounded-md">
                  {secondaryPriceTag}
                </span>
              )}

              <span className="text-xs text-[#26312B]/70">
                ({product.volume || '1 Unit'} · Taxes included)
              </span>
            </div>

            {/* Stock Availability */}
            <div className="mb-4">
              {product.inStock ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>In Stock & Ready for Immediate Dispatch</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Currently Out of Stock · Reserve via WhatsApp</span>
                </div>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm sm:text-base text-[#26312B]/85 leading-relaxed mb-6">
              {product.shortDescription}
            </p>

            {/* Key Botanicals Highlight Chips */}
            {product.keyBotanicals && product.keyBotanicals.length > 0 && (
              <div className="mb-6 p-4 bg-[#E8F1DF]/50 rounded-xl border border-[#AFC7A5]/30 space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#183F32] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B79A5B]" />
                  Key Active Botanicals
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  {product.keyBotanicals.map((herb, i) => (
                    <div key={i} className="bg-white/80 p-2 rounded-lg">
                      <span className="font-semibold text-[#183F32] block">{herb.name}</span>
                      <span className="text-[11px] text-[#26312B]/75 leading-tight block mt-0.5">
                        {herb.benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase Controls: Quantity & Buttons */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-4">
                {/* Quantity stepper */}
                <div className="flex items-center border border-[#AFC7A5] rounded-lg bg-white h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!product.inStock}
                    className="px-3.5 h-full text-sm text-[#26312B] hover:bg-[#E8F1DF] rounded-l-lg transition-colors cursor-pointer disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-[#183F32] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock}
                    className="px-3.5 h-full text-sm text-[#26312B] hover:bg-[#E8F1DF] rounded-r-lg transition-colors cursor-pointer disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 h-12 px-6 text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    !product.inStock
                      ? 'bg-stone-400 cursor-not-allowed'
                      : 'bg-[#183F32] hover:bg-[#285844]'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-[#AFC7A5]" />
                      <span>Added to Botanical Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        Add to Bag · {currencySymbol} {(effectivePrice * quantity).toLocaleString()}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Order / WhatsApp */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={() => onDirectOrder(product, quantity)}
                  disabled={!product.inStock}
                  className="flex-1 py-3 px-4 bg-[#235843] hover:bg-[#183F32] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50 text-center"
                >
                  Instant Checkout (COD)
                </button>
                <button
                  onClick={handleWhatsAppOrder}
                  className="py-3 px-4 border border-[#AFC7A5] hover:border-[#183F32] text-[#183F32] text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer bg-white"
                >
                  <MessageCircle className="w-4 h-4 text-[#285844]" />
                  <span>Order via WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Accordion Tabs for Apothecary Details */}
            <div className="border-t border-[#AFC7A5]/30 divide-y divide-[#AFC7A5]/25">
              {/* Full Description */}
              {product.description && (
                <div>
                  <button
                    onClick={() => toggleAccordion('description')}
                    className="w-full py-4 flex items-center justify-between text-left text-sm font-semibold text-[#183F32] hover:text-[#285844] cursor-pointer"
                  >
                    <span>Herbal Formulation Details</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openAccordion === 'description' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'description' && (
                    <div className="pb-4 text-xs sm:text-sm text-[#26312B]/80 leading-relaxed space-y-2 whitespace-pre-line">
                      {product.description}
                    </div>
                  )}
                </div>
              )}

              {/* Ingredients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleAccordion('ingredients')}
                    className="w-full py-4 flex items-center justify-between text-left text-sm font-semibold text-[#183F32] hover:text-[#285844] cursor-pointer"
                  >
                    <span>Full Botanical Ingredients</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openAccordion === 'ingredients' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'ingredients' && (
                    <div className="pb-4 text-xs sm:text-sm text-[#26312B]/80 leading-relaxed">
                      <ul className="list-disc pl-5 space-y-1">
                        {product.ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Traditional Use & Directions */}
              {(product.traditionalUse || product.directions) && (
                <div>
                  <button
                    onClick={() => toggleAccordion('usage')}
                    className="w-full py-4 flex items-center justify-between text-left text-sm font-semibold text-[#183F32] hover:text-[#285844] cursor-pointer"
                  >
                    <span>Directions & Traditional Use</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openAccordion === 'usage' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'usage' && (
                    <div className="pb-4 text-xs sm:text-sm text-[#26312B]/80 leading-relaxed space-y-2">
                      {product.traditionalUse && (
                        <p>
                          <strong className="text-[#183F32]">Traditional Method:</strong>{' '}
                          {product.traditionalUse}
                        </p>
                      )}
                      {product.directions && (
                        <p>
                          <strong className="text-[#183F32]">Suggested Application:</strong>{' '}
                          {product.directions}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Formulations Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#AFC7A5]/30">
            <h2 className="text-2xl font-serif font-medium text-[#183F32] mb-8">
              Complementary Herbal Formulations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onViewProduct={onViewProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
