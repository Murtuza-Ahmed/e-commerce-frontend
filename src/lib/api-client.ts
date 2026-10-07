/**
 * Typed HTTP client for the backend API (NestJS + PostgreSQL — jab ready ho).
 *
 * - Base URL `VITE_API_URL` env var se aata hai (e.g. https://api.al-ucaaz.com/api)
 * - `VITE_USE_API=true` hone par hi API calls hoti hain, warna src/api/* local data deta hai
 * - JSON errors ko ApiError me wrap karta hai taake UI me sahi message dikhe
 */

function getApiBaseUrl(): string {
  // Har call par parho taake env change (tests, HMR) sahi reflect ho —
  // Vite build me import.meta.env waise bhi static inline ho jata hai.
  return ((import.meta.env.VITE_API_URL as string | undefined) ?? "").replace(/\/$/, "");
}

export function isApiEnabled(): boolean {
  return (import.meta.env.VITE_USE_API as string | undefined) === "true" && getApiBaseUrl().length > 0;
}

export function getApiUrl(): string {
  return getApiBaseUrl();
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body" | "headers"> {
  body?: unknown;
  headers?: Record<string, string>;
  /** Bearer token — auth store se aayega jab backend lagega */
  token?: string;
  timeoutMs?: number;
}

function parseBody(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text.slice(0, 300) };
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, timeoutMs = 15000, headers, ...init } = options;
  const apiUrl = getApiBaseUrl();

  if (!apiUrl) {
    throw new ApiError(0, "VITE_API_URL set nahi hai");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${apiUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = parseBody(await res.text());

    if (!res.ok) {
      const payload = (data ?? {}) as { message?: unknown; code?: string };
      const rawMessage = payload.message ?? res.statusText;
      const message = Array.isArray(rawMessage) ? rawMessage.join(", ") : String(rawMessage);
      throw new ApiError(res.status, message, payload.code, data);
    }

    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(0, "Request timed out — backend jawab nahi de raha");
    }
    throw new ApiError(0, "Network error — backend se connect nahi ho saka");
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST" }),
  put: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT" }),
  patch: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH" }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
