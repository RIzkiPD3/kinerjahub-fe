import axios from "axios";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL ||
    "https://kinerjahub-be-production.up.railway.app") + "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("API Request with token:", config.url);
    } else {
      console.log("API Request without token:", config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor untuk handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized access - clearing token");
      localStorage.removeItem("token");
      // Redirect ke login jika perlu
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
