// src/app/(shop)/page.tsx
"use client"; // Needed for useState hook

import React, { useState, useMemo } from "react";
import { ProductCard } from "../../app/components/ProductCard";
import { sampleProducts } from "../../app/data/products";
import { Input } from "../../src/components/ui/input"; // Import Shadcn Input

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search term (case-insensitive)
  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return sampleProducts; // Return all products if search is empty
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return sampleProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        (product.description &&
          product.description.toLowerCase().includes(lowerCaseSearchTerm)) // Optional: search description too
    );
  }, [searchTerm]); // Re-run filter only when searchTerm changes

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-center">
        Welcome to Our Store!
      </h1>

      {/* Search Input */}
      <div className="mb-8 max-w-sm mx-auto">
        <Input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full" // Make input take full width of its container
        />
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p>No products found matching &aptos;{searchTerm}&aptos;.</p>
        </div>
      )}
    </div>
  );
}
