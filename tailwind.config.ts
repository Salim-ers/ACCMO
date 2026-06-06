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
          950: "#081710",
        },
        sand: {
          50: "#fbf8f2",
          100: "#f5eee0",
          200: "#ecdfc7",
          300: "#dfc9a3",
          400: "#cfae78",
        },
        gold: {
          200: "#f0dca8",
          300: "#e4c878",
          400: "#d4af56",
          500: "#c69a3c",
          600: "#a87e2a",
        },
        // Crème chaud, identité « beige » de la mosquée.
        cream: {
          50: "#fdfaf3",
          100: "#f7f0e1",
          200: "#efe2c8",
        },
        ink: "#14201b",
      },
      backgroundImage: {
        "grain-fade":
          "linear-gradient(180deg, rgba(15,43,33,0) 0%, rgba(15,43,33,.85) 100%)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        heading: ["var(--font-heading)", "var(--font-display)", "sans-serif"],
        mega: ["var(--font-mega)", "var(--font-heading)", "sans-serif"],
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
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "float-slow": {
          "0%,100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-22px) translateX(10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(.9)", opacity: "0.7" },
          "70%,100%": { transform: "scale(1.7)", opacity: "0" },
        },
        kenburns: {
          "0%": { transform: "scale(1) translateY(0)" },
          "100%": { transform: "scale(1.12) translateY(-2%)" },
        },
        "gradient-pan": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "bob-down": {
          "0%,100%": { transform: "translateY(0)", opacity: "0.6" },
          "50%": { transform: "translateY(8px)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.16,1,.3,1) both",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(.16,1,.3,1) infinite",
        kenburns: "kenburns 22s ease-out alternate infinite",
        "gradient-pan": "gradient-pan 12s ease infinite",
        "bob-down": "bob-down 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
