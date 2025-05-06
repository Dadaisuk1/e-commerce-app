// src/app/contexts/OrderContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { Order, CartItem, OrderStatus } from "@/app/data";
import { generateOrderId } from "@/app/lib/utils";

// Define localStorage key
const ORDERS_KEY = "myAppOrders";

// --- Re-use helper function or define locally ---
// (Assuming it's defined elsewhere or copy it here if needed)
const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window !== "undefined") {
    try {
      const item = window.localStorage.getItem(key);
      // Add check for date strings and convert them back to Date objects
      if (item) {
        const parsed = JSON.parse(item);
        // Example: If 'orders' array contains date strings, parse them
        if (Array.isArray(parsed) && key === ORDERS_KEY) {
          return parsed.map((order) => ({
            ...order,
            orderDate: order.orderDate ? new Date(order.orderDate) : undefined,
            estimatedDelivery: order.estimatedDelivery
              ? new Date(order.estimatedDelivery)
              : undefined,
          })) as T;
        }
        return parsed;
      }
      return defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  }
  return defaultValue;
};

interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: Date;
}

interface OrderContextType {
  orders: Order[];
  notifications: Notification[];
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
  addNotification: (message: string) => void;
  markNotificationsRead: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  // --- Initialize state from localStorage ---
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromLocalStorage<Order[]>(ORDERS_KEY, [])
  );
  // Notifications are usually session-specific, not persisted
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // --- Effect to save orders to localStorage whenever it changes ---
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // Dates need to be stored as strings (ISO format is standard)
        window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
        console.log("Orders saved to localStorage");
      }
    } catch (error) {
      console.error(`Error writing orders to localStorage:`, error);
    }
  }, [orders]); // Dependency array: only run when orders changes

  // --- Functions (remain the same logic, just update state) ---

  const addNotification = useCallback((message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      read: false,
      timestamp: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

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
        orderDate: new Date(), // Store as Date object
        status: "Processing",
      };

      // Update state, which triggers the useEffect to save
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      addNotification(
        `Order #${newOrder.id.split("-")[1]} placed successfully!`
      );
      return newOrder;
    },
    [addNotification]
  );

  const getOrderById = useCallback(
    (orderId: string): Order | undefined => {
      // Orders state already has Date objects thanks to loadFromLocalStorage
      return orders.find((order) => order.id === orderId);
    },
    [orders]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, newStatus: OrderStatus) => {
      let notificationMessage = "";
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.id === orderId && order.status !== newStatus) {
            const updatedOrder = { ...order, status: newStatus };
            notificationMessage = `Order #${
              orderId.split("-")[1]
            } status updated to ${newStatus}.`;
            if (newStatus === "Shipped") {
              updatedOrder.trackingNumber = `TN${Date.now()}`;
              const deliveryDate = new Date();
              deliveryDate.setDate(deliveryDate.getDate() + 5);
              updatedOrder.estimatedDelivery = deliveryDate; // Store as Date object
            } else if (newStatus === "Delivered") {
              if (!updatedOrder.estimatedDelivery) {
                updatedOrder.estimatedDelivery = new Date(); // Store as Date object
              }
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

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const value = useMemo(
    () => ({
      orders,
      notifications,
      placeOrder,
      getOrderById,
      updateOrderStatus,
      addNotification,
      markNotificationsRead,
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

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
