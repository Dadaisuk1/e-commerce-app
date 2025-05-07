// src/app/(shop)/checkout/page.tsx
"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useCart } from "../../../app/hooks/useCart";
import { useAuth } from "../../../app/hooks/useAuth";
import { useOrders } from "../../../app/hooks/useOrders";
import { useRouter } from "next/navigation";
import { formatCurrency } from ".././../../app/lib/utils";
import { cn } from "../../lib/utils";

// Import Shadcn/ui components
import { Button } from "../../../src/components/ui/button";
import { Input } from "../../../src//components/ui/input";
import { Label } from "../../../src//components/ui/label";
import { Checkbox } from "../../../src//components/ui/checkbox";
import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "../../../src/components/ui/card";
import { Separator } from "../../../src/components/ui/separator";

// Reusable Shadcn Form Field Component
const ShadcnFormField = ({
  id,
  label,
  type = "text",
  required = true,
  value,
  onChange,
  autoComplete,
  disabled = false,
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      name={id}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      placeholder={label} // Use label as placeholder for simplicity
      disabled={disabled}
    />
  </div>
);

export default function CheckoutPage() {
  const {
    cartItems,
    subtotal,
    discountAmount,
    total,
    discountCode,
    clearCart,
  } = useCart();
  const { currentUser } = useAuth();
  const { placeOrder } = useOrders();
  const router = useRouter();

  // State for form fields
  const [billingAddress, setBillingAddress] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    zip: "",
    country: "Philippines",
  });
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    zip: "",
    country: "Philippines",
  });
  const [useBillingForShipping, setUseBillingForShipping] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill email if user is logged in
  const [email, setEmail] = useState(currentUser?.email || "");

  // Handle form input changes
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
    // Use a functional update for shipping if checkbox is checked to ensure latest billing state
    if (useBillingForShipping) {
      setShippingAddress((prevBilling) => ({ ...prevBilling, [name]: value }));
    }
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  // Handle checkbox change using Shadcn's onCheckedChange prop
  const handleCheckboxCheckedChange = (checked: boolean | "indeterminate") => {
    const isChecked = !!checked; // Convert 'indeterminate' to false
    setUseBillingForShipping(isChecked);
    if (isChecked) {
      setShippingAddress({ ...billingAddress }); // Copy billing to shipping
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const finalShippingAddress = useBillingForShipping
      ? billingAddress
      : shippingAddress;
    if (
      !email ||
      !billingAddress.firstName ||
      !billingAddress.address1 ||
      !billingAddress.city ||
      !billingAddress.zip ||
      !finalShippingAddress.firstName ||
      !finalShippingAddress.address1 ||
      !finalShippingAddress.city ||
      !finalShippingAddress.zip
    ) {
      setError("Please fill in all required address fields and email.");
      setIsLoading(false);
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      setIsLoading(false);
      return;
    }

    console.log("Submitting order...");

    try {
      const newOrder = placeOrder(
        cartItems,
        { subtotal, discountAmount, total, discountCode },
        finalShippingAddress,
        billingAddress,
        currentUser?.id || null
      );
      clearCart();
      console.log("Order placed successfully, redirecting...");
      router.push(`/order-confirmation/${newOrder.id}`);
    } catch (err) {
      console.error("Error placing order:", err);
      setError("There was an issue placing your order. Please try again.");
      setIsLoading(false);
    }
  };

  // Redirect if cart is empty (client-side effect)
  useEffect(() => {
    if (cartItems.length === 0 && !isLoading) {
      router.replace("/cart");
    }
  }, [cartItems, isLoading, router]);

  // Render null or loading indicator while redirecting or if cart is empty initially
  if (cartItems.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        Redirecting to cart...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Shipping & Billing Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Info */}
              <section>
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                  Contact Information
                </h3>
                <ShadcnFormField
                  id="email"
                  label="Email Address"
                  type="email"
                  required={true}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </section>

              {/* Billing Address */}
              <section>
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                  Billing Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ShadcnFormField
                    id="firstName"
                    label="First Name"
                    value={billingAddress.firstName}
                    onChange={handleBillingChange}
                    autoComplete="billing given-name"
                    disabled={isLoading}
                  />
                  <ShadcnFormField
                    id="lastName"
                    label="Last Name"
                    value={billingAddress.lastName}
                    onChange={handleBillingChange}
                    autoComplete="billing family-name"
                    disabled={isLoading}
                  />
                  <ShadcnFormField
                    id="address1"
                    label="Address Line 1"
                    value={billingAddress.address1}
                    onChange={handleBillingChange}
                    autoComplete="billing address-line1"
                    disabled={isLoading}
                  />
                  <ShadcnFormField
                    id="city"
                    label="City"
                    value={billingAddress.city}
                    onChange={handleBillingChange}
                    autoComplete="billing address-level2"
                    disabled={isLoading}
                  />
                  <ShadcnFormField
                    id="zip"
                    label="ZIP / Postal Code"
                    value={billingAddress.zip}
                    onChange={handleBillingChange}
                    autoComplete="billing postal-code"
                    disabled={isLoading}
                  />
                  <ShadcnFormField
                    id="country"
                    label="Country"
                    value={billingAddress.country}
                    onChange={handleBillingChange}
                    autoComplete="billing country-name"
                    disabled={isLoading}
                  />
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                  Shipping Address
                </h3>
                <div className="flex items-center space-x-2 mb-4">
                  {/* Use Shadcn Checkbox */}
                  <Checkbox
                    id="useBillingForShipping"
                    checked={useBillingForShipping}
                    onCheckedChange={handleCheckboxCheckedChange} // Use onCheckedChange
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="useBillingForShipping"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Same as billing address
                  </Label>
                </div>

                {!useBillingForShipping && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ShadcnFormField
                      id="firstName"
                      label="First Name"
                      value={shippingAddress.firstName}
                      onChange={handleShippingChange}
                      autoComplete="shipping given-name"
                      disabled={isLoading}
                    />
                    <ShadcnFormField
                      id="lastName"
                      label="Last Name"
                      value={shippingAddress.lastName}
                      onChange={handleShippingChange}
                      autoComplete="shipping family-name"
                      disabled={isLoading}
                    />
                    <ShadcnFormField
                      id="address1"
                      label="Address Line 1"
                      value={shippingAddress.address1}
                      onChange={handleShippingChange}
                      autoComplete="shipping address-line1"
                      disabled={isLoading}
                    />
                    <ShadcnFormField
                      id="city"
                      label="City"
                      value={shippingAddress.city}
                      onChange={handleShippingChange}
                      autoComplete="shipping address-level2"
                      disabled={isLoading}
                    />
                    <ShadcnFormField
                      id="zip"
                      label="ZIP / Postal Code"
                      value={shippingAddress.zip}
                      onChange={handleShippingChange}
                      autoComplete="shipping postal-code"
                      disabled={isLoading}
                    />
                    <ShadcnFormField
                      id="country"
                      label="Country"
                      value={shippingAddress.country}
                      onChange={handleShippingChange}
                      autoComplete="shipping country-name"
                      disabled={isLoading}
                    />
                  </div>
                )}
              </section>

              {/* Payment Section Placeholder */}
              <section>
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                  Payment
                </h3>
                <Card className="bg-muted/40">
                  {" "}
                  {/* Use muted background */}
                  <CardContent className="p-4 text-sm text-muted-foreground">
                    <p>This is a prototype. No real payment is required.</p>
                    <p>
                      Clicking &aptos;Place Order&aptos; will simulate a
                      successful order.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {error && (
                <p className="text-sm text-red-600 font-medium">{error}</p>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Order Summary Card (Right Sidebar) */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Display Cart Items Mini */}
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-2 text-sm">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start"
                  >
                    <div className="flex items-center space-x-2 mr-2">
                      {/* Optional: Small image */}
                      {/* <div className="relative w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">...</div> */}
                      <span className="font-medium">{item.quantity} x</span>
                      <span className="flex-shrink-1 break-words">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-right flex-shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              {/* Totals */}
              <div className="space-y-2 text-sm">
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
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>FREE</span> {/* Placeholder */}
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
