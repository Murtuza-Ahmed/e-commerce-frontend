import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { PageHeaderSkeleton } from "@/components/ui/skeleton-loader";
import { ApiError } from "@/lib/api-client";
import { listUsers } from "@/api/users";
import { listRoles } from "@/api/rbac";
import { listAuditLogs } from "@/api/audit";
import { useAuthStore, isSuperAdmin } from "@/store/auth";
import type { AuditLog } from "@/types";
import { toast } from "sonner";
import {
  Users,
  ShieldCheck,
  ScrollText,
  Package,
  ShoppingCart,
  ArrowUpRight,
  Activity,
} from "lucide-react";

function errMsg(e: unknown): string {
  return e instanceof ApiError ? e.message : "Kuch ghalat ho gaya";
}

const quickLinks = [
  { label: "Users", desc: "Customers aur staff manage karo", href: "/admin/users", icon: Users, superOnly: false },
  { label: "Products", desc: "Catalog manage karo", href: "/admin/products", icon: Package, superOnly: false },
  { label: "Orders", desc: "Orders dekho aur process karo", href: "/admin/orders", icon: ShoppingCart, superOnly: false },
  { label: "Roles", desc: "Roles aur permissions", href: "/admin/roles", icon: ShieldCheck, superOnly: true },
  { label: "Audit Logs", desc: "Har staff action ka record", href: "/admin/audit-logs", icon: ScrollText, superOnly: true },
];

const AdminDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const superAdmin = isSuperAdmin(user);

  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalRoles, setTotalRoles] = useState<number | null>(null);
  const [totalEvents, setTotalEvents] = useState<number | null>(null);
  const [recent, setRecent] = useState<AuditLog[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const usersRes = await listUsers({ limit: 1 });
        if (!alive) return;
        setTotalUsers(usersRes.meta.total);

        if (superAdmin) {
          const [roles, audit] = await Promise.all([
            listRoles(),
            listAuditLogs({ limit: 5 }),
          ]);
          if (!alive) return;
          setTotalRoles(roles.length);
          setTotalEvents(audit.meta.total);
          setRecent(audit.data);
        }
      } catch (e) {
        if (alive) toast.error(errMsg(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [superAdmin]);

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, show: true },
    { label: "Total Roles", value: totalRoles, icon: ShieldCheck, show: superAdmin },
    { label: "Audit Events", value: totalEvents, icon: ScrollText, show: superAdmin },
  ].filter((s) => s.show);

  const visibleLinks = quickLinks.filter((l) => !l.superOnly || superAdmin);

  return (
    <div>
      <SEO title="Admin Dashboard" />

      {loading ? (
        <PageHeaderSkeleton />
      ) : (
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">Dashboard</h1>
          <p className="text-sm font-body text-muted-foreground mt-1">
            Welcome back{user?.name ? `, ${user.name}` : ""}. Live data backend se.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {loading
          ? stats.map((s) => (
              <div key={s.label} className="bg-background border border-border rounded-sm p-5 animate-pulse">
                <div className="h-5 w-5 rounded bg-muted mb-3" />
                <div className="h-7 w-16 rounded bg-muted mb-1" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
            ))
          : stats.map((s) => (
              <div key={s.label} className="bg-background border border-border rounded-sm p-5">
                <s.icon className="w-5 h-5 text-muted-foreground mb-3" />
                <p className="text-2xl font-body font-bold">{s.value ?? "—"}</p>
                <p className="text-xs font-body text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick links */}
        <div className="bg-background border border-border rounded-sm p-6">
          <h2 className="font-display font-bold text-base mb-4">Quick Links</h2>
          <div className="space-y-2">
            {visibleLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="flex items-center justify-between gap-3 border border-border rounded-sm p-3.5 hover:border-muted-foreground/40 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <l.icon className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-body font-semibold">{l.label}</p>
                    <p className="text-xs font-body text-muted-foreground truncate">{l.desc}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity — sirf super_admin */}
        {superAdmin && (
          <div className="bg-background border border-border rounded-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Recent Activity
              </h2>
              <Link
                to="/admin/audit-logs"
                className="text-xs font-body font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 rounded bg-muted" />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <p className="text-sm font-body text-muted-foreground">Abhi koi activity nahi.</p>
            ) : (
              <ul className="space-y-1">
                {recent.map((log) => (
                  <li
                    key={log.id}
                    className="flex items-start justify-between gap-3 py-2.5 border-b border-border last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-body">
                        <span className="font-semibold">{log.actorEmail ?? "system"}</span>
                        <span className="text-muted-foreground"> · </span>
                        <span className="font-mono text-xs">{log.action}</span>
                      </p>
                      {log.targetType && (
                        <p className="text-xs font-body text-muted-foreground mt-0.5">
                          {log.targetType}
                        </p>
                      )}
                    </div>
                    <span className="text-[11px] font-body text-muted-foreground whitespace-nowrap shrink-0">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
