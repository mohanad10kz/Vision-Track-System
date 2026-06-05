import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, subDays, subMonths, startOfWeek } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ArrowRight, Archive, CheckCircle2, MapPin } from 'lucide-react';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { SearchInput } from '@/app/components/shared/SearchInput';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { useConveyor } from '@/app/hooks/use-conveyor';
import type { Visit } from '@/app/types';

type DateFilter = 'week' | 'month' | '3months' | 'all';

export function VisitArchive() {
  const navigate = useNavigate();
  const { getArchivedVisits } = useConveyor('db');
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [search, setSearch] = useState('');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 10;

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
    const response = await getArchivedVisits({ ...range, search, page, limit: LIMIT });
    setVisits(response?.data || (Array.isArray(response) ? response : []));
    setTotal(response?.totalCount || (Array.isArray(response) ? response.length : 0));
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
  }, [dateFilter, search, customFrom, customTo]);

  useEffect(() => {
    load();
  }, [dateFilter, search, customFrom, customTo, page]);

  const filterButtons: { key: DateFilter; label: string }[] = [
    { key: 'week',    label: 'هذا الأسبوع' },
    { key: 'month',   label: 'هذا الشهر'   },
    { key: '3months', label: '3 أشهر'       },
    { key: 'all',     label: 'كل الوقت'    },
  ];

  return (
    <div className="flex flex-col h-full p-6 pr-[256px] gap-4 overflow-hidden">
      <PageHeader
        title="أرشيف الزيارات"
        description="الزيارات المكتملة المؤرشفة"
        icon={<Archive size={20} />}
        action={
          <button
            onClick={() => navigate('/visits')}
            className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ArrowRight size={16} />
            العودة للزيارات
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
          placeholder="بحث باسم العميل أو الهاتف..."
          className="flex-1 max-w-xs"
        />
      </div>

      {/* العدد */}
      {!loading && (
        <p className="text-sm text-[var(--color-text-muted)]">
          {total} زيارة مؤرشفة
        </p>
      )}

      {/* القائمة */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-[var(--color-bg-surface)] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : visits.length === 0 ? (
          <EmptyState
            icon={<Archive size={40} />}
            title="لا توجد زيارات مؤرشفة"
            description="الزيارات المكتملة ستظهر هنا بعد 7 أيام من اكتمالها"
          />
        ) : (
          <div className="flex flex-col gap-2">
            {visits.map(visit => (
              <div
                key={visit.id}
                className="flex items-start gap-3 p-4 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-brand)]/30 transition-colors"
              >
                <CheckCircle2 size={18} className="text-green-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] line-clamp-1">
                      {visit.client_name} - <span className="font-mono text-xs">{visit.client_phone}</span>
                    </p>
                  </div>
                  {visit.resolution_notes && (
                    <p className="text-xs text-[var(--color-text-muted)] mb-1 line-clamp-1">
                      {visit.resolution_notes}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-text-muted)] font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {visit.client_address || 'بدون عنوان'}
                    </span>
                    <span>·</span>
                    <span>
                      تاريخ الزيارة: {format(new Date(visit.visit_date), 'd MMM yyyy', { locale: ar })}
                    </span>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 shrink-0">
                  مكتملة
                </span>
              </div>
            ))}
            
            {/* Pagination Controls */}
            {total > LIMIT && (
              <div className="flex items-center justify-center gap-2 py-4 mt-2 border-t border-[var(--color-border)]">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 text-sm bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded hover:bg-[var(--color-bg-hover)] disabled:opacity-50"
                >
                  السابق
                </button>
                <span className="text-sm text-[var(--color-text-muted)]">
                  صفحة {page} من {Math.ceil(total / LIMIT)}
                </span>
                <button
                  disabled={page >= Math.ceil(total / LIMIT)}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 text-sm bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded hover:bg-[var(--color-bg-hover)] disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
