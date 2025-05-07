// src/app/components/OrderListItem.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Order } from "../../app/data"; // Adjusted import path assuming data is in src/app/data
import { formatCurrency } from "../../app/lib/utils"; // Adjusted import path assuming lib is in src/app/lib
import { Button } from "../../src/components/ui/button";
import { Badge } from "../../src/components/ui/badge";

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

// Helper function to get status variant for Badge
const getStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Processing":
      return "secondary"; // Yellowish/Grayish
    case "Shipped":
      return "default"; // Blue/Primary
    case "Delivered":
      return "default"; // Green (using default, could customize)
    case "Cancelled":
      return "destructive"; // Red
    default:
      return "outline"; // Gray outline
  }
};
// Custom function to map status to specific colors if needed beyond variants
const getStatusColorClasses = (status: string): string => {
  switch (status) {
    case "Processing":
      return "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "Shipped":
      return "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/20 dark:text-blue-400"; // Example using blue
    case "Delivered":
      return "border-transparent bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/20 dark:text-green-400";
    default:
      return ""; // Rely on variant for others
  }
};

export function OrderListItem({ order }: OrderListItemProps) {
  return (
    // Use Card styling for consistency (optional)
    <div className="bg-card text-card-foreground p-4 sm:p-6 rounded-lg shadow-sm border mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Order Info */}
      <div className="flex-grow space-y-1">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <h3 className="text-lg font-semibold">
            Order #{order.id.split("-")[1]} {/* Show shorter ID part */}
          </h3>
          {/* Use Shadcn Badge for status */}
          <Badge
            variant={getStatusVariant(order.status)}
            className={getStatusColorClasses(order.status)}
          >
            {order.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Placed on: {formatDate(order.orderDate)}
        </p>
        <p className="text-sm">
          Total:{" "}
          <span className="font-medium">{formatCurrency(order.total)}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          {order.items.length} item(s)
        </p>
      </div>

      {/* Action Button */}
      <div className="flex-shrink-0 mt-2 sm:mt-0">
        {/* Use Shadcn Button wrapping Link */}
        <Button asChild size="sm">
          <Link href={`/orders/${order.id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
}
