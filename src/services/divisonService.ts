import api from "@/lib/api";

export interface Division {
  id: string;
  name: string;
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
