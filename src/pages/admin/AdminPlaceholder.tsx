import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";
import { SEO } from "@/components/SEO";

const TITLES: Record<string, string> = {
  "/admin/customers": "Customers",
  "/admin/coupons": "Coupons",
  "/admin/cms": "CMS",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
};

/**
 * Temporary placeholder for admin sections that are not built yet,
 * so the sidebar links don't land on a 404 page.
 */
const AdminPlaceholder = () => {
  const location = useLocation();
  const title = TITLES[location.pathname] ?? "Admin";

  return (
    <div>
      <SEO title={`Admin - ${title}`} />
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold">{title}</h1>
        <p className="text-sm font-body text-muted-foreground mt-1">Manage {title.toLowerCase()} for your store.</p>
      </div>
      <div className="bg-card border border-border rounded-sm p-12 text-center max-w-lg mx-auto">
        <Construction className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-lg font-display font-bold mb-2">Coming Soon</h2>
        <p className="text-sm font-body text-muted-foreground">
          The {title} section is under construction. Check back later.
        </p>
      </div>
    </div>
  );
};

export default AdminPlaceholder;
