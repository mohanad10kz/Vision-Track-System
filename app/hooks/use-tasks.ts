import { useState, useEffect, useCallback } from 'react';
import { useConveyor } from './use-conveyor';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task.types';

export function useTasks() {
  const { getTasks, createTask, updateTask, deleteTask } = useConveyor('db');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [getTasks]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    tasks,
    loading,
    pending: tasks.filter(t => t.status === 'pending'),
    inProgress: tasks.filter(t => t.status === 'inprogress'),
    done: tasks.filter(t => t.status === 'done'),
    create: async (input: CreateTaskInput) => { 
      await createTask(input); 
      await load(); 
    },
    update: async (id: number, input: UpdateTaskInput) => { 
      await updateTask(id, input); 
      await load(); 
    },
    remove: async (id: number) => { 
      await deleteTask(id); 
      await load(); 
    },
    reorder: async (updates: {id: number, position: number, status?: Task['status']}[]) => {
      // Optimistic update with sorting
      setTasks(prev => {
        const newTasks = prev.map(t => {
          const update = updates.find(u => u.id === t.id);
          if (update) {
            return { ...t, position: update.position, ...(update.status && { status: update.status }) };
          }
          return t;
        });
        return newTasks.sort((a, b) => a.position - b.position);
      });
      await Promise.all(updates.map(u => updateTask(u.id, { position: u.position, ...(u.status && { status: u.status }) })));
      await load();
    }
  };
}
