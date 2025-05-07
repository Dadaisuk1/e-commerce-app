// src/app/components/ProductCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { Product } from "../../app/data";
import { useCart } from "../../app/hooks/useCart";
import { formatCurrency } from "../../app/lib/utils";
import { cn } from "../../app/lib/utils";

// Import Shadcn/ui components
import { Button } from "../../src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import { Badge } from "../../src/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cartItems } = useCart();
  const quantityInCart =
    cartItems.find((item) => item.id === product.id)?.quantity || 0;
  const availableStock = product.stock - quantityInCart;
  const isEffectivelyOutOfStock = availableStock <= 0;

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Stop the click from propagating to the Link wrapper if the button is inside it
    event.stopPropagation();
    event.preventDefault(); // Prevent default Link behavior if necessary

    if (!isEffectivelyOutOfStock) {
      addToCart(product, 1);
    } else {
      alert(`Sorry, no more ${product.name} available to add.`);
    }
  };

  // Define the product detail page URL
  const productUrl = `/products/${product.id}`;

  return (
    // Wrap the main content area (excluding the button potentially) in a Link
    <Card className="flex flex-col overflow-hidden h-full transition-shadow hover:shadow-md">
      <CardHeader className="p-0 relative">
        {/* Make image link to product page */}
        <Link
          href={productUrl}
          className="block aspect-square relative bg-gray-100"
        >
          <Image
            src={product.imageUrl || "/images/placeholder.svg"}
            alt={product.name}
            fill
            style={{ objectFit: "contain" }}
            className="rounded-t-lg"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-t-lg">
              <Badge variant="destructive" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
        </Link>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        {/* Make title link to product page */}
        <Link href={productUrl}>
          <CardTitle className="text-lg font-semibold mb-1 truncate hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <CardDescription className="text-gray-700 mb-2 font-medium">
          {formatCurrency(product.price)}
        </CardDescription>
        <p className="text-sm text-gray-500 mb-4 min-h-[40px] line-clamp-2">
          {" "}
          {/* Limit description lines */}
          {product.description || "No description available."}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-3">
        <div>
          <Badge
            variant={isEffectivelyOutOfStock ? "outline" : "secondary"}
            className={cn(
              "text-xs font-semibold",
              isEffectivelyOutOfStock
                ? "border-red-500 text-red-600"
                : "text-green-700"
            )}
          >
            {isEffectivelyOutOfStock
              ? product.stock <= 0
                ? "Out of Stock"
                : "None available (in cart)"
              : `${availableStock} available`}
          </Badge>
        </div>

        {/* Keep button outside the main Link wrapper or stop propagation */}
        <Button
          onClick={handleAddToCart}
          disabled={isEffectivelyOutOfStock}
          className="w-full mt-auto"
          variant={isEffectivelyOutOfStock ? "outline" : "default"}
        >
          {isEffectivelyOutOfStock ? "Unavailable" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
