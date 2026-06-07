/**
 * UserList.jsx
 * 
 * Admin page for managing system users.
 * Features:
 * - List all users with pagination, search, filters
 * - Edit user (opens modal) and delete user (with confirmation)
 * - Add new user button (opens modal)
 * - Role-based restrictions: Only super_admin can create/edit/delete admin accounts
 * - Status toggle functionality
 */

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter, 
  X,
  Users,
  Shield,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getAllUsers, deleteUser, updateUser } from '../../../services/adminService';
import { useAuth } from '../../../contexts/AuthContext';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { UserFormModal } from './UserFormModal';
import { ConfirmModal } from '../../../components/common/ConfirmModal';

export const UserList = () => {
  const { isSuperAdmin, isAdmin, refreshUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusToggleLoading, setStatusToggleLoading] = useState(null);
  const limit = 20;

  // Helper to get user ID (handles both _id and user_id)
  const getUserId = (user) => {
    return user?._id || user?.user_id || user?.id;
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search: search || undefined,
        role: filterRole || undefined,
        is_active: filterStatus === 'active' ? true : filterStatus === 'inactive' ? false : undefined,
      };
      Object.keys(params).forEach(key => 
        params[key] === '' || params[key] === undefined ? delete params[key] : null
      );
      const res = await getAllUsers(params);
      if (res.data.data?.users) {
        setUsers(res.data.data.users);
        setTotal(res.data.data.total);
      } else {
        setUsers([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, filterRole, filterStatus]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleModalClose = (refetch = false) => {
    setModalOpen(false);
    setEditingUser(null);
    if (refetch) fetchUsers();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const userId = getUserId(deleteTarget);
    if (!userId) {
      console.error('No user ID found:', deleteTarget);
      return;
    }
    try {
      await deleteUser(userId);
      fetchUsers();
      // Refresh current user if they deleted themselves (should not happen, but just in case)
      const currentUserId = getUserId(JSON.parse(localStorage.getItem('user') || '{}'));
      if (currentUserId === userId) {
        refreshUser();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleStatusToggle = async (user) => {
    const userId = getUserId(user);
    if (!userId) return;
    
    setStatusToggleLoading(userId);
    try {
      await updateUser(userId, { is_active: !user.is_active });
      fetchUsers();
    } catch (err) {
      console.error('Status toggle failed:', err);
    } finally {
      setStatusToggleLoading(null);
    }
  };

  const canEditUser = (user) => {
    if (isSuperAdmin) return true;
    if (isAdmin && user.role === 'standard') return true;
    return false;
  };

  const canDeleteUser = (user) => {
    if (isSuperAdmin) return true;
    return false;
  };

  const canToggleStatus = (user) => {
    // Cannot deactivate yourself
    const currentUserId = getUserId(JSON.parse(localStorage.getItem('user') || '{}'));
    const targetUserId = getUserId(user);
    if (currentUserId === targetUserId) return false;
    if (isSuperAdmin) return true;
    if (isAdmin && user.role === 'standard') return true;
    return false;
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className="pb-8 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-600" />
            <h1 className="text-xl font-semibold text-slate-800">User Management</h1>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">Manage system users and their roles</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        )}
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{users.length}</span> of{' '}
          <span className="font-medium text-slate-700">{total}</span> users
        </div>
        <div className="text-sm text-slate-400">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-slate-200 rounded-lg p-2 text-sm bg-white"
          >
            <option value="">All Roles</option>
            <option value="standard">Standard</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-lg p-2 text-sm bg-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {(search || filterRole || filterStatus) && (
            <button
              onClick={() => { setSearch(''); setFilterRole(''); setFilterStatus(''); }}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-red-600 transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const userId = getUserId(user);
                  return (
                    <tr key={userId} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-slate-800">{user.username || '-'}</td>
                      <td className="px-6 py-4 text-slate-600">{user.email || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                          user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 
                          user.role === 'admin' ? 'bg-cyan-100 text-cyan-700' : 
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {user.role === 'super_admin' ? 'Super Admin' : user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{user.organization || '-'}</td>
                      <td className="px-6 py-4">
                        {canToggleStatus(user) ? (
                          <button
                            onClick={() => handleStatusToggle(user)}
                            disabled={statusToggleLoading === userId}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                              user.is_active 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            } ${statusToggleLoading === userId ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {statusToggleLoading === userId ? (
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : user.is_active ? (
                              <UserCheck className="w-3 h-3" />
                            ) : (
                              <UserX className="w-3 h-3" />
                            )}
                            {user.is_active ? 'Active' : 'Inactive'}
                          </button>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                            user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {user.is_active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {canEditUser(user) && (
                          <button
                            onClick={() => handleEdit(user)}
                            className="inline-flex p-2 text-slate-500 hover:text-blue-600 rounded-lg transition-colors"
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {canDeleteUser(user) && (
                          <button
                            onClick={() => setDeleteTarget(user)}
                            className="inline-flex p-2 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-slate-200 flex justify-between items-center bg-slate-50">
            <button
              onClick={() => setPage(p => Math.max(1, p-1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-cyan-600 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p+1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-cyan-600 disabled:opacity-50 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        user={editingUser}
      />

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.username}"? This action cannot be undone.`}
        confirmVariant="danger"
      />
    </div>
  );
};