import { useState, useMemo } from "react";
import { products, categories } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SlidersHorizontal, Grid3X3, Grid2X2, ChevronDown } from "lucide-react";
import { SEO } from "@/components/SEO";

type SortOption = "newest" | "price-asc" | "price-desc" | "rating";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [columns, setColumns] = useState<2 | 3 | 4>(4);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return result;
  }, [selectedCategory, sortBy]);

  return (
    <div className="container py-8 md:py-12">
      <SEO title="Shop All" description="Browse our complete collection of premium fashion pieces." />

      <div className="mb-8">
        <p className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground mb-2">Browse</p>
        <h1 className="text-3xl md:text-4xl font-display font-bold">All Products</h1>
        <p className="text-sm text-muted-foreground font-body mt-2">{filtered.length} pieces</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-body font-medium px-4 py-2 border border-border rounded-sm hover:bg-muted transition-colors"
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <div className="hidden md:flex items-center gap-2" role="group" aria-label="Category filters">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`text-xs font-body font-medium tracking-wide px-3 py-1.5 rounded-full transition-colors ${
                selectedCategory === "all" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              aria-pressed={selectedCategory === "all"}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-xs font-body font-medium tracking-wide px-3 py-1.5 rounded-full transition-colors ${
                  selectedCategory === cat.slug ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                aria-pressed={selectedCategory === cat.slug}
              >
                {cat.name.replace("'s Collection", "")}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <label htmlFor="sort-select" className="sr-only">Sort by</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none text-xs font-body font-medium pl-3 pr-8 py-2 border border-border rounded-sm bg-background cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
          <div className="hidden md:flex items-center border border-border rounded-sm overflow-hidden" role="group" aria-label="Grid layout">
            <button
              onClick={() => setColumns(3)}
              className={`p-2 ${columns === 3 ? "bg-muted" : "hover:bg-muted/50"}`}
              aria-label="3 columns"
              aria-pressed={columns === 3}
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setColumns(4)}
              className={`p-2 ${columns === 4 ? "bg-muted" : "hover:bg-muted/50"}`}
              aria-label="4 columns"
              aria-pressed={columns === 4}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filters */}
      {showFilters && (
        <div className="md:hidden flex flex-wrap gap-2 mb-6" role="group" aria-label="Category filters">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`text-xs font-body font-medium tracking-wide px-3 py-1.5 rounded-full transition-colors ${
              selectedCategory === "all" ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`text-xs font-body font-medium tracking-wide px-3 py-1.5 rounded-full transition-colors ${
                selectedCategory === cat.slug ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
              }`}
            >
              {cat.name.replace("'s Collection", "")}
            </button>
          ))}
        </div>
      )}

      <ProductGrid products={filtered} columns={columns} />
    </div>
  );
};

export default Shop;
