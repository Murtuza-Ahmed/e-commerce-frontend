/**
 * Catalog API — products, categories, orders.
 *
 * Backend (NestJS) ke liye tayyar endpoints:
 *   GET /products, GET /products/:slug, GET /categories, GET /categories/:slug, GET /orders
 *
 * Jab tak VITE_USE_API=true nahi, local static data milta hai (site abhi jaisi hai waisi chalti hai).
 * Backend set hone ke baad bhi agar API fail ho to local data par gir jata hai — site kabhi blank nahi hoti.
 */
import { products as localProducts, categories as localCategories, dummyOrders as localOrders } from "@/data/products";
import { api, isApiEnabled } from "@/lib/api-client";
import type { Product, Category, Order } from "@/types";

async function withFallback<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!isApiEnabled()) return fallback;
  try {
    return await fn();
  } catch (err) {
    console.warn(`[api] ${label} failed — local data use ho raha hai`, err);
    return fallback;
  }
}

export function getProducts(): Promise<Product[]> {
  return withFallback("getProducts", () => api.get<Product[]>("/products"), localProducts);
}

export function getProductBySlug(slug: string): Promise<Product | undefined> {
  return withFallback(
    `getProductBySlug(${slug})`,
    () => api.get<Product>(`/products/${slug}`),
    localProducts.find((p) => p.slug === slug)
  );
}

export function getCategories(): Promise<Category[]> {
  return withFallback("getCategories", () => api.get<Category[]>("/categories"), localCategories);
}

export function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return withFallback(
    `getCategoryBySlug(${slug})`,
    () => api.get<Category>(`/categories/${slug}`),
    localCategories.find((c) => c.slug === slug)
  );
}

export function getOrders(): Promise<Order[]> {
  return withFallback("getOrders", () => api.get<Order[]>("/orders"), localOrders);
}
