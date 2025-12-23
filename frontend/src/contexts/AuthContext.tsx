/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, LoginData, RegisterData, AuthResponse } from '../types/Auth';
import { api, authApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<{ fullName?: string; bio?: string; profileImageUrl?: string }>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const profile = await authApi.getProfile();
          setUser(profile);
        } catch (err) {
          console.error('Failed to fetch profile:', err);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    init();
  }, []);

  const login = async (data: LoginData) => {
    setLoading(true);
    try {
      const res: AuthResponse = await authApi.login(data);
      setToken(res.token);
      setUser(res.user);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      const res: AuthResponse = await authApi.register(data);
      setToken(res.token);
      setUser(res.user);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<{ fullName?: string; bio?: string; profileImageUrl?: string }>) => {
    setLoading(true);
    try {
      const updated = await authApi.updateProfile(data);
      setUser(updated);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // Navigate to home and perform a full reload to ensure all state is cleared
    // Use a hard navigation so the page reloads from the server.
    window.location.assign('/');
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, register, updateProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
 
