// src/app/components/ProductCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Product } from "../data";
import { useCart } from "../hooks/useCart"; // Import the custom hook
import { formatCurrency } from "../lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Use the hook to get cart state and functions
  const { addToCart, cartItems } = useCart();

  // Find how many of this specific item are currently in the cart
  const quantityInCart =
    cartItems.find((item) => item.id === product.id)?.quantity || 0;

  // Calculate the stock currently available to add
  const availableStock = product.stock - quantityInCart;

  // Determine if the item is effectively out of stock (considering cart quantity)
  const isEffectivelyOutOfStock = availableStock <= 0;

  const handleAddToCart = () => {
    // Only add if there's available stock
    if (!isEffectivelyOutOfStock) {
      addToCart(product, 1); // Add 1 item to the cart
    } else {
      // Optional: Add feedback if trying to add when none are available
      alert(`Sorry, no more ${product.name} available to add.`);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm flex flex-col bg-white">
      {/* Image Placeholder */}
      <div className="relative w-full h-48 mb-4 bg-gray-200 rounded flex items-center justify-center">
        <Image
          src={product.imageUrl || "/images/placeholder.svg"} // Fallback image
          alt={product.name}
          fill // Use fill prop
          style={{ objectFit: "contain" }} // Use style prop
          className="rounded"
        />
        {/* Show "Out of Stock" overlay based on *initial* stock for clarity */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-1 truncate">{product.name}</h3>
      <p className="text-gray-700 mb-2 font-medium">
        {formatCurrency(product.price)}
      </p>
      <p className="text-sm text-gray-500 mb-4 min-h-[40px]">
        {product.description || "No description available."}
      </p>

      {/* Display Available Stock */}
      <p
        className={`text-sm mb-4 font-semibold ${
          isEffectivelyOutOfStock ? "text-red-600" : "text-green-700"
        }`}
      >
        {isEffectivelyOutOfStock
          ? product.stock <= 0
            ? "Out of Stock"
            : "None available (in cart)" // Differentiate why it's unavailable
          : `${availableStock} available`}
      </p>

      {/* Add to Cart Button - Disable based on available stock */}
      <button
        onClick={handleAddToCart}
        disabled={isEffectivelyOutOfStock} // Disable if none are available to add
        className={`mt-auto w-full px-4 py-2 rounded text-white font-semibold transition-colors duration-200 ${
          isEffectivelyOutOfStock
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isEffectivelyOutOfStock ? "Unavailable" : "Add to Cart"}
      </button>
    </div>
  );
}
