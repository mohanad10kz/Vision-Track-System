import { useState, useEffect, useCallback } from 'react';
import { useConveyor } from './use-conveyor';
import type { Client, CreateClientInput, UpdateClientInput } from '../types/client.types';

export function useClients(initialSearch?: string) {
  const { getClients, createClient, updateClient, deleteClient } = useConveyor('db');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch ?? '');

  const load = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    try {
      const data = await getClients(searchTerm ? { search: searchTerm } : undefined);
      setClients(data);
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  }, [getClients]);

  useEffect(() => {
    load(search);
  }, [search, load]);

  return {
    clients,
    loading,
    search,
    setSearch,
    create: async (input: CreateClientInput) => {
      await createClient(input);
      await load(search);
    },
    update: async (id: number, input: UpdateClientInput) => {
      await updateClient(id, input);
      await load(search);
    },
    remove: async (id: number) => {
      await deleteClient(id);
      await load(search);
    },
    reload: () => load(search),
  };
}
