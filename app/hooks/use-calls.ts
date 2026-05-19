import { useState, useEffect, useCallback } from 'react';
import { useConveyor } from './use-conveyor';
import type { CallLog, CreateCallLogInput, UpdateCallLogInput } from '../types/call.types';

interface CallFilter {
  search?: string;
  contactType?: string;
  direction?: string;
  requiresFollowup?: boolean;
}

export function useCalls(initialFilter?: CallFilter) {
  const { getCalls, createCall, updateCall, markCallFollowupDone, deleteCall } = useConveyor('db');
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CallFilter>(initialFilter ?? {});

  const load = useCallback(async (f?: CallFilter) => {
    setLoading(true);
    try {
      const data = await getCalls(f ?? filter);
      setCalls(data);
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
