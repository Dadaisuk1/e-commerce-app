// src/app/contexts/AuthContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';

// Define the shape of the user object (can be expanded later)
interface User {
  id: string;
  email: string; // Example field
}

// Define the shape of the context data
interface AuthContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => void; // Simulate login
  logout: () => void;
  register: (email: string, pass: string) => void; // Simulate registration
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Simulate login - replace with actual logic later
  const login = useCallback((email: string, pass: string) => {
    console.log(`Simulating login for: ${email}`);
    // In a real app, you'd validate credentials here
    if (email && pass) { // Basic check
      const simulatedUser: User = { id: `user_${Date.now()}`, email: email };
      setCurrentUser(simulatedUser);
      console.log('Login successful (simulated)');
      // Maybe redirect user using useRouter hook from 'next/navigation'
    } else {
        console.log('Login failed (simulated)');
    }
  }, []);

  // Simulate registration - replace with actual logic later
  const register = useCallback((email: string, pass: string) => {
     console.log(`Simulating registration for: ${email}`);
     if (email && pass) { // Basic check
        const simulatedUser: User = { id: `user_${Date.now()}`, email: email };
        setCurrentUser(simulatedUser); // Log in immediately after registration
        console.log('Registration successful (simulated)');
        // Maybe redirect user
     } else {
         console.log('Registration failed (simulated)');
     }
  }, []);

  // Logout
  const logout = useCallback(() => {
    console.log('Logging out');
    setCurrentUser(null);
    // Maybe redirect user to homepage
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentUser,
    login,
    logout,
    register,
  }), [currentUser, login, logout, register]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook for easy consumption
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
