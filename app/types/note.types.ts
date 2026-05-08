export interface Note {
  id: number;
  title: string;
  content: string | null;
  status: 'pending' | 'inprogress' | 'done';
  color: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  title: string;
  content?: string;
  status?: Note['status'];
  color?: string;
  position?: number;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  status?: Note['status'];
  color?: string;
  position?: number;
}
