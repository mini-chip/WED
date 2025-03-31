import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: "#183153",
        yellow: "#ffd401"
      },
      fontFamily: {
        "open-sans": ["Open Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"]
      },
      animation: {
        scaleUp: "scaleUp 0.3s ease-in-out"
      },
      keyframes: {
        scaleUp: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" }
        }
      },
      transitionDuration: {
        400: "400ms"
      },
      borderRadius: {
        "10px": "10px"
      }
    }
  },
  plugins: []
};
export default config;
