import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Moon, Ruler, Sparkles, Truck } from "lucide-react";
import { products, categories } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SEO } from "@/components/SEO";
import { SITE_URL } from "@/constants";
import { SizeGuideModal, SizeGuideTable } from "@/components/night-suit/SizeGuide";
import { SIZE_GUIDE_BADGES, SIZE_GUIDE_IMAGE } from "@/data/sizeGuide";
import { formatPrice } from "@/lib/format";

const Index = () => {
  const newArrivals = products.filter((p) => p.isNew);
  const featured = products.slice(0, 4);
  const happySet = products.find((p) => p.slug === "happy-sunflower-set");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  // Newsletter is local-only until a backend exists: the email is kept in
  // localStorage and a success message is shown, nothing is sent anywhere.
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    try {
      const stored: string[] = JSON.parse(localStorage.getItem("alucaaz-newsletter") || "[]");
      if (!stored.includes(email)) {
        stored.push(email);
        localStorage.setItem("alucaaz-newsletter", JSON.stringify(stored));
      }
    } catch {
      // storage unavailable — still show the confirmation, nothing breaks
    }
    setNewsletterDone(true);
  };

  const marqueeItems = [
    "50% OFF New Arrival",
    "Free Delivery All Pakistan",
    "Soft Cotton Jersey",
    "Sizes S–XXL",
    "Relaxed Fit",
  ];

  return (
    <div>
      <SEO
        title="Premium Night Suits & Pajama Sets"
        description="Premium night suits & pajama sets from Al-ucaaz — soft cotton jersey, relaxed fits, playful prints, sizes S–XXL."
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Al-ucaaz",
          url: SITE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />

      {/* Hero — static premium photo hero. The 3D fabric hero was removed
          2026-11-07 (Phase 0.3): john said the 3D was not special enough.
          The photo is the real product — Charcoal Starry Dream Set. */}
      <section className="relative bg-background text-foreground overflow-hidden">
        <div className="container py-16 md:py-24 lg:py-28 relative z-10">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <p className="text-xs md:text-sm font-body tracking-[0.3em] uppercase mb-4 text-primary">
                Al-ucaaz • Premium Nightwear
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">
                Dream in
                <br />
                <span className="italic gold-shimmer bg-clip-text text-transparent">Luxury</span>
              </h1>
              <p className="text-base md:text-lg font-body opacity-70 max-w-md mb-8 leading-relaxed">
                Premium night suits &amp; pajama sets in soft cotton jersey — relaxed fits, playful
                prints, and slow evenings made comfortable.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="btn-primary">
                  Shop Night Suits
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="btn-ghost border border-foreground/30"
                >
                  <Ruler className="w-4 h-4" />
                  Size Guide
                </button>
              </div>

              {/* Stats — all factual: 10 sets, S–XXL sizes, 50% OFF new arrival */}
              <dl className="flex flex-wrap gap-x-8 gap-y-3 mt-12 text-sm font-body">
                <div>
                  <dt className="sr-only">Signature sets</dt>
                  <dd className="font-display text-2xl font-bold">{products.length}</dd>
                  <dd className="text-xs text-foreground/60 tracking-wider uppercase mt-0.5">Signature Sets</dd>
                </div>
                <div>
                  <dt className="sr-only">Sizes</dt>
                  <dd className="font-display text-2xl font-bold">S–XXL</dd>
                  <dd className="text-xs text-foreground/60 tracking-wider uppercase mt-0.5">Sizes</dd>
                </div>
                <div>
                  <dt className="sr-only">New arrival offer</dt>
                  <dd className="font-display text-2xl font-bold text-primary">50% OFF</dd>
                  <dd className="text-xs text-foreground/60 tracking-wider uppercase mt-0.5">New Arrival</dd>
                </div>
              </dl>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <Link to="/product/charcoal-starry-dream-set" className="group block relative">
                <img
                  src="/assets/night-suits/charcoal-starry-dream-set.jpg"
                  alt="Charcoal Starry Dream Set — model wearing the moon and stars print pajama set"
                  className="w-full aspect-[3/4] object-cover rounded-md shadow-hero ring-1 ring-border"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div className="bg-background/85 backdrop-blur px-4 py-3 rounded-md">
                    <p className="font-display font-bold text-foreground">Charcoal Starry Dream Set</p>
                    <p className="text-xs font-body text-muted-foreground mt-0.5">Soft Cotton Jersey • Sizes S–XXL</p>
                  </div>
                  <span className="shrink-0 bg-primary text-primary-foreground text-xs font-body font-bold px-3 py-2 rounded-md uppercase tracking-wider">
                    Shop Now
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promo marquee */}
      <div className="bg-primary text-primary-foreground overflow-hidden py-2.5" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-0">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {marqueeItems.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center gap-2 px-6 text-xs font-body font-bold tracking-[0.2em] uppercase whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" /> {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Collections */}
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="font-display text-lg md:text-xl font-bold text-foreground">{cat.name}</h3>
                  <p className="text-xs font-body text-foreground/70 mt-1">{cat.productCount} pieces</p>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Promo tile — the real 50% OFF new arrival */}
          {happySet && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-2 lg:col-span-1"
            >
              <Link
                to={`/product/${happySet.slug}`}
                className="group block relative aspect-[3/4] lg:aspect-auto lg:h-full overflow-hidden rounded-sm"
              >
                <img
                  src={happySet.images[0]}
                  alt={happySet.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-destructive text-destructive-foreground text-[10px] font-body font-bold tracking-wider px-2.5 py-1 rounded-sm uppercase">
                    50% OFF
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="font-display text-lg md:text-xl font-bold text-foreground">New Arrival</h3>
                  <p className="text-sm font-body text-foreground/80 mt-1">{happySet.name}</p>
                  <p className="text-xs font-body text-foreground/70 mt-1 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> Free Delivery All Pakistan
                  </p>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-secondary/50">
        <div className="container py-16 md:py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground mb-2">Curated</p>
              <h2 className="text-2xl md:text-3xl font-display font-bold">Featured Night Suits</h2>
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

      {/* Promo banner — the real 50% OFF + free delivery offer */}
      {happySet && (
        <section className="container py-16 md:py-24">
          <div className="relative hero-gradient rounded-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full hidden md:block">
              <img
                src={happySet.images[0]}
                alt={happySet.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1f1a14] via-[#1f1a14]/40 to-transparent" />
            </div>
            <div className="px-8 md:px-16 py-16 md:py-24 max-w-lg relative z-10">
              <p className="text-xs font-body tracking-[0.3em] uppercase text-primary mb-3">New Arrival</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Happy Sunflower Set — 50% OFF
              </h2>
              <p className="text-sm font-body text-foreground/70 mb-2 leading-relaxed">
                Soft, comfortable, ready-to-wear lounge set — now{" "}
                <span className="font-bold text-foreground">{formatPrice(happySet.basePrice)}</span>{" "}
                <span className="line-through">{formatPrice(happySet.compareAtPrice ?? 0)}</span>.
              </p>
              <p className="text-sm font-body text-foreground/70 mb-6 leading-relaxed flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" /> Free Delivery all over Pakistan.
              </p>
              <Link
                to={`/product/${happySet.slug}`}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity"
              >
                Shop the Set
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

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

      {/* Size Guide */}
      <section id="size-guide" className="bg-secondary/50">
        <div className="container py-16 md:py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground mb-2 flex items-center gap-2">
                <Moon className="w-3.5 h-3.5" /> Find Your Fit
              </p>
              <h2 className="text-2xl md:text-3xl font-display font-bold">Women&rsquo;s Pajama Sets Size Guide</h2>
            </div>
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="text-sm font-body font-medium text-primary hover:underline underline-offset-4"
            >
              Open full guide
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-background rounded-sm p-6 border border-border">
              <SizeGuideTable />
            </div>
            <div className="relative overflow-hidden rounded-sm bg-muted min-h-[220px]">
              <img
                src={SIZE_GUIDE_IMAGE}
                alt="AL UCCAZ Women's Pajama Sets Size Guide"
                className="w-full h-full object-cover absolute inset-0"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent">
                <div className="flex flex-wrap gap-2">
                  {SIZE_GUIDE_BADGES.map((b) => (
                    <span
                      key={b}
                      className="text-[11px] font-body font-semibold px-2.5 py-1 rounded-full bg-background/90 text-foreground"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-muted">
        <div className="container py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Stay in the Loop</h2>
          <p className="text-sm font-body text-muted-foreground mb-8 max-w-md mx-auto">
            Subscribe for new night-suit drops, restocks, and private sales.
          </p>
          {newsletterDone ? (
            <p className="text-sm font-body text-foreground max-w-md mx-auto" role="status">
              ✓ You&rsquo;re on the list — new drops, restocks and private sales will land in your inbox.
            </p>
          ) : (
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-sm text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="btn-primary"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
};

export default Index;
