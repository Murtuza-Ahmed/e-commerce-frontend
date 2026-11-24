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
    <div className="flex min-h-[70vh] items-center justify-center bg-background p-8">
      <SEO title="Page Not Found" />
      <div className="text-center max-w-md">
        <p className="eyebrow mb-4">Al-ucaaz</p>
        <p className="text-8xl font-display font-bold text-primary/20 mb-4">404</p>
        <h1 className="font-display font-semibold text-display-3 mb-3">Page not found</h1>
        <p className="text-sm font-body text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="btn-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            to="/shop"
            className="btn-secondary"
          >
            Browse the Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
