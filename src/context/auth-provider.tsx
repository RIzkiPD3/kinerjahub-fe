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
    const hasToken = !!localStorage.getItem("token");
    console.log(
      "Auth state on init:",
      hasToken ? "Authenticated" : "Not authenticated",
    );
    return hasToken;
  });
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: LoginCredentials) => {
    console.log("Login attempt with email:", credentials.email);
    try {
      const response = await api.post("/auth/login", credentials);
      console.log("Login response:", response.data);

      // Cek struktur response dari API login
      // Berdasarkan log: {message: 'Login success', data: {user: {...}, token: '...'}}

      let userData;
      let token;

      // Format 1: { data: { user: {...}, token: '...' } }
      if (response.data.data?.user && response.data.data?.token) {
        userData = response.data.data.user;
        token = response.data.data.token;
      }
      // Format 2: { user: {...}, token: '...' }
      else if (response.data.user && response.data.token) {
        userData = response.data.user;
        token = response.data.token;
      }
      // Format 3: { data: {...user, token} } - user data langsung dengan token
      else if (response.data.data?.id && response.data.data?.token) {
        userData = response.data.data;
        token = response.data.data.token;
      }
      // Format tidak dikenal
      else {
        console.log("Unexpected login response format:", response.data);
        throw new Error("Format response login tidak dikenal");
      }

      if (token && userData) {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
        setUser(userData);
        console.log("Login success:", {
          userId: userData.id,
          email: userData.email,
          organization_id:
            userData.organization_id || userData.organization?.id,
        });
      } else {
        throw new Error("Token atau user data tidak ditemukan dalam response");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
    const response = await api.post("/auth/login", credentials);
    const { token, user: userData } = response.data.data;
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUser(userData);
    console.log("Login successful:", userData);
    console.log("Token stored in localStorage:", token);
  };

  const register = async (data: RegisterData) => {
    console.log("Register attempt with email:", data.email);
    try {
      const response = await api.post("/auth/register", data);
      console.log("Register response:", response.data);

      // Cek struktur response dari API register
      // Berdasarkan log: {message: 'Register success', data: {user: {...}}}

      let userData;
      let token;

      // Format 1: { data: { user: {...} } } - tanpa token
      if (response.data.data?.user) {
        userData = response.data.data.user;
        token = null;
      }
      // Format 2: { data: {...user} } - langsung data user tanpa token
      else if (response.data.data?.id) {
        userData = response.data.data;
        token = null;
      }
      // Format 3: { user: {...}, message: '...' } - user data di root
      else if (response.data.user?.id) {
        userData = response.data.user;
        token = null;
      }
      // Format 4: Ada token (langsung login setelah register)
      else if (response.data.token) {
        token = response.data.token;
        userData = response.data.user || response.data.data;
      }
      // Format tidak dikenal
      else {
        console.log("Unexpected register response format:", response.data);
        userData = null;
        token = null;
      }

      if (token) {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
        if (userData) {
          setUser(userData);
        }
      } else {
        // Jika tidak ada token, jangan set authenticated
        setIsAuthenticated(false);
        setUser(null);
      }

      console.log("Register processed:", {
        hasToken: !!token,
        hasUserData: !!userData,
        isAuthenticated: !!token,
      });
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("Logout user:", user?.email);
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
