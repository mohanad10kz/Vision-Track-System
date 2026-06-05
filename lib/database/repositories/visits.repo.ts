import { getDb } from '../db';
import type { Visit, CreateVisitInput, UpdateVisitInput } from '@/app/types/visit.types';

export const visitsRepo = {
  findAll: (filter?: {
    type?: string;
    status?: string;
    technicianId?: number;
    from?: string;
    to?: string;
    search?: string;
  }): Visit[] => {
    let query = `SELECT * FROM visits WHERE 1=1`;
    const params: (string | number)[] = [];

    if (filter?.type)         { query += ` AND visit_type = ?`;    params.push(filter.type);         }
    if (filter?.status)       { query += ` AND status = ?`;        params.push(filter.status);       }
    if (filter?.technicianId) { query += ` AND technician_id = ?`; params.push(filter.technicianId); }
    if (filter?.from)         { query += ` AND visit_date >= ?`;   params.push(filter.from);         }
    if (filter?.to)           { query += ` AND visit_date <= ?`;   params.push(filter.to);           }
    if (filter?.search) {
      query += ` AND (client_name LIKE ? OR client_phone LIKE ? OR client_address LIKE ?)`;
      const s = `%${filter.search}%`;
      params.push(s, s, s);
    }

    query += ` AND archived_at IS NULL`;

    query += ` ORDER BY visit_date ASC, visit_time ASC`;
    return getDb().prepare(query).all(...params) as Visit[];
  },

  findById: (id: number): Visit | undefined => {
    return getDb().prepare('SELECT * FROM visits WHERE id = ?').get(id) as Visit | undefined;
  },

  countTodayForTechnician: (technicianId: number, today: string): number => {
    const result = getDb().prepare(`
      SELECT COUNT(*) as count FROM visits
      WHERE technician_id = ? AND visit_date = ?
    `).get(technicianId, today) as { count: number };
    return result?.count ?? 0;
  },

  create: (input: CreateVisitInput): Visit => {
    const stmt = getDb().prepare(`
      INSERT INTO visits (
        client_id, client_name, client_phone, client_address,
        visit_type, visit_date, visit_time,
        technician_id, technician_name,
        status, notes, resolution_notes, archived_at
      ) VALUES (
        @client_id, @client_name, @client_phone, @client_address,
        @visit_type, @visit_date, @visit_time,
        @technician_id, @technician_name,
        @status, @notes, @resolution_notes,
        CASE WHEN @status = 'completed' THEN datetime('now', 'localtime') ELSE NULL END
      )
    `);

    const info = stmt.run({
      client_id: input.client_id ?? null,
      client_name: input.client_name,
      client_phone: input.client_phone,
      client_address: input.client_address ?? null,
      visit_type: input.visit_type,
      visit_date: input.visit_date,
      visit_time: input.visit_time ?? null,
      technician_id: input.technician_id ?? null,
      technician_name: input.technician_name ?? null,
      status: input.status ?? 'scheduled',
      notes: input.notes ?? null,
      resolution_notes: input.resolution_notes ?? null,
    });

    return visitsRepo.findById(info.lastInsertRowid as number) as Visit;
  },

  update: (id: number, input: UpdateVisitInput): boolean => {
    const updates: string[] = [];
    const values: Record<string, unknown> = { id };

    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = @${key}`);
        values[key] = value;
      }
    });

    if (updates.length === 0) return false;

    if (input.status !== undefined) {
      if (input.status === 'completed') {
        updates.push("archived_at = datetime('now', 'localtime')");
      } else {
        updates.push("archived_at = NULL");
      }
    }

    updates.push("updated_at = datetime('now', 'localtime')");

    const query = `UPDATE visits SET ${updates.join(', ')} WHERE id = @id`;
    const info = getDb().prepare(query).run(values);
    return info.changes > 0;
  },

  updateStatus: (id: number, status: string, resolutionNotes?: string): void => {
    getDb().prepare(`
      UPDATE visits
      SET status = ?,
          resolution_notes = COALESCE(?, resolution_notes),
          archived_at = CASE WHEN ? = 'completed' THEN datetime('now', 'localtime') ELSE NULL END,
          updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `).run(status, resolutionNotes ?? null, status, id);
  },

  delete: (id: number): boolean => {
    const info = getDb().prepare('DELETE FROM visits WHERE id = ?').run(id);
    return info.changes > 0;
  },

  archiveOldDone: (): number => {
    const result = getDb().prepare(`
      UPDATE visits
      SET archived_at = datetime('now', 'localtime')
      WHERE status = 'completed'
        AND archived_at IS NULL
    `).run();
    return result.changes;
  },

  findArchived: (filter: { from?: string; to?: string; search?: string, page?: number, limit?: number }) => {
    let query = `SELECT * FROM visits WHERE archived_at IS NOT NULL AND status = 'completed'`;
    const params: (string | number)[] = [];

    if (filter.from) {
      query += ` AND visit_date >= ?`;
      params.push(filter.from);
    }
    if (filter.to) {
      query += ` AND visit_date <= ?`;
      params.push(filter.to);
    }
    if (filter.search) {
      query += ` AND (client_name LIKE ? OR client_phone LIKE ?)`;
      params.push(`%${filter.search}%`, `%${filter.search}%`);
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

    const data = getDb().prepare(query).all(...params) as Visit[];
    return { data, totalCount };
  },
};
