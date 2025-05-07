// src/app/(shop)/order-confirmation/[orderId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Importing Image component from Next.js
import { useParams } from "next/navigation"; // Hook to get dynamic route params
import { useOrders } from "../../../hooks/useOrders";
import { Order } from "../../../data"; // Import the Order type
import { formatCurrency } from "../../../lib/utils";

export default function OrderConfirmationPage() {
  const params = useParams(); // Get route parameters
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState<Order | null | undefined>(undefined); // State for the order, undefined means loading

  // Extract orderId, ensuring it's a string
  const orderId =
    typeof params.orderId === "string" ? params.orderId : undefined;

  useEffect(() => {
    if (orderId) {
      console.log(`Fetching order details for ID: ${orderId}`);
      const foundOrder = getOrderById(orderId);
      setOrder(foundOrder); // Set order state (will be the order object or undefined if not found)
      if (!foundOrder) {
        console.warn(`Order with ID ${orderId} not found in context.`);
      }
    } else {
      console.error("Order ID not found in URL parameters.");
      setOrder(null); // Set to null to indicate an error state
    }
  }, [orderId, getOrderById]); // Re-run effect if orderId or getOrderById changes

  // Loading state
  if (order === undefined) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  // Order not found or invalid ID state
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Order Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          We couldn't find the details for this order ID ({orderId || "N/A"}).
          It might be invalid or the order wasn't processed correctly.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
        >
          Go to Homepage
        </Link>
        <Link
          href="/orders" // Link to order history
          className="ml-4 px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors font-semibold"
        >
          View My Orders
        </Link>
      </div>
    );
  }

  // Order found - Display confirmation
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto text-center">
        {/* Success Icon Placeholder */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg
            className="h-6 w-6 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Thank You For Your Order!
        </h1>
        <p className="text-gray-600 mb-4">
          Your order{" "}
          <span className="font-semibold text-gray-800">#{order.id}</span> has
          been placed successfully.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          A confirmation email has been simulated (check your console!). You can
          also view your order details below or in your order history.
        </p>

        {/* Order Summary Section */}
        <div className="text-left border-t border-b border-gray-200 py-6 my-6 space-y-4">
          <h2 className="text-xl font-semibold mb-3 text-center">
            Order Summary
          </h2>
          {/* Items */}
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center text-sm border-b pb-2 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={item.imageUrl || "/images/placeholder.svg"}
                    alt={item.name}
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded"
                  />
                </div>
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500 block">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          {/* Totals */}
          <div className="space-y-1 pt-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discountApplied > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-{formatCurrency(order.discountApplied)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>FREE</span> {/* Placeholder */}
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2 mt-1">
              <span>Total:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address Section */}
        <div className="text-left mb-6">
          <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
          <address className="text-sm text-gray-600 not-italic">
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            <br />
            {order.shippingAddress.address1}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.zip}
            <br />
            {order.shippingAddress.country}
          </address>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders" // Link to order history
            className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors font-semibold"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
