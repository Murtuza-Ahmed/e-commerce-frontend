import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { Heart, Minus, Plus, Star, Truck, RotateCcw, Shield, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { formatPrice, discountPercent } from "@/lib/format";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { SizeGuideModal } from "@/components/night-suit/SizeGuide";
import { FREE_SHIPPING_THRESHOLD } from "@/constants";

const ProductDetail = () => {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const addItem = useCartStore((s) => s.addItem);
  const { requireAuth } = useRequireAuth();
  const { isInWishlist, toggleItem } = useWishlistStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <SEO title="Product Not Found" />
        <h1 className="text-display-3 mb-4">Product not found</h1>
        <p className="text-sm font-body text-muted-foreground mb-8">
          This piece doesn&apos;t exist or has been moved.
        </p>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const sizes = Array.from(new Set(product.variants.filter((v) => v.size).map((v) => v.size!)));
  const colors = Array.from(
    new Map(product.variants.filter((v) => v.color).map((v) => [v.color!, { name: v.color!, hex: v.colorHex! }])).values()
  );

  const selectedVariant = product.variants.find(
    (v) =>
      (!sizes.length || v.size === selectedSize) &&
      (!colors.length || v.color === selectedColor)
  ) || product.variants[0];

  const wishlisted = isInWishlist(product.id);
  const related = products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (sizes.length && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (colors.length && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    // Cart me add sirf logged-in user ke liye — guest pehle login kare,
    // login ke baad yehi item khud cart me add ho jayega (Auth page par)
    if (!requireAuth({ slug: product.slug, variantId: selectedVariant.id, quantity })) {
      toast.info("Please login first — the item will be added to your cart after login");
      return;
    }
    addItem(product, selectedVariant, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: Math.min(...product.variants.map((v) => v.price)),
      highPrice: Math.max(...product.variants.map((v) => v.price)),
      priceCurrency: "PKR",
      availability: selectedVariant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  const galleryFit = (i: number) =>
    product.imagesFit?.[i] === "contain" ? "object-contain bg-muted" : "object-cover";

  return (
    <div>
      <SEO
        title={product.name}
        description={product.shortDescription}
        image={product.images[0]}
        type="product"
        schema={productSchema}
      />

      {/* Breadcrumb */}
      <nav className="container py-4" aria-label="Breadcrumb">
        <ol className="breadcrumb">
          <li><Link to="/" className="breadcrumb-link">Home</Link></li>
          <li><ChevronRight className="w-3 h-3" /></li>
          <li><Link to="/shop" className="breadcrumb-link">Shop</Link></li>
          <li><ChevronRight className="w-3 h-3" /></li>
          <li><Link to={`/category/${product.categorySlug}`} className="breadcrumb-link">{product.category}</Link></li>
          <li><ChevronRight className="w-3 h-3" /></li>
          <li className="breadcrumb-current" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="container pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="aspect-[3/4] overflow-hidden rounded-card bg-muted shadow-card mb-3">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className={`w-full h-full ${galleryFit(selectedImage)}`}
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3" role="tablist" aria-label="Product images">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    role="tab"
                    aria-selected={i === selectedImage}
                    className={`w-20 h-24 overflow-hidden rounded-card border-2 transition-colors ${
                      i === selectedImage ? "border-primary" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      className={`w-full h-full ${galleryFit(i)}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="eyebrow mb-2">{product.brand}</p>
            <h1 className="font-display font-semibold text-display-3 md:text-display-2 mb-3">{product.name}</h1>

            {/* Rating — hidden until real reviews exist (all products are 0/0) */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5" aria-label={`Rating: ${product.rating} out of 5`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-body text-muted-foreground">
                  {`${product.rating} (${product.reviewCount} reviews)`}
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-2xl font-body font-bold">{formatPrice(selectedVariant.price)}</span>
              {selectedVariant.compareAtPrice && (
                <>
                  <span className="price-compare text-lg">{formatPrice(selectedVariant.compareAtPrice)}</span>
                  <span className="badge badge-sale">
                    {discountPercent(selectedVariant.price, selectedVariant.compareAtPrice)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-body text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            {/* Fabric / fit details — only where the product's detail card states them */}
            {product.details && (
              <dl className="card text-sm font-body space-y-2 mb-6 p-5">
                {product.details.fabric && (
                  <div className="flex gap-3">
                    <dt className="font-semibold w-20 shrink-0">Fabric</dt>
                    <dd className="text-muted-foreground">{product.details.fabric}</dd>
                  </div>
                )}
                {product.details.fit && (
                  <div className="flex gap-3">
                    <dt className="font-semibold w-20 shrink-0">Fit</dt>
                    <dd className="text-muted-foreground">{product.details.fit}</dd>
                  </div>
                )}
                {product.details.includes && (
                  <div className="flex gap-3">
                    <dt className="font-semibold w-20 shrink-0">Includes</dt>
                    <dd className="text-muted-foreground">{product.details.includes.join(" + ")}</dd>
                  </div>
                )}
                {product.details.care && (
                  <div className="flex gap-3">
                    <dt className="font-semibold w-20 shrink-0">Care</dt>
                    <dd className="text-muted-foreground">{product.details.care.join(" · ")}</dd>
                  </div>
                )}
              </dl>
            )}

            {/* Color selector */}
            {colors.length > 0 && (
              <fieldset className="mb-5">
                <legend className="text-xs font-body font-semibold tracking-wide uppercase mb-3">
                  Color: {selectedColor || "Select"}
                </legend>
                <div className="flex gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === c.name ? "border-primary ring-2 ring-primary/30" : "border-border"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      aria-label={c.name}
                      aria-pressed={selectedColor === c.name}
                    />
                  ))}
                </div>
              </fieldset>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <fieldset className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <legend className="text-xs font-body font-semibold tracking-wide uppercase">Size</legend>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="min-h-10 px-2 text-xs font-body text-primary underline underline-offset-2"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const variant = product.variants.find(
                      (v) => v.size === size && (!selectedColor || v.color === selectedColor)
                    );
                    const outOfStock = !variant || variant.stock === 0;
                    return (
                      <button
                        key={size}
                        onClick={() => !outOfStock && setSelectedSize(size)}
                        disabled={outOfStock}
                        aria-pressed={selectedSize === size}
                        className={`size-btn ${selectedSize === size ? "size-btn-active" : ""}`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3 md:gap-4 mb-6">
              <div className="flex items-center border border-border rounded-sm bg-card">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="min-w-11 min-h-11 px-3 py-3 hover:bg-muted transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2.5 text-sm font-body font-medium min-w-[2.5rem] text-center" aria-live="polite">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="min-w-11 min-h-11 px-3 py-3 hover:bg-muted transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary"
              >
                Add to Cart
              </button>
              <button
                onClick={() => toggleItem(product)}
                className={`min-w-11 min-h-11 p-3.5 border rounded-sm transition-colors ${
                  wishlisted ? "border-primary bg-primary/5" : "border-border bg-card hover:border-foreground"
                }`}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-primary text-primary" : ""}`} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="border-t border-border pt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs font-body text-muted-foreground">
                <span className="icon-circle">
                  <Truck className="w-4 h-4 text-primary" />
                </span>
                Free delivery on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </div>
              <div className="flex items-center gap-3 text-xs font-body text-muted-foreground">
                <span className="icon-circle">
                  <RotateCcw className="w-4 h-4 text-primary" />
                </span>
                30-day return policy
              </div>
              <div className="flex items-center gap-3 text-xs font-body text-muted-foreground">
                <span className="icon-circle">
                  <Shield className="w-4 h-4 text-primary" />
                </span>
                Authenticity guaranteed
              </div>
            </div>

            <p className="text-xs text-muted-foreground font-body mt-4">
              SKU: {selectedVariant.sku} · {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : "Out of stock"}
            </p>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="section-title mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
};

export default ProductDetail;
