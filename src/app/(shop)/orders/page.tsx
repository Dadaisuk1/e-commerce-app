// src/app/(shop)/orders/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useOrders } from "@/app/hooks/useOrders";
import { useAuth } from "@/app/hooks/useAuth";
import { OrderListItem } from "@/app/components/OrderListItem";
import { Button } from "@/components/ui/button"; // Import Button for login prompt

export default function OrderHistoryPage() {
  const { orders } = useOrders();
  const { currentUser } = useAuth();

  // --- Corrected Filtering Logic ---
  // Only show orders associated with the current user.
  // If no user is logged in, show an empty list.
  const userOrders = currentUser
    ? orders.filter((order) => order.userId === currentUser.id)
    : []; // Show empty array [] if logged out

  // Sort orders by date, newest first
  const sortedOrders = userOrders.sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );

  // --- Handle case where user is not logged in ---
  // Display a message prompting login instead of an empty list
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <p className="text-gray-600 mb-8">
          You need to be logged in to view your order history.
        </p>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }
  // --- End login check ---

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {/* Check sortedOrders length (which is already filtered) */}
      {sortedOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <p className="text-gray-600 mb-4">
            You haven't placed any orders yet.
          </p>
          <Button asChild>
            <Link href="/">Start Shopping</Link>
          </Button>
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
