import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, ShieldCheck, Truck, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    toggleWishlist, 
    wishlist,
    setIsCartOpen
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [engravingText, setEngravingText] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'details' | 'materials' | 'care'>('details');

  if (!selectedProduct) return null;

  const isFavorited = wishlist.includes(selectedProduct.id);

  // Define sizes
  const sizes = 
    selectedProduct.category === 'Rings' 
      ? ['5', '6', '7', '8', '9'] 
      : selectedProduct.category === 'Bracelets' 
        ? ['Small', 'Medium', 'Large'] 
        : [];

  // Set initial size if not set
  if (sizes.length > 0 && !selectedSize) {
    setSelectedSize(sizes[1]); // Default to middle size
  }

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedSize || 'Standard', engravingText);
    setSelectedProduct(null); // Close modal
    setIsCartOpen(true); // Open cart immediately
  };

  return (
    <AnimatePresence>
      <div 
        id="product-detail-modal-wrapper"
        className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 sm:p-6"
      >
        {/* Backdrop overlay */}
        <motion.div 
          id="product-detail-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 bg-[#000000]/80 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          id="product-detail-box"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative bg-[#0D0D0D] border border-white/10 w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] rounded-none"
        >
          {/* Close button */}
          <button
            id="close-detail-modal-btn"
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 p-2 bg-[#111111]/80 backdrop-blur-md hover:bg-gold-400 hover:text-[#080808] border border-white/10 transition-all rounded-full z-30 shadow-md text-[#F5F5F0] focus:outline-none"
            aria-label="Close product details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Photo Showcase */}
          <div className="w-full md:w-1/2 bg-[#151515] border-r border-white/5 relative min-h-[300px] md:min-h-0 flex items-center justify-center">
            <img 
              id="detail-modal-img"
              src={selectedProduct.image} 
              alt={selectedProduct.name}
              className="w-full h-full object-cover object-center max-h-[45vh] md:max-h-none filter brightness-90 contrast-105"
              referrerPolicy="no-referrer"
            />
            {selectedProduct.featured && (
              <span className="absolute top-6 left-6 bg-gold-400 text-[#080808] text-[9px] tracking-widest font-bold px-3 py-1 uppercase shadow-md">
                SIGNATURE MASTERPIECE
              </span>
            )}
          </div>

          {/* Right Side: Configuration and Info */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto bg-[#0D0D0D]">
            <div>
              {/* Category */}
              <p className="text-[10px] tracking-[0.3em] font-medium text-gold-400/60 uppercase mb-2">
                ISABELLA SOFIA • {selectedProduct.category}
              </p>

              {/* Title & Price */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-serif text-2xl sm:text-3xl text-[#F5F5F0] tracking-wide font-light max-w-[70%]">
                  {selectedProduct.name}
                </h2>
                <span className="font-mono text-xs sm:text-sm font-semibold text-gold-400 bg-gold-400/10 border border-gold-400/20 px-3 py-1.5 mt-1">
                  ${selectedProduct.price.toLocaleString()}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex text-gold-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>
                <span className="text-[11px] font-mono font-medium text-[#F5F5F0]/50">
                  {selectedProduct.rating.toFixed(1)} / 5.0 Rating
                </span>
              </div>

              {/* Main Description */}
              <p className="text-[#F5F5F0]/70 text-xs sm:text-sm leading-relaxed tracking-wide font-light mb-6">
                {selectedProduct.description}
              </p>

              {/* Size Selector */}
              {sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-[11px] tracking-widest font-semibold text-[#F5F5F0]/80 uppercase mb-2">
                    <span>SELECT SIZE ({selectedProduct.category === 'Rings' ? 'US Ring Size' : 'Wrist Size'})</span>
                    <button 
                      id="size-guide-btn"
                      className="text-gold-400 hover:text-gold-300 font-medium text-[10px] tracking-widest hover:underline"
                      onClick={() => alert("Size Guide: Rings represent standard US sizes 5-9. Bracelets: Small fits up to 6.25\", Medium up to 7.0\", Large up to 7.75\".")}
                    >
                      SIZE CALCULATOR
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {sizes.map((sz) => (
                      <button
                        id={`size-btn-${sz.toLowerCase()}`}
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`border text-xs font-mono font-medium min-w-[48px] py-2.5 transition-all focus:outline-none bg-[#121212] ${
                          selectedSize === sz
                            ? 'bg-[#F5F5F0] border-[#F5F5F0] text-[#080808] font-bold'
                            : 'border-white/10 hover:border-gold-400/40 text-[#F5F5F0]/70'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Complementary Custom Engraving Widget */}
              <div className="mb-6 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between text-[11px] tracking-widest font-semibold text-[#F5F5F0]/80 uppercase mb-2">
                  <span className="flex items-center">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400 mr-1.5" />
                    COMPLEMENTARY ENGRAVING
                  </span>
                  <span className="text-[9px] font-normal text-[#F5F5F0]/40 capitalize">Up to 15 characters</span>
                </div>
                <input
                  id="engraving-input-field"
                  type="text"
                  maxLength={15}
                  placeholder="e.g., FOREVER, A&B, 07.02.26"
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 rounded-none px-4 py-2.5 text-xs focus:outline-none placeholder-white/30 tracking-wide text-[#F5F5F0]"
                />
                
                {/* Live Script Engraving Preview */}
                <AnimatePresence>
                  {engravingText && (
                    <motion.div
                      id="engraving-live-preview"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 bg-gold-400/5 p-2.5 border border-gold-400/20 text-center shadow-[0_0_15px_rgba(197,160,89,0.05)]"
                    >
                      <span className="text-[10px] tracking-widest text-gold-400/60 uppercase block mb-1">
                        ENGRAVED PREVIEW:
                      </span>
                      <span className="font-serif italic text-lg text-gold-400 tracking-widest font-medium block py-1 select-none">
                        "{engravingText}"
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sub tabs: Details / Materials / Care */}
              <div className="mb-6 border-b border-white/10">
                <div className="flex gap-4 text-[10px] tracking-widest font-semibold text-[#F5F5F0]/40 uppercase">
                  <button
                    id="tab-detail-spec"
                    onClick={() => setActiveSubTab('details')}
                    className={`pb-2 border-b-2 transition-all ${
                      activeSubTab === 'details' ? 'border-gold-400 text-gold-400 font-bold' : 'border-transparent hover:text-[#F5F5F0]/80'
                    }`}
                  >
                    SPECIFICATIONS
                  </button>
                  <button
                    id="tab-detail-material"
                    onClick={() => setActiveSubTab('materials')}
                    className={`pb-2 border-b-2 transition-all ${
                      activeSubTab === 'materials' ? 'border-gold-400 text-gold-400 font-bold' : 'border-transparent hover:text-[#F5F5F0]/80'
                    }`}
                  >
                    ETHICAL ETHICS
                  </button>
                  <button
                    id="tab-detail-care"
                    onClick={() => setActiveSubTab('care')}
                    className={`pb-2 border-b-2 transition-all ${
                      activeSubTab === 'care' ? 'border-gold-400 text-gold-400 font-bold' : 'border-transparent hover:text-[#F5F5F0]/80'
                    }`}
                  >
                    CARE GUIDE
                  </button>
                </div>

                <div className="py-4 text-xs font-light text-[#F5F5F0]/60 leading-relaxed tracking-wide min-h-[100px]">
                  {activeSubTab === 'details' && (
                    <ul className="space-y-1.5 list-disc list-inside">
                      {selectedProduct.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  )}
                  {activeSubTab === 'materials' && (
                    <p>
                      We utilize exclusively recycled or harmoniously-mined precious metals, including 18k solid gold and PT950 platinum. Our diamonds are 100% certified conflict-free, traceably audited, and meet or exceed the Kimberley Process mandates.
                    </p>
                  )}
                  {activeSubTab === 'care' && (
                    <p>
                      Avoid contact with abrasive chemicals, perfume, and chlorine. To clean your piece, immerse in warm water with mild, neutral soap, brush gently with a soft micro-bristle brush, and dry with an organic microfiber cloth. Store in your signature Isabella Sofia suede box.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10 mt-auto">
              <button
                id="add-to-cart-detail-btn"
                onClick={handleAddToCart}
                disabled={!selectedProduct.inStock}
                className={`flex-1 text-[11px] tracking-[0.2em] font-bold py-4 flex items-center justify-center transition-colors focus:outline-none rounded-none ${
                  selectedProduct.inStock 
                    ? 'bg-[#F5F5F0] hover:bg-gold-400 text-[#080808]' 
                    : 'bg-stone-900 cursor-not-allowed text-stone-600'
                }`}
              >
                {selectedProduct.inStock ? 'ADD TO SELECTION' : 'SOLD OUT'}
              </button>

              <button
                id="toggle-wishlist-detail-btn"
                onClick={() => toggleWishlist(selectedProduct.id)}
                className="border border-white/15 hover:border-gold-400 text-[#F5F5F0] px-5 py-4 transition-colors flex items-center justify-center gap-2 focus:outline-none bg-transparent rounded-none"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-gold-400 text-gold-400' : ''}`} />
                <span className="text-[10px] tracking-widest font-semibold uppercase hidden sm:inline">
                  {isFavorited ? 'CURATED' : 'SAVE TO FAVORITES'}
                </span>
              </button>
            </div>

            {/* Quality badge footer */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/5 text-[10px] text-[#F5F5F0]/40 font-light uppercase tracking-wider">
              <span className="flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400 mr-1.5" />
                Lifetime Guarantee
              </span>
              <span className="flex items-center">
                <Truck className="w-3.5 h-3.5 text-gold-400 mr-1.5" />
                Complementary Secure Delivery
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
