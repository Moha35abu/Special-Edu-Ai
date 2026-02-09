import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/Special-Edu-Ai/",
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },

    define: {
      "import.meta.env.VITE_GEMINI_API_KEY": JSON.stringify(
        mode === "production" ? "" : env.VITE_GEMINI_API_KEY || "",
      ),
    },
  };
});
