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
        "bg-dark": "#14120F",
        "bg-light": "#FAF7F1",
        "accent-gold": "#C9A15C",
        "accent-mint": "#7FA99B",
        "text-dark": "#1C1A17",
        "text-light": "#F5F1EA",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      spacing: {
        section: "120px",
      },
      boxShadow: {
        card: "0 8px 32px rgba(0, 0, 0, 0.24)",
        "card-hover": "0 16px 48px rgba(0, 0, 0, 0.32)",
        glow: "0 0 24px rgba(201, 161, 92, 0.4)",
      },
      transitionDuration: {
        card: "200ms",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
