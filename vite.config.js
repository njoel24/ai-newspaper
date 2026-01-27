import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "src/ui",
  plugins: [react()],
  build: {
    outDir: "../../dist/ui",
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src/ui/index.html"),
      external: ["/components/article-ui/stencil/ai-newspaper.esm.js"],
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000", // proxy backend API
    },
  },
});
