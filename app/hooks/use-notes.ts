import { useState, useEffect, useCallback } from 'react';
import { useConveyor } from './use-conveyor';
import type { Note, CreateNoteInput, UpdateNoteInput } from '../types/note.types';

export function useNotes() {
  const { getNotes, createNote, updateNote, deleteNote, updateNoteStatus } = useConveyor('db');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  }, [getNotes]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    notes,
    loading,
    pending: notes.filter(n => n.status === 'pending'),
    inProgress: notes.filter(n => n.status === 'inprogress'),
    done: notes.filter(n => n.status === 'done'),
    create: async (input: CreateNoteInput) => { 
      await createNote(input); 
      await load(); 
    },
    update: async (id: number, input: UpdateNoteInput) => { 
      await updateNote(id, input); 
      await load(); 
    },
    remove: async (id: number) => { 
      await deleteNote(id); 
      await load(); 
    },
    moveStatus: async (id: number, status: Note['status'], position: number) => {
      setNotes(prev => prev.map(n => n.id === id ? { ...n, status, position } : n));
      await updateNoteStatus(id, status, position);
      await load();
    },
    reorder: async (updates: {id: number, position: number, status?: Note['status']}[]) => {
      // Optimistic update with sorting
      setNotes(prev => {
        const newNotes = prev.map(n => {
          const update = updates.find(u => u.id === n.id);
          if (update) {
            return { ...n, position: update.position, ...(update.status && { status: update.status }) };
          }
          return n;
        });
        return newNotes.sort((a, b) => a.position - b.position);
      });
      await Promise.all(updates.map(u => updateNote(u.id, { position: u.position, ...(u.status && { status: u.status }) })));
      await load();
    }
  };
}
