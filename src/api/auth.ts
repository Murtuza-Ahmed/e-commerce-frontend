/**
 * Auth API — login, register, session.
 *
 * Backend (NestJS) ke liye tayyar endpoints:
 *   POST /auth/login   { email, password } -> { user, accessToken }
 *   POST /auth/register { name, email, password } -> { user, accessToken }
 *   GET  /auth/me      (Bearer token) -> User
 *   POST /auth/logout  (Bearer token)
 *
 * Abhi local dummy mode me hai (wahi behavior jo store/auth.ts me hai).
 * Backend lagne par sirf VITE_USE_API=true + VITE_API_URL set karna hai —
 * phir token ko store/auth.ts me save karke har request me bhejna hai.
 */
import { api, isApiEnabled } from "@/lib/api-client";
import type { User } from "@/types";

export interface AuthResponse {
  user: User;
  accessToken: string;
}

function dummyUser(email: string, name?: string): User {
  return {
    id: "1",
    name: name ?? email.split("@")[0],
    email,
    role: email.includes("admin") ? "admin" : "customer",
  };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  if (!isApiEnabled()) {
    return { user: dummyUser(email), accessToken: "local-dummy-token" };
  }
  return api.post<AuthResponse>("/auth/login", { body: { email, password } });
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  if (!isApiEnabled()) {
    return {
      user: { ...dummyUser(email, name), id: Date.now().toString() },
      accessToken: "local-dummy-token",
    };
  }
  return api.post<AuthResponse>("/auth/register", { body: { name, email, password } });
}

export async function getMe(token: string): Promise<User | null> {
  if (!isApiEnabled()) return null;
  try {
    return await api.get<User>("/auth/me", { token });
  } catch {
    return null;
  }
}

export async function logout(token: string): Promise<void> {
  if (!isApiEnabled()) return;
  try {
    await api.post<void>("/auth/logout", { token });
  } catch {
    // logout hamesha local state bhi clear karega — error ignore
  }
}
