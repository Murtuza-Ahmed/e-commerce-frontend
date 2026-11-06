# Al-ucaaz Night Suits — UI/UX Review (2026-11-06)

Done at john's request: on 2026-11-05 21:50 PKT he said the night-suit
version is better than the first design but "kafi kam baqi he UI/UX par",
and Muse offered to do this review instead of making him list everything.
Reviewed in code (not a visual browser check — the 3D hero still needs
john to open the home page and look at it).

Tick the items he wants fixed; un-ticked items stay as they are.
Nothing here was pushed or deployed.

## Phase 0.3 — Design System + 3D removal (2026-11-07)

john asked to start the Design System work and to remove the 3D hero (he
said the 3D was not that special). Done in the working copy, build verified
(`npm run build` green, 19 routes prerendered; `npx tsc -b` green):
- **Dark + Gold is now the single theme.** `src/index.css` `:root` holds the
  dark tokens; the `.dark` block and the light tokens are gone (the site
  rendered light by default while dark was defined but never activated — no
  `dark` class anywhere). Light tokens restorable from git history if john
  ever prefers light. Theme NOT explicitly confirmed by john — Dark + Gold
  is the default because he liked the dark night-suit version better.
- **Button system:** `.btn-primary` (gold), `.btn-secondary` (gold outline),
  `.btn-ghost`, `.btn-danger` in `src/index.css` — 15px/600, radius 6px.
  Primary CTAs on home, shop, product, cart, checkout, auth, wishlist,
  dashboard, error page now use them. Small admin buttons and selection
  chips keep their inverted light style (readable, utilitarian).
- **3D hero removed.** `src/components/night-suit/FabricHero.tsx` deleted;
  `three` + `@types/three` removed from `package.json` + lockfile
  (`npm install` removed 8 packages). No file in `dist/assets` contains
  "three"; home HTML has 0 matches. The "3D hero needs a visual check"
  caveat below is now moot — but the NEW static hero still needs john to
  open the home page and look at it.
- **Static photo hero:** Charcoal Starry Dream Set photo (1207×1600,
  the signature set, highest-res portrait model shot) beside the headline,
  with a "Shop Now" caption chip linking to the product. Headline/copy/
  marquee unchanged. Happy Sunflower was NOT used as the hero photo
  because it already appears 3 times on the home page.
- **Tailwind config:** type scale (display-1/2/3, body, small, caption,
  button, price), shadows (card/elevated/hero), radii (sm 4, md 6, lg 12,
  xl 16) added per the engineering plan's Design System sheet.

## A. Bugs / things that look broken — fix first

- [x] **Hero word "Luxury" has no gold shimmer — FIXED 2026-11-06.**
      `src/pages/Index.tsx:62` used `text-gold-shimmer`, but no such class
      exists: `src/index.css` only defines `.gold-shimmer` (a background
      gradient). Now `gold-shimmer bg-clip-text text-transparent`, so the
      gradient shows through the word. Build verified 2026-11-06
      (`npm run build` green, prerendered 19 routes; the class is present
      in `dist/index.html`). Still needs john's visual check in a browser.
- [x] **Quick View is invisible on mobile — FIXED 2026-11-06.**
      `src/components/product/ProductCard.tsx` showed the Quick View button
      only on `group-hover:opacity-100` (`opacity-0` otherwise). Now
      `opacity-100 md:opacity-0 md:group-hover:opacity-100`: always visible
      on phones, hover-reveal only on desktop. Build verified 2026-11-06
      (same build as above). Still needs john's check on a real phone.
- [ ] **Free-delivery wording contradicts itself.** Header top bar
      (`src/components/layout/Header.tsx`) says free delivery only on orders
      over Rs 2,999 (`FREE_SHIPPING_THRESHOLD`, `src/constants/index.ts:3`),
      but the marquee, the Happy Sunflower banner and the promo tile all say
      "Free Delivery All Pakistan" with no condition — and only the Happy set
      has `freeDelivery: true` in the data. A shopper buying one Rs 2,499 set
      will expect free delivery and be charged Rs 199 at checkout.
      Needs john's decision: is delivery free for all, or only over Rs 2,999?
- [x] **Newsletter form does nothing — FIXED 2026-11-06.**
      `src/pages/Index.tsx` — submit was `preventDefault()` only. Now it
      validates the email, saves it to localStorage (`alucaaz-newsletter`)
      and shows a "You're on the list" confirmation. Local-only until a
      backend exists — nothing is sent anywhere; wire a real endpoint
      before launch. Build verified 2026-11-06 (prerendered 19 routes).
- [x] **Footer links are dead — PARTLY FIXED 2026-11-06: Size Guide linked.**
      `src/components/layout/Footer.tsx` — About Us, Sustainability,
      Careers, Press, Shipping & Returns, Size Guide, Contact Us, FAQ,
      Privacy Policy, Terms are plain `<span>` text, not links.
      Shoppers looking for delivery/returns info hit a dead end. Fix: link
      Size Guide to the real guide, add (or drop) the rest.

## B. Home page — repetition and first impression

- [ ] **Happy Sunflower appears 3 times on the home page** — Collections
      promo tile, the big 50% OFF banner, and New Arrivals (it is the only
      product with `isNew: true`, `src/data/products.ts:247`). One strong
      feature is good; three identical photos on one scroll feels like a
      filler. Fix: keep the banner, drop it from Collections or New Arrivals,
      or mark 2–3 more sets as new.
- [ ] **"Featured Night Suits" is not curated** — it is just
      `products.slice(0, 4)` (`src/pages/Index.tsx:16`): Couple, Bear,
      Burgundy, Mustard, in data-file order. Fix: pick the 4 best sellers /
      best photos deliberately (e.g. Satin, Starry Dream, Faith Navy, Happy).
- [x] **No night suit is visible above the fold — FIXED 2026-11-07 (Phase 0.3).**
      The hero was only the abstract gold-fabric 3D wave (`FabricHero.tsx`) —
      beautiful, but a first-time visitor saw no product at all until they
      scrolled. The 3D hero was removed at john's request and replaced with
      a static photo hero: the Charcoal Starry Dream Set photo beside the
      headline. Still needs john's visual check in a browser.
- [ ] **Hero stats repeat the marquee.** "10 Signature Sets / S–XXL /
      50% OFF" sits right above a marquee saying the same offers. Fine to
      keep one, drop the duplication if space is tight on mobile.

## C. Product cards — the part shoppers actually use

- [x] **No Add to Cart and no sizes on the card — FIXED 2026-11-06.**
      A shopper must open Quick View or the product page for every single
      item. Fix: add a quick-add button (default size M, or size picker on
      tap) — this is the single biggest conversion item on the list.
      Done as a size picker on tap: "Add to Cart" on the card opens S–XXL,
      tapping a size adds it (same login gate + toast as Quick View).
      Build verified 2026-11-06 (button present in prerendered home page).
- [ ] **Colour swatches do nothing — DEAD CODE REMOVED 2026-11-06, no live fix needed.**
      `ProductCard.tsx` renders the variant colours as plain `<span>` dots
      — not buttons, no label, no click. Checked 2026-11-06: no product
      sets `colorHex` anywhere in `src/data/products.ts`, so the block
      never rendered at all. Removed the dead block; if colour variants
      are added to the data later, the card will need real swatch buttons.
- [x] **Badge pile-up on the Happy set — FIXED 2026-11-06.** It stacks three
      badges top-left (New + −50% + Free Delivery) covering a corner of the
      photo. Fix: keep at most two, or move Free Delivery to the price row.
      Done: photo keeps at most New + −50%; "Free delivery" now sits in
      the price row. Build verified 2026-11-06.
- [x] **Every product shows "No reviews yet" / 0 stars — FIXED 2026-11-06.**
      (all products have `rating: 0, reviewCount: 0`). Ten empty ratings
      read as an empty shop. Fix: hide the rating row entirely until real
      reviews exist. Done in `ProductDetail.tsx` (row renders only when
      `reviewCount > 0`); verified 2026-11-06 — "No reviews yet" no longer
      appears in the prerendered product pages.
- [ ] **Photo quality is uneven.** Measured sizes in
      `public/assets/night-suits/`: Bear 364×549, Burgundy 334×598, Mustard
      479×640 and Couple 379×527 are low-resolution (WhatsApp-compressed);
      the rest are 900–1600px. In the 3:4 card crop the low-res ones will
      look soft, and worse on the product-detail page. Fix: ask john for the
      original (non-WhatsApp) photos for those 4 sets; do not upscale.
- [ ] **Landscape photos get cropped hard in cards.** Faith Navy, Black Line
      Art and the detail shots are 1599×1066 landscape, forced into a 3:4
      portrait crop with `object-cover` — `imagesFit` is only honoured on the
      product-detail page (`ProductDetail.tsx:98`), ignored in the card and
      Quick View. Fix: honour `imagesFit` (or `imageFocus`) in the card too,
      or re-crop those images to portrait.

## D. Shopper trust — needs john's answers, not code

- [ ] **Real prices** — all Rs 2,499–3,499 are placeholders he authorised
      ("koi bhi add kardo", 2026-11-05); see the price table in
      `NIGHTSUIT_REVIEW.md`. Nothing should go live with these.
- [ ] **Fabric/fit details missing for 7 of 10 sets** — only Starry Dream,
      Faith Navy and Black Line Art have fabric details from their photos.
      The rest show no fabric claim. Needs john's fabric info per set.
- [ ] **Couple-set sizes** — the size guide is women's only (S–XXL); the
      Wifey & Hubby set was assumed S–XXL too. Needs his confirmation (men's
      sizes differ).
- [ ] **Stock** — 10 per size everywhere is a placeholder.
- [ ] **COD / payment / returns info** — checkout exists, but the home page
      never says Cash on Delivery, exchange policy, or delivery time. One
      short trust strip (COD • 7-day exchange • 2–4 day delivery — only if
      true) would help; needs john to confirm each claim.

## Suggested order (if he wants a sequence)

1. A-items (bugs + delivery wording) — these mislead shoppers.
2. Quick-add on cards + hero product photo — biggest visible win.
3. Happy-set repetition + Featured curation — one pass over `Index.tsx`.
4. D-items — his answers, then code follows.

## What was checked

- Read `src/pages/Index.tsx`, `ProductCard.tsx`, `QuickView.tsx`,
  `Header.tsx`, `Footer.tsx`, `FabricHero.tsx`, `index.css`,
  `tailwind.config.ts`, `src/data/products.ts`, `src/constants/index.ts`.
- Measured all 14 images in `public/assets/night-suits/`.
- Not verified: visual look of the NEW static photo hero in a browser,
  mobile-menu positioning, checkout/COD flow end-to-end. Those still need
  john (or a browser check) to open the site. The old 3D-hero caveat is
  moot — the 3D hero was removed 2026-11-07.
