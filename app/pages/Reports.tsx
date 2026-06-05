import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { BarChart3, Wrench, Hammer, MapPin, HardHat } from 'lucide-react';
import { useTechnicians } from '@/app/hooks/use-technicians';
import { useVisits } from '@/app/hooks/use-visits';
import type { Technician } from '@/app/types/technician.types';

export function Reports() {
  const { technicians, loading: techLoading } = useTechnicians();
  const { visits, loading: visitsLoading } = useVisits();
  
  const [techStats, setTechStats] = useState<{
    tech: Technician;
    installations: number;
    maintenance: number;
    surveys: number;
    total: number;
  }[]>([]);

  useEffect(() => {
    if (techLoading || visitsLoading) return;

    // Filter for completed visits only
    const completedVisits = visits.filter(v => v.status === 'completed');

    const stats = technicians.map(tech => {
      const techVisits = completedVisits.filter(v => v.technician_id === tech.id);
      const installations = techVisits.filter(v => v.visit_type === 'installation').length;
      const maintenance = techVisits.filter(v => v.visit_type === 'maintenance').length;
      const surveys = techVisits.filter(v => v.visit_type === 'survey').length;
      
      return {
        tech,
        installations,
        maintenance,
        surveys,
        total: installations + maintenance + surveys
      };
    }).sort((a, b) => b.total - a.total); // Sort by total descending

    setTechStats(stats);
  }, [technicians, visits, techLoading, visitsLoading]);

  return (
    <div className="flex flex-col h-full overflow-hidden pr-[240px]">
      <div className="p-6 pb-4">
        <PageHeader
          title="التقارير والإحصائيات"
          description="إحصائيات الفنيين وأداء فريق العمل"
          icon={<BarChart3 size={20} />}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {techLoading || visitsLoading ? (
          <div className="flex items-center justify-center h-40">
            <span className="text-[var(--color-text-muted)]">جاري تحميل البيانات...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <HardHat size={16} className="text-[var(--color-brand)]" />
                إحصائيات إنجاز الفنيين (الزيارات المكتملة)
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)]">
                      <th className="py-3 px-4 font-medium">الفني</th>
                      <th className="py-3 px-4 font-medium text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Hammer size={14} className="text-blue-500" />
                          تركيبات
                        </div>
                      </th>
                      <th className="py-3 px-4 font-medium text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Wrench size={14} className="text-orange-500" />
                          صيانات
                        </div>
                      </th>
                      <th className="py-3 px-4 font-medium text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <MapPin size={14} className="text-purple-500" />
                          مسح ميداني
                        </div>
                      </th>
                      <th className="py-3 px-4 font-medium text-center">إجمالي الإنجاز</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {techStats.map((stat, idx) => (
                      <tr key={stat.tech.id} className="hover:bg-[var(--color-bg-elevated)] transition-colors">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </div>
                          <span className="font-medium text-[var(--color-text-primary)]">{stat.tech.name}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-blue-600 dark:text-blue-400">
                          {stat.installations}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-orange-600 dark:text-orange-400">
                          {stat.maintenance}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-purple-600 dark:text-purple-400">
                          {stat.surveys}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-[var(--color-brand)]">
                          {stat.total}
                        </td>
                      </tr>
                    ))}
                    {techStats.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-[var(--color-text-muted)]">
                          لا توجد إحصائيات لعرضها حالياً
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
