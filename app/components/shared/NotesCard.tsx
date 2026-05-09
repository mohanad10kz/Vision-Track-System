import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal } from 'lucide-react';
import type { Note } from '@/app/types/note.types';

interface NotesCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
}

export const NotesCard = ({ note, onEdit }: NotesCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id, data: note });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderLeftColor: note.color,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-[var(--color-bg-elevated)] border-y border-r border-l-4 border-y-[var(--color-border-vt)] border-r-[var(--color-border-vt)] rounded-lg p-3 group relative cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 rotate-2 shadow-2xl z-50 ring-2 ring-brand' : 'hover:-translate-y-0.5 hover:shadow-lg transition-transform'}
      `}
    >
      <div className="flex gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm font-medium text-text-primary truncate">{note.title}</h4>
            {onEdit && (
              <button 
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); onEdit(note); }}
                className="text-text-muted hover:text-text-primary transition-colors p-1"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {note.content && (
            <p className="text-xs text-text-secondary line-clamp-3 mt-1 whitespace-pre-wrap">
              {note.content}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-3">
             <span className="text-xs text-text-muted">
                📅 {new Date(note.created_at).toLocaleDateString('ar-LY')}
              </span>
          </div>
        </div>
      </div>
    </div>
  );
};
