// src/app/(shop)/checkout/page.tsx
"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/app/hooks/useCart";
import { useAuth } from "@/app/hooks/useAuth";
import { useOrders } from "@/app/hooks/useOrders";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/app/lib/utils";

// Simple form field component (can be moved to ui/ later)
const FormField = ({
  id,
  label,
  type = "text",
  required = true,
  value,
  onChange,
  autoComplete,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
  const [isLoading, setIsLoading] = useState(false); // For submission feedback

  // Pre-fill email if user is logged in
  const [email, setEmail] = useState(currentUser?.email || "");

  // Handle form input changes
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingAddress({ ...billingAddress, [e.target.name]: e.target.value });
    if (useBillingForShipping) {
      setShippingAddress({
        ...billingAddress,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseBillingForShipping(e.target.checked);
    if (e.target.checked) {
      setShippingAddress({ ...billingAddress }); // Copy billing to shipping
    } else {
      // Optionally clear shipping or leave as is
      // setShippingAddress({ firstName: '', lastName: '', address1: '', city: '', zip: '', country: 'Philippines' });
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    // Basic validation (more robust validation needed in a real app)
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
      // Call placeOrder from context
      const newOrder = placeOrder(
        cartItems,
        { subtotal, discountAmount, total, discountCode },
        finalShippingAddress,
        billingAddress,
        currentUser?.id || null // Pass user ID if logged in
      );

      // Clear the cart *after* successfully placing the order
      clearCart();

      console.log("Order placed successfully, redirecting...");
      // Redirect to order confirmation page
      router.push(`/order-confirmation/${newOrder.id}`);
    } catch (err) {
      console.error("Error placing order:", err);
      setError("There was an issue placing your order. Please try again.");
      setIsLoading(false);
    }

    // Note: No actual payment processing is simulated here.
  };

  // Redirect if cart is empty
  if (cartItems.length === 0 && !isLoading) {
    // Check isLoading to prevent redirect during submission
    // Optional: Show message instead of redirecting immediately
    // return <div className="container mx-auto px-4 py-16 text-center">Your cart is empty. <Link href="/" className="text-blue-600 hover:underline">Go shopping</Link></div>;
    // Redirecting:
    if (typeof window !== "undefined") {
      // Ensure this runs client-side
      router.replace("/cart"); // Use replace to avoid adding checkout to history
    }
    return null; // Render nothing while redirecting
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Info */}
            <section>
              <h2 className="text-xl font-semibold mb-3">
                Contact Information
              </h2>
              <FormField
                id="email"
                label="Email Address"
                type="email"
                required={true}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </section>

            {/* Billing Address */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Billing Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  id="firstName"
                  label="First Name"
                  value={billingAddress.firstName}
                  onChange={handleBillingChange}
                  autoComplete="billing given-name"
                />
                <FormField
                  id="lastName"
                  label="Last Name"
                  value={billingAddress.lastName}
                  onChange={handleBillingChange}
                  autoComplete="billing family-name"
                />
                <FormField
                  id="address1"
                  label="Address Line 1"
                  value={billingAddress.address1}
                  onChange={handleBillingChange}
                  autoComplete="billing address-line1"
                />
                <FormField
                  id="city"
                  label="City"
                  value={billingAddress.city}
                  onChange={handleBillingChange}
                  autoComplete="billing address-level2"
                />
                <FormField
                  id="zip"
                  label="ZIP / Postal Code"
                  value={billingAddress.zip}
                  onChange={handleBillingChange}
                  autoComplete="billing postal-code"
                />
                <FormField
                  id="country"
                  label="Country"
                  value={billingAddress.country}
                  onChange={handleBillingChange}
                  autoComplete="billing country-name"
                />
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Shipping Address</h2>
              <div className="flex items-center mb-4">
                <input
                  id="useBillingForShipping"
                  type="checkbox"
                  checked={useBillingForShipping}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="useBillingForShipping"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Same as billing address
                </label>
              </div>

              {!useBillingForShipping && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    id="firstName"
                    label="First Name"
                    value={shippingAddress.firstName}
                    onChange={handleShippingChange}
                    autoComplete="shipping given-name"
                  />
                  <FormField
                    id="lastName"
                    label="Last Name"
                    value={shippingAddress.lastName}
                    onChange={handleShippingChange}
                    autoComplete="shipping family-name"
                  />
                  <FormField
                    id="address1"
                    label="Address Line 1"
                    value={shippingAddress.address1}
                    onChange={handleShippingChange}
                    autoComplete="shipping address-line1"
                  />
                  <FormField
                    id="city"
                    label="City"
                    value={shippingAddress.city}
                    onChange={handleShippingChange}
                    autoComplete="shipping address-level2"
                  />
                  <FormField
                    id="zip"
                    label="ZIP / Postal Code"
                    value={shippingAddress.zip}
                    onChange={handleShippingChange}
                    autoComplete="shipping postal-code"
                  />
                  <FormField
                    id="country"
                    label="Country"
                    value={shippingAddress.country}
                    onChange={handleShippingChange}
                    autoComplete="shipping country-name"
                  />
                </div>
              )}
            </section>

            {/* Payment Section Placeholder */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Payment</h2>
              <div className="p-4 border rounded-md bg-gray-50 text-gray-600">
                <p>This is a prototype. No real payment is required.</p>
                <p>Clicking 'Place Order' will simulate a successful order.</p>
                {/* In a real app, you'd integrate Stripe Elements, PayPal, etc. here */}
              </div>
            </section>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary (Right Sidebar) */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 shadow-sm h-fit bg-white lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Order Summary
            </h2>
            {/* Display Cart Items Mini */}
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{item.quantity} x</span>
                    <span>{item.name}</span>
                  </div>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="space-y-2 mb-4 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({discountCode}):</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>FREE</span> {/* Placeholder */}
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>{" "}
                {/* Assuming total includes shipping if any */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
