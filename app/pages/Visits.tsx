import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ar } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MapPin, Clock, User, MoreVertical,
  Hammer, Wrench, RefreshCw, CalendarDays, CheckCircle,
  XCircle, Trash2, Edit2, Archive
} from 'lucide-react';
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis,
} from '@/app/components/ui/pagination';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { SearchInput } from '@/app/components/shared/SearchInput';
import { VisitTypeBadge } from '@/app/components/shared/VisitTypeBadge';
import { StatusBadge } from '@/app/components/shared/StatusBadge';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { ConfirmDialog } from '@/app/components/shared/ConfirmDialog';
import { useVisits } from '@/app/hooks/use-visits';
import { useClients } from '@/app/hooks/use-clients';
import { useTechnicians } from '@/app/hooks/use-technicians';
import type { Visit, VisitType, VisitStatus, CreateVisitInput, UpdateVisitInput } from '@/app/types/visit.types';
import type { Technician } from '@/app/types/technician.types';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ======================================================
// Visit Form Modal
// ======================================================
interface VisitFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: CreateVisitInput | UpdateVisitInput) => Promise<void>;
  technicians: Technician[];
  clients: ReturnType<typeof useClients>['clients'];
  initial?: Visit;
}

const visitSchema = z.object({
  visit_type: z.enum(['installation', 'maintenance', 'survey', 'followup']),
  client_search: z.string().optional(),
  client_name: z.string().min(2, 'اسم العميل مطلوب'),
  client_phone: z.string().min(5, 'رقم الهاتف مطلوب'),
  client_address: z.string().optional(),
  technician_id: z.string().min(1, 'الفني مطلوب'),
  visit_date: z.string().min(1, 'التاريخ مطلوب'),
  visit_time: z.string().optional(),
  notes: z.string().optional(),
});

type VisitFormValues = z.infer<typeof visitSchema>;

function VisitForm({ open, onClose, onSave, technicians, clients, initial }: VisitFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      visit_type: initial?.visit_type ?? 'installation',
      client_search: initial?.client_name ?? '',
      client_name: initial?.client_name ?? '',
      client_phone: initial?.client_phone ?? '',
      client_address: initial?.client_address ?? '',
      technician_id: initial?.technician_id?.toString() ?? '',
      visit_date: initial?.visit_date ?? format(new Date(), 'yyyy-MM-dd'),
      visit_time: initial?.visit_time ?? '',
      notes: initial?.notes ?? '',
    }
  });

  const [selectedClientId, setSelectedClientId] = useState<number | null>(initial?.client_id ?? null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const visitType = watch('visit_type');
  const clientSearch = watch('client_search');

  const filteredClients = clients.filter(c =>
    clientSearch ? (c.name.includes(clientSearch || '') || c.phone.includes(clientSearch || '')) : true
  ).slice(0, 6);

  const selectClient = (c: typeof clients[0]) => {
    setSelectedClientId(c.id);
    setValue('client_name', c.name);
    setValue('client_phone', c.phone);
    setValue('client_address', c.address ?? '');
    setValue('client_search', c.name);
    setShowClientDropdown(false);
  };

  const onSubmit = async (data: VisitFormValues) => {
    const tech = technicians.find(t => t.id === Number(data.technician_id));
    await onSave({
      client_id: selectedClientId,
      client_name: data.client_name,
      client_phone: data.client_phone,
      client_address: data.client_address || null,
      visit_type: data.visit_type,
      visit_date: data.visit_date,
      visit_time: data.visit_time || null,
      technician_id: Number(data.technician_id),
      technician_name: tech?.name ?? null,
      status: initial ? initial.status : 'scheduled',
      notes: data.notes || null,
    });
    onClose();
  };

  if (!open) return null;

  const visitTypeOptions: { value: VisitType; label: string; icon: React.ElementType }[] = [
    { value: 'installation', label: 'تركيب',      icon: Hammer },
    { value: 'maintenance',  label: 'صيانة',       icon: Wrench },
    { value: 'survey',       label: 'مسح ميداني',  icon: MapPin },
    { value: 'followup',     label: 'متابعة',       icon: RefreshCw },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">زيارة جديدة</h2>
          <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
            <XCircle size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="p-5 flex flex-col gap-4">
            {/* نوع الزيارة */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">نوع الزيارة *</label>
              <div className="grid grid-cols-2 gap-2">
                {visitTypeOptions.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue('visit_type', opt.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${
                        visitType === opt.value
                          ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]'
                          : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-brand)]'
                      }`}
                    >
                      <Icon size={15} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* العميل — Combobox */}
            <div className="relative">
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">العميل</label>
              <input
                type="text"
                {...register('client_search', {
                  onChange: (e) => {
                    setValue('client_name', e.target.value);
                    setShowClientDropdown(true);
                    setSelectedClientId(null);
                  }
                })}
                onFocus={() => setShowClientDropdown(true)}
                placeholder="ابحث عن عميل أو اكتب اسماً جديداً..."
                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)]"
              />
              {showClientDropdown && filteredClients.length > 0 && (
                <div className="absolute z-50 top-full mt-1 w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden">
                  {filteredClients.map(c => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => selectClient(c)}
                      className="w-full text-right px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] flex items-center justify-between"
                    >
                      <span className="text-[var(--color-text-muted)] text-xs">{c.phone}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* اسم العميل + هاتف */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">اسم العميل *</label>
                <input
                  type="text"
                  {...register('client_name')}
                  placeholder="اسم العميل"
                  className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)]"
                />
                {errors.client_name && <p className="text-red-500 text-xs mt-1">{errors.client_name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">رقم الهاتف *</label>
                <input
                  type="text"
                  {...register('client_phone')}
                  placeholder="09XX-XXX-XXX"
                  className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] font-mono"
                  dir="ltr"
                />
                {errors.client_phone && <p className="text-red-500 text-xs mt-1">{errors.client_phone.message}</p>}
              </div>
            </div>

            {/* العنوان */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">العنوان</label>
              <input
                type="text"
                {...register('client_address')}
                placeholder="الحي، الشارع..."
                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)]"
              />
            </div>

            {/* الفني + التاريخ + الوقت */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">الفني *</label>
                <select
                  {...register('technician_id')}
                  className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
                >
                  <option value="">اختر...</option>
                  {technicians.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                {errors.technician_id && <p className="text-red-500 text-xs mt-1">{errors.technician_id.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">التاريخ *</label>
                <input
                  type="date"
                  {...register('visit_date')}
                  className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
                />
                {errors.visit_date && <p className="text-red-500 text-xs mt-1">{errors.visit_date.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">الوقت</label>
                <input
                  type="time"
                  {...register('visit_time')}
                  className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
                />
              </div>
            </div>

            {/* ملاحظات */}
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
              className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ الزيارة'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ======================================================
// Visit Card
// ======================================================
interface VisitCardProps {
  visit: Visit;
  onChangeStatus: (id: number, status: VisitStatus) => Promise<void>;
  onDelete: (id: number) => void;
  onEdit: (visit: Visit) => void;
}

function VisitCard({ visit, onChangeStatus, onDelete, onEdit }: VisitCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleStatusChange = async (status: VisitStatus) => {
    await onChangeStatus(visit.id, status);
    setShowMenu(false);
  };

  return (
    <div className="relative bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-4 hover:border-[var(--color-brand)]/40 transition-all">

      <div className="flex items-start gap-3">
        {/* الوقت */}
        <div className="flex flex-col items-center shrink-0 min-w-[52px]">
          {visit.visit_time ? (
            <>
              <Clock size={13} className="text-[var(--color-text-muted)] mb-0.5" />
              <span className="text-xs font-mono text-[var(--color-brand)]">
                {visit.visit_time.slice(0, 5)}
              </span>
            </>
          ) : (
            <span className="text-xs text-[var(--color-text-muted)]">—</span>
          )}
        </div>

        {/* المحتوى */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <VisitTypeBadge type={visit.visit_type} />
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              {visit.client_name} - <span className="text-[var(--color-text-muted)] font-mono text-xs">{visit.client_phone}</span>
            </span>
          </div>

          <div className="text-xs text-[var(--color-text-muted)] mb-1.5 flex items-center gap-3 flex-wrap">
            {/* ملاحظات */}
            {visit.notes && (
              <span className="line-clamp-1">{visit.notes}</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] flex-wrap">
            {visit.technician_name && (
              <span className="flex items-center gap-1">
                <User size={11} />
                {visit.technician_name}
              </span>
            )}
            {visit.client_address && (
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {visit.client_address}
              </span>
            )}
            <StatusBadge status={visit.status} size="sm" />
          </div>
        </div>

        {/* قائمة الإجراءات */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <MoreVertical size={15} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute left-0 top-8 z-20 w-40 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-xl overflow-hidden">
                <div className="p-1">
                  <p className="text-[10px] text-[var(--color-text-muted)] px-2 py-1 font-medium">تغيير الحالة</p>
                  {visit.status !== 'scheduled' && (
                    <button onClick={() => handleStatusChange('scheduled')} className="w-full text-right px-3 py-1.5 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] rounded flex items-center gap-2">
                      <CalendarDays size={12} /> مجدولة
                    </button>
                  )}
                  {visit.status !== 'completed' && (
                    <button onClick={() => handleStatusChange('completed')} className="w-full text-right px-3 py-1.5 text-xs text-emerald-400 hover:bg-[var(--color-bg-hover)] rounded flex items-center gap-2">
                      <CheckCircle size={12} /> مكتملة
                    </button>
                  )}
                  <button onClick={() => { onEdit(visit); setShowMenu(false); }} className="w-full text-right px-3 py-1.5 text-xs text-orange-400 hover:bg-[var(--color-bg-hover)] rounded flex items-center gap-2">
                    <Edit2 size={12} /> تعديل
                  </button>
                  <div className="h-px bg-[var(--color-border)] my-1" />
                  <button
                    onClick={() => { onDelete(visit.id); setShowMenu(false); }}
                    className="w-full text-right px-3 py-1.5 text-xs text-red-400 hover:bg-[var(--color-bg-hover)] rounded flex items-center gap-2"
                  >
                    <Trash2 size={12} /> حذف
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// Group Header
// ======================================================
function GroupHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-2 h-2 rounded-full bg-[var(--color-brand)]" />
      <span className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</span>
      <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] px-2 py-0.5 rounded-full">
        {count} زيارة
      </span>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
    </div>
  );
}

// ======================================================
// Main Page
// ======================================================
type TabFilter = 'all' | VisitType;

export function Visits() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editVisit, setEditVisit] = useState<Visit | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const LIMIT = 8;

  useEffect(() => {
    setPage(1);
  }, [activeTab, search]);

  const { visits, loading, create, update, remove, changeStatus } = useVisits(
    activeTab === 'all' ? undefined : activeTab as VisitType
  );
  const { clients } = useClients();
  const { technicians } = useTechnicians();

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const filteredVisits = (list: Visit[]) =>
    search
      ? list.filter(v =>
          v.client_name.includes(search) ||
          v.client_phone.includes(search) ||
          v.client_address?.includes(search)
        )
      : list;

  const tabs: { key: TabFilter; label: string; icon: React.ElementType }[] = [
    { key: 'all',          label: 'الكل',         icon: CalendarDays },
    { key: 'installation', label: 'تركيب',         icon: Hammer       },
    { key: 'maintenance',  label: 'صيانة',          icon: Wrench       },
    { key: 'survey',       label: 'مسح ميداني',    icon: MapPin       },
    { key: 'followup',     label: 'متابعة',         icon: RefreshCw    },
  ];

  const handleSave = async (input: CreateVisitInput | UpdateVisitInput) => {
    if (editVisit) {
      await update(editVisit.id, input as UpdateVisitInput);
      toast.success('تم تعديل الزيارة بنجاح');
    } else {
      await create(input as CreateVisitInput);
      toast.success('تمت إضافة الزيارة بنجاح');
    }
    setShowForm(false);
    setEditVisit(null);
  };

  const handleDelete = async (id: number) => {
    await remove(id);
    toast.success('تم حذف الزيارة');
    setDeleteId(null);
  };

  const renderGroup = (label: string, items: Visit[]) => {
    if (items.length === 0) return null;
    return (
      <div key={label} className="mb-6">
        <GroupHeader label={label} count={items.length} />
        <div className="flex flex-col gap-3">
          {items.map(v => (
            <VisitCard
              key={v.id}
              visit={v}
              onChangeStatus={changeStatus}
              onDelete={(id) => setDeleteId(id)}
              onEdit={(visit) => {
                setEditVisit(visit);
                setShowForm(true);
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  // استخراج آخر 7 أيام تحتوي على بيانات في قاعدة البيانات
  const uniqueDates = Array.from(new Set(visits.map(v => v.visit_date))).sort((a, b) => a.localeCompare(b));
  const targetDates = uniqueDates.slice(-7);

  const windowVisits = visits.filter(v => targetDates.includes(v.visit_date));
  const allFiltered = filteredVisits(windowVisits);
  const total = allFiltered.length;

  const startIndex = (page - 1) * LIMIT;
  const paginatedVisits = allFiltered.slice(startIndex, startIndex + LIMIT);

  const renderAllGroups = () => {
    if (paginatedVisits.length === 0) return null;
    
    const grouped = paginatedVisits.reduce((acc, v) => {
      if (!acc[v.visit_date]) acc[v.visit_date] = [];
      acc[v.visit_date].push(v);
      return acc;
    }, {} as Record<string, Visit[]>);

    const dates = Object.keys(grouped);
    const tomorrowStr = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    
    const sortedDates = dates.sort((a, b) => a.localeCompare(b));

    return sortedDates.map(date => {
      let label = format(new Date(date + 'T12:00:00'), 'EEEE d MMMM yyyy', { locale: ar });
      if (date === todayStr) label = `اليوم — ${label}`;
      else if (date === tomorrowStr) label = `الغد — ${label}`;
      
      return renderGroup(label, grouped[date]);
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden pr-[240px]">
      {/* Header */}
      <div className="p-6 pb-0">
        <PageHeader
          title="الزيارات الميدانية"
          description="زيارات آخر 7 أيام والمستقبلية"
          icon={<CalendarDays size={20} />}
          action={
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/visits/archive')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-brand)]/50 transition-colors"
              >
                <Archive size={15} />
                الأرشيف
              </button>
              <button
                onClick={() => {
                  setEditVisit(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors"
              >
                <Plus size={16} />
                زيارة جديدة
              </button>
            </div>
          }
        />

        {/* Type Tabs */}
        <div className="flex items-center gap-1 mt-4 overflow-x-auto pb-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'bg-[var(--color-brand)] text-white'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="mt-3 mb-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="بحث باسم العميل أو الهاتف أو العنوان..."
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-[var(--color-bg-surface)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : visits.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={48} />}
            title="لا توجد زيارات"
            description={activeTab === 'all' ? 'ابدأ بإضافة زيارة جديدة' : `لا توجد زيارات من نوع "${tabs.find(t => t.key === activeTab)?.label}"`}
            actionLabel="زيارة جديدة"
            onAction={() => {
              setEditVisit(null);
              setShowForm(true);
            }}
          />
        ) : allFiltered.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={48} />}
            title="لا توجد زيارات في الأيام السبعة الأخيرة"
            description="يمكنك عرض الزيارات القديمة والمكتملة في الأرشيف"
            actionLabel="عرض الأرشيف"
            onAction={() => navigate('/visits/archive')}
          />
        ) : (
          renderAllGroups()
        )}
      </div>

      {/* Pagination — shadcn */}
      {!loading && total > LIMIT && (
        <div className="px-6 py-3 border-t border-[var(--color-border)] shrink-0 bg-[var(--color-bg-surface)]">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                />
              </PaginationItem>

              {Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => i + 1)
                .filter(p => p === 1 || p === Math.ceil(total / LIMIT) || Math.abs(p - page) <= 1)
                .reduce<(number | '...')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === '...' ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        isActive={page === item}
                        onClick={() => setPage(item as number)}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )
              }

              <PaginationItem>
                <PaginationNext
                  disabled={page >= Math.ceil(total / LIMIT)}
                  onClick={() => setPage(p => p + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <VisitForm
            open={showForm}
            onClose={() => {
              setShowForm(false);
              setEditVisit(null);
            }}
            onSave={handleSave}
            technicians={technicians}
            clients={clients}
            initial={editVisit || undefined}
          />
        )}
      </AnimatePresence>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={open => { if (!open) setDeleteId(null); }}
        title="حذف الزيارة"
        description="هل أنت متأكد من حذف هذه الزيارة؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف"
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </div>
  );
}
