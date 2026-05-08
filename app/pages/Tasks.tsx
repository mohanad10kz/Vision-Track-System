import React, { useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { KanbanBoard } from '../components/shared/KanbanBoard';
import { FormModal } from '../components/shared/FormModal';
import { useTasks } from '../hooks/use-tasks';
import type { Task } from '../types/task.types';

export const Tasks = () => {
  const { tasks, create, update, moveStatus } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [status, setStatus] = useState<Task['status']>('pending');

  const handleOpenModal = (task?: Task, defaultStatus?: Task['status']) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStatus(task.status);
    } else {
      setEditingTask(null);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus(defaultStatus || 'pending');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      await update(editingTask.id, { title, description, priority, status });
    } else {
      await create({ title, description, priority, status });
    }
    handleCloseModal();
  };

  return (
    <div className="h-full flex flex-col pt-8 pl-8 pr-[250px] pb-8">
      <PageHeader 
        title="المهام" 
        description="إدارة المهام اليومية والأسبوعية"
        action={
          <button 
            onClick={() => handleOpenModal()}
            className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + مهمة جديدة
          </button>
        }
      />

      <div className="flex-1 overflow-hidden">
        <KanbanBoard 
          tasks={tasks}
          onTaskMove={(id, newStatus, newPosition) => moveStatus(id, newStatus, newPosition)}
          onEditTask={(task) => handleOpenModal(task)}
          onAddTask={(status) => handleOpenModal(undefined, status)}
        />
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'تعديل المهمة' : 'مهمة جديدة'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-text-secondary mb-1">عنوان المهمة *</label>
            <input 
              required
              autoFocus
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-bg-base border border-[var(--color-border-vt)] rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">الوصف</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-bg-base border border-[var(--color-border-vt)] rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary mb-1">الأولوية</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className="w-full bg-bg-base border border-[var(--color-border-vt)] rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand"
              >
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
                <option value="urgent">عاجلة</option>
              </select>
            </div>
            <div>
              <label className="block text-text-secondary mb-1">الحالة</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as Task['status'])}
                className="w-full bg-bg-base border border-[var(--color-border-vt)] rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand"
              >
                <option value="pending">معلقة</option>
                <option value="inprogress">جارية</option>
                <option value="done">مكتملة</option>
              </select>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
};
