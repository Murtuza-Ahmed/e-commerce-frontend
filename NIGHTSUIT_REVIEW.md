# Al-ucaaz — Night Suits (Premium Storefront)

> **UPDATE 2026-11-07 — Phase 0.3 (Design System + 3D removal).** The 3D hero
> is GONE at john's request (he said the 3D was not that special): the home
> page now has a static photo hero using the Charcoal Starry Dream Set photo.
> `three` + `@types/three` were removed from `package.json` — `npm install`
> no longer installs them. Dark + Gold is now the single theme (`:root` in
> `src/index.css`; the light theme was removed) and buttons use the new
> `.btn-primary` / `.btn-secondary` / `.btn-ghost` classes. The notes below
> about the 3D hero no longer apply; everything else still stands.

Local redesign of the e-commerce frontend: all perfume/fashion dummy content
replaced with the real night-suit products from the photos. Nothing was pushed
or deployed — this is a local copy for review.

## How to run / review

```bash
npm install        # installs the dependencies (three.js no longer included)
npm run dev        # dev server (default http://localhost:8080)
npm run build      # production build + prerender (already verified green)
npm run preview    # serve the production build locally
```

## What changed

- **Home page** (`src/pages/Index.tsx`): dark premium hero with a static
  Charcoal Starry Dream Set photo beside the headline (the 3D fabric
  animation was removed 2026-11-07), promo marquee, collections, featured
  sets, 50% OFF Happy Sunflower banner, New Arrivals, and a Size Guide section.
- **Products** (`src/data/products.ts`): 10 real night suits with your photos
  (in `public/assets/night-suits/`), 2 categories — Women's Pajama Sets (9)
  and Couple Sets (1).
- **Size guide** (`src/data/sizeGuide.ts`, `src/components/night-suit/SizeGuide.tsx`):
  the S–XXL table from your size-guide photo, as a home section + modal
  (also opened from product pages and Quick View).
- **Quick View** (`src/components/product/QuickView.tsx`): the card overlay now
  opens a real modal — photo, price, sizes, add to cart, size guide.
- **Cart drawer** (`src/components/layout/CartDrawer.tsx`): header cart icon
  opens a slide-over cart with free-delivery progress. `/cart` page still works.
- **Prices in PKR**: `formatPrice` now renders "Rs 2,499" etc. (was USD).
  Free delivery over Rs 2,999; shipping Rs 199 below that; no tax line.
- **Copy everywhere**: header, footer, SEO, search suggestions, shop — all
  night suits now. Routes, auth, and backend wiring (`VITE_API_URL`) untouched.

## Placeholder prices — confirm / correct these

You said "koi bhi add kardo", so these are placeholders, NOT real prices:

| Product | Price |
|---|---|
| Wifey & Hubby Couple Set | Rs 3,499 |
| Bear Print Set | Rs 2,499 |
| Burgundy Satin Set | Rs 3,499 |
| Mustard Tree Print Pajama Set | Rs 2,999 |
| Charcoal Starry Dream Set | Rs 2,499 |
| Faith Blossom Set — Orange | Rs 2,499 |
| Faith Blossom Set — Navy | Rs 2,499 |
| Black Abstract Line Art Set | Rs 2,999 |
| Happy Sunflower Set | Rs 2,499 (was Rs 4,998 — 50% OFF) |
| I'm Not Perfect Set | Rs 2,499 |

Also placeholders: stock 10 per size, free-delivery threshold Rs 2,999,
shipping Rs 199. Fabric/fit details are shown only where the product detail
cards stated them (Starry Dream, Faith Navy, Black Line Art); other products
show no fabric claim yet.

## Open items / to confirm

- Real prices for all 10 sets (see table above).
- Couple-set sizes: the size guide is women's only — S–XXL was assumed for
  the Wifey & Hubby set too.
- Fabric details for Bear, Burgundy Satin, Mustard, Faith Orange, Happy,
  I'm Not Perfect (not stated in their photos).
- Stock/availability per size.
- The 3D hero was removed 2026-11-07 (Phase 0.3) and replaced with a static
  Charcoal Starry Dream Set photo hero.
- The new static hero was verified by build + prerender + HTTP smoke test,
  NOT by a visual browser check (no browser here). Please open the home page
  and check the hero looks right on your screen.

---

## Forest & Ivory transformation (2026-11-08) — john's 16-section prompt

The Dark + Gold Phase 0.3 design system in this copy is REPLACED by the
official Forest & Ivory identity: Forest Green #183D32 + Ivory #F3F0E7.
- `src/index.css`: all tokens re-mapped to Forest/Ivory HSL; Cormorant
  Garamond headings (was Playfair Display), DM Sans body kept; buttons now
  sentence-case 14px/600; gold-shimmer / hero-gradient / marquee removed;
  `prefers-reduced-motion` respected.
- `tailwind.config.ts`: type scale per prompt (hero 56–76px desktop,
  page H1 48px, H2 32px, H3 24px), forest/ivory colors, soft shadows.
- Homepage, Header, Footer, CartDrawer, SizeGuide, all product components,
  all storefront pages and the whole admin dashboard redesigned; all logic,
  routes, stores, auth guards, SEO and prerendering preserved.
- Prices are still the authorized PLACEHOLDERS (Rs 2,499–3,499); free
  delivery wording/rules unchanged (undecided); newsletter still local-only.
- Verification: `npm run lint` 0 errors, `npm run test` 12/12 pass,
  `npx tsc -b` clean, `npm run build` pass (client + SSR + 19 prerendered
  routes), HTTP smoke test 8/8 routes 200. NOT verified in a browser:
  john to open the site and check the visual look.
