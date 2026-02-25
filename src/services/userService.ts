import api from "@/lib/api";

export interface Role {
  id: string;
  name: string;
}

export interface Division {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Organization {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  organization: Organization;
  department: Department;
  division: Division;
  role: Role;
  created_at: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  department_id: string;
  division_id: string;
  organization_id: string;
  role_id: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  department_id?: string;
  division_id?: string;
  role_id?: string;
}

export const userService = {
  // Get all users
  async getAll(): Promise<User[]> {
    const response = await api.get("/users");
    return Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
  },

  // Get single user
  async getById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data.data || response.data;
  },

  // Create user
  async create(payload: CreateUserPayload): Promise<User> {
    const response = await api.post("/users", payload);
    return response.data.data || response.data;
  },

  // Update user
  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const response = await api.put(`/users/${id}`, payload);
    return response.data.data || response.data;
  },

  // Delete user
  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/users/${id}`);
    return response.data.data || response.data;
  },
};

// Backward compatibility exports
export const getUsers = userService.getAll;
export const getUserDetail = userService.getById;
export const createUser = userService.create;
export const updateUser = userService.update;
export const deleteUser = userService.delete;
