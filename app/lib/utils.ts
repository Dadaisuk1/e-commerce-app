// src/app/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// This function is added/updated by Shadcn/ui
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Your existing functions ---
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP', // Adjust currency as needed
  }).format(amount);
}

export function generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}
