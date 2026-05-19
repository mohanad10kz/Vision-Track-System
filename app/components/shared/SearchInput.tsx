import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'بحث...', className = '' }: SearchInputProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        size={15}
        className="absolute right-3 text-[var(--color-text-muted)] pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg
                   pr-9 pl-8 py-2 text-sm text-[var(--color-text-primary)]
                   placeholder:text-[var(--color-text-muted)]
                   focus:outline-none focus:border-[var(--color-brand)] transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute left-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
