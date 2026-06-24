import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fo: {
          "green-900": "var(--fo-green-900)",
          "green-600": "var(--fo-green-600)",
          "green-500": "var(--fo-green-500)",
          "lime-500": "var(--fo-lime-500)",
          "lime-300": "var(--fo-lime-300)",
          "sage-100": "var(--fo-sage-100)",
          "cream-50": "var(--fo-cream-50)",
          "earth-700": "var(--fo-earth-700)",
          "charcoal-900": "var(--fo-charcoal-900)",
          white: "var(--fo-white)",
          success: "var(--fo-success)",
          warning: "var(--fo-warning)",
          error: "var(--fo-error)",
          info: "var(--fo-info)",
          whatsapp: "var(--fo-whatsapp)",
          line: "var(--fo-line)",
          muted: "var(--fo-muted)",
          accent: "var(--fo-accent)",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "system-ui", "sans-serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        control: "12px",
        card: "18px",
        hero: "28px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 8px 30px rgba(31, 42, 34, 0.08)",
        soft: "0 4px 16px rgba(31, 42, 34, 0.06)",
      },
      maxWidth: {
        content: "1280px",
        editorial: "760px",
      },
      spacing: {
        // 4px base scale aligned to brand spacing tokens
        "18": "72px",
        "22": "88px",
      },
    },
  },
  plugins: [],
};

export default config;
