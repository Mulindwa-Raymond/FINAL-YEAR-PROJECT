/**
 * UserDeleteModal.jsx
 * 
 * Confirmation modal for deleting a user (soft delete – sets active=false).
 * Uses deleteUser from adminService.
 */

import React, { useState } from 'react';
import { X, AlertTriangle, Trash2, UserX, ShieldAlert } from 'lucide-react';
import { deleteUser } from '../../../services/adminService';
import { useAuth } from '../../../contexts/AuthContext';

export const UserDeleteModal = ({ isOpen, onClose, user, onDeleted }) => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper function to get user ID (supports both _id and user_id)
  const getUserId = (userObj) => {
    return userObj?._id || userObj?.user_id || userObj?.id;
  };

  // Check if user is trying to delete themselves
  const currentUserId = getUserId(currentUser);
  const targetUserId = getUserId(user);
  const isSelfDeletion = currentUserId && targetUserId && currentUserId === targetUserId;

  const handleConfirm = async () => {
    // Validation
    if (!user) {
      setError('No user selected for deletion.');
      return;
    }
    
    const userId = getUserId(user);
    if (!userId) {
      setError('User ID is missing. Cannot delete this user.');
      console.error('User object missing ID:', user);
      return;
    }
    
    if (isSelfDeletion) {
      setError('You cannot delete your own account. Ask another admin to do this.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await deleteUser(userId);
      if (onDeleted) onDeleted(); // refresh list
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to delete user.';
      setError(errorMessage);
      console.error('Delete user error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Get user identifier for display
  const userIdentifier = user?.username || user?.email || 'this user';
  const userRole = user?.role || 'unknown';
  const userName = user?.username || 'N/A';
  const userEmail = user?.email || 'No email';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Confirm Deletion
          </h2>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="p-1 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Warning icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          {/* User info */}
          <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">User to delete:</p>
            <p className="font-semibold text-slate-800">{userName}</p>
            <p className="text-sm text-slate-600">{userEmail}</p>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                userRole === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                userRole === 'admin' ? 'bg-cyan-100 text-cyan-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {userRole === 'super_admin' ? 'Super Admin' : userRole}
              </span>
            </div>
          </div>
          
          {/* Warning message */}
          {isSelfDeletion ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm flex items-start gap-2 mb-4">
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>You cannot delete your own account. Please ask another admin to perform this action.</span>
            </div>
          ) : (
            <p className="text-slate-700 mb-2">
              Are you sure you want to delete <strong>{userIdentifier}</strong>?
            </p>
          )}
          
          <p className="text-sm text-slate-500">
            This action will <strong>deactivate</strong> the account (soft delete). 
            The user will not be able to log in. This action can be reversed by an admin.
          </p>

          {/* Error display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            {!isSelfDeletion && (
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-red-700 transition disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {loading ? 'Deleting...' : 'Delete User'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;