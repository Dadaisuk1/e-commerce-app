// src/app/(shop)/layout.tsx
import React from "react";

// Providers are now in the root layout, so they are removed from here

// Import Header and Footer
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // No providers needed here anymore
    <div className="flex flex-col min-h-screen">
      {" "}
      {/* Ensure footer stays at bottom */}
      <Header /> {/* Add Header */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {" "}
        {/* Adjusted padding/margins */}
        {children}
      </main>
      <Footer /> {/* Add Footer */}
    </div>
  );
}
