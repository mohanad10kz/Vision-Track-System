import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const configs: Record<string, { label: string; bg: string; text: string }> = {
  // Task / Note statuses
  pending:    { label: 'معلق',    bg: 'bg-amber-500/15',   text: 'text-amber-400'   },
  inprogress: { label: 'جارٍ',    bg: 'bg-blue-500/15',    text: 'text-blue-400'    },
  done:       { label: 'مكتمل',   bg: 'bg-green-500/15',   text: 'text-green-400'   },
  // Visit statuses
  scheduled:  { label: 'مجدولة',  bg: 'bg-sky-500/15',     text: 'text-sky-400'     },
  completed:  { label: 'مكتملة',  bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  cancelled:  { label: 'ملغاة',   bg: 'bg-red-500/15',     text: 'text-red-400'     },
  postponed:  { label: 'مؤجلة',   bg: 'bg-orange-500/15',  text: 'text-orange-400'  },
  // Priority
  urgent:     { label: 'عاجل',    bg: 'bg-red-500/15',     text: 'text-red-400'     },
  high:       { label: 'عالية',   bg: 'bg-orange-500/15',  text: 'text-orange-400'  },
  medium:     { label: 'متوسطة',  bg: 'bg-blue-500/15',    text: 'text-blue-400'    },
  low:        { label: 'منخفضة',  bg: 'bg-gray-500/15',    text: 'text-gray-400'    },
  // Technician status
  available:  { label: 'متاح',    bg: 'bg-green-500/15',   text: 'text-green-400'   },
  busy:       { label: 'مشغول',   bg: 'bg-yellow-500/15',  text: 'text-yellow-400'  },
  off:        { label: 'غائب',    bg: 'bg-gray-500/15',    text: 'text-gray-400'    },
};

export const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const config = configs[status] || { label: status, bg: 'bg-gray-500/15', text: 'text-gray-400' };
  const textSize = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-0.5';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${textSize} ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};
