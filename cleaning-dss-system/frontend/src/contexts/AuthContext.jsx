/**
 * AuthContext.jsx
 * 
 * Provides authentication state and functions to the entire application.
 * Stores JWT token and user data in localStorage.
 * Includes role-based helpers for admin panel access.
 */

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { login as loginApi, getMe } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const tokenKey = import.meta.env.VITE_APP_TOKEN_KEY || 'token';
  const userKey = import.meta.env.VITE_APP_USER_KEY || 'user';

  const clearStorage = useCallback(() => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
  }, [tokenKey, userKey]);

  const loadStoredUser = useCallback(async () => {
    const token = localStorage.getItem(tokenKey);
    const storedUser = localStorage.getItem(userKey);

    if (!token || !storedUser) {
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    try {
      const response = await getMe();
      const userData = response.data.data;
      setUser(userData);
      localStorage.setItem(userKey, JSON.stringify(userData));
      setError(null);
    } catch (err) {
      console.error('Failed to validate stored user:', err);
      clearStorage();
      setUser(null);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [tokenKey, userKey, clearStorage]);

  useEffect(() => {
    loadStoredUser();
  }, [loadStoredUser]);

  const login = async (credentials) => {
    setError(null);
    try {
      const response = await loginApi(credentials);
      const { token, user: userData } = response.data.data;
      
      localStorage.setItem(tokenKey, token);
      localStorage.setItem(userKey, JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const logout = useCallback(() => {
    clearStorage();
    setUser(null);
    setError(null);
  }, [clearStorage]);

  const updateUser = useCallback((updatedUser) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedUser };
      localStorage.setItem(userKey, JSON.stringify(newUser));
      return newUser;
    });
  }, [userKey]);

  const refreshUser = useCallback(async () => {
    try {
      const response = await getMe();
      const userData = response.data.data;
      localStorage.setItem(userKey, JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Failed to refresh user:', err);
      throw err;
    }
  }, [userKey]);

  // Role-based helpers
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';
  const isStandardUser = user?.role === 'standard';

  const value = {
    // State
    user,
    loading,
    error,
    isInitialized,
    isAuthenticated,
    
    // User details
    userId: user?._id,
    userName: user?.username,
    userEmail: user?.email,
    userRole: user?.role,
    userOrganization: user?.organization,
    
    // Role helpers
    isAdmin,
    isSuperAdmin,
    isStandardUser,
    
    // Actions
    login,
    logout,
    updateUser,
    refreshUser,
    clearStorage,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;