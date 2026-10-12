import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0E1A33", dark: "#081021", light: "#1B2C52" },
        champagne: {
          DEFAULT: "#B89B5E",
          hover: "#9F8246",
          light: "#C5A869",
          soft: "#FAF6EE",
          muted: "#F5EDE0",
          border: "#E8DCBF",
        },
        whatsapp: { DEFAULT: "#25D366", hover: "#20BA59", dark: "#128C7E" },
        canvas: { DEFAULT: "#FAF9F6", alt: "#F4F2EC", card: "#FFFFFF", border: "#EAE6DD", warm: "#FBF9F5" },
      },
      fontFamily: { sans: ["var(--font-jakarta)", "system-ui", "sans-serif"] },
      borderRadius: { "2xl": "1.25rem", "3xl": "1.75rem" },
      boxShadow: {
        gold: "0 8px 24px -4px rgba(184, 155, 94, 0.35)",
        wa: "0 8px 24px -4px rgba(37, 211, 102, 0.38)",
        luxury: "0 12px 32px -8px rgba(14, 26, 51, 0.08), 0 4px 12px -2px rgba(184, 155, 94, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
