// src/app/components/layout/Header.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import NotificationBell from "../NotificationBell";

export default function Header() {
  const { cartItems } = useCart();
  const { currentUser, logout } = useAuth();

  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Site Logo/Name */}
        <div className="flex items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            MyStore
          </Link>
        </div>

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
    </header>
  );
}
