import { useState, useMemo } from "react";
import { products } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Search as SearchIcon, X } from "lucide-react";
import { SEO } from "@/components/SEO";

const Search = () => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }, [query]);

  const suggestions = ["Wool", "Silk", "Leather", "Cashmere", "Linen"];

  return (
    <div className="container py-8 md:py-12">
      <SEO title="Search" description="Search our premium fashion collection." />

      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            autoFocus
            className="w-full pl-12 pr-12 py-4 bg-background border border-border rounded-sm text-base font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label="Search products"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {!query && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs font-body text-muted-foreground mr-2">Popular:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="text-xs font-body px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {query && (
        <div>
          <p className="text-sm font-body text-muted-foreground mb-6" aria-live="polite">
            {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
          </p>
          {results.length > 0 ? (
            <ProductGrid products={results} />
          ) : (
            <div className="text-center py-16">
              <p className="text-lg font-display font-bold mb-2">No results found</p>
              <p className="text-sm font-body text-muted-foreground">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
