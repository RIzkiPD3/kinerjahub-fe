import { useState, type ReactNode } from "react";
import {
  AuthContext,
  type User,
  type LoginCredentials,
  type RegisterData,
} from "./auth-context";
import api from "@/lib/api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: LoginCredentials) => {
    const response = await api.post("/auth/login", credentials);
    const { token, user: userData } = response.data;
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const register = async (data: RegisterData) => {
    const response = await api.post("/auth/register", data);
    const { token, user: userData } = response.data;
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
