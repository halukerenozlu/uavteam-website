// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        club: {
          black: "#000000",
          red: "#E10600",
          white: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};

export default config;
