import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Heart, Search, Menu, X, User } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useAuthStore } from "@/store/auth";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CartDrawer } from "./CartDrawer";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/constants";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Women", href: "/category/womens" },
  { label: "Couple Sets", href: "/category/couple" },
];

export function Header() {
  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { isAuthenticated, user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-ivory-light/95 backdrop-blur-md border-b border-border">
        {/* Top bar — free-delivery wording kept exactly as-is. */}
        <div className="bg-primary text-primary-foreground text-[11px] text-center py-1.5 px-4 font-body font-semibold tracking-[0.14em] uppercase">
          FREE DELIVERY ALL OVER PAKISTAN ON ORDERS OVER {formatPrice(FREE_SHIPPING_THRESHOLD)}
        </div>

        <div className="container flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden min-h-10 min-w-10 flex items-center justify-center -ml-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="font-display text-xl md:text-2xl font-bold tracking-tight text-primary"
          >
            AL-UCAAZ
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm font-body font-medium tracking-wide transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <Link
              to="/search"
              aria-label="Search"
              className="min-h-10 min-w-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="min-h-10 min-w-10 flex items-center justify-center text-foreground hover:text-primary transition-colors relative"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-primary text-primary-foreground text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className="min-h-10 min-w-10 flex items-center justify-center text-foreground hover:text-primary transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-primary text-primary-foreground text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <Link
              to={isAuthenticated ? "/dashboard" : "/auth"}
              aria-label="Account"
              className="min-h-10 min-w-10 hidden md:flex items-center justify-center text-foreground hover:text-primary transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile menu — inside the sticky header so it sits directly below it. */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-ivory-light border-t border-border overflow-hidden"
            >
              <nav className="container py-4 flex flex-col gap-1" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `text-base font-body font-medium py-2.5 transition-colors ${
                        isActive ? "text-primary" : "text-foreground hover:text-primary"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <Link
                  to={isAuthenticated ? "/dashboard" : "/auth"}
                  onClick={closeMobile}
                  className="text-base font-body font-medium py-2.5 text-foreground hover:text-primary transition-colors"
                >
                  {isAuthenticated ? `Hi, ${user?.name}` : "Sign In"}
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
