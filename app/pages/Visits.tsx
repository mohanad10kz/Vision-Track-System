import React, { useState } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MapPin, Clock, User, MoreVertical,
  Hammer, Wrench, RefreshCw, CalendarDays, CheckCircle,
  XCircle, Pause, ChevronDown, Trash2, Edit2
} from 'lucide-react';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { SearchInput } from '@/app/components/shared/SearchInput';
import { VisitTypeBadge } from '@/app/components/shared/VisitTypeBadge';
import { StatusBadge } from '@/app/components/shared/StatusBadge';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { ConfirmDialog } from '@/app/components/shared/ConfirmDialog';
import { useVisits } from '@/app/hooks/use-visits';
import { useClients } from '@/app/hooks/use-clients';
import { useTechnicians } from '@/app/hooks/use-technicians';
import type { Visit, VisitType, VisitStatus, CreateVisitInput } from '@/app/types/visit.types';
import type { Technician } from '@/app/types/technician.types';
import { toast } from 'sonner';

// ======================================================
// Visit Form Modal
// ======================================================
interface VisitFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: CreateVisitInput) => Promise<void>;
  technicians: Technician[];
  clients: ReturnType<typeof useClients>['clients'];
}

function VisitForm({ open, onClose, onSave, technicians, clients }: VisitFormProps) {
  const [visitType, setVisitType] = useState<VisitType>('installation');
  const [clientSearch, setClientSearch] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedTechId, setSelectedTechId] = useState('');
  const [visitDate, setVisitDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [visitTime, setVisitTime] = useState('');
  const [notes, setNotes] = useState('');
  // Maintenance fields
  const [problemType, setProblemType] = useState('');
  const [problemDesc, setProblemDesc] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  // Installation / Survey fields
  const [cameraCount, setCameraCount] = useState('');
  const [systemType, setSystemType] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredClients = clients.filter(c =>
    clientSearch ? (c.name.includes(clientSearch) || c.phone.includes(clientSearch)) : true
  ).slice(0, 6);

  const selectClient = (c: typeof clients[0]) => {
    setSelectedClientId(c.id);
    setClientName(c.name);
    setClientPhone(c.phone);
    setClientAddress(c.address ?? '');
    setClientSearch(c.name);
    setShowClientDropdown(false);
  };

  const handleSave = async () => {
    if (!clientName || !clientPhone || !visitDate || !selectedTechId) {
      toast.error('يرجى ملء الحقول المطلوبة');
      return;
    }
    if (visitType === 'maintenance' && !problemType) {
      toast.error('يرجى تحديد نوع المشكلة');
      return;
    }
    setSaving(true);
    const tech = technicians.find(t => t.id === Number(selectedTechId));
    await onSave({
      client_id: selectedClientId,
      client_name: clientName,
      client_phone: clientPhone,
      client_address: clientAddress || null,
      visit_type: visitType,
      visit_date: visitDate,
      visit_time: visitTime || null,
      technician_id: Number(selectedTechId),
      technician_name: tech?.name ?? null,
      status: 'scheduled',
      problem_type: visitType === 'maintenance' ? problemType : null,
      problem_desc: visitType === 'maintenance' ? problemDesc : null,
      camera_count: (visitType === 'installation' || visitType === 'survey') && cameraCount ? Number(cameraCount) : null,
      system_type: (visitType === 'installation' || visitType === 'survey') && systemType ? systemType : null,
      priority: visitType === 'maintenance' ? priority : 'medium',
      notes: notes || null,
    });
    setSaving(false);
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
                    onClick={() => setVisitType(opt.value)}
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
              value={clientSearch}
              onChange={e => { setClientSearch(e.target.value); setClientName(e.target.value); setShowClientDropdown(true); setSelectedClientId(null); }}
              onFocus={() => setShowClientDropdown(true)}
              placeholder="ابحث عن عميل أو اكتب اسماً جديداً..."
              className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)]"
            />
            {showClientDropdown && filteredClients.length > 0 && (
              <div className="absolute z-50 top-full mt-1 w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden">
                {filteredClients.map(c => (
                  <button
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
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="اسم العميل"
                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">رقم الهاتف *</label>
              <input
                type="text"
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
                placeholder="09XX-XXX-XXX"
                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] font-mono"
                dir="ltr"
              />
            </div>
          </div>

          {/* العنوان */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">العنوان</label>
            <input
              type="text"
              value={clientAddress}
              onChange={e => setClientAddress(e.target.value)}
              placeholder="الحي، الشارع..."
              className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)]"
            />
          </div>

          {/* الفني + التاريخ + الوقت */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">الفني *</label>
              <select
                value={selectedTechId}
                onChange={e => setSelectedTechId(e.target.value)}
                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
              >
                <option value="">اختر...</option>
                {technicians.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">التاريخ *</label>
              <input
                type="date"
                value={visitDate}
                onChange={e => setVisitDate(e.target.value)}
                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">الوقت</label>
              <input
                type="time"
                value={visitTime}
                onChange={e => setVisitTime(e.target.value)}
                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
              />
            </div>
          </div>

          {/* حقول خاصة بالصيانة */}
          <AnimatePresence>
            {visitType === 'maintenance' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-col gap-3 overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">نوع المشكلة *</label>
                    <select
                      value={problemType}
                      onChange={e => setProblemType(e.target.value)}
                      className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
                    >
                      <option value="">اختر...</option>
                      <option value="camera">كاميرا</option>
                      <option value="dvr">DVR/NVR</option>
                      <option value="cables">أسلاك</option>
                      <option value="power">طاقة</option>
                      <option value="programming">برمجة</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">الأولوية *</label>
                    <select
                      value={priority}
                      onChange={e => setPriority(e.target.value as typeof priority)}
                      className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
                    >
                      <option value="low">منخفضة</option>
                      <option value="medium">متوسطة</option>
                      <option value="high">عالية</option>
                      <option value="urgent">عاجلة</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">وصف المشكلة</label>
                  <textarea
                    value={problemDesc}
                    onChange={e => setProblemDesc(e.target.value)}
                    rows={2}
                    placeholder="وصف مختصر للمشكلة..."
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* حقول التركيب والمسح */}
            {(visitType === 'installation' || visitType === 'survey') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-2 gap-3 overflow-hidden"
              >
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                    {visitType === 'survey' ? 'عدد الكاميرات المقدّر' : 'عدد الكاميرات'}
                  </label>
                  <input
                    type="number"
                    value={cameraCount}
                    onChange={e => setCameraCount(e.target.value)}
                    min="1"
                    placeholder="0"
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                    {visitType === 'survey' ? 'نوع النظام المقترح' : 'نوع النظام'}
                  </label>
                  <select
                    value={systemType}
                    onChange={e => setSystemType(e.target.value)}
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
                  >
                    <option value="">اختر...</option>
                    <option value="DVR">DVR</option>
                    <option value="NVR">NVR</option>
                    <option value="IP">IP</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ملاحظات */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">ملاحظات</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="ملاحظات إضافية..."
              className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] disabled:opacity-50 transition-colors"
          >
            {saving ? 'جارٍ الحفظ...' : 'حفظ الزيارة'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ======================================================
// Visit Card
// ======================================================
interface VisitCardProps {
  visit: Visit;
  onChangeStatus: (id: number, status: VisitStatus, notes?: string) => Promise<void>;
  onDelete: (id: number) => void;
}

function VisitCard({ visit, onChangeStatus, onDelete }: VisitCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showResolution, setShowResolution] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleStatusChange = async (status: VisitStatus) => {
    if (status === 'completed') {
      setShowResolution(true);
      setShowMenu(false);
      return;
    }
    await onChangeStatus(visit.id, status);
    setShowMenu(false);
  };

  const handleCompleteWithNotes = async () => {
    await onChangeStatus(visit.id, 'completed', resolutionNotes);
    setShowResolution(false);
    setResolutionNotes('');
  };

  const problemTypeLabels: Record<string, string> = {
    camera: 'كاميرا', dvr: 'DVR/NVR', cables: 'أسلاك',
    power: 'طاقة', programming: 'برمجة', other: 'أخرى',
  };

  return (
    <div className="relative bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-4 hover:border-[var(--color-brand)]/40 transition-all">
      {showResolution && (
        <div className="absolute inset-0 z-10 bg-[var(--color-bg-surface)] rounded-xl p-4 flex flex-col gap-3">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">ما تم تنفيذه (اختياري)</p>
          <textarea
            value={resolutionNotes}
            onChange={e => setResolutionNotes(e.target.value)}
            rows={3}
            placeholder="وصف ما تم إنجازه في هذه الزيارة..."
            className="flex-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] resize-none"
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowResolution(false)}
              className="px-3 py-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              إلغاء
            </button>
            <button
              onClick={handleCompleteWithNotes}
              className="px-4 py-1.5 text-sm font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              تأكيد الإتمام
            </button>
          </div>
        </div>
      )}

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
              {visit.client_name}
            </span>
            {visit.visit_type === 'maintenance' && visit.priority && visit.priority !== 'medium' && (
              <StatusBadge status={visit.priority} size="sm" />
            )}
          </div>

          <div className="text-xs text-[var(--color-text-muted)] mb-1.5 flex items-center gap-3 flex-wrap">
            {/* معلومات حسب النوع */}
            {visit.visit_type === 'installation' && visit.camera_count && (
              <span>{visit.camera_count} كاميرا {visit.system_type ? `— ${visit.system_type}` : ''}</span>
            )}
            {visit.visit_type === 'maintenance' && visit.problem_type && (
              <span className="text-amber-400">{problemTypeLabels[visit.problem_type] ?? visit.problem_type}</span>
            )}
            {visit.visit_type === 'survey' && visit.camera_count && (
              <span>تقدير {visit.camera_count} كاميرا {visit.system_type ? `— ${visit.system_type}` : ''}</span>
            )}
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
                  {visit.status !== 'postponed' && (
                    <button onClick={() => handleStatusChange('postponed')} className="w-full text-right px-3 py-1.5 text-xs text-orange-400 hover:bg-[var(--color-bg-hover)] rounded flex items-center gap-2">
                      <Pause size={12} /> مؤجلة
                    </button>
                  )}
                  {visit.status !== 'cancelled' && (
                    <button onClick={() => handleStatusChange('cancelled')} className="w-full text-right px-3 py-1.5 text-xs text-red-400 hover:bg-[var(--color-bg-hover)] rounded flex items-center gap-2">
                      <XCircle size={12} /> ملغاة
                    </button>
                  )}
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
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { visits, loading, today, tomorrow, upcoming, past, create, remove, changeStatus } = useVisits(
    activeTab === 'all' ? undefined : activeTab as VisitType
  );
  const { clients } = useClients();
  const { technicians } = useTechnicians();

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

  const handleCreate = async (input: CreateVisitInput) => {
    await create(input);
    toast.success('تمت إضافة الزيارة بنجاح');
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    await remove(id);
    toast.success('تم حذف الزيارة');
    setDeleteId(null);
  };

  const todayLabel = format(new Date(), 'EEEE d MMMM', { locale: ar });
  const tomorrowLabel = format(new Date(Date.now() + 86400000), 'EEEE d MMMM', { locale: ar });

  const renderGroup = (label: string, items: Visit[]) => {
    const filtered = filteredVisits(items);
    if (filtered.length === 0) return null;
    return (
      <div key={label} className="mb-6">
        <GroupHeader label={label} count={filtered.length} />
        <div className="flex flex-col gap-3">
          {filtered.map(v => (
            <VisitCard
              key={v.id}
              visit={v}
              onChangeStatus={changeStatus}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden pr-[240px]">
      {/* Header */}
      <div className="p-6 pb-0">
        <PageHeader
          title="الزيارات الميدانية"
          description="جميع الزيارات المجدولة والمكتملة"
          icon={<CalendarDays size={20} />}
          action={
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors"
            >
              <Plus size={16} />
              زيارة جديدة
            </button>
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
      <div className="flex-1 overflow-y-auto px-6 pb-6">
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
            onAction={() => setShowForm(true)}
          />
        ) : (
          <>
            {renderGroup(`اليوم — ${todayLabel}`, today)}
            {renderGroup(`الغد — ${tomorrowLabel}`, tomorrow)}
            {renderGroup('لاحقاً', upcoming)}
            {renderGroup('السابقة', past)}
          </>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <VisitForm
            open={showForm}
            onClose={() => setShowForm(false)}
            onSave={handleCreate}
            technicians={technicians}
            clients={clients}
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
