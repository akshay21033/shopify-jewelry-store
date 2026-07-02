import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  signInAnonymously
} from 'firebase/auth';
import { Heart, ShoppingBag, ShieldCheck, MapPin, LogOut, ArrowRight, ClipboardList, Key, HelpCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../data';

export const CustomerPortal: React.FC = () => {
  const {
    currentUser,
    userProfile,
    loadingAuth,
    userOrders,
    wishlist,
    toggleWishlist,
    addToCart,
    setSelectedProduct,
    saveAddress,
    showToast
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activePortalTab, setActivePortalTab] = useState<'wishlist' | 'orders' | 'address'>('wishlist');
  const [loadingAction, setLoadingAction] = useState(false);

  // Auth Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Address Inputs
  const [addressLine, setAddressLine] = useState(userProfile?.address?.addressLine || '');
  const [city, setCity] = useState(userProfile?.address?.city || '');
  const [postalCode, setPostalCode] = useState(userProfile?.address?.postalCode || '');
  const [country, setCountry] = useState(userProfile?.address?.country || 'United States');

  // Trigger Demo Login
  const handleDemoLogin = async () => {
    setLoadingAction(true);
    try {
      // Fast demo client authentication
      await signInWithEmailAndPassword(auth, 'demo.curator@isabellasofia.com', 'isabellasofia123');
      showToast('Authenticated as VIP Demo Curator', 'success');
    } catch (err: any) {
      // If demo account doesn't exist yet, we register it!
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const userCred = await createUserWithEmailAndPassword(auth, 'demo.curator@isabellasofia.com', 'isabellasofia123');
          await updateProfile(userCred.user, { displayName: 'Alexandra de Sofia' });
          showToast('VIP Demo Curator Account Provisioned & Logged In', 'success');
        } catch (regErr) {
          console.error("Error creating demo account: ", regErr);
          showToast('Could not register demo profile. Logging in anonymously...', 'info');
          await signInAnonymously(auth);
        }
      } else {
        console.error("Error signing in: ", err);
        showToast('Demoprofile error, logging in anonymously...', 'info');
        await signInAnonymously(auth);
      }
    } finally {
      setLoadingAction(false);
    }
  };

  // Submit standard email login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fulfill all credentials', 'error');
      return;
    }
    setLoadingAction(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Welcome back to Isabella Sofia', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  // Submit standard registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      showToast('Please fulfill all credentials', 'error');
      return;
    }
    setLoadingAction(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName });
      showToast('Welcome to our elite circle of curation', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Account creation failed', 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  // Submit saved address details
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine || !city || !postalCode) {
      showToast('Please complete shipping details', 'error');
      return;
    }
    setLoadingAction(true);
    await saveAddress({ addressLine, city, postalCode, country });
    setLoadingAction(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      showToast('Signed out of curator ledger', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Wishlisted Products objects
  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <section 
      id="customer-portal-section"
      className="max-w-6xl mx-auto px-6 md:px-12 py-24 sm:py-32 min-h-[80vh] flex flex-col justify-center bg-[#080808]"
    >
      {loadingAuth ? (
        <div id="portal-loader" className="flex flex-col items-center justify-center py-20 text-center">
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin mb-4" />
          <span className="text-[10px] tracking-widest text-[#F5F5F0]/60 font-medium uppercase">
            Loading Isabella Sofia Ledger...
          </span>
        </div>
      ) : !currentUser ? (
        /* ================= AUTHENTICATION FORMS ================= */
        <div id="unauthenticated-block" className="max-w-md w-full mx-auto bg-[#0D0D0D] border border-white/10 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)] rounded-none">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl text-[#F5F5F0] tracking-wide font-light mb-2">
              Curator Portal
            </h2>
            <p className="text-gold-400/80 text-[10px] tracking-widest uppercase">
              SECURE ACCESS TO ORDERS, WISHLIST & PROFILE
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex border-b border-white/5 mb-8 text-[11px] font-semibold tracking-widest">
            <button
              id="auth-tab-login"
              onClick={() => setAuthMode('login')}
              className={`flex-1 text-center pb-3 uppercase transition-colors ${
                authMode === 'login' ? 'text-gold-400 border-b-2 border-gold-400 font-bold' : 'text-[#F5F5F0]/40 hover:text-[#F5F5F0]'
              }`}
            >
              Sign In
            </button>
            <button
              id="auth-tab-register"
              onClick={() => setAuthMode('register')}
              className={`flex-1 text-center pb-3 uppercase transition-colors ${
                authMode === 'register' ? 'text-gold-400 border-b-2 border-gold-400 font-bold' : 'text-[#F5F5F0]/40 hover:text-[#F5F5F0]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Single-Click Instant Demo Login (For portfolio reviewers!) */}
          <div className="bg-gold-400/5 p-4 border border-gold-400/15 text-center mb-6">
            <p className="text-[10px] text-[#F5F5F0]/60 tracking-wider mb-2.5">
              Reviewing this project? Instant demo login preloads full order history & wishlist details.
            </p>
            <button
              id="demo-login-btn"
              onClick={handleDemoLogin}
              disabled={loadingAction}
              className="w-full bg-gold-400 hover:bg-gold-300 text-[#080808] text-[10px] tracking-widest font-bold py-2.5 transition-colors focus:outline-none flex items-center justify-center gap-1.5 rounded-none shadow-md"
            >
              {loadingAction ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Key className="w-3.5 h-3.5" />
              )}
              AUTHENTICATE AS DEMO CLIENT
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              <motion.form
                id="login-form"
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleLoginSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[10px] tracking-widest text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">Email Address</label>
                  <input
                    id="login-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                    placeholder="curator@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">Password Ledger</label>
                  <input
                    id="login-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={loadingAction}
                  className="w-full bg-[#F5F5F0] hover:bg-gold-400 text-[#080808] text-[11px] tracking-[0.2em] font-bold py-4 mt-6 transition-colors focus:outline-none flex items-center justify-center rounded-none"
                >
                  {loadingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SECURE SIGN IN'}
                </button>
              </motion.form>
            ) : (
              <motion.form
                id="register-form"
                key="register"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleRegisterSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[10px] tracking-widest text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">Your Full Name</label>
                  <input
                    id="register-name-input"
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                    placeholder="Alexandra de Sofia"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">Email Address</label>
                  <input
                    id="register-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                    placeholder="curator@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">Secure Password</label>
                  <input
                    id="register-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                    placeholder="Minimum 6 characters"
                  />
                </div>

                <button
                  id="register-submit-btn"
                  type="submit"
                  disabled={loadingAction}
                  className="w-full bg-[#F5F5F0] hover:bg-gold-400 text-[#080808] text-[11px] tracking-[0.2em] font-bold py-4 mt-6 transition-colors focus:outline-none flex items-center justify-center rounded-none"
                >
                  {loadingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : 'CREATE SECURE ACCOUNT'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* ================= AUTHENTICATED PORTAL VIEW ================= */
        <div id="authenticated-block" className="space-y-12">
          {/* Welcome Header bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
            <div>
              <span className="text-[10px] tracking-[0.3em] font-medium text-gold-400 uppercase">
                ISABELLA SOFIA CURATOR LEDGER
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F5F0] tracking-wide font-light mt-1">
                Welcome, {currentUser.displayName || 'Alexandra'}
              </h2>
            </div>
            
            <button
              id="sign-out-btn"
              onClick={handleSignOut}
              className="flex items-center gap-2 self-start border border-white/10 hover:border-red-400 hover:text-red-400 text-[#F5F5F0] px-5 py-2.5 text-[10px] tracking-widest font-semibold uppercase transition-colors rounded-none"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>LOGOUT</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Nav menu */}
            <div className="lg:col-span-3 flex flex-col space-y-1 text-xs tracking-widest font-semibold uppercase text-[#F5F5F0]/50">
              <button
                id="portal-tab-wishlist"
                onClick={() => setActivePortalTab('wishlist')}
                className={`text-left px-4 py-3.5 flex items-center gap-3 transition-colors rounded-none ${
                  activePortalTab === 'wishlist' ? 'bg-gold-400 text-[#080808] font-bold' : 'hover:bg-white/5 hover:text-[#F5F5F0]'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>My Wishlist ({wishlist.length})</span>
              </button>

              <button
                id="portal-tab-orders"
                onClick={() => setActivePortalTab('orders')}
                className={`text-left px-4 py-3.5 flex items-center gap-3 transition-colors rounded-none ${
                  activePortalTab === 'orders' ? 'bg-gold-400 text-[#080808] font-bold' : 'hover:bg-white/5 hover:text-[#F5F5F0]'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Order History ({userOrders.length})</span>
              </button>

              <button
                id="portal-tab-address"
                onClick={() => setActivePortalTab('address')}
                className={`text-left px-4 py-3.5 flex items-center gap-3 transition-colors rounded-none ${
                  activePortalTab === 'address' ? 'bg-gold-400 text-[#080808] font-bold' : 'hover:bg-white/5 hover:text-[#F5F5F0]'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Shipping Address</span>
              </button>
            </div>

            {/* Right details block */}
            <div className="lg:col-span-9 bg-[#0D0D0D] p-6 sm:p-8 border border-white/10 rounded-none shadow-[0_4px_30px_rgba(0,0,0,0.4)] min-h-[400px]">
              <AnimatePresence mode="wait">
                
                {/* Wishlist Pane */}
                {activePortalTab === 'wishlist' && (
                  <motion.div
                    key="tab-wishlist"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="font-serif text-lg text-[#F5F5F0] font-light border-b border-white/5 pb-3">
                      My Curator Wishlist
                    </h3>

                    {wishlistedProducts.length === 0 ? (
                      <div className="text-center py-16 text-[#F5F5F0]/40">
                        <Heart className="w-8 h-8 text-white/5 mx-auto mb-3" />
                        <p className="text-sm font-serif italic font-light mb-1">Your curated list is currently empty</p>
                        <p className="text-[10px] tracking-wide font-light uppercase">ADD ITEMS TO FAVORITES TO SAVE THEM HERE</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {wishlistedProducts.map((product) => (
                          <div 
                            key={product.id}
                            className="flex border border-white/10 bg-[#121212] p-4 gap-4 items-center justify-between rounded-none"
                          >
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-16 h-20 object-cover bg-[#151515] border border-white/5 cursor-pointer flex-shrink-0"
                              onClick={() => setSelectedProduct(product)}
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 flex flex-col justify-between min-w-0 px-2">
                              <div>
                                <h4 className="font-serif text-[14px] font-medium text-[#F5F5F0] truncate leading-snug">
                                  {product.name}
                                </h4>
                                <span className="font-mono text-xs font-semibold text-gold-400">
                                  ${product.price.toLocaleString()}
                                </span>
                              </div>
                              <button
                                id={`wishlist-add-to-cart-${product.id}`}
                                onClick={() => addToCart(product, 1, 'Standard')}
                                className="text-gold-400 hover:text-gold-300 text-[10px] tracking-wider font-bold uppercase mt-2 text-left flex items-center gap-1"
                              >
                                <span>ADD TO BAG</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              id={`wishlist-remove-${product.id}`}
                              onClick={() => toggleWishlist(product.id)}
                              className="text-[#F5F5F0]/40 hover:text-red-400 transition-colors p-2 text-lg"
                              aria-label="Remove item"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Orders History Pane */}
                {activePortalTab === 'orders' && (
                  <motion.div
                    key="tab-orders"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="font-serif text-lg text-[#F5F5F0] font-light border-b border-white/5 pb-3">
                      Order Ledger
                    </h3>

                    {userOrders.length === 0 ? (
                      <div className="text-center py-16 text-[#F5F5F0]/40">
                        <ShoppingBag className="w-8 h-8 text-white/5 mx-auto mb-3" />
                        <p className="text-sm font-serif italic font-light mb-1">No completed transactions found</p>
                        <p className="text-[10px] tracking-wide font-light uppercase">COMPLETED CHECKOUT PURCHASES WILL BE LOGGED HERE</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {userOrders.map((order) => (
                          <div 
                            key={order.id}
                            className="border border-white/10 bg-[#121212]/30 p-5 space-y-4 rounded-none"
                          >
                            {/* Header row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#151515] p-3 text-xs border-b border-white/5">
                              <div className="font-mono text-[11px]">
                                <span className="text-[#F5F5F0]/40 uppercase font-medium mr-1.5">ORDER ID:</span>
                                <span className="font-bold text-[#F5F5F0]">{order.orderId || order.id}</span>
                              </div>
                              <div className="text-[#F5F5F0]/60 font-light">
                                <span className="font-mono">{new Date(order.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-widest text-[8px] px-2.5 py-1">
                                {order.status || 'Processing'}
                              </div>
                            </div>

                            {/* Items mapping */}
                            <div className="space-y-3">
                              {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 text-xs items-center justify-between">
                                  <div className="flex gap-3 items-center min-w-0">
                                    <img 
                                      src={item.image} 
                                      alt={item.name} 
                                      className="w-10 h-14 object-cover bg-[#151515] border border-white/5 flex-shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="truncate">
                                      <p className="font-serif text-[#F5F5F0] font-medium truncate max-w-[200px] sm:max-w-md">{item.name}</p>
                                      <p className="text-[9px] text-[#F5F5F0]/50 uppercase tracking-widest mt-0.5">
                                        QTY: {item.quantity} {item.selectedSize && `• SIZE: ${item.selectedSize}`}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-mono text-gold-400 font-semibold flex-shrink-0">
                                    ${(item.price * item.quantity).toLocaleString()}.00
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Financial Total block */}
                            <div className="flex justify-between items-center text-xs pt-3.5 border-t border-white/5">
                              <span className="text-[#F5F5F0]/40 uppercase tracking-widest font-semibold text-[9px]">Shipped To: {order.shippingAddress.name}</span>
                              <div className="text-right">
                                <span className="text-[#F5F5F0]/40 uppercase text-[9px] tracking-widest mr-2 font-medium">TOTAL PAID:</span>
                                <span className="font-mono font-bold text-gold-400 text-sm">
                                  ${order.total.toLocaleString()}.00 USD
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Address Settings Pane */}
                {activePortalTab === 'address' && (
                  <motion.div
                    key="tab-address"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="font-serif text-lg text-[#F5F5F0] font-light border-b border-white/5 pb-3">
                      Shipping Ledger Settings
                    </h3>
                    <form onSubmit={handleAddressSubmit} className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-[10px] tracking-widest text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">Street Address Line</label>
                        <input
                          id="address-form-line"
                          type="text"
                          required
                          value={addressLine}
                          onChange={(e) => setAddressLine(e.target.value)}
                          className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                          placeholder="e.g. 742 Evergreen Terrace"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-widest text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">City</label>
                          <input
                            id="address-form-city"
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0]"
                            placeholder="e.g. Springfield"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-widest text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">Postal Code</label>
                          <input
                            id="address-form-postal"
                            type="text"
                            required
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="w-full bg-[#121212] border border-white/10 focus:border-gold-400 px-4 py-3 text-xs focus:outline-none rounded-none text-[#F5F5F0] font-mono"
                            placeholder="e.g. 90210"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] tracking-widest text-[#F5F5F0]/40 uppercase mb-1.5 font-semibold">Country / Territory</label>
                        <select
                          id="address-form-country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
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
                        id="address-form-submit-btn"
                        type="submit"
                        disabled={loadingAction}
                        className="bg-[#F5F5F0] hover:bg-gold-400 text-[#080808] text-[10px] tracking-[0.25em] font-bold px-8 py-3.5 transition-colors focus:outline-none flex items-center justify-center rounded-none"
                      >
                        {loadingAction ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : 'SAVE DETAILS'}
                      </button>
                    </form>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
