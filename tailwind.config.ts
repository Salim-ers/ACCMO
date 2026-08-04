import type { Config } from "tailwindcss";

// =============================================================
// Design system ESSALAM — « Le centre vivant de la communauté »
// Identité : bleu nuit minéral + sable lumineux, accent terre cuite.
// Grille éditoriale, filets 1px, angles courts. Aucun vert islamique.
// =============================================================

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bleu nuit → bleu ciel brumeux : couleur d'identité principale.
        night: {
          950: "#0a1220",
          900: "#101b2d",
          800: "#16263d",
          700: "#1d3350",
          600: "#294865",
          500: "#3a5f80",
          400: "#5b819f",
          300: "#8caac1",
          200: "#b9cedd",
          100: "#dceaf0",
          50: "#eff6f9",
        },
        // Terre cuite : accent ponctuel, jamais dominant.
        terra: {
          700: "#8e4930",
          600: "#a85940",
          500: "#c66f4e",
          400: "#d68a6d",
          300: "#e4ac95",
          200: "#f0cdbe",
          100: "#f8e6de",
        },
        // Sable lumineux + blanc cassé : surfaces accueillantes.
        sand: {
          500: "#d9c6a5",
          400: "#e4d5bc",
          300: "#ebdfcb",
          200: "#f1e7d6",
          100: "#f6f0e5",
          50: "#faf8f3",
        },
        graphite: "#202326",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "10px",
        lg: "18px",
        xl: "18px",
      },
      maxWidth: {
        shell: "1280px",
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      boxShadow: {
        // Ombres nettes et courtes (pas de halos flous).
        edge: "0 1px 0 0 rgba(16,27,45,.08)",
        panel: "0 18px 44px -28px rgba(16,27,45,.45)",
      },
      keyframes: {
        "rise-in": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "beacon": {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: ".35", transform: "scale(.72)" },
        },
        "rail-sweep": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
      },
      animation: {
        "rise-in": "rise-in .6s cubic-bezier(.2,.7,.3,1) both",
        beacon: "beacon 2.4s ease-in-out infinite",
        "rail-sweep": "rail-sweep 1.1s cubic-bezier(.2,.7,.3,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
