import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Special-Edu-Ai/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },

  define: {
    "import.meta.env.VITE_GEMINI_API_KEY": JSON.stringify(
      process.env.NODE_ENV === "production"
        ? ""
        : process.env.VITE_GEMINI_API_KEY || "",
    ),
  },
});
