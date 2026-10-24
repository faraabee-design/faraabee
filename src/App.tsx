import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/FirebaseContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { CustomizationProvider, useCustomization } from './context/CustomizationContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ArticleModal } from './components/ArticleModal';
import { AudioSanctuaryPlayer } from './components/AudioSanctuaryPlayer';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { JournalPage } from './pages/JournalPage';
import { AboutHerbalPage } from './pages/AboutHerbalPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { SpiritualPage } from './pages/SpiritualPage';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLogin } from './pages/admin/AdminLogin';

import { articles } from './data/journal';
import { Product, CartItem, Article, PageId } from './types';

function MainApp() {
  const { products, loading } = useStore();
  const { isAdmin, isAuthReady, logout } = useAuth();
  const { theme } = useCustomization();

  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [trackingOrderRef, setTrackingOrderRef] = useState<string>('');

  // Cart state with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('farabi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('farabi_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Unable to persist cart', e);
    }
  }, [cartItems]);

  // Sync hash and path routing
  useEffect(() => {
    const handleRouting = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '');

      if (path === '/admin' || hash === 'admin') {
        setCurrentPage('admin');
        return;
      }

      if (hash.startsWith('product/')) {
        const slug = hash.replace('product/', '');
        setSelectedProductSlug(slug);
        setCurrentPage('product-detail');
        return;
      }

      if (hash.startsWith('track-order')) {
        const orderIdParam = hash.replace('track-order/', '').replace('track-order', '');
        if (orderIdParam) {
          setTrackingOrderRef(orderIdParam);
        }
        setCurrentPage('track-order');
        return;
      }

      if (
        [
          'home',
          'about',
          'products',
          'journal',
          'about-herbal',
          'spiritual',
          'contact',
          'track-order',
          'privacy',
          'terms',
          'admin',
        ].includes(hash)
      ) {
        setCurrentPage(hash as PageId);
      }
    };

    window.addEventListener('hashchange', handleRouting);
    handleRouting();
    return () => window.removeEventListener('hashchange', handleRouting);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleNavigate = (page: PageId, slug?: string) => {
    setCurrentPage(page);
    if (slug) {
      setSelectedProductSlug(slug);
      window.location.hash = `product/${slug}`;
    } else {
      window.location.hash = page === 'home' ? '' : page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to Botanical Bag`);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Find product from live dynamic products list
  const currentProduct = selectedProductSlug
    ? products.find((p) => p.slug === selectedProductSlug) || products[0]
    : products[0];

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // If on Admin page, render dedicated Admin experience
  if (currentPage === 'admin') {
    if (!isAuthReady) {
      return (
        <div className="min-h-screen bg-[#FAF9F3] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#183F32] border-t-transparent animate-spin" />
        </div>
      );
    }
    if (isAdmin) {
      return (
        <AdminDashboard
          onBackToStore={async () => {
            await logout();
            handleNavigate('home');
          }}
          onPreviewProduct={(slug) => handleNavigate('product-detail', slug)}
        />
      );
    }
    return <AdminLogin onBackToStore={() => handleNavigate('home')} />;
  }

  return (
    <div
      className="flex flex-col min-h-screen transition-colors"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      {/* Top Header */}
      <Header
        currentPage={currentPage}
        onNavigate={(page) => handleNavigate(page)}
        cartCount={cartCount}
        onOpenCart={() => setCartDrawerOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            products={products}
            articles={articles}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onSelectArticle={setSelectedArticle}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onExploreProducts={() => handleNavigate('products')}
            onContactClick={() => handleNavigate('contact')}
          />
        )}

        {currentPage === 'products' && (
          <ProductsPage
            products={products}
            onViewProduct={(slug) => handleNavigate('product-detail', slug)}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentPage === 'product-detail' && currentProduct && (
          <ProductDetailPage
            product={currentProduct}
            allProducts={products}
            onBack={() => handleNavigate('products')}
            onViewProduct={(slug) => handleNavigate('product-detail', slug)}
            onAddToCart={handleAddToCart}
            onDirectOrder={(product, qty) => {
              handleAddToCart(product, qty);
              setCheckoutModalOpen(true);
            }}
          />
        )}

        {currentPage === 'journal' && (
          <JournalPage
            articles={articles}
            onSelectArticle={setSelectedArticle}
          />
        )}

        {currentPage === 'about-herbal' && (
          <AboutHerbalPage
            onExploreProducts={() => handleNavigate('products')}
            onContactClick={() => handleNavigate('contact')}
          />
        )}

        {currentPage === 'spiritual' && (
          <SpiritualPage
            onExploreProducts={() => handleNavigate('products')}
            onNavigateProduct={(slug) => handleNavigate('product-detail', slug)}
          />
        )}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'track-order' && (
          <TrackOrderPage
            initialOrderRef={trackingOrderRef}
            onExploreProducts={() => handleNavigate('products')}
          />
        )}

        {currentPage === 'privacy' && <PrivacyPolicyPage />}

        {currentPage === 'terms' && <TermsPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={(page) => handleNavigate(page)} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setCartDrawerOpen(false);
          setCheckoutModalOpen(true);
        }}
        onNavigateToProducts={() => {
          setCartDrawerOpen(false);
          handleNavigate('products');
        }}
      />

      {/* Checkout / Order Confirmation Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        items={cartItems}
        onOrderSuccess={() => {
          setCartItems([]);
        }}
      />

      {/* Full Editorial Article Modal */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Audio Sanctuary Quranic & Ruqyah Player */}
      <AudioSanctuaryPlayer />

      {/* Quiet Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#183F32] text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-[#AFC7A5]/30 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#AFC7A5]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CustomizationProvider>
          <MainApp />
        </CustomizationProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
