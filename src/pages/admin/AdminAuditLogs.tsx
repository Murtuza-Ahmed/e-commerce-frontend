import { useCallback, useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { TableSkeleton } from "@/components/ui/skeleton-loader";
import { ApiError } from "@/lib/api-client";
import { listAuditLogs } from "@/api/audit";
import type { AuditLog } from "@/types";
import { toast } from "sonner";
import { Search, ChevronLeft, ChevronRight, ScrollText, Loader2 } from "lucide-react";

const LIMIT = 20;

function errMsg(e: unknown, fallback: string): string {
  return e instanceof ApiError ? e.message : fallback;
}

function actionBadge(action: string): string {
  const a = action.toLowerCase();
  if (a.includes("delete")) return "bg-destructive/10 text-destructive";
  if (a.includes("create")) return "bg-success/10 text-success";
  if (a.includes("update") || a.includes("set")) return "bg-primary/10 text-primary";
  return "bg-muted text-muted-foreground";
}

function detailsSummary(details?: Record<string, unknown> | null): string {
  if (!details) return "—";
  const s = JSON.stringify(details);
  return s.length > 80 ? s.slice(0, 80) + "…" : s;
}

const inputCls =
  "bg-background border border-border rounded-sm px-3 py-2.5 text-sm font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary";

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const [action, setAction] = useState("");
  const [actor, setActor] = useState("");

  const fetchLogs = useCallback(async (p: number, a: string, ac: string) => {
    try {
      const res = await listAuditLogs({
        page: p,
        limit: LIMIT,
        action: a.trim() || undefined,
        actor: ac.trim() || undefined,
      });
      setLogs(res.data);
      setTotal(res.meta.total);
      setTotalPages(Math.max(1, res.meta.totalPages));
    } catch (e) {
      toast.error(errMsg(e, "Audit logs load nahi ho sake"));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchLogs(1, "", "").finally(() => setLoading(false));
  }, [fetchLogs]);

  const handleSearch = async () => {
    setSearching(true);
    setPage(1);
    await fetchLogs(1, action, actor);
    setSearching(false);
  };

  const gotoPage = async (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    setLoading(true);
    await fetchLogs(p, action, actor);
    setLoading(false);
  };

  return (
    <div>
      <SEO title="Admin - Audit Logs" />

      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <ScrollText className="w-6 h-6 text-primary" />
          Audit Logs
        </h1>
        <p className="text-sm font-body text-muted-foreground mt-1">
          {total} total events — har staff action ka record
        </p>
      </div>

      {/* Filters */}
      <div className="bg-background border border-border rounded-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          value={action}
          onChange={(e) => setAction(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className={`${inputCls} flex-1`}
          placeholder="Action filter — e.g. users.delete"
        />
        <input
          value={actor}
          onChange={(e) => setActor(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className={`${inputCls} flex-1`}
          placeholder="Actor email — e.g. admin@al-ucaaz.com"
        />
        <button
          onClick={handleSearch}
          disabled={searching}
          className="flex items-center justify-center gap-2 bg-foreground text-background px-5 py-2.5 text-xs font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Search
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={8} cols={5} />
      ) : (
        <div className="bg-background border border-border rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">Time</th>
                  <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">Actor</th>
                  <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">Action</th>
                  <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3 hidden md:table-cell">Target</th>
                  <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3 hidden lg:table-cell">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-body text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-body font-medium max-w-[200px] truncate">
                      {log.actorEmail ?? "system"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-body font-bold tracking-wider uppercase px-2 py-1 rounded-sm font-mono ${actionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-body text-muted-foreground hidden md:table-cell">
                      {log.targetType ? `${log.targetType}${log.targetId ? ` · ${log.targetId.slice(0, 8)}` : ""}` : "—"}
                    </td>
                    <td
                      className="px-4 py-3 text-xs font-body text-muted-foreground hidden lg:table-cell max-w-[280px] truncate"
                      title={log.details ? JSON.stringify(log.details) : undefined}
                    >
                      {detailsSummary(log.details)}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm font-body text-muted-foreground">
                      Koi audit log nahi mila.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs font-body text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => gotoPage(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1 border border-border px-3 py-1.5 text-xs font-body font-medium rounded-sm hover:bg-muted transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                onClick={() => gotoPage(page + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1 border border-border px-3 py-1.5 text-xs font-body font-medium rounded-sm hover:bg-muted transition-colors disabled:opacity-40"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogs;
