// src/app/data/products.ts
import { Product } from './index';

export const sampleProducts: Product[] = [
  { id: 'prod1', name: 'Stylish T-Shirt', price: 25.99, imageUrl: '/images/placeholder.svg', stock: 10, description: 'A cool t-shirt.' },
  { id: 'prod2', name: 'Comfortable Jeans', price: 59.99, imageUrl: '/images/placeholder.svg', stock: 5, description: 'Great pair of jeans.' },
  { id: 'prod3', name: 'Limited Sneakers', price: 120.00, imageUrl: '/images/placeholder.svg', stock: 0, description: 'Exclusive limited edition sneakers.' }, // Out of stock
  { id: 'prod4', name: 'Classic Watch', price: 199.50, imageUrl: '/images/placeholder.svg', stock: 3, description: 'An elegant timepiece.' },
];

// Note: Create a `/public/images` folder and add a placeholder.svg image,
// or replace these URLs with actual image paths/URLs later.
