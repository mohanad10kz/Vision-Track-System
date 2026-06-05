import { useState, useCallback, useEffect } from 'react';
import type { TechGroup, CreateTechGroupInput, UpdateTechGroupInput } from '../types/tech-group.types';
import { useConveyor } from './use-conveyor';
import { toast } from 'sonner';

export const useTechGroups = () => {
  const { getTechGroups, createTechGroup, updateTechGroup, deleteTechGroup } = useConveyor('db');
  const [groups, setGroups] = useState<TechGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getTechGroups() as TechGroup[];
      setGroups(data);
    } catch (error) {
      console.error('Failed to fetch tech groups:', error);
      toast.error('فشل في جلب المجموعات');
    } finally {
      setIsLoading(false);
    }
  }, [getTechGroups]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createGroup = async (input: CreateTechGroupInput) => {
    try {
      await createTechGroup(input);
      toast.success('تمت إضافة المجموعة بنجاح');
      await fetchGroups();
      return true;
    } catch (error) {
      console.error('Failed to create group:', error);
      toast.error('فشل في إضافة المجموعة');
      return false;
    }
  };

  const updateGroup = async (id: number, input: UpdateTechGroupInput) => {
    try {
      await updateTechGroup(id, input);
      toast.success('تم تحديث المجموعة بنجاح');
      await fetchGroups();
      return true;
    } catch (error) {
      console.error('Failed to update group:', error);
      toast.error('فشل في تحديث المجموعة');
      return false;
    }
  };

  const deleteGroup = async (id: number) => {
    try {
      await deleteTechGroup(id);
      toast.success('تم حذف المجموعة بنجاح');
      await fetchGroups();
      return true;
    } catch (error) {
      console.error('Failed to delete group:', error);
      toast.error('فشل في حذف المجموعة');
      return false;
    }
  };

  return {
    groups,
    isLoading,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
  };
};
