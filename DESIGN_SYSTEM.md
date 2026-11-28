# Al-ucaaz Design System — Production Tokens & Components

> **Phase 2 deliverable (27 Nov 2026).** This document is the single source of truth for
> the Al-ucaaz storefront + admin design system. It standardises the Forest & Ivory
> identity (Forest Green `#183D32` + Ivory `#F3F0E7`) that was introduced in the
> 8 Nov 2026 transformation, and the responsive fixes from Phase 1B.
>
> **Scope:** foundational tokens + reusable components only. Page layouts (homepage,
> Shop, Category, Product Detail, Cart, Wishlist, Checkout, admin pages) are NOT
> redesigned in Phase 2 — they adopt the tokens through the shared classes listed
> below. Page-level design issues found during Phase 2 are listed in
> §10 for a future phase.
>
> **Stack:** React 18, TypeScript, Vite 5, Tailwind CSS 3.4 (HSL CSS variables).
> No Next.js, no MUI, no Tailwind v4.

---

## 1. Brand

| Token | Value | Usage |
|---|---|---|
| **Forest** (primary) | `#183D32` — `hsl(162 44% 17%)` | Primary actions, headings accents, header/footer, badges |
| **Ivory** (background) | `#F3F0E7` — `hsl(45 33% 93%)` | Page background |
| Forest deep | `hsl(162 44% 12%)` | Primary hover, footer, size-guide modal header |
| Forest soft | `hsl(162 25% 35%)` | Muted forest text on light surfaces |
| Forest mist | `hsl(45 20% 90%)` | Icon chips, soft icon backgrounds |
| Ivory light | `hsl(45 33% 96%)` | Card surface |
| Ivory deep | `hsl(45 33% 88%)` | Secondary (filled soft) buttons, soft surfaces |

**Rule:** the two brand colours dominate. All supporting shades are derived from
Forest/Ivory only. No gold, orange, purple or blue decorative accents anywhere
(the Dark + Gold theme was removed completely on 8 Nov 2026).

---

## 2. Colour tokens

CSS custom properties are the source of truth (`src/index.css` `:root`).
Tailwind maps them to utilities (`tailwind.config.ts`). **Never hard-code a hex
colour in `src/`** — use a token utility instead.

### 2.1 Surfaces

| Token | HSL | Utility | Notes |
|---|---|---|---|
| `--background` | `45 33% 93%` | `bg-background` | Page background (Ivory) |
| `--foreground` | `160 25% 10%` | `text-foreground` | Primary text on light surfaces |
| `--card` | `45 33% 96%` | `bg-card` | Card surface (Ivory light) |
| `--surface` | `45 30% 97%` | `bg-surface` | Raised surface, near-white warm |
| `--surface-secondary` | `45 20% 90%` | `bg-surface-secondary` | Secondary surface (Forest mist tone) |
| `--surface-elevated` | `0 0% 100%` | `bg-surface-elevated` | Elevated surface, pure white |
| `--secondary` | `45 33% 88%` | `bg-secondary` | Filled soft button, soft panel |
| `--muted` | `45 25% 88%` | `bg-muted` | Muted fill (skeletons, disabled tracks) |
| `--popover` | `45 33% 96%` | `bg-popover` | Popovers, tooltips, dropdowns |
| `--accent` | `45 25% 88%` | `bg-accent` | Hover accent fill |

### 2.2 Text

| Token | HSL | Utility | Notes |
|---|---|---|---|
| `--foreground` | `160 25% 10%` | `text-foreground` | Body/headings — 14.76:1 on background |
| `--muted-foreground` | `160 12% 38%` | `text-muted-foreground` | Secondary text — 4.93:1 on background, 5.21:1 on card (darkened from 42% in Phase 2: it was 4.20:1, below WCAG AA 4.5) |
| `--primary-foreground` | `45 33% 93%` | `text-primary-foreground` | Text on Forest — 10.33:1 on primary |
| `--secondary-foreground` | `160 25% 10%` | `text-secondary-foreground` | Text on secondary fill — 13.40:1 |
| `--card-foreground` | `160 25% 10%` | `text-card-foreground` | Text on cards — 15.62:1 |

### 2.3 Borders & focus

| Token | HSL | Utility | Notes |
|---|---|---|---|
| `--border` | `45 15% 85%` | `border-border` | Default border |
| `--border-subtle` | `45 15% 88%` | `border-border-subtle` | Hairline / card-internal dividers |
| `--input` | `45 15% 85%` | `border-input` | Form-field border |
| `--ring` | `162 44% 17%` | `ring-primary` | Focus ring (30% opacity in components) |

### 2.4 Interactive states

| Token | HSL | Utility | Notes |
|---|---|---|---|
| `--primary` | `162 44% 17%` | `bg-primary` | Primary buttons, links, active states |
| `--primary-hover` | `162 44% 12%` | `bg-primary-hover` | Primary hover (= forest-deep) |
| `--primary-active` | `162 44% 9%` | `bg-primary-active` | Primary pressed |
| `--disabled` | `45 15% 82%` | `bg-disabled` | Disabled control fill |
| `--disabled-foreground` | `160 10% 55%` | `text-disabled-foreground` | Disabled label — 2.09:1 by design (see §9: disabled text is exempt from WCAG contrast; the faint label is what marks the control inactive) |

### 2.5 Semantic status

| Token | HSL | Utility | Notes |
|---|---|---|---|
| `--destructive` / `--error` | `0 60% 50%` | `bg-destructive` / `bg-error` | Errors, danger actions. `error` is an alias of `destructive`, not a second token |
| `--destructive-foreground` | `0 0% 100%` | `text-destructive-foreground` | 5.14:1 on destructive |
| `--success` | `160 50% 30%` | `bg-success` | Success states |
| `--success-foreground` | `0 0% 100%` | `text-success-foreground` | 5.72:1 on success |
| `--warning` | `38 92% 50%` | `bg-warning` | Warnings (amber is a semantic status colour, not a brand accent) |
| `--badge-sale` | `0 62% 46%` | `bg-badge-sale` | Sale badge — 5.84:1 with white text |
| `--badge-sale-foreground` | `0 0% 100%` | `text-badge-sale-foreground` | |
| `--badge-new` | `162 44% 17%` | `bg-badge-new` | New-arrival badge (Forest) |
| `--badge-new-foreground` | `45 33% 93%` | `text-badge-new-foreground` | |

Status colours are **always paired with text** (e.g. "Delivered", "Paid") — never
colour alone. Admin tables use them for status chips.

### 2.6 Sidebar (admin)

| Token | HSL | Notes |
|---|---|---|
| `--sidebar` | `162 44% 13%` | Admin sidebar background (Forest deep) |
| `--sidebar-foreground` | `45 33% 93%` | 12.51:1 on sidebar |
| `--sidebar-accent` | `162 44% 20%` | Active nav item |
| `--sidebar-border` | `162 25% 25%` | Sidebar dividers |

---

## 3. Typography

- **Headings:** Cormorant Garamond — `font-display` (serif). Loaded via Google Fonts
  (`index.html`); falls back to Georgia/serif offline.
- **Body / UI:** DM Sans — `font-body` (sans-serif). Falls back to system sans.

### 3.1 Type scale (Tailwind `fontSize`)

| Utility | Size / line-height / weight | Use |
|---|---|---|
| `text-display-1` | `clamp(2.75rem, 7vw, 4.75rem)` / 1.05 / 600 | Hero H1 only |
| `text-display-2` | `clamp(2rem, 5vw, 3rem)` / 1.1 / 600 | Page H1 (fluid — 48px desktop → 32px mobile) |
| `text-display-3` | 1.875rem / 1.2 / 600 | Section H2 |
| `text-display-4` | 1.5rem / 1.25 / 600 | Card / panel H3 |
| `text-body-lg` | 1.125rem / 1.6 / 400 | Lead paragraphs |
| `text-body` | 1rem / 1.6 / 400 | Body copy |
| `text-small` | 0.875rem / 1.5 / 400 | Secondary copy, form fields |
| `text-caption` | 0.75rem / 1.4 / 400 | Captions, helper text |
| `text-label` | 0.875rem / 1.4 / 600 | Form labels (see `.label`) |
| `text-button` | 0.875rem / 1.5 / 600 | Button labels |
| `text-price` | 1.125rem / 1.4 / 600 | Product price in cards/grids |

**Rules:** headings use sentence case (no excessive uppercase, no wide letter
spacing). Uppercase is reserved for `.eyebrow` (12px, tracking 0.2em) and
`.label`. **No base heading margins** — pages set `mb-*` utilities per layout
(a base margin would shift flex headers such as the cart drawer title).

### 3.2 Editorial helpers

| Class | Use |
|---|---|
| `.eyebrow` | Small uppercase section kicker (12px, tracking 0.2em, primary colour) |
| `.section-title` | `font-display text-display-3` section heading |
| `.text-hero` | Hero display text, `clamp(3.5rem, 8vw, 4.75rem)` |

---

## 4. Spacing, layout, radius, shadows

### 4.1 Spacing scale (Tailwind `spacing`)

| Token | Value | Use |
|---|---|---|
| `space-section` | `clamp(3.5rem, 8vw, 6rem)` | Vertical gap between major sections |
| `space-section-sm` | `clamp(2.5rem, 6vw, 4rem)` | Vertical gap between minor sections |
| `space-card` | `1.5rem` | Card padding (standard) |
| `space-card-sm` | `1rem` | Card padding (compact) |

> `.section` / `.section-sm` utility classes (py-section / py-section-sm) are
> defined for Phase 3 adoption and are **not yet applied to any page** — pages
> keep their existing section padding in Phase 2.

Standard Tailwind spacing (`p-4`, `gap-6`, `mb-8`…) continues unchanged.

### 4.2 Layout

| Token | Value | Use |
|---|---|---|
| `max-w-content` | `80rem` (1280px) | Main content container |
| `max-w-content-narrow` | `64rem` (1024px) | Narrow content (auth, checkout summary) |
| `.container` | `max-w-content` + responsive side padding | The existing container utility (unchanged) |

Breakpoints (Tailwind defaults, unchanged): `sm 640`, `md 768`, `lg 1024`,
`xl 1280`, `2xl 1536`.

### 4.3 Radius

| Token | Value | Use |
|---|---|---|
| `rounded-card` | 6px | Cards, product frames, modals, tooltips |
| `rounded-input` | 4px | Form fields, selects, textareas |
| `rounded-button` | 6px | Buttons |
| `rounded-sm` | 4px (Tailwind default) | Small elements (icon chips, table cells) |
| `rounded-md` | 6px (Tailwind default) | Medium elements |
| `rounded-full` | — | Icon buttons, avatars, pills |

### 4.4 Shadows

| Token | Value | Use |
|---|---|---|
| `shadow-card` | `0 1px 3px rgb(24 61 50 / 0.06), 0 1px 2px rgb(24 61 50 / 0.04)` | Cards, product frames (default) |
| `shadow-elevated` | `0 10px 30px rgb(24 61 50 / 0.12), 0 2px 8px rgb(24 61 50 / 0.08)` | Modals, toasts, hover elevation |

Shadows are subtle and warm-tinted (Forest at low opacity). **No glassmorphism,
no strong shadows.** `shadow-lg` / `shadow-md` are no longer used anywhere in
`src/` — use `shadow-card` / `shadow-elevated`.

---

## 5. Component catalog

All classes live in `@layer components` in `src/index.css`, so a plain Tailwind
utility in the same `className` always wins for a genuine one-off override
(e.g. Search input `min-h-14`, `bg-card`).

### 5.1 Buttons

| Class | Look | Use |
|---|---|---|
| `.btn-primary` | Forest fill, ivory text, h-11 | Main action per screen (Checkout, Add to cart…) |
| `.btn-secondary` | **Filled soft** — `bg-secondary` (ivory-deep), forest text, h-11 | Secondary actions next to primary (View Cart, Track Order, Clear Search, admin Cancel/Back) |
| `.btn-outline` | Transparent, `border-primary/40`, forest text, h-11 | Outline secondary — hero CTA pairs, pagination |
| `.btn-ghost` | Transparent, no border | Tertiary / icon-adjacent actions |
| `.btn-danger` | Destructive fill | Delete / destructive confirmations |
| `.btn-ivory` | Ivory fill, forest text, h-11 | CTAs **on Forest panels** (newsletter submit) |
| `.btn-sm` | h-9 | Small controls (pagination, toolbar) — combine with a variant |
| `.btn-lg` | h-12 | Large hero / checkout CTAs |
| `.btn-loading` | `pointer-events-none opacity-70` | Loading state — caller renders a `Loader2` + `animate-spin` icon |

> **Phase 2 change:** `.btn-secondary` was redefined from outline to filled
> soft; the old outline look moved to `.btn-outline`. Most existing
> `.btn-secondary` call sites keep the filled variant (the visual delta —
> outline → soft ivory-deep fill — is small and on-brand). The Index hero
> "Size Guide" button and admin pagination use `.btn-outline` because those
> contexts need the outline treatment.

All buttons: `inline-flex items-center justify-center gap-2`, `text-button`,
`rounded-button`, visible `:focus-visible` ring, `disabled:` → `bg-disabled` /
`text-disabled-foreground` / `cursor-not-allowed`. Minimum touch target 44px
(h-11) except `.btn-sm` (36px, desktop admin controls).

### 5.2 Form controls

| Class | Use |
|---|---|
| `.input` | Text / email / password / tel / search inputs. `w-full min-h-11 px-4 bg-background border-border rounded-input text-small`, focus `ring-primary/30` |
| `.input-error` | Adds `border-destructive` + `ring-destructive/30` — use with `.input` when a field has an error |
| `.select` | Native `<select>` **with a custom chevron icon** — `appearance-none pr-10 cursor-pointer`. Only use where a chevron is rendered (Shop sort). Selects without a chevron keep `.input` so the native arrow stays visible |
| `.textarea` | Same base as `.input`, `min-h-24 py-3` |
| `.checkbox` / `.radio` | `w-4 h-4 shrink-0 accent-primary` |
| `.label` | `text-label uppercase tracking-wide` — use with `text-muted-foreground` for secondary labels |
| `.helper-text` | `text-caption text-muted-foreground` |
| `.error-text` | `text-caption text-destructive` |

**FormField** (`src/components/ui/FormField.tsx`) is the shared field component —
label (`.label`), input (`.input` + `.input-error`), error (`.error-text`).
Password toggle button stays 20px, `tabIndex={-1}`, inside the input with `pr-11`.

### 5.3 Badges, links, breadcrumbs, cards

| Class | Use |
|---|---|
| `.badge` | Base: uppercase 11px, `rounded-full px-2.5 py-1` |
| `.badge-sale` | Sale / discount badge (red) |
| `.badge-new` | New-arrival badge (Forest) |
| `.badge-flash` | Small `NEW` / `50% OFF` flash badge on product cards |
| `.link` | `text-primary hover:underline` — inline links |
| `.link-subtle` | Muted link, `hover:text-primary` |
| `.breadcrumb` | `flex items-center gap-2 text-xs text-muted-foreground` |
| `.breadcrumb-link` | `hover:text-primary` |
| `.breadcrumb-current` | `text-foreground font-medium` |
| `.card` | `bg-card border border-border rounded-card shadow-card` |
| `.card-elevated` | Same, with `shadow-elevated` — modals, auth cards |
| `.divider` | `border-t border-border` |

### 5.4 Product components

| Class | Use |
|---|---|
| `.product-frame` | `relative aspect-[3/4] overflow-hidden rounded-card bg-muted shadow-card`, hover → `shadow-elevated` |
| `.product-title` | `font-display font-semibold text-base leading-snug hover:text-primary` |
| `.price-compare` | `line-through text-muted-foreground` (combine with a size utility) |
| `.size-btn` | `min-w-11 min-h-11 px-3 border rounded-input text-small`, hover `border-primary/40`; `:disabled` → line-through, muted, `cursor-not-allowed` |
| `.size-btn-active` | `bg-primary text-primary-foreground border-primary` |
| `.chip` | Filter / suggestion chip — `border rounded-full px-4 py-2 text-small`, hover `border-primary/40` |
| `.chip-active` | `bg-primary text-primary-foreground border-primary` |

> The ProductCard "Add to Cart" button is deliberately **not** `.btn-primary` —
> it is a full-width outline button with an inverted hover
> (`hover:bg-foreground hover:text-background`). That is the product-card CTA
> pattern, not an inconsistency.

### 5.5 Feedback & states

| Class | Use |
|---|---|
| `.alert` | Base strip: `flex gap-3 rounded-card border px-4 py-3 text-small` |
| `.alert-info` / `.alert-success` / `.alert-warning` / `.alert-error` | Tinted variants (border + background + icon colour) |
| `.empty-state` | `text-center` wrapper for empty pages (combine with `.card`) |
| `.empty-state-icon` | `w-16 h-16 mx-auto mb-6 rounded-full bg-forest-mist flex items-center justify-center` |
| `.skeleton` | `rounded bg-muted animate-pulse` — loading placeholder block |
| `.icon-btn` | `w-10 h-10 flex items-center justify-center rounded-full text-foreground hover:bg-muted` |
| `.icon-btn-overlay` | `.icon-btn` on a translucent card — `bg-background/80 backdrop-blur-sm shadow-card hover:bg-background` (wishlist / Quick View close) |
| `.icon-circle` | `w-10 h-10 rounded-full bg-forest-mist flex items-center justify-center` (trust badges, detail icons) |

### 5.6 Layout helpers

| Class | Use |
|---|---|
| `.panel-forest` | Forest panel (footer, newsletter, promo) — `bg-primary text-primary-foreground` |
| `.section` / `.section-sm` | `py-section` / `py-section-sm` — **defined, not yet applied** (Phase 3 adoption) |

---

## 6. Storefront vs admin

Both share the foundational tokens above. The admin is a **professional
operational interface**, not a marketing surface:

- Admin sidebar is Forest deep (`--sidebar`); admin content uses the same
  cards, inputs, buttons and tables as the storefront.
- Admin tables: `.card overflow-hidden` wrapper, `divide-y divide-border` rows,
  `text-small` cells, status chips with semantic colours + text.
- Admin pagination: `.btn-outline.btn-sm` Prev/Next.
- Admin search inputs: `.input bg-card pl-9/pl-10` (icon offset kept).
- Admin role/status selects that are **badge-styled status controls** (e.g. the
  user-role select in AdminUsers) are intentionally **not** `.select` — they are
  status controls, not form inputs.
- Admin modals: `.card-elevated`, max-w-md, `max-h-[90vh] overflow-y-auto`.

---

## 7. Accessibility

- **Contrast (computed, WCAG AA 4.5:1 for normal text):**

| Pair | Ratio | Verdict |
|---|---|---|
| foreground / background | 14.76:1 | Pass |
| muted-foreground / background | 4.93:1 | Pass (fixed in Phase 2 — was 4.20:1) |
| muted-foreground / card | 5.21:1 | Pass |
| primary-foreground / primary | 10.33:1 | Pass |
| primary-foreground / primary-hover | 13.07:1 | Pass |
| secondary-foreground / secondary | 13.40:1 | Pass |
| card-foreground / card | 15.62:1 | Pass |
| destructive-foreground / destructive | 5.14:1 | Pass |
| success-foreground / success | 5.72:1 | Pass |
| sidebar-foreground / sidebar | 12.51:1 | Pass |
| badge-sale-foreground / badge-sale | 5.84:1 | Pass |
| primary (link) / background | 10.33:1 | Pass |
| disabled-foreground / disabled | 2.09:1 | **Intentional** — disabled text is exempt from WCAG 1.4.3; the faint label is what marks the control inactive |

- **Focus:** every interactive element has a visible `:focus-visible` ring
  (`outline: 2px solid hsl(var(--ring))`, offset 2px). Never remove it.
- **Touch targets:** 44px minimum for storefront controls (h-11); 36px
  (`.btn-sm`) only for desktop admin controls.
- **Motion:** `prefers-reduced-motion` disables animations/transitions
  (kept from the 8 Nov transformation).
- **Labels:** every form control has a visible label or `aria-label`; errors
  are announced with `.error-text` + `aria-invalid` where the component
  supports it.

---

## 8. Do / Don't

- **Do** use a token utility or a `.class` from §5 for every colour, radius,
  shadow and spacing decision.
- **Do** extend an existing component class instead of duplicating its
  declarations in a page.
- **Do** keep `hsl(var(--…))` token format — never mix HEX tokens into the
  Tailwind config.
- **Don't** introduce a new colour, font or shadow outside this document.
- **Don't** use `shadow-lg` / `shadow-md` — use `shadow-card` / `shadow-elevated`.
- **Don't** add base heading margins — set `mb-*` per layout.
- **Don't** redesign a page while "standardising" it — if a page-level issue
  appears, document it in §10 and fix it in its own phase.
- **Don't** change product data, prices, discounts, delivery wording, API
  contracts, auth or business logic in a design-system change.

---

## 9. Decisions made in Phase 2

1. `.btn-secondary` redefined as **filled soft**; `.btn-outline` carries the
   old outline look. Most call sites keep the filled variant; hero CTA pairs
   and pagination use `.btn-outline`.
2. **No base heading margins** — pages keep per-layout `mb-*` utilities.
3. `error` is an **alias** of `destructive`, not a new token.
4. `.section` / `.section-sm` defined but **not applied** to any page yet.
5. `display-1` / `display-2` are now **fluid via clamp** — page H1s shrink
   from 48px to 32px on mobile (a responsive improvement, not a redesign).
6. `muted-foreground` darkened `42% → 38%` lightness to pass WCAG AA
   (4.20:1 → 4.93:1 on background). Disabled-foreground left at 55% —
   disabled text is WCAG-exempt and must still read as inactive.
7. `--surface-elevated` changed from `45 30% 97%` to pure white `0 0% 100%`
   — the old value was unused anywhere in `src/` (verified by grep) and was
   identical to `--surface`, so it carried no meaning.
8. ProductCard "Add to Cart" keeps its custom inverted-hover outline pattern
   (deliberate product-card CTA, not an inconsistency).
9. Detail-page price (`text-2xl font-body font-bold`) is intentionally larger
   than the card/grid `text-price` (18px).
10. Search input keeps `bg-card` (`.input` is `bg-background`) — the search
    field's exact prior look is preserved via a utility override.
11. Newsletter input on the Forest panel keeps its on-dark variant
    (`bg-ivory-light`) — it is not a standard `.input`.
12. SizeGuide modal keeps its responsive radius (`rounded-t-md sm:rounded-md`
    bottom-sheet on mobile) — `.card-elevated` would round the bottom corners
    on mobile.
13. Admin role select in AdminUsers keeps `.input` (not `.select`) — it has no
    custom chevron, so `.select`'s `appearance-none` would remove the native
    dropdown arrow.
14. `UserDashboard` `btn-ghost border border-border` left as-is (ghost + border
    is a valid combination).

---

## 10. Page-level issues found — for a future phase (NOT fixed in Phase 2)

These were noticed while standardising components. Per the Phase 2 brief they
are documented here, not fixed:

1. **Shop grid last row** — 2 cards in a 4-column grid (acceptable per the
   Phase 1 audit; no fillers invented).
2. **New Arrivals section** — hidden while only 1 arrival exists (Phase 1B
   decision, unchanged).
3. **Hero model photo head-crop** — the source photo itself crops the model's
   head (Phase 1B BLOCKED item; needs a clean original from john).
4. **Low-res photos** — Bear / Burgundy / Mustard / Couple sets have no
   higher-res originals (Phase 1B L-4 BLOCKED; needs originals from john).
5. **Size-guide graphic misspelling** — `size-guide.jpg` has "AL UCCAZ" baked
   into its header (needs a clean graphic from john).
6. **Free-delivery wording conflict** — header/threshold say free above
   Rs 2,999, the banner says "Free Delivery All Pakistan" (open decision D5 —
   see the Phase 2 final report §8 for the full inventory and guidance).
7. **Footer non-functional links** — dimmed in Phase 1B; the About / FAQ /
   Shipping & Returns pages still do not exist.
8. **Newsletter is local-only** — it saves to `localStorage`, no backend
   endpoint yet (needs a real endpoint before launch).
9. **Quick View / size picker / filters / mobile menu / cart drawer** —
   interactive states were not click-tested in Phase 2 (static-render scope,
   same as Phase 1).
10. **Admin / checkout / dashboard** — redirect to `/auth` in the local build
    (no `VITE_API_URL`); their interactive flows were not exercised.

---

## 11. Files

- Tokens: `src/index.css` (`:root` + `@layer components`), `tailwind.config.ts`
- Shared field: `src/components/ui/FormField.tsx`
- Components standardised in Phase 2: `ProductCard`, `QuickView`,
  `CartDrawer`, `ProductDetail`, `Checkout`, `Auth`, `Search`, `Shop`,
  `Category`, `Cart`, `Wishlist`, `Index`, `sonner`, `tooltip`,
  `skeleton-loader`, `SizeGuide` (read — no change needed), all admin pages
  (`AdminDashboard`, `AdminOrders`, `AdminProducts`, `AdminUsers`,
  `AdminRoles`, `AdminAuditLogs`, `AdminPlaceholder`)
- Full change list: see the Phase 2 final report
  (`e-commerce-phase2-final-report.md`), §5.
