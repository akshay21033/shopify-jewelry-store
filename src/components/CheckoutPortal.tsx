import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { X, ArrowLeft, Shield, CheckCircle, CreditCard, Lock, Printer, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CheckoutPortal: React.FC = () => {
  const {
    checkoutActive,
    setCheckoutActive,
    cart,
    cartSubtotal,
    cartTotal,
    couponCode,
    couponDiscount,
    clearCart,
    currentUser,
    userProfile,
    showToast
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Shipping, 2: Payment, 3: Processing, 4: Receipt

  // Shipping Form State
  const [shippingForm, setShippingForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States'
  });

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  // Generated Order Details
  const [orderReceipt, setOrderReceipt] = useState<any>(null);
  const [processingStatus, setProcessingStatus] = useState('Initializing secure channel...');

  // Pre-populate user details if logged in
  useEffect(() => {
    if (currentUser && userProfile) {
      setShippingForm({
        name: userProfile.displayName || '',
        email: currentUser.email || '',
        address: userProfile.address?.addressLine || '',
        city: userProfile.address?.city || '',
        postalCode: userProfile.address?.postalCode || '',
        country: userProfile.address?.country || 'United States'
      });
    }
  }, [currentUser, userProfile]);

  if (!checkoutActive) return null;

  // Mask Card Number for card preview
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Mask Card Expiry
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setPaymentForm({ ...paymentForm, cardNumber: formatted });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.replace(/\//g, '').length <= 4) {
      setPaymentForm({ ...paymentForm, expiry: formatted });
    }
  };

  // Handle Shipping Submit
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingForm.name || !shippingForm.email || !shippingForm.address || !shippingForm.city || !shippingForm.postalCode) {
      showToast('Please fulfill all required address fields', 'error');
      return;
    }
    setStep(2);
  };

  // Handle Payment Submit & Database insertion
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentForm.cardNumber.replace(/\s/g, '').length < 16 || !paymentForm.cardName || paymentForm.expiry.length < 5 || paymentForm.cvv.length < 3) {
      showToast('Please enter valid, complete card credentials', 'error');
      return;
    }

    setStep(3);

    // Simulated Gateway Authorization progress logs
    const statuses = [
      'Establishing TLS tunnel with payment gateway...',
      'Encrypting payment instrument using AES-256...',
      'Requesting 3D-Secure clearance protocol...',
      'Authorizing funds via clearinghouse processor...',
      'Generating unique block ledger token...',
      'Finalizing transaction & compiling invoices...'
    ];

    for (let i = 0; i < statuses.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProcessingStatus(statuses[i]);
    }

    // Save actual order to Firestore database
    const orderId = 'IS-' + Math.floor(100000 + Math.random() * 900000);
    const orderPayload = {
      orderId: orderId,
      userId: currentUser?.uid || 'guest_user',
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        selectedSize: item.selectedSize || 'Standard',
        selectedEngraving: item.selectedEngraving || ''
      })),
      subtotal: cartSubtotal,
      discount: cartSubtotal * (couponDiscount / 100),
      shipping: 0,
      total: cartTotal,
      shippingAddress: {
        name: shippingForm.name,
        email: shippingForm.email,
        address: shippingForm.address,
        city: shippingForm.city,
        postalCode: shippingForm.postalCode,
        country: shippingForm.country
      },
      createdAt: new Date().toISOString(),
      status: 'Processing'
    };

    try {
      await addDoc(collection(db, 'orders'), orderPayload);
      setOrderReceipt(orderPayload);
      clearCart();
      showToast('Your luxurious order was successfully authorized!', 'success');
      setStep(4);
    } catch (err) {
      console.error("Error committing order to Firestore: ", err);
      showToast('Order registration failed. Please contact support.', 'error');
      setStep(2); // return back
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="checkout-portal-container"
        className="fixed inset-0 z-[200] bg-[#080808] overflow-y-auto flex flex-col min-h-screen"
      >
        {/* Navigation Bar */}
        <header className="border-b border-white/10 bg-[#080808]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              id="back-to-catalog-checkout-btn"
              onClick={() => {
                if (step === 2) setStep(1);
                else if (step === 1) setCheckoutActive(false);
              }}
              disabled={step === 3 || step === 4}
              className="flex items-center gap-2 text-[#F5F5F0]/70 hover:text-gold-400 transition-colors text-xs tracking-widest font-semibold uppercase disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{step === 2 ? 'Back to shipping' : 'Exit checkout'}</span>
            </button>

            <span className="font-serif text-xl tracking-[0.15em] text-[#F5F5F0] font-light">
              ISABELLA SOFIA
            </span>

            <div className="flex items-center gap-1.5 text-gold-400/60 text-[10px] tracking-widest font-semibold uppercase">
              <Lock className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">256-BIT SECURE GATEWAY</span>
            </div>
          </div>
        </header>

        {/* Main Body Grid */}
        <main className="max-w-5xl w-full mx-auto px-6 py-10 flex-1 flex flex-col justify-center bg-[#080808]">
          
          {/* Progress Bar steps (Only show for Step 1 & 2) */}
          {(step === 1 || step === 2) && (
            <div className="w-full max-w-lg mx-auto mb-12">
              <div className="flex justify-between text-[10px] tracking-[0.25em] font-medium text-[#F5F5F0]/40 uppercase mb-3">
                <span className={step === 1 ? 'text-[#F5F5F0] font-semibold' : ''}>1. DELIVERY DETAILS</span>
                <span className={step === 2 ? 'text-[#F5F5F0] font-semibold' : ''}>2. SECURE PAYMENT</span>
                <span>3. SUCCESS RECEIPT</span>
              </div>
              <div className="w-full h-[1px] bg-white/10 relative">
                <div 
                  className="absolute left-0 top-0 h-[2px] bg-gold-400 transition-all duration-500"
                  style={{ width: step === 1 ? '50%' : '100%' }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT SIDE: Dynamic Forms */}
            <div className="lg:col-span-7 bg-[#0D0D0D] p-6 sm:p-8 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] rounded-none">
              <AnimatePresence mode="wait">
                
                {/* Step 1: Shipping Details */}
                {step === 1 && (
                  <motion.div
                    key="step-shipping"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-serif text-lg tracking-wide text-[#F5F5F0] mb-6 font-light uppercase">
                      Delivery Address
                    </h3>
                    <form onSubmit={handleShippingSubmit} className="space-y-5">
                      <div>
                        <label className="block text-[10px] tracking-wider text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">
                          Recipient Full Name *
                        </label>
                        <input
                          id="shipping-name-input"
                          type="text"
                          required
                          value={shippingForm.name}
                          onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                          className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                          placeholder="e.g. Katherine Hepburn"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] tracking-wider text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">
                          Recipient Email Address *
                        </label>
                        <input
                          id="shipping-email-input"
                          type="email"
                          required
                          value={shippingForm.email}
                          onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                          className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                          placeholder="e.g. katherine@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] tracking-wider text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">
                          Street Address *
                        </label>
                        <input
                          id="shipping-address-input"
                          type="text"
                          required
                          value={shippingForm.address}
                          onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                          className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                          placeholder="e.g. 742 Evergreen Terrace"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-wider text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">
                            City *
                          </label>
                          <input
                            id="shipping-city-input"
                            type="text"
                            required
                            value={shippingForm.city}
                            onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                            className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                            placeholder="e.g. Springfield"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-wider text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">
                            Postal Code *
                          </label>
                          <input
                            id="shipping-postal-input"
                            type="text"
                            required
                            value={shippingForm.postalCode}
                            onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                            className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                            placeholder="e.g. 90210"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] tracking-wider text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">
                          Country / Territory *
                        </label>
                        <select
                          id="shipping-country-input"
                          value={shippingForm.country}
                          onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                          className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                        >
                          <option className="bg-[#0D0D0D] text-[#F5F5F0]">United States</option>
                          <option className="bg-[#0D0D0D] text-[#F5F5F0]">United Kingdom</option>
                          <option className="bg-[#0D0D0D] text-[#F5F5F0]">Canada</option>
                          <option className="bg-[#0D0D0D] text-[#F5F5F0]">France</option>
                          <option className="bg-[#0D0D0D] text-[#F5F5F0]">Germany</option>
                          <option className="bg-[#0D0D0D] text-[#F5F5F0]">Italy</option>
                          <option className="bg-[#0D0D0D] text-[#F5F5F0]">Japan</option>
                          <option className="bg-[#0D0D0D] text-[#F5F5F0]">Australia</option>
                        </select>
                      </div>

                      <button
                        id="shipping-form-submit-btn"
                        type="submit"
                        className="w-full bg-[#F5F5F0] hover:bg-gold-400 text-[#080808] text-[11px] tracking-[0.2em] font-bold py-4 mt-4 transition-colors focus:outline-none rounded-none"
                      >
                        CONTINUE TO SECURE PAYMENT
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* Step 2: Secure Payment details */}
                {step === 2 && (
                  <motion.div
                    key="step-payment"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-serif text-lg tracking-wide text-[#F5F5F0] mb-6 font-light uppercase">
                      Payment Gateway Credentials
                    </h3>
                    
                    {/* Exquisite visual credit card preview mockup */}
                    <div className="w-full aspect-[1.586/1] bg-gradient-to-tr from-stone-900 via-stone-850 to-gold-900 text-white p-6 relative shadow-lg mb-8 select-none flex flex-col justify-between overflow-hidden border border-white/5">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16" />
                      <div className="absolute bottom-0 left-0 w-36 h-36 bg-gold-500/10 rounded-full blur-xl -ml-16 -mb-16" />
                      
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="font-serif italic text-base tracking-widest text-gold-300">Isabella Sofia</span>
                          <span className="text-[7px] tracking-[0.4em] text-white/50 uppercase mt-0.5">FINE JEWELLERY MEMBRE</span>
                        </div>
                        <CreditCard className="w-7 h-7 text-gold-300" />
                      </div>

                      <div className="my-auto py-2">
                        <span className="font-mono text-lg sm:text-xl tracking-[0.18em] font-semibold text-[#fbf9f4]">
                          {paymentForm.cardNumber || '•••• •••• •••• ••••'}
                        </span>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-[7px] tracking-[0.25em] text-white/40 uppercase">Cardholder</span>
                          <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-100 truncate max-w-[150px]">
                            {paymentForm.cardName || 'MEMBER NAME'}
                          </span>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <span className="text-[7px] tracking-[0.25em] text-white/40 uppercase">Expiry</span>
                            <span className="font-mono text-[10px] font-semibold text-stone-100">
                              {paymentForm.expiry || 'MM/YY'}
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[7px] tracking-[0.25em] text-white/40 uppercase">CVV</span>
                            <span className="font-mono text-[10px] font-semibold text-stone-100">
                              {paymentForm.cvv || '•••'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[10px] tracking-wider text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">
                          Name on Card *
                        </label>
                        <input
                          id="card-name-input"
                          type="text"
                          required
                          value={paymentForm.cardName}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value })}
                          className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                          placeholder="e.g. Katherine Hepburn"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] tracking-wider text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">
                          Card Number *
                        </label>
                        <input
                          id="card-number-input"
                          type="text"
                          required
                          value={paymentForm.cardNumber}
                          onChange={handleCardNumberChange}
                          className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0] font-mono"
                          placeholder="4000 1234 5678 9010"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-wider text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">
                            Expiration Date *
                          </label>
                          <input
                            id="card-expiry-input"
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={paymentForm.expiry}
                            onChange={handleExpiryChange}
                            className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0] font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-wider text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">
                            Security CVV Code *
                          </label>
                          <input
                            id="card-cvv-input"
                            type="password"
                            required
                            maxLength={4}
                            value={paymentForm.cvv}
                            onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value.replace(/\D/g, '') })}
                            className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0] font-mono"
                            placeholder="e.g. 123"
                          />
                        </div>
                      </div>

                      <button
                        id="payment-form-submit-btn"
                        type="submit"
                        className="w-full bg-gold-400 hover:bg-gold-300 text-[#080808] text-[11px] tracking-[0.2em] font-bold py-4 mt-6 transition-colors focus:outline-none flex items-center justify-center gap-2 rounded-none shadow-lg"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        SECURE AUTHORIZE ${cartTotal.toLocaleString()}.00 USD
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* Step 3: Authorizing Transaction Progress Log */}
                {step === 3 && (
                  <motion.div
                    key="step-processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="relative mb-8">
                      <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-gold-400 animate-spin" />
                      <Lock className="w-5 h-5 text-gold-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    
                    <h3 className="font-serif text-xl tracking-wide text-[#F5F5F0] font-light mb-2">
                      Securing Authorization...
                    </h3>
                    <p className="text-gold-400/80 text-xs font-mono tracking-widest uppercase mb-6">
                      PLEASE DO NOT REFRESH OR CLOSE WINDOW
                    </p>

                    {/* Progress terminal log */}
                    <div className="w-full max-w-sm bg-[#121212] text-[#F5F5F0] rounded-none p-4 font-mono text-[10px] text-left border border-white/10 shadow-inner">
                      <div className="flex items-center gap-1.5 mb-2 border-b border-white/5 pb-2">
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                        <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                        <span className="text-[8px] text-[#F5F5F0]/40 uppercase ml-2">Secure Connection Socket</span>
                      </div>
                      <p className="text-[#F5F5F0]/40">[{new Date().toLocaleTimeString()}] Secure terminal linked...</p>
                      <p className="text-[#F5F5F0]/40">[{new Date().toLocaleTimeString()}] Handshaked with Shopify API Gateway...</p>
                      <motion.p 
                        key={processingStatus}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gold-400 font-semibold mt-1"
                      >
                        &gt; {processingStatus}
                      </motion.p>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Success confirmation screen */}
                {step === 4 && orderReceipt && (
                  <motion.div
                    key="step-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <CheckCircle className="w-16 h-16 text-gold-400 mx-auto mb-6" />
                    
                    <span className="text-[10px] tracking-[0.4em] font-semibold text-gold-400 uppercase block mb-2">
                      AUTHORIZED COMPLETED SUCCESSFULLY
                    </span>
                    <h3 className="font-serif text-3xl text-[#F5F5F0] tracking-wide font-light mb-4">
                      Thank You, {orderReceipt.shippingAddress.name}
                    </h3>
                    <p className="text-[#F5F5F0]/60 text-xs max-w-md mx-auto mb-10 leading-relaxed">
                      Your order <span className="font-mono font-semibold text-gold-400">{orderReceipt.orderId}</span> was cleared and logged into our ledger. A hand-signed receipt and carrier information will be delivered to <span className="font-medium text-[#F5F5F0]">{orderReceipt.shippingAddress.email}</span>.
                    </p>

                    {/* Action grid */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                      <button
                        id="print-invoice-btn"
                        onClick={() => window.print()}
                        className="border border-white/15 hover:border-gold-400 text-[#F5F5F0] text-[10px] tracking-widest font-semibold py-3.5 px-6 flex items-center justify-center gap-2 transition-colors focus:outline-none bg-transparent rounded-none"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        PRINT RECEIPT
                      </button>
                      
                      <button
                        id="return-home-checkout-btn"
                        onClick={() => setCheckoutActive(false)}
                        className="bg-[#F5F5F0] hover:bg-gold-400 text-[#080808] text-[10px] tracking-widest font-bold py-3.5 px-6 transition-colors focus:outline-none rounded-none"
                      >
                        CONTINUE SHOPPING
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT SIDE: Cart items summaries (Sticky) */}
            <div className="lg:col-span-5 bg-[#0D0D0D] p-6 border border-white/10 sticky top-28 rounded-none shadow-lg">
              <h4 className="font-serif text-base text-[#F5F5F0] font-light mb-6 uppercase tracking-wider">
                Order Summaries
              </h4>

              {/* Items mapping list */}
              {step !== 4 ? (
                <div className="max-h-[300px] overflow-y-auto space-y-4 mb-6 border-b border-white/5 pb-5">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 text-xs">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-12 h-16 object-cover bg-[#151515] border border-white/5 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-serif text-[#F5F5F0] font-medium leading-tight">{item.product.name}</p>
                          <p className="text-[9px] text-[#F5F5F0]/50 uppercase tracking-widest mt-0.5">
                            QTY: {item.quantity} {item.selectedSize && `• SIZE: ${item.selectedSize}`}
                          </p>
                        </div>
                        <span className="font-mono text-gold-400 font-medium text-[11px]">
                          ${(item.product.price * item.quantity).toLocaleString()}.00
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : orderReceipt ? (
                <div className="max-h-[300px] overflow-y-auto space-y-4 mb-6 border-b border-white/5 pb-5">
                  {orderReceipt.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 text-xs">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-16 object-cover bg-[#151515] border border-white/5 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-serif text-[#F5F5F0] font-medium leading-tight">{item.name}</p>
                          <p className="text-[9px] text-[#F5F5F0]/50 uppercase tracking-widest mt-0.5">
                            QTY: {item.quantity} • SIZE: {item.selectedSize}
                          </p>
                        </div>
                        <span className="font-mono text-gold-400 font-medium text-[11px]">
                          ${(item.price * item.quantity).toLocaleString()}.00
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Financial Breakdowns */}
              <div className="space-y-2.5 text-xs text-[#F5F5F0]/60">
                <div className="flex justify-between font-light">
                  <span>Cart Items Subtotal</span>
                  <span className="font-mono">${(orderReceipt?.subtotal || cartSubtotal).toLocaleString()}.00</span>
                </div>

                {(orderReceipt?.discount > 0 || couponDiscount > 0) && (
                  <div className="flex justify-between text-gold-400 font-medium">
                    <span>Discount Coupon ({orderReceipt?.couponCode || couponCode || 'Applied'})</span>
                    <span className="font-mono">-${(orderReceipt?.discount || cartSubtotal * (couponDiscount / 100)).toLocaleString()}.00</span>
                  </div>
                )}

                <div className="flex justify-between font-light">
                  <span>Insured Express Delivery</span>
                  <span className="text-[10px] tracking-wider text-gold-400 font-bold uppercase">COMPLEMENTARY</span>
                </div>

                <div className="flex justify-between font-light">
                  <span>Clearance Duty & Tax</span>
                  <span className="font-mono">$0.00</span>
                </div>

                <div className="flex justify-between text-[#F5F5F0] font-medium border-t border-white/10 pt-4 text-sm">
                  <span className="font-serif">Authorized Payment Total</span>
                  <span className="font-mono font-semibold text-gold-400 text-base">
                    ${(orderReceipt?.total || cartTotal).toLocaleString()}.00 USD
                  </span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </AnimatePresence>
  );
};
