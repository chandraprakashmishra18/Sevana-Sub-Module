import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(moduleDirectory, "../..");
const appRoot = path.join(workspaceRoot, "sevana-platform");
const deps = (name) => path.join(moduleDirectory, "node_modules", name);

export default defineConfig({
  root: appRoot,
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^react$/, replacement: deps("react") },
      { find: /^react\/(.+)$/, replacement: `${deps("react")}/$1` },
      { find: /^react-dom$/, replacement: deps("react-dom") },
      { find: /^react-dom\/client$/, replacement: path.join(deps("react-dom"), "client.js") },
      { find: /^react-router-dom$/, replacement: deps("react-router-dom") },
    ],
    dedupe: ["react", "react-dom", "react-router-dom"],
  },
  server: { host: "0.0.0.0", port: 5173, strictPort: true, fs: { allow: [searchForWorkspaceRoot(moduleDirectory), workspaceRoot] } },
  preview: { host: "0.0.0.0", port: 4173 },
});
