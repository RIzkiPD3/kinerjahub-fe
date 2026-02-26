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
    console.log("Creating department with data:", data);

    const payload = {
      name: data.name,
      head: data.head,
      division_id: data.division_id,
      description: data.description || null,
      status: data.status || "active",
    };

    console.log("Sending payload:", payload);

    try {
      const response = await api.post("/departments", payload);
      console.log("Create response:", response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error in create department:", error);
      throw error;
    }
  },

  // Update department
  async update(id: string, data: UpdateDepartmentDto): Promise<Department> {
    console.log("Updating department:", id, "with data:", data);

    const payload = {
      name: data.name,
      head: data.head,
      description: data.description || null,
      status: data.status || "active",
    };

    const response = await api.put(`/departments/${id}`, payload);
    return response.data.data || response.data;
  },

  // Delete department
  async delete(id: string): Promise<void> {
    await api.delete(`/departments/${id}`);
  },
};
// Backward compatibility exports
export const getDepartments = departmentsService.getAll;
