import { getDb } from '../db';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/app/types/task.types';

export const tasksRepo = {
  // جلب المهام النشطة فقط (غير المؤرشفة)
  findAll: (): Task[] => {
    return getDb().prepare(`
      SELECT * FROM tasks
      WHERE archived_at IS NULL
      ORDER BY position ASC, created_at DESC
    `).all() as Task[];
  },

  findById: (id: number): Task | undefined => {
    return getDb().prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined;
  },

  create: (input: CreateTaskInput): Task => {
    const stmt = getDb().prepare(`
      INSERT INTO tasks (title, description, status, position, due_date)
      VALUES (@title, @description, @status, @position, @due_date)
    `);

    const info = stmt.run({
      title: input.title,
      description: input.description || null,
      status: input.status || 'pending',
      position: input.position || 0,
      due_date: input.due_date || null
    });

    return tasksRepo.findById(info.lastInsertRowid as number) as Task;
  },

  update: (id: number, input: UpdateTaskInput): boolean => {
    const updates: string[] = [];
    const values: Record<string, unknown> = { id };

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
  },

  // أرشفة المهام المكتملة التي مضى عليها أكثر من 7 أيام
  archiveOldDone: (): number => {
    const result = getDb().prepare(`
      UPDATE tasks
      SET archived_at = datetime('now', 'localtime')
      WHERE status = 'done'
        AND archived_at IS NULL
        AND updated_at < datetime('now', 'localtime', '-7 days')
    `).run();
    return result.changes;
  },

  // جلب المهام المؤرشفة مع فلترة بالتاريخ والبحث
  findArchived: (filter: { from?: string; to?: string; search?: string, page?: number, limit?: number }) => {
    let query = `SELECT * FROM tasks WHERE archived_at IS NOT NULL`;
    const params: (string | number)[] = [];

    if (filter.from) {
      query += ` AND created_at >= ?`;
      params.push(filter.from);
    }
    if (filter.to) {
      query += ` AND created_at <= ?`;
      params.push(filter.to + ' 23:59:59');
    }
    if (filter.search) {
      query += ` AND title LIKE ?`;
      params.push(`%${filter.search}%`);
    }

    // Count Total
    const countQuery = query.replace('SELECT *', 'SELECT count(*) as count');
    const totalCount = (getDb().prepare(countQuery).get(...params) as { count: number }).count;

    // Pagination
    query += ` ORDER BY archived_at DESC`;
    if (filter.limit) {
      query += ` LIMIT ?`;
      params.push(filter.limit);
      if (filter.page) {
        query += ` OFFSET ?`;
        params.push((filter.page - 1) * filter.limit);
      }
    }

    const data = getDb().prepare(query).all(...params) as Task[];
    return { data, totalCount };
  },
};
