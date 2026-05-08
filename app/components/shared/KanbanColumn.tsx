import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import type { Task } from '@/app/types/task.types';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  color: 'amber' | 'blue' | 'green';
  onEditTask?: (task: Task) => void;
  onAddTask?: () => void;
}

const colorMap = {
  amber: 'border-t-amber-500',
  blue: 'border-t-blue-500',
  green: 'border-t-green-500',
};

export const KanbanColumn = ({ id, title, tasks, color, onEditTask, onAddTask }: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className={`flex-1 flex flex-col bg-[var(--color-bg-surface)] border border-[var(--color-border-vt)] rounded-xl ${colorMap[color]} border-t-4`}>
      {/* Column Header */}
      <div className="p-4 flex justify-between items-center border-b border-[var(--color-border-vt)]">
        <h3 className="font-semibold text-text-primary">{title}</h3>
        <span className="bg-bg-elevated text-text-secondary text-xs font-bold px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Column Content / Droppable Area */}
      <div ref={setNodeRef} className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 min-h-[150px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <KanbanCard key={task.id} task={task} onEdit={onEditTask} />
          ))}
        </SortableContext>
        
        {onAddTask && (
          <button 
            onClick={onAddTask}
            className="w-full py-2 border-2 border-dashed border-[var(--color-border-vt)] rounded-lg text-text-muted hover:text-brand hover:border-brand hover:bg-brand/5 transition-colors text-sm font-medium mt-2"
          >
            + إضافة بطاقة
          </button>
        )}
      </div>
    </div>
  );
};
