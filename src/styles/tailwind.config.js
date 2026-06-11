/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ecoflow: {
          // Primary Green
          green: {
            light: "#D1FAE5", 
            DEFAULT: "#10B981", 
            dark: "#059669", 
            darker: "#047857",
          },
          // Secondary Orange
          orange: {
            light: "#FED7AA", 
            DEFAULT: "#F97316", 
            dark: "#EA580C", 
            darker: "#C2410C", 
          },
          // Neutral Gray
          gray: {
            50: "#F9FAFB", 
            100: "#F3F4F6", 
            200: "#E5E7EB", 
            300: "#D1D5DB", 
            400: "#9CA3AF", 
            500: "#6B7280", 
            600: "#4B5563", 
            700: "#374151", 
            900: "#111827", 
          },
          // Semantic
          error: {
            light: "#FEE2E2",
            DEFAULT: "#EF4444",
            dark: "#DC2626",
          },
          info: {
            light: "#DBEAFE",
            DEFAULT: "#3B82F6",
            dark: "#2563EB",
          },
        },
      },

      // ─── Typography ─────────────────────────────────────────────────────
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      fontSize: {
        // Heading scale (from brand guidelines)
        h1: ["2rem", { lineHeight: "1.2", fontWeight: "700" }], // 32px
        h2: ["1.75rem", { lineHeight: "1.3", fontWeight: "700" }], // 28px
        h3: ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }], // 24px
        h4: ["1.25rem", { lineHeight: "1.5", fontWeight: "600" }], // 20px
        h5: ["1.125rem", { lineHeight: "1.5", fontWeight: "600" }], // 18px
        h6: ["1rem", { lineHeight: "1.5", fontWeight: "600" }], // 16px
        // Body scale
        "body-lg": ["1rem", { lineHeight: "1.5", fontWeight: "400" }], // 16px
        body: ["0.875rem", { lineHeight: "1.6", fontWeight: "400" }], // 14px
        "body-sm": ["0.75rem", { lineHeight: "1.5", fontWeight: "400" }], // 12px
        caption: ["0.6875rem", { lineHeight: "1.4", fontWeight: "400" }], // 11px
      },

      // ─── Spacing (8px grid) ──────────────────────────────────────────────
      spacing: {
        0.5: "4px",
        1: "8px",
        1.5: "12px",
        2: "16px",
        2.5: "20px",
        3: "24px",
        4: "32px",
        5: "40px",
        6: "48px",
        8: "64px",
        10: "80px",
        12: "96px",
      },

      // ─── Border Radius ───────────────────────────────────────────────────
      borderRadius: {
        none: "0",
        sm: "4px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },

      // ─── Box Shadow ──────────────────────────────────────────────────────
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.10)",
        DEFAULT: "0 2px 6px rgba(0,0,0,0.10)",
        md: "0 4px 6px rgba(0,0,0,0.10)",
        lg: "0 10px 15px rgba(0,0,0,0.10)",
        // Brand-tinted shadows
        "green-sm": "0 2px 8px rgba(16,185,129,0.20)",
        "green-md": "0 4px 14px rgba(16,185,129,0.25)",
        "orange-sm": "0 2px 8px rgba(249,115,22,0.20)",
      },

      // ─── Height / Width helpers ──────────────────────────────────────────
      height: {
        navbar: "64px",
        "navbar-mobile": "56px",
        "btn-sm": "32px",
        "btn-md": "40px",
        "btn-lg": "48px",
        input: "40px",
        sidebar: "calc(100vh - 64px)",
      },
      width: {
        sidebar: "256px",
        "sidebar-collapsed": "72px",
      },

      // ─── Transitions ─────────────────────────────────────────────────────
      transitionDuration: {
        fast: "150ms",
        DEFAULT: "300ms",
        slow: "500ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
      },

      // ─── Animation ───────────────────────────────────────────────────────
      keyframes: {
        "spin-smooth": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-green": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(16,185,129,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(16,185,129,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "spin-smooth": "spin-smooth 0.9s linear infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.35s ease-out",
        "pulse-green": "pulse-green 1.8s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite linear",
      },

      // ─── Screen Breakpoints ──────────────────────────────────────────────
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
