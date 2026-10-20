import React from 'react';
import { CartItem } from '../types';
import { siteConfig } from '../config/siteConfig';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onNavigateToProducts: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onNavigateToProducts,
}) => {
  const { deliverySettings, activeCurrency, language } = useStore();
  if (!isOpen) return null;

  const isUSD = activeCurrency === 'USD';
  const currencySymbol = isUSD ? '$' : 'Rs.';

  const freeThreshold = isUSD
    ? (deliverySettings.freeShippingThresholdUSD || 50)
    : (deliverySettings.freeShippingThreshold || 5000);

  const standardShippingFee = isUSD
    ? (deliverySettings.standardShippingFeeUSD ?? 10)
    : (deliverySettings.standardShippingFee ?? 250);

  const subtotal = items.reduce((acc, item) => {
    const itemPrice = isUSD
      ? (item.product.priceUSD ?? (item.product.price ? Math.round(item.product.price / 280) : 0))
      : (item.product.salePrice && item.product.salePrice < item.product.price ? item.product.salePrice : item.product.price);
    return acc + itemPrice * item.quantity;
  }, 0);

  const isFreeDelivery = deliverySettings.freeShippingEnabled && (standardShippingFee === 0 || subtotal >= freeThreshold);
  const effectiveShipping = isFreeDelivery ? 0 : standardShippingFee;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const amountNeededForFree = Math.max(0, freeThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#183F32]/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#AFC7A5]/30 flex items-center justify-between bg-[#FAF9F3]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#183F32]" />
              <h2 className="font-serif text-xl font-medium text-[#183F32]">
                Your Botanical Bag
              </h2>
              <span className="text-xs text-[#285844] font-semibold tabular-nums">
                ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#26312B] hover:text-[#183F32] rounded-md transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3.5 bg-[#E8F1DF]/60 border-b border-[#AFC7A5]/30 text-xs">
            {amountNeededForFree > 0 ? (
              <p className="text-[#183F32] mb-1.5 font-medium">
                Add <span className="font-bold">{currencySymbol} {amountNeededForFree.toLocaleString()}</span> more for <span className="font-bold">Free Shipping</span>.
              </p>
            ) : (
              <p className="text-[#183F32] mb-1.5 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#285844]" />
                You qualify for complimentary domestic delivery!
              </p>
            )}
            <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#183F32] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#E8F1DF] text-[#183F32] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#183F32] mb-1">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-[#26312B]/70 max-w-xs mb-6">
                  Explore our handcrafted herbal oils, soothing balms, and botanical preparations.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToProducts();
                  }}
                  className="px-6 py-2.5 bg-[#183F32] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#285844] transition-colors cursor-pointer"
                >
                  Explore Herbal Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3.5 rounded-xl border border-[#AFC7A5]/30 bg-[#FAF9F3]/60 items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-[#AFC7A5]/40 shrink-0 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif text-sm font-semibold text-[#183F32] truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#26312B]/40 hover:text-red-700 transition-colors p-1"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-[#285844] font-medium block">
                      {item.product.volume}
                    </span>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#AFC7A5]/50 rounded-md bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="px-2 py-0.5 text-xs text-[#26312B] hover:bg-[#E8F1DF] rounded-l-md transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-medium text-[#183F32] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="px-2 py-0.5 text-xs text-[#26312B] hover:bg-[#E8F1DF] rounded-r-md transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#183F32] tabular-nums">
                        {siteConfig.currency.symbol}{' '}
                        {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Module */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#AFC7A5]/30 bg-[#FAF9F3] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#26312B]/80">
                  <span>Subtotal</span>
                  <span className="font-medium tabular-nums">
                    {currencySymbol} {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#26312B]/80">
                  <span>Estimated Delivery</span>
                  <span className="font-medium tabular-nums">
                    {effectiveShipping === 0 ? (
                      <span className="text-emerald-700 font-semibold">Free Delivery</span>
                    ) : (
                      `${currencySymbol} ${effectiveShipping.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#183F32] pt-2 border-t border-[#AFC7A5]/30">
                  <span>Total</span>
                  <span className="tabular-nums">
                    {currencySymbol} {(subtotal + effectiveShipping).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>{language === 'ur' ? 'آرڈر مکمل کرنے کے لیے آگے بڑھیں' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-[#26312B]/60">
                {language === 'ur'
                  ? 'کیش آن ڈیلیوری (COD) · آن لائن بینک ٹرانسفر · جاز کیش · ایزی پیسہ'
                  : 'Cash on Delivery (COD) · Bank Transfer · JazzCash · Easypaisa'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
