import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
  return (
    <nav
      className={`flex justify-between items-center px-6 py-4 border-b bg-background/80 backdrop-blur-md fixed top-0 left-0 w-full z-50 ${className}`}
    >
      {/* Logo */}
      <div className="text-lg font-bold text-foreground">
        <Link href="/">MyStore</Link>
      </div>

      {/* Auth Buttons */}
      <div className="flex gap-4">
        <Link href="/login">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link href="/register">
          <Button>Register</Button>
        </Link>
      </div>
    </nav>
  );
}
