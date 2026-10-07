Al-ucaaz SEO fixes (2026-10-05)

INSTRUCTIONS:
1. Is zip ko apne repo ke ROOT folder me "Extract Here" karo aur "Yes to All" dabao.
2. Zaroori: jab site ka real domain final ho to in 3 jagah "https://al-ucaaz.com" ko apne domain se replace karna:
   - src/constants/index.ts (SITE_URL)
   - index.html (og:url, og:image, twitter:image)
   - public/robots.txt (Sitemap line)
   Ya build time par SITE_URL env var de do: SITE_URL=https://myshop.com npm run build
3. public/og-image.jpg me apni 1200x630 brand cover image rakho (WhatsApp/Facebook share preview ke liye).

CHANGES:
- public/sitemap.xml (NEW, auto-generated): 23 URLs - har build se pehle scripts/generate-sitemap.mjs khud update karta hai
- scripts/generate-sitemap.mjs (NEW): sitemap generator
- package.json: "prebuild" script add (build se pehle sitemap banta hai)
- public/robots.txt: Sitemap directive add
- index.html: lovable.dev/@Lovable branding hatayi, apni domain lagayi
- src/constants/index.ts: SITE_URL + DEFAULT_OG_IMAGE add
- src/components/SEO.tsx: har page par automatic canonical URL + og:url + default brand image
- src/pages/Category.tsx, Index.tsx: schema me window.location ki jagah SITE_URL

NOTE: Ye site abhi bhi client-side rendered (React SPA) hai - Google to JS chala ke parh lega,
lekin best SEO ke liye aagay chal kar prerendering/SSR lagana parega. Wo ek alag bara kaam hai.
