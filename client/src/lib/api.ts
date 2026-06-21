export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Ensure endpoints lead with a slash
  const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Ensure session cookies are sent with requests
  });

  if (!response.ok) {
    let errorMessage = "An unexpected error occurred.";
    try {
      const data = await response.json();
      errorMessage = data.error || data.message || errorMessage;
    } catch {
      try {
        errorMessage = await response.text();
      } catch {
        // Fallback if reading fails
      }
    }
    throw new ApiError(errorMessage, response.status);
  }

  const contentType = response.headers.get("Content-Type") || response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return {} as T;
}
