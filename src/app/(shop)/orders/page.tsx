// src/app/(shop)/orders/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useOrders } from "@/app/hooks/useOrders";
import { useAuth } from "@/app/hooks/useAuth"; // To potentially filter orders
import { OrderListItem } from "@/app/components/OrderListItem"; // Import the new component

export default function OrderHistoryPage() {
  const { orders } = useOrders();
  const { currentUser } = useAuth();

  // --- Filtering Logic ---
  // In this simulation, we might show all orders if not logged in,
  // or filter by currentUser.id if logged in.
  // For now, let's filter if a user is logged in.
  const userOrders = currentUser
    ? orders.filter((order) => order.userId === currentUser.id)
    : orders; // Or maybe show none if not logged in: `[]`

  // Sort orders by date, newest first
  const sortedOrders = userOrders.sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );

  // Handle case where user is required but not logged in
  // if (!currentUser) {
  //    return (
  //        <div className="container mx-auto px-4 py-16 text-center">
  //             <h1 className="text-2xl font-bold mb-4">Please Login</h1>
  //             <p className="text-gray-600 mb-8">You need to be logged in to view your order history.</p>
  //             <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold">
  //                 Go to Login
  //             </Link>
  //        </div>
  //    );
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {sortedOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <p className="text-gray-600 mb-4">
            You haven't placed any orders yet.
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <OrderListItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
