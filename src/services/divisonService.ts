import api from "@/lib/api";

export interface Division {
  id: string;
  name: string;
  organization_id: string;
  head?: string;
  description?: string;
}

export const divisionService = {
  // Get all divisions
  async getAll(): Promise<Division[]> {
    const response = await api.get("/divisions");
    return Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
  },

  // Get single division
  async getById(id: string): Promise<Division> {
    const response = await api.get(`/divisions/${id}`);
    return response.data.data || response.data;
  },

  // Create division
  async create(data: {
    name: string;
    organization_id: string;
    head?: string;
    description?: string;
  }): Promise<Division> {
    const response = await api.post("/divisions", data);
    return response.data.data || response.data;
  },

  // Update division
  async update(
    id: string,
    data: {
      name?: string;
      organization_id?: string;
      head?: string;
      description?: string;
    },
  ): Promise<Division> {
    const response = await api.put(`/divisions/${id}`, data);
    return response.data.data || response.data;
  },

  // Delete division
  async delete(id: string): Promise<void> {
    await api.delete(`/divisions/${id}`);
  },
  department_id: string;
}

export const getDivisionsByDepartment = async (
  departmentId: string
): Promise<Division[]> => {
  const response = await api.get(
    `/divisions?department_id=${departmentId}`
  );
  return response.data;
};
