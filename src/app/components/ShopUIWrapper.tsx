// src/app/components/ShopUIWrapper.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductCategory } from "@/app/data";
import { cn } from "@/lib/utils";

// Import Shadcn/ui components
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/app/components/ui/breadcrumb"; // Comment out Breadcrumb imports
import { buttonVariants } from "@/components/ui/button";

// Define available categories
const categories: ProductCategory[] = [
  "Electronics",
  "Clothing",
  "Home Goods",
  "Books",
  "Sports",
];

export function ShopUIWrapper() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get(
    "category"
  ) as ProductCategory | null;
  const currentSearch = searchParams.get("q") || "";

  return (
    <>
      {/* --- Temporarily Removed Breadcrumbs for Debugging --- */}
      {/*
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {currentCategory ? (
                <>
                    <span className="text-muted-foreground">Shop</span>
                    <BreadcrumbSeparator />
                    <BreadcrumbPage>{currentCategory}</BreadcrumbPage>
                </>
            ) : (
                <BreadcrumbPage>Shop</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      */}
      {/* --- End Temporarily Removed Breadcrumbs --- */}

      {/* Category Filters (Keep as is) */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Link
          href={`/shop${
            currentSearch ? `?q=${encodeURIComponent(currentSearch)}` : ""
          }`}
          className={cn(
            buttonVariants({
              variant: !currentCategory ? "default" : "outline",
              size: "sm",
            })
          )}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/shop?category=${encodeURIComponent(category)}${
              currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
            }`}
            className={cn(
              buttonVariants({
                variant: currentCategory === category ? "default" : "outline",
                size: "sm",
              })
            )}
          >
            {category}
          </Link>
        ))}
      </div>
    </>
  );
}
