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
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  position?: number;
  due_date?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  position?: number;
  due_date?: string;
}
