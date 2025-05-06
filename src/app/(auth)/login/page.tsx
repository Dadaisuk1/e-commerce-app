// src/app/(auth)/login/page.tsx
'use client'; // Needed for useState and hooks

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // To display potential errors
  const { login } = useAuth();
  const router = useRouter(); // Get router instance

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    setError(null); // Clear previous errors

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      // Call the login function from AuthContext
      // In our simulation, it doesn't throw errors, but we'll keep the try/catch
      login(email, password);

      // --- IMPORTANT ---
      // Since our simulated login immediately sets the user,
      // we can redirect here. In a real app, you'd wait for
      // the login promise to resolve successfully.
      console.log('Redirecting to homepage after simulated login...');
      router.push('/'); // Redirect to homepage after successful login

    } catch (err) {
      // Handle errors from a real API call here
      console.error('Login error (simulated catch):', err);
      setError('Login failed. Please check your credentials.'); // Generic error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Login to MyStore</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
