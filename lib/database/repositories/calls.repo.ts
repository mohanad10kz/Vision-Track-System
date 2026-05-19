import { getDb } from '../db';
import type { CallLog, CreateCallLogInput, UpdateCallLogInput } from '@/app/types/call.types';

export const callsRepo = {
  findAll: (filter?: {
    search?: string;
    contactType?: string;
    direction?: string;
    requiresFollowup?: boolean;
  }): CallLog[] => {
    let query = `SELECT * FROM call_logs WHERE 1=1`;
    const params: (string | number)[] = [];

    if (filter?.contactType) {
      query += ` AND contact_type = ?`;
      params.push(filter.contactType);
    }
    if (filter?.direction) {
      query += ` AND direction = ?`;
      params.push(filter.direction);
    }
    if (filter?.requiresFollowup) {
      query += ` AND requires_followup = 1 AND followup_done = 0`;
    }
    if (filter?.search) {
      query += ` AND (contact_name LIKE ? OR subject LIKE ?)`;
      const s = `%${filter.search}%`;
      params.push(s, s);
    }

    query += ` ORDER BY created_at DESC`;
    return getDb().prepare(query).all(...params) as CallLog[];
  },

  findById: (id: number): CallLog | undefined => {
    return getDb().prepare('SELECT * FROM call_logs WHERE id = ?').get(id) as CallLog | undefined;
  },

  create: (input: CreateCallLogInput): CallLog => {
    const stmt = getDb().prepare(`
      INSERT INTO call_logs (
        contact_name, contact_type, phone, direction,
        subject, summary, requires_followup, followup_date
      ) VALUES (
        @contact_name, @contact_type, @phone, @direction,
        @subject, @summary, @requires_followup, @followup_date
      )
    `);

    const info = stmt.run({
      contact_name: input.contact_name,
      contact_type: input.contact_type,
      phone: input.phone ?? null,
      direction: input.direction,
      subject: input.subject,
      summary: input.summary ?? null,
      requires_followup: input.requires_followup ? 1 : 0,
      followup_date: input.followup_date ?? null,
    });

    return callsRepo.findById(info.lastInsertRowid as number) as CallLog;
  },

  update: (id: number, input: UpdateCallLogInput): boolean => {
    const updates: string[] = [];
    const values: Record<string, unknown> = { id };

    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'requires_followup' || key === 'followup_done') {
          updates.push(`${key} = @${key}`);
          values[key] = value ? 1 : 0;
        } else {
          updates.push(`${key} = @${key}`);
          values[key] = value;
        }
      }
    });

    if (updates.length === 0) return false;

    const query = `UPDATE call_logs SET ${updates.join(', ')} WHERE id = @id`;
    const info = getDb().prepare(query).run(values);
    return info.changes > 0;
  },

  markFollowupDone: (id: number): boolean => {
    const info = getDb().prepare(`
      UPDATE call_logs SET followup_done = 1 WHERE id = ?
    `).run(id);
    return info.changes > 0;
  },

  delete: (id: number): boolean => {
    const info = getDb().prepare('DELETE FROM call_logs WHERE id = ?').run(id);
    return info.changes > 0;
  },
};
