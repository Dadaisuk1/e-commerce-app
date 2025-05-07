// src/app/components/layout/Header.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "../../../app/hooks/useCart";
import { useAuth } from "../../../app/hooks/useAuth";
import NotificationBell from "../NotificationBell";
import { Button } from "../../../src/components/ui/button";
import { ShoppingCart } from "lucide-react";

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

export default function Header() {
  const { cartItems } = useCart();
  const { currentUser, logout } = useAuth();

  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  // Get user initials for Avatar fallback
  const getUserInitials = (email: string | undefined): string => {
    if (!email) return "?";
    return email.substring(0, 1).toUpperCase(); // Just use first letter of email
  };

  return (
    // Use theme variables for background and border
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {" "}
        {/* Set fixed height */}
        {/* Site Logo/Name - Use primary color */}
        <div className="flex items-center">
          <Link
            href="/"
            className="text-xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            MyStore
          </Link>
        </div>
        {/* Navigation Links & Icons - Use foreground/muted-foreground */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {" "}
          {/* Reduced spacing slightly */}
          {/* Cart Link with Item Count */}
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
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Notifications`}
          >
            <NotificationBell />{" "}
            {/* Bell component handles its own icon/badge */}
          </Button>
          {/* Conditional Auth Section */}
          {currentUser ? (
            // --- User Logged In: Show Avatar + Dropdown ---
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    {/* Add AvatarImage if you have user profile image URLs */}
                    {/* <AvatarImage src={currentUser.profileImageUrl} alt={currentUser.email} /> */}
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
                {/* Use DropdownMenuItem with asChild for Links */}
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  {" "}
                  {/* Example disabled item */}
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Use onSelect for actions like logout */}
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // --- User Logged Out: Show Login/Register Buttons ---
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
