import { useState, useEffect, useCallback } from 'react';
import { useConveyor } from './use-conveyor';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task.types';

export function useTasks() {
  const { getTasks, createTask, updateTask, deleteTask, updateTaskStatus } = useConveyor('db');
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
    moveStatus: async (id: number, status: Task['status'], position: number) => {
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status, position } : t));
      await updateTaskStatus(id, status, position);
      await load();
    }
  };
}
