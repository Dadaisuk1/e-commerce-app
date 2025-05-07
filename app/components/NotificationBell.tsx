// src/app/components/layout/NotificationBell.tsx
"use client";

import React from "react";
import { useOrders } from "../../app/hooks/useOrders"; // Assuming hook file exists

export default function NotificationBell() {
  const { notifications, markNotificationsRead } = useOrders();

  // Calculate the count of unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleBellClick = () => {
    // Mark notifications as read when the bell is clicked
    // In a real app, this might open a dropdown first
    if (unreadCount > 0) {
      markNotificationsRead();
    }
    console.log("Notification bell clicked.");
    // Add logic here later to toggle a dropdown list of notifications
  };

  return (
    <button
      onClick={handleBellClick}
      className="relative text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
      aria-label={`Notifications (${unreadCount} unread)`}
    >
      {/* Bell Icon Placeholder - replace with an actual SVG icon later */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      {/* Unread Count Badge */}
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 block h-5 w-5 transform -translate-y-1/2 translate-x-1/2 rounded-full ring-2 ring-white bg-red-500 text-white text-xs items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
