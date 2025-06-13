import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from "../api/api";
import { jwtDecode } from "jwt-decode";

interface User {
  email: string;
  sub: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
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
    const decoded = jwtDecode<User>(response.data.access_token);
    localStorage.setItem("token", response.data.access_token);
    setUser(decoded);
  };

  const register = async (email: string, password: string, name?: string) => {
    const response = await apiRegister(email, password, name);
    if (response.data.access_token) {
      const decoded = jwtDecode<User>(response.data.access_token);
      localStorage.setItem("token", response.data.access_token);
      setUser(decoded);
    }
  };

  const logout = async () => {
    await apiLogout();
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
