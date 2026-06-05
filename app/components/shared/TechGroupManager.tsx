import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, XCircle, Trash2, Edit2, Users } from 'lucide-react';
import { useTechGroups } from '@/app/hooks/use-tech-groups';
import type { TechGroup } from '@/app/types/tech-group.types';
import { ConfirmDialog } from '@/app/components/shared/ConfirmDialog';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TechGroupManager({ open, onClose }: Props) {
  const { groups, createGroup, updateGroup, deleteGroup } = useTechGroups();
  const [isAdding, setIsAdding] = useState(false);
  const [editGroup, setEditGroup] = useState<TechGroup | null>(null);
  const [name, setName] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleSave = async () => {
    if (!name.trim()) return;
    if (editGroup) {
      await updateGroup(editGroup.id, { name: name.trim() });
    } else {
      await createGroup({ name: name.trim() });
    }
    setName('');
    setEditGroup(null);
    setIsAdding(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="relative z-10 w-full max-w-md bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
            <Users size={20} className="text-[var(--color-brand)]" />
            <h2 className="text-base font-semibold">إدارة المجموعات</h2>
          </div>
          <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4">
          {!isAdding && !editGroup ? (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center justify-center gap-2 w-full py-2 border border-dashed border-[var(--color-brand)] text-[var(--color-brand)] rounded-lg hover:bg-[var(--color-brand)]/10 transition-colors text-sm"
            >
              <Plus size={16} />
              مجموعة جديدة
            </button>
          ) : (
            <div className="flex flex-col gap-3 p-3 bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border)]">
              <label className="text-xs text-[var(--color-text-secondary)]">اسم المجموعة</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="الاسم"
                  autoFocus
                  className="flex-1 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
                />
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-[var(--color-brand)] text-white text-sm rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors"
                >
                  حفظ
                </button>
                <button
                  onClick={() => { setIsAdding(false); setEditGroup(null); setName(''); }}
                  className="px-3 py-1.5 text-[var(--color-text-secondary)] hover:text-red-500 text-sm"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-2">
            {groups.length === 0 ? (
              <p className="text-center text-sm text-[var(--color-text-muted)] py-4">لا توجد مجموعات بعد</p>
            ) : (
              groups.map(g => (
                <div key={g.id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-brand)]/30 transition-colors">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">{g.name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditGroup(g); setName(g.name); }}
                      className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-bg-elevated)] rounded-md transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(g.id)}
                      className="p-1.5 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => { if (!open) setDeleteId(null); }}
        title="حذف المجموعة"
        description="هل أنت متأكد من حذف هذه المجموعة؟ لن يتم حذف الفنيين بل سيصبحون بلا مجموعة."
        confirmLabel="حذف"
        onConfirm={async () => {
          if (deleteId) await deleteGroup(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
