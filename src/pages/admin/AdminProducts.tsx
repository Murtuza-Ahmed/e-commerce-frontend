import { products } from "@/data/products";
import { Search, Plus, MoreVertical, Download } from "lucide-react";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { formatPrice } from "@/lib/format";

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
          <h1 className="text-2xl font-display font-bold">Products</h1>
          <p className="text-sm font-body text-muted-foreground mt-1">{products.length} total products</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-border text-foreground px-4 py-2.5 text-xs font-body font-semibold tracking-wider uppercase rounded-sm hover:bg-muted transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-xs font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Product
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
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-sm text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label="Search products"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "draft", "scheduled"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs font-body font-medium tracking-wide px-3 py-2 rounded-sm capitalize transition-colors ${
                statusFilter === s ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">Product</th>
                <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3 hidden md:table-cell">Category</th>
                <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">Price</th>
                <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3 hidden sm:table-cell">Stock</th>
                <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3 hidden lg:table-cell">Status</th>
                <th className="w-10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const totalStock = product.variants.reduce((a, v) => a + v.stock, 0);
                return (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-sm overflow-hidden bg-muted flex-shrink-0">
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div>
                          <p className="text-sm font-body font-medium">{product.name}</p>
                          <p className="text-[10px] font-body text-muted-foreground">{product.variants.length} variants · {product.variants[0]?.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-body text-muted-foreground hidden md:table-cell">{product.category}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-body font-medium">{formatPrice(product.basePrice)}</p>
                      {product.compareAtPrice && (
                        <p className="text-[10px] font-body text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-sm font-body font-medium ${totalStock <= 10 ? "text-destructive" : ""}`}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`text-[10px] font-body font-bold tracking-wider uppercase px-2 py-1 rounded-sm ${
                        product.status === "active" ? "bg-success/10 text-success" : product.status === "draft" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1 text-muted-foreground hover:text-foreground" aria-label={`Options for ${product.name}`}>
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
            <p className="text-sm font-body text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
