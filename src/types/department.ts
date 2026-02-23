export interface Department {
  id: string;
  name: string;
  head: string;
  head_email?: string;
  members: number;
  status: "active" | "inactive";
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDepartmentDto {
  name: string;
  head: string;
  head_email?: string;
  description?: string;
  status?: "active" | "inactive";
}

export type UpdateDepartmentDto = Partial<CreateDepartmentDto>;
