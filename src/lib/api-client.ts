/**
 * Typed HTTP client for the Al-ucaaz backend API (NestJS).
 *
 * - Base URL `VITE_API_URL` se aata hai (e.g. http://localhost:3000/api)
 * - Har authenticated request me Bearer token lagta hai
 * - 401 par access token ko `/auth/refresh` se renew karke request
 *   ek dafa retry hoti hai; refresh fail ho to user logout ho jata hai
 * - JSON errors `ApiError` me wrap hote hain (status + backend message)
 */

function getApiBaseUrl(): string {
  return ((import.meta.env.VITE_API_URL as string | undefined) ?? "").replace(/\/$/, "");
}

export function isApiEnabled(): boolean {
  return getApiBaseUrl().length > 0;
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
  /** Agar false ho to token nahi lagega (public endpoints) */
  auth?: boolean;
  timeoutMs?: number;
  /** Internal: 401-retry me dobara refresh na ho */
  _retried?: boolean;
}

interface AuthHooks {
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<string | null>;
  onAuthExpired: () => void;
}

let hooks: AuthHooks | null = null;

/** Auth store se ek dafa call hota hai (circular import se bachne ke liye). */
export function configureApiClient(h: AuthHooks): void {
  hooks = h;
}

function parseBody(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text.slice(0, 300) };
  }
}

/** Ye paths khud auth ke hain — in par 401-retry ka koi faida nahi. */
function isAuthPath(path: string): boolean {
  return (
    path.startsWith("/auth/login") ||
    path.startsWith("/auth/refresh") ||
    path.startsWith("/auth/signup")
  );
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, auth = true, timeoutMs = 15000, _retried = false, ...init } = options;
  const apiUrl = getApiBaseUrl();

  if (!apiUrl) {
    throw new ApiError(0, "Backend connect nahi hai — VITE_API_URL set karen");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const token = auth && hooks ? hooks.getAccessToken() : null;
    const res = await fetch(`${apiUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    // 401 → token renew karke ek dafa retry
    if (res.status === 401 && auth && !_retried && !isAuthPath(path) && hooks) {
      const newToken = await hooks.refreshAccessToken().catch(() => null);
      if (newToken) {
        return request<T>(path, { ...options, _retried: true });
      }
      hooks.onAuthExpired();
      throw new ApiError(401, "Session khatam ho gaya — dobara login karen");
    }

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

/** Multipart upload ke liye — JSON Content-Type nahi lagta.
 *  request() ki tarah 401 par token renew karke ek dafa retry hota hai. */
export async function uploadFile<T>(
  path: string,
  form: FormData,
  method: "POST" | "PATCH" = "POST"
): Promise<T> {
  const apiUrl = getApiBaseUrl();
  if (!apiUrl) throw new ApiError(0, "Backend connect nahi hai — VITE_API_URL set karen");

  const attempt = async (token: string | null): Promise<Response> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      return await fetch(`${apiUrl}${path}`, {
        method,
        signal: controller.signal,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new ApiError(0, "Request timed out — backend jawab nahi de raha");
      }
      throw new ApiError(0, "Network error — backend se connect nahi ho saka");
    } finally {
      clearTimeout(timer);
    }
  };

  let res = await attempt(hooks?.getAccessToken() ?? null);

  // 401 → token renew karke ek dafa retry (request() wala hi rawaj)
  if (res.status === 401 && hooks && !isAuthPath(path)) {
    const newToken = await hooks.refreshAccessToken().catch(() => null);
    if (newToken) {
      res = await attempt(newToken);
    } else {
      hooks.onAuthExpired();
      throw new ApiError(401, "Session khatam ho gaya — dobara login karen");
    }
  }

  const data = parseBody(await res.text());
  if (!res.ok) {
    const payload = (data ?? {}) as { message?: unknown };
    const raw = payload.message ?? res.statusText;
    throw new ApiError(res.status, Array.isArray(raw) ? raw.join(", ") : String(raw), undefined, data);
  }
  return data as T;
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
