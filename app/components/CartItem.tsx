// src/app/components/CartItem.tsx
"use client";

import React from "react";
import Image from "next/image";
// import Link from "next/link";
import { CartItem as CartItemType } from "../data"; // Rename type import to avoid conflict
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../lib/utils";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      // Update quantity (will handle removal if 0 in the context)
      // Also handles checking against stock in the context
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleIncreaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    updateQuantity(item.id, item.quantity - 1); // Context handles quantity >= 0
  };

  const handleRemoveItem = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0 bg-white rounded-md shadow-sm mb-4">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded overflow-hidden">
          <Image
            src={item.imageUrl || "/images/placeholder.svg"}
            alt={item.name}
            fill
            style={{ objectFit: "contain" }} // Use style for objectFit
            className="rounded"
          />
        </div>

        {/* Product Details */}
        <div className="flex-grow">
          {/* Link to product page - Assuming product pages exist at /products/[id] later */}
          {/* <Link href={`/products/${item.id}`} className="text-lg font-semibold text-gray-800 hover:text-blue-600"> */}
          <span className="text-lg font-semibold text-gray-800">
            {item.name}
          </span>
          {/* </Link> */}
          <p className="text-sm text-gray-500">
            Price: {formatCurrency(item.price)}
          </p>
          <button
            onClick={handleRemoveItem}
            className="text-xs text-red-500 hover:text-red-700 hover:underline mt-1"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Quantity and Total */}
      <div className="flex flex-col items-end space-y-1 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        {/* Quantity Input */}
        <div className="flex items-center border border-gray-300 rounded">
          <button
            onClick={handleDecreaseQuantity}
            className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={item.quantity <= 1} // Disable if quantity is 1
          >
            -
          </button>
          <input
            type="number"
            min="1" // Set min to 1 for direct input
            max={item.stock} // Set max to available stock
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-12 px-2 py-1 text-center border-l border-r border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label={`Quantity for ${item.name}`}
          />
          <button
            onClick={handleIncreaseQuantity}
            className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={item.quantity >= item.stock} // Disable if quantity reaches stock
          >
            +
          </button>
        </div>

        {/* Item Total Price */}
        <div className="text-right sm:w-24">
          <p className="font-semibold text-gray-800">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
