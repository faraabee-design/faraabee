import React, { useState } from 'react';
import { CartItem } from '../types';
import { useStore } from '../context/StoreContext';
import { FirewallEngine } from '../lib/firewallEngine';
import {
  X,
  CheckCircle,
  Truck,
  Building2,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
  Smartphone,
  CreditCard,
  Info,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const { createOrder, deliverySettings, paymentSettings, activeCurrency, language, t } = useStore();

  // Determine initial payment method based on admin settings
  const [method, setMethod] = useState<'cod' | 'bank' | 'jazzcash' | 'easypaisa'>(() => {
    if (paymentSettings?.codEnabled) return 'cod';
    if (paymentSettings?.bankTransfer?.enabled) return 'bank';
    if (paymentSettings?.jazzCash?.enabled) return 'jazzcash';
    if (paymentSettings?.easyPaisa?.enabled) return 'easypaisa';
    return 'cod';
  });

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [senderTitle, setSenderTitle] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [honeypotField, setHoneypotField] = useState('');

  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isUrdu = language === 'ur';
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
      : (item.product.salePrice && item.product.salePrice < item.product.price
          ? item.product.salePrice
          : item.product.price);
    return acc + itemPrice * item.quantity;
  }, 0);

  const isFreeDelivery =
    deliverySettings.freeShippingEnabled && (standardShippingFee === 0 || subtotal >= freeThreshold);
  const shipping = isFreeDelivery ? 0 : standardShippingFee;
  const grandTotal = subtotal + shipping;

  const handleCopy = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    // 1. Check Firewall Emergency Lockdown
    const lockdown = await FirewallEngine.checkLockdown();
    if (lockdown.isLocked) {
      setSubmitError(lockdown.message || 'Orders are temporarily paused for routine security maintenance.');
      setSubmitting(false);
      return;
    }

    // 2. Check Anti-Bot Honeypot Trap
    const botCheck = await FirewallEngine.verifyHoneypot(honeypotField, '/checkout/place-order');
    if (!botCheck.passed) {
      setSubmitError('Verification failed. Automated submissions are blocked.');
      setSubmitting(false);
      return;
    }

    // 3. Check Sliding Window Rate Limiter
    const rateCheck = await FirewallEngine.checkRateLimit('order', '/checkout/place-order');
    if (!rateCheck.passed) {
      setSubmitError(rateCheck.error || 'Too many submissions. Please wait a moment.');
      setSubmitting(false);
      return;
    }

    // 4. Inspect inputs for malicious code / script injection
    const rawInspectionString = [name, phone, email, address, city, notes, transactionId, senderTitle].join(' ');
    const inspection = FirewallEngine.inspectString(rawInspectionString);
    if (inspection.isMalicious) {
      await FirewallEngine.recordThreatIncident({
        category: inspection.category || 'xss_injection',
        severity: 'high',
        description: `Blocked code injection in order checkout: ${inspection.reason}`,
        sourceEndpoint: '/checkout/place-order',
        payloadSnippet: inspection.snippet,
        actionTaken: 'blocked_and_quarantined',
      });
      setSubmitError('Security Notice: Code tags and script elements are blocked for safety. Please enter plain text only.');
      setSubmitting(false);
      return;
    }

    const orderItems = items.map((i) => ({
      productId: i.product.id,
      name: FirewallEngine.sanitizeString(i.product.name),
      price:
        i.product.salePrice && i.product.salePrice < i.product.price
          ? i.product.salePrice
          : i.product.price,
      quantity: Math.max(1, Math.min(99, i.quantity)),
      image: i.product.image || '',
    }));

    try {
      // Save order to Firestore with strictly sanitized fields
      const newOrderId = await createOrder({
        customerName: FirewallEngine.sanitizeString(name.trim()),
        customerPhone: FirewallEngine.sanitizeString(phone.trim()),
        customerEmail: FirewallEngine.sanitizeString(email.trim()) || undefined,
        shippingAddress: FirewallEngine.sanitizeString(address.trim()),
        city: FirewallEngine.sanitizeString(city.trim()) || 'Pakistan',
        notes: notes.trim() ? FirewallEngine.sanitizeString(notes.trim()) : undefined,
        items: orderItems,
        total: grandTotal,
        paymentMethod: method,
        transactionId: transactionId.trim() ? FirewallEngine.sanitizeString(transactionId.trim()) : undefined,
        paymentSenderTitle: senderTitle.trim() ? FirewallEngine.sanitizeString(senderTitle.trim()) : undefined,
        status: 'pending',
      });

      if (!newOrderId) {
        throw new Error('Order could not be saved to server.');
      }

      setOrderRef(newOrderId);

      // Save order to localStorage so the customer can track their order
      try {
        const raw = localStorage.getItem('faraabee_recent_orders');
        const recent = raw ? JSON.parse(raw) : [];
        const updated = [
          {
            id: newOrderId,
            customerName: name.trim(),
            customerPhone: phone.trim(),
            total: grandTotal,
            city: city.trim() || 'Pakistan',
            paymentMethod: method,
            createdAt: new Date().toISOString(),
          },
          ...recent.filter((r: any) => r.id !== newOrderId),
        ].slice(0, 10);
        localStorage.setItem('faraabee_recent_orders', JSON.stringify(updated));
      } catch (storageErr) {
        console.warn('Could not cache recent order:', storageErr);
      }

      setOrderSubmitted(true);
      onOrderSuccess();
    } catch (err: unknown) {
      console.error('Error placing order to Firestore:', err);
      const msg = err instanceof Error ? err.message : 'Connection error';
      setSubmitError(
        isUrdu
          ? 'معذرت، آرڈر درج کرنے میں مسئلہ پیش آیا۔ برائے کرم انٹرنیٹ کنکشن چیک کر کے دوبارہ کوشش فرمائیں۔'
          : `Unable to register order with the server: ${msg}. Please check connection and retry.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const bank = paymentSettings?.bankTransfer;
  const jazz = paymentSettings?.jazzCash;
  const easy = paymentSettings?.easyPaisa;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-[#183F32]/65 backdrop-blur-xs flex items-center justify-center p-4 ${
        isUrdu ? 'rtl' : 'ltr'
      }`}
    >
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-[#AFC7A5]/40 my-8 animate-scale-in">
        {/* Header */}
        <div className="p-6 bg-[#FAF9F3] border-b border-[#AFC7A5]/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#285844] font-semibold">
              {isUrdu ? 'فارابی دواخانہ آرڈر ڈیسک' : 'FARAABEE APOTHECARY ORDER DESK'}
            </span>
            <h3 className="font-serif text-2xl font-medium text-[#183F32] mt-0.5">
              {orderSubmitted
                ? isUrdu
                  ? 'الحمد للہ! آرڈر درج ہو گیا'
                  : 'Order Confirmed'
                : isUrdu
                ? 'اپنا آرڈر مکمل فرمائیں'
                : 'Complete Your Order'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#26312B] hover:text-[#183F32] rounded-md transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderSubmitted ? (
          /* Order Confirmation View */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#E8F1DF] text-[#183F32] mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[#285844]" />
            </div>

            <h4 className="font-serif text-2xl text-[#183F32]">
              {isUrdu ? `شکریہ، ${name}` : `Thank You, ${name}`}
            </h4>

            <p className="text-sm text-[#26312B]/80 max-w-md mx-auto leading-relaxed">
              {isUrdu
                ? `آپ کی منتخب کردہ قدرتی ادویات کا آرڈر موصول ہو چکا ہے۔ ہماری کیئر ٹیم فون نمبر ${phone} پر تصدیق اور ترسیل کا میسج ارسال کرے گی۔`
                : `Your herbal formulation order has been received by FARAABEE Apothecary. Our team will contact you on ${phone} regarding order verification & dispatch.`}
            </p>

            <div className="p-5 bg-[#FAF9F3] rounded-2xl border border-[#AFC7A5]/40 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#AFC7A5]/25">
                <span className="text-[#26312B]/70">{isUrdu ? 'آرڈر ریفرنس:' : 'Order Reference:'}</span>
                <span className="font-mono font-bold text-sm text-[#183F32] bg-white px-2.5 py-0.5 rounded border border-[#AFC7A5]/40">
                  {orderRef}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#26312B]/70">{isUrdu ? 'طریقہ ادائیگی:' : 'Payment Method:'}</span>
                <span className="font-semibold text-[#183F32]">
                  {method === 'cod' && (isUrdu ? 'کیش آن ڈیلیوری (COD)' : 'Cash on Delivery (COD)')}
                  {method === 'bank' && (isUrdu ? 'آن لائن بینک ٹرانسفر' : 'Direct Bank Transfer')}
                  {method === 'jazzcash' && (isUrdu ? 'جاز کیش والیٹ' : 'JazzCash Wallet')}
                  {method === 'easypaisa' && (isUrdu ? 'ایزی پیسہ والیٹ' : 'Easypaisa Wallet')}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#AFC7A5]/25">
                <span className="text-[#26312B]/70">{isUrdu ? 'کل واجب الادا رقم:' : 'Total Payable:'}</span>
                <span className="font-bold text-base text-[#183F32]">
                  {currencySymbol} {grandTotal.toLocaleString()}
                </span>
              </div>

              {/* If online payment method chosen, show instructions & account */}
              {method === 'bank' && bank && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-200 text-[11px] space-y-1">
                  <div className="font-bold text-[#183F32] flex items-center justify-between">
                    <span>{bank.bankName}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bank.accountNumber, 'conf-bank-num')}
                      className="text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'conf-bank-num' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'conf-bank-num' ? 'Copied' : 'Copy Acc #'}</span>
                    </button>
                  </div>
                  <div>Title: <strong>{bank.accountTitle}</strong></div>
                  <div className="font-mono">Account #: <strong>{bank.accountNumber}</strong></div>
                  <div className="font-mono text-[10px]">IBAN: {bank.iban}</div>
                </div>
              )}

              {method === 'jazzcash' && jazz && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-red-200 text-[11px] space-y-1">
                  <div className="font-bold text-red-800 flex items-center justify-between">
                    <span>JazzCash Account</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(jazz.mobileNumber, 'conf-jc-num')}
                      className="text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'conf-jc-num' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'conf-jc-num' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div>Title: <strong>{jazz.accountTitle}</strong></div>
                  <div className="font-mono font-bold text-xs">Number: {jazz.mobileNumber}</div>
                </div>
              )}

              {method === 'easypaisa' && easy && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-200 text-[11px] space-y-1">
                  <div className="font-bold text-emerald-800 flex items-center justify-between">
                    <span>Easypaisa Account</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(easy.mobileNumber, 'conf-ep-num')}
                      className="text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'conf-ep-num' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'conf-ep-num' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div>Title: <strong>{easy.accountTitle}</strong></div>
                  <div className="font-mono font-bold text-xs">Number: {easy.mobileNumber}</div>
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => {
                  window.location.hash = `track-order/${orderRef}`;
                  onClose();
                }}
                className="px-6 py-2.5 bg-[#183F32] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#285844] transition-colors cursor-pointer"
              >
                {isUrdu ? 'آرڈر کی لائیو ٹریکنگ دیکھیں' : 'Track This Order Live'}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#FAF9F3] text-[#183F32] border border-[#AFC7A5]/50 text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#E8F1DF] transition-colors cursor-pointer"
              >
                {isUrdu ? 'دوبارہ سٹور پر جائیں' : 'Return to Store'}
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Anti-Bot Security Honeypot (Invisible to human users) */}
            <input
              type="text"
              name="farabi_verification_trap"
              value={honeypotField}
              onChange={(e) => setHoneypotField(e.target.value)}
              style={{ display: 'none', position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            {/* Items Summary Pills */}
            <div className="p-4 bg-[#FAF9F3] rounded-2xl border border-[#AFC7A5]/30 space-y-2">
              <div className="flex justify-between text-xs text-[#26312B]/75">
                <span>
                  {isUrdu
                    ? `منتخب ادویات (${items.reduce((acc, i) => acc + i.quantity, 0)} اشیاء):`
                    : `Selected Formulations (${items.reduce((acc, i) => acc + i.quantity, 0)} items):`}
                </span>
                <span className="font-semibold">
                  {currencySymbol} {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-xs text-[#26312B]/75">
                <span>{isUrdu ? 'ڈومیسٹک ترسیل و ڈیلیوری:' : 'Domestic Delivery:'}</span>
                <span>
                  {shipping === 0 ? (
                    <strong className="text-emerald-800 uppercase font-bold">
                      {isUrdu ? 'مفت ڈیلیوری' : 'FREE'}
                    </strong>
                  ) : (
                    `${currencySymbol} ${shipping.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-[#AFC7A5]/25 flex justify-between text-sm font-semibold text-[#183F32]">
                <span>{isUrdu ? 'کل واجب الادا رقم:' : 'Total Amount:'}</span>
                <span className="font-bold text-base">
                  {currencySymbol} {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183F32]">
                  {isUrdu ? 'طریقہ ادائیگی کا انتخاب فرمائیں' : 'Select Payment Method'}
                </label>
                <span className="text-[11px] text-[#26312B]/60">
                  {isUrdu ? 'آن لائن ٹرانسفر یا کیش آن ڈیلیوری' : 'Online Transfer or COD'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Cash on Delivery (if enabled) */}
                {paymentSettings?.codEnabled !== false && (
                  <button
                    type="button"
                    onClick={() => setMethod('cod')}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      method === 'cod'
                        ? 'border-[#183F32] bg-[#E8F1DF]/50 ring-2 ring-[#183F32]'
                        : 'border-[#AFC7A5]/40 hover:bg-[#FAF9F3]'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-[#285844] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold text-[#183F32]">
                        {isUrdu ? 'کیش آن ڈیلیوری (COD)' : 'Cash on Delivery (COD)'}
                      </span>
                      <span className="block text-[11px] text-[#26312B]/70 mt-0.5">
                        {isUrdu ? 'پارسل موصول ہونے پر نقدی ادا کریں' : 'Pay in cash upon package arrival'}
                      </span>
                    </div>
                  </button>
                )}

                {/* 2. Direct Bank Transfer (if enabled) */}
                {bank?.enabled !== false && (
                  <button
                    type="button"
                    onClick={() => setMethod('bank')}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      method === 'bank'
                        ? 'border-[#183F32] bg-[#E8F1DF]/50 ring-2 ring-[#183F32]'
                        : 'border-[#AFC7A5]/40 hover:bg-[#FAF9F3]'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#285844] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold text-[#183F32]">
                        {isUrdu ? 'آن لائن بینک ٹرانسفر' : 'Online Bank Transfer'}
                      </span>
                      <span className="block text-[11px] text-[#26312B]/70 mt-0.5">
                        {bank?.bankName || 'Meezan Bank'} · IBFT / App
                      </span>
                    </div>
                  </button>
                )}

                {/* 3. JazzCash (if enabled) */}
                {jazz?.enabled !== false && (
                  <button
                    type="button"
                    onClick={() => setMethod('jazzcash')}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      method === 'jazzcash'
                        ? 'border-[#183F32] bg-[#E8F1DF]/50 ring-2 ring-[#183F32]'
                        : 'border-[#AFC7A5]/40 hover:bg-[#FAF9F3]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-md bg-red-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                      JC
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-[#183F32]">
                        {isUrdu ? 'جاز کیش (JazzCash)' : 'JazzCash Wallet'}
                      </span>
                      {jazz?.mobileNumber && (
                        <span className="block text-[11px] text-[#26312B]/70 mt-0.5 font-mono">
                          {jazz.mobileNumber}
                        </span>
                      )}
                    </div>
                  </button>
                )}

                {/* 4. Easypaisa (if enabled) */}
                {easy?.enabled !== false && (
                  <button
                    type="button"
                    onClick={() => setMethod('easypaisa')}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      method === 'easypaisa'
                        ? 'border-[#183F32] bg-[#E8F1DF]/50 ring-2 ring-[#183F32]'
                        : 'border-[#AFC7A5]/40 hover:bg-[#FAF9F3]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-md bg-emerald-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                      EP
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-[#183F32]">
                        {isUrdu ? 'ایزی پیسہ (Easypaisa)' : 'Easypaisa Wallet'}
                      </span>
                      {easy?.mobileNumber && (
                        <span className="block text-[11px] text-[#26312B]/70 mt-0.5 font-mono">
                          {easy.mobileNumber}
                        </span>
                      )}
                    </div>
                  </button>
                )}
              </div>

              {/* Dynamic Online Payment Details Box */}
              {method === 'bank' && bank && (
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 text-xs">
                    <span className="font-bold text-[#183F32] flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-800" />
                      <span>{bank.bankName}</span>
                    </span>
                    <span className="text-[11px] text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded font-medium">
                      Official Farabi Account
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#26312B]/65 block text-[10px] uppercase font-semibold">Account Title:</span>
                      <strong className="text-[#183F32] text-xs">{bank.accountTitle}</strong>
                    </div>

                    <div>
                      <span className="text-[#26312B]/65 block text-[10px] uppercase font-semibold">Account Number:</span>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-xs text-[#183F32]">{bank.accountNumber}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy(bank.accountNumber, 'bank-acc')}
                          className="px-2 py-0.5 text-[10px] bg-white border border-emerald-300 rounded font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === 'bank-acc' ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'bank-acc' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-[#26312B]/65 block text-[10px] uppercase font-semibold">IBAN Number:</span>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-[11px] text-[#183F32] break-all">{bank.iban}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy(bank.iban, 'bank-iban')}
                          className="px-2 py-0.5 text-[10px] bg-white border border-emerald-300 rounded font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          {copiedKey === 'bank-iban' ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'bank-iban' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {bank.branchName && (
                      <div className="sm:col-span-2 text-[11px] text-[#26312B]/75">
                        Branch: {bank.branchName}
                      </div>
                    )}
                  </div>

                  {bank.instructions && (
                    <div className="pt-2 border-t border-emerald-200/50 text-[11px] text-emerald-950 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-emerald-800 shrink-0 mt-0.5" />
                      <span>{bank.instructions}</span>
                    </div>
                  )}

                  {/* TID / Reference Input */}
                  <div className="pt-2 border-t border-emerald-200/60">
                    <label className="block text-[11px] font-bold text-[#183F32] mb-1">
                      {isUrdu ? 'بینک ٹرانسفر کا حوالہ / ٹرانزیکشن آئی ڈی (TID) درج کریں:' : 'Bank Transaction Reference / TID *'}
                    </label>
                    <input
                      type="text"
                      required={method === 'bank'}
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder={isUrdu ? 'ٹرانزیکشن آئی ڈی یا ڈپازٹ حوالہ درج کریں' : 'Enter Transaction Reference or TID'}
                      className="w-full px-3 py-2 text-xs border border-emerald-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              )}

              {method === 'jazzcash' && jazz && (
                <div className="p-4 bg-red-50/70 rounded-2xl border border-red-200 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-red-200/60 text-xs">
                    <span className="font-bold text-red-900 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-red-700" />
                      <span>JazzCash Mobile Account</span>
                    </span>
                    <span className="text-[11px] text-red-800 bg-red-100 px-2 py-0.5 rounded font-medium">
                      Instant Mobile Transfer
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#26312B]/65 block text-[10px] uppercase font-semibold">Account Title:</span>
                      <strong className="text-red-950 text-xs">{jazz.accountTitle}</strong>
                    </div>

                    <div>
                      <span className="text-[#26312B]/65 block text-[10px] uppercase font-semibold">JazzCash Mobile Number:</span>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-sm text-red-950 font-bold">{jazz.mobileNumber}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy(jazz.mobileNumber, 'jc-num')}
                          className="px-2 py-0.5 text-[10px] bg-white border border-red-300 rounded font-semibold text-red-800 hover:bg-red-100 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === 'jc-num' ? <Check className="w-3 h-3 text-red-700" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'jc-num' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {jazz.instructions && (
                    <div className="pt-2 border-t border-red-200/50 text-[11px] text-red-950 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-red-800 shrink-0 mt-0.5" />
                      <span>{jazz.instructions}</span>
                    </div>
                  )}

                  {/* TID / Sender Input */}
                  <div className="pt-2 border-t border-red-200/60">
                    <label className="block text-[11px] font-bold text-red-950 mb-1">
                      {isUrdu ? 'جاز کیش ٹرانزیکشن آئی ڈی (TID) یا بھیجنے والے کا فون نمبر:' : 'JazzCash TID / Sender Mobile Number *'}
                    </label>
                    <input
                      type="text"
                      required={method === 'jazzcash'}
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder={isUrdu ? 'جاز کیش TID یا بھیجنے والے کا موبائل نمبر' : 'Enter JazzCash TID or Sender Mobile Number'}
                      className="w-full px-3 py-2 text-xs border border-red-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>
              )}

              {method === 'easypaisa' && easy && (
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 text-xs">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-700" />
                      <span>Easypaisa Mobile Account</span>
                    </span>
                    <span className="text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-medium">
                      Instant Mobile Transfer
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#26312B]/65 block text-[10px] uppercase font-semibold">Account Title:</span>
                      <strong className="text-emerald-950 text-xs">{easy.accountTitle}</strong>
                    </div>

                    <div>
                      <span className="text-[#26312B]/65 block text-[10px] uppercase font-semibold">Easypaisa Mobile Number:</span>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-sm text-emerald-950 font-bold">{easy.mobileNumber}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy(easy.mobileNumber, 'ep-num')}
                          className="px-2 py-0.5 text-[10px] bg-white border border-emerald-300 rounded font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === 'ep-num' ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'ep-num' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {easy.instructions && (
                    <div className="pt-2 border-t border-emerald-200/50 text-[11px] text-emerald-950 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-emerald-800 shrink-0 mt-0.5" />
                      <span>{easy.instructions}</span>
                    </div>
                  )}

                  {/* TID / Sender Input */}
                  <div className="pt-2 border-t border-emerald-200/60">
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      {isUrdu ? 'ایزی پیسہ ٹرانزیکشن آئی ڈی (TID) یا بھیجنے والے کا فون نمبر:' : 'Easypaisa TID / Sender Mobile Number *'}
                    </label>
                    <input
                      type="text"
                      required={method === 'easypaisa'}
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder={isUrdu ? 'ایزی پیسہ TID یا بھیجنے والے کا موبائل نمبر' : 'Enter Easypaisa TID or Sender Mobile Number'}
                      className="w-full px-3 py-2 text-xs border border-emerald-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Customer Inputs */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#26312B] mb-1">
                    {isUrdu ? 'مکمل نام *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isUrdu ? 'مثلاً: طارق فاروق' : 'e.g. Tariq Farooq'}
                    className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#26312B] mb-1">
                    {isUrdu ? 'فون / موبائل نمبر *' : 'Phone / Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={isUrdu ? 'موبائل فون نمبر درج کریں' : 'Enter phone / mobile number'}
                    className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#26312B] mb-1">
                    {isUrdu ? 'شہر / بستی *' : 'City / Town *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={isUrdu ? 'مثلاً: لاہور، کراچی، گوجرانوالہ، اسلام آباد' : 'e.g. Lahore, Karachi, Islamabad'}
                    className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#26312B] mb-1">
                    {isUrdu ? 'ای میل ایڈریس (اختیاری)' : 'Email Address (Optional)'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#26312B] mb-1">
                  {isUrdu ? 'مکمل پتہ برائے ترسیل *' : 'Complete Delivery Address *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={
                    isUrdu
                      ? 'مکان نمبر، گلی، محلہ، نزد معروف جگہ یا لینڈ مارک'
                      : 'House / Flat No., Street, Sector / Area, Landmark'
                  }
                  className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#26312B] mb-1">
                  {isUrdu ? 'کوئی خصوصی ہدایت یا نوٹ (اختیاری)' : 'Special Delivery Instructions (Optional)'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isUrdu ? 'مثلاً: پہنچنے پر کال فرمائیں' : 'e.g. Call upon arrival / Leave with security'}
                  className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32]"
                />
              </div>
            </div>

            {submitError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                <p className="font-semibold">{submitError}</p>
              </div>
            )}

            {/* General payment note */}
            {paymentSettings?.generalInstructions && (
              <div className="p-3 bg-[#FAF9F3] border border-[#AFC7A5]/30 rounded-xl text-[11px] text-[#26312B]/75 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#183F32] shrink-0 mt-0.5" />
                <span>{paymentSettings.generalInstructions}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-[#26312B]/70">
                <ShieldCheck className="w-4 h-4 text-[#183F32]" />
                <span>{isUrdu ? 'فارابی دواخانہ کی خالص امانت و تحفظ' : 'Protected by Farabi Apothecary Care'}</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-3 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <span>
                  {submitting
                    ? isUrdu
                      ? 'آرڈر محفوظ ہو رہا ہے...'
                      : 'Placing Order...'
                    : method === 'cod'
                    ? isUrdu
                      ? 'آرڈر کنفرم کریں (کیش آن ڈیلیوری)'
                      : 'Confirm Order (COD)'
                    : method === 'bank'
                    ? isUrdu
                      ? 'بینک ٹرانسفر کے ساتھ آرڈر مکمل کریں'
                      : 'Submit Order (Bank Transfer)'
                    : method === 'jazzcash'
                    ? isUrdu
                      ? 'جاز کیش کے ساتھ آرڈر مکمل کریں'
                      : 'Submit Order (JazzCash)'
                    : isUrdu
                    ? 'ایزی پیسہ کے ساتھ آرڈر مکمل کریں'
                    : 'Submit Order (Easypaisa)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
