export interface Client {
  id: number;
  name: string;
  phone: string;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateClientInput {
  name: string;
  phone: string;
  address?: string | null;
  notes?: string | null;
}

export interface UpdateClientInput {
  name?: string;
  phone?: string;
  address?: string | null;
  notes?: string | null;
}
