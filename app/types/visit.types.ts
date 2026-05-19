export type VisitType = 'installation' | 'maintenance' | 'survey' | 'followup';
export type VisitStatus = 'scheduled' | 'completed' | 'cancelled' | 'postponed';

export interface Visit {
  id: number;
  client_id: number | null;
  client_name: string;
  client_phone: string;
  client_address: string | null;
  visit_type: VisitType;
  visit_date: string;
  visit_time: string | null;
  technician_id: number | null;
  technician_name: string | null;
  status: VisitStatus;
  problem_type: string | null;
  problem_desc: string | null;
  camera_count: number | null;
  system_type: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateVisitInput {
  client_id?: number | null;
  client_name: string;
  client_phone: string;
  client_address?: string | null;
  visit_type: VisitType;
  visit_date: string;
  visit_time?: string | null;
  technician_id?: number | null;
  technician_name?: string | null;
  status?: VisitStatus;
  problem_type?: string | null;
  problem_desc?: string | null;
  camera_count?: number | null;
  system_type?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string | null;
  resolution_notes?: string | null;
}

export interface UpdateVisitInput {
  client_name?: string;
  client_phone?: string;
  client_address?: string | null;
  visit_type?: VisitType;
  visit_date?: string;
  visit_time?: string | null;
  technician_id?: number | null;
  technician_name?: string | null;
  status?: VisitStatus;
  problem_type?: string | null;
  problem_desc?: string | null;
  camera_count?: number | null;
  system_type?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string | null;
  resolution_notes?: string | null;
}
