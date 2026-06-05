import { getDb } from '../db';
import type { TechGroup, CreateTechGroupInput, UpdateTechGroupInput } from '@/app/types/tech-group.types';

export const techGroupsRepo = {
  findAll: (): TechGroup[] => {
    return getDb().prepare(`
      SELECT * FROM tech_groups ORDER BY name ASC
    `).all() as TechGroup[];
  },

  findById: (id: number): TechGroup | undefined => {
    return getDb().prepare('SELECT * FROM tech_groups WHERE id = ?').get(id) as TechGroup | undefined;
  },

  create: (input: CreateTechGroupInput): TechGroup => {
    const stmt = getDb().prepare(`
      INSERT INTO tech_groups (name)
      VALUES (@name)
    `);

    const info = stmt.run({
      name: input.name,
    });

    return techGroupsRepo.findById(info.lastInsertRowid as number) as TechGroup;
  },

  update: (id: number, input: UpdateTechGroupInput): boolean => {
    const info = getDb().prepare(`
      UPDATE tech_groups SET name = @name WHERE id = @id
    `).run({ id, name: input.name });

    return info.changes > 0;
  },

  delete: (id: number): boolean => {
    const info = getDb().prepare('DELETE FROM tech_groups WHERE id = ?').run(id);
    return info.changes > 0;
  },
};
