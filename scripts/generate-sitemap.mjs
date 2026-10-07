/**
 * Generates public/sitemap.xml from the static product/category data.
 * Runs automatically before every build (see package.json "prebuild").
 *
 * Set SITE_URL below (or via the SITE_URL env var) to your real domain
 * before deploying, e.g. SITE_URL=https://myshop.com npm run build
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = (process.env.SITE_URL || "https://al-ucaaz.com").replace(/\/$/, "");

const src = readFileSync(path.join(__dirname, "../src/data/products.ts"), "utf8");

function slugsBetween(startMarker, endMarker) {
  const section = src.split(startMarker)[1]?.split(endMarker)[0] ?? "";
  return [...section.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

const categorySlugs = slugsBetween("export const categories", "export const products");
const productSlugs = slugsBetween("export const products", "export const dummyOrders");

const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/shop", priority: "0.9", changefreq: "daily" },
  { loc: "/search", priority: "0.5", changefreq: "weekly" },
  ...categorySlugs.map((s) => ({ loc: `/category/${s}`, priority: "0.8", changefreq: "weekly" })),
  ...productSlugs.map((s) => ({ loc: `/product/${s}`, priority: "0.7", changefreq: "weekly" })),
];

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url>\n    <loc>${SITE_URL}${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join("\n") +
  `\n</urlset>\n`;

mkdirSync(path.join(__dirname, "../public"), { recursive: true });
writeFileSync(path.join(__dirname, "../public/sitemap.xml"), xml);
console.log(`sitemap.xml generated: ${urls.length} URLs (${SITE_URL})`);
