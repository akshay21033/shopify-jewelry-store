import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutPortal } from './components/CheckoutPortal';
import { CustomerPortal } from './components/CustomerPortal';
import { BespokeConsultation } from './components/BespokeConsultation';
import { OurStory } from './components/OurStory';
import { PRODUCTS } from './data';
import { ProductCard } from './components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ArrowRight, Instagram, Facebook, Compass, Award, Mail, ExternalLink, Sparkles } from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    toast,
    setSelectedProduct,
    showToast
  } = useApp();

  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      showToast('Welcome to our elite circle. Private invitation details sent.', 'success');
      setNewsletterEmail('');
    }
  };

  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] flex flex-col justify-between overflow-x-hidden selection:bg-gold-100 selection:text-gold-900">
      
      {/* Dynamic Header */}
      <Header />

      {/* Main View Router */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Campaign Hero banner */}
              <Hero />

              {/* Home Page Section: Capsule Teaser */}
              <section id="capsule-teaser" className="max-w-7xl mx-auto px-6 md:px-12 py-24 sm:py-32">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                  <div className="max-w-lg">
                    <span className="text-[10px] tracking-[0.3em] font-medium text-gold-600 uppercase block mb-3">
                      CURATED CURATION
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 tracking-wide">
                      The Signature Masterpieces
                    </h2>
                  </div>
                  <button
                    id="home-view-all-capsule-btn"
                    onClick={() => setActiveTab('shop')}
                    className="group text-[11px] tracking-[0.25em] font-semibold text-stone-800 hover:text-gold-600 transition-colors flex items-center gap-1.5 focus:outline-none uppercase whitespace-nowrap border-b border-stone-300 pb-1 self-start md:self-auto"
                  >
                    <span>EXPLORE ALL ITEMS</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* 4 Featured Products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>

              {/* Home Page Section: Brand Quote Block */}
              <section id="campaign-banner" className="bg-[#f2efe9] py-24 sm:py-32">
                <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
                  <span className="text-[10px] tracking-[0.4em] font-medium text-gold-600 uppercase block">
                    OUR CORE CORE VISION
                  </span>
                  <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl italic text-stone-950 font-light leading-relaxed max-w-2xl mx-auto">
                    "True luxury lies in simplicity, permanence, and the quiet integrity of the materials we hold close."
                  </blockquote>
                  <div className="w-12 h-[1px] bg-gold-400 mx-auto" />
                  <p className="text-stone-500 font-light text-sm tracking-wide max-w-lg mx-auto leading-relaxed">
                    At Isabella Sofia, we reject the disposable pace of modern fashion. Our collections are capsule releases designed to serve as modern heirlooms that tell a lifetime of stories.
                  </p>
                  <button
                    id="campaign-story-btn"
                    onClick={() => setActiveTab('story')}
                    className="border border-stone-800 hover:border-gold-500 hover:text-gold-600 text-stone-900 text-[11px] tracking-[0.25em] font-semibold px-8 py-3.5 mt-4 transition-all focus:outline-none"
                  >
                    OUR PHILOSOPHY
                  </button>
                </div>
              </section>

              {/* Home Page Section: Craftsmanship details */}
              <section id="craftsmanship-details" className="max-w-7xl mx-auto px-6 md:px-12 py-24 sm:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-6 relative aspect-[4/5] bg-stone-100 overflow-hidden shadow-sm">
                    <img 
                      id="home-craft-img"
                      src="/src/assets/images/isabella_sofia_hero_1783020773311.jpg" 
                      alt="Artisan sculpting fine yellow gold band" 
                      className="w-full h-full object-cover object-center filter sepia brightness-90 saturate-50"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="lg:col-span-6 space-y-6">
                    <span className="text-[10px] tracking-[0.3em] font-medium text-gold-600 uppercase">
                      THE ATELIER STANDARD
                    </span>
                    <h3 className="font-serif text-3xl font-light text-stone-900 tracking-wide">
                      Sculpted by Hand, Built to Endure
                    </h3>
                    <p className="text-stone-600 font-light text-sm leading-relaxed tracking-wide">
                      Our boutique workshops are based in London and Milan. Each piece is hand-cast by master artisans who have preserved ancient techniques of gold-working. By avoiding computerized mass molding, every Isabella Sofia piece holds subtle, organic variations in form, reflecting the soul of its sculptor.
                    </p>

                    <div className="space-y-4 pt-4 border-t border-stone-200/60 text-xs text-stone-700">
                      <div className="flex gap-3">
                        <ShieldCheck className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold tracking-wider text-[10px] uppercase text-stone-850">
                            100% Recycled Precious Gold
                          </h4>
                          <p className="text-stone-500 font-light mt-1">Sourced through RJC audited partners to minimize mercury and waste footprints.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <ShieldCheck className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold tracking-wider text-[10px] uppercase text-stone-850">
                            Conflict-Free Diamond Clearance
                          </h4>
                          <p className="text-stone-500 font-light mt-1">Every diamond has passed Kimberley Certification audits ensuring ethical security.</p>
                        </div>
                      </div>
                    </div>

                    <button
                      id="home-book-advisory-btn"
                      onClick={() => setActiveTab('consult')}
                      className="bg-stone-900 hover:bg-gold-600 text-[#FAF8F5] text-[11px] tracking-[0.2em] font-semibold py-4 px-8 mt-6 transition-colors focus:outline-none"
                    >
                      SCHEDULE ATELIER SESSION
                    </button>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'shop' && (
            <motion.div
              key="shop-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <ProductGrid />
            </motion.div>
          )}

          {activeTab === 'story' && (
            <motion.div
              key="story-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <OurStory />
            </motion.div>
          )}

          {activeTab === 'consult' && (
            <motion.div
              key="consult-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <BespokeConsultation />
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div
              key="account-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <CustomerPortal />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Luxury Footer component */}
      <footer id="editorial-footer" className="bg-[#FAF8F5] border-t border-stone-200 pt-20 pb-12 text-stone-600">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-stone-200/60">
          
          {/* Logo & Newsletter */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-[0.2em] text-stone-900 font-light leading-none">
                ISABELLA SOFIA
              </span>
              <span className="text-[7px] tracking-[0.4em] text-stone-400 font-light uppercase mt-1">
                FINE JEWELLERY
              </span>
            </div>
            
            <p className="text-stone-500 font-light text-xs max-w-sm leading-relaxed tracking-wide">
              Subscribe to our exclusive ledger. Curators receive early invitations to capsule releases, private atelier sketches, and editorial previews.
            </p>

            {/* Newsletter input */}
            <form onSubmit={handleNewsletterSubmit} className="flex max-w-sm gap-2">
              <input
                id="newsletter-email-input"
                type="email"
                required
                placeholder="YOUR EMAIL ADDRESS"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-white border border-stone-200 px-4 py-2.5 text-[10px] tracking-wider focus:outline-none focus:border-gold-400 rounded-none uppercase placeholder-stone-400 text-stone-850"
              />
              <button
                id="newsletter-submit-btn"
                type="submit"
                className="bg-stone-900 hover:bg-gold-600 text-white text-[10px] tracking-widest font-semibold px-5 py-2.5 transition-colors focus:outline-none"
              >
                JOIN
              </button>
            </form>
          </div>

          {/* Core Navigation directories */}
          <div className="md:col-span-2 col-span-2 space-y-4">
            <h4 className="font-semibold text-stone-900 tracking-widest text-[9px] uppercase">
              The Collections
            </h4>
            <ul className="space-y-2 text-[11px] font-medium tracking-wider text-stone-500 uppercase">
              <li>
                <button id="footer-link-rings" onClick={() => { setActiveTab('shop'); }} className="hover:text-gold-600 focus:outline-none">Rings</button>
              </li>
              <li>
                <button id="footer-link-necklaces" onClick={() => { setActiveTab('shop'); }} className="hover:text-gold-600 focus:outline-none">Necklaces</button>
              </li>
              <li>
                <button id="footer-link-bracelets" onClick={() => { setActiveTab('shop'); }} className="hover:text-gold-600 focus:outline-none">Bracelets</button>
              </li>
              <li>
                <button id="footer-link-earrings" onClick={() => { setActiveTab('shop'); }} className="hover:text-gold-600 focus:outline-none">Earrings</button>
              </li>
            </ul>
          </div>

          {/* Brand Philosophy directory */}
          <div className="md:col-span-2 col-span-2 space-y-4">
            <h4 className="font-semibold text-stone-900 tracking-widest text-[9px] uppercase">
              The Maison
            </h4>
            <ul className="space-y-2 text-[11px] font-medium tracking-wider text-stone-500 uppercase">
              <li>
                <button id="footer-link-story" onClick={() => setActiveTab('story')} className="hover:text-gold-600 focus:outline-none">Our Story</button>
              </li>
              <li>
                <button id="footer-link-atelier" onClick={() => setActiveTab('story')} className="hover:text-gold-600 focus:outline-none">The Atelier</button>
              </li>
              <li>
                <button id="footer-link-ethics" onClick={() => setActiveTab('story')} className="hover:text-gold-600 focus:outline-none">Ethics & Integrity</button>
              </li>
              <li>
                <button id="footer-link-advisory" onClick={() => setActiveTab('consult')} className="hover:text-gold-600 focus:outline-none">Studio Consultation</button>
              </li>
            </ul>
          </div>

          {/* Social credentials */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-semibold text-stone-900 tracking-widest text-[9px] uppercase">
              Atelier Coordinates
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-stone-500 leading-snug tracking-wide">
              <li>Maison London: Bond Street, Mayfair</li>
              <li>Maison Milan: Via della Spiga, Quadrilatero</li>
              <li>Support: concierge@isabellasofia.com</li>
            </ul>
            <div className="flex gap-4 pt-2 text-stone-400">
              <a href="#" className="hover:text-gold-600 transition-colors" aria-label="Instagram Profile">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-gold-600 transition-colors" aria-label="Facebook Profile">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer credits and copyrights */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] tracking-widest font-light text-stone-400 uppercase gap-4 text-center sm:text-left">
          <div>
            ISABELLA SOFIA © 2026 • ALL RIGHTS RESERVED
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            <a href="#" className="hover:text-stone-700">Privacy Ledger</a>
            <span>•</span>
            <a href="#" className="hover:text-stone-700">Terms of Curation</a>
            <span>•</span>
            <span className="flex items-center gap-1 text-gold-600 font-semibold font-serif lowercase italic">
              <Sparkles className="w-3 h-3 text-gold-500" />
              crafted in our boutique atelier
            </span>
          </div>
        </div>
      </footer>

      {/* Global Product Detail Modal Overlay */}
      <ProductDetailModal />

      {/* Global Shopping Cart Drawer */}
      <CartDrawer />

      {/* Global Checkout Gateway Wizard */}
      <CheckoutPortal />

      {/* Elegant Toast Notifications overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div
            id="app-toast-alert"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[300] bg-stone-900 text-[#FAF8F5] border border-stone-800 shadow-xl px-5 py-3.5 flex items-center gap-3 text-xs tracking-wide max-w-sm rounded-none"
          >
            <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-ping flex-shrink-0" />
            <span className="font-light">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
