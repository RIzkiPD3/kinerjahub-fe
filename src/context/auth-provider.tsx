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
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (credentials: LoginCredentials) => {
    const response = await api.post("/auth/login", credentials);
    const { token, user: userData } = response.data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    console.log("Login successful:", userData);
  };

  const register = async (data: RegisterData) => {
    const response = await api.post("/auth/register", data);
    const { token, user: userData } = response.data.data || response.data; // Flexible for different response structures
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
