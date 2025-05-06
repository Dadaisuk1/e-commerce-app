import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, Truck, Tag, CreditCard } from "lucide-react";
import Navbar from "./components/ui/Navbar";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Navbar className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur border-b" />
      {/* Hero Section */}
      <section className="w-full h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-100 via-white to-gray-100 dark:from-blue-900 dark:via-background dark:to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 to-transparent blur-2xl opacity-70" />
        <div className="text-center px-4 md:px-6 z-10">
          <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground drop-shadow">
              Welcome to MyStore
            </h1>
            <p className="mx-auto text-muted-foreground md:text-xl">
              Your one-stop shop for the latest Electronics, Fashion, Home
              Goods, and more. Quality products, delivered fast.
            </p>
            <Button
              size="lg"
              asChild
              className="mt-6 animate-bounce shadow-lg hover:scale-105 transition-transform"
            >
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full flex items-center justify-center py-16 md:py-24 lg:py-32 bg-background border-t">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Why Shop With Us?
            </h2>
            <p className="text-muted-foreground md:text-lg mt-2">
              Experience the MyStore difference.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "Wide Selection",
                "Thousands of products across electronics, clothing, home, and more.",
                <Package className="h-7 w-7" />,
              ],
              [
                "Fast Shipping",
                "Quick and reliable delivery right to your doorstep.",
                <Truck className="h-7 w-7" />,
              ],
              [
                "Great Deals",
                "Competitive prices and frequent promotions.",
                <Tag className="h-7 w-7" />,
              ],
              [
                "Secure Checkout",
                "Your information is safe with our secure payment system.",
                <CreditCard className="h-7 w-7" />,
              ],
            ].map(([title, desc, icon], i) => (
              <div
                key={i}
                className="flex flex-col items-center space-y-3 text-center p-6 rounded-xl border bg-card hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  {icon}
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full flex items-center justify-center py-16 md:py-24 lg:py-32 bg-muted/50 border-t">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-10">
            Featured Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 place-items-center">
            {["Electronics", "Clothing", "Home Goods", "Books", "Sports"].map(
              (category) => (
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  key={category}
                  className="w-full hover:scale-105 transition-transform shadow-sm"
                >
                  <Link href={`/shop?category=${category}`}>{category}</Link>
                </Button>
              )
            )}
          </div>
        </div>
      </section>
      <footer className="w-full border-t bg-background text-muted-foreground text-sm">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>
            © {new Date().getFullYear()} MyStore. All rights reserved.
          </span>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
