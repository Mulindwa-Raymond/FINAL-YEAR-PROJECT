/**
 * PrivateRoute.jsx
 * 
 * Protects routes that require authentication and optionally a specific role.
 * Redirects to login if not authenticated.
 * Standard users cannot access admin routes.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, requiredRole, redirectTo = '/login' }) => {
  const { user, loading, isAdmin, isSuperAdmin, isStandardUser } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // SPECIAL: Standard users trying to access admin routes should be redirected to dashboard
  if (redirectTo === '/admin/login' && isStandardUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check role requirement
  if (requiredRole) {
    if (requiredRole === 'admin' && !isAdmin && !isSuperAdmin) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-slate-600">You do not have permission to view this page.</p>
        </div>
      );
    }
    if (requiredRole === 'super_admin' && !isSuperAdmin) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-slate-600">Super admin access required.</p>
        </div>
      );
    }
  }

  return children;
};

export default PrivateRoute;