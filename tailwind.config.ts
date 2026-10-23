import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#0b331c",
        },
        brand: {
          forest: "#113527",     // Deep forest green
          forestLight: "#184534",
          emerald: "#059669",    // Emerald green
          emeraldDark: "#047857",
          lime: "#84CC16",       // Accent lime
          limeSoft: "#D9F99D",   // Soft lime
          sand: "#FBFBF7",       // Warm off-white
          sandDark: "#F3F3EB",
          charcoal: "#1F2937",   // Slate/charcoal text
          slate: "#475569",
        },
      },
      borderRadius: {
        lg: "var(--radius, 0.75rem)",
        md: "calc(var(--radius, 0.75rem) - 2px)",
        sm: "calc(var(--radius, 0.75rem) - 4px)",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(16, 24, 40, 0.05), 0 1px 2px 0 rgba(16, 24, 40, 0.03)",
        card: "0 4px 20px -2px rgba(17, 53, 39, 0.06), 0 2px 6px -1px rgba(17, 53, 39, 0.04)",
        elevated: "0 12px 32px -4px rgba(17, 53, 39, 0.12), 0 4px 12px -2px rgba(17, 53, 39, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
