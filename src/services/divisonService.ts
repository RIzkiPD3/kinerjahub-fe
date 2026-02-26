import api from "@/lib/api";

export interface Division {
  id: string;
  name: string;
  organization_id: string;
  department_id?: string;
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

  // Get divisions by department
  async getByDepartment(departmentId: string): Promise<Division[]> {
    const response = await api.get(`/divisions?department_id=${departmentId}`);
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
    department_id?: string;
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
      department_id?: string;
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
};

// Keep the old export for backward compatibility if needed, but deprecate it in favor of divisionService
export const getDivisionsByDepartment = divisionService.getByDepartment;
