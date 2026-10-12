import React, { useState, useEffect } from 'react';
import { FarabiLogo } from './FarabiLogo';
import { PageId } from '../types';
import { ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { useCustomization, DynamicText } from '../context/CustomizationContext';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId, slug?: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  onOpenCart,
}) => {
  const { theme } = useCustomization();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; page: PageId }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Products', page: 'products' },
    { label: 'Herbal Journal', page: 'journal' },
    { label: 'Track Order', page: 'track-order' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Customizable Announcement Ribbon */}
      <div
        className="w-full py-2 px-4 text-center text-xs transition-colors"
        style={{
          backgroundColor: theme.bannerBgColor,
          color: theme.bannerTextColor,
        }}
      >
        <DynamicText id="announcementText" />
      </div>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'shadow-xs border-b border-[#AFC7A5]/30 py-3.5'
            : 'border-b border-[#AFC7A5]/20 py-4 lg:py-5'
        }`}
        style={{
          backgroundColor: theme.headerBgColor,
          color: theme.headerTextColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Zone 1: Logo Wordmark */}
            <button
              onClick={() => handleNavClick('home')}
              className="focus-visible:outline-2 focus-visible:outline-[#183F32] rounded-md text-left transition-opacity hover:opacity-90 cursor-pointer"
              aria-label="FARAABEE Home"
            >
              <FarabiLogo variant="dark" />
            </button>

            {/* Zone 2: Navigation Links (Desktop) */}
            <nav
              className="hidden lg:flex items-center gap-7 xl:gap-8"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => {
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => handleNavClick(link.page)}
                    className="relative py-1 text-sm font-medium transition-colors cursor-pointer hover:opacity-80"
                    style={{
                      color: theme.headerTextColor,
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Actions (Cart & CTA) */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Shopping Bag Trigger */}
              <button
                onClick={onOpenCart}
                className="relative p-2.5 rounded-full transition-colors cursor-pointer hover:opacity-80"
                style={{ color: theme.headerTextColor }}
                aria-label={`Shopping bag with ${cartCount} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    className="absolute top-1 right-1 flex items-center justify-center min-w-4.5 h-4.5 px-1 text-[11px] font-bold rounded-full tabular-nums"
                    style={{
                      backgroundColor: theme.buttonBgColor,
                      color: theme.buttonTextColor,
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Desktop CTA */}
              <button
                onClick={() => handleNavClick('products')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-2xs hover:opacity-90"
                style={{
                  backgroundColor: theme.buttonBgColor,
                  color: theme.buttonTextColor,
                }}
              >
                <span>Shop Remedies</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 lg:hidden rounded-lg transition-colors cursor-pointer"
                style={{ color: theme.headerTextColor }}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-x-0 top-[73px] z-30 border-b border-[#AFC7A5]/30 shadow-lg px-6 py-6 animate-fade-in"
          style={{
            backgroundColor: theme.headerBgColor,
            color: theme.headerTextColor,
          }}
        >
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className="flex items-center justify-between py-2 text-base text-left font-medium transition-colors cursor-pointer"
                  style={{
                    color: theme.headerTextColor,
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primaryColor }} />}
                </button>
              );
            })}
            <div className="pt-4 border-t border-black/10">
              <button
                onClick={() => handleNavClick('products')}
                className="w-full py-3 text-center text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-xs"
                style={{
                  backgroundColor: theme.buttonBgColor,
                  color: theme.buttonTextColor,
                }}
              >
                Shop All Remedies
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
