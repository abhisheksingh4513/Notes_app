import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import ApiService from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  signup: (credentials: { email: string; password: string; name: string }) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUserState(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const setUser = (user: User) => {
    setUserState(user);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response: AuthResponse = await ApiService.login(credentials);
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (credentials: { email: string; password: string; name: string }) => {
    try {
      await ApiService.signup(credentials);
    } catch (error) {
      throw error;
    }
  };

  const sendOTP = async (email: string) => {
    try {
      await ApiService.sendOTP(email);
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response: AuthResponse = await ApiService.verifyOTP({ email, otp });
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (credential: string) => {
    try {
      const response: AuthResponse = await ApiService.googleAuth(credential);
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUserState(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
    verifyOTP,
    googleLogin,
    sendOTP,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
