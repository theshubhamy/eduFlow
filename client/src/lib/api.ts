import axios, { type AxiosError } from "axios";

// For cookie-based authentication, always send credentials on cross-site requests.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (
    config.data !== undefined &&
    config.data !== null &&
    typeof config.data === "object" &&
    !(config.data instanceof FormData) &&
    config.headers &&
    !("Content-Type" in config.headers)
  ) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const data = error.response.data;
      const message =
        data && typeof data === "object" && "message" in data
          ? String((data as Record<string, unknown>).message)
          : error.message;
      return Promise.reject(new Error(message));
    }

    return Promise.reject(new Error(error.message));
  },
);

export default api;
