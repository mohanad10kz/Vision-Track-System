import { getDb } from '../db';
import type { Note, CreateNoteInput, UpdateNoteInput } from '@/app/types/note.types';

export const notesRepo = {
  // جلب الملاحظات النشطة فقط (غير المؤرشفة)
  findAll: (): Note[] => {
    return getDb().prepare(`
      SELECT * FROM notes
      WHERE archived_at IS NULL
      ORDER BY position ASC, created_at DESC
    `).all() as Note[];
  },

  findById: (id: number): Note | undefined => {
    return getDb().prepare('SELECT * FROM notes WHERE id = ?').get(id) as Note | undefined;
  },

  create: (input: CreateNoteInput): Note => {
    const stmt = getDb().prepare(`
      INSERT INTO notes (title, content, color, status, position)
      VALUES (@title, @content, @color, @status, @position)
    `);

    const info = stmt.run({
      title: input.title,
      content: input.content || null,
      color: input.color || '#0EA5E9',
      status: input.status || 'pending',
      position: input.position || 0
    });

    return notesRepo.findById(info.lastInsertRowid as number) as Note;
  },

  update: (id: number, input: UpdateNoteInput): boolean => {
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

    const query = `UPDATE notes SET ${updates.join(', ')} WHERE id = @id`;
    const info = getDb().prepare(query).run(values);
    return info.changes > 0;
  },

  updateStatus: (id: number, status: string, position: number): boolean => {
    const info = getDb().prepare(`
      UPDATE notes SET status = ?, position = ?, updated_at = datetime('now', 'localtime') WHERE id = ?
    `).run(status, position, id);
    return info.changes > 0;
  },

  delete: (id: number): boolean => {
    const info = getDb().prepare('DELETE FROM notes WHERE id = ?').run(id);
    return info.changes > 0;
  },

  // أرشفة الملاحظات المكتملة التي مضى عليها أكثر من 7 أيام
  archiveOldDone: (): number => {
    const result = getDb().prepare(`
      UPDATE notes
      SET archived_at = datetime('now', 'localtime')
      WHERE status = 'done'
        AND archived_at IS NULL
        AND updated_at < datetime('now', 'localtime', '-7 days')
    `).run();
    return result.changes;
  },

  // جلب الملاحظات المؤرشفة مع فلترة بالتاريخ والبحث
  findArchived: (filter: { from?: string; to?: string; search?: string }): Note[] => {
    let query = `SELECT * FROM notes WHERE archived_at IS NOT NULL`;
    const params: string[] = [];

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

    query += ` ORDER BY archived_at DESC`;
    return getDb().prepare(query).all(...params) as Note[];
  },
};
