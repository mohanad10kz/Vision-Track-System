export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  position: number;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: Task['status'];
  position?: number;
  due_date?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: Task['status'];
  position?: number;
  due_date?: string | null;
}
