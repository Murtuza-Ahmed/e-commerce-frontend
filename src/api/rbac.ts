/**
 * RBAC API — `/api/rbac/*` (super_admin).
 */
import { api } from "@/lib/api-client";
import type { Permission, Role } from "@/types";

export async function listPermissions(): Promise<Permission[]> {
  return api.get<Permission[]>("/rbac/permissions");
}

export async function listRoles(): Promise<Role[]> {
  return api.get<Role[]>("/rbac/roles");
}

export async function getRole(id: string): Promise<Role> {
  return api.get<Role>(`/rbac/roles/${id}`);
}

export async function createRole(input: { name: string; description?: string; level?: number }): Promise<Role> {
  return api.post<Role>("/rbac/roles", { body: input });
}

export async function updateRole(id: string, input: { name?: string; description?: string }): Promise<Role> {
  return api.patch<Role>(`/rbac/roles/${id}`, { body: input });
}

export async function setRolePermissions(id: string, permissionIds: string[]): Promise<Role> {
  return api.put<Role>(`/rbac/roles/${id}/permissions`, { body: { permissionIds } });
}

export async function deleteRole(id: string): Promise<void> {
  await api.delete<void>(`/rbac/roles/${id}`);
}
