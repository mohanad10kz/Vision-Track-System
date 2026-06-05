import { useState, useEffect, useCallback } from 'react';
import { useConveyor } from './use-conveyor';
import type { CallLog, CreateCallLogInput, UpdateCallLogInput } from '../types/call.types';

interface CallFilter {
  search?: string;
  contactType?: string;
  direction?: string;
  requiresFollowup?: boolean;
  page?: number;
  limit?: number;
}

export function useCalls(initialFilter?: CallFilter) {
  const { getCalls, createCall, updateCall, markCallFollowupDone, deleteCall } = useConveyor('db');
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CallFilter>({ page: 1, limit: 10, ...initialFilter });

  const load = useCallback(async (f?: CallFilter) => {
    setLoading(true);
    try {
      const response = await getCalls(f ?? filter);
      setCalls(response?.data || (Array.isArray(response) ? response : []));
      setTotal(response?.totalCount || (Array.isArray(response) ? response.length : 0));
    } catch (error) {
      console.error('Failed to load calls:', error);
    } finally {
      setLoading(false);
    }
  }, [getCalls, filter]);

  useEffect(() => {
    load(filter);
  }, [filter]);

  return {
    calls,
    total,
    loading,
    filter,
    setFilter: (f: CallFilter) => {
      setFilter(f);
      load(f);
    },
    pendingFollowup: calls.filter(c => c.requires_followup === 1 && c.followup_done === 0),
    create: async (input: CreateCallLogInput) => {
      await createCall(input);
      await load(filter);
    },
    update: async (id: number, input: UpdateCallLogInput) => {
      await updateCall(id, input);
      await load(filter);
    },
    markDone: async (id: number) => {
      await markCallFollowupDone(id);
      await load(filter);
    },
    remove: async (id: number) => {
      await deleteCall(id);
      await load(filter);
    },
    reload: () => load(filter),
  };
}
