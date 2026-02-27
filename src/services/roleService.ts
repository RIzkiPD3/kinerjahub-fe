import api from "@/lib/api";

export interface Role {
  id: string;
  name: string;
}

export const roleService = {
  // Get all roles
  async getAll(): Promise<Role[]> {
    const response = await api.get("/roles");
    return Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
  },

  // Get single role
  async getById(id: string): Promise<Role> {
    const response = await api.get(`/roles/${id}`);
    return response.data.data || response.data;
  },

  // Create role
  async create(name: string): Promise<Role> {
    const response = await api.post("/roles", { name });
    return response.data.data || response.data;
  },

  // Update role - Per API.md uses PATCH
  async update(id: string, name: string): Promise<Role> {
    const response = await api.patch(`/roles/${id}`, { name });
    return response.data.data || response.data;
  },

  // Delete role
  async delete(id: string): Promise<void> {
    await api.delete(`/roles/${id}`);
  },
};

// Backward compatibility
export const getRoles = roleService.getAll;
export const createRole = roleService.create;
