// src/app/(shop)/page.tsx
'use client'; // Needed because we'll use hooks eventually (useCart)

import { ProductCard } from '@/app/components/ProductCard';
import { sampleProducts } from '@/app/data/products';

export default function HomePage() {
  return (
    <div> {/* Changed from <main> as layout provides <main> */}
      <h1 className="text-3xl font-bold mb-8 text-center">Welcome to Our Store!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Delete the original src/app/page.tsx if it still exists to avoid conflicts
