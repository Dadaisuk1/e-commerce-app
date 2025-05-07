// src/app/data/index.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number; // 0 means out of stock
  description?: string;
  category?: string; // Optional category for better organization
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

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
}
