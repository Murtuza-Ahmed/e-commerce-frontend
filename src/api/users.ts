/**
 * Users API — `/api/users/*`.
 * Self-service (`/me/*`) har logged-in user ke liye; baqi admin permissions chahte hain.
 */
import { api, uploadFile } from "@/lib/api-client";
import type { Paginated, User, UserRole } from "@/types";

export async function getMe(): Promise<User> {
  return api.get<User>("/users/me");
}

export async function updateMe(input: { name?: string; phone?: string }): Promise<User> {
  return api.patch<User>("/users/me", { body: input });
}

export async function changePassword(input: { currentPassword: string; newPassword: string }) {
  return api.post<{ message: string }>("/users/me/change-password", { body: input });
}

export async function uploadAvatar(file: File): Promise<User> {
  const form = new FormData();
  form.append("avatar", file);
  return uploadFile<User>("/users/me/avatar", form);
}

export async function deleteAvatar(): Promise<User> {
  return api.delete<User>("/users/me/avatar");
}

// ---------- admin ----------

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function listUsers(params: ListUsersParams = {}): Promise<Paginated<User>> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.search) q.set("search", params.search);
  const suffix = q.toString() ? `?${q.toString()}` : "";
  return api.get<Paginated<User>>(`/users${suffix}`);
}

export async function getUser(id: string): Promise<User> {
  return api.get<User>(`/users/${id}`);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}): Promise<User> {
  return api.post<User>("/users", { body: input });
}

export async function updateUser(id: string, input: { name?: string; phone?: string }): Promise<User> {
  return api.patch<User>(`/users/${id}`, { body: input });
}

export async function setUserRole(id: string, role: UserRole): Promise<User> {
  return api.patch<User>(`/users/${id}/role`, { body: { role } });
}

export async function setUserActive(id: string, isActive: boolean): Promise<User> {
  return api.patch<User>(`/users/${id}/active`, { body: { isActive } });
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete<void>(`/users/${id}`);
}
