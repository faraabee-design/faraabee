import React, { useState } from 'react';
import { CartItem } from '../types';
import { siteConfig } from '../config/siteConfig';
import { useStore } from '../context/StoreContext';
import { X, CheckCircle, MessageCircle, Truck, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

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
  const { createOrder } = useStore();
  const [method, setMethod] = useState<'cod' | 'whatsapp' | 'bank'>('cod');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (acc, item) =>
      acc + (item.product.salePrice && item.product.salePrice < item.product.price ? item.product.salePrice : item.product.price) * item.quantity,
    0
  );
  const shipping = subtotal >= siteConfig.currency.freeShippingThreshold ? 0 : siteConfig.currency.standardShippingFee;
  const grandTotal = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const orderItems = items.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      price: i.product.salePrice && i.product.salePrice < i.product.price ? i.product.salePrice : i.product.price,
      quantity: i.quantity,
      image: i.product.image || '',
    }));

    try {
      // Save order to Firestore with strictly sanitized fields
      const newOrderId = await createOrder({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        shippingAddress: address.trim(),
        city: city.trim() || 'Pakistan',
        notes: notes.trim(),
        items: orderItems,
        total: grandTotal,
        status: 'pending',
      });

      if (!newOrderId) {
        throw new Error('Order could not be saved to server.');
      }

      setOrderRef(newOrderId);

      // Save order to localStorage so the customer can easily track on their phone
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
            createdAt: new Date().toISOString(),
          },
          ...recent.filter((r: any) => r.id !== newOrderId),
        ].slice(0, 10);
        localStorage.setItem('faraabee_recent_orders', JSON.stringify(updated));
      } catch (storageErr) {
        console.warn('Could not cache recent order:', storageErr);
      }

      if (method === 'whatsapp') {
        const itemsList = items
          .map((i) => `• ${i.product.name} (${i.product.volume || '1 Unit'}) x ${i.quantity} = ${siteConfig.currency.symbol} ${(i.product.price * i.quantity).toLocaleString()}`)
          .join('%0A');
        const message = `Salam FARAABEE Herbal,%0A%0AI would like to place an order:%0A${itemsList}%0A%0ASubtotal: ${siteConfig.currency.symbol} ${subtotal.toLocaleString()}%0AShipping: ${shipping === 0 ? 'Free' : `${siteConfig.currency.symbol} ${shipping}`}%0ATotal: ${siteConfig.currency.symbol} ${grandTotal.toLocaleString()}%0A%0AOrder Ref: ${newOrderId}%0ACustomer Name: ${name}%0APhone: ${phone}%0ACity: ${city}%0AAddress: ${address}%0ANotes: ${notes || 'None'}`;
        window.open(`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${message}`, '_blank');
      }

      setOrderSubmitted(true);
      onOrderSuccess();
    } catch (err: unknown) {
      console.error('Error placing order to Firestore:', err);
      const msg = err instanceof Error ? err.message : 'Connection error';
      setSubmitError(
        'Unable to complete order registration with the live server. Please verify your connection or click below to order directly via WhatsApp.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#183F32]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-[#AFC7A5]/40 my-8">
        {/* Header */}
        <div className="p-6 bg-[#FAF9F3] border-b border-[#AFC7A5]/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#285844] font-semibold">
              FARAABEE APOTHECARY ORDER DESK
            </span>
            <h3 className="font-serif text-2xl font-medium text-[#183F32] mt-0.5">
              {orderSubmitted ? 'Order Confirmed' : 'Complete Your Order'}
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

            <h4 className="font-serif text-2xl text-[#183F32]">Thank You, {name}</h4>

            <p className="text-sm text-[#26312B]/80 max-w-md mx-auto leading-relaxed">
              Your herbal formulation order has been received by the FARAABEE Apothecary. Our customer care team will contact you on <strong>{phone}</strong> to confirm dispatch.
            </p>

            <div className="p-4 bg-[#FAF9F3] rounded-xl border border-[#AFC7A5]/30 max-w-sm mx-auto text-left space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#26312B]/60">Order Reference:</span>
                <span className="font-mono font-bold text-[#183F32]">{orderRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#26312B]/60">Payment Method:</span>
                <span className="font-semibold text-[#183F32]">
                  {method === 'cod' ? 'Cash on Delivery (COD)' : method === 'whatsapp' ? 'WhatsApp Order' : 'Bank Transfer'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#26312B]/60">Total Payable:</span>
                <span className="font-bold text-[#183F32]">
                  {siteConfig.currency.symbol} {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => {
                  window.location.hash = `track-order/${orderRef}`;
                  onClose();
                }}
                className="px-6 py-2.5 bg-[#183F32] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#285844] transition-colors cursor-pointer"
              >
                Track This Order Live
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#FAF9F3] text-[#183F32] border border-[#AFC7A5]/50 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#E8F1DF] transition-colors cursor-pointer"
              >
                Return to Store
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Items Summary Pills */}
            <div className="p-4 bg-[#FAF9F3] rounded-xl border border-[#AFC7A5]/30 space-y-2">
              <div className="flex justify-between text-xs text-[#26312B]/75">
                <span>Selected Formulations ({items.reduce((acc, i) => acc + i.quantity, 0)} items):</span>
                <span>{siteConfig.currency.symbol} {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-[#26312B]/75">
                <span>Domestic Delivery:</span>
                <span>{shipping === 0 ? <strong className="text-emerald-800">FREE</strong> : `${siteConfig.currency.symbol} ${shipping}`}</span>
              </div>
              <div className="pt-2 border-t border-[#AFC7A5]/25 flex justify-between text-sm font-semibold text-[#183F32]">
                <span>Total Amount:</span>
                <span>{siteConfig.currency.symbol} {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#183F32]">
                Select Fulfillment & Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod('cod')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    method === 'cod'
                      ? 'border-[#183F32] bg-[#E8F1DF]/40 ring-1 ring-[#183F32]'
                      : 'border-[#AFC7A5]/40 hover:bg-[#FAF9F3]'
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#285844] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-[#183F32]">Cash on Delivery (COD)</span>
                    <span className="block text-[11px] text-[#26312B]/70 mt-0.5">Pay upon package arrival across Pakistan</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('whatsapp')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    method === 'whatsapp'
                      ? 'border-[#183F32] bg-[#E8F1DF]/40 ring-1 ring-[#183F32]'
                      : 'border-[#AFC7A5]/40 hover:bg-[#FAF9F3]'
                  }`}
                >
                  <MessageCircle className="w-5 h-5 text-[#285844] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-[#183F32]">Instant WhatsApp Order</span>
                    <span className="block text-[11px] text-[#26312B]/70 mt-0.5">Direct concierge assistance via WhatsApp</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#26312B] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tariq Farooq"
                    className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#183F32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#26312B] mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#183F32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#26312B] mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lahore, Karachi, Islamabad"
                    className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#183F32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#26312B] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#183F32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#26312B] mb-1">
                  Complete Delivery Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Flat No., Street, Sector / Area, Landmark"
                  className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#183F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#26312B] mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Leave with security / Call upon arrival"
                  className="w-full px-3 py-2 text-xs border border-[#AFC7A5]/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#183F32]"
                />
              </div>
            </div>

            {submitError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-2">
                <p className="font-semibold">{submitError}</p>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
                      `Salam FARAABEE, I would like to place an order directly for ${name} (${phone}), Address: ${address}, Total: Rs. ${grandTotal}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white font-bold rounded-lg text-xs hover:bg-[#128C7E]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send Order via WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-[#26312B]/70">
                <ShieldCheck className="w-4 h-4 text-[#183F32]" />
                <span>Protected by Farabi Apothecary Care</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-3 bg-[#183F32] hover:bg-[#285844] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <span>{submitting ? 'Placing Order...' : method === 'whatsapp' ? 'Send WhatsApp Order' : 'Confirm Order (COD)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
