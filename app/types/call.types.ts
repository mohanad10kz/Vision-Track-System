export type CallContactType = 'client' | 'company' | 'supplier' | 'other';
export type CallDirection = 'incoming' | 'outgoing';

export interface CallLog {
  id: number;
  contact_name: string;
  contact_type: CallContactType;
  phone: string | null;
  direction: CallDirection;
  subject: string;
  summary: string | null;
  requires_followup: number; // 0 | 1 (SQLite boolean)
  followup_date: string | null;
  followup_done: number; // 0 | 1 (SQLite boolean)
  created_at: string;
}

export interface CreateCallLogInput {
  contact_name: string;
  contact_type: CallContactType;
  phone?: string | null;
  direction: CallDirection;
  subject: string;
  summary?: string | null;
  requires_followup?: boolean;
  followup_date?: string | null;
}

export interface UpdateCallLogInput {
  contact_name?: string;
  contact_type?: CallContactType;
  phone?: string | null;
  direction?: CallDirection;
  subject?: string;
  summary?: string | null;
  requires_followup?: boolean;
  followup_date?: string | null;
  followup_done?: boolean;
}
