export const SITE_NAME = "Al-ucaaz";
export const FREE_SHIPPING_THRESHOLD = 250;
export const SHIPPING_COST = 15;
export const TAX_RATE = 0.08;

// ⚠️ Apna real domain yahan lagao jab site live ho (sitemap, canonical URLs aur social share images ke liye use hota hai)
export const SITE_URL = "https://al-ucaaz.vercel.app/";
// 1200x630 brand cover image — public/og-image.jpg me apni image rakho
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const STORE_KEYS = {
  auth: "al-ucaaz-auth",
  cart: "al-ucaaz-cart",
  wishlist: "al-ucaaz-wishlist",
  theme: "al-ucaaz-theme",
} as const;

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
