'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = '确定',
  cancelLabel = '取消',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const variantStyles = {
    danger: {
      button: 'bg-red-500 hover:bg-red-600',
      icon: 'text-red-500',
      bg: 'bg-red-50',
    },
    warning: {
      button: 'bg-orange-500 hover:bg-orange-600',
      icon: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    info: {
      button: 'bg-blue hover:bg-blue-dark',
      icon: 'text-blue',
      bg: 'bg-blue-50',
    },
  };

  const style = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4">
          {message && <p className="text-gray-600 text-sm leading-relaxed">{message}</p>}
        </div>
        <div className="flex gap-3 px-6 py-4 bg-gray-50">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50 ${style.button}`}
          >
            {loading ? '处理中...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
