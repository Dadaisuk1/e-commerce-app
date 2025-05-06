// src/app/(shop)/cart/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/hooks/useCart";
<<<<<<< HEAD
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { CartItem } from "@/app/components/CartItem";
import { formatCurrency } from "@/app/lib/utils";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Import Shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle } from "lucide-react"; // Icons for dialog
=======
import { CartItem } from "@/app/components/CartItem"; // Import the new component
import { formatCurrency } from "@/app/lib/utils";
// Import UI components if using Shadcn/ui or similar
// import { Button } from '@/app/components/ui/button';
// import { Input } from '@/app/components/ui/input';
>>>>>>> parent of 9d1fc42 (fully functional)

export default function CartPage() {
  const {
    cartItems,
<<<<<<< HEAD
    savedItems,
=======
>>>>>>> parent of 9d1fc42 (fully functional)
    subtotal,
    discountAmount,
    total,
    applyDiscount,
    discountCode,
    clearCart, // Added for potential "Clear Cart" button
  } = useCart();
  const [couponInput, setCouponInput] = useState("");

  const [showDiscountAlert, setShowDiscountAlert] = useState(false);
  const [discountAlertInfo, setDiscountAlertInfo] = useState({
    title: "",
    message: "",
    success: false,
  });

  // --- Updated handleApplyCoupon ---
  const handleApplyCoupon = () => {
    // Simulate checking the coupon (replace with actual logic if needed)
    if (couponInput.toUpperCase() === "SAVE10") {
      applyDiscount(couponInput); // Call the context function which sets the discountCode state
      setDiscountAlertInfo({
        title: "Discount Applied!",
        message: `The discount code "${couponInput.toUpperCase()}" has been successfully applied.`,
        success: true,
      });
    } else {
      applyDiscount(""); // Ensure context resets discount if code is invalid
      setDiscountAlertInfo({
        title: "Invalid Code",
        message: `The discount code "${couponInput}" is not valid. Please try again.`,
        success: false,
      });
    }
    setShowDiscountAlert(true); // Show the dialog
    setCouponInput(""); // Clear input after attempt
  };

  // Optional: Handle clearing the cart
  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

<<<<<<< HEAD
  const handleProceedToCheckout = () => {
    if (currentUser) {
      router.push("/checkout");
    } else {
      setShowLoginAlert(true);
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  if (cartItems.length === 0 && savedItems.length === 0) {
=======
  if (cartItems.length === 0) {
>>>>>>> parent of 9d1fc42 (fully functional)
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
<<<<<<< HEAD
    <>
      {" "}
      {/* Use Fragment to allow multiple AlertDialog siblings */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (Cart Items + Saved Items) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Cart Items Section */}
            {cartItems.length > 0 && (
              <div>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} isSavedItem={false} />
                  ))}
                </div>
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
            )}

            {/* Separator if both sections have items */}
            {cartItems.length > 0 && savedItems.length > 0 && (
              <Separator className="my-8" />
            )}

            {/* Saved For Later Section */}
            {savedItems.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Saved For Later ({savedItems.length})
                </h2>
                <div className="space-y-4">
                  {savedItems.map((item) => (
                    <CartItem key={item.id} item={item} isSavedItem={true} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-1">
            {cartItems.length > 0 ? (
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
                    <Label
                      htmlFor="discount-code"
                      className="text-sm font-medium"
                    >
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
                        onClick={handleApplyCoupon} // Calls the updated handler
                        disabled={!!discountCode || !couponInput}
                        className="rounded-l-none"
                        variant="secondary"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    onClick={handleProceedToCheckout}
                    size="lg"
                    className="w-full"
                  >
                    Proceed to Checkout
                  </Button>
                  <Link
                    href="/"
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "text-sm text-blue-600 h-auto p-0"
                    )}
                  >
                    or Continue Shopping
                  </Link>
                </CardFooter>
              </Card>
            ) : (
              <Card className="lg:sticky lg:top-24 border-dashed">
                <CardContent className="p-6 text-center text-muted-foreground">
                  Your active cart is empty. Add items or move saved items to
                  proceed.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      {/* Login Alert Dialog (Keep as is) */}
      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to proceed to checkout. Please log in or
              create an account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGoToLogin}>
              Go to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* --- Discount Alert Dialog --- */}
      <AlertDialog open={showDiscountAlert} onOpenChange={setShowDiscountAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            {/* Add Icon based on success/failure */}
            <div className="flex items-center space-x-2">
              {discountAlertInfo.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <AlertDialogTitle>{discountAlertInfo.title}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              {discountAlertInfo.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* Only need an OK button (use AlertDialogAction for styling) */}
            <AlertDialogAction onClick={() => setShowDiscountAlert(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* --- End Discount Alert Dialog --- */}
    </>
=======
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
>>>>>>> parent of 9d1fc42 (fully functional)
  );
}
