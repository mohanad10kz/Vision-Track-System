import { getDb } from '../db';
import type { Technician, CreateTechnicianInput, UpdateTechnicianInput } from '@/app/types/technician.types';

export const techniciansRepo = {
  findAll: (): Technician[] => {
    return getDb().prepare(`
      SELECT * FROM technicians ORDER BY name ASC
    `).all() as Technician[];
  },

  findById: (id: number): Technician | undefined => {
    return getDb().prepare('SELECT * FROM technicians WHERE id = ?').get(id) as Technician | undefined;
  },

  countTodayVisits: (id: number, today: string): number => {
    const result = getDb().prepare(`
      SELECT COUNT(*) as count FROM visits
      WHERE technician_id = ? AND visit_date = ?
    `).get(id, today) as { count: number };
    return result?.count ?? 0;
  },

  create: (input: CreateTechnicianInput): Technician => {
    const stmt = getDb().prepare(`
      INSERT INTO technicians (name, phone, specialty, notes)
      VALUES (@name, @phone, @specialty, @notes)
    `);

    const info = stmt.run({
      name: input.name,
      phone: input.phone,
      specialty: input.specialty ?? null,
      notes: input.notes ?? null,
    });

    return techniciansRepo.findById(info.lastInsertRowid as number) as Technician;
  },

  update: (id: number, input: UpdateTechnicianInput): boolean => {
    const updates: string[] = [];
    const values: Record<string, unknown> = { id };

    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = @${key}`);
        values[key] = value;
      }
    });

    if (updates.length === 0) return false;

    const query = `UPDATE technicians SET ${updates.join(', ')} WHERE id = @id`;
    const info = getDb().prepare(query).run(values);
    return info.changes > 0;
  },

  updateStatus: (id: number, status: string): boolean => {
    const info = getDb().prepare(`
      UPDATE technicians SET status = ? WHERE id = ?
    `).run(status, id);
    return info.changes > 0;
  },

  delete: (id: number): boolean => {
    const info = getDb().prepare('DELETE FROM technicians WHERE id = ?').run(id);
    return info.changes > 0;
  },
};
