import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import {
  ShoppingBag,
  Phone,
  MapPin,
  Calendar,
  X,
  RefreshCw,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Trash2,
  Search,
  Copy,
  AlertCircle,
  Truck,
  Check,
} from 'lucide-react';

interface AdminOrdersProps {
  onNotify: (msg: string) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ onNotify }) => {
  const { orders, updateOrderStatus, deleteOrder, refreshOrders } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [orderToClose, setOrderToClose] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Synchronize on mount to ensure phone-placed orders appear immediately on desktop
  useEffect(() => {
    refreshOrders().catch((err) => console.warn('Could not sync orders on mount:', err));
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshOrders();
      onNotify('Orders synchronized with live database');
    } catch {
      onNotify('Failed to refresh orders');
    } finally {
      setRefreshing(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filterStatus === 'all' || o.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.toLowerCase().includes(q) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(q)) ||
      (o.city && o.city.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = async (order: Order, status: Order['status']) => {
    try {
      await updateOrderStatus(order.id, status);
      onNotify(`Order ${order.id} marked as ${status.toUpperCase()}. Customer live tracking updated!`);

      // If marked as shipped or delivered, provide prompt / auto-open WhatsApp link for customer
      if (status === 'shipped' || status === 'delivered') {
        const trackingLink = `${window.location.origin}/#track-order/${order.id}`;
        const actionText = status === 'shipped' ? 'SHIPPED via courier' : 'DELIVERED';
        const msg = `Salam ${order.customerName}, your FARAABEE Apothecary order (${order.id}) has been ${actionText}! Total: Rs. ${order.total.toLocaleString()}. Track live here: ${trackingLink}. Thank you!`;
        const phoneClean = order.customerPhone.replace(/[^0-9]/g, '');
        const intlPhone = phoneClean.startsWith('0') ? `92${phoneClean.slice(1)}` : phoneClean;
        const waUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`;
        
        // Open WhatsApp notification tab
        window.open(waUrl, '_blank');
      }
    } catch {
      onNotify('Failed to update order status');
    }
  };

  const handleMarkCompleted = async () => {
    if (!orderToClose) return;
    try {
      await updateOrderStatus(orderToClose.id, 'completed');
      onNotify(`Order ${orderToClose.id} marked as Completed & Closed.`);
    } catch {
      onNotify('Failed to close order');
    } finally {
      setOrderToClose(null);
    }
  };

  const handleDeletePermanently = async () => {
    if (!orderToClose) return;
    try {
      await deleteOrder(orderToClose.id);
      onNotify(`Order ${orderToClose.id} closed and permanently deleted.`);
    } catch {
      onNotify('Failed to delete order');
    } finally {
      setOrderToClose(null);
    }
  };

  const handleCopyTrackingLink = (orderId: string) => {
    const url = `${window.location.origin}/#track-order/${orderId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(orderId);
    onNotify(`Customer tracking link copied to clipboard`);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  // Build direct WhatsApp notification message for customer
  const getCustomerWhatsAppUrl = (order: Order, explicitStatus?: string) => {
    const phoneClean = order.customerPhone.replace(/[^0-9]/g, '');
    const intlPhone = phoneClean.startsWith('0') ? `92${phoneClean.slice(1)}` : phoneClean;
    const currentStatus = (explicitStatus || order.status).toUpperCase();
    const trackingLink = `${window.location.origin}/#track-order/${order.id}`;
    const msg = `Salam ${order.customerName}, your FARAABEE Apothecary order (${order.id}) status is now: ${currentStatus}. Total: Rs. ${order.total.toLocaleString()}. You can track live parcel progress here: ${trackingLink}. Thank you!`;
    return `https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-[#AFC7A5]/30">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-[#183F32]">Customer Orders</h2>
            <span className="px-2 py-0.5 bg-[#FAF9F3] text-[#183F32] border border-[#AFC7A5]/40 text-xs font-bold rounded-full">
              {orders.length} Total
            </span>
          </div>
          <p className="text-xs text-[#26312B]/70 mt-0.5">
            Review live orders, update statuses (shipped, delivered), notify customers via WhatsApp, or close orders with the cross (✕) button.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#26312B]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, ID..."
              className="pl-8 pr-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-[#FAF9F3]/30 w-44 sm:w-56"
            />
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white cursor-pointer font-medium"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Manual Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Sync latest orders from server"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF9F3] hover:bg-[#E8F1DF] text-[#183F32] text-xs font-semibold rounded-xl border border-[#AFC7A5]/40 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#AFC7A5]/40 text-[#26312B]/60 space-y-3">
          <ShoppingBag className="w-10 h-10 mx-auto text-[#183F32]/40" />
          <p className="font-semibold text-sm text-[#183F32]">No Orders Found</p>
          <p className="text-xs text-[#26312B]/60 max-w-sm mx-auto">
            {searchQuery || filterStatus !== 'all'
              ? 'No orders match your filter criteria. Try resetting the search or status filter.'
              : 'When customers place orders on your website or phone, they will appear here in real-time.'}
          </p>
          {(searchQuery || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
              }}
              className="px-4 py-1.5 bg-[#FAF9F3] text-xs font-bold text-[#183F32] rounded-lg border border-[#AFC7A5]/40 hover:bg-[#E8F1DF] cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="relative bg-white rounded-2xl p-5 border border-[#AFC7A5]/30 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-6 transition-all hover:border-[#183F32]/40 group"
            >
              {/* Little Cross (X) Button to Close/Remove Order */}
              <button
                type="button"
                onClick={() => setOrderToClose(order)}
                title="Close / Delete this order"
                aria-label={`Close order ${order.id}`}
                className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-2.5 py-1 text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 rounded-xl font-bold transition-all cursor-pointer shadow-2xs hover:scale-102"
              >
                <X className="w-4 h-4 text-red-600" />
                <span className="text-[11px]">Close Order</span>
              </button>

              {/* Order Info & Customer Details */}
              <div className="space-y-3 flex-1 pr-24 md:pr-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#183F32] bg-[#FAF9F3] px-2.5 py-1 rounded-lg border border-[#AFC7A5]/30">
                    {order.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-[11px] text-[#26312B]/50 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  {/* Customer Who Placed The Order */}
                  <div className="bg-[#FAF9F3]/60 p-3 rounded-xl border border-[#AFC7A5]/25 space-y-1.5">
                    <span className="text-[#26312B]/60 block text-[10px] uppercase font-bold tracking-wider">
                      Customer Who Placed Order
                    </span>
                    <span className="font-semibold text-sm text-[#183F32] block">
                      {order.customerName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#183F32] font-medium flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {order.customerPhone}
                      </span>
                    </div>
                    {order.customerEmail ? (
                      <span className="block text-[#26312B]/70 text-[11px]">{order.customerEmail}</span>
                    ) : (
                      <span className="block text-[#26312B]/40 italic text-[10px]">No email provided</span>
                    )}

                    {/* WhatsApp Notify Button & Tracking Link Copy */}
                    <div className="flex flex-wrap items-center gap-2 pt-1.5">
                      <a
                        href={getCustomerWhatsAppUrl(order)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-bold text-[11px] rounded-lg transition-colors border border-[#25D366]/30 cursor-pointer"
                        title="Send WhatsApp status notification to customer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Customer</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyTrackingLink(order.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#FAF9F3] text-[#183F32] font-semibold text-[11px] rounded-lg border border-[#AFC7A5]/40 transition-colors cursor-pointer"
                        title="Copy tracking link for customer"
                      >
                        {copiedId === order.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#26312B]/50" />
                            <span>Copy Track Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Delivery Destination */}
                  <div className="bg-[#FAF9F3]/60 p-3 rounded-xl border border-[#AFC7A5]/25 space-y-1.5">
                    <span className="text-[#26312B]/60 block text-[10px] uppercase font-bold tracking-wider">
                      Shipping Address & City
                    </span>
                    <span className="text-[#26312B]/85 flex items-start gap-1 font-medium leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-[#183F32] shrink-0 mt-0.5" />
                      <span>
                        {order.shippingAddress}
                        {order.city ? `, ${order.city}` : ''}
                      </span>
                    </span>
                    {order.notes && (
                      <div className="pt-1 border-t border-[#AFC7A5]/20">
                        <span className="text-[10px] font-bold text-[#26312B]/50 block">Customer Note:</span>
                        <p className="text-[11px] italic text-[#26312B]/70">&quot;{order.notes}&quot;</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="pt-2 border-t border-[#AFC7A5]/20">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#183F32] block mb-2">
                    Formulations Ordered:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-1.5 pr-3 bg-[#FAF9F3] rounded-xl border border-[#AFC7A5]/25 text-xs"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-7 h-7 rounded-lg object-cover bg-white"
                          />
                        )}
                        <span className="font-medium text-[#183F32]">{item.name}</span>
                        <span className="text-[#26312B]/60 text-[11px]">× {item.quantity}</span>
                        <span className="font-bold text-[#183F32] text-[11px]">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Amount, Status Selector & Close Action */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 border-t md:border-t-0 md:border-l border-[#AFC7A5]/20 pt-3 md:pt-0 md:pl-6 shrink-0 w-full md:w-52">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase font-bold text-[#26312B]/50 block">
                    Total Amount
                  </span>
                  <span className="text-xl font-serif font-bold text-[#183F32]">
                    Rs. {order.total.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-800 block font-medium">Cash on Delivery</span>
                </div>

                <div className="w-full space-y-2">
                  <label className="text-[10px] uppercase font-bold text-[#183F32] block">
                    Change Order Status
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value as Order['status'])}
                    className="w-full px-2.5 py-2 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white cursor-pointer font-bold text-[#183F32] shadow-2xs"
                  >
                    <option value="pending">🟡 Pending</option>
                    <option value="processing">🟣 Processing</option>
                    <option value="shipped">🔵 Shipped (Dispatched)</option>
                    <option value="delivered">🟢 Delivered</option>
                    <option value="completed">✅ Completed</option>
                    <option value="cancelled">🔴 Cancelled</option>
                  </select>

                  <div className="flex flex-col gap-1.5 pt-1">
                    {/* Quick Shipped/Delivered Alert Trigger */}
                    {order.status !== 'shipped' && order.status !== 'delivered' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(order, 'shipped')}
                        className="w-full px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold rounded-lg border border-blue-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Truck className="w-3 h-3" />
                        <span>Mark as Shipped & Notify</span>
                      </button>
                    )}

                    {order.status === 'shipped' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(order, 'delivered')}
                        className="w-full px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Mark Delivered & Notify</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Close Order Modal */}
      {orderToClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#AFC7A5]/30 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">
                  Close Order Action
                </span>
                <h3 className="text-lg font-serif font-bold text-[#183F32]">
                  Close Order #{orderToClose.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOrderToClose(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-[#FAF9F3] rounded-xl border border-[#AFC7A5]/30 text-xs space-y-1">
              <p><strong>Customer:</strong> {orderToClose.customerName} ({orderToClose.customerPhone})</p>
              <p><strong>Total:</strong> Rs. {orderToClose.total.toLocaleString()}</p>
              <p><strong>Current Status:</strong> {orderToClose.status.toUpperCase()}</p>
            </div>

            <p className="text-xs text-[#26312B]/75 leading-relaxed">
              How would you like to close this order? You can mark it as <strong>Completed</strong> (kept for records) or <strong>Permanently Delete</strong> it from the database.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-end pt-2">
              <button
                type="button"
                onClick={() => setOrderToClose(null)}
                className="px-4 py-2 text-xs font-semibold text-[#26312B] bg-[#FAF9F3] hover:bg-[#E3EBDD]/40 rounded-xl transition-colors cursor-pointer order-3 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMarkCompleted}
                className="px-4 py-2 text-xs font-bold text-white bg-[#183F32] hover:bg-[#285844] rounded-xl transition-colors cursor-pointer order-1 sm:order-2 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Completed & Close</span>
              </button>
              <button
                type="button"
                onClick={handleDeletePermanently}
                className="px-4 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer order-2 sm:order-3 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
