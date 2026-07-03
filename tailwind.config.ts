import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "var(--bg)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        border: "var(--border)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        accent: {
          DEFAULT: "#7C5CFF",
          hover: "#9075FF",
          soft: "#7C5CFF1A",
        },
        amber: {
          DEFAULT: "#FFB74D",
          soft: "#FFB74D1A",
        },
        live: "#43E6A0",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        rise: {
          "0%": { transform: "scaleY(0.15)", opacity: "0.4" },
          "100%": { transform: "scaleY(1)", opacity: "1" },
        },
        floatY: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        rise: "rise 0.6s cubic-bezier(.2,.8,.2,1) forwards",
        floatY: "floatY 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
