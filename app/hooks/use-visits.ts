import { useState, useEffect, useCallback } from 'react';
import { format, addDays } from 'date-fns';
import { useConveyor } from './use-conveyor';
import type { Visit, CreateVisitInput, UpdateVisitInput, VisitType, VisitStatus } from '../types/visit.types';

export function useVisits(typeFilter?: VisitType) {
  const { getVisits, createVisit, updateVisit, deleteVisit, updateVisitStatus } = useConveyor('db');
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVisits(typeFilter ? { type: typeFilter } : undefined);
      setVisits(data);
    } catch (error) {
      console.error('Failed to load visits:', error);
    } finally {
      setLoading(false);
    }
  }, [getVisits, typeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  return {
    visits,
    loading,
    today: visits.filter(v => v.visit_date === today),
    tomorrow: visits.filter(v => v.visit_date === tomorrow),
    upcoming: visits.filter(v => v.visit_date > tomorrow),
    past: visits.filter(v => v.visit_date < today),
    create: async (input: CreateVisitInput) => {
      await createVisit(input);
      await load();
    },
    update: async (id: number, input: UpdateVisitInput) => {
      await updateVisit(id, input);
      await load();
    },
    remove: async (id: number) => {
      await deleteVisit(id);
      await load();
    },
    changeStatus: async (id: number, status: VisitStatus, resolutionNotes?: string) => {
      await updateVisitStatus(id, status, resolutionNotes);
      await load();
    },
    reload: load,
  };
}
