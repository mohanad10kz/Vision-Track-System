import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Phone, XCircle, Edit2, Trash2, HardHat, Users } from 'lucide-react';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { ConfirmDialog } from '@/app/components/shared/ConfirmDialog';
import { useTechnicians } from '@/app/hooks/use-technicians';
import type { Technician, CreateTechnicianInput, UpdateTechnicianInput, TechnicianStatus } from '@/app/types/technician.types';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TechGroupManager } from '@/app/components/shared/TechGroupManager';
import { useTechGroups } from '@/app/hooks/use-tech-groups';

// ألوان Avatar للفنيين (دوارة حسب الـ id)
const AVATAR_COLORS = [
  '#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B',
  '#EF4444', '#06B6D4', '#EC4899', '#6366F1',
];

function getAvatarColor(id: number): string {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}



// ======================================================
// Technician Form
// ======================================================
interface TechFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: CreateTechnicianInput | UpdateTechnicianInput) => Promise<void>;
  initial?: Technician;
}

const technicianSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  phone: z.string().min(5, 'رقم الهاتف قصير جداً'),
  notes: z.string().optional(),
  group_id: z.number().optional().nullable(),
});
type TechFormValues = z.infer<typeof technicianSchema>;

function TechnicianForm({ open, onClose, onSave, initial }: TechFormProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TechFormValues>({
    resolver: zodResolver(technicianSchema),
    defaultValues: {
      name: initial?.name ?? '',
      phone: initial?.phone ?? '',
      notes: initial?.notes ?? '',
      group_id: initial?.group_id ?? null,
    }
  });

  const { groups, isLoading } = useTechGroups();

  useEffect(() => {
    if (!isLoading && initial) {
      reset({
        name: initial.name ?? '',
        phone: initial.phone ?? '',
        notes: initial.notes ?? '',
        group_id: initial.group_id ?? null,
      });
    }
  }, [isLoading, initial, reset]);

  const onSubmit = async (data: TechFormValues) => {
    await onSave({
      name: data.name,
      phone: data.phone,
      specialty: 'all',
      notes: data.notes || null,
      group_id: data.group_id || null,
    });
    onClose();
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
        className="relative z-10 w-full max-w-md bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
            {initial ? 'تعديل الفني' : 'فني جديد'}
          </h2>
          <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
            <XCircle size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">الاسم *</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="اسم الفني"
                  autoFocus
                  className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)]"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">رقم الهاتف *</label>
                <input
                  type="text"
                  {...register('phone')}
                  placeholder="09XX-XXX-XXX"
                  dir="ltr"
                  className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] font-mono"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">المجموعة (اختياري)</label>
              <select
                {...register('group_id', { setValueAs: v => v === "" ? null : Number(v) })}
                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
              >
                <option value="">بدون مجموعة</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">ملاحظات</label>
              <textarea
                {...register('notes')}
                rows={2}
                placeholder="ملاحظات إضافية..."
                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] resize-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 p-5 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ======================================================
// Technician Card
// ======================================================
function TechnicianCard({
  tech,
  onStatusChange,
  onEdit,
  onDelete,
}: {
  tech: Technician;
  onStatusChange: (id: number, status: TechnicianStatus) => Promise<void>;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const color = getAvatarColor(tech.id);
  const initial = tech.name[0];

  return (
    <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col gap-4 hover:border-[var(--color-brand)]/30 transition-all group">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
          style={{ backgroundColor: color + '33', color }}
        >
          {initial}
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{tech.name}</p>
        </div>
      </div>

      {/* الحالة — select مباشر */}
      <select
        value={tech.status}
        onChange={e => onStatusChange(tech.id, e.target.value as TechnicianStatus)}
        className="w-full text-center text-xs rounded-lg px-2 py-1.5 border cursor-pointer transition-colors focus:outline-none"
        style={{
          backgroundColor: tech.status === 'available' ? '#10B98122' :
                           tech.status === 'busy' ? '#F59E0B22' : '#6B728022',
          borderColor: tech.status === 'available' ? '#10B98144' :
                       tech.status === 'busy' ? '#F59E0B44' : '#6B728044',
          color: tech.status === 'available' ? '#10B981' :
                 tech.status === 'busy' ? '#F59E0B' : '#9CA3AF',
        }}
      >
        <option value="available">🟢 متاح</option>
        <option value="busy">🟡 مشغول</option>
        <option value="off">⚫ غائب</option>
      </select>

      {/* الهاتف + زيارات اليوم */}
      <div className="flex flex-col gap-1.5 text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center gap-1.5">
          <Phone size={11} />
          <span dir="ltr" className="font-mono">{tech.phone}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>زيارات اليوم:</span>
          <span className="font-semibold text-[var(--color-brand)]">{tech.todayVisitsCount ?? 0}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-[var(--color-border)]">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors"
        >
          <Edit2 size={12} />
          تعديل
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-[var(--color-text-muted)] hover:text-red-400 hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors"
        >
          <Trash2 size={12} />
          حذف
        </button>
      </div>
    </div>
  );
}

// ======================================================
// Main Page
// ======================================================
export function Technicians() {
  const { technicians, loading, create, update, changeStatus, remove } = useTechnicians();
  const { groups, fetchGroups } = useTechGroups();
  const [showForm, setShowForm] = useState(false);
  const [showGroupsManager, setShowGroupsManager] = useState(false);
  const [editTech, setEditTech] = useState<Technician | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleCreate = async (input: CreateTechnicianInput) => {
    await create(input);
    toast.success('تمت إضافة الفني بنجاح');
    setShowForm(false);
  };

  const handleUpdate = async (input: UpdateTechnicianInput) => {
    if (!editTech) return;
    await update(editTech.id, input);
    toast.success('تم تحديث بيانات الفني');
    setEditTech(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await remove(deleteId);
    toast.success('تم حذف الفني');
    setDeleteId(null);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden pr-[240px]">
      <div className="p-6 pb-4">
        <PageHeader
          title="الفنيون"
          description="فريق العمل الميداني"
          icon={<HardHat size={20} />}
          action={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGroupsManager(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-elevated)] transition-colors"
              >
                <Users size={16} className="text-[var(--color-brand)]" />
                المجموعات
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors"
              >
                <Plus size={16} />
                فني جديد
              </button>
            </div>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-[var(--color-bg-surface)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : technicians.length === 0 ? (
          <EmptyState
            icon={<HardHat size={48} />}
            title="لا يوجد فنيون بعد"
            description="أضف فنيين لربطهم بالزيارات الميدانية"
            actionLabel="إضافة فني"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="flex flex-col gap-8">
            {groups.map(group => {
              const groupTechs = technicians.filter(t => t.group_id === group.id);
              return (
                <div key={group.id} className="border-b border-[var(--color-border)]/50 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand)]" />
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {group.name} ({groupTechs.length})
                    </h3>
                  </div>
                  {groupTechs.length === 0 ? (
                    <p className="text-xs text-[var(--color-text-muted)] italic pr-4">لا يوجد فنيين في هذه المجموعة</p>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {groupTechs.map(tech => (
                        <TechnicianCard
                          key={tech.id}
                          tech={tech}
                          onStatusChange={changeStatus}
                          onEdit={() => setEditTech(tech)}
                          onDelete={() => setDeleteId(tech.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {technicians.filter(t => !t.group_id).length > 0 && (
              <div className="pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    بدون مجموعة ({technicians.filter(t => !t.group_id).length})
                  </h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {technicians.filter(t => !t.group_id).map(tech => (
                    <TechnicianCard
                      key={tech.id}
                      tech={tech}
                      onStatusChange={changeStatus}
                      onEdit={() => setEditTech(tech)}
                      onDelete={() => setDeleteId(tech.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <TechnicianForm
            open={showForm}
            onClose={() => setShowForm(false)}
            onSave={input => handleCreate(input as CreateTechnicianInput)}
          />
        )}
        {editTech && (
          <TechnicianForm
            open={!!editTech}
            onClose={() => setEditTech(null)}
            onSave={input => handleUpdate(input as UpdateTechnicianInput)}
            initial={editTech}
          />
        )}
      </AnimatePresence>

      <TechGroupManager
        open={showGroupsManager}
        onClose={() => setShowGroupsManager(false)}
        onGroupsChange={fetchGroups}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={open => { if (!open) setDeleteId(null); }}
        title="حذف الفني"
        description="هل أنت متأكد من حذف هذا الفني؟ سيؤثر ذلك على الزيارات المرتبطة به."
        confirmLabel="حذف"
        onConfirm={handleDelete}
      />
    </div>
  );
}
