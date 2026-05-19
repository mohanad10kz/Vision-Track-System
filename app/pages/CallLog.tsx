import React, { useState } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Phone, PhoneIncoming, PhoneOutgoing,
  Bell, BellOff, CheckCircle, Edit2, Trash2,
  XCircle, MessageSquare, Filter
} from 'lucide-react';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { SearchInput } from '@/app/components/shared/SearchInput';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { ConfirmDialog } from '@/app/components/shared/ConfirmDialog';
import { useCalls } from '@/app/hooks/use-calls';
import type { CallLog, CreateCallLogInput, UpdateCallLogInput, CallContactType, CallDirection } from '@/app/types/call.types';
import { toast } from 'sonner';

// ======================================================
// Call Form Modal
// ======================================================
interface CallFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: CreateCallLogInput) => Promise<void>;
  initial?: CallLog;
}

function CallForm({ open, onClose, onSave, initial }: CallFormProps) {
  const [contactName, setContactName] = useState(initial?.contact_name ?? '');
  const [contactType, setContactType] = useState<CallContactType>(initial?.contact_type ?? 'client');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [direction, setDirection] = useState<CallDirection>(initial?.direction ?? 'incoming');
  const [subject, setSubject] = useState(initial?.subject ?? '');
  const [summary, setSummary] = useState(initial?.summary ?? '');
  const [requiresFollowup, setRequiresFollowup] = useState(Boolean(initial?.requires_followup));
  const [followupDate, setFollowupDate] = useState(initial?.followup_date ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!contactName.trim() || !subject.trim()) {
      toast.error('اسم جهة الاتصال والموضوع مطلوبان');
      return;
    }
    setSaving(true);
    await onSave({
      contact_name: contactName,
      contact_type: contactType,
      phone: phone || null,
      direction,
      subject,
      summary: summary || null,
      requires_followup: requiresFollowup,
      followup_date: requiresFollowup && followupDate ? followupDate : null,
    });
    setSaving(false);
    onClose();
  };

  if (!open) return null;

  const contactTypeOptions = [
    { value: 'client', label: 'عميل' },
    { value: 'company', label: 'الشركة' },
    { value: 'supplier', label: 'مورد' },
    { value: 'other', label: 'أخرى' },
  ];

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
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">تسجيل اتصال</h2>
          <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* الاتجاه */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">الاتجاه *</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDirection('incoming')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${
                  direction === 'incoming'
                    ? 'bg-green-500/15 border-green-500/40 text-green-400'
                    : 'bg-[var(--color-bg-elevated)] border-[var(--color-border)] text-[var(--color-text-muted)]'
                }`}
              >
                <PhoneIncoming size={15} /> وارد ↙
              </button>
              <button
                onClick={() => setDirection('outgoing')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${
                  direction === 'outgoing'
                    ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                    : 'bg-[var(--color-bg-elevated)] border-[var(--color-border)] text-[var(--color-text-muted)]'
                }`}
              >
                <PhoneOutgoing size={15} /> صادر ↗
              </button>
            </div>
          </div>

          {/* الاسم + النوع */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">جهة الاتصال *</label>
              <input
                type="text"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="اسم الشخص أو الجهة"
                autoFocus
                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">النوع *</label>
              <select
                value={contactType}
                onChange={e => setContactType(e.target.value as CallContactType)}
                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
              >
                {contactTypeOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* الهاتف */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">رقم الهاتف</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="09XX-XXX-XXX"
              dir="ltr"
              className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] font-mono"
            />
          </div>

          {/* الموضوع */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">الموضوع *</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="موضوع الاتصال..."
              className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)]"
            />
          </div>

          {/* الملخص */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">ملخص المحادثة</label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={2}
              placeholder="ما الذي تم الاتفاق عليه؟..."
              className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] resize-none"
            />
          </div>

          {/* المتابعة */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresFollowup}
                onChange={e => setRequiresFollowup(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-[var(--color-text-secondary)]">يحتاج متابعة</span>
            </label>
            {requiresFollowup && (
              <input
                type="date"
                value={followupDate}
                onChange={e => setFollowupDate(e.target.value)}
                className="flex-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] disabled:opacity-50 transition-colors"
          >
            {saving ? 'جارٍ الحفظ...' : 'حفظ'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ======================================================
// Call Card
// ======================================================
const contactTypeLabels: Record<string, string> = {
  client: 'عميل', company: 'الشركة', supplier: 'مورد', other: 'أخرى',
};

function CallCard({ call, onMarkDone, onDelete }: {
  call: CallLog;
  onMarkDone: (id: number) => Promise<void>;
  onDelete: (id: number) => void;
}) {
  const isIncoming = call.direction === 'incoming';
  const needsFollowup = call.requires_followup === 1 && call.followup_done === 0;

  return (
    <div className={`flex items-start gap-3 p-4 bg-[var(--color-bg-surface)] border rounded-xl hover:border-[var(--color-brand)]/30 transition-all group ${
      needsFollowup ? 'border-amber-500/40' : 'border-[var(--color-border)]'
    }`}>
      {/* Direction Icon */}
      <div className={`p-2 rounded-lg shrink-0 ${
        isIncoming ? 'bg-green-500/15 text-green-400' : 'bg-blue-500/15 text-blue-400'
      }`}>
        {isIncoming ? <PhoneIncoming size={16} /> : <PhoneOutgoing size={16} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <span className="text-sm font-medium text-[var(--color-text-primary)]">{call.contact_name}</span>
            <span className="mr-2 text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] px-1.5 py-0.5 rounded">
              {contactTypeLabels[call.contact_type] ?? call.contact_type}
            </span>
          </div>
          <span className="text-xs text-[var(--color-text-muted)] font-mono shrink-0">
            {format(new Date(call.created_at), 'h:mm a', { locale: ar })}
          </span>
        </div>

        <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{call.subject}</p>

        {call.summary && (
          <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-1.5">{call.summary}</p>
        )}

        {/* Follow-up indicator */}
        {call.requires_followup === 1 && (
          <div className={`flex items-center gap-1.5 text-xs mt-1 ${
            call.followup_done === 1 ? 'text-green-400' : 'text-amber-400'
          }`}>
            {call.followup_done === 1 ? (
              <><CheckCircle size={12} /> تمت المتابعة</>
            ) : (
              <>
                <Bell size={12} />
                متابعة{call.followup_date ? `: ${format(new Date(call.followup_date), 'd MMM', { locale: ar })}` : ''}
              </>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {needsFollowup && (
          <button
            onClick={() => onMarkDone(call.id)}
            className="p-1.5 rounded-md text-amber-400 hover:bg-[var(--color-bg-hover)] transition-colors"
            title="تم المتابعة"
          >
            <CheckCircle size={14} />
          </button>
        )}
        <button
          onClick={() => onDelete(call.id)}
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
export function CallLog() {
  const [search, setSearch] = useState('');
  const [contactTypeFilter, setContactTypeFilter] = useState('');
  const [directionFilter, setDirectionFilter] = useState('');
  const [followupOnly, setFollowupOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { calls, loading, create, markDone, remove } = useCalls();

  // فلترة محلية
  const filteredCalls = calls.filter(c => {
    if (search && !c.contact_name.includes(search) && !c.subject.includes(search)) return false;
    if (contactTypeFilter && c.contact_type !== contactTypeFilter) return false;
    if (directionFilter && c.direction !== directionFilter) return false;
    if (followupOnly && !(c.requires_followup === 1 && c.followup_done === 0)) return false;
    return true;
  });

  // تجميع حسب التاريخ
  const grouped = filteredCalls.reduce((acc, call) => {
    const date = call.created_at.split(' ')[0] || call.created_at.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(call);
    return acc;
  }, {} as Record<string, CallLog[]>);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const handleCreate = async (input: CreateCallLogInput) => {
    await create(input);
    toast.success('تم تسجيل الاتصال');
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await remove(deleteId);
    toast.success('تم حذف السجل');
    setDeleteId(null);
  };

  const formatDateLabel = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'EEEE، d MMMM yyyy', { locale: ar });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden pr-[240px]">
      <div className="p-6 pb-4">
        <PageHeader
          title="سجل الاتصالات"
          description="سجل جميع المكالمات الواردة والصادرة"
          icon={<Phone size={20} />}
          action={
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors"
            >
              <Plus size={16} />
              تسجيل اتصال
            </button>
          }
        />

        {/* Filters */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="بحث بالاسم أو الموضوع..."
            className="flex-1 max-w-xs"
          />
          <select
            value={contactTypeFilter}
            onChange={e => setContactTypeFilter(e.target.value)}
            className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none"
          >
            <option value="">كل الأنواع</option>
            <option value="client">عميل</option>
            <option value="company">الشركة</option>
            <option value="supplier">مورد</option>
            <option value="other">أخرى</option>
          </select>
          <select
            value={directionFilter}
            onChange={e => setDirectionFilter(e.target.value)}
            className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none"
          >
            <option value="">كل الاتجاهات</option>
            <option value="incoming">وارد</option>
            <option value="outgoing">صادر</option>
          </select>
          <button
            onClick={() => setFollowupOnly(!followupOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors ${
              followupOnly
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-[var(--color-bg-elevated)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-amber-500/40'
            }`}
          >
            <Bell size={14} />
            تحتاج متابعة
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-[var(--color-bg-surface)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredCalls.length === 0 ? (
          <EmptyState
            icon={<Phone size={48} />}
            title={followupOnly ? 'لا توجد اتصالات تحتاج متابعة' : 'لا توجد اتصالات مسجلة'}
            description={followupOnly ? 'رائع! لا توجد متابعات معلقة' : 'ابدأ بتسجيل اتصالاتك لمتابعتها لاحقاً'}
            actionLabel={followupOnly ? undefined : 'تسجيل اتصال'}
            onAction={followupOnly ? undefined : () => setShowForm(true)}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {sortedDates.map(date => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                    {formatDateLabel(date)}
                  </span>
                  <div className="flex-1 h-px bg-[var(--color-border)]" />
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {grouped[date].length} اتصال
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {grouped[date].map(call => (
                    <CallCard
                      key={call.id}
                      call={call}
                      onMarkDone={async (id) => {
                        await markDone(id);
                        toast.success('تم تسجيل المتابعة');
                      }}
                      onDelete={(id) => setDeleteId(id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <CallForm
            open={showForm}
            onClose={() => setShowForm(false)}
            onSave={handleCreate}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={open => { if (!open) setDeleteId(null); }}
        title="حذف السجل"
        description="هل أنت متأكد من حذف هذا السجل؟"
        confirmLabel="حذف"
        onConfirm={handleDelete}
      />
    </div>
  );
}
