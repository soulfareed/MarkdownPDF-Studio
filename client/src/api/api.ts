import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000, // Set a timeout of 10 seconds for requests
});

// Request interceptor to add the Authorization header
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      error.message = "Request timeout. Please try again.";
    }

    // // Handle unauthorized errors (401)
    // if (error.response?.status === 401) {
    //   localStorage.removeItem("token");
    //   // Optionally redirect to login page
    //   window.location.href = "/login";
    // }

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
  try {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response;
  } catch (error) {
    console.log("Login error:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Call logout endpoint if it exists
    await api.post("/auth/logout");
  } catch (error: any) {
    // If endpoint doesn't exist (404), we'll still proceed with client-side logout
    if (error.response?.status !== 404) {
      console.error("Logout error:", error);
    }
  } finally {
    // Always perform these client-side cleanup steps:

    // 1. Remove token from localStorage
    localStorage.removeItem("token");

    // 2. Remove authorization header from axios
    delete api.defaults.headers.common["Authorization"];

    // 3. Redirect to login page
    window.location.href = "/login";

    // Optional: Clear any other user-related data
    localStorage.removeItem("user");
  }
};

// export const getDocuments = async () => {
//   return api.get("/documents");
// };

export const getDocuments = async (id: string) => {
  return api.get(`/documents/${id}`);
};

export const createDocument = async (title: string, content: string) => {
  try {
    const response = await api.post("/documents", { title, content });
    return response.data;
  } catch (error: any) {
    console.error("Create error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateDocument = async (
  id: string,
  title: string,
  content: string
) => {
  try {
    const response = await api.put(`/documents/${id}`, { title, content });
    return response.data;
  } catch (error: any) {
    console.error("Update error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteDocument = async (id: string) => {
  return api.delete(`/documents/${id}`);
};

export default api;
