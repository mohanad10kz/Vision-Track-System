import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { useConveyor } from './use-conveyor';
import type { Technician, CreateTechnicianInput, UpdateTechnicianInput, TechnicianStatus } from '../types/technician.types';

export function useTechnicians() {
  const { getTechnicians, createTechnician, updateTechnician, updateTechnicianStatus, deleteTechnician, getTechnicianTodayVisits } = useConveyor('db');
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTechnicians() as Technician[];
      const today = format(new Date(), 'yyyy-MM-dd');

      // جلب عدد زيارات اليوم لكل فني
      const withCounts = await Promise.all(
        data.map(async (tech) => {
          const count = await getTechnicianTodayVisits(tech.id, today) as number;
          return { ...tech, todayVisitsCount: count };
        })
      );

      setTechnicians(withCounts);
    } catch (error) {
      console.error('Failed to load technicians:', error);
    } finally {
      setLoading(false);
    }
  }, [getTechnicians, getTechnicianTodayVisits]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    technicians,
    loading,
    available: technicians.filter(t => t.status === 'available'),
    busy: technicians.filter(t => t.status === 'busy'),
    create: async (input: CreateTechnicianInput) => {
      await createTechnician(input);
      await load();
    },
    update: async (id: number, input: UpdateTechnicianInput) => {
      await updateTechnician(id, input);
      await load();
    },
    changeStatus: async (id: number, status: TechnicianStatus) => {
      await updateTechnicianStatus(id, status);
      await load();
    },
    remove: async (id: number) => {
      await deleteTechnician(id);
      await load();
    },
    reload: load,
  };
}
