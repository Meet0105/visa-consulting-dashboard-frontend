import axios from "axios";
import { getApiUrl } from "./config";

export const API_BASE = getApiUrl();

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Add token from localStorage to all requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        const isPublicRoute = path === "/login" || path === "/signup" || path === "/";
        const isDashboardRoute = path.startsWith("/dashboard");
        // Only force redirect on protected areas; keep public pages in place
        if (!isPublicRoute && isDashboardRoute) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { api };