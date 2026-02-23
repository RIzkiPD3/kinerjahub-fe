import api from "@/lib/api";

export interface Role {
  id: string;
  name: string;
}

export const getRoles = async (): Promise<Role[]> => {
  const { data } = await api.get("/roles");
  return data;
};

export const createRole = async (name: string) => {
  const { data } = await api.post("/roles", { name });
  return data;
};