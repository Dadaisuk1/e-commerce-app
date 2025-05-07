// src/app/(shop)/checkout/page.tsx
"use client";

import React, { useState, FormEvent, useEffect } from "react";
// import Link from 'next/link'; // Link is not used directly on this page anymore
import { useCart } from "../../../app/hooks/useCart"; // Corrected import path
import { useAuth } from "../../../app/hooks/useAuth"; // Corrected import path
import { useOrders } from "../../../app/hooks/useOrders"; // Corrected import path
import { useRouter } from "next/navigation";
import { formatCurrency } from "../../../app/lib/utils";
import { sampleProducts } from "../../../app/data/products";

// Import Shadcn/ui components
import { Button } from "../../../src/components/ui/button";
import { Input } from "../../../src/components/ui/input";
import { Label } from "../../../src/components/ui/label";
import { Checkbox } from "../../../src/components/ui/checkbox";

import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "../../../src/components/ui/card"; // Corrected import path
import { Separator } from "../../../src/components/ui/separator"; // Corrected import path
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../src/components/ui/alert"; // Corrected import path
import { AlertTriangle } from "lucide-react"; // Icon for alert

// Reusable Shadcn Form Field Component
// (Ensure props type checking if desired, e.g., using React.FC or defining prop types)
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
      placeholder={label}
      disabled={disabled}
      className="cursor-pointer" // Added cursor-pointer based on user code, review if needed
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
  const [email, setEmail] = useState(currentUser?.email || "");

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
    if (useBillingForShipping) {
      setShippingAddress((prevBilling) => ({ ...prevBilling, [name]: value }));
    }
  };
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };
  const handleCheckboxCheckedChange = (checked: boolean | "indeterminate") => {
    const isChecked = !!checked;
    setUseBillingForShipping(isChecked);
    if (isChecked) {
      setShippingAddress({ ...billingAddress });
    }
  };

  // --- Updated handleSubmit with Inventory Check ---
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    // --- Basic Form Validation ---
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
    // --- End Basic Form Validation ---

    // --- Final Inventory Check ---
    let inventoryError = null;
    for (const cartItem of cartItems) {
      const currentProductData = sampleProducts.find(
        (p) => p.id === cartItem.id
      );
      const currentStock = currentProductData?.stock ?? 0;

      if (cartItem.quantity > currentStock) {
        inventoryError = `Insufficient stock for ${cartItem.name}. Only ${currentStock} available, but you have ${cartItem.quantity} in cart. Please adjust your cart.`;
        break;
      }
    }

    if (inventoryError) {
      setError(inventoryError);
      setIsLoading(false);
      return;
    }
    // --- End Final Inventory Check ---

    // --- Proceed if Inventory Check Passed ---
    console.log("Inventory check passed. Submitting order...");
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
  // --- End Updated handleSubmit ---

  useEffect(() => {
    if (cartItems.length === 0 && !isLoading) {
      router.replace("/cart");
    }
  }, [cartItems, isLoading, router]);

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
            {/* Display Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Checkout Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
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
                  <Checkbox
                    id="useBillingForShipping"
                    checked={useBillingForShipping}
                    onCheckedChange={handleCheckboxCheckedChange}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="useBillingForShipping"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {" "}
                    Same as billing address{" "}
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
                  <CardContent className="p-4 text-sm text-muted-foreground">
                    <p>This is a prototype. No real payment is required.</p>
                    {/* Corrected apostrophe */}
                    <p>
                      Clicking &apos;Place Order&apos; will simulate a
                      successful order if stock is available.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full cursor-pointer"
                >
                  {" "}
                  {/* Added cursor-pointer based on user code */}
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
              {" "}
              <CardTitle>Order Summary</CardTitle>{" "}
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-2 text-sm">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start"
                  >
                    {" "}
                    <div className="flex items-center space-x-2 mr-2">
                      {" "}
                      <span className="font-medium">
                        {item.quantity} x
                      </span>{" "}
                      <span className="flex-shrink-1 break-words">
                        {item.name}
                      </span>{" "}
                    </div>{" "}
                    <span className="text-right flex-shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>{" "}
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
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
                  <span>FREE</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
            {/* CardFooter was missing in user's provided code for this section, added back if needed */}
            {/* <CardFooter> ... </CardFooter> */}
          </Card>
        </div>
      </div>
    </div>
  );
}
