import { useAuthStore } from "@/store/auth";
import { Link, useNavigate } from "react-router-dom";
import { dummyOrders } from "@/data/products";
import { Package, Heart, MapPin, CreditCard, LogOut, User } from "lucide-react";
import { useEffect } from "react";
import { SEO } from "@/components/SEO";
import { formatPrice, formatDate } from "@/lib/format";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning-foreground",
  processing: "bg-primary/10 text-primary",
  shipped: "bg-accent/10 text-accent",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
  refunded: "bg-muted text-muted-foreground",
};

const UserDashboard = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="container py-8 md:py-12">
      <SEO title="My Account" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-muted/50 rounded-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-body font-semibold text-sm">{user.name}</p>
                <p className="text-xs font-body text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <nav className="space-y-1" aria-label="Account navigation">
              {[
                { icon: Package, label: "Orders", active: true },
                { icon: Heart, label: "Wishlist", href: "/wishlist" },
                { icon: MapPin, label: "Addresses" },
                { icon: CreditCard, label: "Payment Methods" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href || "#"}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-body rounded-sm transition-colors ${
                    item.active ? "bg-background font-medium" : "text-muted-foreground hover:bg-background/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-body text-destructive hover:bg-destructive/5 rounded-sm w-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="block mt-4 text-center bg-primary text-primary-foreground py-2.5 text-xs font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-3">
          <h1 className="text-2xl font-display font-bold mb-6">My Orders</h1>
          <div className="space-y-4">
            {dummyOrders.map((order) => (
              <div key={order.id} className="border border-border rounded-sm p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="font-body font-semibold text-sm">{order.id}</p>
                    <p className="text-xs font-body text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`text-[10px] font-body font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-body text-muted-foreground">{order.shippingAddress}</p>
                  <p className="font-body font-semibold">{formatPrice(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
