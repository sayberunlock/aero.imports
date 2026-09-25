import type { Config } from "tailwindcss";

/**
 * Design tokens — Aero Imports
 * -----------------------------------------------------------------------
 * Paleta e escala tipográfica exclusivas. Ver docs/DESIGN_SYSTEM.md
 * para a justificativa de cada escolha.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0F14", // grafite-noturno, não é preto puro
          soft: "#141A22",
        },
        aero: {
          DEFAULT: "#0E3A5F", // azul premium principal
          50: "#EAF1F7",
          100: "#CFDFEC",
          300: "#7FA5C4",
          500: "#2C6C9E",
          700: "#0E3A5F",
          900: "#071F33",
        },
        signal: {
          DEFAULT: "#2C7BE0", // azul metálico de destaque (CTAs)
          400: "#4C93EE",
          600: "#1F63C4",
        },
        steel: {
          DEFAULT: "#7C8B9A", // texto secundário / linhas metálicas
          light: "#B7C2CC",
        },
        fog: "#EEF1F4",
        cloud: "#FFFFFF",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 7vw, 7rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.75rem)", { lineHeight: "1.08", letterSpacing: "-0.01em" }],
      },
      maxWidth: {
        content: "1440px",
      },
      transitionTimingFunction: {
        aero: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      boxShadow: {
        elevate: "0 24px 60px -20px rgba(11, 15, 20, 0.35)",
        card: "0 12px 30px -12px rgba(11, 15, 20, 0.18)",
      },
      keyframes: {
        traceLine: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
