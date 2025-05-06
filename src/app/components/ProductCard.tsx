// src/app/components/ProductCard.tsx
"use client"; // Needed for onClick -> useCart hook

import React from "react";
import Image from "next/image"; // Use Next.js Image for optimization
import { Product } from "@/app/data";
import { useCart } from "@/app/hooks/useCart"; // Import the custom hook
import { formatCurrency } from "@/app/lib/utils";
// Later: import Button component from ui folder e.g. import { Button } from '@/app/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart(); // Use the hook to get context functions
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, 1); // Add 1 item to the cart
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm flex flex-col bg-white">
      {/* Basic Image Placeholder */}
      <div className="relative w-full h-48 mb-4 bg-gray-200 rounded flex items-center justify-center">
        <Image
          src={product.imageUrl || "/images/placeholder.svg"} // Fallback image
          alt={product.name}
          layout="fill" // Fill the container
          objectFit="contain" // Adjust as needed: cover, contain, etc.
          className="rounded"
        />
        {isOutOfStock && (
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
      </p>{" "}
      {/* Ensure description area has min height */}
      <p
        className={`text-sm mb-4 font-semibold ${
          isOutOfStock ? "text-red-600" : "text-green-700"
        }`}
      >
        {isOutOfStock ? "Out of Stock" : `${product.stock} in Stock`}
      </p>
      {/* Basic Button for now */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`mt-auto w-full px-4 py-2 rounded text-white font-semibold transition-colors duration-200 ${
          isOutOfStock
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}

// Make sure you have a hook file: src/app/hooks/useCart.ts
// Contents of src/app/hooks/useCart.ts:
// export { useCart } from '@/app/contexts/CartContext'; // Re-export for cleaner imports
