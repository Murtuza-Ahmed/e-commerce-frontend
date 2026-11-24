# Forest & Ivory — Phase 1 Audit Summary (2026-11-08)

Working copy: `~/workspace/e-commerce-frontend-nightsuit-3d` (7 Nov 2026 copy).
Stack: React 18, TypeScript, Vite 5, Tailwind CSS 3.4, Framer Motion, React Router
DOM 6, Zustand, TanStack Query, Lucide, shadcn-style components, Helmet Async,
Zod, Sonner. No new dependencies added by this transformation.

## Structure

- Routes (src/App.tsx, lazy-loaded): `/` (Index), `/shop`, `/product/:slug`,
  `/category/:slug`, `/cart`, `/wishlist`, `/auth`, `/checkout` (protected),
  `/search`, `/dashboard` (protected), `/admin/*` (staff; roles + audit-logs
  super-admin only), `*` (NotFound). Layout = Header + Outlet + Footer.
- Data: `src/data/products.ts` — 10 night-suit products, 2 categories
  (Women's Pajama Sets ×9, Couple Sets ×1), 14 photos in
  `public/assets/night-suits/`. Prices are AUTHORIZED PLACEHOLDERS
  (Rs 2,499–3,499; Happy Sunflower Rs 2,499 was Rs 4,998 = 50% OFF in data).
- Stores: auth, cart, wishlist (Zustand). API: auth/users/RBAC/uploads/audit
  (Phase-1 identity backend); shop/cart/checkout are local/dummy until a
  Phase-2 backend exists.
- Scripts: sitemap generation + SSR prerender (19 routes). SEO via Helmet +
  JSON-LD. Analytics: Vercel Analytics + Speed Insights.

## Legacy Dark + Gold inventory (all removed in Phase 2)

- `src/index.css`: `:root` dark tokens (`--background: 30 10% 6%`,
  `--primary: 32 90% 50%` gold, `--accent: 25 75% 52%`), `--hero-gradient`,
  `--gold-shimmer`, `.gold-shimmer` + `shimmer` keyframes, `.hero-gradient`,
  `#D97706` button hover, `animate-marquee` + `marquee` keyframes,
  Playfair Display font import + `font-display` mapping.
- `tailwind.config.ts`: `fontFamily.display` Playfair Display; heavy black
  shadows (`rgba(0,0,0,0.35)` hero).
- `src/pages/Index.tsx`: `gold-shimmer` headline span, `hero-gradient`
  promo banner, hardcoded `#1f1a14` gradient scrim.
- `index.html`: `theme-color #1f1a14`.

## Good news from the audit

- Almost the entire app is semantic-token driven (`bg-background`,
  `bg-primary`, `text-muted-foreground`, `border-border`, `.btn-primary`…).
  No Tailwind palette utilities (amber/yellow/orange/blue/…) are used
  anywhere in `src`. The only hardcoded hex was `#1f1a14` (Index.tsx ×2)
  and `#D97706` (index.css ×2). The token swap therefore rethemes the
  whole app; page work is layout/typography/composition, not color hunting.
- "Orange" matches in grep are only the Faith Blossom Orange product
  name/description — not brand colors.

## Undecided / parked (NOT decided by this transformation)

- Free delivery: code threshold Rs 2,999 vs banner "Free Delivery All
  Pakistan" — wording and rules preserved exactly as-is.
- Newsletter: local-only (localStorage), no backend — copy stays honest.
- Footer links About / FAQ / Shipping & Returns / Contact / Sustainability /
  Careers / Press / Privacy / Terms are dead (no pages) — rendered as plain
  text, never fake links. No real social URLs exist — no social links.
- Happy Sunflower appeared 3× on home — Collections promo tile dropped;
  it stays in the promo banner + New Arrivals (data-driven).
- 4 low-res product photos, fabric details missing for 7 of 10 sets — need
  john's originals/input; not invented.
- Cache Components / Next.js: not applicable (React + Vite app).

## Implementation plan (prompt phases)

1. Audit — this file. 2. Design system (index.css, tailwind.config.ts,
   index.html). 3. Homepage + layout. 4. Storefront pages + product
   components. 5. Admin. 6. Responsive refinement. 7. Validation (lint,
   test, build, tsc). 8. Final report.
