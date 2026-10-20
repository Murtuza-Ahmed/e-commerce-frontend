import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore, isStaff, isSuperAdmin } from "@/store/auth";
import { ProductGridSkeleton } from "@/components/ui/skeleton-loader";

/** Login zaroori — warna /auth par bhejo */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="container py-12">
        <ProductGridSkeleton count={4} />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}

/** Admin ya super_admin zaroori */
export function StaffRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="container py-12">
        <ProductGridSkeleton count={4} />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!isStaff(user)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/** Sirf super_admin */
export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="container py-12">
        <ProductGridSkeleton count={4} />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!isSuperAdmin(user)) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}
