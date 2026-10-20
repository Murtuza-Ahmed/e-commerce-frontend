/**
 * Auth store — backend (NestJS) se real authentication.
 *
 * - accessToken sirf memory me (15 min expiry, api-client auto-refresh karta hai)
 * - refreshToken localStorage me persisted (7 din)
 * - App boot par agar refreshToken ho to session restore hoti hai
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { configureApiClient } from "@/lib/api-client";
import * as authApi from "@/api/auth";
import { getMe } from "@/api/users";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  /** login → tokens save */
  login: (email: string, password: string) => Promise<void>;
  /** signup → sirf account banta hai, OTP verify ke baad login */
  signup: (name: string, email: string, password: string) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Boot par session restore */
  initialize: () => Promise<void>;
  /** api-client ke liye: 401 par token renew */
  refreshAccessToken: () => Promise<string | null>;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

let refreshInFlight: Promise<string | null> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: false,

      login: async (email, password) => {
        const res = await authApi.login({ email, password });
        set({
          user: res.user,
          accessToken: res.accessToken,
          isAuthenticated: true,
          isInitialized: true,
        });
        persistRefreshToken(res.refreshToken);
      },

      signup: async (name, email, password) => {
        await authApi.signup({ name, email, password });
        // tokens nahi milte — verify-email ke baad login hoga
      },

      verifyEmail: async (email, otp) => {
        const res = await authApi.verifyEmail({ email, otp });
        set({
          user: res.user,
          accessToken: res.accessToken,
          isAuthenticated: true,
          isInitialized: true,
        });
        persistRefreshToken(res.refreshToken);
      },

      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          get().clearAuth();
        }
      },

      initialize: async () => {
        const rt = loadRefreshToken();
        if (!rt) {
          set({ isInitialized: true });
          return;
        }
        try {
          const res = await authApi.refresh(rt);
          // pehle token set karo taake getMe() isi se call ho
          set({ accessToken: res.accessToken, isAuthenticated: true });
          let user = res.user;
          try {
            user = await getMe();
          } catch {
            /* fallback: refresh wala user */
          }
          set({ user, isInitialized: true });
          persistRefreshToken(res.refreshToken);
        } catch {
          clearRefreshToken();
          set({ user: null, accessToken: null, isAuthenticated: false, isInitialized: true });
        }
      },

      refreshAccessToken: async () => {
        if (refreshInFlight) return refreshInFlight;
        refreshInFlight = (async () => {
          const rt = loadRefreshToken();
          if (!rt) return null;
          try {
            const res = await authApi.refresh(rt);
            set({ accessToken: res.accessToken, user: res.user, isAuthenticated: true });
            persistRefreshToken(res.refreshToken);
            return res.accessToken;
          } catch {
            return null;
          } finally {
            refreshInFlight = null;
          }
        })();
        return refreshInFlight;
      },

      setUser: (user) => set({ user }),

      clearAuth: () => {
        clearRefreshToken();
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "al-ucaaz-auth",
      // Sirf user persist karo — tokens alag handle hote hain
      partialize: (s) => ({ user: s.user }) as AuthState,
    }
  )
);

// ---------- refresh token storage (localStorage, user ke hath me) ----------

const RT_KEY = "al-ucaaz-refresh-token";

function persistRefreshToken(t: string): void {
  try {
    localStorage.setItem(RT_KEY, t);
  } catch {
    /* storage unavailable */
  }
}

function loadRefreshToken(): string | null {
  try {
    return localStorage.getItem(RT_KEY);
  } catch {
    return null;
  }
}

function clearRefreshToken(): void {
  try {
    localStorage.removeItem(RT_KEY);
  } catch {
    /* ignore */
  }
}

// api-client ko hooks do — ek dafa, module load par
configureApiClient({
  getAccessToken: () => useAuthStore.getState().accessToken,
  refreshAccessToken: () => useAuthStore.getState().refreshAccessToken(),
  onAuthExpired: () => useAuthStore.getState().clearAuth(),
});

// ---------- role helpers ----------

export function isStaff(user: User | null): boolean {
  return user?.role === "admin" || user?.role === "super_admin";
}

export function isSuperAdmin(user: User | null): boolean {
  return user?.role === "super_admin";
}
