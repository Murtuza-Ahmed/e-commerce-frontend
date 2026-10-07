Al-ucaaz: Vercel Analytics + Speed Insights + backend-ready API layer + README (2026-10-08)

INSTRUCTIONS:
1. Repo ROOT me "Extract Here" karo aur "Yes to All" dabao.
2. npm install (nayi packages: @vercel/analytics, @vercel/speed-insights)
3. npm run build

KYA ADD HUA:
- src/App.tsx: <Analytics /> aur <SpeedInsights /> components (Vercel deploy par auto-active)
- vercel.json: clean URLs config
- .env.example: VITE_SITE_URL / VITE_API_URL / VITE_USE_API
- src/lib/api-client.ts: typed fetch wrapper (timeout, ApiError, Bearer token)
- src/api/catalog.ts + src/api/auth.ts: NestJS endpoints ke liye tayyar, abhi local data fallback
- src/hooks/use-catalog.ts: react-query hooks (backend lagne par pages me use honge)
- src/test/api-client.test.ts: 6 tests
- README.md: proper setup guide + backend roadmap

NOTE: Analytics/Speed Insights ka data sirf Vercel par deploy hone ke baad dashboard me dikhega.
Backend abhi nahi bana — jab banayenge to VITE_USE_API=true karke connect kar denge.
