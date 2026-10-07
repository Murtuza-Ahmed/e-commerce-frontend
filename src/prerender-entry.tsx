/**
 * SSR entry point — sirf build-time prerendering ke liye.
 * Client app (main.tsx) ko touch nahi karta.
 *
 * Static imports is liye hain taake renderToString me poora HTML bane
 * (React.lazy + renderToString sirf fallback render karta).
 * Toasters client-only hain, is liye yahan skip kiye gaye hain.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Layout } from "@/components/layout/Layout";

import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Search from "./pages/Search";
import Category from "./pages/Category";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export interface RenderedRoute {
  html: string;
  helmet: {
    title: string;
    meta: string;
    link: string;
    script: string;
  };
}

export function renderRoute(url: string): RenderedRoute {
  const helmetContext: Record<string, unknown> = {};
  // SEO component canonical/og:url ke liye SSR me path yahan se parhta hai
  (globalThis as { __PRERENDER_PATH__?: string }).__PRERENDER_PATH__ = url;

  const html = renderToString(
    <ErrorBoundary>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <StaticRouter location={url}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/category/:slug" element={<Category />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/search" element={<Search />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </StaticRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );

  const helmet = helmetContext.helmet as {
    title: { toString(): string };
    meta: { toString(): string };
    link: { toString(): string };
    script: { toString(): string };
  };

  return {
    html,
    helmet: {
      title: helmet.title.toString(),
      meta: helmet.meta.toString(),
      link: helmet.link.toString(),
      script: helmet.script.toString(),
    },
  };
}
