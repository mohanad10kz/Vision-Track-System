import React from 'react';

type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface PriorityBadgeProps {
  priority: Priority;
}

const config: Record<Priority, { label: string; colorClass: string }> = {
  low: { label: 'منخفضة', colorClass: 'bg-green-500/15 text-green-500 border-green-500/20' },
  medium: { label: 'متوسطة', colorClass: 'bg-blue-500/15 text-blue-500 border-blue-500/20' },
  high: { label: 'عالية', colorClass: 'bg-orange-500/15 text-orange-500 border-orange-500/20' },
  urgent: { label: 'عاجلة', colorClass: 'bg-red-500/15 text-red-500 border-red-500/20' },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { label, colorClass } = config[priority] || config.medium;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}>
      {label}
    </span>
  );
}
