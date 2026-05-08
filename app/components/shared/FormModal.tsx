import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
}

export const FormModal = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = 'حفظ',
  cancelLabel = 'إلغاء',
}: FormModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-vt)] rounded-xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-vt)]">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-md hover:bg-[var(--color-bg-elevated)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {onSubmit ? (
            <form id="modal-form" onSubmit={onSubmit} className="space-y-4">
              {children}
            </form>
          ) : (
            <div className="space-y-4">{children}</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border-vt)] bg-[var(--color-bg-base)] rounded-b-xl">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border border-[var(--color-border-vt)] rounded-lg text-text-primary hover:bg-[var(--color-bg-elevated)] transition-colors"
          >
            {cancelLabel}
          </button>
          <button 
            type={onSubmit ? "submit" : "button"} 
            form={onSubmit ? "modal-form" : undefined}
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors"
          >
            {submitLabel}
          </button>
        </div>
        
      </div>
    </div>
  );
};
