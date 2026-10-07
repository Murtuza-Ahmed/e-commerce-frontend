/**
 * Catalog data hooks (react-query).
 *
 * Backend lagne ke baad pages me `products`/`categories` ke direct imports
 * ki jagah ye hooks use honge — loading/error states skeletons se handle hain.
 * Abhi ye local data dete hain (VITE_USE_API=false), baad me API se aayega.
 */
import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductBySlug, getCategories, getCategoryBySlug } from "@/api/catalog";

export const catalogKeys = {
  all: ["catalog"] as const,
  products: () => [...catalogKeys.all, "products"] as const,
  product: (slug: string) => [...catalogKeys.products(), slug] as const,
  categories: () => [...catalogKeys.all, "categories"] as const,
  category: (slug: string) => [...catalogKeys.categories(), slug] as const,
};

export function useProducts() {
  return useQuery({ queryKey: catalogKeys.products(), queryFn: getProducts });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: catalogKeys.product(slug ?? ""),
    queryFn: () => getProductBySlug(slug as string),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({ queryKey: catalogKeys.categories(), queryFn: getCategories });
}

export function useCategory(slug: string | undefined) {
  return useQuery({
    queryKey: catalogKeys.category(slug ?? ""),
    queryFn: () => getCategoryBySlug(slug as string),
    enabled: !!slug,
  });
}
