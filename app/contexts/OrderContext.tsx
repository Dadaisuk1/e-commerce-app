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
import { Order, CartItem, OrderStatus } from "../../app/data"; // Import necessary types
import { generateOrderId } from "../../app/lib/utils"; // Utility to create unique IDs

// Define the shape of a notification message
interface Notification {
  id: number; // Simple ID for key prop
  message: string;
  read: boolean;
  timestamp: Date;
}

// Define the shape of the context data
interface OrderContextType {
  orders: Order[];
  notifications: Notification[]; // Add notifications state
  placeOrder: (
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
  ) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  addNotification: (message: string) => void; // Function to add notifications
  markNotificationsRead: () => void; // Function to mark as read
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
  const [notifications, setNotifications] = useState<Notification[]>([]); // State for notifications

  // Helper to add a notification
  const addNotification = useCallback((message: string) => {
    const newNotification: Notification = {
      id: Date.now(), // Simple unique ID based on timestamp
      message,
      read: false,
      timestamp: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]); // Add to the beginning of the list
    console.log(`Notification added: ${message}`);
  }, []);

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
        id: generateOrderId(),
        userId: userId,
        items: [...cartItems],
        subtotal: totalDetails.subtotal,
        discountApplied: totalDetails.discountAmount,
        total: totalDetails.total,
        shippingAddress: { ...shippingAddress },
        billingAddress: { ...billingAddress },
        orderDate: new Date(),
        status: "Processing",
      };

      console.log("Placing new order:", newOrder);
      setOrders((prevOrders) => [...prevOrders, newOrder]);

      // Add notification for order placement
      addNotification(
        `Order #${newOrder.id.split("-")[1]} placed successfully!`
      );

      // Cart clearing is handled in CheckoutPage after this function returns the order

      return newOrder;
    },
    [addNotification]
  ); // Add addNotification dependency

  // Function to retrieve a specific order
  const getOrderById = useCallback(
    (orderId: string): Order | undefined => {
      return orders.find((order) => order.id === orderId);
    },
    [orders]
  );

  // Function to simulate updating order status
  const updateOrderStatus = useCallback(
    (orderId: string, newStatus: OrderStatus) => {
      let notificationMessage = "";

      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.id === orderId && order.status !== newStatus) {
            console.log(`Updating order ${orderId} status to ${newStatus}`);
            const updatedOrder = { ...order, status: newStatus };

            // Status-based logic
            if (newStatus === "Shipped") {
              updatedOrder.trackingNumber = `TN${Date.now()}`;
              const deliveryDate = new Date();
              deliveryDate.setDate(deliveryDate.getDate() + 5);
              updatedOrder.estimatedDelivery = deliveryDate;
              notificationMessage = `Order #${
                orderId.split("-")[1]
              } has been shipped.`;
            } else if (newStatus === "Delivered") {
              if (!updatedOrder.estimatedDelivery) {
                updatedOrder.estimatedDelivery = new Date();
              }
              notificationMessage = `Order #${
                orderId.split("-")[1]
              } was delivered.`;
            } else if (newStatus === "Delayed") {
              if (updatedOrder.estimatedDelivery) {
                const delayedDate = new Date(updatedOrder.estimatedDelivery);
                delayedDate.setDate(delayedDate.getDate() + 3);
                updatedOrder.estimatedDelivery = delayedDate;
              }
              notificationMessage = `Order #${
                orderId.split("-")[1]
              } has been delayed.`;
            } else {
              notificationMessage = `Order #${
                orderId.split("-")[1]
              } status updated to ${newStatus}.`;
            }

            return updatedOrder;
          }
          return order;
        })
      );

      if (notificationMessage) {
        addNotification(notificationMessage);
      }
    },
    [addNotification]
  );

  // Function to mark all notifications as read
  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    console.log("Marked all notifications as read");
  }, []);

  // Memoize the context value
  const value = useMemo(
    () => ({
      orders,
      notifications, // Include notifications
      placeOrder,
      getOrderById,
      updateOrderStatus,
      addNotification, // Expose addNotification if needed directly
      markNotificationsRead, // Expose mark as read function
    }),
    [
      orders,
      notifications,
      placeOrder,
      getOrderById,
      updateOrderStatus,
      addNotification,
      markNotificationsRead,
    ]
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

// Update the hook export if needed (though usually done in a separate file)
export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
