// src/app/(shop)/cart/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../../hooks/useCart";
import { CartItem } from "../../components/CartItem"; // Import the new component
import { formatCurrency } from "../../lib/utils";
// Import UI components if using Shadcn/ui or similar
// import { Button } from '@/app/components/ui/button';
// import { Input } from '@/app/components/ui/input';

export default function CartPage() {
  const {
    cartItems,
    subtotal,
    discountAmount,
    total,
    applyDiscount,
    discountCode,
    clearCart, // Added for potential "Clear Cart" button
  } = useCart();
  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = () => {
    applyDiscount(couponInput);
  };

  // Optional: Handle clearing the cart
  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
          {/* Optional Clear Cart Button */}
          <div className="text-right mt-4">
            <button
              onClick={handleClearCart}
              className="text-sm text-red-500 hover:text-red-700 hover:underline"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border rounded-lg p-6 shadow-sm h-fit bg-white lg:sticky lg:top-24">
          {" "}
          {/* Sticky summary on larger screens */}
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Order Summary
          </h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discountCode}):</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          {/* Discount Code Input */}
          <div className="mb-6 space-y-2">
            <label
              htmlFor="discount-code"
              className="block text-sm font-medium text-gray-700"
            >
              Discount Code
            </label>
            <div className="flex">
              <input
                id="discount-code"
                type="text"
                placeholder="Enter code (e.g., SAVE10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                disabled={!!discountCode} // Disable if already applied
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-gray-600 text-white rounded-r-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!!discountCode || !couponInput}
              >
                Apply
              </button>
            </div>
            {discountCode && (
              <p className="text-sm text-green-600 mt-1">
                Discount "{discountCode}" applied!
              </p>
            )}
          </div>
          {/* Checkout Button */}
          <Link href="/checkout">
            <button className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-lg font-semibold">
              Proceed to Checkout
            </button>
          </Link>
          <div className="text-center mt-4">
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              or Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
