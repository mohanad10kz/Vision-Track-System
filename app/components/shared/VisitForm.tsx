import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Hammer, Wrench, MapPin, RefreshCw, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTechGroups } from '@/app/hooks/use-tech-groups';
import { useConveyor } from '@/app/hooks/use-conveyor';
import type { Visit, VisitType, CreateVisitInput, UpdateVisitInput } from '@/app/types/visit.types';
import type { Technician } from '@/app/types/technician.types';
import { toast } from 'sonner';

interface VisitFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: CreateVisitInput | UpdateVisitInput) => Promise<void>;
  technicians: Technician[];
  clients: { id: number; name: string; phone: string; address: string | null }[];
  initial?: Visit;
}

const visitSchema = z.object({
  visit_type: z.enum(['installation', 'maintenance', 'survey', 'followup']),
  client_search: z.string().optional(),
  client_name: z.string().min(2, 'اسم العميل مطلوب'),
  client_phone: z.string().min(5, 'رقم الهاتف مطلوب'),
  client_address: z.string().optional(),
  technician_id: z.number().min(1, 'الفني مطلوب'),
  visit_date: z.string().min(1, 'التاريخ مطلوب'),
  visit_time: z.string().optional(),
  notes: z.string().optional(),
});

type VisitFormValues = z.infer<typeof visitSchema>;

export function VisitForm({ open, onClose, onSave, technicians, clients, initial }: VisitFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      visit_type: initial?.visit_type ?? 'installation',
      client_search: initial?.client_name ?? '',
      client_name: initial?.client_name ?? '',
      client_phone: initial?.client_phone ?? '',
      client_address: initial?.client_address ?? '',
      technician_id: initial?.technician_id ?? 0,
      visit_date: initial?.visit_date ?? format(new Date(), 'yyyy-MM-dd'),
      visit_time: initial?.visit_time ?? '',
      notes: initial?.notes ?? '',
    }
  });

  const { groups } = useTechGroups();
  const { getTechQueueByGroup, getSurveysByClientPhone, skipTechnician } = useConveyor('db');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(initial?.client_id ?? null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | ''>('');
  const [queueTechs, setQueueTechs] = useState<Technician[]>([]);
  const [isBasedOnSurvey, setIsBasedOnSurvey] = useState(false);
  const [surveyVisits, setSurveyVisits] = useState<Visit[]>([]);

  const visitType = watch('visit_type');
  const clientSearch = watch('client_search');
  const clientPhone = watch('client_phone');
  const selectedTechId = watch('technician_id');

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

  // جلب الفنيين للمجموعة المحددة مع الترتيب (Round Robin)
  const fetchQueue = async (groupId: number, type: VisitType) => {
    try {
      const queueType = type === 'maintenance' ? 'maintenance' : 'installation';
      const queue = await getTechQueueByGroup({ groupId, queueType }) as Technician[];
      setQueueTechs(queue);
    } catch (err) {
      console.error(err);
      toast.error('فشل في جلب قائمة الفنيين');
    }
  };

  useEffect(() => {
    if (selectedGroupId) {
      fetchQueue(Number(selectedGroupId), visitType);
    } else {
      setQueueTechs([]);
    }
  }, [selectedGroupId, visitType]);

  // جلب المسوحات الميدانية السابقة إذا تم اختيار "مستندة إلى مسح"
  useEffect(() => {
    if (visitType === 'installation' && isBasedOnSurvey && clientPhone) {
      getSurveysByClientPhone({ phone: clientPhone }).then(data => {
        setSurveyVisits(data as Visit[]);
      });
    } else {
      setSurveyVisits([]);
    }
  }, [visitType, isBasedOnSurvey, clientPhone]);

  const handleSkipTech = async (techId: number) => {
    const queueType = visitType === 'maintenance' ? 'maintenance' : 'installation';
    try {
      await skipTechnician({ id: techId, queueType });
      toast.success('تم ترحيل دور الفني لآخر القائمة');
      // إعادة جلب القائمة
      if (selectedGroupId) {
        fetchQueue(Number(selectedGroupId), visitType);
      }
    } catch (err) {
      toast.error('فشل في تحديث الدور');
    }
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
    
    // update queue date for the assigned tech
    if (!initial && tech) {
      const queueType = data.visit_type === 'maintenance' ? 'maintenance' : 'installation';
      await skipTechnician({ id: tech.id, queueType });
    }
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
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
            {initial ? 'تعديل الزيارة' : 'زيارة جديدة'}
          </h2>
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

            {/* مستندة إلى مسح ميداني (فقط للتركيب) */}
            {visitType === 'installation' && (
              <div className="flex flex-col gap-2 p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-elevated)]">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--color-text-primary)]">
                  <input
                    type="checkbox"
                    checked={isBasedOnSurvey}
                    onChange={(e) => setIsBasedOnSurvey(e.target.checked)}
                    className="rounded border-[var(--color-border)] text-[var(--color-brand)] focus:ring-[var(--color-brand)]"
                  />
                  مستندة إلى مسح ميداني سابق
                </label>
                
                {isBasedOnSurvey && (
                  <div className="mt-2">
                    {surveyVisits.length > 0 ? (
                      <select
                        className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
                        onChange={(e) => {
                          const sv = surveyVisits.find(v => v.id === Number(e.target.value));
                          if (sv && sv.technician_id) {
                            setValue('technician_id', sv.technician_id);
                          }
                        }}
                      >
                        <option value="">اختر المسح الميداني...</option>
                        {surveyVisits.map(sv => (
                          <option key={sv.id} value={sv.id}>
                            {sv.visit_date} - الفني: {sv.technician_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-xs text-orange-500">لا توجد مسوحات ميدانية مكتملة لهذا الهاتف.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* الفني - حسب المجموعة ونظام الدور */}
            {(!isBasedOnSurvey || visitType !== 'installation') && (
              <div className="flex flex-col gap-3 p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-elevated)]">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)]">اختيار الفني (بنظام الدور)</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(Number(e.target.value) || '')}
                    className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
                  >
                    <option value="">اختر المجموعة...</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>

                  <select
                    {...register('technician_id', { valueAsNumber: true })}
                    className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)]"
                  >
                    <option value="0">اختر الفني المتاح...</option>
                    {selectedGroupId ? queueTechs.map((t, idx) => (
                      <option key={t.id} value={t.id}>
                        {idx + 1}. {t.name}
                      </option>
                    )) : technicians.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* عرض الدور مع إمكانية التخطي */}
                {selectedGroupId && queueTechs.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {queueTechs.map((t, idx) => (
                      <div key={t.id} className="flex items-center justify-between bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-md px-2 py-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${idx === 0 ? 'bg-[var(--color-brand)] text-white' : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]'}`}>
                            {idx + 1}
                          </span>
                          <span className={selectedTechId === t.id ? 'font-bold text-[var(--color-brand)]' : 'text-[var(--color-text-primary)]'}>{t.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSkipTech(t.id)}
                          className="text-[var(--color-text-muted)] hover:text-orange-500 bg-[var(--color-bg-elevated)] px-2 py-0.5 rounded transition-colors"
                          title="تخطي وترحيل الفني لآخر الطابور"
                        >
                          تخطي
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.technician_id && <p className="text-red-500 text-xs mt-1">{errors.technician_id.message}</p>}
              </div>
            )}

            {/* التاريخ + الوقت */}
            <div className="grid grid-cols-2 gap-3">
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
