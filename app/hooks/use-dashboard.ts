import { useState, useEffect } from 'react';
import { useConveyor } from './use-conveyor';
import type { Task } from '../types/task.types';
import type { Visit } from '../types/visit.types';
import type { CallLog } from '../types/call.types';

export interface DashboardData {
  todayVisitsCount: number;
  scheduledMaintenanceCount: number;
  pendingTasksCount: number;
  totalClientsCount: number;
  weeklyVisitsChart: { day: string; type: string; count: number }[];
  todayVisits: Visit[];
  urgentTasks: Task[];
  pendingFollowupCalls: CallLog[];
}

export function useDashboard() {
  const { getDashboardData } = useConveyor('db');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const result = await getDashboardData();
      setData(result);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return {
    data,
    loading,
    reload: load,
  };
}
