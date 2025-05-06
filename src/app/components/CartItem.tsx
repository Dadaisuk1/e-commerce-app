// src/app/components/CartItem.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem as CartItemType } from "@/app/data";
import { useCart } from "@/app/hooks/useCart";
import { formatCurrency } from "@/app/lib/utils";
import { Button } from "@/components/ui/button"; // Import Button
import { Input } from "@/components/ui/input"; // Import Input

interface CartItemProps {
  item: CartItemType;
  // Add optional prop to indicate if this is rendered in the 'saved' list
  isSavedItem?: boolean;
}

export function CartItem({ item, isSavedItem = false }: CartItemProps) {
  // Get all necessary functions from context
  const {
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCart,
    removeFromSaved,
  } = useCart();

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleIncreaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleRemoveItem = () => {
    if (isSavedItem) {
      removeFromSaved(item.id); // Use removeFromSaved if it's a saved item
    } else {
      removeFromCart(item.id); // Use removeFromCart if it's a cart item
    }
  };

  // --- New Handlers for Save/Move ---
  const handleSaveForLater = () => {
    saveForLater(item.id);
  };

  const handleMoveToCart = () => {
    moveToCart(item.id);
  };
  // --- End New Handlers ---

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border bg-card text-card-foreground rounded-md shadow-sm mb-4 gap-4">
      {/* Image and Main Details */}
      <div className="flex items-center space-x-4 flex-grow">
        {/* Product Image */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded overflow-hidden flex-shrink-0">
          <Image
            src={item.imageUrl || "/images/placeholder.svg"}
            alt={item.name}
            fill
            style={{ objectFit: "contain" }}
            className="rounded"
          />
        </div>

        {/* Product Details & Actions */}
        <div className="flex-grow">
          <span className="text-lg font-semibold">{item.name}</span>
          <p className="text-sm text-muted-foreground">
            Price: {formatCurrency(item.price)}
          </p>
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 mt-2 text-xs">
            <Button
              variant="link"
              size="sm"
              onClick={handleRemoveItem}
              className="text-red-600 hover:text-red-700 p-0 h-auto"
            >
              Remove
            </Button>
            <span className="text-muted-foreground">|</span>
            {/* Show "Save for Later" or "Move to Cart" based on context */}
            {isSavedItem ? (
              <Button
                variant="link"
                size="sm"
                onClick={handleMoveToCart}
                className="p-0 h-auto"
              >
                Move to Cart
              </Button>
            ) : (
              <Button
                variant="link"
                size="sm"
                onClick={handleSaveForLater}
                className="p-0 h-auto"
              >
                Save for Later
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quantity and Total (Only show quantity controls for active cart items) */}
      {!isSavedItem && (
        <div className="flex flex-col items-end space-y-1 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 flex-shrink-0">
          {/* Quantity Input */}
          <div className="flex items-center border border-input rounded-md">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecreaseQuantity}
              className="px-2 py-1 h-8 w-8 rounded-r-none border-r-0"
              disabled={item.quantity <= 1}
            >
              -
            </Button>
            <Input
              type="number"
              min="1"
              max={item.stock}
              value={item.quantity}
              onChange={handleQuantityChange}
              className="w-12 h-8 px-1 py-1 text-center border-y-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-label={`Quantity for ${item.name}`}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncreaseQuantity}
              className="px-2 py-1 h-8 w-8 rounded-l-none border-l-0"
              disabled={item.quantity >= item.stock}
            >
              +
            </Button>
          </div>

          {/* Item Total Price */}
          <div className="text-right sm:w-24">
            <p className="font-semibold">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        </div>
      )}
      {/* If it's a saved item, maybe just show the price */}
      {isSavedItem && (
        <div className="text-right font-medium flex-shrink-0">
          {formatCurrency(item.price)}
        </div>
      )}
    </div>
  );
}
