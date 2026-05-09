import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal } from 'lucide-react';
import type { Task } from '@/app/types/task.types';

interface KanbanCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export const KanbanCard = ({ task, onEdit }: KanbanCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: task });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-[var(--color-bg-elevated)] border border-[var(--color-border-vt)] rounded-lg p-3 group relative cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 rotate-2 shadow-2xl z-50 ring-2 ring-brand' : 'hover:-translate-y-0.5 hover:shadow-lg transition-transform'}
      `}
    >
      <div className="flex gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm font-medium text-text-primary truncate">{task.title}</h4>
            {onEdit && (
              <button 
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                className="text-text-muted hover:text-text-primary transition-colors p-1"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {task.description && (
            <p className="text-xs text-text-secondary line-clamp-2 mb-3">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-text-muted">
              📅 {new Date(task.created_at).toLocaleDateString('ar-LY')}
            </span>
            {task.due_date && (
              <span className="text-xs text-text-muted">
                ⏱ {new Date(task.due_date).toLocaleDateString('ar-LY')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
