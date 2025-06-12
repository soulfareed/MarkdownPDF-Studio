import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  login as apiLogin,
  register as apiregister,
  logout as apiLogout,
} from "../api/api";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password);
    const decoded: any = jwtDecode(response.data.access_token);
    setUser(decoded);
  };

  const register = async (email: string, password: string, name?: string) => {
    const response = await apiResister(email, password, name);
    if (response.data.access_token) {
      const decoded: any = jwtDecode(response.data.access_token);
      setUser(decoded);
    }
  };
  const logout = async () => {
    await apiLogout();
    setUser(null);
  };
  const value = { user, loading, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  return useContext(AuthContext);
}
