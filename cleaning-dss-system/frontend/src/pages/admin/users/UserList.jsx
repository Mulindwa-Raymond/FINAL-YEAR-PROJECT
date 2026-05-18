/**
 * UserList.jsx
 * 
 * Admin page for managing system users.
 * Features:
 * - List all users with pagination, search, filter by role/status
 * - Edit user (opens modal) and delete user (with confirmation)
 * - Add new user button (opens modal)
 * - Role-based restrictions: Only super_admin can create/edit/delete admin accounts
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
  RefreshCw
} from 'lucide-react';
import { getAllUsers, deleteUser } from '../../../services/adminService';
import { useAuth } from '../../../contexts/AuthContext';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { UserFormModal } from './UserFormModal';
import { ConfirmModal } from '../../../components/common/ConfirmModal';

export const UserList = () => {
  const { isSuperAdmin, isAdmin } = useAuth();
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
  const limit = 20;

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
    if (!deleteTarget) {
      console.error('No user selected for deletion');
      return;
    }
    
    if (!deleteTarget._id) {
      console.error('User has no ID:', deleteTarget);
      return;
    }
    
    try {
      await deleteUser(deleteTarget._id);
      fetchUsers();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleteTarget(null);
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

  const totalPages = Math.ceil(total / limit);

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage system users and their roles</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        )}
      </div>

      {/* Search and filter bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition-all"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
          >
            <option value="">All Roles</option>
            <option value="standard">Standard</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {(search || filterRole || filterStatus) && (
            <button
              onClick={() => { setSearch(''); setFilterRole(''); setFilterStatus(''); }}
              className="flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-red-600"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.length === 0 ? (
                <tr key="no-users">
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id || `user-${index}`} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{user.username || '-'}</td>
                    <td className="px-6 py-4 text-slate-600">{user.email || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 
                        user.role === 'admin' ? 'bg-cyan-100 text-cyan-700' : 
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {user.role === 'super_admin' ? 'Super Admin' : user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.organization || '-'}</td>
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm"><UserCheck className="w-4 h-4" /> Active</span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-sm"><UserX className="w-4 h-4" /> Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {canEditUser(user) && (
                        <button
                          onClick={() => handleEdit(user)}
                          className="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {canDeleteUser(user) && (
                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="inline-flex p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
            <button
              onClick={() => setPage(p => Math.max(1, p-1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p+1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Next
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