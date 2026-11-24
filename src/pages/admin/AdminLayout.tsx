import { Link, Outlet, useLocation } from "react-router-dom";
import { BarChart3, Package, ShoppingCart, Users, Tag, FileText, Settings, ArrowLeft, LayoutDashboard, Shield, ScrollText } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuthStore, isSuperAdmin } from "@/store/auth";

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  superAdmin?: boolean;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Store",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
      { icon: Package, label: "Products", href: "/admin/products" },
      { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
      { icon: Users, label: "Users", href: "/admin/users" },
    ],
  },
  {
    label: "Content",
    items: [
      { icon: Tag, label: "Coupons", href: "/admin/coupons" },
      { icon: FileText, label: "CMS", href: "/admin/cms" },
      { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
      { icon: Settings, label: "Settings", href: "/admin/settings" },
    ],
  },
  {
    label: "Administration",
    items: [
      { icon: Shield, label: "Roles", href: "/admin/roles", superAdmin: true },
      { icon: ScrollText, label: "Audit Logs", href: "/admin/audit-logs", superAdmin: true },
    ],
  },
];

const mobileLabels = ["Dashboard", "Products", "Orders", "Users", "Coupons", "Roles", "Audit Logs"];

const AdminLayout = () => {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const groups = navGroups
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => !item.superAdmin || isSuperAdmin(user)),
    }))
    .filter((g) => g.items.length > 0);
  const flatNav = groups.flatMap((g) => g.items);
  const mobileNav = flatNav.filter((item) => mobileLabels.includes(item.label));

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 min-h-screen sticky top-0 h-screen bg-sidebar text-sidebar-foreground">
          <div className="px-6 pt-6 pb-5 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-2 text-caption font-body text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors mb-5 min-h-10">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Store
            </Link>
            <h2 className="font-display text-display-4 font-semibold tracking-wide">AL-UCAAZ</h2>
            <p className="text-caption font-body text-sidebar-foreground/70 tracking-widest uppercase mt-1">Admin Panel</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Admin navigation">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="px-3 mb-2 text-caption font-body font-semibold tracking-widest uppercase text-sidebar-foreground/60">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = location.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-3 px-3 min-h-10 py-2.5 text-small font-body rounded-sm transition-colors ${
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                            : "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                        }`}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          {user && (
            <div className="px-6 py-4 border-t border-sidebar-border">
              <p className="text-small font-body font-semibold text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-caption font-body text-sidebar-foreground/70 truncate">{user.email}</p>
            </div>
          )}
        </aside>

        {/* Mobile header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-sidebar text-sidebar-foreground z-50 px-4 min-h-14 flex items-center justify-between border-b border-sidebar-border">
          <h2 className="font-display text-small font-semibold tracking-wide">AL-UCAAZ ADMIN</h2>
          <Link to="/" className="flex items-center min-h-10 px-2 text-caption font-body text-sidebar-foreground/80 hover:text-sidebar-foreground">Store</Link>
        </div>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-sidebar text-sidebar-foreground z-50 flex justify-around py-1.5 overflow-x-auto border-t border-sidebar-border" aria-label="Admin navigation">
          {mobileNav.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 px-2 min-h-11 min-w-11 py-1.5 text-caption font-body shrink-0 rounded-sm ${
                  active ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" : "text-sidebar-foreground/75"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Content */}
        <main className="flex-1 min-w-0 bg-background p-4 md:p-8 lg:p-10 pt-20 lg:pt-10 pb-24 lg:pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
