import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  LayoutDashboard, MapPin, Wrench, AlertCircle, PhoneCall,
  CheckCircle, Users, Activity
} from 'lucide-react';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { useDashboard } from '@/app/hooks/use-dashboard';
import { VisitTypeBadge } from '@/app/components/shared/VisitTypeBadge';

export function Dashboard() {
  const { data, loading } = useDashboard();

  if (loading || !data) {
    return (
      <div className="flex flex-col h-full overflow-hidden pr-[240px]">
        <div className="p-6 pb-4">
          <PageHeader title="لوحة التحكم" icon={<LayoutDashboard size={20} />} />
        </div>
        <div className="p-6 grid gap-6">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-[var(--color-bg-surface)] rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6 h-64">
            <div className="bg-[var(--color-bg-surface)] rounded-xl animate-pulse" />
            <div className="bg-[var(--color-bg-surface)] rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const currentDate = format(new Date(), 'EEEE، d MMMM yyyy', { locale: ar });

  const visitTypeColors: Record<string, string> = {
    installation: 'var(--color-installation, #8B5CF6)',
    maintenance: 'var(--color-maintenance, #F59E0B)',
    survey: 'var(--color-survey, #06B6D4)',
    followup: 'var(--color-followup, #6B7280)',
  };

  return (
    <div className="flex flex-col h-full overflow-hidden pr-[240px]">
      <div className="p-6 pb-4">
        <PageHeader 
          title="لوحة التحكم" 
          description={currentDate}
          icon={<LayoutDashboard size={20} />} 
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="زيارات اليوم" 
            value={data.todayVisitsCount} 
            icon={<MapPin size={20} className="text-blue-400" />} 
            bg="bg-blue-500/10"
          />
          <StatCard 
            title="صيانة مجدولة" 
            value={data.scheduledMaintenanceCount} 
            icon={<Wrench size={20} className="text-amber-400" />} 
            bg="bg-amber-500/10"
          />
          <StatCard 
            title="مهام معلقة" 
            value={data.pendingTasksCount} 
            icon={<Activity size={20} className="text-emerald-400" />} 
            bg="bg-emerald-500/10"
          />
          <StatCard 
            title="إجمالي العملاء" 
            value={data.totalClientsCount} 
            icon={<Users size={20} className="text-purple-400" />} 
            bg="bg-purple-500/10"
          />
        </div>

        {/* Middle Row: Chart & Today Visits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Weekly Chart */}
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col h-80">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">الزيارات الأسبوعية</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.weeklyVisitsChart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="day" 
                    tickFormatter={(val) => format(new Date(val), 'dd/MM')} 
                    stroke="var(--color-text-muted)" 
                    fontSize={12}
                    tickMargin={10}
                  />
                  <YAxis stroke="var(--color-text-muted)" fontSize={12} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'var(--color-bg-hover)' }}
                    contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.weeklyVisitsChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={visitTypeColors[entry.type] || 'var(--color-brand)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today Visits List */}
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col h-80">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">زيارات اليوم</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {data.todayVisits.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)] text-sm">
                  لا توجد زيارات مجدولة لليوم
                </div>
              ) : (
                data.todayVisits.map(visit => (
                  <div key={visit.id} className="flex items-start gap-3 p-3 bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border)]">
                    <div className="text-xs font-mono text-[var(--color-text-secondary)] w-12 shrink-0 pt-0.5">
                      {visit.visit_time || '--:--'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <VisitTypeBadge type={visit.visit_type} />
                        <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">{visit.client_name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] truncate">
                        <MapPin size={12} /> {visit.client_address || 'بدون عنوان'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Urgent Tasks & Followup Calls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Urgent Tasks */}
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col h-72">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] mb-4">
              <AlertCircle size={16} className="text-red-400" /> مهام عاجلة
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {data.urgentTasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)] text-sm">
                  لا توجد مهام عاجلة
                </div>
              ) : (
                data.urgentTasks.map(task => (
                  <div key={task.id} className="p-3 bg-[var(--color-bg-elevated)] rounded-lg border border-red-500/20">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">{task.title}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1">{task.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Followup Calls */}
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col h-72">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] mb-4">
              <PhoneCall size={16} className="text-amber-400" /> اتصالات تحتاج متابعة
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {data.pendingFollowupCalls.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)] text-sm">
                  لا توجد اتصالات تحتاج متابعة
                </div>
              ) : (
                data.pendingFollowupCalls.map(call => (
                  <div key={call.id} className="p-3 bg-[var(--color-bg-elevated)] rounded-lg border border-amber-500/20">
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{call.contact_name}</p>
                      <span className="text-xs text-amber-400 font-mono">
                        {call.followup_date ? format(new Date(call.followup_date), 'd MMM', { locale: ar }) : 'بدون تاريخ'}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] truncate">{call.subject}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bg }: { title: string, value: number, icon: React.ReactNode, bg: string }) {
  return (
    <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-4 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1">{title}</p>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-[var(--color-text-primary)]"
        >
          {value}
        </motion.p>
      </div>
      <div className={`p-3 rounded-xl ${bg}`}>
        {icon}
      </div>
    </div>
  );
}
