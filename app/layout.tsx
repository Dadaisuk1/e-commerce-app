// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Import global styles

// Import Providers
import { AuthProvider } from "../app/contexts/AuthContext";
import { CartProvider } from "../app/contexts/CartContext";
import { OrderProvider } from "../app/contexts/OrderContext";
import { Toaster } from "sonner"; // ✅ Updated to use sonner

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My E-Commerce App",
  description: "Prototype E-Commerce Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              {children}
              <Toaster /> {/* ✅ Updated Toaster from sonner */}
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
