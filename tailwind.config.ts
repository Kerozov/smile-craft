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
        "bg-white": "#FFFFFF",
        "bg-cream": "#F7F4EF",
        "beige-primary": "#B8956A",
        "beige-deep": "#9A7B55",
        "beige-pale": "#EDE8E0",
        "text-dark": "#3D3632",
        "text-muted": "#7A6F68",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px rgba(61, 54, 50, 0.06)",
        card: "0 8px 32px rgba(61, 54, 50, 0.08)",
        "card-hover": "0 16px 48px rgba(61, 54, 50, 0.12)",
        header: "0 2px 20px rgba(61, 54, 50, 0.08)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
