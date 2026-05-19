export type NoteStatus = 'pending' | 'inprogress' | 'done';

export interface Note {
  id: number;
  title: string;
  content: string | null;
  status: NoteStatus;
  color: string;
  position: number;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  title: string;
  content?: string;
  status?: NoteStatus;
  color?: string;
  position?: number;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  status?: NoteStatus;
  color?: string;
  position?: number;
}
