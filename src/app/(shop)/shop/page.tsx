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
} from "@../../../components/ui/breadcrumb";
import { Button } from "../../../components/ui/button";

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
  export default function ShopPage({ searchParams }: ShopPageProps) {
    const products = sampleProducts;
    const currentCategory = searchParams?.category ?? undefined;
    const query = searchParams?.q ?? "";

    // Filter products based on the category and search query
    const filteredProducts = products.filter((product) => {
      const matchesCategory = currentCategory
        ? product.category === currentCategory
        : true;
      const matchesQuery = query
        ? product.name.toLowerCase().includes(query.toLowerCase())
        : true;
      return matchesCategory && matchesQuery;
    });

    return (
      <div>
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {currentCategory ? (
                <>
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

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Button
            variant={!currentCategory ? "default" : "outline"}
            asChild
            size="sm"
          >
            <Link href="/shop">All</Link>
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={currentCategory === category ? "default" : "outline"}
              asChild
              size="sm"
            >
              <Link
                href={`/shop?category=${encodeURIComponent(
                  category
                )}&q=${encodeURIComponent(query)}`}
              >
                {category}
              </Link>
            </Button>
          ))}
        </div>

        <ProductGrid allProducts={filteredProducts} />
      </div>
    );
  }
}
