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
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import type { Task } from '@/app/types/task.types';

interface KanbanBoardProps {
  tasks: Task[];
  onTasksReorder?: (updates: { id: number; position: number; status?: Task['status'] }[]) => void;
  onEditTask?: (task: Task) => void;
  onAddTask?: (status: Task['status']) => void;
}

export const KanbanBoard = ({ tasks: serverTasks, onTasksReorder, onEditTask, onAddTask }: KanbanBoardProps) => {
  const [tasks, setTasks] = useState<Task[]>(serverTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(serverTasks);
  }, [serverTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number | string;

    if (activeId === overId) return;

    setTasks((prevTasks) => {
      const activeTaskIndex = prevTasks.findIndex(t => t.id === activeId);
      const overTaskIndex = prevTasks.findIndex(t => t.id === overId);

      if (activeTaskIndex === -1) return prevTasks;
      const activeTask = prevTasks[activeTaskIndex];

      let overStatus = '';
      if (overId === 'pending' || overId === 'inprogress' || overId === 'done') {
        overStatus = overId as string;
      } else if (overTaskIndex !== -1) {
        overStatus = prevTasks[overTaskIndex].status;
      }

      if (!overStatus) return prevTasks;

      // Moving to a different column
      if (activeTask.status !== overStatus) {
        const newTasks = [...prevTasks];
        // Change status to the new column
        newTasks[activeTaskIndex] = { ...activeTask, status: overStatus as Task['status'] };
        
        // If we dragged over an item in the new column, we want to insert it there
        if (overTaskIndex !== -1) {
           return arrayMove(newTasks, activeTaskIndex, overTaskIndex);
        }
        return newTasks;
      }

      // Moving within the same column
      if (activeTask.status === overStatus && overTaskIndex !== -1) {
         return arrayMove(prevTasks, activeTaskIndex, overTaskIndex);
      }

      return prevTasks;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) {
       // If dropped outside, revert to server state
       setTasks(serverTasks);
       return;
    }

    const activeId = active.id as number;
    const currentTask = tasks.find(t => t.id === activeId);
    const originalTask = serverTasks.find(t => t.id === activeId);

    if (!currentTask || !originalTask) {
       setTasks(serverTasks);
       return;
    }

    // Assign sequential positions to tasks in their current visual order
    const columnTasks = tasks.filter(t => t.status === currentTask.status);

    if (onTasksReorder) {
      const updates = columnTasks.map((t, idx) => ({ 
        id: t.id, 
        position: idx, 
        status: t.id === activeId ? (currentTask.status as Task['status']) : undefined 
      }));
      onTasksReorder(updates);
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
      <div className="flex gap-6 h-full overflow-x-auto pb-4">
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
