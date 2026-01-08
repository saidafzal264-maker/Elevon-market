
export type Role = 'BUYER' | 'SELLER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  balance?: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  images: string[];
  videoUrl?: string;
  rating: number;
  reviewsCount: number;
  sellerId: string;
  stock: number;
}

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export type ViewType = 'HOME' | 'VIDEO_FEED' | 'SEARCH' | 'CART' | 'PROFILE' | 'SELLER_DASHBOARD' | 'ADMIN_PANEL';
