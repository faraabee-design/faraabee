import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order } from '../types';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, Phone, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface TrackOrderPageProps {
  initialOrderRef?: string;
  onExploreProducts: () => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ initialOrderRef, onExploreProducts }) => {
  const { socialLinks, contactInfo } = useStore();
  const [searchRef, setSearchRef] = useState(initialOrderRef || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-search if initialOrderRef is passed
  useEffect(() => {
    if (initialOrderRef) {
      setSearchRef(initialOrderRef);
      fetchOrder(initialOrderRef);
    }
  }, [initialOrderRef]);

  const fetchOrder = async (refToFind: string) => {
    const cleanId = refToFind.trim();
    if (!cleanId) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const docRef = doc(db, 'orders', cleanId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setOrder({
          id: snap.id,
          ...snap.data(),
        } as Order);
      } else {
        setOrder(null);
        setError(`No order found matching reference "${cleanId}". Please check the ID and try again.`);
      }
    } catch (err: unknown) {
      console.warn('Could not query order:', err);
      setOrder(null);
      setError('Could not retrieve order details. Please verify your internet connection or reach out on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchRef);
  };

  const getStepActiveIndex = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
      case 'completed':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const steps = [
    { title: 'Order Received', desc: 'Received at Apothecary' },
    { title: 'Formulation Prepared', desc: 'Packed & Quality Checked' },
    { title: 'Dispatched & In Transit', desc: 'Courier on the Way' },
    { title: 'Delivered', desc: 'Successfully Delivered' },
  ];

  const whatsappInquiryUrl = `https://wa.me/${contactInfo.whatsappNumber || '923091655743'}?text=Salam%20FARAABEE,%20I%20am%20inquiring%20about%20my%20order%20status%20for%20order%20ref:%20${order?.id || searchRef}`;

  return (
    <div className="min-h-screen bg-[#FAF9F3] py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#285844]">
            FARAABEE HERBAL LOGISTICS
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#183F32]">
            Track Your Formulation Order
          </h1>
          <p className="text-sm text-[#26312B]/70 max-w-md mx-auto">
            Check the live progress of your handcrafted botanical remedies from preparation to arrival.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#AFC7A5]/40 shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#26312B]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                placeholder="Enter Order ID (e.g. order-xxxxxx or FRB-xxxxxx)"
                className="w-full pl-11 pr-4 py-3 text-sm border border-[#AFC7A5]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-[#FAF9F3]/40"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchRef.trim()}
              className="px-6 py-3 bg-[#183F32] hover:bg-[#122F25] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50 cursor-pointer shrink-0"
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <p className="font-semibold">{error}</p>
              <p className="mt-1 text-amber-800">
                Need immediate help? Reach us directly on{' '}
                <a
                  href={`https://wa.me/${contactInfo.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-bold text-[#183F32]"
                >
                  WhatsApp ({contactInfo.whatsappDisplay || '+92 309 1655743'})
                </a>.
              </p>
            </div>
          </div>
        )}

        {/* Order Details Card */}
        {order && (
          <div className="bg-white rounded-2xl border border-[#AFC7A5]/40 shadow-md p-6 sm:p-8 space-y-8 animate-fade-in">
            {/* Top Bar with ID and Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#AFC7A5]/30">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#26312B]/50 block">Order Reference</span>
                <span className="font-mono text-lg font-bold text-[#183F32]">{order.id}</span>
                <span className="text-xs text-[#26312B]/60 block mt-0.5">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div>
                <span
                  className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    order.status === 'delivered' || order.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : order.status === 'shipped'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : order.status === 'cancelled'
                      ? 'bg-red-50 text-red-800 border-red-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  Status: {order.status}
                </span>
              </div>
            </div>

            {/* Visual Step Progress (If not cancelled) */}
            {order.status !== 'cancelled' ? (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#183F32]">
                  Live Dispatch Milestone
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {steps.map((st, idx) => {
                    const activeIdx = getStepActiveIndex(order.status);
                    const isPassed = idx <= activeIdx;
                    const isCurrent = idx === activeIdx;

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? 'bg-[#E8F1DF] border-[#183F32] ring-2 ring-[#183F32]/20'
                            : isPassed
                            ? 'bg-[#FAF9F3] border-emerald-200 text-[#183F32]'
                            : 'bg-gray-50/60 border-gray-200 text-gray-400 opacity-60'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                            isCurrent
                              ? 'bg-[#183F32] text-white'
                              : isPassed
                              ? 'bg-emerald-700 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {isPassed ? '✓' : idx + 1}
                        </div>
                        <h4 className="text-xs font-bold text-[#183F32]">{st.title}</h4>
                        <p className="text-[11px] text-[#26312B]/70 mt-0.5">{st.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs">
                This order has been marked as <strong>Cancelled</strong>. If you feel this is in error, please contact customer support.
              </div>
            )}

            {/* Destination & Recipient Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF9F3] rounded-xl border border-[#AFC7A5]/30 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#26312B]/60 block mb-1">
                  Recipient Information
                </span>
                <p className="font-semibold text-[#183F32]">{order.customerName}</p>
                <p className="text-[#26312B]/80 flex items-center gap-1.5 mt-1">
                  <Phone className="w-3.5 h-3.5 text-[#183F32]" />
                  <span>{order.customerPhone}</span>
                </p>
                {order.customerEmail && (
                  <p className="text-[#26312B]/70 mt-0.5">{order.customerEmail}</p>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-[#26312B]/60 block mb-1">
                  Delivery Destination
                </span>
                <p className="text-[#26312B]/80 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-[#183F32] shrink-0 mt-0.5" />
                  <span>
                    {order.shippingAddress}
                    {order.city ? `, ${order.city}` : ''}
                  </span>
                </p>
                {order.notes && (
                  <p className="italic text-[11px] text-[#26312B]/60 mt-2">
                    Note: &quot;{order.notes}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Items Ordered */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#183F32] mb-3">
                Items in This Package
              </h4>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-[#FAF9F3]/60 rounded-xl border border-[#AFC7A5]/20 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-white shrink-0"
                        />
                      )}
                      <div>
                        <span className="font-semibold text-[#183F32] block">{item.name}</span>
                        <span className="text-[11px] text-[#26312B]/60">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-[#183F32]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#AFC7A5]/30 flex justify-between items-center text-sm">
                <span className="font-semibold text-[#183F32]">Total Order Amount:</span>
                <span className="font-serif font-bold text-lg text-[#183F32]">
                  Rs. {order.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Concierge Assistance */}
            <div className="pt-4 border-t border-[#AFC7A5]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#26312B]/70">
                Have questions regarding delivery timing or delivery address updates?
              </p>
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20BA5C] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <span>WhatsApp Courier Desk</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Back To Store Link */}
        <div className="text-center pt-4">
          <button
            onClick={onExploreProducts}
            className="text-xs font-bold uppercase tracking-wider text-[#183F32] hover:underline cursor-pointer"
          >
            ← Continue Browsing Herbal Formulations
          </button>
        </div>
      </div>
    </div>
  );
};
