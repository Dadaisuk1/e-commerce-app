// src/app/contexts/OrderContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { Order, CartItem, OrderStatus } from "@/app/data"; // Import necessary types
import { generateOrderId } from "@/app/lib/utils"; // Utility to create unique IDs

// Define the shape of the context data
interface OrderContextType {
  orders: Order[];
  placeOrder: (
    cartItems: CartItem[],
    totalDetails: {
      subtotal: number;
      discountAmount: number;
      total: number;
      discountCode: string | null;
    },
    shippingAddress: Record<string, string>, // Simple object for address
    billingAddress: Record<string, string>,
    userId: string | null // From AuthContext
  ) => Order; // Return the created order
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void; // For simulation later
  // Add functions to get orders for a specific user later
}

// Create the context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Create a provider component
interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Function to place a new order
  const placeOrder = useCallback(
    (
      cartItems: CartItem[],
      totalDetails: {
        subtotal: number;
        discountAmount: number;
        total: number;
        discountCode: string | null;
      },
      shippingAddress: Record<string, string>,
      billingAddress: Record<string, string>,
      userId: string | null
    ): Order => {
      const newOrder: Order = {
        id: generateOrderId(), // Generate a unique ID
        userId: userId,
        items: [...cartItems], // Copy cart items
        subtotal: totalDetails.subtotal,
        discountApplied: totalDetails.discountAmount,
        total: totalDetails.total,
        shippingAddress: { ...shippingAddress },
        billingAddress: { ...billingAddress },
        orderDate: new Date(),
        status: "Processing", // Initial status
        // estimatedDelivery and trackingNumber will be added later
      };

      console.log("Placing new order:", newOrder);
      setOrders((prevOrders) => [...prevOrders, newOrder]);

      // IMPORTANT: We need to clear the cart after placing the order.
      // This requires access to the CartContext's clearCart function.
      // We'll handle this interaction in the CheckoutPage component itself for now.

      return newOrder; // Return the newly created order object
    },
    []
  ); // No dependencies needed for this simulation

  // Function to retrieve a specific order
  const getOrderById = useCallback(
    (orderId: string): Order | undefined => {
      return orders.find((order) => order.id === orderId);
    },
    [orders]
  );

  // Function to simulate updating order status (for tracking demo later)
  const updateOrderStatus = useCallback(
    (orderId: string, newStatus: OrderStatus) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.id === orderId) {
            console.log(`Updating order ${orderId} status to ${newStatus}`);
            const updatedOrder = { ...order, status: newStatus };
            // Add tracking/delivery info if shipped
            if (newStatus === "Shipped") {
              updatedOrder.trackingNumber = `TN${Date.now()}`;
              const deliveryDate = new Date();
              deliveryDate.setDate(deliveryDate.getDate() + 5); // Estimate 5 days
              updatedOrder.estimatedDelivery = deliveryDate;
            } else if (newStatus === "Delivered") {
              // Maybe update delivery date to now if not set
              if (!updatedOrder.estimatedDelivery) {
                updatedOrder.estimatedDelivery = new Date();
              }
            }
            return updatedOrder;
          }
          return order;
        })
      );
    },
    []
  );

  // Memoize the context value
  const value = useMemo(
    () => ({
      orders,
      placeOrder,
      getOrderById,
      updateOrderStatus,
    }),
    [orders, placeOrder, getOrderById, updateOrderStatus]
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

// Create a custom hook for easy consumption
export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
