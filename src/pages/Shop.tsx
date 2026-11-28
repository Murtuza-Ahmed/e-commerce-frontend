import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { products, categories } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SlidersHorizontal, Grid3X3, Grid2X2, ChevronDown, ChevronRight, SearchX } from "lucide-react";
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
      <SEO title="Shop All" description="Browse our complete collection of premium night suits & pajama sets." />

      {/* Breadcrumb */}
      <nav className="breadcrumb mb-6" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="breadcrumb-current" aria-current="page">Shop</span>
      </nav>

      <div className="mb-8">
        <p className="eyebrow mb-2">Browse the collection</p>
        <h1 className="text-display-2">All Night Suits</h1>
        <p className="text-small text-muted-foreground mt-2">{filtered.length} piece{filtered.length === 1 ? "" : "s"}</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="min-h-10 flex items-center gap-2 text-sm font-body font-medium px-4 py-2 border border-border rounded-sm bg-card hover:bg-muted transition-colors"
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <div className="hidden md:flex items-center gap-2" role="group" aria-label="Category filters">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`chip tracking-wide ${selectedCategory === "all" ? "chip-active" : ""}`}
              aria-pressed={selectedCategory === "all"}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`chip tracking-wide ${selectedCategory === cat.slug ? "chip-active" : ""}`}
                aria-pressed={selectedCategory === cat.slug}
              >
                {cat.shortLabel ?? cat.name}
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
              className="select min-h-10 text-xs pl-3 pr-8 py-2 bg-card"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
          <div className="hidden md:flex items-center border border-border rounded-sm overflow-hidden bg-card" role="group" aria-label="Grid layout">
            <button
              onClick={() => setColumns(3)}
              className={`min-w-10 min-h-10 flex items-center justify-center p-2.5 ${columns === 3 ? "bg-muted" : "hover:bg-muted/50"}`}
              aria-label="3 columns"
              aria-pressed={columns === 3}
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setColumns(4)}
              className={`min-w-10 min-h-10 flex items-center justify-center p-2.5 ${columns === 4 ? "bg-muted" : "hover:bg-muted/50"}`}
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
            className={`chip tracking-wide ${selectedCategory === "all" ? "chip-active" : ""}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`chip tracking-wide ${selectedCategory === cat.slug ? "chip-active" : ""}`}
            >
              {cat.shortLabel ?? cat.name}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <ProductGrid products={filtered} columns={columns} />
      ) : (
        <div className="card empty-state">
          <div className="empty-state-icon">
            <SearchX className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display font-semibold text-display-4 mb-2">No pieces found</h2>
          <p className="text-sm font-body text-muted-foreground mb-8">
            Try a different category or clear the filters to see the full collection.
          </p>
          <button onClick={() => setSelectedCategory("all")} className="btn-primary">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;
