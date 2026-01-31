import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  root: "src/ui",
  plugins: [
    react(),
  ],
  build: {
    outDir: "../../dist/ui",
    emptyOutDir: false,
    sourcemap: true,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, "src/ui/index.html"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000", // proxy backend API
    }
  },
});
