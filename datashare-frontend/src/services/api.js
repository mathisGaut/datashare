import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRoute = ["/login", "/register"].some((path) =>
        window.location.pathname.startsWith(path),
      );

      if (!isAuthRoute && !window.location.pathname.startsWith("/download")) {
        localStorage.removeItem("token");
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
