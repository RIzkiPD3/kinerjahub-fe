import api from "@/api/axiosInstance";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};