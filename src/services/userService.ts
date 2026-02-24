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


export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>("/users");
  return data;
};

export const getUserDetail = async (id: string): Promise<User> => {
  const { data } = await api.get<User>(`/users/${id}`);
  return data;
};

export const createUser = async (
  payload: CreateUserPayload
): Promise<User> => {
  const response = await api.post("/users", payload);
  return response.data.data;
};

export const updateUser = async (
  id: string,
  payload: UpdateUserPayload
): Promise<User> => {
  const { data } = await api.put<User>(`/users/${id}`, payload);
  return data;
};

export const deleteUser = async (
  id: string
): Promise<{ message: string }> => {
  const { data } = await api.delete<{ message: string }>(`/users/${id}`);
  return data;
};
