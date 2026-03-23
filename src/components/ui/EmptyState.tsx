'use client';

import Link from 'next/link';
import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 mb-6 max-w-sm">{description}</p>
      )}
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="px-6 py-2.5 bg-blue text-white rounded-xl text-sm font-medium hover:bg-blue-dark transition-colors"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="px-6 py-2.5 bg-blue text-white rounded-xl text-sm font-medium hover:bg-blue-dark transition-colors"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

export function EmptyTable({ message = '暂无数据' }: { message?: string }) {
  return (
    <tr>
      <td colSpan={99} className="py-16 text-center">
        <EmptyState
          title={message}
          className="inline-flex"
        />
      </td>
    </tr>
  );
}
