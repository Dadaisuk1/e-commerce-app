// src/app/components/OrderListItem.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Order } from "@/app/data";
import { formatCurrency } from "@/app/lib/utils";

interface OrderListItemProps {
  order: Order;
}

// Helper function to format date nicely
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case "Processing":
      return "text-yellow-600 bg-yellow-100";
    case "Shipped":
      return "text-blue-600 bg-blue-100";
    case "Delivered":
      return "text-green-600 bg-green-100";
    case "Cancelled":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export function OrderListItem({ order }: OrderListItemProps) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Order Info */}
      <div className="flex-grow space-y-1">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <h3 className="text-lg font-semibold text-gray-800">
            Order #{order.id.split("-")[1]} {/* Show shorter ID part */}
          </h3>
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Placed on: {formatDate(order.orderDate)}
        </p>
        <p className="text-sm text-gray-700">
          Total:{" "}
          <span className="font-medium">{formatCurrency(order.total)}</span>
        </p>
        {/* Optional: Show number of items */}
        <p className="text-sm text-gray-500">{order.items.length} item(s)</p>
      </div>

      {/* Action Button */}
      <div className="flex-shrink-0 mt-2 sm:mt-0">
        <Link
          href={`/orders/${order.id}`} // Link to the specific order detail page
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
