import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User } from '../types';
import { authApi } from '../api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('access'));
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (username: string, password: string) => {
    const res = await authApi.signin({ username, password });
    localStorage.setItem('access', res.access);
    localStorage.setItem('refresh', res.refresh);
    setToken(res.access);
    setUser(res.user);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const res = await authApi.signup({ username, email, password });
    localStorage.setItem('access', res.access);
    localStorage.setItem('refresh', res.refresh);
    setToken(res.access);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem('refresh');
    try {
      if (refresh) await authApi.signout(refresh);
    } catch {
      // ignore
    }
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setUser(prev => prev); // keep existing user; could decode JWT or call /me if backend had it
    setLoading(false);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
