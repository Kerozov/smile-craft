import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Светла премиум палитра: слонова кост, перла, шампанско злато
        ivory: "#FBF8F3",
        pearl: "#FFFFFF",
        cream: "#F5EFE6",
        sand: "#EDE3D4",
        blush: "#F4DCD4",
        ink: "#2A2421",
        "ink-soft": "#5C524B",
        "ink-muted": "#8A7F77",
        gold: "#B8956A",
        "gold-deep": "#8F6F48",
        "gold-light": "#E3CBA6",

        // стари имена — оставени за съвместимост
        "bg-white": "#FFFFFF",
        "bg-cream": "#F5EFE6",
        "beige-primary": "#B8956A",
        "beige-deep": "#8F6F48",
        "beige-pale": "#EDE3D4",
        "text-dark": "#2A2421",
        "text-muted": "#8A7F77",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(42,36,33,0.04), 0 8px 24px -8px rgba(42,36,33,0.08)",
        card: "0 1px 2px rgba(42,36,33,0.04), 0 24px 48px -16px rgba(42,36,33,0.12)",
        "card-hover": "0 2px 4px rgba(42,36,33,0.04), 0 40px 80px -24px rgba(143,111,72,0.28)",
        header: "0 1px 0 rgba(42,36,33,0.06), 0 12px 32px -12px rgba(42,36,33,0.1)",
        glow: "0 0 80px 10px rgba(227,203,166,0.45)",
        "inner-light": "inset 0 1px 0 rgba(255,255,255,0.9)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(-15%)" },
          "50%": { transform: "translateY(15%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 50%" },
          "100%": { backgroundPosition: "-200% 50%" },
        },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
        "marquee-fast": "marquee 30s linear infinite",
        "bounce-slow": "bounce-slow 2.2s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
