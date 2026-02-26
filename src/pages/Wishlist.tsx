import { Link } from "react-router-dom";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { Heart, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/components/SEO";
import { formatPrice } from "@/lib/format";

const Wishlist = () => {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <SEO title="Wishlist" />
        <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
        <h1 className="text-2xl font-display font-bold mb-3">Your wishlist is empty</h1>
        <p className="text-sm font-body text-muted-foreground mb-8">Save items you love for later.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <SEO title="Wishlist" description="Your saved items at Al-ucaaz." />
      <h1 className="text-3xl font-display font-bold mb-2">Wishlist</h1>
      <p className="text-sm font-body text-muted-foreground mb-8">{items.length} saved items</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div key={item.product.id} layout exit={{ opacity: 0, scale: 0.9 }} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted">
                <Link to={`/product/${item.product.slug}`}>
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </Link>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                  aria-label={`Remove ${item.product.name} from wishlist`}
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <button
                    onClick={() => {
                      addToCart(item.product, item.product.variants[0], 1);
                      toast.success("Added to cart");
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-background/90 backdrop-blur-sm py-2.5 rounded-sm text-xs font-body font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-xs text-muted-foreground font-body tracking-wide uppercase">{item.product.brand}</p>
                <Link to={`/product/${item.product.slug}`}>
                  <h3 className="font-body font-medium text-sm hover:text-primary transition-colors">{item.product.name}</h3>
                </Link>
                <p className="font-body font-semibold text-sm">{formatPrice(item.product.basePrice)}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;
