import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, subDays, subMonths, startOfWeek } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ArrowRight, Archive, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { SearchInput } from '@/app/components/shared/SearchInput';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { useConveyor } from '@/app/hooks/use-conveyor';
import type { Note } from '@/app/types';

type DateFilter = 'week' | 'month' | '3months' | 'all';

export function NoteArchive() {
  const navigate = useNavigate();
  const { getArchivedNotes } = useConveyor('db');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [search, setSearch] = useState('');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const getDateRange = (filter: DateFilter) => {
    const now = new Date();
    switch (filter) {
      case 'week':    return { from: format(startOfWeek(now, { weekStartsOn: 6 }), 'yyyy-MM-dd'), to: '' };
      case 'month':   return { from: format(subDays(now, 30), 'yyyy-MM-dd'), to: '' };
      case '3months': return { from: format(subMonths(now, 3), 'yyyy-MM-dd'), to: '' };
      case 'all':     return { from: '', to: '' };
    }
  };

  const load = async () => {
    setLoading(true);
    const range = (dateFilter === 'all' && customFrom)
      ? { from: customFrom, to: customTo }
      : getDateRange(dateFilter);
    const data = await getArchivedNotes({ ...range, search });
    setNotes(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [dateFilter, search, customFrom, customTo]);

  const filterButtons: { key: DateFilter; label: string }[] = [
    { key: 'week',    label: 'هذا الأسبوع' },
    { key: 'month',   label: 'هذا الشهر'   },
    { key: '3months', label: '3 أشهر'       },
    { key: 'all',     label: 'كل الوقت'    },
  ];

  return (
    <div className="flex flex-col h-full p-6 pr-[256px] gap-4 overflow-hidden">
      <PageHeader
        title="أرشيف الملاحظات"
        description="الملاحظات المكتملة المؤرشفة"
        icon={<Archive size={20} />}
        action={
          <button
            onClick={() => navigate('/notes')}
            className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ArrowRight size={16} />
            العودة للملاحظات
          </button>
        }
      />

      {/* فلاتر التاريخ */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterButtons.map(btn => (
          <button
            key={btn.key}
            onClick={() => setDateFilter(btn.key)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              dateFilter === btn.key
                ? 'bg-[var(--color-brand)] text-white'
                : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] border border-[var(--color-border)]'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* date range + بحث */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <span>من</span>
          <input
            type="date"
            value={customFrom}
            onChange={e => { setCustomFrom(e.target.value); setDateFilter('all'); }}
            className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-md px-2 py-1 text-sm text-[var(--color-text-primary)]"
          />
          <span>إلى</span>
          <input
            type="date"
            value={customTo}
            onChange={e => { setCustomTo(e.target.value); setDateFilter('all'); }}
            className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-md px-2 py-1 text-sm text-[var(--color-text-primary)]"
          />
        </div>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="بحث بعنوان الملاحظة..."
          className="flex-1 max-w-xs"
        />
      </div>

      {/* العدد */}
      {!loading && (
        <p className="text-sm text-[var(--color-text-muted)]">
          {notes.length} ملاحظة مؤرشفة
        </p>
      )}

      {/* القائمة */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-[var(--color-bg-surface)] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <EmptyState
            icon={<Archive size={40} />}
            title="لا توجد ملاحظات مؤرشفة"
            description="الملاحظات المكتملة ستظهر هنا بعد 7 أيام من اكتمالها"
          />
        ) : (
          <div className="flex flex-col gap-2">
            {notes.map(note => (
              <div
                key={note.id}
                className="flex items-start gap-3 p-4 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-brand)]/30 transition-colors"
              >
                {/* نقطة اللون */}
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                  style={{ backgroundColor: note.color }}
                />
                <CheckCircle2 size={18} className="text-green-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] line-clamp-1">
                    {note.title}
                  </p>
                  {note.content && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-1">
                      {note.content}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--color-text-muted)] font-mono">
                    <span>
                      أُنشئت: {format(new Date(note.created_at), 'd MMM yyyy', { locale: ar })}
                    </span>
                    <span>·</span>
                    <span>
                      أُنجزت: {format(new Date(note.updated_at), 'd MMM yyyy', { locale: ar })}
                    </span>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 shrink-0">
                  مكتملة
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
