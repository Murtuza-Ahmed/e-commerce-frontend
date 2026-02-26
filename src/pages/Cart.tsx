import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cart";
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/components/SEO";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/constants";

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <SEO title="Cart" />
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
        <h1 className="text-2xl font-display font-bold mb-3">Your cart is empty</h1>
        <p className="text-sm font-body text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const subtotal = totalPrice();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  return (
    <div className="container py-8 md:py-12">
      <SEO title="Shopping Cart" />
      <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-0 divide-y divide-border">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.variant.id}
                layout
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-4 md:gap-6 py-6 first:pt-0"
              >
                <Link to={`/product/${item.product.slug}`} className="w-24 md:w-32 aspect-[3/4] flex-shrink-0 overflow-hidden rounded-sm bg-muted">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <Link to={`/product/${item.product.slug}`}>
                          <h3 className="font-body font-medium text-sm md:text-base hover:text-primary transition-colors">{item.product.name}</h3>
                        </Link>
                        <p className="text-xs text-muted-foreground font-body mt-0.5">
                          {item.variant.size && `Size: ${item.variant.size}`}
                          {item.variant.size && item.variant.color && " · "}
                          {item.variant.color && `Color: ${item.variant.color}`}
                        </p>
                      </div>
                      <button onClick={() => removeItem(item.variant.id)} className="p-1 text-muted-foreground hover:text-foreground transition-colors" aria-label={`Remove ${item.product.name}`}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-sm">
                      <button onClick={() => updateQuantity(item.variant.id, item.quantity - 1)} className="px-2 py-1.5 hover:bg-muted transition-colors" aria-label="Decrease">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1.5 text-xs font-body font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} className="px-2 py-1.5 hover:bg-muted transition-colors" aria-label="Increase">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-body font-semibold text-sm">{formatPrice(item.variant.price * item.quantity)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-muted/50 rounded-sm p-6 sticky top-28">
            <h2 className="font-body font-semibold text-sm tracking-wider uppercase mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-primary">Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping</p>
              )}
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">{formatPrice(total)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full text-center bg-foreground text-background py-3.5 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity mt-6"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/shop"
              className="block w-full text-center text-sm font-body text-muted-foreground hover:text-foreground mt-3 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
