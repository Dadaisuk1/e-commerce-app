// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Import global styles

// Import Providers
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { OrderProvider } from "./contexts/OrderContext"; // Import OrderProvider

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
        {/* Wrap the entire application body with the providers */}
        {/* Order matters if contexts depend on each other */}
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              {" "}
              {/* Add OrderProvider here */}
              {children}
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
