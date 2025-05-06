// src/app/(shop)/products/[productId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { sampleProducts } from "@/app/data/products"; // Import mock data
import { Product } from "@/app/data";
import { useCart } from "@/app/hooks/useCart";
import { formatCurrency } from "@/app/lib/utils";
import { cn } from "@/lib/utils";

// Import Shadcn/ui components
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart, cartItems } = useCart();
  const [product, setProduct] = useState<Product | null | undefined>(undefined); // undefined = loading, null = not found
  const [quantityToAdd, setQuantityToAdd] = useState(1); // State for quantity input

  const productId =
    typeof params.productId === "string" ? params.productId : undefined;

  // Find product data based on ID from URL
  useEffect(() => {
    if (productId) {
      // In a real app, you'd fetch this data from an API:
      // fetch(`/api/products/${productId}`).then(res => res.json()).then(data => setProduct(data));
      const foundProduct = sampleProducts.find((p) => p.id === productId);
      setProduct(foundProduct || null); // Set to null if not found
    } else {
      setProduct(null); // No valid ID
    }
  }, [productId]);

  // Calculate available stock considering items already in cart
  const quantityInCart = product
    ? cartItems.find((item) => item.id === product.id)?.quantity || 0
    : 0;
  const availableStock = product ? product.stock - quantityInCart : 0;
  const isEffectivelyOutOfStock = availableStock <= 0;

  const handleAddToCart = () => {
    if (product && !isEffectivelyOutOfStock && quantityToAdd > 0) {
      if (quantityToAdd > availableStock) {
        alert(`Only ${availableStock} available.`);
        setQuantityToAdd(availableStock); // Optionally reset quantity to max available
        return;
      }
      addToCart(product, quantityToAdd);
      alert(`${quantityToAdd} x ${product.name} added to cart!`);
      setQuantityToAdd(1); // Reset quantity input after adding
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (product && value > availableStock) {
      // Optionally cap the input value immediately
      // value = availableStock;
      // Or just rely on the check in handleAddToCart
    }
    setQuantityToAdd(value);
  };

  // --- Render Logic ---

  // Loading state
  if (product === undefined) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        Loading product...
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the product you're looking for (ID:{" "}
          {productId || "N/A"}).
        </p>
        <Button asChild>
          <Link href="/">Go Back to Shop</Link>
        </Button>
      </div>
    );
  }

  // Product found - Display details
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image Section */}
        <div className="w-full">
          {/* Use AspectRatio for consistent image sizing */}
          <AspectRatio
            ratio={1 / 1}
            className="bg-muted rounded-lg overflow-hidden border"
          >
            <Image
              src={product.imageUrl || "/images/placeholder.svg"}
              alt={product.name}
              fill
              style={{ objectFit: "contain" }}
              className="p-4" // Add padding within the container if objectFit is contain
              sizes="(max-width: 768px) 90vw, 45vw" // Example sizes
              priority // Prioritize loading image on detail page
            />
          </AspectRatio>
          {/* Add gallery thumbnails here later if needed */}
        </div>

        {/* Product Details and Actions Section */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>

          <div className="flex items-center space-x-3">
            <p className="text-2xl font-semibold text-primary">
              {formatCurrency(product.price)}
            </p>
            {/* Stock Badge */}
            <Badge
              variant={isEffectivelyOutOfStock ? "outline" : "secondary"}
              className={cn(
                "text-sm font-semibold",
                isEffectivelyOutOfStock
                  ? "border-red-500 text-red-600"
                  : "text-green-700"
              )}
            >
              {isEffectivelyOutOfStock
                ? product.stock <= 0
                  ? "Out of Stock"
                  : "None available"
                : `${availableStock} available`}
            </Badge>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {product.description || "No description provided."}
            </p>
          </div>

          <Separator />

          {/* Add to Cart Section */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
            {/* Quantity Selector */}
            <div className="flex items-center">
              <Label htmlFor="quantity" className="sr-only">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={availableStock > 0 ? availableStock : 1} // Set max based on stock, min 1 even if OOS
                value={quantityToAdd}
                onChange={handleQuantityChange}
                className="w-20 text-center"
                disabled={isEffectivelyOutOfStock}
              />
            </div>
            {/* Add to Cart Button */}
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={
                isEffectivelyOutOfStock || quantityToAdd > availableStock
              } // Disable if OOS or trying to add more than available
              className="flex-grow" // Allow button to grow
            >
              {isEffectivelyOutOfStock ? "Unavailable" : "Add to Cart"}
            </Button>
          </div>
          {/* Display warning if trying to add more than available */}
          {product && quantityToAdd > availableStock && availableStock > 0 && (
            <p className="text-xs text-red-600">
              Only {availableStock} more can be added.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
