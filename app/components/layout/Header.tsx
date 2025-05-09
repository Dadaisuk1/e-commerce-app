"use client";

import React, { useState, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import { useCart } from "../../../app/hooks/useCart";
import { useAuth } from "../../../app/hooks/useAuth";
import NotificationBell from "../NotificationBell";
import { Button } from "../../../src/components/ui/button";
import { Input } from "../../../src/components/ui/input";
import { ShoppingCart, Search } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../src/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../../src/components/ui/avatar";

import { useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const { cartItems, clearCart } = useCart();
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const [headerSearchTerm, setHeaderSearchTerm] = useState("");

  useEffect(() => {
    setHeaderSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
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

  const handleLogout = () => {
    logout();
    clearCart();
    console.log("User logged out and cart cleared.");
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link
            href="/"
            className="text-xl font-bold text-primary hover:opacity-80 transition-opacity cursor-pointer"
          >
            MyStore
          </Link>
        </div>

        {/* Search Bar */}
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

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label={`Shopping Cart (${cartItemCount} items)`}
          >
            <Link href="/cart" className="relative cursor-pointer">
              <ShoppingCart className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Notifications */}
          <NotificationBell />

          {/* Auth */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full cursor-pointer"
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
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="cursor-pointer"
              >
                <Link href="/login"> Login </Link>
              </Button>
              <Button size="sm" asChild className="cursor-pointer">
                <Link href="/register"> Register </Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Search */}
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
