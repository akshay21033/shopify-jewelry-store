import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Product, CartItem, Order, UserProfile, Consultation } from '../types';
import { PRODUCTS } from '../data';

interface AppContextType {
  // Navigation & UI State
  activeTab: 'home' | 'shop' | 'story' | 'consult' | 'account';
  setActiveTab: (tab: 'home' | 'shop' | 'story' | 'consult' | 'account') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  checkoutActive: boolean;
  setCheckoutActive: (active: boolean) => void;

  // Search, Filters & Catalog
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedMaterial: string;
  setSelectedMaterial: (mat: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;

  // Cart Management
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, engraving?: string) => void;
  removeFromCart: (productId: string, size?: string, engraving?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string, engraving?: string) => void;
  clearCart: () => void;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  couponDiscount: number; // Percentage, e.g. 10 for 10%
  cartSubtotal: number;
  cartTotal: number;

  // Wishlist
  wishlist: string[]; // List of product IDs
  toggleWishlist: (productId: string) => void;

  // Auth & Account
  currentUser: User | null;
  userProfile: UserProfile | null;
  loadingAuth: boolean;
  userOrders: Order[];
  refreshOrders: () => Promise<void>;
  saveAddress: (address: NonNullable<UserProfile['address']>) => Promise<void>;

  // Toasts / Notifications
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Consultations
  bookConsultation: (consultation: Omit<Consultation, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'story' | 'consult' | 'account'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [checkoutActive, setCheckoutActive] = useState<boolean>(false);

  // Search & Catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('isabella_sofia_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('isabella_sofia_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Auth & Profile
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('isabella_sofia_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync Wishlist to LocalStorage
  useEffect(() => {
    localStorage.setItem('isabella_sofia_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Handle Firebase Auth & Realtime synchronization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Sync wishlist and user profile from Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: data.displayName || '',
            address: data.address || undefined
          });

          // Sync server wishlist if present
          if (data.wishlist && Array.isArray(data.wishlist)) {
            // Merge with local wishlist
            const merged = Array.from(new Set([...wishlist, ...data.wishlist]));
            setWishlist(merged);
            // Update Firestore with merged list
            await updateDoc(userRef, { wishlist: merged });
          }
        } else {
          // Create user document if not exists
          const initialProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            wishlist: wishlist
          };
          await setDoc(userRef, initialProfile);
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
          });
        }

        // Setup realtime sync for orders
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef, 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const unsubOrders = onSnapshot(q, (snapshot) => {
          const orders: Order[] = [];
          snapshot.forEach((doc) => {
            orders.push({ id: doc.id, ...doc.data() } as Order);
          });
          setUserOrders(orders);
        }, (err) => {
          console.error("Error listening to orders: ", err);
        });

        // Cleanup listener when auth state changes or user logs out
        return () => {
          unsubOrders();
        };

      } else {
        setUserProfile(null);
        setUserOrders([]);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Update cloud wishlist when local wishlist changes and user is logged in
  useEffect(() => {
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      updateDoc(userRef, { wishlist }).catch(err => console.error("Error updating wishlist in cloud: ", err));
    }
  }, [wishlist, currentUser]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Cart Actions
  const addToCart = (product: Product, quantity = 1, size?: string, engraving?: string) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => 
          item.product.id === product.id && 
          item.selectedSize === size && 
          item.selectedEngraving === engraving
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        showToast(`Updated ${product.name} in your selection`, 'success');
        return newCart;
      } else {
        showToast(`Added ${product.name} to your selection`, 'success');
        return [...prevCart, { product, quantity, selectedSize: size, selectedEngraving: engraving }];
      }
    });
  };

  const removeFromCart = (productId: string, size?: string, engraving?: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter(
        (item) => 
          !(item.product.id === productId && 
            item.selectedSize === size && 
            item.selectedEngraving === engraving)
      );
      showToast("Item removed from cart", "info");
      return newCart;
    });
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string, engraving?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, engraving);
      return;
    }
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (
          item.product.id === productId && 
          item.selectedSize === size && 
          item.selectedEngraving === engraving
        ) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setCouponDiscount(0);
  };

  const applyCoupon = (code: string): boolean => {
    const formatted = code.toUpperCase().trim();
    if (formatted === 'SOFIA10') {
      setCouponCode(formatted);
      setCouponDiscount(10);
      showToast('Offer code SOFIA10 applied: 10% Off', 'success');
      return true;
    } else if (formatted === 'WELCOME15') {
      setCouponCode(formatted);
      setCouponDiscount(15);
      showToast('Offer code WELCOME15 applied: 15% Off', 'success');
      return true;
    } else {
      showToast('Invalid offer code', 'error');
      return false;
    }
  };

  // Wishlist Actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed from curated wishlist", "info");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Saved to curated wishlist", "success");
        return [...prev, productId];
      }
    });
  };

  // Refresh Orders (Force read)
  const refreshOrders = async () => {
    if (!currentUser) return;
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', currentUser.uid));
      const snap = await getDocs(q);
      const orders: Order[] = [];
      snap.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      setUserOrders(orders);
    } catch (err) {
      console.error("Error fetching orders: ", err);
    }
  };

  // Save Address settings
  const saveAddress = async (address: NonNullable<UserProfile['address']>) => {
    if (!currentUser) {
      showToast("Sign in to save your address details", "error");
      return;
    }
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { address });
      setUserProfile((prev) => prev ? { ...prev, address } : null);
      showToast("Delivery address updated successfully", "success");
    } catch (err) {
      console.error("Error saving address: ", err);
      showToast("Could not update address settings", "error");
    }
  };

  // Book Consultation
  const bookConsultation = async (consultationData: Omit<Consultation, 'id' | 'createdAt' | 'userId'>) => {
    try {
      const consultsRef = collection(db, 'consultations');
      const payload = {
        ...consultationData,
        userId: currentUser?.uid || 'guest',
        createdAt: new Date().toISOString()
      };
      await addDoc(consultsRef, payload);
      showToast(`Salon Consultation scheduled for ${consultationData.date} at ${consultationData.time}`, "success");
    } catch (err) {
      console.error("Error booking consultation: ", err);
      showToast("Scheduling failed. Please try again.", "error");
      throw err;
    }
  };

  // Math Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = cartSubtotal * (couponDiscount / 100);
  const cartTotal = cartSubtotal - discountAmount;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        checkoutActive,
        setCheckoutActive,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedMaterial,
        setSelectedMaterial,
        sortBy,
        setSortBy,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        couponCode,
        applyCoupon,
        couponDiscount,
        cartSubtotal,
        cartTotal,
        wishlist,
        toggleWishlist,
        currentUser,
        userProfile,
        loadingAuth,
        userOrders,
        refreshOrders,
        saveAddress,
        toast,
        showToast,
        bookConsultation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
