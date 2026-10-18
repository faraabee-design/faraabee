import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useCustomization } from '../../context/CustomizationContext';
import {
  Truck,
  DollarSign,
  Megaphone,
  Save,
  CheckCircle2,
  Eye,
  Trash2,
  Sparkles,
  Phone,
  RefreshCw,
  Layers,
  Info,
} from 'lucide-react';

interface AdminStoreSettingsProps {
  onNotify: (msg: string) => void;
}

export const AdminStoreSettings: React.FC<AdminStoreSettingsProps> = ({ onNotify }) => {
  const { deliverySettings, updateDeliverySettings, activeCurrency, setActiveCurrency } = useStore();
  const { theme, content, updateTheme, updateTextItem } = useCustomization();

  // Announcement state
  const [announcementText, setAnnouncementText] = useState(content.announcementText?.text || '');
  const [bannerBg, setBannerBg] = useState(theme.bannerBgColor || '#183F32');
  const [bannerText, setBannerText] = useState(theme.bannerTextColor || '#FAF9F3');
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);

  // Delivery settings state
  const [standardFeePKR, setStandardFeePKR] = useState(String(deliverySettings.standardShippingFee ?? 250));
  const [standardFeeUSD, setStandardFeeUSD] = useState(String(deliverySettings.standardShippingFeeUSD ?? 10));
  const [freeThresholdPKR, setFreeThresholdPKR] = useState(String(deliverySettings.freeShippingThreshold ?? 5000));
  const [freeThresholdUSD, setFreeThresholdUSD] = useState(String(deliverySettings.freeShippingThresholdUSD ?? 50));
  const [freeShippingEnabled, setFreeShippingEnabled] = useState(deliverySettings.freeShippingEnabled ?? true);
  const [estimatedDays, setEstimatedDays] = useState(deliverySettings.estimatedDays || '2-4 Business Days');
  const [deliveryNote, setDeliveryNote] = useState(
    deliverySettings.deliveryNote || 'Standard delivery across Pakistan takes 2-4 business days.'
  );
  const [savingDelivery, setSavingDelivery] = useState(false);

  // Currency & Contact settings state
  const [primaryCurrency, setPrimaryCurrency] = useState<'PKR' | 'USD'>(activeCurrency || 'PKR');
  const [conversionRate, setConversionRate] = useState('280');
  const [supportPhone, setSupportPhone] = useState('+92 309 1655743');
  const [savingGeneral, setSavingGeneral] = useState(false);

  // Sync when remote context updates
  useEffect(() => {
    if (content.announcementText?.text !== undefined) {
      setAnnouncementText(content.announcementText.text);
    }
  }, [content.announcementText?.text]);

  useEffect(() => {
    setBannerBg(theme.bannerBgColor || '#183F32');
    setBannerText(theme.bannerTextColor || '#FAF9F3');
  }, [theme.bannerBgColor, theme.bannerTextColor]);

  useEffect(() => {
    setStandardFeePKR(String(deliverySettings.standardShippingFee ?? 250));
    setStandardFeeUSD(String(deliverySettings.standardShippingFeeUSD ?? 10));
    setFreeThresholdPKR(String(deliverySettings.freeShippingThreshold ?? 5000));
    setFreeThresholdUSD(String(deliverySettings.freeShippingThresholdUSD ?? 50));
    setFreeShippingEnabled(deliverySettings.freeShippingEnabled ?? true);
    setEstimatedDays(deliverySettings.estimatedDays || '2-4 Business Days');
    setDeliveryNote(deliverySettings.deliveryNote || 'Standard delivery across Pakistan takes 2-4 business days.');
  }, [deliverySettings]);

  // Handlers for Announcement Ribbon
  const handleSaveAnnouncement = async () => {
    setSavingAnnouncement(true);
    try {
      await updateTextItem('announcementText', {
        text: announcementText.trim(),
        color: bannerText,
      });
      await updateTheme({
        bannerBgColor: bannerBg,
        bannerTextColor: bannerText,
      });
      onNotify('Top announcement ribbon updated successfully!');
    } catch {
      onNotify('Failed to save announcement bar.');
    } finally {
      setSavingAnnouncement(false);
    }
  };

  const handleClearAnnouncement = async () => {
    setAnnouncementText('');
    setSavingAnnouncement(true);
    try {
      await updateTextItem('announcementText', { text: '' });
      onNotify('Top announcement bar cleared and hidden.');
    } catch {
      onNotify('Failed to clear announcement.');
    } finally {
      setSavingAnnouncement(false);
    }
  };

  // Handlers for Delivery Settings
  const handleSaveDelivery = async () => {
    setSavingDelivery(false);
    try {
      const pkrFee = Math.max(0, Number(standardFeePKR) || 0);
      const usdFee = Math.max(0, Number(standardFeeUSD) || 0);
      const pkrThreshold = Math.max(0, Number(freeThresholdPKR) || 0);
      const usdThreshold = Math.max(0, Number(freeThresholdUSD) || 0);

      await updateDeliverySettings({
        standardShippingFee: pkrFee,
        standardShippingFeeUSD: usdFee,
        freeShippingThreshold: pkrThreshold,
        freeShippingThresholdUSD: usdThreshold,
        freeShippingEnabled,
        estimatedDays: estimatedDays.trim(),
        deliveryNote: deliveryNote.trim(),
      });
      onNotify(`Delivery fee set to Rs. ${pkrFee} ($${usdFee})!`);
    } catch {
      onNotify('Failed to update delivery settings.');
    } finally {
      setSavingDelivery(false);
    }
  };

  // Handlers for General Currency & Contact
  const handleSaveGeneral = () => {
    setSavingGeneral(true);
    setActiveCurrency(primaryCurrency);
    try {
      localStorage.setItem('faraabee_usd_pkr_rate', conversionRate);
      localStorage.setItem('faraabee_support_phone', supportPhone);
    } catch {}
    setTimeout(() => {
      setSavingGeneral(false);
      onNotify(`Store currency set to ${primaryCurrency}. Settings saved.`);
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#183F32]">
          Store Settings & Configuration
        </h1>
        <p className="text-xs text-[#26312B]/70 mt-1">
          Customize the top announcement bar anytime, set your desired delivery fees, and configure multi-currency options for PKR and USD.
        </p>
      </div>

      {/* ============================================================== */}
      {/* 1. TOP ANNOUNCEMENT RIBBON MANAGER */}
      {/* ============================================================== */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#AFC7A5]/35 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#AFC7A5]/25">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#E8F1DF] text-[#183F32] rounded-2xl">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#183F32] flex items-center gap-2">
                <span>Top Announcement Ribbon</span>
                {announcementText.trim() ? (
                  <span className="text-[10px] font-sans font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Live On Website
                  </span>
                ) : (
                  <span className="text-[10px] font-sans font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Hidden (Empty)
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#26312B]/70 mt-0.5">
                Rewrite this top line whenever you want without touching any code. Leave empty to hide it.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {announcementText.trim() ? (
              <button
                type="button"
                onClick={handleClearAnnouncement}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear / Hide</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Live Visual Preview */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-2 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Live Header Preview</span>
          </label>
          <div
            className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-medium transition-colors shadow-2xs border border-black/5"
            style={{
              backgroundColor: bannerBg,
              color: bannerText,
            }}
          >
            {announcementText.trim() ? (
              <span>{announcementText}</span>
            ) : (
              <span className="opacity-50 italic">
                (Announcement bar is currently empty and will not take up space on the website)
              </span>
            )}
          </div>
        </div>

        {/* Text Area */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1.5">
            Announcement Text
          </label>
          <textarea
            rows={2}
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="e.g. 🌿 Free Delivery Across Pakistan on Orders Over Rs. 5,000 | Fresh artisanal batches prepared daily"
            className="w-full px-3.5 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-[#FAF9F3]/30"
          />
          <div className="flex justify-between items-center mt-1 text-[11px] text-[#26312B]/60">
            <span>Tip: You can use emojis like 🌿, ✨, 📦, 🌸</span>
            <span>{announcementText.length} characters</span>
          </div>
        </div>

        {/* Quick Template Presets */}
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#26312B]/70 mb-2">
            Quick One-Click Templates
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setAnnouncementText(
                  `🌿 Free Delivery Across Pakistan on Orders Over Rs. ${Number(standardFeePKR) > 0 ? Number(freeThresholdPKR).toLocaleString() : '5,000'}`
                )
              }
              className="text-xs px-3 py-1.5 bg-[#FAF9F3] hover:bg-[#E8F1DF] text-[#183F32] border border-[#AFC7A5]/40 rounded-lg font-medium transition-colors cursor-pointer"
            >
              🌿 Free Delivery Template
            </button>
            <button
              type="button"
              onClick={() =>
                setAnnouncementText('✨ Pure Classical Botanicals Handcrafted for Everyday Vitality · Nationwide Shipping')
              }
              className="text-xs px-3 py-1.5 bg-[#FAF9F3] hover:bg-[#E8F1DF] text-[#183F32] border border-[#AFC7A5]/40 rounded-lg font-medium transition-colors cursor-pointer"
            >
              ✨ Artisanal Care Template
            </button>
            <button
              type="button"
              onClick={() =>
                setAnnouncementText('📦 Fresh Batch Dispatched Daily · Track Your Parcel Live Across Pakistan')
              }
              className="text-xs px-3 py-1.5 bg-[#FAF9F3] hover:bg-[#E8F1DF] text-[#183F32] border border-[#AFC7A5]/40 rounded-lg font-medium transition-colors cursor-pointer"
            >
              📦 Dispatch Alert Template
            </button>
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1.5">
              Banner Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bannerBg}
                onChange={(e) => setBannerBg(e.target.value)}
                className="w-10 h-10 rounded-lg border border-[#AFC7A5]/40 cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={bannerBg}
                onChange={(e) => setBannerBg(e.target.value)}
                className="flex-1 px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs font-mono uppercase bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1.5">
              Banner Text Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                className="w-10 h-10 rounded-lg border border-[#AFC7A5]/40 cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                className="flex-1 px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-xs font-mono uppercase bg-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#AFC7A5]/20 flex justify-end">
          <button
            type="button"
            onClick={handleSaveAnnouncement}
            disabled={savingAnnouncement}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#183F32] hover:bg-[#122F25] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
          >
            {savingAnnouncement ? (
              <span>Saving Changes...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Announcement Ribbon</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. DESIRED DELIVERY & SHIPPING FEE CONTROLS */}
      {/* ============================================================== */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#AFC7A5]/35 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#AFC7A5]/25">
          <div className="p-2.5 bg-[#E8F1DF] text-[#183F32] rounded-2xl">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-[#183F32]">
              Delivery & Shipping Fees
            </h2>
            <p className="text-xs text-[#26312B]/70 mt-0.5">
              Set your exact desired delivery fee for customer orders, adjust free delivery incentives, and specify delivery estimates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* PKR Standard Shipping Fee */}
          <div className="p-4 bg-[#FAF9F3] rounded-2xl border border-[#AFC7A5]/30">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
              Desired Delivery Fee (PKR) *
            </label>
            <p className="text-[11px] text-[#26312B]/70 mb-2">
              Charged to domestic orders across Pakistan. Set to 0 for completely free delivery.
            </p>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-[#183F32]">
                Rs.
              </span>
              <input
                type="number"
                min="0"
                step="10"
                value={standardFeePKR}
                onChange={(e) => setStandardFeePKR(e.target.value)}
                placeholder="250"
                className="w-full pl-10 pr-3 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[0, 150, 200, 250, 300].map((fee) => (
                <button
                  key={fee}
                  type="button"
                  onClick={() => setStandardFeePKR(String(fee))}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium border cursor-pointer ${
                    standardFeePKR === String(fee)
                      ? 'bg-[#183F32] text-white border-[#183F32]'
                      : 'bg-white text-[#26312B]/80 border-[#AFC7A5]/30 hover:border-[#183F32]'
                  }`}
                >
                  {fee === 0 ? 'Free (Rs. 0)' : `Rs. ${fee}`}
                </button>
              ))}
            </div>
          </div>

          {/* USD Standard Shipping Fee */}
          <div className="p-4 bg-[#FAF9F3] rounded-2xl border border-[#AFC7A5]/30">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
              Desired Delivery Fee (USD) *
            </label>
            <p className="text-[11px] text-[#26312B]/70 mb-2">
              Applied when a customer checks out using USD currency.
            </p>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-[#183F32]">
                $
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={standardFeeUSD}
                onChange={(e) => setStandardFeeUSD(e.target.value)}
                placeholder="10"
                className="w-full pl-8 pr-3 py-2.5 border border-[#AFC7A5]/40 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[0, 5, 10, 15, 20].map((fee) => (
                <button
                  key={fee}
                  type="button"
                  onClick={() => setStandardFeeUSD(String(fee))}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium border cursor-pointer ${
                    standardFeeUSD === String(fee)
                      ? 'bg-[#183F32] text-white border-[#183F32]'
                      : 'bg-white text-[#26312B]/80 border-[#AFC7A5]/30 hover:border-[#183F32]'
                  }`}
                >
                  {fee === 0 ? 'Free ($0)' : `$${fee}`}
                </button>
              ))}
            </div>
          </div>

          {/* Free Shipping Threshold PKR */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
              Free Shipping Order Minimum (PKR)
            </label>
            <p className="text-[11px] text-[#26312B]/70 mb-1.5">
              Orders at or above this amount automatically get free shipping.
            </p>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-[#183F32]">
                Rs.
              </span>
              <input
                type="number"
                min="0"
                step="500"
                value={freeThresholdPKR}
                onChange={(e) => setFreeThresholdPKR(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32]"
              />
            </div>
          </div>

          {/* Free Shipping Threshold USD */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
              Free Shipping Order Minimum (USD)
            </label>
            <p className="text-[11px] text-[#26312B]/70 mb-1.5">
              US Dollar threshold for complimentary international delivery.
            </p>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-[#183F32]">
                $
              </span>
              <input
                type="number"
                min="0"
                step="5"
                value={freeThresholdUSD}
                onChange={(e) => setFreeThresholdUSD(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32]"
              />
            </div>
          </div>

          {/* Estimated Days */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
              Estimated Delivery Transit Time
            </label>
            <input
              type="text"
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(e.target.value)}
              placeholder="e.g. 2-4 Business Days"
              className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32]"
            />
          </div>

          {/* Delivery Note */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
              Delivery Disclaimer Note (Shown during Checkout)
            </label>
            <textarea
              rows={2}
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder="Standard delivery across Pakistan takes 2-4 business days."
              className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32]"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#AFC7A5]/20 flex justify-end">
          <button
            type="button"
            onClick={handleSaveDelivery}
            disabled={savingDelivery}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#183F32] hover:bg-[#122F25] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
          >
            {savingDelivery ? (
              <span>Saving Delivery Fees...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Delivery Fees</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. MULTI-CURRENCY & PRODUCT PRICING OPTIONS */}
      {/* ============================================================== */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#AFC7A5]/35 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#AFC7A5]/25">
          <div className="p-2.5 bg-[#E8F1DF] text-[#183F32] rounded-2xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-[#183F32]">
              Currency & Pricing Configuration
            </h2>
            <p className="text-xs text-[#26312B]/70 mt-0.5">
              Support both PKR (Pakistani Rupee) and USD (US Dollar) price tags across all remedies and catalog items.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-2">
              Default Active Currency Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              <button
                type="button"
                onClick={() => setPrimaryCurrency('PKR')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  primaryCurrency === 'PKR'
                    ? 'border-[#183F32] bg-[#E8F1DF]/40 ring-2 ring-[#183F32]'
                    : 'border-[#AFC7A5]/40 hover:bg-[#FAF9F3]'
                }`}
              >
                <div className="text-xl">🇵🇰</div>
                <div>
                  <span className="font-bold text-xs text-[#183F32] block">PKR (Pakistani Rupee)</span>
                  <span className="text-[11px] text-[#26312B]/70">Standard domestic store currency (Rs.)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPrimaryCurrency('USD')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  primaryCurrency === 'USD'
                    ? 'border-[#183F32] bg-[#E8F1DF]/40 ring-2 ring-[#183F32]'
                    : 'border-[#AFC7A5]/40 hover:bg-[#FAF9F3]'
                }`}
              >
                <div className="text-xl">🇺🇸</div>
                <div>
                  <span className="font-bold text-xs text-[#183F32] block">USD (US Dollar)</span>
                  <span className="text-[11px] text-[#26312B]/70">International customers pricing ($)</span>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                Conversion Reference (1 USD in PKR)
              </label>
              <input
                type="number"
                value={conversionRate}
                onChange={(e) => setConversionRate(e.target.value)}
                placeholder="280"
                className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32]"
              />
              <span className="text-[11px] text-[#26312B]/60 mt-1 block">
                Used to auto-calculate USD price tags when creating new products.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32] mb-1">
                WhatsApp Order Line / Support
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                placeholder="+92 309 1655743"
                className="w-full px-3 py-2 border border-[#AFC7A5]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#183F32]"
              />
              <span className="text-[11px] text-[#26312B]/60 mt-1 block">
                Direct WhatsApp contact for phone consultations & inquiries.
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#AFC7A5]/20 flex justify-end">
          <button
            type="button"
            onClick={handleSaveGeneral}
            disabled={savingGeneral}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#183F32] hover:bg-[#122F25] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
          >
            {savingGeneral ? (
              <span>Saving Preferences...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Currency & Contact</span>
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};
