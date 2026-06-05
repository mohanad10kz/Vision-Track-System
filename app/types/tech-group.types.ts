export interface TechGroup {
  id: number;
  name: string;
  created_at: string;
}

export interface CreateTechGroupInput {
  name: string;
}

export interface UpdateTechGroupInput {
  name: string;
}
