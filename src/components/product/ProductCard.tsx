import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Truck } from "lucide-react";
import { Product } from "@/types";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { motion } from "framer-motion";
import { formatPrice, discountPercent } from "@/lib/format";
import { toast } from "sonner";
import { QuickView } from "./QuickView";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const { requireAuth } = useRequireAuth();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const wishlisted = isInWishlist(product.id);
  const discount = product.compareAtPrice
    ? discountPercent(product.basePrice, product.compareAtPrice)
    : 0;
  const sizes = Array.from(new Set(product.variants.filter((v) => v.size).map((v) => v.size!)));

  // Badges — at most two on the photo; free delivery moved to the price row below.
  const badges: { label: string; className: string }[] = [];
  if (product.isNew) {
    badges.push({ label: "New", className: "bg-success text-success-foreground" });
  }
  if (product.isSale && discount > 0) {
    badges.push({ label: `-${discount}%`, className: "bg-destructive text-destructive-foreground" });
  }
  if (product.isFlashSale) {
    badges.push({ label: "Flash Sale", className: "bg-primary text-primary-foreground" });
  }
  const visibleBadges = badges.slice(0, 2);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const handleQuickAdd = (size: string) => {
    const variant = product.variants.find((v) => v.size === size) || product.variants[0];
    if (!requireAuth({ slug: product.slug, variantId: variant.id, quantity: 1 })) {
      toast.info("Please login first — the item will be added to your cart after login");
      return;
    }
    addItem(product, variant, 1);
    toast.success(`${product.name} (${size}) added to cart`);
    setShowSizes(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group"
      >
        <Link to={`/product/${product.slug}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted shadow-card transition-shadow duration-300 group-hover:shadow-elevated">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: product.imageFocus === "right" ? "80% center" : "center" }}
              loading="lazy"
            />
            {visibleBadges.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                {visibleBadges.map((badge) => (
                  <span
                    key={badge.label}
                    className={`${badge.className} text-[10px] font-body font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-full shadow-card hover:bg-background transition-colors"
              aria-label="Toggle wishlist"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${wishlisted ? "fill-primary text-primary" : "text-foreground"}`}
              />
            </button>
            {/* Quick view */}
            <button
              onClick={handleQuickView}
              className="absolute inset-x-0 bottom-0 p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              aria-label={`Quick view ${product.name}`}
            >
              <span className="block bg-background/90 backdrop-blur-sm text-center py-2.5 rounded-sm text-xs font-body font-semibold tracking-wider uppercase">
                Quick View
              </span>
            </button>
          </div>
        </Link>
        <div className="mt-3 space-y-1">
          <p className="text-xs text-muted-foreground font-body tracking-wide uppercase">{product.brand}</p>
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-display font-semibold text-base leading-snug hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-price">{formatPrice(product.basePrice)}</span>
            {product.compareAtPrice && (
              <span className="text-muted-foreground text-xs line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
            {discount > 0 && (
              <span className="text-xs font-body font-semibold text-destructive">-{discount}%</span>
            )}
            {product.freeDelivery && (
              <span className="ml-auto flex items-center gap-1 text-[11px] font-body font-medium text-primary">
                <Truck className="w-3.5 h-3.5" /> Free delivery
              </span>
            )}
          </div>
          {/* Quick add — tap to pick a size, no need to open Quick View first */}
          <div className="pt-2">
            {showSizes ? (
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Choose a size to add to cart">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleQuickAdd(size)}
                    className="min-w-10 min-h-10 px-2.5 py-2 text-xs font-body font-semibold border border-border rounded-sm hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
                  >
                    {size}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowSizes(false)}
                  className="min-w-10 min-h-10 px-2.5 py-2 text-xs font-body text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close size picker"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSizes(true)}
                className="w-full min-h-11 flex items-center justify-center gap-2 py-3 text-xs font-body font-semibold tracking-wider uppercase border border-border rounded-sm hover:bg-foreground hover:text-background transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
              </button>
            )}
          </div>
        </div>
      </motion.div>
      <QuickView product={product} open={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
    </>
  );
}
