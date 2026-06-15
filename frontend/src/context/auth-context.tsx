"use client";
// React & Hooks
import { createContext, useContext, useState, useEffect } from "react";

// Utils
import { StorageUtility, StorageKeys } from "@/lib/local-storage";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = StorageUtility.getItem<string>(
      StorageKeys.SESSION_TOKEN,
    );
    if (savedToken) {
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    StorageUtility.setItem(StorageKeys.SESSION_TOKEN, newToken);
    setToken(newToken);
  };

  const logout = () => {
    StorageUtility.removeItem(StorageKeys.SESSION_TOKEN);
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
