// src/app/(shop)/cart/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/hooks/useCart";
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

export default function CartPage() {
  const {
    cartItems,
    savedItems,
    subtotal,
    discountAmount,
    total,
    applyDiscount,
    discountCode,
    clearCart,
  } = useCart();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [couponInput, setCouponInput] = useState("");
  const [showLoginAlert, setShowLoginAlert] = useState(false);

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

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

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
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Your Cart is Empty
            </CardTitle>
            <CardDescription className="text-gray-600 pt-2">
              Looks like you haven't added anything yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
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
  );
}
