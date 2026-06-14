/**
 * AdminRoutes.jsx
 * 
 * Defines all routes within the admin portal.
 * Each route renders a component.
 * The layout is provided by AdminLayout (sidebar + main area).
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';

// Dashboard
import { Dashboard } from './dashboard/Dashboard';

// Users
import { UserList } from './users/UserList';
// (UserFormModal is a modal, not a route)

// Equipment
import { EquipmentList } from './equipment/EquipmentList';
import { EquipmentForm } from './equipment/EquipmentForm';
import { EquipmentDetail } from './equipment/EquipmentDetail';

// Detergents
import { DetergentList } from './detergents/DetergentList';
import { DetergentForm } from './detergents/DetergentForm';
import { DetergentDetail } from './detergents/DetergentDetail';  // ADDED: Detergent detail view

// Rules
import { RuleList } from './rules/RuleList';
import { RuleForm } from './rules/RuleForm';
import { RuleDetail } from './rules/RuleDetail';

// Compatibility (Equipment-Detergent)
import { CompatibilityList } from './compatibility/CompatibilityList';
import { CompatibilityForm } from './compatibility/CompatibilityForm';

// TCO Multipliers
import { TcoMultipliers } from './tco/TcoMultipliers';

// Audit Logs
import { AuditLogs } from './audit/AuditLogs';

// Metrics
import { SystemMetrics } from './metrics/SystemMetrics';

// Bulk Upload
import { BulkUpload } from './upload/BulkUpload';

// Training
import { TrainingList } from './training/TrainingList';
import { TrainingForm } from './training/TrainingForm';

// History
import { HistoryList } from './history/HistoryList';

// Feedback
import { FeedbackList } from './feedback/FeedbackList';

// Profile & Settings (NEW)
import { AdminProfile } from './profile/AdminProfile';
import { SystemSettings } from './settings/SystemSettings';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* Dashboard */}
        <Route index element={<Dashboard />} />
        
        {/* Users */}
        <Route path="users" element={<UserList />} />
        
        {/* Equipment */}
        <Route path="equipment" element={<EquipmentList />} />
        <Route path="equipment/new" element={<EquipmentForm />} />
        <Route path="equipment/:id" element={<EquipmentDetail />} />
        <Route path="equipment/:id/edit" element={<EquipmentForm />} />
        
        {/* Detergents */}
        <Route path="detergents" element={<DetergentList />} />
        <Route path="detergents/new" element={<DetergentForm />} />
        <Route path="detergents/:id" element={<DetergentDetail />} />      {/* ADDED: View detergent details */}
        <Route path="detergents/:id/edit" element={<DetergentForm />} />
        
        {/* Rules */}
        <Route path="rules" element={<RuleList />} />
        <Route path="rules/new" element={<RuleForm />} />
        <Route path="rules/:id" element={<RuleDetail />} />
        <Route path="rules/:id/edit" element={<RuleForm />} />
        
        {/* Compatibility (Equipment-Detergent) */}
        <Route path="compatibility" element={<CompatibilityList />} />
        <Route path="compatibility/new" element={<CompatibilityForm />} />
        <Route path="compatibility/:id/edit" element={<CompatibilityForm />} />
        
        {/* TCO */}
        <Route path="tco" element={<TcoMultipliers />} />
        
        {/* Audit */}
        <Route path="audit" element={<AuditLogs />} />
        
        {/* Metrics */}
        <Route path="metrics" element={<SystemMetrics />} />
        
        {/* Bulk Upload */}
        <Route path="upload" element={<BulkUpload />} />
        
        {/* Training */}
        <Route path="training" element={<TrainingList />} />
        <Route path="training/new" element={<TrainingForm />} />
        <Route path="training/:id/edit" element={<TrainingForm />} />
        
        {/* History */}
        <Route path="history" element={<HistoryList />} />
        
        {/* Feedback */}
        <Route path="feedback" element={<FeedbackList />} />
        
        {/* Profile & Settings (NEW) */}
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>
    </Routes>
  );
};