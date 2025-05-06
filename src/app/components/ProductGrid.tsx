// src/app/components/ProductGrid.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link"; // Import Link
import { Product, ProductCategory } from "@/app/data";
import { ProductCard } from "@/app/components/ProductCard";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  allProducts: Product[];
}

const ITEMS_PER_PAGE = 12;

export function ProductGrid({ allProducts }: ProductGridProps) {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
  const selectedCategory = searchParams.get(
    "category"
  ) as ProductCategory | null;

  const [currentPage, setCurrentPage] = useState(1);

  // Filter products based on search term AND category
  const filteredProducts = useMemo(() => {
    let products = allProducts;
    if (selectedCategory) {
      products = products.filter(
        (product) => product.category === selectedCategory
      );
    }
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          (product.description &&
            product.description.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    return products;
  }, [searchTerm, selectedCategory, allProducts]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const productsToShow = filteredProducts.slice(startIndex, endIndex);

  // --- Pagination Handlers ---
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Reset page effect
  useEffect(() => {
    const newTotalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(1);
    } else if (currentPage === 0 && newTotalPages > 0) {
      setCurrentPage(1);
    } else if (newTotalPages === 0) {
      setCurrentPage(1);
    }
  }, [searchTerm, selectedCategory, filteredProducts.length, currentPage]);

  return (
    <>
      {/* Product Grid */}
      {productsToShow.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsToShow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 col-span-full">
          <p>No products found matching your criteria.</p>
          {(searchTerm || selectedCategory) && (
            <Button variant="link" asChild className="mt-2">
              {/* Update Link href to /shop */}
              <Link href="/shop">Clear Filters</Link>
            </Button>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-10 pt-6 border-t">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            variant="outline"
          >
            {" "}
            Previous{" "}
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            {" "}
            Page {currentPage} of {totalPages}{" "}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            {" "}
            Next{" "}
          </Button>
        </div>
      )}
    </>
  );
}
