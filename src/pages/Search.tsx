import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { products } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Search as SearchIcon, SearchX, X } from "lucide-react";
import { SEO } from "@/components/SEO";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  // Keep the input in sync when the URL changes (e.g. ?q= from the SEO search action)
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery((prev) => (prev === q ? prev : q));
  }, [searchParams]);

  const handleChange = (value: string) => {
    setQuery(value);
    setSearchParams(value ? { q: value } : {}, { replace: true });
  };

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

  const suggestions = ["Pajama", "Cotton Jersey", "Satin", "Couple", "Faith"];

  return (
    <div className="container py-8 md:py-12">
      <SEO title="Search" description="Search our night suits & pajama sets." />

      <div className="text-center mb-10">
        <p className="eyebrow mb-2">Find your piece</p>
        <h1 className="text-display-2">Search the Collection</h1>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative shadow-card rounded-sm">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search products..."
            autoFocus
            className="input min-h-14 pl-12 pr-12 py-4 text-base bg-card"
            aria-label="Search products"
          />
          {query && (
            <button
              onClick={() => handleChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 min-w-10 min-h-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {!query && (
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <span className="text-xs font-body text-muted-foreground mr-2 py-1.5">Popular:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleChange(s)}
                className="chip hover:bg-primary hover:text-primary-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {query && (
        <div>
          <p className="text-small text-muted-foreground mb-6 pb-4 border-b border-border" aria-live="polite">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
          {results.length > 0 ? (
            <ProductGrid products={results} />
          ) : (
            <div className="card empty-state">
              <div className="empty-state-icon">
                <SearchX className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display font-semibold text-display-4 mb-2">No results found</h2>
              <p className="text-sm font-body text-muted-foreground mb-8">
                Try a different search term, or browse the full collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => handleChange("")} className="btn-secondary">
                  Clear Search
                </button>
                <Link to="/shop" className="btn-primary">
                  Browse All Night Suits
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
