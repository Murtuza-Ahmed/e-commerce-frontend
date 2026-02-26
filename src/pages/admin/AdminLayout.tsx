import { Link, Outlet, useLocation } from "react-router-dom";
import { BarChart3, Package, ShoppingCart, Users, Tag, FileText, Settings, ArrowLeft, LayoutDashboard } from "lucide-react";

const adminNav = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: Tag, label: "Coupons", href: "/admin/coupons" },
  { icon: FileText, label: "CMS", href: "/admin/cms" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 min-h-screen bg-foreground text-background hidden lg:block">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2 text-xs font-body text-background/50 hover:text-background/80 transition-colors mb-6">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Store
            </Link>
            <h2 className="font-display text-lg font-bold">AL-UCAAZ</h2>
            <p className="text-[10px] font-body text-background/40 tracking-wider uppercase mt-0.5">Admin Panel</p>
          </div>
          <nav className="px-3 space-y-0.5">
            {adminNav.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-body rounded-sm transition-colors ${
                    active ? "bg-background/10 text-background font-medium" : "text-background/50 hover:text-background/80 hover:bg-background/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-foreground text-background z-50 px-4 py-3 flex items-center justify-between">
          <h2 className="font-display text-sm font-bold">AL-UCAAZ ADMIN</h2>
          <Link to="/" className="text-xs font-body text-background/50">Store</Link>
        </div>

        {/* Mobile bottom nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-foreground text-background z-50 flex justify-around py-2">
          {adminNav.slice(0, 5).map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-body ${
                  active ? "text-primary" : "text-background/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 pt-16 lg:pt-10 pb-20 lg:pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
