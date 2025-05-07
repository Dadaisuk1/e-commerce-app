// src/app/contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from "react";

// Define localStorage key
const AUTH_USER_KEY = "myAppAuthUser";

// --- Re-use helper function or define locally ---
const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window !== "undefined") {
    try {
      const item = window.localStorage.getItem(key);
      // For user object, simple parse is usually fine unless it contains Dates
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  }
  return defaultValue;
};

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => void;
  logout: () => void;
  register: (email: string, pass: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // --- Initialize state from localStorage ---
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadFromLocalStorage<User | null>(AUTH_USER_KEY, null)
  );

  // --- Effect to save/remove user from localStorage ---
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        if (currentUser) {
          window.localStorage.setItem(
            AUTH_USER_KEY,
            JSON.stringify(currentUser)
          );
          console.log("Current user saved to localStorage");
        } else {
          window.localStorage.removeItem(AUTH_USER_KEY); // Remove if logged out
          console.log("Current user removed from localStorage");
        }
      }
    } catch (error) {
      console.error(`Error writing user to localStorage:`, error);
    }
  }, [currentUser]); // Dependency array: run when currentUser changes

  // --- Functions --- (Logic remains the same, they just call setCurrentUser)

  const login = useCallback((email: string, pass: string) => {
    console.log(`Simulating login for: ${email}`);
    if (email && pass) {
      const simulatedUser: User = { id: `user_${Date.now()}`, email: email };
      setCurrentUser(simulatedUser); // Update state, triggers useEffect
    } else {
      console.log("Login failed (simulated)");
      // Optionally clear user state if attempting login fails? setCurrentUser(null);
    }
  }, []);

  const register = useCallback((email: string, pass: string) => {
    console.log(`Simulating registration for: ${email}`);
    if (email && pass) {
      const simulatedUser: User = { id: `user_${Date.now()}`, email: email };
      setCurrentUser(simulatedUser); // Update state, triggers useEffect
    } else {
      console.log("Registration failed (simulated)");
    }
  }, []);

  const logout = useCallback(() => {
    console.log("Logging out");
    setCurrentUser(null); // Update state to null, triggers useEffect to remove item
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      login,
      logout,
      register,
    }),
    [currentUser, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
