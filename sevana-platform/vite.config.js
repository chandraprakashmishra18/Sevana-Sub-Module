import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import process from "node:process";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const proxy = !env.VITE_API_URL || env.VITE_API_URL.startsWith("/")
    ? { "/api": "http://localhost:5000" }
    : {};
  return {
    plugins: [react()],
    server: { host: "0.0.0.0", port: 5173, strictPort: true, proxy },
    preview: { host: "0.0.0.0", port: 4173 },
  };
});
