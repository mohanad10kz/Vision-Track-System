export type TechnicianSpecialty = 'installation' | 'maintenance' | 'programming' | 'all';
export type TechnicianStatus = 'available' | 'busy' | 'off';

export interface Technician {
  id: number;
  name: string;
  phone: string;
  specialty: TechnicianSpecialty | null;
  status: TechnicianStatus;
  notes: string | null;
  group_id: number | null;
  last_install_assigned_at: string | null;
  last_maint_assigned_at: string | null;
  created_at: string;
  // computed field (not in DB, added by frontend)
  todayVisitsCount?: number;
}

export interface CreateTechnicianInput {
  name: string;
  phone: string;
  specialty?: TechnicianSpecialty | null;
  notes?: string | null;
  group_id?: number | null;
}

export interface UpdateTechnicianInput {
  name?: string;
  phone?: string;
  specialty?: TechnicianSpecialty | null;
  status?: TechnicianStatus;
  notes?: string | null;
  group_id?: number | null;
}
