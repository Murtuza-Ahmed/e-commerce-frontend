import { products } from "@/data/products";
import { dummyOrders } from "@/data/products";
import { DollarSign, ShoppingBag, Users, TrendingUp, Package, ArrowUpRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { formatPrice, formatDate } from "@/lib/format";

const stats = [
  { label: "Revenue", value: "$24,580", change: "+12.5%", icon: DollarSign },
  { label: "Orders", value: "156", change: "+8.2%", icon: ShoppingBag },
  { label: "Customers", value: "1,240", change: "+15.3%", icon: Users },
  { label: "Avg. Order", value: "$157", change: "+3.1%", icon: TrendingUp },
];

const AdminDashboard = () => {
  return (
    <div>
      <SEO title="Admin Dashboard" />
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-sm font-body text-muted-foreground mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs font-body font-medium text-success flex items-center gap-0.5">
                {stat.change} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-2xl font-body font-bold">{stat.value}</p>
            <p className="text-xs font-body text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-card border border-border rounded-sm p-6">
          <h2 className="font-body font-semibold text-sm tracking-wider uppercase mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {dummyOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-body font-medium">{order.id}</p>
                  <p className="text-xs font-body text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-body font-semibold">{formatPrice(order.total)}</p>
                  <p className="text-[10px] font-body text-muted-foreground uppercase">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-card border border-border rounded-sm p-6">
          <h2 className="font-body font-semibold text-sm tracking-wider uppercase mb-4">Top Products</h2>
          <div className="space-y-3">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-10 h-12 rounded-sm overflow-hidden bg-muted flex-shrink-0">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium truncate">{product.name}</p>
                  <p className="text-xs font-body text-muted-foreground">{product.reviewCount} sales</p>
                </div>
                <p className="text-sm font-body font-semibold">{formatPrice(product.basePrice)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory alerts */}
      <div className="mt-6 bg-card border border-border rounded-sm p-6">
        <h2 className="font-body font-semibold text-sm tracking-wider uppercase mb-4">
          <Package className="w-4 h-4 inline mr-2" />
          Low Stock Alerts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {products
            .flatMap((p) => p.variants.filter((v) => v.stock <= 5).map((v) => ({ product: p, variant: v })))
            .slice(0, 6)
            .map(({ product, variant }) => (
              <div key={variant.id} className="flex items-center gap-3 p-3 bg-destructive/5 rounded-sm">
                <div className="w-8 h-10 rounded-sm overflow-hidden bg-muted flex-shrink-0">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-body font-medium truncate">{product.name}</p>
                  <p className="text-[10px] font-body text-muted-foreground">
                    {variant.size && `${variant.size} `}{variant.color && variant.color} · SKU: {variant.sku}
                  </p>
                </div>
                <span className="text-xs font-body font-bold text-destructive">{variant.stock} left</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
