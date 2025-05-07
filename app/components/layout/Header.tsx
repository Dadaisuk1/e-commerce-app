// src/app/components/layout/Header.tsx
"use client";

import React, { useState, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import { useCart } from "../../../app/hooks/useCart";
import { useAuth } from "../../../app/hooks/useAuth";
import NotificationBell from "../NotificationBell";
import { Button } from "../../../src/components/ui/button";
import { Input } from "../../../src/components/ui/input";
import { ShoppingCart, Search } from "lucide-react";

// Import Shadcn/ui components for Dropdown and Avatar
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../src/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  // AvatarImage,
} from "../../../src/components/ui/avatar";

// Import hooks for navigation and reading search params
import { useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const { cartItems, clearCart } = useCart(); // Get clearCart function
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to read URL query params

  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  // State for the search input in the header
  const [headerSearchTerm, setHeaderSearchTerm] = useState("");

  // Effect to sync header input with URL search param 'q' when page loads/URL changes
  useEffect(() => {
    setHeaderSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  // Function to handle search submission (e.g., pressing Enter)
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString()); // Create mutable copy
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q"); // Remove 'q' if search is cleared
    }
    // Navigate to the root page (shop page) with the new query params
    // Using toString() correctly formats the query string
    router.push(`/?${params.toString()}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(headerSearchTerm);
    }
  };

  const getUserInitials = (email: string | undefined): string => {
    if (!email) return "?";
    return email.substring(0, 1).toUpperCase();
  };

  // --- Updated Logout Handler ---
  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    clearCart(); // Call the clearCart function from CartContext
    // Optional: Redirect to home or login page after logout
    // router.push('/');
    console.log("User logged out and cart cleared.");
  };
  // --- End Updated Logout Handler ---

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {" "}
        {/* Added gap */}
        {/* Left Side: Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link
            href="/"
            className="text-xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            MyStore
          </Link>
        </div>
        {/* Center: Search Bar (visible on larger screens) */}
        <div className="flex-grow max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg hidden md:block">
          {" "}
          {/* Adjust max-width and visibility */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={headerSearchTerm}
              onChange={(e) => setHeaderSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown} // Trigger search on Enter
              className="pl-8 w-full h-9" // Add padding for icon
            />
          </div>
        </div>
        {/* Right Side: Icons & Auth */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* Cart Link */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label={`Shopping Cart (${cartItemCount} items)`}
          >
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Notification Bell */}
          <NotificationBell />

          {/* Conditional Auth Section */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {getUserInitials(currentUser.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      My Account
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled> Settings </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Updated Logout Item */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
                {/* End Updated Logout Item */}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login"> Login </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register"> Register </Link>
              </Button>
            </>
          )}
        </div>
      </nav>
      {/* Search Bar (visible on smaller screens) - Optional */}
      <div className="container mx-auto px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={headerSearchTerm}
            onChange={(e) => setHeaderSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-8 w-full h-9"
          />
        </div>
      </div>
    </header>
  );
}
