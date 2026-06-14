/**
 * AdminLayout.jsx
 * 
 * Main layout wrapper for the admin portal.
 * Features:
 * - Collapsible sidebar (icons only when collapsed, detailed when expanded)
 * - Functional user dropdown with Profile, Settings, Help
 * - REAL notification center (from audit logs and system events)
 * - GLOBAL SEARCH across equipment, detergents, rules, users, training, compatibility
 * - Fixed background with radial gradient and animated orbs
 * - Top appbar with page title, user info, and logout
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Coins,
  History,
  Upload,
  GraduationCap,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  FlaskConical,
  Gavel,
  Activity,
  Bell,
  Search,
  User as UserIcon,
  ChevronDown,
  Settings,
  HelpCircle,
  HeartHandshake,
  Shield,
  ChevronLeft,
  ChevronRight,
  Mail,
  UserCog,
  Database,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PlusCircle,
  Edit,
  Trash2,
  Package,
  Droplet,
  Loader2,
  TrendingUp,
  FileSearch,
  Link2,
  Sparkles
} from 'lucide-react';
import { getAuditLogs, getSystemMetrics } from '../../services/adminService';
import { getAllEquipment } from '../../services/equipmentService';
import { getAllDetergents } from '../../services/detergentService';
import { getAllRules } from '../../services/ruleService';
import { getAllUsers } from '../../services/adminService';
import { getAllTrainings } from '../../services/adminService';
import { getAllCompatibilities } from '../../services/compatibilityService';

// Notification types based on action
const getNotificationTypeFromAction = (action) => {
  if (action.includes('CREATE')) return 'success';
  if (action.includes('UPDATE')) return 'info';
  if (action.includes('DELETE')) return 'warning';
  if (action.includes('UPLOAD')) return 'success';
  if (action.includes('LOGIN')) return 'info';
  return 'info';
};

// Get icon based on action
const getNotificationIconByAction = (action, type) => {
  if (action.includes('EQUIPMENT')) return <Package size={14} className="text-blue-500" />;
  if (action.includes('DETERGENT')) return <Droplet size={14} className="text-cyan-500" />;
  if (action.includes('USER')) return <Users size={14} className="text-purple-500" />;
  if (action.includes('RULE')) return <Gavel size={14} className="text-amber-500" />;
  if (action.includes('COMPATIBILITY')) return <Link2 size={14} className="text-pink-500" />;
  if (action.includes('CREATE')) return <PlusCircle size={14} className="text-emerald-500" />;
  if (action.includes('UPDATE')) return <Edit size={14} className="text-blue-500" />;
  if (action.includes('DELETE')) return <Trash2 size={14} className="text-red-500" />;
  
  switch(type) {
    case 'success':
      return <CheckCircle2 size={14} className="text-emerald-500" />;
    case 'warning':
      return <AlertCircle size={14} className="text-amber-500" />;
    case 'error':
      return <XCircle size={14} className="text-red-500" />;
    default:
      return <Bell size={14} className="text-blue-500" />;
  }
};

// Format action name for display
const formatActionName = (action) => {
  const actionMap = {
    'CREATE_USER': 'New user registered',
    'UPDATE_USER': 'User profile updated',
    'DELETE_USER': 'User account deactivated',
    'CREATE_EQUIPMENT': 'New equipment added',
    'UPDATE_EQUIPMENT': 'Equipment updated',
    'DELETE_EQUIPMENT': 'Equipment removed',
    'CREATE_DETERGENT': 'New detergent added',
    'UPDATE_DETERGENT': 'Detergent updated',
    'DELETE_DETERGENT': 'Detergent removed',
    'CREATE_RULE': 'New rule created',
    'UPDATE_RULE': 'Rule modified',
    'DELETE_RULE': 'Rule removed',
    'CREATE_COMPATIBILITY': 'Compatibility record created',
    'UPDATE_COMPATIBILITY': 'Compatibility updated',
    'DELETE_COMPATIBILITY': 'Compatibility removed',
    'BULK_UPLOAD_EQUIPMENT': 'Bulk equipment upload',
    'BULK_UPLOAD_DETERGENTS': 'Bulk detergent upload',
    'BULK_UPLOAD_RULES': 'Bulk rules upload',
    'UPDATE_TCO_MULTIPLIERS': 'TCO settings updated',
    'LOGIN': 'Admin login',
    'LOGOUT': 'Admin logout'
  };
  return actionMap[action] || action?.replace(/_/g, ' ') || 'System event';
};

// Debounce hook for search
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Search result type configuration - ICONS AS COMPONENTS (not functions)
const SEARCH_TYPES = {
  EQUIPMENT: { 
    label: 'Equipment', 
    icon: Package, 
    color: 'cyan', 
    linkPrefix: '/admin/equipment', 
    api: getAllEquipment 
  },
  DETERGENT: { 
    label: 'Detergent', 
    icon: Droplet, 
    color: 'emerald', 
    linkPrefix: '/admin/detergents', 
    api: getAllDetergents 
  },
  RULE: { 
    label: 'Rule', 
    icon: Gavel, 
    color: 'amber', 
    linkPrefix: '/admin/rules', 
    api: getAllRules 
  },
  USER: { 
    label: 'User', 
    icon: Users, 
    color: 'purple', 
    linkPrefix: '/admin/users', 
    api: getAllUsers, 
    adminOnly: true 
  },
  TRAINING: { 
    label: 'Training', 
    icon: GraduationCap, 
    color: 'indigo', 
    linkPrefix: '/admin/training', 
    api: getAllTrainings 
  },
  COMPATIBILITY: { 
    label: 'Compatibility', 
    icon: HeartHandshake, 
    color: 'pink', 
    linkPrefix: '/admin/compatibility', 
    api: getAllCompatibilities 
  }
};

// Helper to render icon component
const renderIcon = (IconComponent, color) => {
  if (!IconComponent) return null;
  return React.createElement(IconComponent, { size: 16, className: `text-${color}-600` });
};

export const AdminLayout = () => {
  const { user, logout, isSuperAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Track read notifications in localStorage
  const readNotificationIds = useRef(new Set());

  // Load read notification IDs from localStorage
  useEffect(() => {
    const savedReadIds = localStorage.getItem('admin_read_notifications');
    if (savedReadIds) {
      try {
        const ids = JSON.parse(savedReadIds);
        readNotificationIds.current = new Set(ids);
      } catch (e) {
        console.error('Failed to load read notifications:', e);
      }
    }
  }, []);

  // Save read notification IDs to localStorage
  const saveReadNotificationIds = () => {
    const ids = Array.from(readNotificationIds.current);
    localStorage.setItem('admin_read_notifications', JSON.stringify(ids));
  };

  // Fetch real notifications from audit logs
  const fetchRealNotifications = useCallback(async () => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const response = await getAuditLogs({ 
        limit: 20, 
        page: 1,
        startDate: sevenDaysAgo.toISOString().split('T')[0]
      });
      
      const logs = response.data.data?.logs || [];
      
      const auditNotifications = logs.map(log => {
        const notificationType = getNotificationTypeFromAction(log.action);
        const isRead = readNotificationIds.current.has(log._id);
        
        return {
          id: log._id,
          type: notificationType,
          title: formatActionName(log.action),
          message: `${log.action.replace(/_/g, ' ')} by ${log.adminId?.username || 'System'}`,
          timestamp: log.timestamp,
          read: isRead,
          link: getLinkForAction(log.action),
          action: log.action,
          adminName: log.adminId?.username,
          ipAddress: log.ipAddress,
          icon: getNotificationIconByAction(log.action, notificationType)
        };
      });
      
      auditNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setNotifications(auditNotifications);
      
      const unread = auditNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  // Search function for a specific entity type
  const searchEntity = async (type, query, limit = 8) => {
    try {
      const config = SEARCH_TYPES[type];
      if (!config) return [];
      
      // Skip admin-only searches for non-admin users
      if (config.adminOnly && !isSuperAdmin && !isAdmin) {
        return [];
      }
      
      const response = await config.api({ search: query, limit });
      let items = response.data.data?.items || response.data.data || [];
      
      // Handle different response structures
      if (type === 'EQUIPMENT') items = items.equipment || items;
      if (type === 'DETERGENT') items = items.detergents || items;
      if (type === 'RULE') items = items.rules || items;
      if (type === 'USER') items = items.users || items;
      if (type === 'TRAINING') items = items.trainings || items;
      if (type === 'COMPATIBILITY') items = items.compatibilities || items;
      
      return items.map(item => ({
        id: item._id || item.id || item.compatibility_id || item.rule_id || item.user_id,
        type: type,
        title: getItemTitle(type, item),
        subtitle: getItemSubtitle(type, item),
        icon: React.createElement(config.icon, { size: 16, className: `text-${config.color}-600` }),
        link: getItemLink(type, item),
        matchScore: calculateMatchScore(query, getSearchableText(type, item)),
        rawData: item
      }));
    } catch (err) {
      console.error(`Error searching ${type}:`, err);
      return [];
    }
  };

  // Get title based on entity type
  const getItemTitle = (type, item) => {
    switch(type) {
      case 'EQUIPMENT':
        return `${item.brand_name || ''} ${item.model_name || ''}`.trim() || 'Unnamed Equipment';
      case 'DETERGENT':
        return item.product_name || 'Unnamed Detergent';
      case 'RULE':
        return item.rule_id || item._id;
      case 'USER':
        return item.username || item.email;
      case 'TRAINING':
        return item.title || 'Untitled Training';
      case 'COMPATIBILITY':
        const equipName = item.equipment_id?.brand_name 
          ? `${item.equipment_id.brand_name} ${item.equipment_id.model_name}`
          : 'Equipment';
        const detName = item.detergent_id?.product_name || 'Detergent';
        return `${equipName} ↔ ${detName}`;
      default:
        return 'Unknown';
    }
  };

  // Get subtitle based on entity type
  const getItemSubtitle = (type, item) => {
    switch(type) {
      case 'EQUIPMENT':
        return `${item.machine_category?.replace(/_/g, ' ') || 'Category'} • ${item.intensity || 'N/A'} • ${item.power_source?.replace(/_/g, ' ') || 'N/A'}`;
      case 'DETERGENT':
        return `${item.detergent_category || 'Category'} • pH ${item.ph_value || 'N/A'} • ${item.form || 'N/A'}`;
      case 'RULE':
        return `${item.category || 'Category'} • ${item.rule_text?.substring(0, 60) || 'No description'}...`;
      case 'USER':
        return `${item.email || 'No email'} • ${item.role || 'User'} • ${item.organization || 'No organization'}`;
      case 'TRAINING':
        return `${item.type?.toUpperCase() || 'Training'} • ${item.description?.substring(0, 50) || 'No description'}...`;
      case 'COMPATIBILITY':
        const equipName = item.equipment_id?.brand_name 
          ? `${item.equipment_id.brand_name} ${item.equipment_id.model_name}`
          : 'Equipment';
        const detName = item.detergent_id?.product_name || 'Detergent';
        const status = item.is_recommended ? '✅ Recommended' : '⚠️ Compatible';
        return `${equipName} with ${detName} • ${status}`;
      default:
        return '';
    }
  };

  // Get link based on entity type
  const getItemLink = (type, item) => {
    const id = item._id || item.id || item.compatibility_id || item.rule_id || item.user_id;
    switch(type) {
      case 'EQUIPMENT':
        return `/admin/equipment/${id}`;
      case 'DETERGENT':
        return `/admin/detergents/${id}`;
      case 'RULE':
        return `/admin/rules/${id}`;
      case 'USER':
        return `/admin/users`;
      case 'TRAINING':
        return `/admin/training/${id}/edit`;
      case 'COMPATIBILITY':
        return `/admin/compatibility`;
      default:
        return '#';
    }
  };

  // Get searchable text for match score calculation
  const getSearchableText = (type, item) => {
    switch(type) {
      case 'EQUIPMENT':
        return `${item.brand_name || ''} ${item.model_name || ''} ${item.machine_category || ''} ${item.intensity || ''}`;
      case 'DETERGENT':
        return `${item.product_name || ''} ${item.brand_name || ''} ${item.detergent_category || ''}`;
      case 'RULE':
        return `${item.rule_id || ''} ${item.rule_text || ''} ${item.category || ''}`;
      case 'USER':
        return `${item.username || ''} ${item.email || ''} ${item.role || ''} ${item.organization || ''}`;
      case 'TRAINING':
        return `${item.title || ''} ${item.description || ''} ${item.type || ''}`;
      case 'COMPATIBILITY':
        const equipText = item.equipment_id?.brand_name || '';
        const detText = item.detergent_id?.product_name || '';
        return `${equipText} ${detText} compatible`;
      default:
        return '';
    }
  };

  // Calculate match score for search result relevance
  const calculateMatchScore = (query, text) => {
    if (!query || !text) return 0;
    const lowerQuery = query.toLowerCase();
    const lowerText = text.toLowerCase();
    let score = 0;
    
    // Exact match
    if (lowerText === lowerQuery) score += 100;
    // Starts with
    if (lowerText.startsWith(lowerQuery)) score += 50;
    // Contains
    if (lowerText.includes(lowerQuery)) score += 30;
    // Word boundary matches
    const words = lowerQuery.split(' ');
    words.forEach(word => {
      if (word.length > 2 && lowerText.includes(word)) score += 10;
    });
    
    return Math.min(score, 100);
  };

  // Perform global search across all enabled types
  const performGlobalSearch = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    
    // Determine which types to search based on selected category
    let typesToSearch = [];
    if (selectedCategory === 'all') {
      typesToSearch = Object.keys(SEARCH_TYPES);
    } else if (selectedCategory === 'admin') {
      typesToSearch = ['USER', 'COMPATIBILITY'];
    } else if (selectedCategory === 'content') {
      typesToSearch = ['EQUIPMENT', 'DETERGENT', 'RULE', 'TRAINING'];
    } else {
      typesToSearch = [selectedCategory.toUpperCase()];
    }
    
    try {
      // Search all selected types in parallel
      const searchPromises = typesToSearch.map(type => searchEntity(type, query, 6));
      const resultsArrays = await Promise.all(searchPromises);
      
      // Flatten and combine results
      let allResults = resultsArrays.flat();
      
      // Sort by match score (higher first)
      allResults.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      
      // Limit to top 20 results
      setSearchResults(allResults.slice(0, 20));
    } catch (err) {
      console.error('Global search error:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [selectedCategory]);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.trim().length >= 2) {
      performGlobalSearch(debouncedSearchQuery);
      setSearchDropdownOpen(true);
    } else {
      setSearchResults([]);
      setSearchDropdownOpen(false);
    }
  }, [debouncedSearchQuery, performGlobalSearch]);

  // Get navigation link based on action
  const getLinkForAction = (action) => {
    if (action.includes('EQUIPMENT')) return '/admin/equipment';
    if (action.includes('DETERGENT')) return '/admin/detergents';
    if (action.includes('USER')) return '/admin/users';
    if (action.includes('RULE')) return '/admin/rules';
    if (action.includes('COMPATIBILITY')) return '/admin/compatibility';
    if (action.includes('TCO')) return '/admin/tco';
    if (action.includes('UPLOAD')) return '/admin/upload';
    return null;
  };

  // Initial load and periodic refresh of notifications
  useEffect(() => {
    fetchRealNotifications();
    const interval = setInterval(() => {
      fetchRealNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchRealNotifications]);

  const getPageTitle = (path) => {
    const routes = {
      '/admin': 'Dashboard',
      '/admin/users': 'User Management',
      '/admin/equipment': 'Equipment Management',
      '/admin/detergents': 'Detergent Management',
      '/admin/rules': 'Rule Management',
      '/admin/compatibility': 'Compatibility Management',
      '/admin/tco': 'TCO Multipliers',
      '/admin/audit': 'Audit Logs',
      '/admin/metrics': 'System Metrics',
      '/admin/upload': 'Bulk Upload',
      '/admin/training': 'Training Materials',
      '/admin/history': 'Recommendation History',
      '/admin/feedback': 'User Feedback',
      '/admin/profile': 'Profile Settings',
      '/admin/settings': 'System Settings'
    };
    return routes[path] || 'Admin Portal';
  };

  useEffect(() => {
    setPageTitle(getPageTitle(location.pathname));
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      readNotificationIds.current.add(notification.id);
      saveReadNotificationIds();
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    setNotificationsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        readNotificationIds.current.add(notification.id);
      }
    });
    saveReadNotificationIds();
    
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  const clearAllNotifications = () => {
    notifications.forEach(notification => {
      readNotificationIds.current.add(notification.id);
    });
    saveReadNotificationIds();
    
    setNotifications([]);
    setUnreadCount(0);
    setNotificationsOpen(false);
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Handle search result click
  const handleSearchResultClick = (result) => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchDropdownOpen(false);
    navigate(result.link);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Close search dropdown on Escape
      if (e.key === 'Escape') {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save sidebar collapsed state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('admin_sidebar_collapsed');
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('admin_sidebar_collapsed', newState);
  };

  const allNavItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'super_admin'] },
    { path: '/admin/users', label: 'Users', icon: Users, roles: ['super_admin'] },
    { path: '/admin/equipment', label: 'Equipment', icon: ShoppingCart, roles: ['admin', 'super_admin'] },
    { path: '/admin/detergents', label: 'Detergents', icon: FlaskConical, roles: ['admin', 'super_admin'] },
    { path: '/admin/rules', label: 'Rules', icon: Gavel, roles: ['admin', 'super_admin'] },
    { path: '/admin/compatibility', label: 'Compatibility', icon: HeartHandshake, roles: ['admin', 'super_admin'] },
    { path: '/admin/tco', label: 'TCO Multipliers', icon: Coins, roles: ['admin', 'super_admin'] },
    { path: '/admin/audit', label: 'Audit Logs', icon: History, roles: ['admin', 'super_admin'] },
    { path: '/admin/metrics', label: 'Metrics', icon: Activity, roles: ['admin', 'super_admin'] },
    { path: '/admin/upload', label: 'Bulk Upload', icon: Upload, roles: ['admin', 'super_admin'] },
    { path: '/admin/training', label: 'Training', icon: GraduationCap, roles: ['admin', 'super_admin'] },
    { path: '/admin/history', label: 'History', icon: FileText, roles: ['admin', 'super_admin'] },
    { path: '/admin/feedback', label: 'Feedback', icon: HeartHandshake, roles: ['admin', 'super_admin'] },
    { path: '/admin/profile', label: 'Profile', icon: UserCog, roles: ['admin', 'super_admin'] },
    { path: '/admin/settings', label: 'Settings', icon: Settings, roles: ['admin', 'super_admin'] }
  ];

  const navItems = allNavItems.filter(item => {
    if (isSuperAdmin) return true;
    if (isAdmin) return item.roles.includes('admin');
    return false;
  });

  // Sidebar width classes
  const sidebarWidth = sidebarCollapsed ? 'w-20' : 'w-72';
  const mainMargin = sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72';

  // Get result type badge color
  const getResultTypeColor = (type) => {
    switch(type) {
      case 'EQUIPMENT': return 'bg-cyan-100 text-cyan-700';
      case 'DETERGENT': return 'bg-emerald-100 text-emerald-700';
      case 'RULE': return 'bg-amber-100 text-amber-700';
      case 'USER': return 'bg-purple-100 text-purple-700';
      case 'TRAINING': return 'bg-indigo-100 text-indigo-700';
      case 'COMPATIBILITY': return 'bg-pink-100 text-pink-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  // Category filter options
  const categoryOptions = [
    { value: 'all', label: 'All Categories', icon: <Sparkles size={12} /> },
    { value: 'content', label: 'Content', icon: <Package size={12} /> },
    { value: 'admin', label: 'Admin', icon: <Users size={12} /> },
    { value: 'equipment', label: 'Equipment', icon: <Package size={12} /> },
    { value: 'detergent', label: 'Detergent', icon: <Droplet size={12} /> },
    { value: 'rule', label: 'Rules', icon: <Gavel size={12} /> },
    { value: 'training', label: 'Training', icon: <GraduationCap size={12} /> },
    { value: 'compatibility', label: 'Compatibility', icon: <HeartHandshake size={12} /> }
  ];

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 relative flex">
      
      {/* Background stays fixed */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(224,242,254,0.4)_0%,_rgba(248,250,252,1)_100%)]"></div>
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }}></div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-xl shadow-lg border border-slate-200"
        >
          {sidebarOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
        </button>
      </div>

      {/* Sidebar - Collapsible */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-full ${sidebarWidth} bg-white/90 backdrop-blur-xl border-r border-slate-200 shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className={`py-4 px-4 border-b border-slate-200/50 flex items-center justify-between ${sidebarCollapsed ? 'flex-col' : ''}`}>
            {!sidebarCollapsed ? (
              <>
                <div>
                  <h1 className="text-xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    Clean Match
                  </h1>
                  <p className="text-[10px] text-slate-400 mt-0.5">Admin Portal</p>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center w-full">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="mt-3 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Expand sidebar"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700 border-l-3 border-cyan-600'
                      : 'text-slate-600 hover:bg-slate-100'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`w-5 h-5 ${!sidebarCollapsed ? '' : 'mx-auto'}`} />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* User info & Logout (visible only when expanded) */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-slate-200/50">
              <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{user?.username}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className={`flex-1 ${mainMargin} relative z-10 flex flex-col h-full overflow-hidden transition-all duration-300`}>
        
        {/* Top Appbar */}
        <header className="sticky top-0 z-30 flex-shrink-0 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6 lg:py-3">
            {/* Mobile: Menu button, Desktop: Page title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <h2 className="text-lg lg:text-xl font-bold text-slate-800">{pageTitle}</h2>
            </div>

            <div className="flex items-center gap-3 lg:gap-4">
              {/* Global Search */}
              <div className="relative" ref={searchRef}>
                <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 transition-all">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search across all modules... (Ctrl+K)" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim().length >= 2 && setSearchDropdownOpen(true)}
                    className="bg-transparent border-none focus:outline-none text-sm ml-2 w-80 lg:w-96"
                  />
                  {searching && (
                    <Loader2 className="w-4 h-4 text-cyan-500 animate-spin ml-2" />
                  )}
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                        setSearchDropdownOpen(false);
                      }}
                      className="ml-2 p-0.5 rounded-full hover:bg-slate-200 transition"
                    >
                      <X size={14} className="text-slate-400" />
                    </button>
                  )}
                </div>

                {/* Search Category Filter */}
                {searchDropdownOpen && (
                  <div className="absolute left-0 mt-2 bg-white rounded-lg border border-slate-200 shadow-sm z-50">
                    <div className="flex p-1 gap-1">
                      {categoryOptions.map(cat => (
                        <button
                          key={cat.value}
                          onClick={() => setSelectedCategory(cat.value)}
                          className={`px-2 py-1 text-[10px] font-medium rounded transition-colors flex items-center gap-1 ${
                            selectedCategory === cat.value
                              ? 'bg-cyan-100 text-cyan-700'
                              : 'text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {cat.icon}
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search Results Dropdown */}
                {searchDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-[500px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileSearch className="w-4 h-4 text-cyan-600" />
                          <span className="text-sm font-bold text-slate-800">Search Results</span>
                          {searchResults.length > 0 && (
                            <span className="text-[10px] text-slate-500">({searchResults.length} found)</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px]">↑↓</kbd> navigate · 
                          <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] ml-1">↵</kbd> select · 
                          <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] ml-1">Esc</kbd> close
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {selectedCategory === 'all' ? 'Searching across all modules' : `Searching in ${selectedCategory}`}
                      </p>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {searching ? (
                        <div className="py-12 text-center">
                          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mx-auto mb-3" />
                          <p className="text-sm text-slate-500">Searching across modules...</p>
                          <p className="text-[10px] text-slate-400 mt-1">This may take a moment</p>
                        </div>
                      ) : searchResults.length === 0 && searchQuery.trim().length >= 2 ? (
                        <div className="py-12 text-center">
                          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                          <p className="text-sm text-slate-500 font-medium">No results found for "{searchQuery}"</p>
                          <p className="text-xs text-slate-400 mt-1">Try different keywords or check your search category</p>
                          <div className="mt-4 flex flex-wrap justify-center gap-2">
                            <span className="text-[10px] text-slate-400">Suggestions:</span>
                            <button onClick={() => setSelectedCategory('equipment')} className="text-[10px] text-cyan-600 hover:underline">Equipment</button>
                            <button onClick={() => setSelectedCategory('detergent')} className="text-[10px] text-emerald-600 hover:underline">Detergents</button>
                            <button onClick={() => setSelectedCategory('rule')} className="text-[10px] text-amber-600 hover:underline">Rules</button>
                            <button onClick={() => setSelectedCategory('compatibility')} className="text-[10px] text-pink-600 hover:underline">Compatibility</button>
                          </div>
                        </div>
                      ) : searchResults.length === 0 ? (
                        <div className="py-12 text-center">
                          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                          <p className="text-sm text-slate-500">Start typing to search</p>
                          <p className="text-[10px] text-slate-400 mt-1">Minimum 2 characters required</p>
                        </div>
                      ) : (
                        <div>
                          {/* Group results by type */}
                          {Object.entries(
                            searchResults.reduce((groups, result) => {
                              const type = result.type;
                              if (!groups[type]) groups[type] = [];
                              groups[type].push(result);
                              return groups;
                            }, {})
                          ).map(([type, results]) => {
                            const config = SEARCH_TYPES[type];
                            const IconComponent = config?.icon;
                            return (
                              <div key={type}>
                                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                                  <div className="flex items-center gap-2">
                                    {IconComponent && React.createElement(IconComponent, { size: 12, className: `text-${config?.color || 'slate'}-500` })}
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                      {config?.label || type}
                                    </span>
                                    <span className="text-[9px] text-slate-400">({results.length})</span>
                                  </div>
                                </div>
                                {results.map((result) => (
                                  <div
                                    key={`${result.type}-${result.id}`}
                                    onClick={() => handleSearchResultClick(result)}
                                    className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="mt-0.5">
                                        {result.icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <p className="text-sm font-semibold text-slate-800">
                                            {result.title}
                                          </p>
                                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${getResultTypeColor(result.type)}`}>
                                            {config?.label || result.type}
                                          </span>
                                          {result.matchScore > 80 && (
                                            <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                              High match
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                          {result.subtitle}
                                        </p>
                                        {result.matchScore > 70 && (
                                          <div className="flex items-center gap-1 mt-1">
                                            <TrendingUp size={10} className="text-emerald-500" />
                                            <span className="text-[9px] text-emerald-600">Highly relevant</span>
                                          </div>
                                        )}
                                      </div>
                                      <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    
                    <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-center">
                      <p className="text-[9px] text-slate-400 flex items-center justify-center gap-3">
                        <span>🔍 Searching across 6 modules</span>
                        <span>✨ Real-time results</span>
                        <span>🎯 Smart relevance scoring</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Bell className="w-5 h-5 text-slate-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm font-bold text-slate-800">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="text-[10px] text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <>
                            {unreadCount > 0 && <span className="text-slate-300">|</span>}
                            <button 
                              onClick={clearAllNotifications}
                              className="text-[10px] text-red-500 hover:text-red-600 font-medium"
                            >
                              Clear all
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-12 text-center">
                          <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-xs text-slate-400">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                              !notification.read ? 'bg-blue-50/30' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                {notification.icon || getNotificationIconByAction(notification.action, notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span className="text-[9px] text-slate-400">
                                    {formatNotificationTime(notification.timestamp)}
                                  </span>
                                  {notification.ipAddress && (
                                    <>
                                      <span className="text-slate-300">•</span>
                                      <span className="text-[9px] text-slate-400 font-mono">
                                        {notification.ipAddress}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-center">
                      <button 
                        onClick={() => navigate('/admin/audit')}
                        className="text-[10px] text-slate-500 hover:text-slate-700 font-medium"
                      >
                        View all activity
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)} 
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500 hidden lg:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-sm font-bold text-slate-800">{user?.username}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{user?.role?.replace('_', ' ')}</p>
                      <p className="text-xs text-slate-400 truncate mt-1">{user?.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <button 
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigate('/admin/profile');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" /> Profile
                      </button>
                      <button 
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigate('/admin/settings');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-400" /> Settings
                      </button>
                      <button 
                        onClick={() => {
                          setUserDropdownOpen(false);
                          window.open('https://docs.cleanmatch.com', '_blank');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-slate-400" /> Help & Docs
                      </button>
                    </div>
                    
                    <div className="border-t border-slate-100"></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;