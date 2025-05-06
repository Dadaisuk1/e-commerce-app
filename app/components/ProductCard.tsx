// src/app/components/ProductCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/app/data';
import { useCart } from '@/app/hooks/useCart';
import { formatCurrency } from '@/app/lib/utils';
import { cn } from '@/app/lib/utils'; // Import the cn utility

// Import Shadcn/ui components
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge'; // Add Badge for stock status

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cartItems } = useCart();
  const quantityInCart = cartItems.find(item => item.id === product.id)?.quantity || 0;
  const availableStock = product.stock - quantityInCart;
  const isEffectivelyOutOfStock = availableStock <= 0;

  const handleAddToCart = () => {
    if (!isEffectivelyOutOfStock) {
      addToCart(product, 1);
    } else {
      alert(`Sorry, no more ${product.name} available to add.`);
    }
  };

  return (
    // Use Shadcn Card component as the main container
    <Card className="flex flex-col overflow-hidden h-full"> {/* Ensure card takes full height if in grid */}
      <CardHeader className="p-0 relative"> {/* Remove padding for image */}
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-gray-100"> {/* Use aspect-square for consistent image ratio */}
          <Image
            src={product.imageUrl || '/images/placeholder.svg'}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }} // Or 'cover' depending on desired look
            className="rounded-t-lg" // Only round top corners if image is flush
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw" // Example sizes prop for optimization
          />
          {/* Out of Stock Overlay */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-t-lg">
              <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow"> {/* Add padding back for content, flex-grow allows content to push footer down */}
        {/* Use CardTitle for product name */}
        <CardTitle className="text-lg font-semibold mb-1 truncate">{product.name}</CardTitle>
        {/* Use CardDescription for price or short description */}
        <CardDescription className="text-gray-700 mb-2 font-medium">
          {formatCurrency(product.price)}
        </CardDescription>
        {/* Main description */}
        <p className="text-sm text-gray-500 mb-4 min-h-[40px]">
          {product.description || "No description available."}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-3"> {/* Footer for stock and button */}
         {/* Display Available Stock using Badge */}
         <div> {/* Wrap badge for layout control if needed */}
            <Badge
                variant={isEffectivelyOutOfStock ? "outline" : "secondary"}
                className={cn(
                    "text-xs font-semibold",
                    isEffectivelyOutOfStock ? "border-red-500 text-red-600" : "text-green-700"
                )}
            >
                {isEffectivelyOutOfStock
                ? (product.stock <= 0 ? "Out of Stock" : "None available (in cart)")
                : `${availableStock} available`}
            </Badge>
         </div>

        {/* Use Shadcn Button component */}
        <Button
          onClick={handleAddToCart}
          disabled={isEffectivelyOutOfStock}
          className="w-full mt-auto" // Ensure button takes full width
          variant={isEffectivelyOutOfStock ? "outline" : "default"} // Use different variants
        >
          {isEffectivelyOutOfStock ? "Unavailable" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
