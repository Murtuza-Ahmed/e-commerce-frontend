# Al-ucaaz — E-commerce Frontend

Premium fashion storefront for **Al-ucaaz** — product browsing, cart, wishlist, checkout flow, customer dashboard and an admin panel. Built with React + Vite, SEO-prerendered at build time, and structured so a NestJS + PostgreSQL backend can plug in later.

## Tech Stack

- **React 18** + **TypeScript** + **Vite 5**
- **Tailwind CSS** + shadcn-style UI components, **Framer Motion**
- **React Router 6** (code-split routes), **Zustand** (cart / wishlist / auth stores), **TanStack Query**
- **react-helmet-async** (SEO meta + JSON-LD), **Zod** (form validation), **Sonner** (toasts)
- **Vercel Analytics** + **Speed Insights**
- Build-time **prerendering** (27 static pages) + auto-generated `sitemap.xml`

## Quick Start

```bash
npm install
cp .env.example .env.local   # apni values bharo
npm run dev                  # http://localhost:8080
```

## Scripts

| Command              | Kya karta hai |
|----------------------|---------------|
| `npm run dev`        | Dev server (HMR) |
| `npm run build`      | Client build → SSR bundle → **prerender** (27 static HTML pages in `dist/`) |
| `npm run lint`       | ESLint |
| `npm run test`       | Vitest (single run) |
| `npm run test:watch` | Vitest watch mode |
| `npm run preview`    | Production build ko locally serve karke dekho |

## Environment Variables

`.env.example` dekho. Important ones:

| Variable         | Example | Matlab |
|------------------|---------|--------|
| `VITE_SITE_URL`  | `https://al-ucaaz.com` | Canonical URLs, sitemap, OG tags |
| `VITE_API_URL`   | `http://localhost:3000/api` | NestJS backend ka base URL |
| `VITE_USE_API`   | `false` | `true` karo jab backend ready ho |

> `.env.local` git-ignored hai — secrets kabhi commit mat karo.

## Project Structure

```
src/
├── api/            # Backend-ready API layer (catalog, auth) — local fallback ke saath
├── components/     # UI: layout, product, ui/* (shadcn-style)
├── data/           # Static catalog data (backend aane tak)
├── hooks/          # use-catalog (react-query hooks, backend ke liye tayyar)
├── lib/            # api-client (typed fetch wrapper), format, validators, utils
├── pages/          # Routes: Index, Shop, ProductDetail, Cart, Checkout, ...
├── pages/admin/    # Admin panel
├── store/          # Zustand stores (cart, wishlist, auth, ui)
├── test/           # Vitest tests
└── prerender-entry.tsx  # Sirf build-time prerendering ke liye (client ko touch nahi karta)

scripts/
├── generate-sitemap.mjs  # prebuild: sitemap.xml banata hai
└── prerender.mjs         # build: har route ka static HTML banata hai
```

## Deployment (Vercel)

1. Repo Vercel me import karo — framework preset **Vite** khud detect ho jayega.
2. Build command default `npm run build` hi rehne do (prerender included hai).
3. Environment variables add karo: `VITE_SITE_URL`, aur backend ke baad `VITE_API_URL` / `VITE_USE_API`.
4. Deploy karo — `dist/` serve hoga, prerendered pages (`/shop`, `/product/...`) static milengi.
5. **Analytics** aur **Speed Insights** Vercel dashboard me automatically dikhne lagenge (code me components already lage hain).

## Backend Roadmap (NestJS + PostgreSQL)

Frontend already tayyar hai — `src/lib/api-client.ts` typed client hai, `src/api/*` me endpoint functions hain jo abhi local data deti hain. Backend ban jaye to:

1. NestJS me ye endpoints banao: `GET /products`, `GET /products/:slug`, `GET /categories`, `GET /categories/:slug`, `GET /orders`, `POST /auth/login`, `POST /auth/register`, `GET /auth/me`, `POST /auth/logout`
2. `.env.local` me `VITE_API_URL` + `VITE_USE_API=true` set karo
3. Pages me `src/data/products` imports ki jagah `src/hooks/use-catalog` hooks lagao
4. `store/auth.ts` ko `src/api/auth.ts` ke token flow se connect karo

Types (`src/types/index.ts`) backend DTOs se match karte hain — IDs strings hain (UUID-ready), prices numbers hain.

## License

MIT
