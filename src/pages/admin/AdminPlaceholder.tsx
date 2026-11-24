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
        <p className="eyebrow mb-2">Admin</p>
        <h1 className="font-display font-semibold text-display-3 md:text-display-2">{title}</h1>
        <p className="text-small font-body text-muted-foreground mt-2">Manage {title.toLowerCase()} for your store.</p>
      </div>
      <div className="bg-card border border-border rounded-sm shadow-card p-12 text-center max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-sm bg-forest-mist flex items-center justify-center mx-auto mb-5">
          <Construction className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-display font-semibold text-display-4 mb-2">Coming soon</h2>
        <p className="text-small font-body text-muted-foreground">
          The {title} section is under construction. Check back later.
        </p>
      </div>
    </div>
  );
};

export default AdminPlaceholder;
