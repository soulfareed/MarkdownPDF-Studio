import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

// Interceptor to add the Authorization header with the token if it exists

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to register a user
export const register = async (
  email: string,
  password: string,
  name?: string
) => {
  return api.post("/auth/register", { email, password, name });
};

// Function to log in a user
export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response;
};

export const logout = async () => {
  localStorage.removeItem("token");
};

export const getDocuments = async () => {
  return api.get("/documents");
};

export const getDocument = async (id: string) => {
  return api.get(`/documents/${id}`);
};

export const createDocument = async (title: string, content: string) => {
  return api.post("/documents", { title, content });
};

export const updateDocument = async (
  id: string,
  title: string,
  content: string
) => {
  return api.put(`/documents/${id}`, { title, content });
};

export const deleteDocument = async (id: string) => {
  return api.delete(`/documents/${id}`);
};

export default api;
