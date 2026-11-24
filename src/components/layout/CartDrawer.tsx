import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/constants";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();

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

  const subtotal = totalPrice();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-forest-deep/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-card text-card-foreground shadow-elevated flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-display text-display-4 font-semibold text-primary">
                Your Cart {totalItems() > 0 && <span className="text-muted-foreground">({totalItems()})</span>}
              </h2>
              <button
                onClick={onClose}
                className="min-h-10 min-w-10 flex items-center justify-center hover:bg-muted rounded-sm transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ShoppingBag className="w-14 h-14 text-muted-foreground/30 mb-4" />
                <p className="font-display font-semibold text-display-4 mb-2">Your cart is empty</p>
                <p className="text-small font-body text-muted-foreground mb-6">
                  Soft cotton jersey night suits are waiting for you.
                </p>
                <Link to="/shop" onClick={onClose} className="btn-primary">
                  Shop Night Suits <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                {/* Free delivery progress — threshold wording kept as-is */}
                <div className="px-5 py-4 border-b border-border bg-forest-mist/60">
                  <p className="flex items-center gap-2 text-small font-body text-muted-foreground mb-2">
                    <Truck className="w-4 h-4 text-primary shrink-0" />
                    {remaining > 0 ? (
                      <span>
                        Add <span className="font-semibold text-foreground">{formatPrice(remaining)}</span> more for
                        free delivery
                      </span>
                    ) : (
                      <span className="font-semibold text-primary">You&rsquo;ve unlocked FREE delivery!</span>
                    )}
                  </p>
                  <div className="h-1.5 bg-ivory-deep rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 divide-y divide-border">
                  {items.map((item) => (
                    <div key={item.variant.id} className="flex gap-4 py-4">
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={onClose}
                        className="w-20 aspect-[3/4] flex-shrink-0 overflow-hidden rounded-sm bg-muted"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          style={{
                            objectPosition: item.product.imageFocus === "right" ? "80% center" : "center",
                          }}
                        />
                      </Link>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <Link to={`/product/${item.product.slug}`} onClick={onClose}>
                              <h3 className="font-body font-medium text-sm hover:text-primary transition-colors">
                                {item.product.name}
                              </h3>
                            </Link>
                            <p className="text-xs text-muted-foreground font-body mt-0.5">
                              {item.variant.size && `Size: ${item.variant.size}`}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.variant.id)}
                            className="min-h-10 min-w-10 flex items-center justify-center -mt-2 -mr-2 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border rounded-sm bg-background">
                            <button
                              onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                              className="min-h-10 min-w-10 flex items-center justify-center hover:bg-muted transition-colors"
                              aria-label="Decrease"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-small font-body font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                              className="min-h-10 min-w-10 flex items-center justify-center hover:bg-muted transition-colors"
                              aria-label="Increase"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="font-body font-semibold text-sm">
                            {formatPrice(item.variant.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border p-5 space-y-4 bg-ivory-light/60">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold text-price">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="text-caption font-body text-muted-foreground">
                    {remaining > 0
                      ? `Delivery calculated at checkout — free over ${formatPrice(FREE_SHIPPING_THRESHOLD)}.`
                      : "Delivery is FREE on this order."}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/cart" onClick={onClose} className="btn-secondary">
                      View Cart
                    </Link>
                    <Link to="/checkout" onClick={onClose} className="btn-primary">
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
