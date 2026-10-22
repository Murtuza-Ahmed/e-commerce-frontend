import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

/** Login se pehle cart me add karne ki koshish — login ke baad Auth page ise pura karta hai. */
export interface PendingCartItem {
  slug: string;
  variantId: string;
  quantity: number;
}

/**
 * Login-first actions (cart add / purchase) ke liye gate.
 * User logged-in ho to true; guest ho to /auth par bhejta hai —
 * login ke baad user `from` wale page par wapas aata hai, aur
 * pendingCart diya ho to wo item khud cart me add ho jata hai.
 */
export function useRequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (pendingCart?: PendingCartItem): boolean => {
    if (isAuthenticated) return true;
    navigate("/auth", {
      state: {
        from: location.pathname,
        ...(pendingCart ? { pendingCart } : {}),
      },
    });
    return false;
  };

  return { isAuthenticated, requireAuth };
}
