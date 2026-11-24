import { Product, Category, Order, ProductVariant } from "@/types";


// Night-suit catalog — real products from the photos john shared (Nov 2026).
// PRICES ARE PLACEHOLDERS (john said "koi bhi add kardo") — confirm/correct
// with him before launch. Fabric/fit claims are only stated where the product
// detail cards state them; everything else is described from the photo itself.
// Stock (10 per size) is a placeholder too.

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;

function variants(id: string, price: number, compareAtPrice?: number): ProductVariant[] {
  return SIZES.map((size) => ({
    id: `${id}-${size.toLowerCase()}`,
    size,
    price,
    ...(compareAtPrice ? { compareAtPrice } : {}),
    stock: 10,
    sku: `${id.toUpperCase()}-${size}`,
  }));
}

export const categories: Category[] = [
  {
    id: "womens",
    name: "Women's Pajama Sets",
    slug: "womens",
    shortLabel: "Women's",
    description:
      "Soft cotton jersey pajama sets in relaxed fits — moon-and-stars, blossom and sunflower prints, sizes S–XXL.",
    image: "/assets/night-suits/charcoal-starry-dream-set.jpg",
    productCount: 9,
  },
  {
    id: "couple",
    name: "Couple Sets",
    slug: "couple",
    shortLabel: "Couple",
    description: "Matching his-and-hers night suits — the Wifey & Hubby set for lazy mornings together.",
    image: "/assets/night-suits/wifey-hubby-couple-set.jpg",
    productCount: 1,
  },
];

export const products: Product[] = [
  {
    id: "ns-01",
    name: "Wifey & Hubby Couple Set",
    slug: "wifey-hubby-couple-set",
    description:
      "A matching his-and-hers pajama set in rich chocolate brown. Both tees carry a playful coffee-cup print — 'wifey' and 'hubby' — with matching full-length pants. Made for lazy mornings together.",
    shortDescription:
      "Matching his-and-hers pajama sets in rich brown — 'wifey' and 'hubby' coffee-cup prints.",
    basePrice: 3499,
    images: ["/assets/night-suits/wifey-hubby-couple-set.jpg"],
    category: "Couple Sets",
    categorySlug: "couple",
    brand: "Al-ucaaz",
    variants: variants("ns-01", 3499),
    tags: ["couple set", "pajama set", "night suit", "matching", "wifey", "hubby"],
    rating: 0,
    reviewCount: 0,
    status: "active",
    createdAt: "2026-11-06",
  },
  {
    id: "ns-02",
    name: "Bear Print Set",
    slug: "bear-print-set",
    description:
      "A playful two-piece pajama set — grey short-sleeve tee with a bear print, paired with white full-length pants covered in a cute bear pattern.",
    shortDescription: "Playful grey tee with a bear print, paired with white bear-print pajama pants.",
    basePrice: 2499,
    images: ["/assets/night-suits/bear-print-set.jpg"],
    category: "Women's Pajama Sets",
    categorySlug: "womens",
    brand: "Al-ucaaz",
    variants: variants("ns-02", 2499),
    tags: ["pajama set", "night suit", "bear print", "loungewear"],
    rating: 0,
    reviewCount: 0,
    status: "active",
    createdAt: "2026-11-06",
  },
  {
    id: "ns-03",
    name: "Burgundy Satin Set",
    slug: "burgundy-satin-set",
    description:
      "A maroon satin-finish pajama set with a soft sheen — short-sleeve top with matching full-length pants.",
    shortDescription: "Maroon satin pajama set with a soft sheen — short-sleeve top and matching pants.",
    basePrice: 3499,
    images: ["/assets/night-suits/burgundy-satin-set.jpg"],
    category: "Women's Pajama Sets",
    categorySlug: "womens",
    brand: "Al-ucaaz",
    variants: variants("ns-03", 3499),
    tags: ["pajama set", "night suit", "satin", "loungewear"],
    rating: 0,
    reviewCount: 0,
    status: "active",
    createdAt: "2026-11-06",
  },
  {
    id: "ns-04",
    name: "Mustard Tree Print Pajama Set",
    slug: "mustard-tree-print-set",
    description:
      "A long-sleeve button-up pajama set in warm mustard — classic collared shirt with a playful tree print and matching full-length pants.",
    shortDescription: "Long-sleeve button-up pajama set in warm mustard with a playful tree print.",
    basePrice: 2999,
    images: ["/assets/night-suits/mustard-tree-print-set.jpg"],
    category: "Women's Pajama Sets",
    categorySlug: "womens",
    brand: "Al-ucaaz",
    variants: variants("ns-04", 2999),
    tags: ["pajama set", "night suit", "button-up", "long sleeve", "tree print"],
    rating: 0,
    reviewCount: 0,
    status: "active",
    createdAt: "2026-11-06",
  },
  {
    id: "ns-05",
    name: "Charcoal Starry Dream Set",
    slug: "charcoal-starry-dream-set",
    description:
      "A charcoal pajama set with a dreamy moon-and-stars line-art print. Fabric: Soft Cotton Jersey — lightweight, soft and smooth for all-day comfort. Breathable, relaxed fit. The set includes a short-sleeve crewneck T-shirt and elastic-waist pajama pants with side pockets. Machine washable, soft & cozy, everyday comfort.",
    shortDescription: "Moon-and-stars print pajama set in soft cotton jersey — breathable, relaxed fit.",
    basePrice: 2499,
    images: [
      "/assets/night-suits/charcoal-starry-dream-set.jpg",
      // Model-only crop of the old "details" composite (Phase 1B) — the
      // info-card half with the misspelled brand is gone.
      "/assets/night-suits/charcoal-starry-dream-set-model.jpg",
    ],
    category: "Women's Pajama Sets",
    categorySlug: "womens",
    brand: "Al-ucaaz",
    variants: variants("ns-05", 2499),
    tags: ["pajama set", "night suit", "cotton jersey", "moon", "stars", "relaxed fit"],
    rating: 0,
    reviewCount: 0,
    status: "active",
    createdAt: "2026-11-06",
    details: {
      fabric: "Soft Cotton Jersey — lightweight, soft, smooth",
      fit: "Breathable · Relaxed Fit",
      includes: ["Short-sleeve crewneck T-shirt", "Elastic-waist pajama pants with side pockets"],
      care: ["Machine Washable", "Soft & Cozy", "Everyday Comfort"],
    },
  },
  {
    id: "ns-06",
    name: "Faith Blossom Set — Orange",
    slug: "faith-blossom-orange",
    description:
      "A bright orange pajama set with a 'faith' script and blossom line-art print on the short-sleeve tee, paired with matching full-length pants.",
    shortDescription: "Bright orange pajama set with a 'faith' script and blossom line-art print.",
    basePrice: 2499,
    images: [
      "/assets/night-suits/faith-blossom-orange.jpg",
      "/assets/night-suits/faith-blossom-orange-alt.jpg",
    ],
    category: "Women's Pajama Sets",
    categorySlug: "womens",
    brand: "Al-ucaaz",
    variants: variants("ns-06", 2499),
    tags: ["pajama set", "night suit", "faith", "blossom", "orange"],
    rating: 0,
    reviewCount: 0,
    status: "active",
    createdAt: "2026-11-06",
  },
  {
    id: "ns-07",
    name: "Faith Blossom Set — Navy",
    slug: "faith-blossom-navy",
    description:
      "A navy pajama set with a 'faith' script and blossom line-art print. Fabric: Cotton Jersey — lightweight, breathable and smooth for all-day comfort. Relaxed fit. The set includes a short-sleeve crewneck T-shirt and elastic-waist pajama pants with side pockets. Machine washable, soft & cozy, everyday comfort.",
    shortDescription: "Navy pajama set with a 'faith' script and blossom print — cotton jersey, breathable, relaxed fit.",
    basePrice: 2499,
    images: [
      "/assets/night-suits/faith-blossom-navy.jpg",
      // Model-only crop of the old "details" composite (Phase 1B) — the
      // info-card half with the misspelled brand is gone.
      "/assets/night-suits/faith-blossom-navy-model.jpg",
    ],
    category: "Women's Pajama Sets",
    categorySlug: "womens",
    brand: "Al-ucaaz",
    variants: variants("ns-07", 2499),
    tags: ["pajama set", "night suit", "cotton jersey", "faith", "blossom", "navy"],
    rating: 0,
    reviewCount: 0,
    status: "active",
    createdAt: "2026-11-06",
    details: {
      fabric: "Cotton Jersey — lightweight, breathable, smooth",
      fit: "Breathable · Relaxed Fit",
      includes: ["Short-sleeve crewneck T-shirt", "Elastic-waist pajama pants with side pockets"],
      care: ["Machine Washable", "Soft & Cozy", "Everyday Comfort"],
    },
  },
  {
    id: "ns-08",
    name: "Black Abstract Line Art Set",
    slug: "black-abstract-line-art-set",
    description:
      "A bold black pajama set with white abstract line art. Fabric: Soft Cotton Jersey — lightweight, soft and smooth for all-day comfort. Breathable, relaxed fit. The set includes a short-sleeve crewneck T-shirt and elastic-waist pajama pants with side pockets. Machine washable, soft & cozy, everyday comfort.",
    shortDescription: "Bold black pajama set with white abstract line art — soft cotton jersey, breathable, relaxed fit.",
    basePrice: 2999,
    // Clean model-only crop (Phase 1B): the original was a composite info card
    // with a misspelled brand ("AL UCCAZ"); the crop is the model half only.
    // The model's head is already cut off in the source — a clean original
    // photo is still wanted from john.
    images: ["/assets/night-suits/black-abstract-line-art-set-clean.jpg"],
    category: "Women's Pajama Sets",
    categorySlug: "womens",
    brand: "Al-ucaaz",
    variants: variants("ns-08", 2999),
    tags: ["pajama set", "night suit", "cotton jersey", "line art", "black"],
    rating: 0,
    reviewCount: 0,
    status: "active",
    createdAt: "2026-11-06",
    details: {
      fabric: "Soft Cotton Jersey — lightweight, soft, smooth",
      fit: "Breathable · Relaxed Fit",
      includes: ["Short-sleeve crewneck T-shirt", "Elastic-waist pajama pants with side pockets"],
      care: ["Machine Washable", "Soft & Cozy", "Everyday Comfort"],
    },
  },
  {
    id: "ns-09",
    name: "Happy Sunflower Set",
    slug: "happy-sunflower-set",
    description:
      "A charcoal lounge set with a cheerful 'happy' script and sunflower print. NEW ARRIVAL — 50% OFF with Free Delivery all over Pakistan. Soft, comfortable, ready-to-wear.",
    shortDescription: "Charcoal lounge set with a cheerful 'happy' script and sunflower print — NEW ARRIVAL, 50% OFF.",
    basePrice: 2499,
    compareAtPrice: 4998,
    // Clean flat-lay crop (Phase 1B): the original is a promo composite with
    // baked-in text — it stays the campaign-banner image only (see Index.tsx),
    // never the product-card photo.
    images: ["/assets/night-suits/happy-sunflower-set-clean.jpg"],
    category: "Women's Pajama Sets",
    categorySlug: "womens",
    brand: "Al-ucaaz",
    variants: variants("ns-09", 2499, 4998),
    tags: ["pajama set", "night suit", "sunflower", "happy", "new arrival", "sale"],
    rating: 0,
    reviewCount: 0,
    isNew: true,
    isSale: true,
    freeDelivery: true,
    status: "active",
    createdAt: "2026-11-06",
  },
  {
    id: "ns-10",
    name: "I'm Not Perfect Set",
    slug: "im-not-perfect-set",
    description:
      "A deep green pajama set with an 'I'm Not Perfect' print in white and pink script — relaxed short-sleeve tee with matching full-length pants.",
    shortDescription: "Deep green pajama set with an 'I'm Not Perfect' print in white and pink script.",
    basePrice: 2499,
    images: ["/assets/night-suits/im-not-perfect-set.jpg"],
    category: "Women's Pajama Sets",
    categorySlug: "womens",
    brand: "Al-ucaaz",
    variants: variants("ns-10", 2499),
    tags: ["pajama set", "night suit", "im not perfect", "green"],
    rating: 0,
    reviewCount: 0,
    status: "active",
    createdAt: "2026-11-06",
  },
];


export const dummyOrders: Order[] = [
  {
    id: "ORD-001",
    userId: "1",
    items: [],
    status: "delivered",
    total: 718,
    shippingAddress: "123 Fashion Ave, New York, NY 10001",
    createdAt: "2024-02-15",
    updatedAt: "2024-02-20",
  },
  {
    id: "ORD-002",
    userId: "1",
    items: [],
    status: "shipped",
    total: 329,
    shippingAddress: "456 Style Blvd, Los Angeles, CA 90001",
    createdAt: "2024-02-18",
    updatedAt: "2024-02-19",
  },
  {
    id: "ORD-003",
    userId: "2",
    items: [],
    status: "processing",
    total: 1120,
    shippingAddress: "789 Luxe St, Miami, FL 33101",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
  },
  {
    id: "ORD-004",
    userId: "3",
    items: [],
    status: "pending",
    total: 489,
    shippingAddress: "321 Elegance Rd, Chicago, IL 60601",
    createdAt: "2024-02-22",
    updatedAt: "2024-02-22",
  },
  {
    id: "ORD-005",
    userId: "1",
    items: [],
    status: "cancelled",
    total: 275,
    shippingAddress: "123 Fashion Ave, New York, NY 10001",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-02",
  },
  {
    id: "ORD-006",
    userId: "2",
    items: [],
    status: "delivered",
    total: 814,
    shippingAddress: "789 Luxe St, Miami, FL 33101",
    createdAt: "2024-03-05",
    updatedAt: "2024-03-12",
  },
];

