export interface Product {
  id: string;
  _id?: string;
  productName: string;
  brandName: string;
  category: string;
  productImage: string[];
  description: string;
  price: number;
  sellingPrice: number;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'GENERAL';
  profilePic?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  _id?: string;
  userId: string;
  productId: string | Product;
  quantity: number;
  product?: Product;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  _id?: string;
  userId: string;
  amount?: number;
  totalAmount?: number;
  currency?: string;
  orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PAID' | 'FAILED' | 'REFUNDED';
  stripeSessionId?: string;
  shippingAddress?: any;
  items: OrderItem[] | any[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  error?: boolean;
  message?: string;
  data?: T;
}
