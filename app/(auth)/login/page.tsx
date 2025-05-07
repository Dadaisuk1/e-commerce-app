// src/app/(auth)/login/page.tsx
"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "../../../app/hooks/useAuth";
import { useRouter } from "next/navigation";

// Import Shadcn/ui components
import { Button } from "../../../src/components/ui/button";
import { Input } from "../../../src/components/ui/input";
import { Label } from "../../../src/components/ui/label"; // Use Label for accessibility
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../src/components/ui/card"; // Use Card for layout

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true); // Set loading true

    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false); // Reset loading
      return;
    }

    try {
      login(email, password);
      // Simulate async operation if needed, otherwise redirect immediately
      // Since login is synchronous in simulation:
      console.log("Redirecting to homepage after simulated login...");
      router.push("/");
    } catch (err) {
      console.error("Login error (simulated catch):", err);
      setError("Login failed. Please check your credentials.");
      setIsLoading(false); // Reset loading on error
    }
    // No need to reset loading here if redirecting on success
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* Use Shadcn Card for styling the form container */}
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login to MyStore</CardTitle>
          <CardDescription>Enter your email and password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              {/* Use Shadcn Label */}
              <Label htmlFor="email">Email address</Label>
              {/* Use Shadcn Input */}
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading} // Disable input while loading
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={isLoading} // Disable input while loading
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Use Shadcn Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
            >
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
