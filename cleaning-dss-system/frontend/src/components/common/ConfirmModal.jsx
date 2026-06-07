/**
 * ConfirmModal.jsx
 * 
 * Reusable confirmation modal component.
 * Used for delete confirmations, important actions, etc.
 * Features:
 * - Modern glassmorphism styling with gradient accents
 * - Custom title and message with variant-based coloring
 * - Confirm and cancel buttons with loading states
 * - Smooth animations matching system design
 */

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Trash2, ShieldAlert, Info, CheckCircle } from 'lucide-react';

export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger' // 'danger', 'primary', 'warning', 'success'
}) => {
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFadeIn(true);
    } else {
      setFadeIn(false);
      setLoading(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirm action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Variant configurations
  const getVariantConfig = () => {
    switch (confirmVariant) {
      case 'danger':
        return {
          icon: <Trash2 size={20} />,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          headerBg: 'from-red-500 to-red-600',
          buttonBg: 'bg-red-600 hover:bg-red-700',
          buttonShadow: 'shadow-red-600/30',
          borderColor: 'border-red-200'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={20} />,
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          headerBg: 'from-amber-500 to-orange-600',
          buttonBg: 'bg-amber-600 hover:bg-amber-700',
          buttonShadow: 'shadow-amber-600/30',
          borderColor: 'border-amber-200'
        };
      case 'success':
        return {
          icon: <CheckCircle size={20} />,
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          headerBg: 'from-emerald-500 to-green-600',
          buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
          buttonShadow: 'shadow-emerald-600/30',
          borderColor: 'border-emerald-200'
        };
      default:
        return {
          icon: <Info size={20} />,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          headerBg: 'from-blue-600 to-cyan-600',
          buttonBg: 'bg-gradient-to-r from-blue-600 to-cyan-600',
          buttonShadow: 'shadow-blue-600/30',
          borderColor: 'border-blue-200'
        };
    }
  };

  const variant = getVariantConfig();

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300 ${fadeIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        
        {/* Header with Gradient */}
        <div className={`bg-gradient-to-r ${variant.headerBg} px-6 py-5 text-white`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center`}>
                {variant.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="text-white/80 text-[10px] font-mono mt-0.5">This action requires confirmation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-1.5 hover:bg-white/20 rounded-lg transition disabled:opacity-50"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Alert Icon */}
          <div className="flex items-start gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full ${variant.iconBg} flex items-center justify-center flex-shrink-0`}>
              <ShieldAlert size={18} className={variant.iconColor} />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
          </div>

          {/* Warning Note */}
          <div className={`mb-6 p-3 ${variant.iconBg.replace('bg-', 'bg-').replace('100', '50')} rounded-xl border ${variant.borderColor}`}>
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <AlertTriangle size={10} className={variant.iconColor} />
              This action cannot be undone
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 border-2 border-slate-200 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`px-5 py-2.5 ${variant.buttonBg} text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2 ${variant.buttonShadow}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {variant.icon}
                  <span>{confirmText}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;