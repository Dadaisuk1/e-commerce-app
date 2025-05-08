// src/app/data/index.ts

// Define categories
export type ProductCategory = 'Electronics' | 'Clothing' | 'Home Goods' | 'Books' | 'Sports';

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  description?: string;
  category: ProductCategory;
}

export interface CartItem extends Product {
  quantity: number;
}

// Add "Delayed" to the possible statuses
export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Delayed";

export interface Order {
  id: string;
  userId: string | null;
  items: CartItem[];
  subtotal: number;
  discountApplied: number;
  total: number;
  shippingAddress: Record<string, string>;
  billingAddress: Record<string, string>;
  orderDate: Date;
  status: OrderStatus;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  // Optional: Add a reason for delay later if needed
  // delayReason?: string;
}

// Type for saved items
export type SavedItem = CartItem;
