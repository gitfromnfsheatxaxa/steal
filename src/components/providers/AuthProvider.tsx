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

interface PBError {
  status?: number;
  data?: Record<string, { message?: string } | string>;
  message?: string;
  originalError?: { message?: string };
  url?: string;
  response?: Record<string, unknown>;
}

function parseAuthError(error: unknown, action: "login" | "register"): Error {
  const e = error as PBError;

  // Network / connection errors (Failed to fetch = browser couldn't reach the server)
  const raw = e.originalError?.message ?? e.message ?? "";
  if (
    raw.includes("Failed to fetch") ||
    raw.includes("NetworkError") ||
    raw.includes("ERR_CONNECTION") ||
    raw.includes("Load failed")
  ) {
    const url = e.url ?? process.env.NEXT_PUBLIC_API_URL ?? "(unknown)";
    return new Error(
      `Cannot reach PocketBase at ${url}. Check that the server is running and accessible from your browser.`
    );
  }

  // Auth-specific errors
  if (action === "login") {
    if (e.status === 400) return new Error("Invalid email or password.");
    if (e.status === 404) return new Error("User not found.");
  }

  if (action === "register") {
    if (e.status === 400 && e.data) {
      // PocketBase validation errors live in e.data as { field: { message } }
      const msgs = Object.entries(e.data)
        .filter(([k]) => k !== "message")
        .map(([k, v]) => {
          const msg = typeof v === "string" ? v : v?.message ?? "";
          return `${k}: ${msg}`;
        })
        .filter(Boolean);
      if (msgs.length) return new Error(msgs.join(". "));
      return new Error("Registration failed. Check your information.");
    }
  }

  // Fallback: surface whatever PocketBase gave us
  const fallback =
    (typeof e.data?.message === "string" ? e.data.message : null) ??
    e.message ??
    `${action} failed`;
  return new Error(`${fallback} (status: ${e.status ?? "unknown"})`);
}

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
    } catch (error: unknown) {
      console.error("[LOGIN ERROR]", error);
      throw parseAuthError(error, "login");
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
      } catch (error: unknown) {
        console.error("[REGISTER ERROR]", error);
        throw parseAuthError(error, "register");
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
