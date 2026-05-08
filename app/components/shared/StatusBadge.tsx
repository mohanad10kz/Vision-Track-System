import React from 'react';

type StatusType = 'pending' | 'inprogress' | 'done' | 'urgent' | 'new' | 'resolved';

interface StatusBadgeProps {
  status: StatusType | string;
}

const configs: Record<string, { label: string; bg: string; text: string }> = {
  pending:    { label: 'معلق',     bg: 'bg-amber-500/15',  text: 'text-amber-500'  },
  inprogress: { label: 'جارٍ',     bg: 'bg-blue-500/15',   text: 'text-blue-500'   },
  done:       { label: 'مكتمل',   bg: 'bg-green-500/15',  text: 'text-green-500'  },
  urgent:     { label: 'عاجل',     bg: 'bg-red-500/15',    text: 'text-red-500'    },
  new:        { label: 'جديد',     bg: 'bg-sky-500/15',    text: 'text-sky-500'    },
  resolved:   { label: 'محلول',   bg: 'bg-emerald-500/15',text: 'text-emerald-500'},
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = configs[status] || { label: status, bg: 'bg-gray-500/15', text: 'text-gray-500' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};
