import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { ConfirmDialog } from './ConfirmDialog';
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
  Filter,
} from 'lucide-react';

interface AdminOrdersProps {
  onNotify: (msg: string) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ onNotify }) => {
  const { orders, updateOrderStatus, deleteOrder, refreshOrders } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

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

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      onNotify(`Order ${orderId} updated to ${status}`);
    } catch {
      onNotify('Failed to update order status');
    }
  };

  const handleConfirmCloseOrder = async () => {
    if (!orderToDelete) return;
    try {
      await deleteOrder(orderToDelete.id);
      onNotify(`Order ${orderToDelete.id} closed and removed.`);
    } catch {
      onNotify('Failed to remove order');
    } finally {
      setOrderToDelete(null);
    }
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
  const getCustomerWhatsAppUrl = (order: Order) => {
    const phoneClean = order.customerPhone.replace(/[^0-9]/g, '');
    const intlPhone = phoneClean.startsWith('0') ? `92${phoneClean.slice(1)}` : phoneClean;
    const msg = `Salam ${order.customerName}, your FARAABEE Apothecary order (${order.id}) status is now: ${order.status.toUpperCase()}. Total: Rs. ${order.total.toLocaleString()}. You can track your order anytime online or reply here. Thank you!`;
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
            Review live apothecary orders, change status (shipped, delivered), notify customers, or close orders.
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
              {/* Little Cross (X) Button to Close/Remove Order with tooltip */}
              <button
                type="button"
                onClick={() => setOrderToDelete(order)}
                title="Close / Delete this order"
                aria-label={`Close order ${order.id}`}
                className="absolute top-3.5 right-3.5 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Order Info & Customer Details */}
              <div className="space-y-3 flex-1 pr-6 md:pr-0">
                <div className="flex flex-wrap items-center gap-3">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#26312B]/50 block text-[10px] uppercase font-bold">
                      Customer
                    </span>
                    <span className="font-semibold text-sm text-[#183F32] block">{order.customerName}</span>
                    {order.customerEmail && (
                      <span className="block text-[#26312B]/70">{order.customerEmail}</span>
                    )}
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[#183F32] font-medium flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {order.customerPhone}
                      </span>
                      {/* WhatsApp Notify Customer Button */}
                      <a
                        href={getCustomerWhatsAppUrl(order)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 font-bold text-[11px] rounded-md transition-colors"
                        title="Notify customer of this status update via WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Send WhatsApp Update</span>
                      </a>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#26312B]/50 block text-[10px] uppercase font-bold">
                      Shipping Address
                    </span>
                    <span className="text-[#26312B]/80 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#183F32] shrink-0 mt-0.5" />
                      <span>
                        {order.shippingAddress}
                        {order.city ? `, ${order.city}` : ''}
                      </span>
                    </span>
                    {order.notes && (
                      <p className="mt-1 text-[11px] italic text-[#26312B]/60">
                        Note: &quot;{order.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="pt-3 border-t border-[#AFC7A5]/20">
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
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 border-t md:border-t-0 md:border-l border-[#AFC7A5]/20 pt-3 md:pt-0 md:pl-6 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase font-bold text-[#26312B]/50 block">
                    Total Amount
                  </span>
                  <span className="text-xl font-serif font-bold text-[#183F32]">
                    Rs. {order.total.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-800 block font-medium">Cash on Delivery</span>
                </div>

                <div className="w-44 space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#183F32] block">
                    Change Order Status
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                    className="w-full px-2.5 py-1.5 text-xs border border-[#AFC7A5]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#183F32] bg-white cursor-pointer font-semibold text-[#183F32]"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <span className="text-[10px] text-[#26312B]/50 block">
                    Customer can see this status immediately on Track Order page.
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog to Close / Delete Order */}
      <ConfirmDialog
        isOpen={!!orderToDelete}
        title="Close & Delete Order"
        message={`Are you sure you want to close and permanently remove order "${orderToDelete?.id}" for ${orderToDelete?.customerName}? This will remove it from the orders desk.`}
        confirmLabel="Close Order"
        isDestructive={true}
        onConfirm={handleConfirmCloseOrder}
        onCancel={() => setOrderToDelete(null)}
      />
    </div>
  );
};
