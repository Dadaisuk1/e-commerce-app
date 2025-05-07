// src/app/data/products.ts
import { Product } from './index';

export const sampleProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Stylish T-Shirt',
    price: 25.99,
    imageUrl: '/images/shirt.png',
    stock: 10,
    description: 'A cool t-shirt.',
    category: 'Clothing', // Category added
  },
  {
    id: 'prod2',
    name: 'Comfortable Jeans',
    price: 59.99,
    imageUrl: '/images/jeans.jpg',
    stock: 5,
    description: 'Great pair of jeans.',
    category: 'Clothing', // Category added
  },
  {
    id: 'prod3',
    name: 'Limited Sneakers',
    price: 120.00,
    imageUrl: '/images/sneakers.jpg',
    stock: 50,
    description: 'Exclusive limited edition sneakers.',
    category: 'Footwear', // Category added
  },
  {
    id: 'prod4',
    name: 'Classic Watch',
    price: 199.50,
    imageUrl: '/images/watch.jpg',
    stock: 3,
    description: 'An elegant timepiece.',
    category: 'Accessories', // Category added
  },
];
