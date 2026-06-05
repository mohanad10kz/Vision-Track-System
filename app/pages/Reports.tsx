import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { BarChart3, Wrench, Hammer, HardHat, Users } from 'lucide-react';
import { useConveyor } from '@/app/hooks/use-conveyor';
import { useTechGroups } from '@/app/hooks/use-tech-groups';

interface TechnicianStat {
  id: number;
  name: string;
  group_id: number | null;
  group_name: string | null;
  installations: number;
  maintenance: number;
  surveys: number;
  total: number;
}

export function Reports() {
  const dbApi = useConveyor('db');
  const { groups, isLoading: groupsLoading } = useTechGroups();
  const [techStats, setTechStats] = useState<TechnicianStat[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await dbApi.getTechnicianStats() as TechnicianStat[];
      setTechStats(data);
    } catch (err) {
      console.error('Failed to load technician stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Calculate top performers
  const topInstallations = [...techStats].sort((a, b) => b.installations - a.installations)[0];
  const topMaintenance = [...techStats].sort((a, b) => b.maintenance - a.maintenance)[0];
  const topActive = [...techStats].sort((a, b) => b.total - a.total)[0];

  const topInstallTechName = topInstallations && topInstallations.installations > 0 ? topInstallations.name : 'لا يوجد حالياً';
  const topInstallCount = topInstallations ? topInstallations.installations : 0;

  const topMaintTechName = topMaintenance && topMaintenance.maintenance > 0 ? topMaintenance.name : 'لا يوجد حالياً';
  const topMaintCount = topMaintenance ? topMaintenance.maintenance : 0;

  const topActiveTechName = topActive && topActive.total > 0 ? topActive.name : 'لا يوجد حالياً';
  const topActiveCount = topActive ? topActive.total : 0;

  // Group technicians by group
  const groupedStats = groups.map(group => {
    const techsInGroup = techStats.filter(stat => stat.group_id === group.id);
    return {
      ...group,
      techs: techsInGroup
    };
  });

  // Technicians without group
  const unassignedTechs = techStats.filter(stat => stat.group_id === null || stat.group_id === undefined);

  const isPageLoading = loading || groupsLoading;

  return (
    <div className="flex flex-col h-full overflow-hidden pr-[240px]">
      <div className="p-6 pb-4">
        <PageHeader
          title="التقارير والإحصائيات"
          description="إحصائيات الفنيين الحية وتوزيع مجموعات العمل"
          icon={<BarChart3 size={20} />}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {isPageLoading ? (
          <div className="flex items-center justify-center h-40">
            <span className="text-[var(--color-text-muted)]">جاري تحميل البيانات الإحصائية...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* Top Performers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Most Installations */}
              <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">الأكثر تركيباً</span>
                  <span className="text-base font-bold text-[var(--color-text-primary)]">{topInstallTechName}</span>
                  <span className="text-xs text-blue-500 font-mono font-medium flex items-center gap-1">
                    <Hammer size={12} />
                    {topInstallCount} عملية تركيب مكتملة
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Hammer size={22} />
                </div>
              </div>

              {/* Most Maintenance */}
              <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">الأكثر صيانة</span>
                  <span className="text-base font-bold text-[var(--color-text-primary)]">{topMaintTechName}</span>
                  <span className="text-xs text-orange-500 font-mono font-medium flex items-center gap-1">
                    <Wrench size={12} />
                    {topMaintCount} عملية صيانة مكتملة
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                  <Wrench size={22} />
                </div>
              </div>

              {/* Most Active Overall */}
              <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">الفني الأكثر نشاطاً</span>
                  <span className="text-base font-bold text-[var(--color-text-primary)]">{topActiveTechName}</span>
                  <span className="text-xs text-[var(--color-brand)] font-mono font-medium flex items-center gap-1">
                    <HardHat size={12} />
                    {topActiveCount} إجمالي زيارات منجزة
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center text-[var(--color-brand)] shrink-0">
                  <HardHat size={22} />
                </div>
              </div>
            </div>

            {/* Split View: Grouping on right/left, General leaderboard on other */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Work Groups */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                  <Users size={16} className="text-[var(--color-brand)]" />
                  مجموعات العمل وتوزيع الفنيين
                </h3>

                <div className="space-y-4">
                  {groupedStats.map(group => (
                    <div key={group.id} className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-[var(--color-text-primary)]">{group.name}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                          {group.techs.length} فنيين
                        </span>
                      </div>
                      
                      {group.techs.length > 0 ? (
                        <div className="space-y-3">
                          {group.techs.map(tech => (
                            <div key={tech.id} className="flex justify-between items-center text-xs py-2 border-b border-[var(--color-border)]/40 last:border-0">
                              <span className="font-medium text-[var(--color-text-primary)]">{tech.name}</span>
                              <div className="flex items-center gap-4 font-mono text-[var(--color-text-secondary)]">
                                <span className="text-blue-500" title="تركيبات">{tech.installations} تركيب</span>
                                <span className="text-orange-500" title="صيانات">{tech.maintenance} صيانة</span>
                                <span className="text-purple-500" title="مسح ميداني">{tech.surveys} مسح</span>
                                <span className="font-bold text-[var(--color-text-primary)]" title="الإجمالي">{tech.total} كلي</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--color-text-muted)] block text-center py-2">لا يوجد فنيين مسجلين في هذه المجموعة حالياً</span>
                      )}
                    </div>
                  ))}

                  {/* Unassigned Technicians */}
                  {unassignedTechs.length > 0 && (
                    <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm border-dashed">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-[var(--color-text-muted)]">فنيين خارج المجموعات</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                          {unassignedTechs.length} فنيين
                        </span>
                      </div>
                      <div className="space-y-3">
                        {unassignedTechs.map(tech => (
                          <div key={tech.id} className="flex justify-between items-center text-xs py-2 border-b border-[var(--color-border)]/40 last:border-0">
                            <span className="font-medium text-[var(--color-text-primary)]">{tech.name}</span>
                            <div className="flex items-center gap-4 font-mono text-[var(--color-text-secondary)]">
                              <span className="text-blue-500" title="تركيبات">{tech.installations} تركيب</span>
                              <span className="text-orange-500" title="صيانات">{tech.maintenance} صيانة</span>
                              <span className="text-purple-500" title="مسح ميداني">{tech.surveys} مسح</span>
                              <span className="font-bold text-[var(--color-text-primary)]" title="الإجمالي">{tech.total} كلي</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Leaderboard / General Stats */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                  <HardHat size={16} className="text-[var(--color-brand)]" />
                  جدول الترتيب العام للأداء (الزيارات المكتملة)
                </h3>

                <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                      <thead>
                        <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)]">
                          <th className="py-3 px-3 font-medium">الفني</th>
                          <th className="py-3 px-3 font-medium text-center">تركيبات</th>
                          <th className="py-3 px-3 font-medium text-center">صيانات</th>
                          <th className="py-3 px-3 font-medium text-center">مسح</th>
                          <th className="py-3 px-3 font-medium text-center font-bold text-[var(--color-text-primary)]">الإجمالي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)]/60">
                        {techStats.map((stat, idx) => (
                          <tr key={stat.id} className="hover:bg-[var(--color-bg-elevated)] transition-colors">
                            <td className="py-3 px-3 flex items-center gap-2.5">
                              <div className="w-6 h-6 rounded-full bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)] flex items-center justify-center text-xs font-bold font-mono">
                                {idx + 1}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-[var(--color-text-primary)]">{stat.name}</span>
                                {stat.group_name && (
                                  <span className="text-[10px] text-[var(--color-text-muted)]">{stat.group_name}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center font-mono text-blue-500 font-medium">
                              {stat.installations}
                            </td>
                            <td className="py-3 px-3 text-center font-mono text-orange-500 font-medium">
                              {stat.maintenance}
                            </td>
                            <td className="py-3 px-3 text-center font-mono text-purple-500 font-medium">
                              {stat.surveys}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-[var(--color-brand)] font-mono">
                              {stat.total}
                            </td>
                          </tr>
                        ))}
                        {techStats.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-[var(--color-text-muted)]">
                              لا توجد إحصائيات فنيين لعرضها حالياً
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
