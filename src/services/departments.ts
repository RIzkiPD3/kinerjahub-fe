import api from "@/lib/api";
import type {
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from "@/types/department";

export const departmentsService = {
  // Get all departments
  async getAll(): Promise<Department[]> {
    const response = await api.get("/departments");
    return Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
  },

  // Get single department
  async getById(id: string): Promise<Department> {
    const response = await api.get(`/departments/${id}`);
    return response.data.data || response.data;
  },

  // Create department
  async create(data: CreateDepartmentDto): Promise<Department> {
    const response = await api.post("/departments", data);
    return response.data.data || response.data;
  },

  // Update department
  async update(id: string, data: UpdateDepartmentDto): Promise<Department> {
    const response = await api.put(`/departments/${id}`, data);
    return response.data.data || response.data;
  },

  // Delete department
  async delete(id: string): Promise<void> {
    await api.delete(`/departments/${id}`);
  },
};
