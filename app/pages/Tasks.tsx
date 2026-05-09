import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { PageHeader } from '../components/shared/PageHeader';
import { KanbanBoard } from '../components/shared/KanbanBoard';
import { FormModal } from '../components/shared/FormModal';
import { useTasks } from '../hooks/use-tasks';
import type { Task } from '../types/task.types';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

const taskSchema = z.object({
  title: z.string().min(1, 'عنوان المهمة مطلوب'),
  description: z.string().optional(),
  status: z.enum(['pending', 'inprogress', 'done']),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export const Tasks = () => {
  const { tasks, create, update, remove, reorder } = useTasks();
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
    }
  });

  const handleOpenModal = (task?: Task, defaultStatus?: Task['status']) => {
    if (task) {
      setEditingTask(task);
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
      });
    } else {
      setEditingTask(null);
      reset({
        title: '',
        description: '',
        status: defaultStatus || 'pending',
      });
    }
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    // Slight delay to allow animation to finish before resetting
    setTimeout(() => reset(), 200);
  };

  const onSubmit = async (data: TaskFormValues) => {
    try {
      if (editingTask) {
        await update(editingTask.id, data);
        toast.success('تم تعديل المهمة بنجاح');
      } else {
        await create(data);
        toast.success('تم إضافة المهمة بنجاح');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ المهمة');
    }
  };

  const handleDeleteClick = () => {
    setIsFormModalOpen(false);
    // Slight delay to avoid dialog overlap issues
    setTimeout(() => setIsDeleteDialogOpen(true), 100);
  };

  const handleConfirmDelete = async () => {
    if (editingTask) {
      try {
        await remove(editingTask.id);
        toast.success('تم حذف المهمة بنجاح');
      } catch (error) {
        toast.error('حدث خطأ أثناء الحذف');
      }
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col pt-8 pl-8 pr-[280px] pb-8">
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
          onTasksReorder={(updates) => reorder(updates)}
          onEditTask={(task) => handleOpenModal(task)}
          onAddTask={(status) => handleOpenModal(undefined, status)}
        />
      </div>

      <FormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'تعديل المهمة' : 'مهمة جديدة'}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-text-secondary mb-1">عنوان المهمة *</label>
            <input 
              autoFocus
              type="text" 
              {...register('title')}
              className={`w-full bg-bg-base border ${errors.title ? 'border-red-500' : 'border-[var(--color-border-vt)]'} rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          
          <div>
            <label className="block text-text-secondary mb-1">الوصف</label>
            <textarea 
              {...register('description')}
              rows={3}
              className="w-full bg-bg-base border border-[var(--color-border-vt)] rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand resize-none"
            />
          </div>
          
          <div>
            <label className="block text-text-secondary mb-1">الحالة</label>
            <select 
              {...register('status')}
              className="w-full bg-bg-base border border-[var(--color-border-vt)] rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand"
            >
              <option value="pending">معلقة</option>
              <option value="inprogress">جارية</option>
              <option value="done">مكتملة</option>
            </select>
          </div>
          
          {editingTask && (
            <div className="pt-4 border-t border-[var(--color-border-vt)] mt-4 flex justify-start">
              <button 
                type="button" 
                onClick={handleDeleteClick} 
                className="text-red-500 hover:text-red-400 font-medium transition-colors"
              >
                حذف المهمة
              </button>
            </div>
          )}
        </div>
      </FormModal>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-bg-surface border-border-vt text-text-primary dir-rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">هل أنت متأكد من الحذف؟</AlertDialogTitle>
            <AlertDialogDescription className="text-right text-text-secondary">
              لا يمكن التراجع عن هذا الإجراء بعد تنفيذه. سيتم حذف المهمة بشكل نهائي من قاعدة البيانات.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 sm:justify-start">
            <AlertDialogCancel className="bg-bg-base border-border-vt text-text-primary hover:bg-bg-elevated mt-0 sm:mt-0">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 text-white hover:bg-red-600">
              تأكيد الحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
