// src/app/(shop)/orders/[orderId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useOrders } from "../../hooks/useOrders";
import { Order, OrderStatus } from "../../data";
import { formatCurrency } from "../../lib/utils";
import Image from "next/image"; // Import Image component

// Helper function to format date nicely (can be moved to utils)
const formatDate = (
  date: Date | string | undefined,
  includeTime = false
): string => {
  if (!date) return "N/A";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  if (includeTime) {
    options.hour = "numeric";
    options.minute = "2-digit";
    options.hour12 = true;
  }
  return new Date(date).toLocaleDateString("en-US", options);
};

// Helper function to get status color (can be moved to utils)
const getStatusColor = (status: string): string => {
  switch (status) {
    case "Processing":
      return "text-yellow-700 bg-yellow-100 border-yellow-300";
    case "Shipped":
      return "text-blue-700 bg-blue-100 border-blue-300";
    case "Delivered":
      return "text-green-700 bg-green-100 border-green-300";
    case "Cancelled":
      return "text-red-700 bg-red-100 border-red-300";
    default:
      return "text-gray-700 bg-gray-100 border-gray-300";
  }
};

export default function OrderDetailPage() {
  const params = useParams();
  const { getOrderById, updateOrderStatus } = useOrders(); // Add updateOrderStatus
  const [order, setOrder] = useState<Order | null | undefined>(undefined); // undefined = loading

  const orderId =
    typeof params.orderId === "string" ? params.orderId : undefined;

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      setOrder(foundOrder);
    } else {
      setOrder(null); // Invalid ID
    }
  }, [orderId, getOrderById]); // Rerun when ID changes

  // --- Simulation Controls ---
  // In a real app, status updates come from the backend.
  // Here, we add buttons to simulate the process.
  const handleSimulateUpdate = (newStatus: OrderStatus) => {
    if (order) {
      updateOrderStatus(order.id, newStatus);
      // Re-fetch the order locally to show updated state immediately
      const updatedOrder = getOrderById(order.id);
      setOrder(updatedOrder);
    }
  };

  // Loading state
  if (order === undefined) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        Loading order details...
      </div>
    );
  }

  // Order not found state
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Order Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Could not find details for order ID: {orderId || "N/A"}.
        </p>
        <Link
          href="/orders"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Order History
        </Link>
      </div>
    );
  }

  // Order found - Display details
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/orders" className="text-blue-600 hover:underline text-sm">
          &larr; Back to Order History
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Order Details
            </h1>
            <p className="text-sm text-gray-500">Order #{order.id}</p>
            <p className="text-sm text-gray-500">
              Placed on: {formatDate(order.orderDate, true)}
            </p>
          </div>
          <div
            className={`text-sm font-medium px-3 py-1.5 rounded-full border ${getStatusColor(
              order.status
            )}`}
          >
            Status: {order.status}
          </div>
        </div>

        {/* Tracking Information (if applicable) */}
        {order.status === "Shipped" && order.trackingNumber && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-1">
              Tracking Information
            </h3>
            <p className="text-sm text-blue-700">
              Tracking Number:{" "}
              <span className="font-mono">{order.trackingNumber}</span>
            </p>
            {order.estimatedDelivery && (
              <p className="text-sm text-blue-700">
                Estimated Delivery: {formatDate(order.estimatedDelivery)}
              </p>
            )}
          </div>
        )}
        {order.status === "Delivered" && order.estimatedDelivery && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-semibold text-green-800 mb-1">
              Delivery Information
            </h3>
            <p className="text-sm text-green-700">
              Delivered on: {formatDate(order.estimatedDelivery)}
            </p>
            {order.trackingNumber && (
              <p className="text-sm text-green-700">
                Tracking Number:{" "}
                <span className="font-mono">{order.trackingNumber}</span>
              </p>
            )}
          </div>
        )}

        {/* Order Items */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Items Ordered</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 border-b pb-4 last:border-b-0"
              >
                <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={item.imageUrl || "/images/placeholder.svg"}
                    alt={item.name}
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded"
                  />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-500">
                    Price: {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="text-right font-medium text-gray-800">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Totals and Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-6">
          {/* Totals Summary */}
          <div className="md:col-span-1 space-y-2 text-sm">
            <h3 className="text-lg font-semibold mb-2">Order Totals</h3>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            {order.discountApplied > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span className="font-medium">
                  -{formatCurrency(order.discountApplied)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="font-medium">FREE</span> {/* Placeholder */}
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2 mt-1">
              <span>Total Paid:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="md:col-span-1">
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

          {/* Billing Address */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-2">Billing Address</h3>
            <address className="text-sm text-gray-600 not-italic">
              {order.billingAddress.firstName} {order.billingAddress.lastName}
              <br />
              {order.billingAddress.address1}
              <br />
              {order.billingAddress.city}, {order.billingAddress.zip}
              <br />
              {order.billingAddress.country}
            </address>
          </div>
        </div>

        {/* --- Simulation Controls --- */}
        <div className="mt-8 pt-6 border-t border-dashed">
          <h3 className="text-center text-sm font-semibold text-gray-500 mb-3">
            -- Simulation Controls --
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {order.status === "Processing" && (
              <button
                onClick={() => handleSimulateUpdate("Shipped")}
                className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Simulate Ship Order
              </button>
            )}
            {order.status === "Shipped" && (
              <button
                onClick={() => handleSimulateUpdate("Delivered")}
                className="px-3 py-1.5 bg-green-500 text-white text-xs rounded hover:bg-green-600"
              >
                Simulate Deliver Order
              </button>
            )}
            {(order.status === "Processing" || order.status === "Shipped") && (
              <button
                onClick={() => handleSimulateUpdate("Cancelled")}
                className="px-3 py-1.5 bg-red-500 text-white text-xs rounded hover:bg-red-600"
              >
                Simulate Cancel Order
              </button>
            )}
            {(order.status === "Delivered" || order.status === "Cancelled") && (
              <p className="text-xs text-gray-500">
                No further status changes possible.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
