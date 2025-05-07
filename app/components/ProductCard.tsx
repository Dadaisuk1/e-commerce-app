"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../app/data";
import { useCart } from "../../app/hooks/useCart";
import { formatCurrency, cn } from "../../app/lib/utils";

// Shadcn UI
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
import { toast } from "sonner";

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
    if (isEffectivelyOutOfStock) {
      toast.error(`Sorry, no more ${product.name} available.`);
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    addToCart(product, 1);

    if (availableStock === 1) {
      toast("Limited stock warning", {
        description: "Only 1 item left in stock!",
        duration: 3000,
      });
    }
  };

  const productUrl = `/products/${product.id}`;

  return (
    <Card className="group flex flex-col overflow-hidden h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/30">
      <CardHeader className="p-0 relative overflow-hidden">
        <Link
          href={productUrl}
          className="block aspect-square relative bg-gray-100"
        >
          <Image
            src={product.imageUrl || "/images/placeholder.svg"}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
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
        <Link href={productUrl}>
          <CardTitle className="text-lg font-semibold mb-1 truncate group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <CardDescription className="text-muted-foreground mb-2 font-medium">
          {formatCurrency(product.price)}
        </CardDescription>
        <p className="text-sm text-muted-foreground mb-4 min-h-[40px] line-clamp-2">
          {product.description || "No description available."}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-3">
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

        <Button
          onClick={handleAddToCart}
          className="w-full mt-auto cursor-pointer"
          variant={isEffectivelyOutOfStock ? "outline" : "default"}
        >
          {isEffectivelyOutOfStock ? "Unavailable" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
