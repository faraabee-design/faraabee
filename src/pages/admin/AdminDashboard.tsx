import React, { useState } from 'react';
import { useAuth } from '../../context/FirebaseContext';
import { useStore } from '../../context/StoreContext';
import { FarabiLogo } from '../../components/FarabiLogo';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminPromotions } from './AdminPromotions';
import { AdminOrders } from './AdminOrders';
import { AdminSocialsSettings } from './AdminSocialsSettings';
import { AdminThemeCustomizer } from './AdminThemeCustomizer';
import { AdminContentEditor } from './AdminContentEditor';
import { AdminSpiritual } from './AdminSpiritual';
import { AdminSecurity } from './AdminSecurity';
import { AdminStoreSettings } from './AdminStoreSettings';
import { AdminBundles } from './AdminBundles';
import { AdminReviews } from './AdminReviews';
import { AdminFeatures } from './AdminFeatures';
import { AdminGamification } from './AdminGamification';
import { AdminDeveloperSignature } from './AdminDeveloperSignature';
import { AdminAppointments } from './AdminAppointments';
import { AdminLegalPolicies } from './AdminLegalPolicies';
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  ShoppingBag,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sliders,
  Share2,
  Palette,
  FileText,
  Sparkles,
  ShieldAlert,
  Boxes,
  Star,
  BookOpen,
  Gift,
  PenTool,
  CalendarCheck,
  ShieldCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onPreviewProduct?: (slug: string) => void;
}

type TabType =
  | 'overview'
  | 'products'
  | 'bundles'
  | 'categories'
  | 'reviews'
  | 'spiritual'
  | 'appointments'
  | 'features'
  | 'theme'
  | 'content'
  | 'promotions'
  | 'orders'
  | 'security'
  | 'legal'
  | 'socials'
  | 'gamification'
  | 'attribution'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore, onPreviewProduct }) => {
  const { currentUser, logout } = useAuth();
  const { orders, appointments } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pendingAppointmentsCount = appointments.filter((a) => a.status === 'pending').length;

  // Settings state (simple persistent preferences)
  const [storeCurrency, setStoreCurrency] = useState('PKR');
  const [supportPhone, setSupportPhone] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('Standard delivery across Pakistan takes 2-4 business days.');

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const navItems = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'products' as TabType, label: 'Products', icon: Package },
    { id: 'bundles' as TabType, label: 'Care Bundles', icon: Boxes },
    { id: 'categories' as TabType, label: 'Categories', icon: Layers },
    { id: 'reviews' as TabType, label: 'Customer Reviews', icon: Star },
    { id: 'spiritual' as TabType, label: 'Spiritual Sanctuary', icon: Sparkles },
    { id: 'appointments' as TabType, label: 'Appointments & Timeline', icon: CalendarCheck },
    { id: 'features' as TabType, label: 'Wisdom & Audio', icon: BookOpen },
    { id: 'theme' as TabType, label: 'Colors & Styling', icon: Palette },
    { id: 'content' as TabType, label: 'Live Text & Copy', icon: FileText },
    { id: 'promotions' as TabType, label: 'Promotions', icon: Tag },
    { id: 'orders' as TabType, label: 'Orders', icon: ShoppingBag },
    { id: 'security' as TabType, label: 'Security & Lockouts', icon: ShieldAlert },
    { id: 'legal' as TabType, label: 'Legal & Consent Popup', icon: ShieldCheck },
    { id: 'socials' as TabType, label: 'Socials & Contact', icon: Share2 },
    { id: 'attribution' as TabType, label: 'Creator Signature', icon: PenTool },
    { id: 'gamification' as TabType, label: 'Wheel & Bargain', icon: Gift },
    { id: 'settings' as TabType, label: 'Store Settings', icon: Sliders },
  ];

  const handleExitToStore = async () => {
    await logout();
    onBackToStore();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F3] flex flex-col md:flex-row text-[#26312B]">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-[#AFC7A5]/30 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <FarabiLogo variant="dark" size="sm" />
          <span className="text-xs font-serif font-bold text-[#183F32] bg-[#E3EBDD] px-2 py-0.5 rounded-md uppercase tracking-wider">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#26312B] hover:text-[#183F32] rounded-lg cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-[#AFC7A5]/30 flex flex-col justify-between z-40 transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between pb-6 border-b border-[#AFC7A5]/20">
            <button
              onClick={handleExitToStore}
              className="text-left group cursor-pointer"
              title="Return to Store"
            >
              <FarabiLogo variant="dark" size="md" />
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#183F32]/70 group-hover:text-[#183F32]">
                Admin Console
              </p>
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 text-[#26312B]/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#183F32] text-white shadow-xs'
                      : 'text-[#26312B]/80 hover:bg-[#E3EBDD]/40 hover:text-[#183F32]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'orders' && orders.length > 0 && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#E3EBDD] text-[#183F32]'
                      }`}
                    >
                      {orders.length}
                    </span>
                  )}
                  {item.id === 'appointments' && pendingAppointmentsCount > 0 && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive ? 'bg-amber-400 text-[#183F32]' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {pendingAppointmentsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#AFC7A5]/20 bg-[#FAF9F3]/60 space-y-2">
          <div className="px-2 py-1">
            <p className="text-[10px] uppercase font-bold text-[#26312B]/40">Signed in as</p>
            <p className="text-xs font-semibold text-[#183F32] truncate">
              {currentUser?.email || 'Administrator'}
            </p>
          </div>

          <button
            onClick={handleExitToStore}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#183F32] hover:bg-[#E3EBDD]/40 rounded-xl transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Store</span>
            </span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
        {/* Top Header Bar for Desktop */}
        <header className="hidden md:flex items-center justify-between pb-6 mb-6 border-b border-[#AFC7A5]/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#183F32]/60">
                FARABI Botanical Apothecary
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Single Active Device Secured</span>
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#183F32] capitalize">
              {activeTab} Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExitToStore}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#183F32] bg-white border border-[#AFC7A5]/40 rounded-xl hover:bg-[#FAF9F3] transition-colors cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Store</span>
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-700 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Tab Views */}
        {activeTab === 'overview' && (
          <AdminOverview onSwitchTab={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'products' && (
          <AdminProducts
            onNotify={showNotification}
            onPreviewProduct={(slug) => {
              if (onPreviewProduct) {
                onPreviewProduct(slug);
              } else {
                onBackToStore();
              }
            }}
          />
        )}

        {activeTab === 'bundles' && (
          <AdminBundles onNotify={showNotification} />
        )}

        {activeTab === 'categories' && (
          <AdminCategories onNotify={showNotification} />
        )}

        {activeTab === 'reviews' && (
          <AdminReviews onNotify={showNotification} />
        )}

        {activeTab === 'spiritual' && (
          <AdminSpiritual onNotify={showNotification} />
        )}

        {activeTab === 'appointments' && (
          <AdminAppointments onNotify={showNotification} />
        )}

        {activeTab === 'features' && (
          <AdminFeatures onNotify={showNotification} />
        )}

        {activeTab === 'theme' && (
          <AdminThemeCustomizer onNotify={showNotification} />
        )}

        {activeTab === 'content' && (
          <AdminContentEditor onNotify={showNotification} />
        )}

        {activeTab === 'promotions' && (
          <AdminPromotions onNotify={showNotification} />
        )}

        {activeTab === 'orders' && (
          <AdminOrders onNotify={showNotification} />
        )}

        {activeTab === 'security' && (
          <AdminSecurity onNotify={showNotification} />
        )}

        {activeTab === 'legal' && (
          <AdminLegalPolicies onNotify={showNotification} />
        )}

        {activeTab === 'socials' && (
          <AdminSocialsSettings onNotify={showNotification} />
        )}

        {activeTab === 'attribution' && (
          <AdminDeveloperSignature />
        )}

        {activeTab === 'gamification' && (
          <AdminGamification onNotify={showNotification} />
        )}

        {activeTab === 'settings' && (
          <AdminStoreSettings onNotify={showNotification} />
        )}
      </main>

      {/* Global Success Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#183F32] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-[#AFC7A5]/30 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#AFC7A5] animate-pulse" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
