/**
 * Users API — `/api/users/*`.
 * Self-service (`/me/*`) har logged-in user ke liye; baqi admin permissions chahte hain.
 *
 * BACKEND CONTRACT NOTE:
 * - Backend user object me `role` ek OBJECT hota hai ({ id, name, level }),
 *   jabke frontend har jagah role ka NAME (string) use karta hai — is liye
 *   yahan boundary par normalize karte hain (role object -> role name).
 * - Create / set-role me backend ko `roleId` (UUID) chahiye, naam nahi —
 *   naam se id yahin resolve hoti hai (pehle dekhe hue users se cache,
 *   warna roles list se; roles list sirf super_admin khol sakta hai,
 *   aur set-role bhi wese hi sirf super_admin ka kaam hai).
 */
import { api, uploadFile } from "@/lib/api-client";
import type { Paginated, User, UserRole } from "@/types";
import { listRoles } from "./rbac";

/** Backend se aane wala raw user — role object ke sath. */
export interface BackendUser extends Omit<User, "role"> {
  role: { id: string; name: UserRole; level: number } | UserRole;
}

/** role name -> roleId cache (user objects se bhar jata hai). */
const roleIds = new Map<UserRole, string>();

export function normalizeUser(raw: BackendUser): User {
  if (raw.role && typeof raw.role === "object") {
    if (raw.role.id) roleIds.set(raw.role.name, raw.role.id);
    return { ...raw, role: raw.role.name };
  }
  return { ...raw, role: raw.role as UserRole };
}

async function roleIdByName(name: UserRole): Promise<string> {
  const cached = roleIds.get(name);
  if (cached) return cached;
  const roles = await listRoles().catch(() => []);
  for (const r of roles) roleIds.set(r.name as UserRole, r.id);
  const id = roleIds.get(name);
  if (!id) throw new Error(`Role resolve nahi ho saka: ${name}`);
  return id;
}

export async function getMe(): Promise<User> {
  return normalizeUser(await api.get<BackendUser>("/users/me"));
}

export async function updateMe(input: { name?: string; phone?: string }): Promise<User> {
  return normalizeUser(await api.patch<BackendUser>("/users/me", { body: input }));
}

export async function changePassword(input: { currentPassword: string; newPassword: string }) {
  return api.post<{ message: string }>("/users/me/change-password", { body: input });
}

export async function uploadAvatar(file: File): Promise<User> {
  // Dedicated avatar endpoint PATCH hai aur file field ka naam 'file' mangta hai
  const form = new FormData();
  form.append("file", file);
  return normalizeUser(await uploadFile<BackendUser>("/users/me/avatar", form, "PATCH"));
}

export async function deleteAvatar(): Promise<User> {
  return normalizeUser(await api.delete<BackendUser>("/users/me/avatar"));
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
  const res = await api.get<Paginated<BackendUser>>(`/users${suffix}`);
  return { ...res, data: res.data.map(normalizeUser) };
}

export async function getUser(id: string): Promise<User> {
  return normalizeUser(await api.get<BackendUser>(`/users/${id}`));
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}): Promise<User> {
  const { role, ...rest } = input;
  const roleId = await roleIdByName(role ?? "customer");
  return normalizeUser(await api.post<BackendUser>("/users", { body: { ...rest, roleId } }));
}

export async function updateUser(id: string, input: { name?: string; phone?: string }): Promise<User> {
  return normalizeUser(await api.patch<BackendUser>(`/users/${id}`, { body: input }));
}

export async function setUserRole(id: string, role: UserRole): Promise<User> {
  const roleId = await roleIdByName(role);
  return normalizeUser(await api.patch<BackendUser>(`/users/${id}/role`, { body: { roleId } }));
}

export async function setUserActive(id: string, isActive: boolean): Promise<User> {
  return normalizeUser(await api.patch<BackendUser>(`/users/${id}/active`, { body: { isActive } }));
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete<void>(`/users/${id}`);
}
