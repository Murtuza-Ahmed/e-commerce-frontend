Al-ucaaz PRERENDERING (SEO) - 2026-10-08

INSTRUCTIONS:
1. Pehle wali SEO zip (e-commerce-seo-fixes.zip) lagi honi chahiye, phir is zip ko repo ROOT me "Extract Here" karo aur "Yes to All" dabao.
2. npm install (koi nayi dependency nahi, phir bhi ek bar kar lena)
3. npm run build

KYA HOTA HAI:
- npm run build ab 3 step chalata hai: client build -> SSR bundle -> prerender
- dist/ me har page ka static HTML banta hai (27 pages: home, shop, search, cart, wishlist, auth, checkout, 4 categories, 16 products)
- Crawlers ko bina JS ke poora content + sahi title/meta/canonical/JSON-LD milta hai
- Browser me site pehle jaisi hi SPA ki tarah chalti hai

NOTE: dist/ deploy karo (Netlify/Vercel waghera par). Agar host par "SPA fallback / rewrite" laga ho to /admin jaise routes bhi kaam karenge.
