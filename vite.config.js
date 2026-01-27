import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: "src/ui",
  build: {
    outDir: "../../dist/ui",
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src/ui/index.html"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000", // proxy backend API
    },
  },
});
