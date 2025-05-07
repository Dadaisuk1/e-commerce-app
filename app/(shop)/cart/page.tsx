// src/app/(shop)/cart/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../../../app/hooks/useCart";
import { CartItem } from "../../../app/components/CartItem";
import { formatCurrency } from "../../../app/lib/utils";
import { cn } from "../../../app/lib/utils";

// Import Shadcn/ui components
import { Button } from "../../../src/components/ui/button";
import { Input } from "../../../src/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../src/components/ui/card";
import { Separator } from "../../../src/components/ui/separator";
import { Label } from "../../../src/components/ui/label";
import { buttonVariants } from "../../../src/components/ui/button"; // Import buttonVariants

export default function CartPage() {
  const {
    cartItems,
    subtotal,
    discountAmount,
    total,
    applyDiscount,
    discountCode,
    clearCart,
  } = useCart();
  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = () => {
    applyDiscount(couponInput);
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Your Cart is Empty
            </CardTitle>
            <CardDescription className="text-gray-600 pt-2">
              Looks like you haven&apos;t added anything yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* This usage of asChild seems okay */}
            <Button asChild size="lg">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
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
          {/* Clear Cart Button */}
          <div className="text-right mt-4">
            <Button
              onClick={handleClearCart}
              variant="link"
              className="text-sm text-red-600 hover:text-red-700 h-auto p-0"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Totals */}
              <div className="space-y-2">
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
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <Separator />
              {/* Discount Code Input */}
              <div className="space-y-2 pt-2">
                <Label htmlFor="discount-code" className="text-sm font-medium">
                  Discount Code
                </Label>
                <div className="flex">
                  <Input
                    id="discount-code"
                    type="text"
                    placeholder="Enter code (e.g., SAVE10)"
                    value={couponInput}
                    onChange={(e) =>
                      setCouponInput(e.target.value.toUpperCase())
                    }
                    disabled={!!discountCode}
                    className={cn(
                      "rounded-r-none focus-visible:ring-offset-0 focus-visible:ring-0",
                      !!discountCode && "bg-gray-100"
                    )}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={!!discountCode || !couponInput}
                    className="rounded-l-none"
                    variant="secondary"
                  >
                    Apply
                  </Button>
                </div>
                {discountCode && (
                  <p className="text-sm text-green-600 pt-1">
                    Discount &apos;{discountCode}&apos; applied!
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              {/* This usage of asChild seems okay */}
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              {/* *** MODIFICATION START: Remove asChild, style Link directly *** */}
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: "link" }), // Apply button styles
                  "text-sm text-blue-600 h-auto p-0" // Keep custom styles
                )}
              >
                or Continue Shopping
              </Link>
              {/* *** MODIFICATION END *** */}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
