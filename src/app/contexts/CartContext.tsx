// src/app/contexts/CartContext.tsx
'use client'; // Context needs to be client-side

<<<<<<< HEAD
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { Product, CartItem } from "@/app/data";

// Define localStorage keys
const CART_ITEMS_KEY = "myAppCartItems";
const SAVED_ITEMS_KEY = "myAppSavedItems";
const DISCOUNT_CODE_KEY = "myAppDiscountCode"; // Key for discount code

// Helper function to safely get data from localStorage
const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window !== "undefined") {
    try {
      const item = window.localStorage.getItem(key);
      // Handle null specifically for discount code if needed, JSON.parse handles null fine
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  }
  return defaultValue;
};

type SavedItem = CartItem;
=======
import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';
import { Product, CartItem } from '@/app/data'; // Using import alias
>>>>>>> parent of 9d1fc42 (fully functional)

// Define the shape of the context data
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
<<<<<<< HEAD
  applyDiscount: (code: string) => boolean; // Return true on success, false on failure
  clearCart: () => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeFromSaved: (productId: string) => void;
=======
  applyDiscount: (code: string) => void; // Placeholder
  clearCart: () => void;
>>>>>>> parent of 9d1fc42 (fully functional)
  subtotal: number;
  total: number;
  discountCode: string | null;
  discountAmount: number;
}

// Create the context with a default value (can be null or an object matching the type)
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
<<<<<<< HEAD
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadFromLocalStorage<CartItem[]>(CART_ITEMS_KEY, [])
  );
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() =>
    loadFromLocalStorage<SavedItem[]>(SAVED_ITEMS_KEY, [])
  );
  // --- Initialize discountCode state from localStorage ---
  const [discountCode, setDiscountCode] = useState<string | null>(() =>
    loadFromLocalStorage<string | null>(DISCOUNT_CODE_KEY, null)
  );

  // --- Effects for saving to localStorage ---
  useEffect(() => {
    try {
      if (typeof window !== "undefined")
        window.localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error(`Error writing cartItems to localStorage:`, error);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined")
        window.localStorage.setItem(
          SAVED_ITEMS_KEY,
          JSON.stringify(savedItems)
        );
    } catch (error) {
      console.error(`Error writing savedItems to localStorage:`, error);
    }
  }, [savedItems]);

  // --- Effect to save discountCode to localStorage ---
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        if (discountCode) {
          window.localStorage.setItem(
            DISCOUNT_CODE_KEY,
            JSON.stringify(discountCode)
          );
          console.log("Discount code saved to localStorage");
        } else {
          window.localStorage.removeItem(DISCOUNT_CODE_KEY); // Remove if null
          console.log("Discount code removed from localStorage");
        }
      }
    } catch (error) {
      console.error(`Error writing discountCode to localStorage:`, error);
    }
  }, [discountCode]); // Run when discountCode changes

  // --- Core Cart Logic ---
  const addToCart = useCallback(
    (product: Product, quantity: number) => {
      const existingCartItem = cartItems.find((item) => item.id === product.id);
      const currentQuantityInCart = existingCartItem?.quantity || 0;
      const potentialTotalQuantity = currentQuantityInCart + quantity;
      if (product.stock < potentialTotalQuantity) {
        alert(
          `Sorry, only ${product.stock} of ${product.name} available in total.`
        );
=======
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  // --- Core Cart Logic ---

  const addToCart = useCallback((product: Product, quantity: number) => {
      if (product.stock < quantity) {
        alert(`Sorry, only ${product.stock} of ${product.name} available.`); // Basic feedback
>>>>>>> parent of 9d1fc42 (fully functional)
        return;
      }

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        if (existingItem) {
          // Check stock again for increasing quantity
          const potentialNewQuantity = existingItem.quantity + quantity;
           if (product.stock < potentialNewQuantity) {
             alert(`Sorry, only ${product.stock} of ${product.name} available. You already have ${existingItem.quantity} in cart.`);
             return prevItems; // Return previous state if adding exceeds stock
          }
          // Increase quantity
          return prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item
          return [...prevItems, { ...product, quantity }];
        }
      });
       console.log(`Added ${quantity} of ${product.name} to cart`); // Console feedback
  }, []); // No dependencies needed if only using setter and product argument

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    console.log(`Removed item ${productId} from cart`);
  }, []);

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCartItems(prevItems => {
       const itemToUpdate = prevItems.find(item => item.id === productId);
       if (!itemToUpdate) return prevItems; // Should not happen

       if (newQuantity <= 0) {
         // Remove item if quantity is 0 or less
         return prevItems.filter(item => item.id !== productId);
       } else if (newQuantity > itemToUpdate.stock) {
          alert(`Sorry, only ${itemToUpdate.stock} of ${itemToUpdate.name} available.`);
          // Optionally set quantity to max stock instead:
          // return prevItems.map(item =>
          //   item.id === productId ? { ...item, quantity: item.stock } : item
          // );
          return prevItems; // Keep original quantity if exceeds stock
       } else {
          // Update quantity
          return prevItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          );
<<<<<<< HEAD
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
      });
    },
    []
  );

  // --- Updated clearCart ---
  const clearCart = useCallback(() => {
    setCartItems([]);
    setSavedItems([]);
    setDiscountCode(null); // Set to null, triggers useEffect to remove from localStorage
    console.log("Cart, Saved Items, and Discount Code cleared");
  }, []);

  // --- Updated applyDiscount ---
  const applyDiscount = useCallback((code: string): boolean => {
    // Return boolean for success/failure
    if (code.toUpperCase() === "SAVE10") {
      setDiscountCode("SAVE10"); // Set state, triggers useEffect to save
      // alert('Discount SAVE10 applied!'); // Alert is now handled in CartPage
      return true; // Indicate success
    } else {
      setDiscountCode(null); // Set state to null, triggers useEffect to remove
      // alert('Invalid discount code.'); // Alert is now handled in CartPage
      return false; // Indicate failure
    }
  }, []); // No dependencies needed
=======
       }
    });
     console.log(`Updated quantity for item ${productId} to ${newQuantity}`);
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setDiscountCode(null); // Reset discount on clear
    console.log('Cart cleared');
  }, []);

  const applyDiscount = useCallback((code: string) => {
      if (code.toUpperCase() === 'SAVE10') {
          setDiscountCode('SAVE10');
          alert('Discount SAVE10 applied!');
      } else {
          alert('Invalid discount code.');
          setDiscountCode(null); // Ensure invalid code doesn't stick
      }
  }, []);
>>>>>>> parent of 9d1fc42 (fully functional)


  // --- Calculated Values ---
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

   const discountAmount = useMemo(() => {
        if (discountCode === 'SAVE10') {
            return subtotal * 0.10; // 10% discount
        }
        return 0;
    }, [subtotal, discountCode]);

   const total = useMemo(() => {
       return subtotal - discountAmount;
   }, [subtotal, discountAmount]);


  // --- Context Value ---
  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyDiscount,
    clearCart,
    subtotal,
    total,
    discountCode,
    discountAmount,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, applyDiscount, clearCart, subtotal, total, discountCode, discountAmount]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Create a custom hook for easy consumption
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
