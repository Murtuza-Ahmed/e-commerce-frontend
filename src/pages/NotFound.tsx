import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SEO } from "@/components/SEO";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <SEO title="Page Not Found" />
      <div className="text-center max-w-md">
        <p className="text-8xl font-display font-bold text-primary/20 mb-4">404</p>
        <h1 className="text-2xl font-display font-bold mb-3">Page not found</h1>
        <p className="text-sm font-body text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
