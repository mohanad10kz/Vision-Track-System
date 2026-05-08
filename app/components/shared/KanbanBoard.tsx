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
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import type { Task } from '@/app/types/task.types';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: number, newStatus: Task['status'], newPosition: number) => void;
  onEditTask?: (task: Task) => void;
  onAddTask?: (status: Task['status']) => void;
}

export const KanbanBoard = ({ tasks, onTaskMove, onEditTask, onAddTask }: KanbanBoardProps) => {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number | string;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Find the container we are dropping into
    let overStatus = '';
    let newPosition = 0;

    if (overId === 'pending' || overId === 'inprogress' || overId === 'done') {
      overStatus = overId as string;
      const tasksInColumn = tasks.filter(t => t.status === overStatus);
      newPosition = tasksInColumn.length > 0 ? Math.max(...tasksInColumn.map(t => t.position)) + 1 : 0;
    } else {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) {
        overStatus = overTask.status;
        newPosition = overTask.position; // Simplistic reordering
      }
    }

    if (overStatus && (activeTask.status !== overStatus || activeTask.position !== newPosition)) {
      onTaskMove(activeId, overStatus as Task['status'], newPosition);
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
        <KanbanColumn 
          id="pending" 
          title="معلقة" 
          color="amber" 
          tasks={tasks.filter(t => t.status === 'pending')} 
          onEditTask={onEditTask}
          onAddTask={() => onAddTask && onAddTask('pending')}
        />
        <KanbanColumn 
          id="inprogress" 
          title="جارية" 
          color="blue" 
          tasks={tasks.filter(t => t.status === 'inprogress')} 
          onEditTask={onEditTask}
          onAddTask={() => onAddTask && onAddTask('inprogress')}
        />
        <KanbanColumn 
          id="done" 
          title="مكتملة" 
          color="green" 
          tasks={tasks.filter(t => t.status === 'done')} 
          onEditTask={onEditTask}
          onAddTask={() => onAddTask && onAddTask('done')}
        />
      </div>

      <DragOverlay>
        {activeTask ? <KanbanCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
