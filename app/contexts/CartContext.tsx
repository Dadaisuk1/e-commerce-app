// src/app/contexts/CartContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { Product, CartItem } from "../../app/data";

// Interface for saved items (can be simpler than CartItem if quantity isn't needed, but using CartItem is easier)
type SavedItem = CartItem; // Use CartItem structure for simplicity

// Define the shape of the context data
interface CartContextType {
  cartItems: CartItem[];
  savedItems: SavedItem[]; // Add state for saved items
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyDiscount: (code: string) => void;
  clearCart: () => void;
  saveForLater: (productId: string) => void; // Add function to save
  moveToCart: (productId: string) => void; // Add function to move back to cart
  removeFromSaved: (productId: string) => void; // Add function to remove from saved
  subtotal: number;
  total: number;
  discountCode: string | null;
  discountAmount: number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]); // State for saved items
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  // --- Core Cart Logic --- (addToCart, removeFromCart, updateQuantity remain mostly the same)

  const addToCart = useCallback(
    (product: Product, quantity: number) => {
      // Check stock before adding/updating
      const existingCartItem = cartItems.find((item) => item.id === product.id);
      const currentQuantityInCart = existingCartItem?.quantity || 0;
      const potentialTotalQuantity = currentQuantityInCart + quantity;

      if (product.stock < potentialTotalQuantity) {
        alert(
          `Sorry, only ${product.stock} of ${product.name} available in total.`
        );
        return;
      }

      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem) {
          // Increase quantity
          return prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item
          return [...prevItems, { ...product, quantity }];
        }
      });
      console.log(`Added ${quantity} of ${product.name} to cart`);
    },
    [cartItems]
  ); // Add cartItems dependency as we read it now

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
    console.log(`Removed item ${productId} from cart`);
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      setCartItems((prevItems) => {
        const itemToUpdate = prevItems.find((item) => item.id === productId);
        if (!itemToUpdate) return prevItems;

        if (newQuantity <= 0) {
          return prevItems.filter((item) => item.id !== productId);
        } else if (newQuantity > itemToUpdate.stock) {
          alert(
            `Sorry, only ${itemToUpdate.stock} of ${itemToUpdate.name} available.`
          );
          return prevItems;
        } else {
          return prevItems.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          );
        }
      });
      console.log(`Updated quantity for item ${productId} to ${newQuantity}`);
    },
    []
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    setDiscountCode(null);
    console.log("Cart cleared");
  }, []);

  const applyDiscount = useCallback((code: string) => {
    if (code.toUpperCase() === "SAVE10") {
      setDiscountCode("SAVE10");
      alert("Discount SAVE10 applied!");
    } else {
      alert("Invalid discount code.");
      setDiscountCode(null);
    }
  }, []);

  // --- Save for Later Logic ---

  const saveForLater = useCallback(
    (productId: string) => {
      const itemToSave = cartItems.find((item) => item.id === productId);
      if (itemToSave) {
        // Remove from cart
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
        // Add to saved items (ensure no duplicates in saved list)
        setSavedItems((prev) => {
          if (prev.some((saved) => saved.id === productId)) {
            return prev; // Already saved, do nothing
          }
          return [...prev, itemToSave];
        });
        console.log(`Saved item ${productId} for later.`);
      }
    },
    [cartItems]
  ); // Depends on cartItems

  const moveToCart = useCallback(
    (productId: string) => {
      const itemToMove = savedItems.find((item) => item.id === productId);
      if (itemToMove) {
        // Check stock before moving back
        const currentQuantityInCart =
          cartItems.find((cartItem) => cartItem.id === productId)?.quantity ||
          0;
        const potentialTotalQuantity =
          currentQuantityInCart + itemToMove.quantity; // Use quantity from saved item

        if (itemToMove.stock < potentialTotalQuantity) {
          alert(
            `Cannot move ${itemToMove.name} back to cart. Only ${itemToMove.stock} available in total.`
          );
          return;
        }

        // Remove from saved items
        setSavedItems((prev) => prev.filter((item) => item.id !== productId));
        // Add back to cart (or update quantity if already exists - edge case)
        setCartItems((prevCart) => {
          const existingCartItem = prevCart.find(
            (cartItem) => cartItem.id === productId
          );
          if (existingCartItem) {
            // Item somehow got back in cart? Update quantity.
            return prevCart.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity + itemToMove.quantity } // Add quantities
                : item
            );
          } else {
            // Add new item
            return [...prevCart, itemToMove];
          }
        });
        console.log(`Moved item ${productId} back to cart.`);
      }
    },
    [savedItems, cartItems]
  ); // Depends on both savedItems and cartItems

  const removeFromSaved = useCallback((productId: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== productId));
    console.log(`Removed item ${productId} from saved list.`);
  }, []);

  // --- Calculated Values --- (remain the same, based on cartItems)
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    if (discountCode === "SAVE10") {
      return subtotal * 0.1;
    }
    return 0;
  }, [subtotal, discountCode]);

  const total = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  // --- Context Value ---
  const value = useMemo(
    () => ({
      cartItems,
      savedItems, // Expose saved items
      addToCart,
      removeFromCart,
      updateQuantity,
      applyDiscount,
      clearCart,
      saveForLater, // Expose new function
      moveToCart, // Expose new function
      removeFromSaved, // Expose new function
      subtotal,
      total,
      discountCode,
      discountAmount,
    }),
    [
      cartItems,
      savedItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      applyDiscount,
      clearCart,
      saveForLater,
      moveToCart,
      removeFromSaved, // Add new functions to dependency array
      subtotal,
      total,
      discountCode,
      discountAmount,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook remains the same, but now returns the extended context type
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
