import axios from "axios";
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { api };