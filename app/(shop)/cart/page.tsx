"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../../../app/hooks/useCart";
import { useAuth } from "../../../app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { CartItem } from "../../../app/components/CartItem";
import { formatCurrency, cn } from "../../../app/lib/utils";
import { buttonVariants } from "../../../src/components/ui/button";

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
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleApplyCoupon = () => {
    applyDiscount(couponInput);
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
              Looks like you haven’t added anything yet.
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items + Saved Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length > 0 && (
              <div>
                <div className="space-y-4 cursor-default">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} isSavedItem={false} />
                  ))}
                </div>
                <div className="text-right mt-4">
                  <Button
                    variant="link"
                    className="text-sm text-red-600 hover:text-red-700 h-auto p-0 cursor-pointer"
                    onClick={() => setShowClearDialog(true)}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            )}

            {cartItems.length > 0 && savedItems.length > 0 && (
              <Separator className="my-8" />
            )}

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

          {/* Order Summary */}
          <div className="lg:col-span-1">
            {cartItems.length > 0 ? (
              <Card className="lg:sticky lg:top-24">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        onClick={handleApplyCoupon}
                        disabled={!!discountCode || !couponInput}
                        className="rounded-l-none cursor-pointer"
                        variant="secondary"
                      >
                        Apply
                      </Button>
                    </div>
                    {discountCode && (
                      <p className="text-sm text-green-600 pt-1">
                        Discount "{discountCode}" applied!
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    onClick={handleProceedToCheckout}
                    size="lg"
                    className="w-full cursor-pointer"
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

      {/* Login Alert */}
      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to proceed to checkout.
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

      {/* Clear Cart Confirm Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all items from your cart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={clearCart} className="cursor-pointer">
              Clear Cart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
