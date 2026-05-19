import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Phone, MapPin, FileText, Edit2, Trash2, XCircle } from 'lucide-react';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { SearchInput } from '@/app/components/shared/SearchInput';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { ConfirmDialog } from '@/app/components/shared/ConfirmDialog';
import { useClients } from '@/app/hooks/use-clients';
import type { Client, CreateClientInput, UpdateClientInput } from '@/app/types/client.types';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ======================================================
// Client Form Modal
// ======================================================
interface ClientFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: CreateClientInput | UpdateClientInput) => Promise<void>;
  initial?: Client;
}

const clientSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  phone: z.string().min(5, 'رقم الهاتف قصير جداً'),
  address: z.string().optional(),
  notes: z.string().optional(),
});
type ClientFormValues = z.infer<typeof clientSchema>;

function ClientForm({ open, onClose, onSave, initial }: ClientFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: initial?.name ?? '',
      phone: initial?.phone ?? '',
      address: initial?.address ?? '',
      notes: initial?.notes ?? '',
    }
  });

  const onSubmit = async (data: ClientFormValues) => {
    await onSave({
      name: data.name,
      phone: data.phone,
      address: data.address || null,
      notes: data.notes || null,
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
            {initial ? 'تعديل العميل' : 'عميل جديد'}
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
                  placeholder="اسم العميل"
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
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">العنوان</label>
              <input
                type="text"
                {...register('address')}
                placeholder="الحي، الشارع..."
                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">ملاحظات</label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="نوع النظام، تفاصيل مهمة..."
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
// Client Card
// ======================================================
function ClientCard({ client, onEdit, onDelete }: { client: Client; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-brand)]/30 transition-all group">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[var(--color-brand)]/20 flex items-center justify-center shrink-0">
        <span className="text-[var(--color-brand)] font-semibold text-base">{client.name[0]}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{client.name}</p>
        <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] mb-1">
          <Phone size={11} />
          <span dir="ltr" className="font-mono">{client.phone}</span>
        </div>
        {client.address && (
          <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] mb-1">
            <MapPin size={11} />
            <span className="line-clamp-1">{client.address}</span>
          </div>
        )}
        {client.notes && (
          <div className="flex items-start gap-1 text-xs text-[var(--color-text-muted)]">
            <FileText size={11} className="mt-0.5 shrink-0" />
            <span className="line-clamp-2">{client.notes}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-brand)] transition-colors"
          title="تعديل"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-red-400 transition-colors"
          title="حذف"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ======================================================
// Main Page
// ======================================================
export function Clients() {
  const { clients, loading, search, setSearch, create, update, remove } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleCreate = async (input: CreateClientInput) => {
    await create(input);
    toast.success('تمت إضافة العميل بنجاح');
    setShowForm(false);
  };

  const handleUpdate = async (input: UpdateClientInput) => {
    if (!editClient) return;
    await update(editClient.id, input);
    toast.success('تم تحديث بيانات العميل');
    setEditClient(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await remove(deleteId);
    toast.success('تم حذف العميل');
    setDeleteId(null);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden pr-[240px]">
      <div className="p-6 pb-4">
        <PageHeader
          title="العملاء"
          description="دفتر عناوين العملاء"
          icon={<User size={20} />}
          action={
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors"
            >
              <Plus size={16} />
              عميل جديد
            </button>
          }
        />
        <div className="mt-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="بحث باسم أو رقم هاتف..."
            className="max-w-sm"
          />
        </div>
        {!loading && (
          <p className="text-sm text-[var(--color-text-muted)] mt-3">
            {clients.length} عميل
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-[var(--color-bg-surface)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : clients.length === 0 ? (
          <EmptyState
            icon={<User size={48} />}
            title={search ? 'لا توجد نتائج للبحث' : 'لا يوجد عملاء بعد'}
            description={search ? 'جرب كلمة بحث مختلفة' : 'ابدأ بإضافة عملائك لربطهم بالزيارات'}
            actionLabel={search ? undefined : 'إضافة عميل'}
            onAction={search ? undefined : () => setShowForm(true)}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {clients.map(client => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={() => setEditClient(client)}
                onDelete={() => setDeleteId(client.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modals */}
      <AnimatePresence>
        {showForm && (
          <ClientForm
            open={showForm}
            onClose={() => setShowForm(false)}
            onSave={input => handleCreate(input as CreateClientInput)}
          />
        )}
        {editClient && (
          <ClientForm
            open={!!editClient}
            onClose={() => setEditClient(null)}
            onSave={input => handleUpdate(input as UpdateClientInput)}
            initial={editClient}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={open => { if (!open) setDeleteId(null); }}
        title="حذف العميل"
        description="هل أنت متأكد من حذف هذا العميل؟ سيؤثر ذلك على الزيارات المرتبطة به."
        confirmLabel="حذف"
        onConfirm={handleDelete}
      />
    </div>
  );
}
