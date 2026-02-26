import { useParams, Link } from "react-router-dom";
import { useState, useMemo, memo } from "react";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { Heart, Minus, Plus, Star, Truck, RotateCcw, Shield, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { formatPrice, discountPercent } from "@/lib/format";

const ProductDetail = () => {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <SEO title="Product Not Found" />
        <h1 className="text-2xl font-display font-bold mb-4">Product not found</h1>
        <Link to="/shop" className="text-sm font-body text-primary hover:underline">Back to Shop</Link>
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
      priceCurrency: "USD",
      availability: selectedVariant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

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
        <ol className="flex items-center gap-2 text-xs font-body text-muted-foreground">
          <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li><ChevronRight className="w-3 h-3" /></li>
          <li><Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link></li>
          <li><ChevronRight className="w-3 h-3" /></li>
          <li><Link to={`/category/${product.categorySlug}`} className="hover:text-foreground transition-colors">{product.category}</Link></li>
          <li><ChevronRight className="w-3 h-3" /></li>
          <li className="text-foreground" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="container pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="aspect-[3/4] overflow-hidden rounded-sm bg-muted mb-3">
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3" role="tablist" aria-label="Product images">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    role="tab"
                    aria-selected={i === selectedImage}
                    className={`w-20 h-24 overflow-hidden rounded-sm border-2 transition-colors ${
                      i === selectedImage ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
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
            <p className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground mb-2">{product.brand}</p>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-3">{product.name}</h1>

            {/* Rating */}
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
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-body font-bold">{formatPrice(selectedVariant.price)}</span>
              {selectedVariant.compareAtPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(selectedVariant.compareAtPrice)}</span>
                  <span className="bg-destructive text-destructive-foreground text-xs font-body font-bold px-2 py-0.5 rounded-sm">
                    {discountPercent(selectedVariant.price, selectedVariant.compareAtPrice)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-sm font-body text-muted-foreground leading-relaxed mb-6">{product.description}</p>

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
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
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
                  <button className="text-xs font-body text-primary underline underline-offset-2">Size Guide</button>
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
                        className={`min-w-[3rem] px-4 py-2.5 text-xs font-body font-medium border rounded-sm transition-all ${
                          selectedSize === size
                            ? "border-foreground bg-foreground text-background"
                            : outOfStock
                            ? "border-border text-muted-foreground/40 cursor-not-allowed line-through"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 hover:bg-muted transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2.5 text-sm font-body font-medium min-w-[2.5rem] text-center" aria-live="polite">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 hover:bg-muted transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-foreground text-background py-3.5 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity"
              >
                Add to Cart
              </button>
              <button
                onClick={() => toggleItem(product)}
                className={`p-3.5 border rounded-sm transition-colors ${
                  wishlisted ? "border-primary bg-primary/5" : "border-border hover:border-foreground"
                }`}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-primary text-primary" : ""}`} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="border-t border-border pt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs font-body text-muted-foreground">
                <Truck className="w-4 h-4 flex-shrink-0" /> Free shipping on orders over $250
              </div>
              <div className="flex items-center gap-3 text-xs font-body text-muted-foreground">
                <RotateCcw className="w-4 h-4 flex-shrink-0" /> 30-day return policy
              </div>
              <div className="flex items-center gap-3 text-xs font-body text-muted-foreground">
                <Shield className="w-4 h-4 flex-shrink-0" /> Authenticity guaranteed
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
            <h2 className="text-2xl font-display font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
