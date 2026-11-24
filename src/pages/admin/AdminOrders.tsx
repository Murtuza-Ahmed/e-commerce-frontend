import { dummyOrders } from "@/data/products";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { formatPrice, formatDate } from "@/lib/format";
import { Download } from "lucide-react";

// Status badges — text + restrained semantic color, never color alone.
const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-accent/10 text-accent",
  shipped: "bg-primary/10 text-primary",
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
          <p className="eyebrow mb-2">Admin</p>
          <h1 className="font-display font-semibold text-display-3 md:text-display-2">Orders</h1>
          <p className="text-small font-body text-muted-foreground mt-2">{dummyOrders.length} total orders</p>
        </div>
        <button className="btn-secondary">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Order status filter">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-small font-body font-medium px-3 min-h-10 rounded-sm capitalize transition-colors ${
              statusFilter === s
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:bg-muted"
            }`}
            aria-pressed={statusFilter === s}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-sm shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left text-caption font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">Order</th>
                <th className="text-left text-caption font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3 hidden md:table-cell">Date</th>
                <th className="text-left text-caption font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left text-caption font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">Total</th>
                <th className="text-left text-caption font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3 hidden lg:table-cell">Address</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 text-small font-body font-medium whitespace-nowrap">{order.id}</td>
                  <td className="px-4 py-3 text-small font-body text-muted-foreground hidden md:table-cell whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-caption font-body font-semibold tracking-wider uppercase px-2 py-1 rounded-sm ${statusColors[order.status] ?? "bg-muted text-muted-foreground"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-small font-body font-semibold whitespace-nowrap">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 text-caption font-body text-muted-foreground hidden lg:table-cell truncate max-w-[200px]">{order.shippingAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-small font-body text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
