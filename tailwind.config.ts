import type { Config } from "tailwindcss"

// Tokens follow the Elevante v2 design system (see the design canvas).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Georgia", '"Noto Naskh Arabic"', "serif"],
      },
      colors: {
        navy: "#1D3557",
        steel: "#457B9D",
        aqua: "#A8DADC",
        mint: "#F1FAEE",
        ice: "#E6F0FA",
        danger: { DEFAULT: "#E63946", text: "#B42330", bg: "#FDECEE" },
        success: { text: "#166534", bg: "#D1FADF" },
        warn: { text: "#7A5600", bg: "#FEF9C3" },
        muted: "#52627A",
        line: "#DCEBEC",
      },
      backgroundImage: {
        "brand-btn": "linear-gradient(to left, #457B9D, #1D3557)",
        "brand-panel": "linear-gradient(135deg, #457B9D, #1D3557)",
        "brand-auth": "linear-gradient(135deg, #F1FAEE, #A8DADC 55%, #457B9D)",
        "brand-tile": "linear-gradient(to left, #F1FAEE, rgba(168,218,220,.30))",
      },
      boxShadow: {
        card: "0 10px 15px -3px rgba(29,53,87,.08), 0 4px 6px -4px rgba(29,53,87,.06)",
        float: "0 25px 50px -12px rgba(29,53,87,.30)",
        btn: "0 4px 12px -2px rgba(29,53,87,.30)",
      },
      keyframes: {
        "float-sym": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-26px) rotate(18deg)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "float-sym": "float-sym 7s ease-in-out infinite",
        "fade-up": "fade-up .8s ease-out both",
      },
    },
  },
  plugins: [],
}

export default config
