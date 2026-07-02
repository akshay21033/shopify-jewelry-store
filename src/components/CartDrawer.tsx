import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Minus, Plus, Trash2, Tag, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotal,
    applyCoupon,
    couponCode,
    couponDiscount,
    setCheckoutActive
  } = useApp();

  const [promoInput, setPromoInput] = useState('');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyCoupon(promoInput);
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setCheckoutActive(true);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div 
          id="cart-drawer-portal"
          className="fixed inset-0 z-[150] overflow-hidden"
        >
          {/* Backdrop overlay */}
          <motion.div
            id="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-[#000000]/80 backdrop-blur-md"
          />

          {/* Drawer container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              id="cart-drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="w-screen max-w-md bg-[#0D0D0D] border-l border-white/10 shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-lg tracking-wide text-[#F5F5F0] font-light uppercase">
                    Your Selection
                  </h2>
                  <p className="text-[10px] tracking-wider text-gold-400/60 mt-1 uppercase font-medium">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'} in curation
                  </p>
                </div>
                <button
                  id="close-cart-drawer-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 hover:bg-white/5 text-[#F5F5F0]/70 transition-all rounded-full focus:outline-none"
                  aria-label="Close Shopping Cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body (Items list) */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cart.length === 0 ? (
                  <div id="cart-drawer-empty-state" className="flex flex-col items-center justify-center h-full py-12 text-center">
                    <div className="w-16 h-16 bg-[#121212] border border-white/5 flex items-center justify-center rounded-full mb-6">
                      <Trash2 className="w-6 h-6 text-gold-400/40" />
                    </div>
                    <p className="font-serif text-lg text-[#F5F5F0] font-light mb-2">
                      Your selection is empty
                    </p>
                    <p className="text-[#F5F5F0]/60 font-light text-xs max-w-xs mb-8">
                      Each piece is custom sized and hand-certified in our atelier. Explore our catalog to add products.
                    </p>
                    <button
                      id="cart-empty-shop-btn"
                      onClick={() => {
                        setIsCartOpen(false);
                      }}
                      className="bg-[#F5F5F0] hover:bg-gold-400 text-[#080808] text-[10px] tracking-[0.25em] font-bold px-8 py-3.5 transition-colors focus:outline-none rounded-none"
                    >
                      BROWSE THE COLLECTION
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item, idx) => (
                      <div 
                        id={`cart-item-row-${item.product.id}-${idx}`}
                        key={`${item.product.id}-${idx}`}
                        className="flex gap-4 border-b border-white/5 pb-5"
                      >
                        {/* Image */}
                        <div className="w-20 h-24 bg-[#151515] border border-white/5 flex-shrink-0 overflow-hidden">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-serif text-[14px] font-medium text-[#F5F5F0] leading-snug">
                                {item.product.name}
                              </h4>
                              <button
                                id={`remove-cart-item-btn-${item.product.id}`}
                                onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedEngraving)}
                                className="text-[#F5F5F0]/40 hover:text-red-400 transition-colors p-1"
                                aria-label="Remove item"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Attributes (Size, Engraving) */}
                            <div className="flex flex-col gap-0.5 mt-1 text-[10px] text-[#F5F5F0]/50 uppercase tracking-widest font-medium">
                              {item.selectedSize && (
                                <span>Size: {item.selectedSize}</span>
                              )}
                              {item.selectedEngraving && (
                                <span className="text-gold-400 italic font-serif capitalize font-semibold tracking-wider">
                                  Engraving: "{item.selectedEngraving}"
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price & Quantity Adjuster */}
                          <div className="flex justify-between items-center mt-3">
                            {/* Quantity buttons */}
                            <div className="flex items-center border border-white/10 bg-[#121212]">
                              <button
                                id={`decrease-qty-btn-${item.product.id}`}
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedEngraving)}
                                className="p-1.5 hover:bg-white/5 text-[#F5F5F0]/70 transition-colors focus:outline-none"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-3 font-mono text-xs font-semibold text-[#F5F5F0]">
                                {item.quantity}
                              </span>
                              <button
                                id={`increase-qty-btn-${item.product.id}`}
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedEngraving)}
                                className="p-1.5 hover:bg-white/5 text-[#F5F5F0]/70 transition-colors focus:outline-none"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Line item price */}
                            <span className="font-mono text-xs font-medium text-gold-400">
                              ${(item.product.price * item.quantity).toLocaleString()} USD
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer (Summary & Checkout) */}
              {cart.length > 0 && (
                <div className="border-t border-white/10 px-6 py-6 bg-[#111111]">
                  {/* Promo Input */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2 mb-6">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold-400/60" />
                      <input
                        id="promo-code-input"
                        type="text"
                        placeholder="OFFER PROMO CODE (e.g., SOFIA10)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 pl-9 pr-3 py-2 text-[10px] tracking-widest focus:outline-none focus:border-gold-400 rounded-none uppercase placeholder-white/20 text-[#F5F5F0]"
                      />
                    </div>
                    <button
                      id="apply-promo-btn"
                      type="submit"
                      className="bg-[#F5F5F0] hover:bg-gold-400 text-[#080808] text-[10px] tracking-widest font-bold px-4 py-2 transition-colors focus:outline-none rounded-none"
                    >
                      APPLY
                    </button>
                  </form>

                  {/* Financial Breakdown */}
                  <div className="space-y-2 text-xs mb-6 text-[#F5F5F0]/60">
                    <div className="flex justify-between font-light">
                      <span>Curation Subtotal</span>
                      <span className="font-mono">${cartSubtotal.toLocaleString()}.00</span>
                    </div>

                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-gold-400 font-medium">
                        <span>Offer Applied ({couponCode})</span>
                        <span className="font-mono">-{couponDiscount}% (-${(cartSubtotal * (couponDiscount / 100)).toLocaleString()}.00)</span>
                      </div>
                    )}

                    <div className="flex justify-between font-light">
                      <span>Insured Premium Delivery</span>
                      <span className="text-[10px] tracking-wider text-gold-400 uppercase font-bold">COMPLEMENTARY</span>
                    </div>

                    <div className="flex justify-between font-light">
                      <span>Import Clearance Duties & Tax</span>
                      <span className="text-[10px] tracking-wider text-[#F5F5F0]/40 uppercase">CALCULATED AT CHECKOUT</span>
                    </div>

                    <div className="flex justify-between text-[#F5F5F0] font-medium border-t border-white/10 pt-3.5 text-sm">
                      <span className="font-serif">Estimated Total</span>
                      <span className="font-mono font-semibold text-base text-gold-400">${cartTotal.toLocaleString()}.00 USD</span>
                    </div>
                  </div>

                  {/* Checkout Actions */}
                  <button
                    id="trigger-checkout-btn"
                    onClick={handleCheckoutClick}
                    className="w-full bg-gold-400 hover:bg-gold-300 text-[#080808] text-[11px] tracking-[0.25em] font-bold py-4.5 flex items-center justify-center transition-colors focus:outline-none mb-3 shadow-lg rounded-none"
                  >
                    PROCEED TO SECURE CHECKOUT
                  </button>

                  {/* Guarantee label */}
                  <div className="flex items-center justify-center text-[10px] text-[#F5F5F0]/40 font-light gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                    <span>Payments secured via Shopify 256-Bit SSL</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
