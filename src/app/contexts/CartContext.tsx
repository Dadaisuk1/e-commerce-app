// src/app/contexts/CartContext.tsx
'use client'; // Context needs to be client-side

import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';
import { Product, CartItem } from '@/app/data'; // Using import alias

// Define the shape of the context data
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyDiscount: (code: string) => void; // Placeholder
  clearCart: () => void;
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  // --- Core Cart Logic ---

  const addToCart = useCallback((product: Product, quantity: number) => {
      if (product.stock < quantity) {
        alert(`Sorry, only ${product.stock} of ${product.name} available.`); // Basic feedback
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
