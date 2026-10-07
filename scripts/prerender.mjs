/**
 * Build-time prerendering: har public route ka static HTML banata hai.
 * Crawlers/social scrapers ko bina JS chalaye poora content + meta tags miltay hain.
 *
 * Flow:  vite build (client)  →  vite build --ssr (ye entry)  →  node scripts/prerender.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
const distSsr = path.join(root, "dist-ssr");

// --- Route list (sitemap generator wali parsing) ---
const src = readFileSync(path.join(root, "src/data/products.ts"), "utf8");
function slugsBetween(startMarker, endMarker) {
  const section = src.split(startMarker)[1]?.split(endMarker)[0] ?? "";
  return [...section.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}
const categorySlugs = slugsBetween("export const categories", "export const products");
const productSlugs = slugsBetween("export const products", "export const dummyOrders");

const routes = [
  "/",
  "/shop",
  "/search",
  "/cart",
  "/wishlist",
  "/auth",
  "/checkout",
  ...categorySlugs.map((s) => `/category/${s}`),
  ...productSlugs.map((s) => `/product/${s}`),
];

// --- SSR bundle load ---
const bundlePath = path.join(distSsr, "prerender-entry.js");
if (!existsSync(bundlePath)) {
  console.error(`SSR bundle nahi mila: ${bundlePath}\nPehle "npm run build:ssr" chalao.`);
  process.exit(1);
}
const { renderRoute } = await import(bundlePath);

// --- Template (client build ka index.html) ---
const templatePath = path.join(dist, "index.html");
let template = readFileSync(templatePath, "utf8");
const headMatch = template.match(/<head>([\s\S]*?)<\/head>/);
if (!headMatch) {
  console.error("dist/index.html me <head> nahi mila.");
  process.exit(1);
}

// Static head me se title + SEO meta hatao (helmet wale lagayenge),
// charset/viewport rehne do.
const cleanHead = headMatch[1]
  .replace(/<title>[\s\S]*?<\/title>/, "")
  .replace(
    /<meta\s+(?:name|property)="(?:description|author|theme-color|og:[^"]*|twitter:[^"]*)"[^>]*\/?>/g,
    ""
  )
  .trim();

let done = 0;
for (const route of routes) {
  try {
    const { html, helmet } = renderRoute(route);
    const helmetHead = [helmet.title, helmet.meta, helmet.link, helmet.script]
      .filter(Boolean)
      .join("\n");

    let page = template.replace(
      /<head>[\s\S]*?<\/head>/,
      `<head>\n${cleanHead}\n${helmetHead}\n</head>`
    );
    page = page.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

    const outPath =
      route === "/"
        ? path.join(dist, "index.html")
        : path.join(dist, route, "index.html");
    mkdirSync(path.dirname(outPath), { recursive: true });
    writeFileSync(outPath, page);
    done++;
  } catch (err) {
    console.error(`Prerender failed for ${route}:`, err.message);
    process.exit(1);
  }
}

// SSR bundle ab kaam ka nahi — safai
rmSync(distSsr, { recursive: true, force: true });
console.log(`Prerendered ${done} routes → dist/`);
