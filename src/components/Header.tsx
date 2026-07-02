import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Heart, ShoppingBag, User, Menu, X, Compass, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsCartOpen, 
    cart, 
    wishlist, 
    currentUser,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Scroll logic for transparent vs white background header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigateTo = (tab: 'home' | 'shop' | 'story' | 'consult' | 'account') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header 
        id="luxury-header"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#080808]/85 backdrop-blur-md border-b border-white/10 py-4 shadow-2xl shadow-black/40' 
            : 'bg-transparent border-b border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Left Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-10 text-[11px] tracking-[0.25em] font-medium text-[#F5F5F0]/60">
            <button 
              id="nav-shop"
              onClick={() => navigateTo('shop')}
              className={`hover:text-gold-400 transition-colors duration-300 relative py-1 ${activeTab === 'shop' ? 'text-gold-400' : ''}`}
            >
              SHOP
              {activeTab === 'shop' && (
                <motion.span layoutId="activeNavIndicator" className="absolute bottom-0 left-0 w-full h-[1px] bg-gold-400" />
              )}
            </button>
            <button 
              id="nav-story"
              onClick={() => navigateTo('story')}
              className={`hover:text-gold-400 transition-colors duration-300 relative py-1 ${activeTab === 'story' ? 'text-gold-400' : ''}`}
            >
              OUR STORY
              {activeTab === 'story' && (
                <motion.span layoutId="activeNavIndicator" className="absolute bottom-0 left-0 w-full h-[1px] bg-gold-400" />
              )}
            </button>
            <button 
              id="nav-consult"
              onClick={() => navigateTo('consult')}
              className={`hover:text-gold-400 transition-colors duration-300 relative py-1 ${activeTab === 'consult' ? 'text-gold-400' : ''}`}
            >
              STUDIO CONSULTATION
              {activeTab === 'consult' && (
                <motion.span layoutId="activeNavIndicator" className="absolute bottom-0 left-0 w-full h-[1px] bg-gold-400" />
              )}
            </button>
          </nav>

          {/* Mobile Menu Icon */}
          <button 
            id="mobile-menu-btn"
            className="lg:hidden text-[#F5F5F0]/80 hover:text-gold-400 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Center Brand Logo */}
          <div className="text-center">
            <button 
              id="brand-logo"
              onClick={() => navigateTo('home')}
              className="group flex flex-col items-center focus:outline-none"
            >
              <span className="font-serif text-2xl md:text-[28px] leading-none tracking-[0.2em] font-light text-[#F5F5F0] group-hover:text-gold-400 transition-colors duration-500">
                ISABELLA SOFIA
              </span>
              <span className="text-[7px] md:text-[8px] tracking-[0.5em] font-light text-gold-400 opacity-60 mt-1.5 group-hover:text-gold-400 transition-colors duration-500">
                FINE JEWELLERY
              </span>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 md:space-x-6 text-[#F5F5F0]/80">
            {/* Elegant Search Widget */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {showSearchInput && (
                  <motion.input
                    id="header-search-input"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 160, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    type="text"
                    placeholder="Search collection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#111111] border border-white/10 text-[#F5F5F0] rounded-none px-3 py-1 text-xs focus:outline-none focus:border-gold-400 mr-2 placeholder-white/30"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') navigateTo('shop');
                    }}
                  />
                )}
              </AnimatePresence>
              <button 
                id="header-search-btn"
                onClick={() => {
                  if (showSearchInput && searchQuery) {
                    navigateTo('shop');
                  } else {
                    setShowSearchInput(!showSearchInput);
                  }
                }}
                className="hover:text-gold-400 transition-colors p-1 focus:outline-none"
                aria-label="Search"
              >
                <Search className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              </button>
            </div>

            {/* Curated Wishlist */}
            <button 
              id="header-wishlist-btn"
              onClick={() => navigateTo('account')}
              className="relative p-1 hover:text-gold-400 transition-colors focus:outline-none"
              aria-label="Curated Wishlist"
            >
              <Heart className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold-400 text-[#080808] text-[8px] font-medium w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account / Portal */}
            <button 
              id="header-account-btn"
              onClick={() => navigateTo('account')}
              className={`p-1 hover:text-gold-400 transition-colors focus:outline-none relative ${
                activeTab === 'account' ? 'text-gold-400' : ''
              }`}
              aria-label="User Account"
            >
              <User className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              {currentUser && (
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-1 ring-[#080808]" />
              )}
            </button>

            {/* Shopping Bag Drawer Button */}
            <button 
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-1 hover:text-gold-400 transition-colors focus:outline-none"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  key={cartCount}
                  className="absolute -top-0.5 -right-0.5 bg-[#F5F5F0] text-[#080808] text-[8px] font-semibold w-3.5 h-3.5 flex items-center justify-center rounded-full"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            id="mobile-navigation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#080808] z-[100] flex flex-col justify-between px-8 py-10 border-l border-white/10"
          >
            <div>
              {/* Top Row */}
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <span className="font-serif text-xl tracking-[0.2em] text-[#F5F5F0]">
                  ISABELLA SOFIA
                </span>
                <button 
                  id="mobile-menu-close-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#F5F5F0]/80 hover:text-gold-400 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-8 mt-12 text-lg font-serif tracking-[0.1em] text-[#F5F5F0]/90">
                <button 
                  id="mobile-nav-home"
                  onClick={() => navigateTo('home')}
                  className="text-left py-2 border-b border-white/5 flex items-center justify-between hover:text-gold-400 transition-colors"
                >
                  <span>HOME</span>
                  <Compass className="w-4 h-4 text-gold-400/60" />
                </button>
                <button 
                  id="mobile-nav-shop"
                  onClick={() => navigateTo('shop')}
                  className="text-left py-2 border-b border-white/5 flex items-center justify-between hover:text-gold-400 transition-colors"
                >
                  <span>THE COLLECTION</span>
                  <ShoppingBag className="w-4 h-4 text-gold-400/60" />
                </button>
                <button 
                  id="mobile-nav-story"
                  onClick={() => navigateTo('story')}
                  className="text-left py-2 border-b border-white/5 flex items-center justify-between hover:text-gold-400 transition-colors"
                >
                  <span>OUR PHILOSOPHY</span>
                  <Award className="w-4 h-4 text-gold-400/60" />
                </button>
                <button 
                  id="mobile-nav-consult"
                  onClick={() => navigateTo('consult')}
                  className="text-left py-2 border-b border-white/5 flex items-center justify-between hover:text-gold-400 transition-colors"
                >
                  <span>BESPOKE CONSULTATION</span>
                  <Compass className="w-4 h-4 text-gold-400/60" />
                </button>
                <button 
                  id="mobile-nav-account"
                  onClick={() => navigateTo('account')}
                  className="text-left py-2 border-b border-white/5 flex items-center justify-between hover:text-gold-400 transition-colors"
                >
                  <span>{currentUser ? 'MY ACCOUNT' : 'SIGN IN / REGISTER'}</span>
                  <User className="w-4 h-4 text-gold-400/60" />
                </button>
              </nav>
            </div>

            {/* Footer details */}
            <div className="border-t border-white/10 pt-6 text-center">
              <p className="text-[10px] tracking-[0.3em] text-[#F5F5F0]/40">
                ISABELLA SOFIA © 2026
              </p>
              <p className="text-[8px] tracking-[0.2em] text-[#F5F5F0]/30 mt-2">
                LONDON • NEW YORK • MILAN
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
