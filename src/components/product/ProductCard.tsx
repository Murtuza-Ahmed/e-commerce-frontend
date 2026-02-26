import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { useWishlistStore } from "@/store/wishlist";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-success text-success-foreground text-[10px] font-body font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm">
                New
              </span>
            )}
            {product.isSale && (
              <span className="bg-destructive text-destructive-foreground text-[10px] font-body font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm">
                Sale
              </span>
            )}
            {product.isFlashSale && (
              <span className="bg-primary text-primary-foreground text-[10px] font-body font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm">
                Flash Sale
              </span>
            )}
          </div>
          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleItem(product);
            }}
            className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            aria-label="Toggle wishlist"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${wishlisted ? "fill-primary text-primary" : "text-foreground"}`}
            />
          </button>
          {/* Quick view overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-background/90 backdrop-blur-sm text-center py-2.5 rounded-sm text-xs font-body font-semibold tracking-wider uppercase">
              Quick View
            </div>
          </div>
        </div>
      </Link>
      <div className="mt-3 space-y-1">
        <p className="text-xs text-muted-foreground font-body tracking-wide uppercase">{product.brand}</p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-body font-medium text-sm leading-snug hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-body font-semibold text-sm">${product.basePrice}</span>
          {product.compareAtPrice && (
            <span className="text-muted-foreground text-xs line-through">${product.compareAtPrice}</span>
          )}
        </div>
        {/* Color swatches */}
        {product.variants.some((v) => v.colorHex) && (
          <div className="flex gap-1.5 pt-1">
            {Array.from(new Set(product.variants.filter((v) => v.colorHex).map((v) => v.colorHex))).map((hex) => (
              <span
                key={hex}
                className="w-3.5 h-3.5 rounded-full border border-border"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
