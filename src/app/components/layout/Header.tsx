"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/app/hooks/useCart";
import { useAuth } from "@/app/hooks/useAuth";
<<<<<<< HEAD
import NotificationBell from "../NotificationBell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { cartItems, clearCart } = useCart();
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
=======
import NotificationBell from "../NotificationBell"; // Import the NotificationBell component

export default function Header() {
  const { cartItems } = useCart();
  const { currentUser, logout } = useAuth();
>>>>>>> parent of 9d1fc42 (fully functional)

  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );
<<<<<<< HEAD
  const [headerSearchTerm, setHeaderSearchTerm] = useState("");

  useEffect(() => {
    // Safely handle searchParams and update headerSearchTerm on changes
    const category = searchParams.get("q");
    if (category) {
      setHeaderSearchTerm(category);
    }
  }, [searchParams]);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams();
    if (term) {
      params.set("q", term);
    }
    // Navigate to /shop with updated query params
    router.push(`/shop?${params.toString()}`);
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

  const handleLogout = () => {
    logout();
    clearCart();
    console.log("User logged out and cart cleared.");
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo links to Landing Page ('/') */}
        <div className="flex items-center flex-shrink-0">
=======

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Site Logo/Name */}
        <div className="flex items-center">
>>>>>>> parent of 9d1fc42 (fully functional)
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            MyStore
          </Link>
        </div>

<<<<<<< HEAD
        {/* Center: Search Bar */}
        <div className="flex-grow max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg hidden md:block">
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

        {/* Right Side: Icons & Auth */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* Optional explicit Shop link */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:inline-flex"
          >
            <Link href="/shop">Shop</Link>
          </Button>

          {/* Cart Link */}
          <Button
            variant="ghost"
            size="icon"
            asChild
=======
        {/* Navigation Links & Icons */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Shop Link */}
          <Link
            href="/"
            className="text-gray-600 hover:text-blue-600 transition-colors hidden sm:inline"
          >
            Shop
          </Link>
          {/* Cart Link with Item Count */}
          <Link
            href="/cart"
            className="relative text-gray-600 hover:text-blue-600 transition-colors"
>>>>>>> parent of 9d1fc42 (fully functional)
            aria-label={`Shopping Cart (${cartItemCount} items)`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 inline-block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          {/* Notification Bell */}
          <NotificationBell /> {/* Add the notification bell here */}
          {/* Divider (Optional) */}
          <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
          {/* Conditional Auth Links */}
          {currentUser ? (
<<<<<<< HEAD
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
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
=======
            <>
              <span className="text-sm text-gray-700 hidden lg:inline">
                Hi, {currentUser.email}
              </span>
              <Link
                href="/orders"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                My Orders
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-1 rounded border border-gray-300 hover:border-blue-500 text-sm"
              >
                Logout
              </button>
            </>
>>>>>>> parent of 9d1fc42 (fully functional)
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-gray-600 hover:text-blue-600 transition-colors bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
<<<<<<< HEAD
      {/* Search Bar (visible on smaller screens) */}
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
=======
>>>>>>> parent of 9d1fc42 (fully functional)
    </header>
  );
}
