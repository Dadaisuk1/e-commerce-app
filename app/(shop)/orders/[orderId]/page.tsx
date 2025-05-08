// src/app/(shop)/orders/[orderId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
// Adjusted import paths based on user's code
import { useOrders } from "../../../../app/hooks/useOrders";
import { Order, OrderStatus } from "../../../../app/data";
import { formatCurrency } from "../../../../app/lib/utils";
import { cn } from "../../../../app/lib/utils"; // Import cn utility
import Image from "next/image";

// Import Shadcn/ui components using user's paths
import { Button } from "../../../../src/components/ui/button";
import { Badge } from "../../../../src/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription, // Uncommented
  // CardFooter, // Not used in user's provided code for main card
  CardHeader,
  CardTitle,
} from "../../../../src/components/ui/card";
import { Separator } from "../../../../src/components/ui/separator";
// import { AspectRatio } from "../../../../src/components/ui/aspect-ratio"; // Commented out in user code
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../../src/components/ui/alert"; // For tracking info
// Adjusted icons based on user's code (Clock, Package, Info were not in user code)
import { Truck, CheckCircle, XCircle } from "lucide-react";

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

// Helper function to get status variant for Badge
const getStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Processing":
    case "Delayed": // Assuming Delayed uses secondary as well
      return "secondary";
    case "Shipped":
    case "Delivered":
      return "default";
    case "Cancelled":
      return "destructive";
    default:
      return "outline";
  }
};
// Custom function to map status to specific colors/classes
const getStatusColorClasses = (status: string): string => {
  switch (status) {
    case "Processing":
      return "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "Delayed": // Added style for Delayed
      return "border-transparent bg-orange-100 text-orange-800 hover:bg-orange-100/80 dark:bg-orange-900/20 dark:text-orange-400";
    case "Shipped":
      return "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/20 dark:text-blue-400";
    case "Delivered":
      return "border-transparent bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/20 dark:text-green-400";
    // Destructive variant handles cancelled
    default:
      return "";
  }
};

export default function OrderDetailPage() {
  const params = useParams();
  const { getOrderById, updateOrderStatus } = useOrders();
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
    // Consider removing 'order' from dependency array if causing issues,
    // rely on context updates triggering re-render or manually trigger refetch.
  }, [orderId, getOrderById, order]);

  const handleSimulateUpdate = (newStatus: OrderStatus) => {
    if (order) {
      updateOrderStatus(order.id, newStatus);
      // Re-fetch immediately to update UI state
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
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">
              Order Not Found
            </CardTitle>
            {/* Use CardDescription if imported */}
            <CardDescription className="text-muted-foreground pt-2">
              Could not find details for order ID: {orderId || "N/A"}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/orders">Back to Order History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Order found - Display details
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="link" asChild className="p-0 h-auto text-sm">
          <Link href="/orders">&larr; Back to Order History</Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 p-4 sm:p-6">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <CardTitle className="text-2xl sm:text-3xl">
                Order Details
              </CardTitle>
              {/* Use CardDescription if imported */}
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Order #{order.id} <span className="mx-1">&bull;</span> Placed
                on: {formatDate(order.orderDate, true)}
              </CardDescription>
            </div>
            <Badge
              variant={getStatusVariant(order.status)}
              className={cn("text-sm", getStatusColorClasses(order.status))}
            >
              {order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          {/* Tracking/Status Information Alerts */}
          {order.status === "Delayed" && ( // Added Delayed Alert
            <Alert
              variant="default"
              className="bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-300"
            >
              {/* <Clock className="h-4 w-4 !text-orange-600 dark:!text-orange-400" /> Icon was missing in user code */}
              <AlertTitle className="font-semibold">Order Delayed</AlertTitle>
              <AlertDescription className="text-xs sm:text-sm">
                There is a delay with your order.
                {order.estimatedDelivery &&
                  ` New estimated delivery: ${formatDate(
                    order.estimatedDelivery
                  )}.`}
              </AlertDescription>
            </Alert>
          )}
          {order.status === "Shipped" && order.trackingNumber && (
            <Alert
              variant="default"
              className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300"
            >
              <Truck className="h-4 w-4 !text-blue-600 dark:!text-blue-400" />
              <AlertTitle className="font-semibold">
                Tracking Information
              </AlertTitle>
              <AlertDescription className="text-xs sm:text-sm">
                Tracking Number:{" "}
                <span className="font-mono">{order.trackingNumber}</span>
                <br />
                {order.estimatedDelivery &&
                  `Estimated Delivery: ${formatDate(order.estimatedDelivery)}`}
              </AlertDescription>
            </Alert>
          )}
          {order.status === "Delivered" && order.estimatedDelivery && (
            <Alert
              variant="default"
              className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300"
            >
              <CheckCircle className="h-4 w-4 !text-green-600 dark:!text-green-400" />
              <AlertTitle className="font-semibold">
                Delivery Information
              </AlertTitle>
              <AlertDescription className="text-xs sm:text-sm">
                Delivered on: {formatDate(order.estimatedDelivery)}
                {order.trackingNumber && (
                  <>
                    <br />
                    Tracking Number:{" "}
                    <span className="font-mono">{order.trackingNumber}</span>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}
          {order.status === "Cancelled" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle className="font-semibold">Order Cancelled</AlertTitle>
              <AlertDescription className="text-xs sm:text-sm">
                This order has been cancelled.
              </AlertDescription>
            </Alert>
          )}

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Items Ordered</h3>
            <div className="space-y-4 border rounded-md">
              {order.items.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center space-x-4 p-4",
                    index < order.items.length - 1 && "border-b"
                  )}
                >
                  <div className="relative w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.imageUrl || "/images/placeholder.svg"}
                      alt={item.name}
                      fill
                      style={{ objectFit: "contain" }}
                      className="rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Price: {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="text-right font-medium flex-shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Totals and Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
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
                <span className="font-medium">FREE</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-base">
                <span>Total Paid:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
              <address className="text-sm text-muted-foreground not-italic leading-snug">
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
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
              <address className="text-sm text-muted-foreground not-italic leading-snug">
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
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-center text-sm font-semibold text-muted-foreground mb-3">
              -- Simulation Controls --
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {/* Added back Simulate Delay button */}
              {(order.status === "Processing" ||
                order.status === "Shipped") && (
                <Button
                  onClick={() => handleSimulateUpdate("Delayed")}
                  size="sm"
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50 cursor-pointer"
                >
                  {" "}
                  Simulate Delay{" "}
                </Button>
              )}
              {order.status === "Processing" && (
                <Button
                  onClick={() => handleSimulateUpdate("Shipped")}
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                >
                  Simulate Ship
                </Button>
              )}
              {/* Allow Deliver from Shipped OR Delayed */}
              {(order.status === "Shipped" || order.status === "Delayed") && (
                <Button
                  onClick={() => handleSimulateUpdate("Delivered")}
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                >
                  Simulate Deliver
                </Button>
              )}
              {/* Allow Cancel from Processing, Shipped, or Delayed */}
              {(order.status === "Processing" ||
                order.status === "Shipped" ||
                order.status === "Delayed") && (
                <Button
                  onClick={() => handleSimulateUpdate("Cancelled")}
                  size="sm"
                  variant="destructive"
                  className="cursor-pointer"
                >
                  Simulate Cancel
                </Button>
              )}
              {(order.status === "Delivered" ||
                order.status === "Cancelled") && (
                <p className="text-xs text-muted-foreground p-2">
                  No further status changes possible.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
