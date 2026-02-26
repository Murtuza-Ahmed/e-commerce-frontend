import { useParams, Link } from "react-router-dom";
import { products, categories } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ChevronRight } from "lucide-react";
import { SEO } from "@/components/SEO";

const Category = () => {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = products.filter((p) => p.categorySlug === slug);

  if (!category) {
    return (
      <div className="container py-20 text-center">
        <SEO title="Category Not Found" />
        <h1 className="text-2xl font-display font-bold mb-4">Category not found</h1>
        <Link to="/shop" className="text-sm font-body text-primary hover:underline">Browse All</Link>
      </div>
    );
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: window.location.origin },
      { "@type": "ListItem", position: 2, name: category.name, item: `${window.location.origin}/category/${category.slug}` },
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

      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <nav className="flex items-center gap-2 text-xs font-body text-background/70 mb-3" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-background transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-background">{category.name}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-background">{category.name}</h1>
            <p className="text-sm font-body text-background/70 mt-2">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="container py-8 md:py-12">
        <p className="text-sm font-body text-muted-foreground mb-8">{categoryProducts.length} pieces</p>
        <ProductGrid products={categoryProducts} />
      </div>
    </div>
  );
};

export default Category;
