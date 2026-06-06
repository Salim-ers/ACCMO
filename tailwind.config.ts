import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette sobre et chaleureuse : vert émeraude profond, sable, or doux.
        emerald: {
          50: "#f0f7f3",
          100: "#d9ebe1",
          200: "#b3d7c4",
          300: "#7fbb9d",
          400: "#4d9a76",
          500: "#2f7d5a",
          600: "#1f6347",
          700: "#1a4f3a",
          800: "#163f30",
          900: "#0f2b21",
        },
        sand: {
          50: "#fbf8f2",
          100: "#f5eee0",
          200: "#ecdfc7",
          300: "#dfc9a3",
          400: "#cfae78",
        },
        gold: {
          400: "#d4af56",
          500: "#c69a3c",
          600: "#a87e2a",
        },
        ink: "#14201b",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(20,32,27,.04), 0 8px 30px rgba(20,32,27,.06)",
        lift: "0 10px 40px rgba(20,32,27,.12)",
      },
      borderRadius: {
        arch: "50% 50% 12px 12px / 30% 30% 12px 12px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.16,1,.3,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
