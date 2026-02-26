import { dummyOrders } from "@/data/products";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { formatPrice, formatDate } from "@/lib/format";
import { Download } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning-foreground",
  processing: "bg-primary/10 text-primary",
  shipped: "bg-accent/10 text-accent",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
  refunded: "bg-muted text-muted-foreground",
};

const AdminOrders = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const statuses = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

  const filtered = statusFilter === "all"
    ? dummyOrders
    : dummyOrders.filter((o) => o.status === statusFilter);

  return (
    <div>
      <SEO title="Admin - Orders" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold">Orders</h1>
          <p className="text-sm font-body text-muted-foreground mt-1">{dummyOrders.length} total orders</p>
        </div>
        <button className="flex items-center gap-2 border border-border text-foreground px-4 py-2.5 text-xs font-body font-semibold tracking-wider uppercase rounded-sm hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Order status filter">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs font-body font-medium tracking-wide px-3 py-1.5 rounded-full capitalize transition-colors ${
              statusFilter === s ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            aria-pressed={statusFilter === s}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">Order</th>
                <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3 hidden md:table-cell">Date</th>
                <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">Total</th>
                <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3 hidden lg:table-cell">Address</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-body font-medium">{order.id}</td>
                  <td className="px-4 py-3 text-sm font-body text-muted-foreground hidden md:table-cell">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-body font-bold tracking-wider uppercase px-2 py-1 rounded-sm ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-body font-semibold">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 text-xs font-body text-muted-foreground hidden lg:table-cell truncate max-w-[200px]">{order.shippingAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm font-body text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
