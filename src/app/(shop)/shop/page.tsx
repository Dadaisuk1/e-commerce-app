// src/app/(shop)/shop/page.tsx
import React from "react";
import Link from "next/link";
import { sampleProducts } from "@/app/data/products";
import { ProductGrid } from "@/app/components/ProductGrid";
import { ProductCategory } from "@/app/data";

// Import Shadcn/ui components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

// Define available categories
const categories: ProductCategory[] = [
  "Electronics",
  "Clothing",
  "Home Goods",
  "Books",
  "Sports",
];

// Define the expected shape of searchParams
interface ShopPageProps {
  searchParams?: {
    q?: string;
    category?: string;
  };
}

// This component can remain a Server Component
export default function ShopPage({ searchParams }: ShopPageProps) {
  // Get products (in real app, fetch based on server-side params if needed)
  const products = sampleProducts;

  // Safely get the current category *only* for UI display (breadcrumbs, button state)
  // The actual filtering happens client-side in ProductGrid
  const currentCategory = (searchParams?.category ?? undefined) as
    | ProductCategory
    | undefined;

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            {/* Link to landing page */}
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {currentCategory ? (
              <>
                {/* Link to the base shop page */}
                <BreadcrumbLink asChild>
                  <Link href="/shop">Shop</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
                <BreadcrumbPage>{currentCategory}</BreadcrumbPage>
              </>
            ) : (
              <BreadcrumbPage>Shop</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {/* "All" Button - Links back to the base shop page */}
        <Button
          variant={!currentCategory ? "default" : "outline"}
          asChild
          size="sm"
        >
          <Link href="/shop">All</Link> {/* Link to /shop */}
        </Button>
        {/* Category Buttons - Link to the shop page with category query param */}
        {categories.map((category) => (
          <Button
            key={category}
            variant={currentCategory === category ? "default" : "outline"}
            asChild
            size="sm"
          >
            {/* Link to /shop?category=... */}
            <Link href={`/shop?category=${encodeURIComponent(category)}`}>
              {category}
            </Link>
          </Button>
        ))}
      </div>

      {/* Product Grid - Passes all products down. It handles filtering internally using useSearchParams */}
      <ProductGrid allProducts={products} />
    </div>
  );
}
