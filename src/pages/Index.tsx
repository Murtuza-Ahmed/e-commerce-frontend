import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Moon, Ruler, Truck } from "lucide-react";
import { products, categories } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SEO } from "@/components/SEO";
import { SITE_URL } from "@/constants";
import { SizeGuideModal, SizeGuideTable } from "@/components/night-suit/SizeGuide";
import { SIZE_GUIDE_BADGES, SIZE_GUIDE_IMAGE } from "@/data/sizeGuide";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

const Index = () => {
  const newArrivals = products.filter((p) => p.isNew);
  const happySet = products.find((p) => p.slug === "happy-sunflower-set");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  // Newsletter is local-only until a backend exists: the email is kept in
  // localStorage and a success message is shown, nothing is sent anywhere.
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

  // Featured — curated by photography quality, not data order. Every product
  // gets exactly one homepage moment: Happy Sunflower is the campaign star
  // (banner below) and the Couple set leads the Collections cards, so the
  // other eight appear here. No product is hidden; the rest live on Shop.
  // Best-resolution portrait photos lead the grid; the three low-resolution
  // sets (Bear, Burgundy, Mustard — Phase 1B L-4, blocked on originals from
  // john) sit in the second row.
  const FEATURED_SLUGS = [
    "charcoal-starry-dream-set",
    "faith-blossom-orange",
    "black-abstract-line-art-set",
    "im-not-perfect-set",
    "faith-blossom-navy",
    "bear-print-set",
    "burgundy-satin-set",
    "mustard-tree-print-set",
  ];
  const featured = FEATURED_SLUGS.map((slug) => products.find((p) => p.slug === slug)).filter(
    (p): p is Product => Boolean(p),
  );

  // Homepage-only collection imagery: the Women's card would otherwise reuse
  // the exact hero photo (charcoal-starry-dream-set.jpg) — the same image
  // twice on one page. The Faith Navy model crop is a clean model shot from
  // the same collection. products.ts and the Category pages are untouched.
  const COLLECTION_IMAGES: Record<string, string> = {
    womens: "/assets/night-suits/faith-blossom-navy-model.jpg",
  };

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

  // Static announcement bar items (same items as the old marquee, no animation).
  // Wording kept exactly as-is: the free-delivery line here ("Free Delivery
  // All Pakistan") and the header top bar ("...ON ORDERS OVER Rs 2,999")
  // contradict each other — that is open decision D5, BLOCKED on john.
  const announcementItems = [
    "50% OFF New Arrival",
    "Free Delivery All Pakistan",
    "Soft Cotton Jersey",
    "Sizes S–XXL",
    "Relaxed Fit",
  ];

  // Discount shown for the Happy Sunflower Set comes from the data itself
  // (compareAtPrice vs basePrice), never invented.
  const happyDiscount =
    happySet && happySet.compareAtPrice
      ? Math.round((1 - happySet.basePrice / happySet.compareAtPrice) * 100)
      : null;

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

      {/* Hero — editorial split: image 50% / text 50% on desktop (Phase 1B:
          was 7/5, which left ~400px of dead space under the text column),
          stacked on mobile (text first, so CTAs are reachable and no text
          sits over the image). Photo is the real product — Charcoal Starry
          Dream Set. The 3D fabric hero was removed 2026-11-07 (Phase 0.3).
          Phase 3: one consistent 4/5 portrait frame at every viewport — the
          old sm:aspect-[4/3] switch made the crop look accidental at tablet
          width. The source photo crops the model at the neck (Phase 1B M-4,
          blocked on a clean original from john); the 4/5 frame keeps that
          crop steady so it reads as an intentional editorial crop. */}
      <section className="bg-background text-foreground overflow-hidden">
        <div className="container py-12 md:py-20 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 max-w-xl"
            >
              <p className="eyebrow mb-4 text-primary">Al-ucaaz • Premium Nightwear</p>
              <h1 className="text-hero font-display mb-6 text-balance">
                Dream in
                <br />
                <span className="italic text-primary">Luxury</span>
              </h1>
              <p className="text-body text-muted-foreground max-w-md mb-8">
                Premium night suits &amp; pajama sets in soft cotton jersey — relaxed fits, playful
                prints, and slow evenings made comfortable.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/shop" className="btn-primary">
                  Shop Night Suits
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button onClick={() => setSizeGuideOpen(true)} className="btn-outline">
                  <Ruler className="w-4 h-4" />
                  Size Guide
                </button>
              </div>

              {/* Stats — all factual: 10 sets, S–XXL sizes, 50% OFF new arrival */}
              <dl className="flex flex-wrap gap-x-10 gap-y-4 mt-12 pt-8 border-t border-border">
                <div>
                  <dt className="sr-only">Signature sets</dt>
                  <dd className="font-display text-display-4 font-semibold">{products.length}</dd>
                  <dd className="text-caption text-muted-foreground tracking-wider uppercase mt-0.5">
                    Signature Sets
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Sizes</dt>
                  <dd className="font-display text-display-4 font-semibold">S–XXL</dd>
                  <dd className="text-caption text-muted-foreground tracking-wider uppercase mt-0.5">
                    Sizes
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">New arrival offer</dt>
                  <dd className="font-display text-display-4 font-semibold text-primary">50% OFF</dd>
                  <dd className="text-caption text-muted-foreground tracking-wider uppercase mt-0.5">
                    New Arrival
                  </dd>
                </div>
              </dl>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-6"
            >
              <Link to="/product/charcoal-starry-dream-set" className="group block relative">
                <img
                  src="/assets/night-suits/charcoal-starry-dream-set.jpg"
                  alt="Charcoal Starry Dream Set — model wearing the moon and stars print pajama set"
                  className="w-full aspect-[4/5] object-cover rounded-md shadow-hero ring-1 ring-border"
                />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-display-4 font-semibold text-foreground">
                      Charcoal Starry Dream Set
                    </p>
                    <p className="text-small text-muted-foreground mt-0.5">
                      Soft Cotton Jersey • Sizes S–XXL
                    </p>
                  </div>
                  <span className="shrink-0 bg-primary text-primary-foreground text-caption font-body font-semibold px-3 py-2 rounded-sm uppercase tracking-wider">
                    Shop Now
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Slim static announcement bar — same items as before, no animation. */}
      <div className="bg-primary text-primary-foreground py-2.5">
        <p className="container flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-caption font-body font-semibold tracking-[0.18em] uppercase">
          {announcementItems.map((item) => (
            <span key={item} className="whitespace-nowrap">
              {item}
            </span>
          ))}
        </p>
      </div>

      {/* Collections — editorial 3:4 cards, subtle hover zoom, token scrim.
          Two collections, two cards: an intentional two-column layout, no
          filler third card (Phase 1 audit M-2). */}
      <section className="container section">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow mb-2">Browse</p>
            <h2 className="section-title">Collections</h2>
          </div>
          <Link
            to="/shop"
            className="text-small font-body font-semibold text-primary hover:underline underline-offset-4"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={`/category/${cat.slug}`}
                className="group block relative aspect-[3/4] overflow-hidden rounded-sm"
              >
                <img
                  src={COLLECTION_IMAGES[cat.slug] ?? cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-forest-deep/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-lg md:text-xl font-semibold text-ivory-light">
                    {cat.name}
                  </h3>
                  <p className="hidden md:block text-small font-body text-ivory-light/80 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                  <p className="text-caption font-body text-ivory-light/80 mt-1">
                    {cat.productCount} piece{cat.productCount === 1 ? "" : "s"}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products — curated eight (see FEATURED_SLUGS above): every
          product gets one homepage moment, so the grid is two balanced rows
          on desktop (4 + 4) instead of an arbitrary first-four slice. */}
      <section className="bg-secondary/50">
        <div className="container section">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="eyebrow mb-2">Curated</p>
              <h2 className="section-title">Featured Night Suits</h2>
            </div>
            <Link
              to="/shop"
              className="text-small font-body font-semibold text-primary hover:underline underline-offset-4"
            >
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

      {/* Promo banner — campaign-style, forest + ivory. Prices and discount
          come from the data (formatPrice + compareAtPrice); no dark gradient,
          no hardcoded colours. Phase 3: the banner image is now the CLEAN
          flat-lay (happy-sunflower-set-clean.jpg), not the promo composite —
          the composite's baked-in "NEW ARRIVAL / 50% OFF" text cropped
          awkwardly at 768px (Phase 2 observation) and duplicated the banner's
          own typography. The copy is unchanged, including "Free Delivery all
          over Pakistan." (open decision D5, BLOCKED on john). */}
      {happySet && (
        <section className="container section">
          <div className="panel-forest rounded-sm overflow-hidden shadow-elevated">
            <div className="grid md:grid-cols-2">
              <div className="px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
                <p className="eyebrow mb-3 text-ivory-light/80">New Arrival</p>
                <h2 className="font-display text-display-2 font-semibold text-ivory-light mb-4 text-balance">
                  Happy Sunflower Set{happyDiscount ? ` — ${happyDiscount}% OFF` : ""}
                </h2>
                <p className="text-body text-ivory-light/80 mb-3 leading-relaxed">
                  Soft, comfortable, ready-to-wear lounge set — now{" "}
                  <span className="font-bold text-ivory-light">{formatPrice(happySet.basePrice)}</span>
                  {happySet.compareAtPrice ? (
                    <>
                      {" "}
                      <span className="line-through opacity-70">
                        {formatPrice(happySet.compareAtPrice)}
                      </span>
                    </>
                  ) : null}
                  .
                </p>
                <p className="text-small text-ivory-light/80 mb-8 flex items-center gap-2">
                  <Truck className="w-4 h-4 shrink-0" /> Free Delivery all over Pakistan.
                </p>
                <Link to={`/product/${happySet.slug}`} className="btn-ivory">
                  Shop the Set
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <Link
                to={`/product/${happySet.slug}`}
                className="group relative block overflow-hidden aspect-[3/4] md:aspect-auto md:min-h-full"
                aria-label={happySet.name}
              >
                <img
                  src="/assets/night-suits/happy-sunflower-set-clean.jpg"
                  alt={happySet.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {happyDiscount ? (
                  <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-caption font-body font-bold tracking-wider px-2.5 py-1 rounded-sm uppercase">
                    {happyDiscount}% OFF
                  </span>
                ) : null}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals — hidden while there is a single new arrival: it is
          already featured in the promo banner above, and one card in a
          4-column grid leaves three empty cells (Phase 1 audit M-1). The
          grid uses only as many columns as there are arrivals, so no
          trailing empty cells appear. */}
      {newArrivals.length >= 2 && (
        <section className="container section">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="eyebrow mb-2">Just In</p>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <Link
              to="/shop"
              className="text-small font-body font-semibold text-primary hover:underline underline-offset-4"
            >
              Shop All
            </Link>
          </div>
          <div
            className={`grid gap-4 md:gap-6 ${
              newArrivals.length === 2
                ? "grid-cols-2"
                : newArrivals.length === 3
                  ? "grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {newArrivals.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide — supporting section, kept after product discovery so it
          does not interrupt the shopping journey. Table + photo + modal all
          preserved; the photo is shown whole (object-contain, 3:2) so no row
          or column is cropped (Phase 1 audit H-4). The size-guide graphic
          itself still has "AL UCCAZ" baked into its header — a clean graphic
          is wanted from john. */}
      <section id="size-guide" className="bg-secondary/50">
        <div className="container section">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <p className="eyebrow mb-2 flex items-center gap-2">
                <Moon className="w-3.5 h-3.5" /> Find Your Fit
              </p>
              <h2 className="section-title">Women&rsquo;s Pajama Sets Size Guide</h2>
            </div>
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="shrink-0 text-small font-body font-semibold text-primary hover:underline underline-offset-4"
            >
              Open full guide
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 bg-card rounded-sm p-6 border border-border shadow-card">
              <SizeGuideTable />
            </div>
            {/* Size-guide photo — shown whole (object-contain, 3:2, the
                photo's own aspect) so no row or column is cropped; the
                fabric chips sit below the photo, never over the data
                (Phase 1 audit H-4). The HTML table beside it carries the
                same measurements. */}
            <div className="rounded-sm bg-forest-mist shadow-card p-4">
              <img
                src={SIZE_GUIDE_IMAGE}
                alt="AL UCCAZ Women's Pajama Sets Size Guide"
                className="w-full aspect-[3/2] object-contain"
                loading="lazy"
              />
              <div className="flex flex-wrap gap-2 mt-4">
                {SIZE_GUIDE_BADGES.map((b) => (
                  <span
                    key={b}
                    className="text-caption font-body font-semibold px-2.5 py-1 rounded-sm bg-ivory-light/90 text-foreground"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter — local-only: the email is saved in this browser only,
          nothing is sent to a backend. Phase 3: a contained Forest card on
          ivory instead of a full-bleed Forest panel — the old panel ran
          straight into the Forest footer with no visual break, so the two
          dark blocks read as one. Copy and behaviour are unchanged. */}
      <section className="section-sm">
        <div className="container">
          <div className="panel-forest rounded-card shadow-elevated px-6 py-12 md:px-12 md:py-16 text-center">
            <p className="eyebrow mb-3 text-ivory-light/80">Newsletter</p>
            <h2 className="font-display text-display-3 font-semibold text-ivory-light mb-3">
              Stay in the Loop
            </h2>
            <p className="text-body text-ivory-light/80 mb-8 max-w-md mx-auto">
              Subscribe for new night-suit drops, restocks, and private sales.
            </p>
            {newsletterDone ? (
              <p className="text-small font-body text-ivory-light max-w-md mx-auto" role="status">
                You&rsquo;re on the list — saved in this browser only. New drops, restocks and
                private sales will be shared here when they go live.
              </p>
            ) : (
              <form
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                onSubmit={handleNewsletterSubmit}
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-ivory-light border border-border rounded-sm text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ivory-light/50"
                  aria-label="Email address for newsletter"
                />
                <button type="submit" className="btn-ivory">
                  Subscribe
                </button>
              </form>
            )}
            <p className="text-caption font-body text-ivory-light/60 mt-4">
              Saved only in this browser — no account needed.
            </p>
          </div>
        </div>
      </section>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
};

export default Index;
