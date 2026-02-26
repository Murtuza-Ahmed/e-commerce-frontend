import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { products, categories } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SEO } from "@/components/SEO";

const Index = () => {
  const newArrivals = products.filter((p) => p.isNew);
  const featured = products.slice(0, 4);

  return (
    <div>
      <SEO
        title="Premium Fashion"
        description="Discover curated luxury fashion at Al-ucaaz. Premium clothing, accessories & footwear crafted with intention."
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Al-ucaaz",
          url: window.location.origin,
          potentialAction: {
            "@type": "SearchAction",
            target: `${window.location.origin}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />

      {/* Hero */}
      <section className="relative hero-gradient text-background overflow-hidden">
        <div className="container py-20 md:py-32 lg:py-40 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-xs md:text-sm font-body tracking-[0.3em] uppercase mb-4 opacity-70">
              Spring / Summer 2025
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">
              Refined
              <br />
              <span className="italic">Elegance</span>
            </h1>
            <p className="text-base md:text-lg font-body opacity-70 max-w-md mb-8 leading-relaxed">
              Discover our curated collection of premium fashion, crafted with intention and designed to transcend seasons.
            </p>
            <div className="flex gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-sm font-body font-semibold tracking-wider uppercase hover:opacity-90 transition-opacity rounded-sm"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/category/womens"
                className="inline-flex items-center gap-2 border border-background/30 text-background px-8 py-3.5 text-sm font-body font-semibold tracking-wider uppercase hover:bg-background/10 transition-colors rounded-sm"
              >
                Women's Edit
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <div className="w-full h-full" style={{ background: "radial-gradient(circle at 70% 30%, hsl(32 90% 50% / 0.4), transparent 60%)" }} />
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground mb-2">Browse</p>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Collections</h2>
          </div>
          <Link to="/shop" className="text-sm font-body font-medium text-primary hover:underline underline-offset-4">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link to={`/category/${cat.slug}`} className="group block relative aspect-[3/4] overflow-hidden rounded-sm">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="font-display text-lg md:text-xl font-bold text-background">{cat.name}</h3>
                  <p className="text-xs font-body text-background/70 mt-1">{cat.productCount} pieces</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-secondary/50">
        <div className="container py-16 md:py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground mb-2">Curated</p>
              <h2 className="text-2xl md:text-3xl font-display font-bold">Featured Pieces</h2>
            </div>
            <Link to="/shop" className="text-sm font-body font-medium text-primary hover:underline underline-offset-4">
              Shop All
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="container py-16 md:py-24">
        <div className="relative hero-gradient rounded-sm overflow-hidden">
          <div className="px-8 md:px-16 py-16 md:py-24 max-w-lg relative z-10">
            <p className="text-xs font-body tracking-[0.3em] uppercase text-background/60 mb-3">Limited Time</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-background mb-4">
              End of Season Sale
            </h2>
            <p className="text-sm font-body text-background/70 mb-6 leading-relaxed">
              Up to 40% off on selected premium pieces. Elevate your wardrobe at exceptional value.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity"
            >
              Shop Sale
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container pb-16 md:pb-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground mb-2">Just In</p>
              <h2 className="text-2xl md:text-3xl font-display font-bold">New Arrivals</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-muted">
        <div className="container py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Stay in the Loop</h2>
          <p className="text-sm font-body text-muted-foreground mb-8 max-w-md mx-auto">
            Subscribe for exclusive access to new collections, private sales, and style insights.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-sm text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Email address for newsletter"
            />
            <button
              type="submit"
              className="bg-foreground text-background px-8 py-3 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Index;
