"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { RecordModel } from "pocketbase";
import { getPocketBase, clearPocketBase } from "@/lib/pocketbase";

interface AuthState {
  user: RecordModel | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

type AuthContextValue = AuthState & AuthActions;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state from PocketBase authStore
  useEffect(() => {
    const pb = getPocketBase();
    if (pb.authStore.isValid && pb.authStore.record) {
      setState({
        user: pb.authStore.record,
        token: pb.authStore.token,
        isLoading: false,
        isAuthenticated: true,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const pb = getPocketBase();
    try {
      const result = await pb.collection("users").authWithPassword(email, password);
      setState({
        user: result.record,
        token: result.token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("[LOGIN ERROR]", error);
      const pbError = error as { status?: number; data?: { message?: string }; message?: string; original?: Error };
      
      // Check for network/connection errors
      if (pbError.original?.message?.includes('Failed to fetch') || 
          pbError.original?.message?.includes('network') ||
          pbError.message?.includes('Failed to fetch') ||
          pbError.message?.includes('network')) {
        throw new Error("Cannot connect to server. Please check your internet connection or contact support.");
      }
      
      // Handle specific PocketBase errors
      if (pbError.status === 400) {
        throw new Error("Invalid email or password. Please try again.");
      } else if (pbError.status === 404) {
        throw new Error("User not found. Please check your credentials.");
      } else if (pbError.data?.message) {
        throw new Error(pbError.data.message);
      } else if (pbError.message) {
        throw new Error(pbError.message);
      } else {
        throw new Error("Failed to login. Please check your connection and try again.");
      }
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const pb = getPocketBase();
      try {
        await pb.collection("users").create({
          email,
          password,
          passwordConfirm: password,
          name,
        });
        // Auto-login after registration
        const result = await pb
          .collection("users")
          .authWithPassword(email, password);
        setState({
          user: result.record,
          token: result.token,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("[REGISTER ERROR]", error);
        const pbError = error as { status?: number; data?: any; message?: string; original?: Error };
        
        // Check for network/connection errors
        if (pbError.original?.message?.includes('Failed to fetch') || 
            pbError.original?.message?.includes('network') ||
            pbError.message?.includes('Failed to fetch') ||
            pbError.message?.includes('network')) {
          throw new Error("Cannot connect to server. Please check your internet connection or contact support.");
        }
        
        // Handle specific PocketBase errors
        if (pbError.status === 400) {
          const validationErrors = pbError.data;
          if (validationErrors) {
            // Extract first validation error message
            const errorKeys = Object.keys(validationErrors);
            if (errorKeys.length > 0) {
              const firstError = validationErrors[errorKeys[0]];
              const errorMsg = firstError?.message || firstError || "Registration failed";
              throw new Error(errorMsg);
            }
          }
          throw new Error("Registration failed. Please check your information.");
        } else if (pbError.status === 409) {
          throw new Error("An account with this email already exists.");
        } else if (pbError.data?.message) {
          throw new Error(pbError.data.message);
        } else if (pbError.message) {
          throw new Error(pbError.message);
        } else {
          throw new Error("Failed to create account. Please check your connection.");
        }
      }
    },
    [],
  );

  const logout = useCallback(() => {
    clearPocketBase();
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const refresh = useCallback(async () => {
    const pb = getPocketBase();
    try {
      const result = await pb.collection("users").authRefresh();
      setState({
        user: result.record,
        token: result.token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      clearPocketBase();
      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
}
