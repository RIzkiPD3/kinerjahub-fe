import api from "@/lib/api";

export interface Department {
  id: string;
  name: string;
  division_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDepartmentDTO {
  name: string;
  division_id: string;
}

export interface UpdateDepartmentDTO {
  name?: string;
  division_id?: string;
}

export const getDepartments = async (): Promise<Department[]> => {
  const response = await api.get("/departments");
  return response.data;
};

export const createDepartment = async (
  data: CreateDepartmentDTO
): Promise<Department> => {
  const response = await api.post("/departments", data);
  return response.data;
};

export const updateDepartment = async (
  id: string,
  data: UpdateDepartmentDTO
): Promise<Department> => {
  const response = await api.put(`/departments/${id}`, data);
  return response.data;
};

export const deleteDepartment = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/departments/${id}`);
  return response.data;
};

export const getDepartmentsByDivision = async (
  divisionId: string
): Promise<Department[]> => {
  const response = await api.get(`/departments?division_id=${divisionId}`);
  return response.data;
};
