import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { NotesColumn } from './NotesColumn';
import { NotesCard } from './NotesCard';
import type { Note } from '@/app/types/note.types';

interface NotesBoardProps {
  notes: Note[];
  onNotesReorder?: (updates: { id: number; position: number; status?: Note['status'] }[]) => void;
  onEditNote?: (note: Note) => void;
  onAddNote?: (status: Note['status']) => void;
}

export const NotesBoard = ({ notes: serverNotes, onNotesReorder, onEditNote, onAddNote }: NotesBoardProps) => {
  const [notes, setNotes] = useState<Note[]>(serverNotes);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  useEffect(() => {
    setNotes(serverNotes);
  }, [serverNotes]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const note = notes.find(n => n.id === active.id);
    if (note) setActiveNote(note);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number | string;

    if (activeId === overId) return;

    setNotes((prevNotes) => {
      const activeNoteIndex = prevNotes.findIndex(n => n.id === activeId);
      const overNoteIndex = prevNotes.findIndex(n => n.id === overId);

      if (activeNoteIndex === -1) return prevNotes;
      const activeNote = prevNotes[activeNoteIndex];

      let overStatus = '';
      if (overId === 'pending' || overId === 'inprogress' || overId === 'done') {
        overStatus = overId as string;
      } else if (overNoteIndex !== -1) {
        overStatus = prevNotes[overNoteIndex].status;
      }

      if (!overStatus) return prevNotes;

      // Moving to a different column
      if (activeNote.status !== overStatus) {
        const newNotes = [...prevNotes];
        // Change status to the new column
        newNotes[activeNoteIndex] = { ...activeNote, status: overStatus as Note['status'] };
        
        // If we dragged over an item in the new column, insert it there
        if (overNoteIndex !== -1) {
           return arrayMove(newNotes, activeNoteIndex, overNoteIndex);
        }
        return newNotes;
      }

      // Moving within the same column
      if (activeNote.status === overStatus && overNoteIndex !== -1) {
         return arrayMove(prevNotes, activeNoteIndex, overNoteIndex);
      }

      return prevNotes;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveNote(null);
    const { active, over } = event;
    if (!over) {
       setNotes(serverNotes);
       return;
    }

    const activeId = active.id as number;
    const currentNote = notes.find(n => n.id === activeId);
    const originalNote = serverNotes.find(n => n.id === activeId);

    if (!currentNote || !originalNote) {
       setNotes(serverNotes);
       return;
    }

    const columnNotes = notes.filter(n => n.status === currentNote.status);

    if (onNotesReorder) {
      const updates = columnNotes.map((n, idx) => ({ 
        id: n.id, 
        position: idx, 
        status: n.id === activeId ? (currentNote.status as Note['status']) : undefined 
      }));
      onNotesReorder(updates);
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart} 
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full items-start overflow-x-auto pb-4">
        <NotesColumn 
          id="pending" 
          title="مسودة" 
          color="amber" 
          notes={notes.filter(n => n.status === 'pending')} 
          onEditNote={onEditNote}
          onAddNote={() => onAddNote && onAddNote('pending')}
        />
        <NotesColumn 
          id="inprogress" 
          title="قيد العمل" 
          color="blue" 
          notes={notes.filter(n => n.status === 'inprogress')} 
          onEditNote={onEditNote}
          onAddNote={() => onAddNote && onAddNote('inprogress')}
        />
        <NotesColumn 
          id="done" 
          title="مؤرشفة" 
          color="green" 
          notes={notes.filter(n => n.status === 'done')} 
          onEditNote={onEditNote}
          onAddNote={() => onAddNote && onAddNote('done')}
        />
      </div>

      <DragOverlay>
        {activeNote ? <NotesCard note={activeNote} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
