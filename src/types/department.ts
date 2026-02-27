export interface Department {
  id: string;
  name: string;
  division_id: string;
  head?: string;
  description?: string;
  status: "active" | "inactive";
  organization?: {
    id: string;
    name: string;
  };
  division?: {
    id: string;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CreateDepartmentDto {
  name: string;
  division_id: string;
  head?: string;
  description?: string;
  status?: "active" | "inactive";
}

export type UpdateDepartmentDto = Partial<CreateDepartmentDto>;
