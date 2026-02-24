import api from "@/lib/api";

export interface Division {
  id: string;
  name: string;
}

export interface CreateDivisionDTO {
  name: string;
  organization_id: string;
}

export interface UpdateDivisionDTO {
  name?: string;
  organization_id?: string;
}

export const getDivisions = async (): Promise<Division[]> => {
  const response = await api.get("/divisions");
  return response.data;
};

export const createDivision = async (
  data: CreateDivisionDTO
): Promise<Division> => {
  const response = await api.post("/divisions", data);
  return response.data;
};

export const updateDivision = async (
  id: string,
  data: UpdateDivisionDTO
): Promise<Division> => {
  const response = await api.put(`/divisions/${id}`, data);
  return response.data;
};

export const deleteDivision = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/divisions/${id}`);
  return response.data;
};

export const getDivisionsByDepartment = async (
  departmentId: string
): Promise<Division[]> => {
  const response = await api.get(`/divisions?department_id=${departmentId}`);
  return response.data;
};
