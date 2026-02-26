import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Search, Menu, X, User } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useAuthStore } from "@/store/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Men", href: "/category/mens" },
  { label: "Women", href: "/category/womens" },
  { label: "Accessories", href: "/category/accessories" },
  { label: "Footwear", href: "/category/footwear" },
];

export function Header() {
  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { isAuthenticated, user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        {/* Top bar */}
        <div className="bg-foreground text-background text-xs text-center py-1.5 font-body tracking-wider">
          FREE SHIPPING ON ORDERS OVER $250 — CODE: <span className="font-semibold">FREESHIP</span>
        </div>

        <div className="container flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 -ml-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="font-display text-xl md:text-2xl font-bold tracking-tight">
            AL-UCAAZ
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-body font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <ThemeToggle />
            <Link to="/search" aria-label="Search" className="p-2 hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="p-2 hover:text-primary transition-colors relative">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" aria-label="Cart" className="p-2 hover:text-primary transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to={isAuthenticated ? "/dashboard" : "/auth"}
              aria-label="Account"
              className="p-2 hover:text-primary transition-colors hidden md:block"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden z-40 fixed top-[calc(2.25rem+4rem)] left-0 right-0"
          >
            <nav className="container py-4 flex flex-col gap-3" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeMobile}
                  className="text-base font-body font-medium py-2 text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to={isAuthenticated ? "/dashboard" : "/auth"}
                onClick={closeMobile}
                className="text-base font-body font-medium py-2 text-foreground hover:text-primary transition-colors"
              >
                {isAuthenticated ? `Hi, ${user?.name}` : "Sign In"}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
