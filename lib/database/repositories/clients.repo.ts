import { getDb } from '../db';
import type { Client, CreateClientInput, UpdateClientInput } from '@/app/types/client.types';

export const clientsRepo = {
  findAll: (search?: string): Client[] => {
    if (search) {
      return getDb().prepare(`
        SELECT * FROM clients
        WHERE name LIKE ? OR phone LIKE ?
        ORDER BY name ASC
      `).all(`%${search}%`, `%${search}%`) as Client[];
    }
    return getDb().prepare(`
      SELECT * FROM clients ORDER BY name ASC
    `).all() as Client[];
  },

  findById: (id: number): Client | undefined => {
    return getDb().prepare('SELECT * FROM clients WHERE id = ?').get(id) as Client | undefined;
  },

  create: (input: CreateClientInput): Client => {
    const stmt = getDb().prepare(`
      INSERT INTO clients (name, phone, address, notes)
      VALUES (@name, @phone, @address, @notes)
    `);

    const info = stmt.run({
      name: input.name,
      phone: input.phone,
      address: input.address ?? null,
      notes: input.notes ?? null,
    });

    return clientsRepo.findById(info.lastInsertRowid as number) as Client;
  },

  update: (id: number, input: UpdateClientInput): boolean => {
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

    const query = `UPDATE clients SET ${updates.join(', ')} WHERE id = @id`;
    const info = getDb().prepare(query).run(values);
    return info.changes > 0;
  },

  delete: (id: number): boolean => {
    const info = getDb().prepare('DELETE FROM clients WHERE id = ?').run(id);
    return info.changes > 0;
  },
};
