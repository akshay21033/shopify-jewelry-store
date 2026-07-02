export interface Product {
  id: string;
  name: string;
  category: 'Rings' | 'Necklaces' | 'Bracelets' | 'Earrings';
  price: number;
  description: string;
  details: string[];
  materials: string[];
  image: string;
  rating: number;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedEngraving?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    selectedSize?: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  address?: {
    name?: string;
    addressLine?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface Consultation {
  id: string;
  userId?: string;
  name: string;
  email: string;
  date: string;
  time: string;
  type: 'Bespoke Design' | 'Sizing & Fitting' | 'Gifting Advice';
  notes?: string;
  createdAt: string;
}
