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
    const result = await pb.collection("users").authWithPassword(email, password);
    setState({
      user: result.record,
      token: result.token,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const pb = getPocketBase();
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
