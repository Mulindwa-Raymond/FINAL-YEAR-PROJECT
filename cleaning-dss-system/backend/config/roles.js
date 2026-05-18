/**
 * roles.js
 * Defines user roles and their permission levels.
 * 
 * Permission Hierarchy:
 * - super_admin: Full system access (can create/edit/delete any admin)
 * - admin: Content management (can manage equipment, detergents, rules, but NOT other admins)
 * - standard: Regular user (can only get recommendations and view history)
 */

const roles = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  STANDARD: 'standard'
};

// Permission mapping (which roles can perform which actions)
const permissions = {
  // User management
  create_admin: [roles.SUPER_ADMIN],           // Only super admin can create other admins
  edit_admin: [roles.SUPER_ADMIN],              // Only super admin can edit admin accounts
  delete_admin: [roles.SUPER_ADMIN],            // Only super admin can delete admin accounts
  edit_own_profile: [roles.SUPER_ADMIN, roles.ADMIN, roles.STANDARD], // All users can edit their own profile
  view_all_users: [roles.SUPER_ADMIN, roles.ADMIN], // Admins can view users, but not edit them
  
  // Content management
  manage_equipment: [roles.SUPER_ADMIN, roles.ADMIN],
  manage_detergents: [roles.SUPER_ADMIN, roles.ADMIN],
  manage_rules: [roles.SUPER_ADMIN, roles.ADMIN],
  manage_compatibility: [roles.SUPER_ADMIN, roles.ADMIN],
  view_audit_logs: [roles.SUPER_ADMIN, roles.ADMIN],
  
  // Regular user actions
  get_recommendations: [roles.SUPER_ADMIN, roles.ADMIN, roles.STANDARD],
  view_history: [roles.SUPER_ADMIN, roles.ADMIN, roles.STANDARD],
  submit_feedback: [roles.SUPER_ADMIN, roles.ADMIN, roles.STANDARD]
};

// Check if a role has a specific permission
const hasPermission = (role, permission) => {
  const allowedRoles = permissions[permission];
  if (!allowedRoles) return false;
  return allowedRoles.includes(role);
};

module.exports = { roles, permissions, hasPermission };