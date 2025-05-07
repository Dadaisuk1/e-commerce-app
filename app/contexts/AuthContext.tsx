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

// --- Re-use helper function ---
const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window !== "undefined") {
    try {
      const item = window.localStorage.getItem(key);
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
  login: (email: string, pass: string) => Promise<void>; // Make async to simulate API call
  logout: () => void;
  register: (email: string, pass: string) => Promise<void>; // Make async
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// --- Define custom error types (optional but good practice) ---
class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
class InvalidCredentialsError extends AuthError {
  constructor() {
    super("Invalid email or password.");
    this.name = "InvalidCredentialsError";
  }
}
class EmailExistsError extends AuthError {
  constructor() {
    super("An account with this email already exists.");
    this.name = "EmailExistsError";
  }
}
// --- End custom error types ---

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadFromLocalStorage<User | null>(AUTH_USER_KEY, null)
  );

  // Effect to save/remove user from localStorage
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
          window.localStorage.removeItem(AUTH_USER_KEY);
          console.log("Current user removed from localStorage");
        }
      }
    } catch (error) {
      console.error(`Error writing user to localStorage:`, error);
    }
  }, [currentUser]);

  // --- Updated Login Function ---
  const login = useCallback(
    async (email: string, pass: string): Promise<void> => {
      console.log(`Attempting login for: ${email}`);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // --- Simulated Validation ---
      // Hardcode one valid user for testing
      const validEmail = "test@example.com";
      const validPassword = "password123";

      if (email === validEmail && pass === validPassword) {
        const simulatedUser: User = { id: `user_${Date.now()}`, email: email };
        setCurrentUser(simulatedUser); // Update state, triggers useEffect
        console.log("Login successful");
        // No need to return anything on success
      } else {
        console.log("Login failed: Invalid credentials");
        // Throw a specific error
        throw new InvalidCredentialsError();
      }
    },
    []
  ); // No dependencies needed for this simulation

  // --- Updated Register Function ---
  const register = useCallback(
    async (email: string, pass: string): Promise<void> => {
      console.log(`Attempting registration for: ${email}`);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // --- Simulated Validation ---
      const existingUserEmail = "test@example.com"; // Simulate this email already exists

      if (email === existingUserEmail) {
        console.log("Registration failed: Email already exists");
        // Throw a specific error
        throw new EmailExistsError();
      } else if (email && pass) {
        const simulatedUser: User = { id: `user_${Date.now()}`, email: email };
        setCurrentUser(simulatedUser); // Log in immediately after registration
        console.log("Registration successful");
        // No need to return anything on success
      } else {
        // This case might indicate invalid input before calling register
        console.log("Registration failed: Invalid input");
        throw new AuthError("Registration failed due to invalid input.");
      }
    },
    []
  ); // No dependencies needed

  const logout = useCallback(() => {
    console.log("Logging out");
    setCurrentUser(null);
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
