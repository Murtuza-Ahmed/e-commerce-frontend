import { useParams, Link } from "react-router-dom";
import { products, categories } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ChevronRight, SearchX } from "lucide-react";
import { SEO } from "@/components/SEO";
import { SITE_URL } from "@/constants";

const Category = () => {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = products.filter((p) => p.categorySlug === slug);

  if (!category) {
    return (
      <div className="container py-20 text-center">
        <SEO title="Category Not Found" />
        <h1 className="text-display-3 mb-4">Category not found</h1>
        <p className="text-sm font-body text-muted-foreground mb-8">
          This collection doesn&apos;t exist or has been moved.
        </p>
        <Link to="/shop" className="btn-primary">Browse All</Link>
      </div>
    );
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: category.name, item: `${SITE_URL}/category/${category.slug}` },
    ],
  };

  return (
    <div>
      <SEO
        title={category.name}
        description={category.description}
        image={category.image}
        schema={breadcrumbSchema}
      />

      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/85" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <nav className="flex items-center gap-2 text-xs font-body text-foreground/70 mb-3" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground" aria-current="page">{category.name}</span>
            </nav>
            <p className="eyebrow mb-2">Collection</p>
            <h1 className="text-display-2 text-foreground">{category.name}</h1>
            <p className="text-body text-foreground/70 mt-2 max-w-xl">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="container py-8 md:py-12">
        <p className="text-small text-muted-foreground mb-8 pb-4 border-b border-border">
          {categoryProducts.length} piece{categoryProducts.length === 1 ? "" : "s"}
        </p>
        {categoryProducts.length > 0 ? (
          // Grid columns follow the item count (Phase 1 audit M-3): 9 items
          // fill a 3-column grid exactly instead of leaving a single-card
          // last row in a 4-column grid.
          <ProductGrid
            products={categoryProducts}
            columns={categoryProducts.length >= 9 ? 3 : categoryProducts.length >= 4 ? 4 : 2}
          />
        ) : (
          <div className="text-center py-16 md:py-24 bg-card border border-border rounded-md shadow-card">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-forest-mist flex items-center justify-center">
              <SearchX className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display font-semibold text-display-4 mb-2">Nothing here yet</h2>
            <p className="text-sm font-body text-muted-foreground mb-8">
              This collection is empty for now — explore the rest of the shop instead.
            </p>
            <Link to="/shop" className="btn-primary">Browse All Night Suits</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
