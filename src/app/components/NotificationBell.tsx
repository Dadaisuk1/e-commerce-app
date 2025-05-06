// src/app/components/layout/NotificationBell.tsx
"use client";

import React from "react";
import { useOrders } from "@/app/hooks/useOrders";
import { Bell } from "lucide-react"; // Import icon
import { Button } from "@/components/ui/button"; // Needed for trigger
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area"; // To handle many notifications
import { Badge } from "@/components/ui/badge"; // To show unread status

// Helper to format time ago (can be moved to utils)
function timeAgo(timestamp: Date): string {
  const now = new Date();
  const secondsPast = (now.getTime() - timestamp.getTime()) / 1000;

  if (secondsPast < 60) {
    return `${Math.round(secondsPast)}s ago`;
  }
  if (secondsPast < 3600) {
    return `${Math.round(secondsPast / 60)}m ago`;
  }
  if (secondsPast <= 86400) {
    return `${Math.round(secondsPast / 3600)}h ago`;
  }
  // For older notifications, show date
  const daysPast = Math.round(secondsPast / 86400);
  if (daysPast <= 7) {
    return `${daysPast}d ago`;
  }
  return timestamp.toLocaleDateString();
}

export default function NotificationBell() {
  const { notifications, markNotificationsRead } = useOrders();

  // Calculate the count of unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenChange = (isOpen: boolean) => {
    // Mark notifications as read when the dropdown is opened
    if (isOpen && unreadCount > 0) {
      markNotificationsRead();
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        {/* This button is the trigger area */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications (${unreadCount} unread)`}
        >
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 block h-4 w-4 transform translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-background bg-primary text-primary-foreground text-xs flex items-center justify-center text-[10px]">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 mr-2" align="end">
        {" "}
        {/* Adjust width and alignment */}
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {/* Optional: Add a "Clear All" button here later */}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Use ScrollArea for potentially long lists */}
        <ScrollArea className="h-[300px]">
          {" "}
          {/* Set max height */}
          {notifications.length === 0 ? (
            <DropdownMenuItem
              disabled
              className="text-center text-muted-foreground text-sm py-4"
            >
              No notifications yet.
            </DropdownMenuItem>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-2 ${
                  !notification.read ? "bg-accent/50" : ""
                }`}
              >
                {/* Optional: Add an icon based on notification type */}
                {/* <div className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-primary"></div> */}
                <div className="flex-grow">
                  <p className="text-sm leading-snug">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {timeAgo(notification.timestamp)}
                  </p>
                </div>
                {!notification.read && (
                  <Badge
                    variant="default"
                    className="h-4 px-1.5 text-[10px] flex-shrink-0"
                  >
                    New
                  </Badge>
                )}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        {/* Optional: Add footer link like "View all notifications" */}
        {/* <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-blue-600 hover:underline cursor-pointer">
                View All (Not Implemented)
            </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
