// src/app/components/ProductGrid.tsx
"use client"; // This component uses client hooks

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "../../app/data";
import { ProductCard } from "../../app/components/ProductCard";

interface ProductGridProps {
  allProducts: Product[]; // Receive all products as a prop
}

export function ProductGrid({ allProducts }: ProductGridProps) {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") || ""; // Get search term from URL

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return allProducts;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        (product.description &&
          product.description.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [searchTerm, allProducts]); // Depend on searchTerm from URL and the products prop

  return (
    <>
      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 col-span-full">
          {" "}
          {/* Ensure message spans grid if needed */}
          <p>No products found matching &aptos;{searchTerm}&aptos;.</p>
        </div>
      )}
    </>
  );
}
