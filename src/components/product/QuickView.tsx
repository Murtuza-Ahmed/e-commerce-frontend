import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Minus, Plus, Ruler, Truck, X } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { formatPrice, discountPercent } from "@/lib/format";
import { toast } from "sonner";
import { SizeGuideModal } from "@/components/night-suit/SizeGuide";

interface QuickViewProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export function QuickView({ product, open, onClose }: QuickViewProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { requireAuth } = useRequireAuth();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedSize(null);
      setQuantity(1);
    }
  }, [open, product.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const sizes = Array.from(new Set(product.variants.filter((v) => v.size).map((v) => v.size!)));
  const selectedVariant =
    product.variants.find((v) => v.size === selectedSize) || product.variants[0];
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (sizes.length && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!requireAuth({ slug: product.slug, variantId: selectedVariant.id, quantity })) {
      toast.info("Please login first — the item will be added to your cart after login");
      return;
    }
    addItem(product, selectedVariant, quantity);
    toast.success(`${product.name} added to cart`);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view: ${product.name}`}
          >
            <div
              className="absolute inset-0 bg-forest-deep/60 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-t-md sm:rounded-md shadow-elevated"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-background/90 hover:bg-muted rounded-full shadow-card transition-colors"
                aria-label="Close quick view"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="aspect-[3/4] sm:aspect-auto sm:min-h-[480px] overflow-hidden bg-muted">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: product.imageFocus === "right" ? "80% center" : "center" }}
                  />
                </div>

                <div className="p-6 md:p-8 flex flex-col">
                  <p className="eyebrow mb-2">
                    {product.brand}
                  </p>
                  <h2 className="font-display font-semibold text-display-4 mb-3">{product.name}</h2>

                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="text-price">{formatPrice(selectedVariant.price)}</span>
                    {selectedVariant.compareAtPrice && (
                      <>
                        <span className="text-base text-muted-foreground line-through">
                          {formatPrice(selectedVariant.compareAtPrice)}
                        </span>
                        <span className="bg-destructive text-destructive-foreground text-xs font-body font-bold px-2 py-0.5 rounded-sm">
                          {discountPercent(selectedVariant.price, selectedVariant.compareAtPrice)}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {product.freeDelivery && (
                    <p className="flex items-center gap-2 text-xs font-body text-primary mb-4">
                      <Truck className="w-4 h-4" /> Free Delivery all over Pakistan
                    </p>
                  )}

                  <p className="text-sm font-body text-muted-foreground leading-relaxed mb-5">
                    {product.shortDescription}
                  </p>

                  {product.details && (
                    <dl className="text-xs font-body space-y-1.5 mb-5 rounded-sm bg-muted/50 px-4 py-4">
                      {product.details.fabric && (
                        <div className="flex gap-2">
                          <dt className="font-semibold w-16 shrink-0">Fabric</dt>
                          <dd className="text-muted-foreground">{product.details.fabric}</dd>
                        </div>
                      )}
                      {product.details.fit && (
                        <div className="flex gap-2">
                          <dt className="font-semibold w-16 shrink-0">Fit</dt>
                          <dd className="text-muted-foreground">{product.details.fit}</dd>
                        </div>
                      )}
                      {product.details.includes && (
                        <div className="flex gap-2">
                          <dt className="font-semibold w-16 shrink-0">Includes</dt>
                          <dd className="text-muted-foreground">{product.details.includes.join(" + ")}</dd>
                        </div>
                      )}
                    </dl>
                  )}

                  {sizes.length > 0 && (
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-body font-semibold tracking-wide uppercase">Size</span>
                        <button
                          onClick={() => setShowSizeGuide(true)}
                          className="min-h-10 px-2 text-xs font-body text-primary underline underline-offset-2 flex items-center gap-1"
                        >
                          <Ruler className="w-3.5 h-3.5" /> Size Guide
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            aria-pressed={selectedSize === size}
                            className={`min-w-12 min-h-11 px-4 py-3 text-xs font-body font-medium border rounded-sm transition-all ${
                              selectedSize === size
                                ? "border-foreground bg-foreground text-background"
                                : "border-border hover:border-foreground"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center border border-border rounded-sm">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="min-w-11 min-h-11 px-3 py-3 hover:bg-muted transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2.5 text-sm font-body font-medium min-w-[2.5rem] text-center" aria-live="polite">
                        {quantity}
                      </span>
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
                      className={`min-w-11 min-h-11 p-3 border rounded-sm transition-colors ${
                        wishlisted ? "border-primary bg-primary/5" : "border-border hover:border-foreground"
                      }`}
                      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`w-5 h-5 ${wishlisted ? "fill-primary text-primary" : ""}`} />
                    </button>
                  </div>

                  <Link
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="text-sm font-body text-primary hover:underline mt-auto"
                  >
                    View full details →
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <SizeGuideModal open={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </>
  );
}
