import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const PageHeader = ({ title, description, icon, action }: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 rounded-lg bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{title}</h2>
          {description && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{description}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
