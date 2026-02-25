import { createContext } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  organization_id?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  organization_name: string;
  organization_address: string;
  phone_number: string;
} & LoginCredentials;

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
