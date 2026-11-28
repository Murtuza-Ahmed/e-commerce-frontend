import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
      },
      // Type scale — Design System (Forest & Ivory). Hero H1 56–76px desktop
      // (38–46px mobile via .text-hero), page H1 48px, section H2 32px,
      // H3 24px, body 16px / 400, body large 18px / 400, small 14px / 500,
      // label 14px / 600, caption 12px / 400, button 14px / 600,
      // price 18px / 700. display-1/2 are fluid (clamp) so page headings
      // scale down on mobile instead of staying 48–76px.
      fontSize: {
        "display-1": ["clamp(2.75rem, 7vw, 4.75rem)", { lineHeight: "1.05", fontWeight: "600" }],
        "display-2": ["clamp(2rem, 5vw, 3rem)", { lineHeight: "1.1", fontWeight: "600" }],
        "display-3": ["2rem", { lineHeight: "1.2", fontWeight: "600" }],
        "display-4": ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["0.875rem", { lineHeight: "1.5", fontWeight: "500" }],
        label: ["0.875rem", { lineHeight: "1.4", fontWeight: "600" }],
        caption: ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],
        button: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "600" }],
        price: ["1.125rem", { lineHeight: "1.5rem", fontWeight: "700" }],
      },
      // Shadows — Design System (Forest & Ivory). Soft, restrained,
      // forest-tinted instead of heavy black. Three levels only:
      // card (default surfaces), elevated (modals, drawers, toasts),
      // hero (hero image). No ad-hoc shadow-lg / shadow-md anywhere.
      boxShadow: {
        card: "0 1px 2px rgba(24, 61, 50, 0.06), 0 1px 3px rgba(24, 61, 50, 0.04)",
        elevated: "0 12px 32px rgba(24, 61, 50, 0.12)",
        hero: "0 24px 48px rgba(24, 61, 50, 0.16)",
      },
      // Spacing — semantic section/card spacing (Phase 2 tokens).
      // py-section / py-section-sm for page sections (adopted in Phase 3
      // page work; pages are NOT re-spaced in this phase), p-card for
      // card padding, gap-section for section grids.
      spacing: {
        section: "clamp(3.5rem, 8vw, 6rem)",
        "section-sm": "clamp(2.5rem, 6vw, 4rem)",
        card: "1.5rem",
        "card-sm": "1rem",
      },
      // Layout — named content widths. The container (centered, 1rem
      // padding, max 1400px at 2xl) is the default page container.
      maxWidth: {
        content: "80rem",
        "content-narrow": "64rem",
      },
      colors: {
        border: {
          DEFAULT: "hsl(var(--border))",
          subtle: "hsl(var(--border-subtle))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Surface layers — semantic names for the same ivory scale.
        // surface = default card surface, secondary = muted panels,
        // elevated = white, for modals/dropdowns floating over ivory.
        surface: {
          DEFAULT: "hsl(var(--surface))",
          secondary: "hsl(var(--surface-secondary))",
          elevated: "hsl(var(--surface-elevated))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          active: "hsl(var(--primary-active))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        // error is the semantic alias of destructive (same values, no
        // duplicated token) — use text-error / bg-error where the intent
        // is an error state rather than a destructive action.
        error: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        // Disabled state — never rely on opacity alone; the token gives
        // disabled controls a consistent fill + text colour.
        disabled: {
          DEFAULT: "hsl(var(--disabled))",
          foreground: "hsl(var(--disabled-foreground))",
        },
        // Badges — sale (red) and new (forest); foregrounds are the
        // matching text colours. See .badge-* in index.css.
        badge: {
          sale: "hsl(var(--badge-sale))",
          "sale-foreground": "hsl(var(--badge-sale-foreground))",
          new: "hsl(var(--badge-new))",
          "new-foreground": "hsl(var(--badge-new-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Brand colors — Forest #183D32, Ivory #F3F0E7.
        forest: {
          DEFAULT: "hsl(var(--forest))",
          deep: "hsl(var(--forest-deep))",
          soft: "hsl(var(--forest-soft))",
          mist: "hsl(var(--forest-mist))",
        },
        ivory: {
          DEFAULT: "hsl(var(--ivory))",
          light: "hsl(var(--ivory-light))",
          deep: "hsl(var(--ivory-deep))",
        },
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "12px",
        xl: "16px",
        // Semantic radii — card and button are both 6px, input 4px.
        // rounded-card is the standard radius for cards, modals and
        // product frames; rounded-input for form controls; rounded-button
        // for buttons. Do not invent other radii per component.
        card: "6px",
        input: "4px",
        button: "6px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
