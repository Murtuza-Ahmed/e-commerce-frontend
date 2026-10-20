/**
 * Audit API — `/api/audit-logs` (super_admin, `audit:read`).
 */
import { api } from "@/lib/api-client";
import type { AuditLog, Paginated } from "@/types";

export interface ListAuditParams {
  page?: number;
  limit?: number;
  action?: string;
  actor?: string;
  targetId?: string;
}

export async function listAuditLogs(params: ListAuditParams = {}): Promise<Paginated<AuditLog>> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.action) q.set("action", params.action);
  if (params.actor) q.set("actor", params.actor);
  if (params.targetId) q.set("targetId", params.targetId);
  const suffix = q.toString() ? `?${q.toString()}` : "";
  return api.get<Paginated<AuditLog>>(`/audit-logs${suffix}`);
}
