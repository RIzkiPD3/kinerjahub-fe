export interface Department {
  id: string;
  name: string;
  division_id: string;
  head?: string;
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
}

export type UpdateDepartmentDto = Partial<CreateDepartmentDto>;
