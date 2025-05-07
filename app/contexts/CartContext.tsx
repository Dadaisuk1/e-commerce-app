// src/app/contexts/CartContext.tsx
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
import { Product, CartItem } from "../../app/data";
import { toast } from "sonner";

// Define localStorage keys
const CART_ITEMS_KEY = "myAppCartItems";
const SAVED_ITEMS_KEY = "myAppSavedItems";

// --- Helper function to safely get data from localStorage ---
const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window !== "undefined") {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  }
  return defaultValue;
};

type SavedItem = CartItem;

interface CartContextType {
  cartItems: CartItem[];
  savedItems: SavedItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyDiscount: (code: string) => void;
  clearCart: () => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeFromSaved: (productId: string) => void;
  subtotal: number;
  total: number;
  discountCode: string | null;
  discountAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadFromLocalStorage<CartItem[]>(CART_ITEMS_KEY, [])
  );
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() =>
    loadFromLocalStorage<SavedItem[]>(SAVED_ITEMS_KEY, [])
  );
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(savedItems));
    }
  }, [savedItems]);

  const addToCart = useCallback(
    (product: Product, quantity: number) => {
      const existingCartItem = cartItems.find((item) => item.id === product.id);
      const currentQuantityInCart = existingCartItem?.quantity || 0;
      const potentialTotalQuantity = currentQuantityInCart + quantity;

      if (product.stock < potentialTotalQuantity) {
        toast.error(
          `Sorry, only ${product.stock} of ${product.name} available in total.`
        );
        return;
      }

      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem) {
          toast.success(`${product.name} quantity updated in cart.`);
          return prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          toast.success(`${product.name} added to cart.`);
          return [...prevItems, { ...product, quantity }];
        }
      });
    },
    [cartItems]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
    toast.info("Item removed from cart.");
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      setCartItems((prevItems) => {
        const itemToUpdate = prevItems.find((item) => item.id === productId);
        if (!itemToUpdate) return prevItems;

        if (newQuantity <= 0) {
          toast.info(`${itemToUpdate.name} removed from cart.`);
          return prevItems.filter((item) => item.id !== productId);
        } else if (newQuantity > itemToUpdate.stock) {
          toast.error(
            `Sorry, only ${itemToUpdate.stock} of ${itemToUpdate.name} available.`
          );
          return prevItems;
        } else {
          toast.success(`${itemToUpdate.name} quantity updated.`);
          return prevItems.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          );
        }
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    setSavedItems([]);
    setDiscountCode(null);
    toast.success("Cart and saved items cleared.");
  }, []);

  const applyDiscount = useCallback((code: string) => {
    if (code.toUpperCase() === "SAVE10") {
      setDiscountCode("SAVE10");
      toast.success("You saved 10% using SAVE10.");
    } else {
      setDiscountCode(null);
      toast.error("The discount code you entered is not valid.");
    }
  }, []);

  const saveForLater = useCallback(
    (productId: string) => {
      const itemToSave = cartItems.find((item) => item.id === productId);
      if (itemToSave) {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
        setSavedItems((prev) => {
          if (prev.some((saved) => saved.id === productId)) return prev;
          toast("Item saved for later.");
          return [...prev, itemToSave];
        });
      }
    },
    [cartItems]
  );

  const moveToCart = useCallback(
    (productId: string) => {
      const itemToMove = savedItems.find((item) => item.id === productId);
      if (itemToMove) {
        const currentQuantityInCart =
          cartItems.find((cartItem) => cartItem.id === productId)?.quantity ||
          0;
        const potentialTotalQuantity =
          currentQuantityInCart + itemToMove.quantity;

        if (itemToMove.stock < potentialTotalQuantity) {
          toast.error(
            `Cannot move ${itemToMove.name} back to cart. Only ${itemToMove.stock} available in total.`
          );
          return;
        }

        setSavedItems((prev) => prev.filter((item) => item.id !== productId));
        setCartItems((prevCart) => {
          const existingCartItem = prevCart.find(
            (cartItem) => cartItem.id === productId
          );
          if (existingCartItem) {
            toast.success(`${itemToMove.name} quantity increased in cart.`);
            return prevCart.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity + itemToMove.quantity }
                : item
            );
          } else {
            toast.success(`${itemToMove.name} moved to cart.`);
            return [...prevCart, itemToMove];
          }
        });
      }
    },
    [savedItems, cartItems]
  );

  const removeFromSaved = useCallback((productId: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== productId));
    toast.info("Item removed from saved items.");
  }, []);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    if (discountCode === "SAVE10") return subtotal * 0.1;
    return 0;
  }, [subtotal, discountCode]);

  const total = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  const value = useMemo(
    () => ({
      cartItems,
      savedItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      applyDiscount,
      clearCart,
      saveForLater,
      moveToCart,
      removeFromSaved,
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
      removeFromSaved,
      subtotal,
      total,
      discountCode,
      discountAmount,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
