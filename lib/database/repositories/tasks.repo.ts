import { getDb } from '../db';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/app/types/task.types';

export const tasksRepo = {
  findAll: (): Task[] => {
    return getDb().prepare('SELECT * FROM tasks ORDER BY status ASC, position ASC').all() as Task[];
  },

  findById: (id: number): Task | undefined => {
    return getDb().prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined;
  },

  create: (input: CreateTaskInput): Task => {
    const stmt = getDb().prepare(`
      INSERT INTO tasks (title, description, priority, status, position, due_date)
      VALUES (@title, @description, @priority, @status, @position, @due_date)
    `);

    const info = stmt.run({
      title: input.title,
      description: input.description || null,
      priority: input.priority || 'medium',
      status: input.status || 'pending',
      position: input.position || 0,
      due_date: input.due_date || null
    });

    return tasksRepo.findById(info.lastInsertRowid as number) as Task;
  },

  update: (id: number, input: UpdateTaskInput): boolean => {
    const updates: string[] = [];
    const values: Record<string, any> = { id };

    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = @${key}`);
        values[key] = value;
      }
    });

    if (updates.length === 0) return false;

    updates.push("updated_at = datetime('now', 'localtime')");

    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = @id`;
    const info = getDb().prepare(query).run(values);
    return info.changes > 0;
  },

  updateStatus: (id: number, status: string, position: number): boolean => {
    const info = getDb().prepare(`
      UPDATE tasks SET status = ?, position = ?, updated_at = datetime('now', 'localtime') WHERE id = ?
    `).run(status, position, id);
    return info.changes > 0;
  },

  delete: (id: number): boolean => {
    const info = getDb().prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return info.changes > 0;
  }
};
