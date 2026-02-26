import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, _password: string) => {
        // Dummy login
        set({
          user: {
            id: "1",
            name: email.split("@")[0],
            email,
            role: email.includes("admin") ? "admin" : "customer",
          },
          isAuthenticated: true,
        });
      },
      register: (name: string, email: string, _password: string) => {
        set({
          user: { id: Date.now().toString(), name, email, role: "customer" },
          isAuthenticated: true,
        });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "al-ucaaz-auth" }
  )
);
