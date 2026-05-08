import React, { useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { NotesBoard } from '../components/shared/NotesBoard';
import { FormModal } from '../components/shared/FormModal';
import { useNotes } from '../hooks/use-notes';
import type { Note } from '../types/note.types';

const COLORS = ['#0EA5E9', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899'];

export const Notes = () => {
  const { notes, create, update, moveStatus, remove } = useNotes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [status, setStatus] = useState<Note['status']>('pending');

  const handleOpenModal = (note?: Note, defaultStatus?: Note['status']) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content || '');
      setColor(note.color || COLORS[0]);
      setStatus(note.status);
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
      setColor(COLORS[0]);
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

    if (editingNote) {
      await update(editingNote.id, { title, content, color, status });
    } else {
      await create({ title, content, color, status });
    }
    handleCloseModal();
  };
  
  const handleDelete = async () => {
    if (editingNote && confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
      await remove(editingNote.id);
      handleCloseModal();
    }
  };

  return (
    <div className="h-full flex flex-col pt-8 pl-8 pr-[250px] pb-8">
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

      <div className="flex-1 overflow-hidden">
        <NotesBoard 
          notes={notes}
          onNoteMove={(id, newStatus, newPosition) => moveStatus(id, newStatus, newPosition)}
          onEditNote={(note) => handleOpenModal(note)}
          onAddNote={(status) => handleOpenModal(undefined, status)}
        />
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingNote ? 'تعديل الملاحظة' : 'ملاحظة جديدة'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-text-secondary mb-1">عنوان الملاحظة *</label>
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
            <label className="block text-text-secondary mb-1">المحتوى</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full ${color === c ? 'ring-2 ring-offset-2 ring-offset-bg-surface ring-white' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-text-secondary mb-1">الحالة</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as Note['status'])}
                className="w-full bg-bg-base border border-[var(--color-border-vt)] rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand"
              >
                <option value="pending">مسودة</option>
                <option value="inprogress">قيد العمل</option>
                <option value="done">مؤرشفة</option>
              </select>
            </div>
          </div>
          
          {editingNote && (
            <div className="pt-4 border-t border-border-vt mt-4 flex justify-start">
                <button type="button" onClick={handleDelete} className="text-red-500 hover:text-red-400 font-medium">
                  حذف الملاحظة
                </button>
            </div>
          )}
        </div>
      </FormModal>
    </div>
  );
};
