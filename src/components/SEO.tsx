import { Helmet } from "react-helmet-async";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/constants";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "product";
  schema?: Record<string, unknown>;
}

const DEFAULT_DESC = "Premium curated fashion — luxury clothing, accessories & footwear for the modern connoisseur.";

export function SEO({ title, description = DEFAULT_DESC, image, url, type = "website", schema }: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Premium Fashion`;
  // Har page ko automatic canonical + og:url milta hai (duplicate-content se bachao).
  // SSR/prerender me window nahi hota, wahan prerender-entry path set karta hai.
  const pagePath =
    typeof window !== "undefined"
      ? window.location.pathname
      : (globalThis as { __PRERENDER_PATH__?: string }).__PRERENDER_PATH__ ?? "/";
  const canonicalUrl = url ?? `${SITE_URL}${pagePath}`;
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <link rel="canonical" href={canonicalUrl} />
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
