import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let _listeners: ((toasts: Toast[]) => void)[] = [];
let _toasts: Toast[] = [];

function emitChange() {
  _listeners.forEach(listener => listener([..._toasts]));
}

export const toast = {
  success: (message: string) => show(message, 'success'),
  error: (message: string) => show(message, 'error'),
  info: (message: string) => show(message, 'info'),
  warning: (message: string) => show(message, 'warning'),
};

function show(message: string, type: ToastType) {
  const id = `toast-${Date.now()}-${Math.random()}`;
  _toasts = [..._toasts, { id, message, type }];
  emitChange();
  setTimeout(() => {
    _toasts = _toasts.filter(t => t.id !== id);
    emitChange();
  }, 3000);
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  error: <X className="w-4 h-4" />,
  info: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
  warning: <AlertTriangle className="w-4 h-4" />,
};

const COLORS: Record<ToastType, { bg: string; border: string; icon: string; iconBg: string }> = {
  success: { bg: '#f0fdf4', border: '#86efac', icon: '#16a34a', iconBg: '#dcfce7' },
  error: { bg: '#fef2f2', border: '#fca5a5', icon: '#dc2626', iconBg: '#fee2e2' },
  info: { bg: '#eff6ff', border: '#93c5fd', icon: '#2563eb', iconBg: '#dbeafe' },
  warning: { bg: '#fffbeb', border: '#fcd34d', icon: '#d97706', iconBg: '#fef3c7' },
};

function ToastItem({ toast: t }: { toast: Toast }) {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const c = COLORS[t.type];

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setVisible(false), 2700);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        background: c.bg,
        borderColor: c.border,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'all 0.3s ease',
      }}
      className="toast-item flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[280px] max-w-[360px]"
    >
      <div
        style={{ background: c.iconBg, color: c.icon }}
        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
      >
        {ICONS[t.type]}
      </div>
      <p className="text-sm font-medium text-gray-700 flex-1">{t.message}</p>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    _listeners.push(setToasts);
    return () => {
      _listeners = _listeners.filter(l => l !== setToasts);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="toast-container-desktop">
      {toasts.map(t => (
        <div key={t.id} className="mb-2">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>,
    document.body
  );
}
