// src/app/lib/utils.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // Adjust currency as needed
  }).format(amount);
}

// Add generate unique ID function later if needed for orders
export function generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}
