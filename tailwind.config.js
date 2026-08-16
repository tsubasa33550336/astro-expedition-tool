/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          bg: "#0B0E1A",
          panel: "#121729",
          panelAlt: "#1A2238",
          border: "#28304A",
        },
        ink: {
          DEFAULT: "#E9E7DD",
          muted: "#8B93A8",
        },
        gold: {
          DEFAULT: "#E8A33D",
          dim: "#8A6A38",
        },
        danger: "#C1443C",
        ok: "#5B9279",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans JP'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
