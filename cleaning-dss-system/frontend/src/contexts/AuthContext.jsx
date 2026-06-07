/**
 * AuthContext.jsx
 * 
 * Provides authentication state and functions to the entire application.
 * Stores JWT token and user data in localStorage.
 * Includes role-based helpers for admin panel access.
 */

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { login as loginApi, register as registerApi, getMe, logout as logoutApi, getStoredUser, isAuthenticated as checkAuth } from '../services/authService';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadStoredUser = useCallback(async () => {
    const storedUser = getStoredUser();
    const hasToken = checkAuth();

    if (!hasToken || !storedUser) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      // Validate token by fetching user profile
      const response = await getMe();
      const userData = response.data.data || response.data.user;
      setUser(userData);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      console.error('Failed to validate stored user:', err);
      logoutApi();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredUser();
  }, [loadStoredUser]);

  const login = async (credentials) => {
    setError(null);
    try {
      const response = await loginApi(credentials);
      const { token, user: userData } = response.data.data || response.data;
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return userData;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await registerApi(userData);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const logout = useCallback(() => {
    logoutApi();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await getMe();
      const userData = response.data.data || response.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error('Failed to refresh user:', err);
      throw err;
    }
  }, []);

  // Role-based helpers
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';
  const isStandardUser = user?.role === 'standard' || user?.role === 'company_owner';

  const value = {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    
    // User details
    userId: user?._id,
    userName: user?.username || user?.fullName,
    userEmail: user?.email,
    userRole: user?.role,
    userOrganization: user?.companyName || user?.organization,
    
    // Role helpers
    isAdmin,
    isSuperAdmin,
    isStandardUser,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;