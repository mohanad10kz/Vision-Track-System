import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { NotesColumn } from './NotesColumn';
import { NotesCard } from './NotesCard';
import type { Note } from '@/app/types/note.types';

interface NotesBoardProps {
  notes: Note[];
  onNoteMove: (noteId: number, newStatus: Note['status'], newPosition: number) => void;
  onEditNote?: (note: Note) => void;
  onAddNote?: (status: Note['status']) => void;
}

export const NotesBoard = ({ notes, onNoteMove, onEditNote, onAddNote }: NotesBoardProps) => {
  const [activeNote, setActiveNote] = React.useState<Note | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const note = notes.find(n => n.id === active.id);
    if (note) setActiveNote(note);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveNote(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number | string;

    const activeNote = notes.find(n => n.id === activeId);
    if (!activeNote) return;

    let overStatus = '';
    let newPosition = 0;

    if (overId === 'pending' || overId === 'inprogress' || overId === 'done') {
      overStatus = overId as string;
      const notesInColumn = notes.filter(n => n.status === overStatus);
      newPosition = notesInColumn.length > 0 ? Math.max(...notesInColumn.map(n => n.position)) + 1 : 0;
    } else {
      const overNote = notes.find(n => n.id === overId);
      if (overNote) {
        overStatus = overNote.status;
        newPosition = overNote.position;
      }
    }

    if (overStatus && (activeNote.status !== overStatus || activeNote.position !== newPosition)) {
      onNoteMove(activeId, overStatus as Note['status'], newPosition);
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart} 
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
