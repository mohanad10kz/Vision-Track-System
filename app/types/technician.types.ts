export type TechnicianSpecialty = 'installation' | 'maintenance' | 'programming' | 'all';
export type TechnicianStatus = 'available' | 'busy' | 'off';

export interface Technician {
  id: number;
  name: string;
  phone: string;
  specialty: TechnicianSpecialty | null;
  status: TechnicianStatus;
  notes: string | null;
  created_at: string;
  // computed field (not in DB, added by frontend)
  todayVisitsCount?: number;
}

export interface CreateTechnicianInput {
  name: string;
  phone: string;
  specialty?: TechnicianSpecialty | null;
  notes?: string | null;
}

export interface UpdateTechnicianInput {
  name?: string;
  phone?: string;
  specialty?: TechnicianSpecialty | null;
  status?: TechnicianStatus;
  notes?: string | null;
}
