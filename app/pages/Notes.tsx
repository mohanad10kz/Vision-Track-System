import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { PageHeader } from '../components/shared/PageHeader';
import { NotesBoard } from '../components/shared/NotesBoard';
import { FormModal } from '../components/shared/FormModal';
import { useNotes } from '../hooks/use-notes';
import type { Note } from '../types/note.types';

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

const COLORS = ['#0EA5E9', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899'];

const noteSchema = z.object({
  title: z.string().min(1, 'عنوان الملاحظة مطلوب'),
  content: z.string().optional(),
  color: z.string().optional(),
  status: z.enum(['pending', 'inprogress', 'done']),
});

type NoteFormValues = z.infer<typeof noteSchema>;

export const Notes = () => {
  const { notes, create, update, remove, reorder } = useNotes();
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
      color: COLORS[0],
      status: 'pending',
    }
  });

  const selectedColor = watch('color');

  const handleOpenModal = (note?: Note, defaultStatus?: Note['status']) => {
    if (note) {
      setEditingNote(note);
      reset({
        title: note.title,
        content: note.content || '',
        color: note.color || COLORS[0],
        status: note.status,
      });
    } else {
      setEditingNote(null);
      reset({
        title: '',
        content: '',
        color: COLORS[0],
        status: defaultStatus || 'pending',
      });
    }
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    // Slight delay to allow animation to finish
    setTimeout(() => reset(), 200);
  };

  const onSubmit = async (data: NoteFormValues) => {
    try {
      if (editingNote) {
        await update(editingNote.id, data);
        toast.success('تم تعديل الملاحظة بنجاح');
      } else {
        await create(data);
        toast.success('تم إضافة الملاحظة بنجاح');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ الملاحظة');
    }
  };
  
  const handleDeleteClick = () => {
    setIsFormModalOpen(false);
    setTimeout(() => setIsDeleteDialogOpen(true), 100);
  };

  const handleConfirmDelete = async () => {
    if (editingNote) {
      try {
        await remove(editingNote.id);
        toast.success('تم حذف الملاحظة بنجاح');
      } catch (error) {
        toast.error('حدث خطأ أثناء الحذف');
      }
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col pt-8 pl-8 pr-[280px] pb-8">
      <PageHeader 
        title="الملاحظات" 
        description="ملاحظات العمل، التعليمات، والمعلومات المهمة"
        action={
          <button 
            onClick={() => handleOpenModal()}
            className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + ملاحظة جديدة
          </button>
        }
      />

      <div className="flex-1 overflow-hidden mt-6">
        <NotesBoard 
          notes={notes}
          onNotesReorder={(updates) => reorder(updates)}
          onEditNote={(note) => handleOpenModal(note)}
          onAddNote={(status) => handleOpenModal(undefined, status)}
        />
      </div>

      <FormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        title={editingNote ? 'تعديل الملاحظة' : 'ملاحظة جديدة'}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-text-secondary mb-1">عنوان الملاحظة *</label>
            <input 
              autoFocus
              type="text" 
              {...register('title')}
              className={`w-full bg-bg-base border ${errors.title ? 'border-red-500' : 'border-[var(--color-border-vt)]'} rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          
          <div>
            <label className="block text-text-secondary mb-1">المحتوى</label>
            <textarea 
              {...register('content')}
              rows={5}
              className="w-full bg-bg-base border border-[var(--color-border-vt)] rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand resize-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary mb-1">لون البطاقة</label>
              <div className="flex gap-2 mt-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setValue('color', c)}
                    className={`w-6 h-6 rounded-full transition-all ${selectedColor === c ? 'ring-2 ring-offset-2 ring-offset-bg-surface ring-white scale-110' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-text-secondary mb-1">الحالة</label>
              <select 
                {...register('status')}
                className="w-full bg-bg-base border border-[var(--color-border-vt)] rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand"
              >
                <option value="pending">مسودة</option>
                <option value="inprogress">قيد العمل</option>
                <option value="done">مؤرشفة</option>
              </select>
            </div>
          </div>
          
          {editingNote && (
            <div className="pt-4 border-t border-[var(--color-border-vt)] mt-4 flex justify-start">
              <button 
                type="button" 
                onClick={handleDeleteClick} 
                className="text-red-500 hover:text-red-400 font-medium transition-colors"
              >
                حذف الملاحظة
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
              لا يمكن التراجع عن هذا الإجراء بعد تنفيذه. سيتم حذف الملاحظة بشكل نهائي من قاعدة البيانات.
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
