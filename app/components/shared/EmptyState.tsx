import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 text-center px-6">
      {icon && (
        <div className="text-[var(--color-text-muted)] opacity-40 mb-1">
          {icon}
        </div>
      )}
      <p className="text-base font-medium text-[var(--color-text-secondary)]">{title}</p>
      {description && (
        <p className="text-sm text-[var(--color-text-muted)] max-w-xs">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dark)] transition-colors"
        >
          <Plus size={15} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
