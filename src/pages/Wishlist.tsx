import { Link, useNavigate } from "react-router-dom";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { Heart, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/components/SEO";
import { formatPrice } from "@/lib/format";
import { useRequireAuth } from "@/hooks/use-require-auth";

const Wishlist = () => {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const navigate = useNavigate();
  const { requireAuth } = useRequireAuth();

  const handleAddToCart = (item: (typeof items)[number]) => {
    const needsSelection = item.product.variants.some((v) => v.size || v.color);
    if (needsSelection) {
      // Products with size/color options need the user to pick a variant first
      navigate(`/product/${item.product.slug}`);
      return;
    }
    // Cart me add sirf logged-in user ke liye — guest pehle login kare
    if (!requireAuth({ slug: item.product.slug, variantId: item.product.variants[0].id, quantity: 1 })) {
      toast.info("Please login first — the item will be added to your cart after login");
      return;
    }
    addToCart(item.product, item.product.variants[0], 1);
    toast.success("Added to cart");
  };

  if (items.length === 0) {
    return (
      <div className="container py-16 md:py-20">
        <SEO title="Wishlist" />
        <div className="max-w-md mx-auto text-center bg-card border border-border rounded-md shadow-card px-6 py-14">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-forest-mist flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display font-semibold text-display-4 mb-3">Your wishlist is empty</h1>
          <p className="text-sm font-body text-muted-foreground mb-8">Save items you love for later.</p>
          <Link
            to="/shop"
            className="btn-primary"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <SEO title="Wishlist" description="Your saved items at Al-ucaaz." />
      <p className="eyebrow mb-2">Saved for later</p>
      <h1 className="text-display-2 mb-2">Wishlist</h1>
      <p className="text-small text-muted-foreground mb-8">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div key={item.product.id} layout exit={{ opacity: 0, scale: 0.9 }} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted shadow-card transition-shadow duration-300 group-hover:shadow-elevated">
                <Link to={`/product/${item.product.slug}`}>
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </Link>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-full shadow-card hover:bg-background transition-colors"
                  aria-label={`Remove ${item.product.name} from wishlist`}
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute inset-x-0 bottom-0 p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full min-h-11 flex items-center justify-center gap-2 bg-background/90 backdrop-blur-sm py-3 rounded-sm text-xs font-body font-semibold tracking-wider uppercase"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-xs text-muted-foreground font-body tracking-wide uppercase">{item.product.brand}</p>
                <Link to={`/product/${item.product.slug}`}>
                  <h3 className="font-display font-semibold text-base leading-snug hover:text-primary transition-colors">{item.product.name}</h3>
                </Link>
                <p className="text-price">{formatPrice(item.product.basePrice)}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;
