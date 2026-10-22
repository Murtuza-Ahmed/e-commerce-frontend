/**
 * RBAC API — `/api/rbac/*` (super_admin).
 *
 * BACKEND CONTRACT NOTE: backend permission object me field `name`
 * hota hai ("users:create"), jabke frontend `key` use karta hai —
 * yahan boundary par name -> key map karte hain.
 */
import { api } from "@/lib/api-client";
import type { Permission, Role } from "@/types";

/** Backend se aane wala raw permission — `name` field ke sath. */
interface BackendPermission extends Omit<Permission, "key" | "description"> {
  name: string;
  key?: string;
  description?: string | null;
}

interface BackendRole extends Omit<Role, "permissions"> {
  permissions?: BackendPermission[];
}

function normalizePermission(p: BackendPermission): Permission {
  return { id: p.id, key: p.key ?? p.name, description: p.description ?? "" };
}

function normalizeRole(r: BackendRole): Role {
  return { ...r, permissions: r.permissions?.map(normalizePermission) };
}

export async function listPermissions(): Promise<Permission[]> {
  const res = await api.get<BackendPermission[]>("/rbac/permissions");
  return res.map(normalizePermission);
}

export async function listRoles(): Promise<Role[]> {
  const res = await api.get<BackendRole[]>("/rbac/roles");
  return res.map(normalizeRole);
}

export async function getRole(id: string): Promise<Role> {
  return normalizeRole(await api.get<BackendRole>(`/rbac/roles/${id}`));
}

export async function createRole(input: { name: string; description?: string; level?: number }): Promise<Role> {
  return normalizeRole(await api.post<BackendRole>("/rbac/roles", { body: input }));
}

export async function updateRole(id: string, input: { name?: string; description?: string }): Promise<Role> {
  return normalizeRole(await api.patch<BackendRole>(`/rbac/roles/${id}`, { body: input }));
}

/** Backend `{ permissions: string[] }` mangta hai — permission NAMES ke sath, ids nahi. */
export async function setRolePermissions(id: string, permissionKeys: string[]): Promise<Role> {
  return normalizeRole(await api.put<BackendRole>(`/rbac/roles/${id}/permissions`, { body: { permissions: permissionKeys } }));
}

export async function deleteRole(id: string): Promise<void> {
  await api.delete<void>(`/rbac/roles/${id}`);
}
