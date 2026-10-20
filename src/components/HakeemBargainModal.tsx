import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Sparkles,
  Handshake,
  Check,
  Copy,
  ArrowRight,
  RefreshCw,
  Coins,
  ShieldCheck,
  Percent,
} from 'lucide-react';

interface BargainProduct {
  name: string;
  price: number;
  image?: string;
  id?: string;
}

interface HakeemBargainModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: BargainProduct | null;
  onApplyDiscount?: (couponCode: string, discountPercent: number) => void;
}

type BargainState = 'idle' | 'pondering' | 'too_low' | 'counter_offer' | 'accepted';

export const HakeemBargainModal: React.FC<HakeemBargainModalProps> = ({
  isOpen,
  onClose,
  product,
  onApplyDiscount,
}) => {
  const { hakeemBargainSettings, applyCoupon, activeCurrency, language } = useStore();
  const isUrdu = language === 'ur';

  const origPrice = product ? product.price : 2500;
  const [offerPrice, setOfferPrice] = useState<number>(() => Math.round(origPrice * 0.9));
  const [state, setState] = useState<BargainState>('idle');
  const [dialogue, setDialogue] = useState<string>('');
  const [generatedCoupon, setGeneratedCoupon] = useState<string | null>(null);
  const [acceptedPercent, setAcceptedPercent] = useState<number>(0);
  const [attempts, setAttempts] = useState(0);

  // Sync initial offer whenever product changes
  useEffect(() => {
    if (product) {
      const defaultOffer = Math.round(product.price * 0.9);
      setOfferPrice(defaultOffer);
      setState('idle');
      setDialogue('');
      setGeneratedCoupon(null);
      setAttempts(0);
    }
  }, [product]);

  if (!isOpen || !product || !hakeemBargainSettings.enabled) return null;

  const discountAmount = Math.max(0, origPrice - offerPrice);
  const discountPercent = Math.round((discountAmount / origPrice) * 100);

  const isUSD = activeCurrency === 'USD';
  const currencySymbol = isUSD ? '$' : 'Rs.';

  const getRandomItem = (arr: string[]): string => {
    if (!arr || arr.length === 0) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const handleEvaluateOffer = () => {
    setState('pondering');
    setAttempts((prev) => prev + 1);

    setTimeout(() => {
      const { maxDiscountPercent, counterOfferDiscountPercent, tooLowThresholdPercent, dialogues } =
        hakeemBargainSettings;

      if (discountPercent > tooLowThresholdPercent) {
        // Too low / greedy
        setState('too_low');
        const text = isUrdu
          ? getRandomItem(dialogues.tooLowUrdu)
          : getRandomItem(dialogues.tooLowEnglish);
        setDialogue(text);
      } else if (discountPercent > maxDiscountPercent) {
        // Counter offer
        setState('counter_offer');
        const text = isUrdu
          ? getRandomItem(dialogues.counterOfferUrdu)
          : getRandomItem(dialogues.counterOfferEnglish);
        setDialogue(text);
      } else {
        // Fair / Accepted
        setState('accepted');
        const text = isUrdu
          ? getRandomItem(dialogues.acceptedUrdu)
          : getRandomItem(dialogues.acceptedEnglish);
        setDialogue(text);

        const code = `${hakeemBargainSettings.couponPrefix || 'HAKEEM'}-${discountPercent || 10}`;
        setGeneratedCoupon(code);
        setAcceptedPercent(discountPercent);
        applyCoupon(code);
        if (onApplyDiscount) {
          onApplyDiscount(code, discountPercent);
        }
      }
    }, 1200);
  };

  const handleAcceptCounterOffer = () => {
    const counterPercent = hakeemBargainSettings.counterOfferDiscountPercent || 10;
    const code = `${hakeemBargainSettings.couponPrefix || 'HAKEEM'}-${counterPercent}`;
    setState('accepted');
    setAcceptedPercent(counterPercent);
    setGeneratedCoupon(code);
    applyCoupon(code);
    setDialogue(
      isUrdu
        ? `الحمد للہ! سودا پکا ہوا۔ ${counterPercent}% رعایت کا کوپن آپ کے اکاؤنٹ میں چسپاں کر دیا گیا ہے۔`
        : `Alhamdulillah! Agreement reached. A ${counterPercent}% discount voucher has been applied to your order.`
    );
    if (onApplyDiscount) {
      onApplyDiscount(code, counterPercent);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-[#183F32]/75 backdrop-blur-xs flex items-center justify-center p-4 ${
        isUrdu ? 'rtl' : 'ltr'
      }`}
    >
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#AFC7A5]/40 my-8 animate-scale-in">
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-[#183F32] via-[#235843] to-[#183F32] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A880]/20 border border-[#C5A880]/50 flex items-center justify-center text-xl shrink-0">
              👳🏽‍♂️
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880] block">
                {isUrdu ? hakeemBargainSettings.hakeemTitleUrdu : hakeemBargainSettings.hakeemTitle}
              </span>
              <h3 className="font-serif text-lg font-bold">
                {isUrdu ? hakeemBargainSettings.hakeemNameUrdu : hakeemBargainSettings.hakeemName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Snapshot & Dialogue Card */}
        <div className="p-6 space-y-5 bg-[#FAF9F3]/60">
          <div className="p-3.5 bg-white rounded-2xl border border-[#AFC7A5]/30 flex items-center gap-3 shadow-2xs">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 rounded-xl object-cover bg-[#FAF9F3] shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#285844] block">
                {isUrdu ? 'منتخب نباتیاتی نسخہ' : 'Target Remedy'}
              </span>
              <h4 className="font-serif text-sm font-bold text-[#183F32] truncate">
                {product.name}
              </h4>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xs text-[#26312B]/60">{isUrdu ? 'اصل قیمت:' : 'Original:'}</span>
                <span className="text-sm font-bold text-[#183F32]">
                  {currencySymbol} {origPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Hakeem Persona Speech Bubble */}
          <div className="relative p-4 rounded-2xl border bg-white shadow-xs transition-all">
            <div className="flex items-start gap-3">
              <div className="text-3xl shrink-0">
                {state === 'idle' && '👳🏽‍♂️'}
                {state === 'pondering' && '🧐'}
                {state === 'too_low' && '😲'}
                {state === 'counter_offer' && '🤔'}
                {state === 'accepted' && '✨'}
              </div>
              <div className="space-y-1 flex-1">
                <span className="text-[11px] font-bold text-[#183F32] block">
                  {isUrdu ? hakeemBargainSettings.hakeemNameUrdu : hakeemBargainSettings.hakeemName}:
                </span>
                <p className="text-xs text-[#26312B]/85 leading-relaxed italic">
                  {state === 'pondering'
                    ? isUrdu
                      ? 'حکیم صاحب آپ کی پیشکش کا جائزہ لے رہے ہیں اور ترازو تول رہے ہیں...'
                      : 'Hakeem Sahib is carefully weighing the purity of the herbs and your offer...'
                    : dialogue ||
                      (isUrdu
                        ? 'خوش آمدید پیارے بھائی! ہم تجارت میں باہمی رضا مندی اور برکت کے قائل ہیں۔ آپ کے دل میں کیا مناسب قیمت ہے؟'
                        : 'Welcome respected guest! In classical Islamic tradition, trade is blessed when both hearts are pleased. State your desired price!')}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Bargaining Controls (when not yet accepted) */}
          {state !== 'accepted' && (
            <div className="p-5 bg-white rounded-2xl border border-[#AFC7A5]/40 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#183F32] flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-[#C5A880]" />
                  <span>{isUrdu ? 'آپ کی پیشکش (رعایتی رقم):' : 'Your Desired Offer:'}</span>
                </label>
                <div className="text-right">
                  <span className="text-lg font-serif font-bold text-[#183F32]">
                    {currencySymbol} {offerPrice.toLocaleString()}
                  </span>
                  <span
                    className={`block text-[11px] font-bold ${
                      discountPercent > hakeemBargainSettings.tooLowThresholdPercent
                        ? 'text-red-700'
                        : discountPercent > hakeemBargainSettings.maxDiscountPercent
                        ? 'text-amber-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    ({discountPercent}% {isUrdu ? 'رعایت کی طلب' : 'Discount'})
                  </span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={Math.round(origPrice * 0.5)}
                max={origPrice}
                step={isUSD ? 1 : 50}
                value={offerPrice}
                onChange={(e) => {
                  setOfferPrice(Number(e.target.value));
                  if (state !== 'idle') setState('idle');
                }}
                className="w-full accent-[#183F32] cursor-pointer"
              />

              {/* Bargain Gauge Indicator */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-semibold pt-1">
                <div
                  className={`py-1 rounded-md border ${
                    discountPercent <= hakeemBargainSettings.maxDiscountPercent
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                      : 'bg-emerald-50 text-emerald-700/60 border-emerald-200'
                  }`}
                >
                  🟢 {isUrdu ? 'معقول رعایت' : 'Fair (0-15%)'}
                </div>
                <div
                  className={`py-1 rounded-md border ${
                    discountPercent > hakeemBargainSettings.maxDiscountPercent &&
                    discountPercent <= hakeemBargainSettings.tooLowThresholdPercent
                      ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                      : 'bg-amber-50 text-amber-700/60 border-amber-200'
                  }`}
                >
                  🟡 {isUrdu ? 'چیلنجنگ' : 'Bold (15-25%)'}
                </div>
                <div
                  className={`py-1 rounded-md border ${
                    discountPercent > hakeemBargainSettings.tooLowThresholdPercent
                      ? 'bg-red-100 text-red-900 border-red-400 font-bold'
                      : 'bg-red-50 text-red-700/60 border-red-200'
                  }`}
                >
                  🔴 {isUrdu ? 'ارے بھائی!' : 'Greedy (>25%)'}
                </div>
              </div>

              {/* Quick Offer Buttons */}
              <div className="flex flex-wrap gap-1.5 justify-center pt-1">
                {[5, 10, 15, 20].map((pct) => {
                  const calculated = Math.round(origPrice * (1 - pct / 100));
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        setOfferPrice(calculated);
                        if (state !== 'idle') setState('idle');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        offerPrice === calculated
                          ? 'bg-[#183F32] text-white border-[#183F32]'
                          : 'bg-white hover:bg-[#FAF9F3] text-[#26312B] border-[#AFC7A5]/40'
                      }`}
                    >
                      {pct}% OFF ({currencySymbol} {calculated.toLocaleString()})
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                {state === 'counter_offer' ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleAcceptCounterOffer}
                      className="w-full py-3 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Handshake className="w-4 h-4 text-[#C5A880]" />
                      <span>
                        {isUrdu
                          ? `حکیم صاحب کی ${hakeemBargainSettings.counterOfferDiscountPercent}% رعایت قبول کریں`
                          : `Accept Hakeem's ${hakeemBargainSettings.counterOfferDiscountPercent}% Counter-Offer`}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={handleEvaluateOffer}
                      className="w-full py-2 bg-transparent hover:bg-gray-100 text-[#26312B]/75 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      {isUrdu ? 'دوبارہ پیشکش ارسال کریں' : 'Try Another Offer'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleEvaluateOffer}
                    disabled={state === 'pondering'}
                    className="w-full py-3 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Handshake className="w-4 h-4 text-[#C5A880]" />
                    <span>
                      {state === 'pondering'
                        ? isUrdu
                          ? 'حکیم صاحب غور فرما رہے ہیں...'
                          : 'Hakeem is Deciding...'
                        : isUrdu
                        ? 'حکیم صاحب کو پیشکش بھیجیں'
                        : 'Submit Offer to Hakeem Sahib'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Winning / Accepted State Celebration */}
          {state === 'accepted' && (
            <div className="p-5 bg-gradient-to-br from-emerald-50 via-white to-[#FAF9F3] rounded-2xl border-2 border-emerald-500 shadow-md text-center space-y-3 animate-fade-in">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isUrdu ? 'ماشاء اللہ! رعایت منظور ہوئی' : 'Deal Approved!'}</span>
              </div>

              <div className="text-sm font-semibold text-[#183F32]">
                {isUrdu ? 'آپ کو حاصل ہوئی ہے:' : 'You Unlocked:'}{' '}
                <strong className="text-emerald-800 text-base">{acceptedPercent}% OFF</strong>
              </div>

              {generatedCoupon && (
                <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                  <div className="flex-1 px-4 py-2 bg-white rounded-xl border border-emerald-400 font-mono font-bold text-sm text-[#183F32] tracking-wider shadow-inner">
                    {generatedCoupon}
                  </div>
                </div>
              )}

              <p className="text-[11px] text-[#26312B]/70">
                {isUrdu
                  ? 'یہ کوپن آپ کے چیک آؤٹ میں شامل کر دیا گیا ہے۔ ابھی اپنا آرڈر کنفرم فرمائیں!'
                  : 'This discount voucher has been activated. Proceed to checkout to claim your deal!'}
              </p>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>{isUrdu ? 'رعایت کے ساتھ آگے بڑھیں' : 'Proceed with Discount'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
