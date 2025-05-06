// src/app/data/products.ts
// Import the single source of truth for Product and ProductCategory
import { Product } from './index';

// Generate more products
export const sampleProducts: Product[] = [
   // Electronics (10)
  { id: 'prod1', name: 'High-Performance Laptop', price: 1299.99, imageUrl: '/images/placeholder.svg', stock: 15, description: 'Latest generation laptop for work and play.', category: 'Electronics' },
  { id: 'prod2', name: 'Wireless Noise-Cancelling Headphones', price: 249.99, imageUrl: '/images/placeholder.svg', stock: 30, description: 'Immersive sound experience without distractions.', category: 'Electronics' },
  { id: 'prod3', name: 'Smartphone Pro', price: 999.00, imageUrl: '/images/placeholder.svg', stock: 25, description: 'Flagship smartphone with amazing camera.', category: 'Electronics' },
  { id: 'prod4', name: '4K Ultra HD Smart TV', price: 799.50, imageUrl: '/images/placeholder.svg', stock: 10, description: 'Stunning visuals for your living room.', category: 'Electronics' },
  { id: 'prod5', name: 'Bluetooth Speaker Portable', price: 79.99, imageUrl: '/images/placeholder.svg', stock: 50, description: 'Compact speaker with powerful sound.', category: 'Electronics' },
  { id: 'prod6', name: 'Gaming Mouse RGB', price: 49.99, imageUrl: '/images/placeholder.svg', stock: 40, description: 'Precision gaming mouse with customizable lighting.', category: 'Electronics' },
  { id: 'prod7', name: 'Mechanical Keyboard', price: 119.99, imageUrl: '/images/placeholder.svg', stock: 20, description: 'Tactile keyboard for typing and gaming.', category: 'Electronics' },
  { id: 'prod8', name: 'E-Reader Tablet', price: 129.00, imageUrl: '/images/placeholder.svg', stock: 35, description: 'Read your favorite books anywhere.', category: 'Electronics' },
  { id: 'prod9', name: 'Smartwatch Fitness Tracker', price: 199.00, imageUrl: '/images/placeholder.svg', stock: 22, description: 'Monitor your health and stay connected.', category: 'Electronics' },
  { id: 'prod10', name: 'Webcam HD 1080p', price: 59.99, imageUrl: '/images/placeholder.svg', stock: 0, description: 'High-definition webcam for video calls.', category: 'Electronics' }, // Out of stock

  // Clothing (10)
  { id: 'prod11', name: 'Classic Cotton T-Shirt', price: 19.99, imageUrl: '/images/placeholder.svg', stock: 100, description: 'Soft and comfortable everyday t-shirt.', category: 'Clothing' },
  { id: 'prod12', name: 'Slim Fit Denim Jeans', price: 59.99, imageUrl: '/images/placeholder.svg', stock: 60, description: 'Modern slim fit jeans.', category: 'Clothing' },
  { id: 'prod13', name: 'Lightweight Hoodie', price: 45.00, imageUrl: '/images/placeholder.svg', stock: 40, description: 'Perfect for cool evenings.', category: 'Clothing' },
  { id: 'prod14', name: 'Running Sneakers', price: 89.95, imageUrl: '/images/placeholder.svg', stock: 50, description: 'Comfortable shoes for your daily run.', category: 'Clothing' },
  { id: 'prod15', name: 'Formal Dress Shirt', price: 39.99, imageUrl: '/images/placeholder.svg', stock: 30, description: 'Crisp shirt for formal occasions.', category: 'Clothing' },
  { id: 'prod16', name: 'Summer Dress Floral', price: 65.00, imageUrl: '/images/placeholder.svg', stock: 25, description: 'Light and airy dress for summer.', category: 'Clothing' },
  { id: 'prod17', name: 'Winter Jacket Insulated', price: 149.99, imageUrl: '/images/placeholder.svg', stock: 15, description: 'Warm jacket for cold weather.', category: 'Clothing' },
  { id: 'prod18', name: 'Leather Belt', price: 29.99, imageUrl: '/images/placeholder.svg', stock: 70, description: 'Classic leather belt.', category: 'Clothing' },
  { id: 'prod19', name: 'Wool Scarf', price: 34.50, imageUrl: '/images/placeholder.svg', stock: 45, description: 'Soft wool scarf for added warmth.', category: 'Clothing' },
  { id: 'prod20', name: 'Crew Socks (3-Pack)', price: 12.99, imageUrl: '/images/placeholder.svg', stock: 150, description: 'Comfortable cotton crew socks.', category: 'Clothing' },

  // Home Goods (10)
  { id: 'prod21', name: 'Coffee Maker Drip', price: 49.95, imageUrl: '/images/placeholder.svg', stock: 30, description: 'Brew delicious coffee easily.', category: 'Home Goods' },
  { id: 'prod22', name: 'Robot Vacuum Cleaner', price: 299.00, imageUrl: '/images/placeholder.svg', stock: 12, description: 'Keeps your floors clean automatically.', category: 'Home Goods' },
  { id: 'prod23', name: 'Bed Sheet Set (Queen)', price: 55.00, imageUrl: '/images/placeholder.svg', stock: 40, description: 'Soft microfiber sheet set.', category: 'Home Goods' },
  { id: 'prod24', name: 'Chef\'s Knife 8-Inch', price: 75.00, imageUrl: '/images/placeholder.svg', stock: 20, description: 'High-quality knife for kitchen tasks.', category: 'Home Goods' },
  { id: 'prod25', name: 'Non-Stick Frying Pan', price: 32.99, imageUrl: '/images/placeholder.svg', stock: 50, description: 'Essential pan for everyday cooking.', category: 'Home Goods' },
  { id: 'prod26', name: 'Throw Pillow Decorative', price: 24.99, imageUrl: '/images/placeholder.svg', stock: 60, description: 'Add a touch of style to your sofa.', category: 'Home Goods' },
  { id: 'prod27', name: 'Bath Towel Set (4-Piece)', price: 39.99, imageUrl: '/images/placeholder.svg', stock: 35, description: 'Absorbent cotton towel set.', category: 'Home Goods' },
  { id: 'prod28', name: 'Desk Lamp LED', price: 29.95, imageUrl: '/images/placeholder.svg', stock: 45, description: 'Adjustable LED lamp for your workspace.', category: 'Home Goods' },
  { id: 'prod29', name: 'Wall Clock Modern', price: 42.00, imageUrl: '/images/placeholder.svg', stock: 28, description: 'Stylish clock for any room.', category: 'Home Goods' },
  { id: 'prod30', name: 'Storage Bin Set', price: 27.99, imageUrl: '/images/placeholder.svg', stock: 55, description: 'Organize your space with these bins.', category: 'Home Goods' },

   // Books (10)
  { id: 'prod31', name: 'The Midnight Library', price: 15.99, imageUrl: '/images/placeholder.svg', stock: 50, description: 'A novel about choices and regrets.', category: 'Books' },
  { id: 'prod32', name: 'Atomic Habits', price: 18.50, imageUrl: '/images/placeholder.svg', stock: 70, description: 'Build good habits, break bad ones.', category: 'Books' },
  { id: 'prod33', name: 'Project Hail Mary', price: 17.99, imageUrl: '/images/placeholder.svg', stock: 40, description: 'A thrilling science fiction adventure.', category: 'Books' },
  { id: 'prod34', name: 'Sapiens: A Brief History of Humankind', price: 22.00, imageUrl: '/images/placeholder.svg', stock: 30, description: 'Exploring the history of our species.', category: 'Books' },
  { id: 'prod35', name: 'Where the Crawdads Sing', price: 14.95, imageUrl: '/images/placeholder.svg', stock: 60, description: 'A mystery and coming-of-age story.', category: 'Books' },
  { id: 'prod36', name: 'Cookbook: Simple Recipes', price: 25.00, imageUrl: '/images/placeholder.svg', stock: 35, description: 'Easy recipes for everyday meals.', category: 'Books' },
  { id: 'prod37', name: 'The Lord of the Rings', price: 29.99, imageUrl: '/images/placeholder.svg', stock: 20, description: 'Classic fantasy epic.', category: 'Books' },
  { id: 'prod38', name: 'Becoming by Michelle Obama', price: 19.99, imageUrl: '/images/placeholder.svg', stock: 45, description: 'An intimate memoir.', category: 'Books' },
  { id: 'prod39', name: 'Children\'s Picture Book', price: 9.99, imageUrl: '/images/placeholder.svg', stock: 80, description: 'A colorful book for young readers.', category: 'Books' },
  { id: 'prod40', name: 'Introduction to Python Programming', price: 45.00, imageUrl: '/images/placeholder.svg', stock: 25, description: 'Learn the basics of Python.', category: 'Books' },

   // Sports (10)
  { id: 'prod41', name: 'Yoga Mat Extra Thick', price: 28.99, imageUrl: '/images/placeholder.svg', stock: 60, description: 'Comfortable mat for yoga and exercise.', category: 'Sports' },
  { id: 'prod42', name: 'Adjustable Dumbbells Set', price: 199.00, imageUrl: '/images/placeholder.svg', stock: 15, description: 'Versatile weights for home workouts.', category: 'Sports' },
  { id: 'prod43', name: 'Basketball Size 7', price: 24.95, imageUrl: '/images/placeholder.svg', stock: 50, description: 'Official size basketball.', category: 'Sports' },
  { id: 'prod44', name: 'Resistance Bands Set', price: 19.99, imageUrl: '/images/placeholder.svg', stock: 75, description: 'Exercise bands for strength training.', category: 'Sports' },
  { id: 'prod45', name: 'Hiking Backpack 40L', price: 85.00, imageUrl: '/images/placeholder.svg', stock: 20, description: 'Durable backpack for hiking trips.', category: 'Sports' },
  { id: 'prod46', name: 'Tennis Racket Graphite', price: 110.00, imageUrl: '/images/placeholder.svg', stock: 18, description: 'Lightweight racket for intermediate players.', category: 'Sports' },
  { id: 'prod47', name: 'Soccer Ball Size 5', price: 22.50, imageUrl: '/images/placeholder.svg', stock: 40, description: 'Standard size soccer ball.', category: 'Sports' },
  { id: 'prod48', name: 'Jump Rope Speed', price: 12.95, imageUrl: '/images/placeholder.svg', stock: 100, description: 'Adjustable speed jump rope.', category: 'Sports' },
  { id: 'prod49', name: 'Water Bottle Insulated', price: 18.99, imageUrl: '/images/placeholder.svg', stock: 90, description: 'Keeps drinks cold or hot.', category: 'Sports' },
  { id: 'prod50', name: 'Golf Balls (Dozen)', price: 35.00, imageUrl: '/images/placeholder.svg', stock: 55, description: 'High-performance golf balls.', category: 'Sports' },
];
