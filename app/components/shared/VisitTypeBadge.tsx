import React from 'react';
import { Hammer, Wrench, MapPin, RefreshCw } from 'lucide-react';
import type { VisitType } from '@/app/types/visit.types';

interface VisitTypeBadgeProps {
  type: VisitType;
  size?: 'sm' | 'md';
}

const typeConfig = {
  installation: { label: 'تركيب',      Icon: Hammer,     color: '#8B5CF6' },
  maintenance:  { label: 'صيانة',       Icon: Wrench,     color: '#F59E0B' },
  survey:       { label: 'مسح ميداني', Icon: MapPin,     color: '#06B6D4' },
  followup:     { label: 'متابعة',      Icon: RefreshCw,  color: '#6B7280' },
} as const;

export function VisitTypeBadge({ type, size = 'md' }: VisitTypeBadgeProps) {
  const config = typeConfig[type];
  if (!config) return null;

  const { label, Icon, color } = config;
  const iconSize = size === 'sm' ? 12 : 14;
  const textSize = size === 'sm' ? 'text-[11px]' : 'text-xs';
  const padding = size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${textSize} ${padding}`}
      style={{
        backgroundColor: `${color}22`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      <Icon size={iconSize} />
      {label}
    </span>
  );
}
