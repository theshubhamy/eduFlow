import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';

export class ApiError extends Error {
  status: number | null;
  data: unknown | null;

  constructor(
    message: string,
    status: number | null = null,
    data: unknown = null,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// For cookie-based authentication, always send credentials on cross-site requests.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(config => {
  if (
    config.data !== undefined &&
    config.data !== null &&
    typeof config.data === 'object' &&
    !(config.data instanceof FormData) &&
    config.headers &&
    !('Content-Type' in config.headers)
  ) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const message =
        data && typeof data === 'object' && 'message' in data
          ? String((data as any).message)
          : error.message;
      return Promise.reject(new ApiError(message, status, data));
    }

    return Promise.reject(new ApiError(error.message, null, null));
  },
);

export type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

/**
 * Wrapper around axios instance for convenient API calls.
 * Automatically extracts response data and handles errors consistently.
 */
export async function apiFetch<T = unknown>(
  url: string,
  options?: ApiFetchOptions,
): Promise<T> {
  const { method = 'GET', headers, body, ...rest } = options ?? {};

  const config: AxiosRequestConfig = {
    url,
    method: method.toLowerCase() as AxiosRequestConfig['method'],
    headers,
    data: body,
    ...rest,
  };

  const response = await api.request<T>(config);
  return response.data;
}

export default api;
