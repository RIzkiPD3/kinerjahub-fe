import api from "@/lib/api";

/* ================= TYPES ================= */

export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  organization_id: string;
  department_id: string;
  role: Role | null;
  created_at: string;
}


export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  organization_id: string;
  department_id: string;
  division_id: string;
  role_id: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
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
): Promise<{
  id: string;
  name: string;
  email: string;
  role_id: string;
}> => {
  const { data } = await api.post("/users", payload);
  return data;
};

export const updateUser = async (
  id: string,
  payload: UpdateUserPayload
): Promise<{
  id: string;
  name: string;
  email: string;
  role_id: string;
}> => {
  const { data } = await api.put(`/users/${id}`, payload);
  return data;
};

export const deleteUser = async (
  id: string
): Promise<{ message: string }> => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
