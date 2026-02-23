import api from "@/lib/api";

export interface Department {
  id: string;
  name: string;
}

export const getDepartments = async (): Promise<Department[]> => {
  const response = await api.get("/departments");
  return response.data;
};

