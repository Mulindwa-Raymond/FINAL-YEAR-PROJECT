/**
 * AuditDetailModal.jsx
 * 
 * Modal component showing full details of a single audit log entry.
 * Displays all fields: admin, action, target, timestamp, IP address, and details JSON.
 */

import React from 'react';
import { X, User, Activity, Target, Calendar, MapPin, FileText } from 'lucide-react';
import { formatDateTime } from '../../../utils/format';

export const AuditDetailModal = ({ isOpen, onClose, log }) => {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-600" />
            Audit Log Details
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase">Admin</p>
                <p className="font-medium text-slate-800">{log.adminId?.username || log.adminId || '-'}</p>
                <p className="text-sm text-slate-500">{log.adminId?.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase">Action</p>
                <p className="font-medium text-slate-800">{log.action.replace(/_/g, ' ')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase">Target</p>
                <p className="font-medium text-slate-800">{log.targetType || '-'}</p>
                <p className="text-sm text-slate-500 break-all">ID: {log.targetId || '-'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase">Timestamp</p>
                <p className="font-medium text-slate-800">{formatDateTime(log.timestamp)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase">IP Address</p>
                <p className="font-medium text-slate-800 font-mono text-sm">{log.ipAddress || '-'}</p>
              </div>
            </div>
          </div>

          {/* Details JSON */}
          {log.details && (
            <div className="mt-4">
              <p className="text-xs text-slate-500 uppercase mb-2">Additional Details</p>
              <pre className="bg-slate-50 rounded-xl p-4 text-sm font-mono overflow-x-auto border border-slate-200">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};