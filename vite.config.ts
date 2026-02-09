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
      "import.meta.env.VITE_BACKEND_URL": JSON.stringify(
        env.VITE_BACKEND_URL || "",
      ),
    },
  };
});
