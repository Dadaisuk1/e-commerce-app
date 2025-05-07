// src/app/(shop)/page.tsx
// No 'use client' needed here anymore potentially

import React from "react";
import { sampleProducts } from "../../app/data/products";
import { ProductGrid } from "../../app/components/ProductGrid";

// This component can now be a Server Component
export default function HomePage() {
  // Fetching or getting product data happens here (using sampleProducts for now)
  const products = sampleProducts;

  return (
    <div>
      {/* Keep the title */}
      <h1 className="text-3xl font-bold mb-8 text-center">
        Welcome to Our Store!
      </h1>

      {/*
        The Search Input is now removed from here and placed in the Header.
        We render the ProductGrid component, which handles reading the
        search params from the URL and filtering internally.
      */}
      <ProductGrid allProducts={products} />
    </div>
  );
}
