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
        // Palette chaleureuse
        cream: "#f4f1de",
        terracotta: "#e07a5f",
        navy: "#3d405b",
        sage: "#81b29a",
        gold: "#f2cc8f",

        // Semantic colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#e07a5f",
          light: "#e89580",
          dark: "#d35f44",
        },
        secondary: {
          DEFAULT: "#81b29a",
          light: "#9bc4af",
          dark: "#6a9e85",
        },
        accent: {
          DEFAULT: "#f2cc8f",
          light: "#f5d7a5",
          dark: "#efc179",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      borderRadius: {
        sm: "0.375rem", // 6px (au lieu de 8px)
        DEFAULT: "0.5rem", // 8px (au lieu de 12px)
        md: "0.5rem", // 8px
        lg: "0.75rem", // 12px (au lieu de 16px)
        xl: "1rem", // 16px (au lieu de 24px)
        "2xl": "1.25rem", // 20px (au lieu de full pour les boutons)
      },
    },
  },
  plugins: [],
};

export default config;
