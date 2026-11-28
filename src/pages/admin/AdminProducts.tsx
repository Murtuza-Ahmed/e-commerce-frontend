import { products } from "@/data/products";
import { Search, Plus, MoreVertical, Download } from "lucide-react";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { formatPrice } from "@/lib/format";

function statusBadge(status: string): string {
  if (status === "active") return "bg-success/10 text-success";
  if (status === "draft") return "bg-muted text-muted-foreground";
  return "bg-primary/10 text-primary";
}

const AdminProducts = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.variants.some((v) => v.sku.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <SEO title="Admin - Products" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-2">Admin</p>
          <h1 className="font-display font-semibold text-display-3 md:text-display-2">Products</h1>
          <p className="text-small font-body text-muted-foreground mt-2">{products.length} total products</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4" /> Add product
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="input bg-card pl-10"
            aria-label="Search products"
          />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Product status filter">
          {["all", "active", "draft", "scheduled"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              aria-pressed={statusFilter === s}
              className={`text-small font-body font-medium px-3 min-h-10 rounded-sm capitalize transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left text-caption font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">Product</th>
                <th className="text-left text-caption font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3 hidden md:table-cell">Category</th>
                <th className="text-left text-caption font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">Price</th>
                <th className="text-left text-caption font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3 hidden sm:table-cell">Stock</th>
                <th className="text-left text-caption font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3 hidden lg:table-cell">Status</th>
                <th className="w-10 px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const totalStock = product.variants.reduce((a, v) => a + v.stock, 0);
                return (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-sm overflow-hidden bg-muted flex-shrink-0">
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-small font-body font-medium truncate">{product.name}</p>
                          <p className="text-caption font-body text-muted-foreground">{product.variants.length} variants · {product.variants[0]?.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-small font-body text-muted-foreground hidden md:table-cell">{product.category}</td>
                    <td className="px-4 py-3">
                      <p className="text-small font-body font-medium">{formatPrice(product.basePrice)}</p>
                      {product.compareAtPrice && (
                        <p className="text-caption font-body text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-small font-body font-medium ${totalStock <= 10 ? "text-destructive" : ""}`}>
                        {totalStock}
                      </span>
                      {totalStock <= 10 && (
                        <span className="block text-caption font-body text-destructive">Low stock</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`text-caption font-body font-semibold tracking-wider uppercase px-2 py-1 rounded-sm ${statusBadge(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="min-h-10 min-w-10 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label={`Options for ${product.name}`}>
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-small font-body text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
