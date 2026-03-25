import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../lib/api";

type AuthUser = { userId: string; email: string; username: string };
type AuthState = {
  token: string | null;
  user: AuthUser | null;
  login: (args: { email: string; password: string }) => Promise<void>;
  signup: (args: { email: string; username: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const LS_TOKEN = "tp_token";
const LS_USER = "tp_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(LS_TOKEN));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(LS_USER);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const value = useMemo<AuthState>(() => {
    async function login(args: { email: string; password: string }) {
      const res = await api.post("/auth/login", args);
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem(LS_TOKEN, res.data.token);
      localStorage.setItem(LS_USER, JSON.stringify(res.data.user));
    }

    async function signup(args: { email: string; username: string; password: string }) {
      const res = await api.post("/auth/signup", args);
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem(LS_TOKEN, res.data.token);
      localStorage.setItem(LS_USER, JSON.stringify(res.data.user));
    }

    function logout() {
      setToken(null);
      setUser(null);
      localStorage.removeItem(LS_TOKEN);
      localStorage.removeItem(LS_USER);
      setAuthToken(null);
    }

    return { token, user, login, signup, logout };
  }, [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

